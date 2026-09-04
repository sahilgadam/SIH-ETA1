import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, Gauge, Ticket } from 'lucide-react'
import { useLanguage } from '../context/LanguageProvider'
import { useNetwork } from '../context/NetworkProvider'
import { useSelection } from '../context/SelectionProvider'
import { etaFactors } from '../lib/etaFactors'
import { formatClock, formatDuration, minutesUntil } from '../lib/railSim'
import { delayNarrative, journeyStats, passengerSummary } from '../lib/trainInsights'
import { AskRailSense } from '../components/assistant/AskRailSense'
import { EtaFactors } from '../components/live/EtaFactors'
import { JourneyBookmark } from '../components/live/JourneyBookmark'
import { ConnectionPlanner } from '../components/stations/ConnectionPlanner'
import { Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Mono } from '../components/ui/Mono'
import { SourceBadge } from '../components/ui/SourceBadge'

const RailMap = lazy(() =>
  import('../components/map/RailMap').then((m) => ({ default: m.RailMap })),
)

/**
 * The canonical train record — written for the passenger, not the controller.
 *
 * READING ORDER
 *
 * The page runs in the order a passenger actually asks questions, and the
 * markup follows that order top to bottom:
 *
 *   1  status      what train this is and how it is running
 *   2  next stop    station, expected arrival, time remaining, delay
 *   3  journey      progress on the left, every remaining call on the right
 *   4  map          the same journey, drawn on the network
 *   5  connection   whether the onward train will still be there
 *   6  why          the named conditions behind the predicted arrival
 *   7  recovery     what the delay has done and what it will do
 *   8  confidence   how much slack to leave around that arrival
 *   9  secondary    operational detail, folded away, and the assistant
 *
 * The map sits *under* the journey, not over it. A map is the obvious hero for
 * a train page and the wrong one: it answers "where is it" and none of the
 * questions a passenger holding a ticket is actually asking. Opening on the
 * next stop and the station timings puts the figures someone is standing on a
 * platform for above the fold — and the map immediately after them, while the
 * route they name is still in mind, rather than exiled to the foot of the page.
 *
 * Every figure is read from one `railSim` train state — the same object the
 * map and Live Status render (§17) — on the one simulation clock. Nothing on
 * this page computes railway logic of its own.
 */

const STATUS_TONE = {
  'on-time': { text: 'text-brand-text', chip: 'border-brand bg-brand-soft text-brand-text' },
  watch: { text: 'text-caution', chip: 'border-caution bg-caution-soft text-caution' },
  delayed: { text: 'text-caution', chip: 'border-caution bg-caution-soft text-caution' },
  critical: { text: 'text-danger', chip: 'border-danger bg-danger-soft text-danger' },
}

function Section({ title, lead, children, className = '' }) {
  return (
    <section className={`scroll-mt-24 ${className}`}>
      {title ? <h2 className="font-display text-xl font-medium text-fg sm:text-2xl">{title}</h2> : null}
      {lead ? <p className="mt-1.5 max-w-prose text-sm leading-6 text-fg-muted">{lead}</p> : null}
      <div className={title || lead ? 'mt-4' : ''}>{children}</div>
    </section>
  )
}

/** Progressive disclosure for the operational material (§14). */
function Disclosure({ title, count, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
      >
        <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg">
          {title}
          {count ? <span className="ml-2 font-normal text-fg-muted">{count}</span> : null}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-fg-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open ? <div className="pb-5">{children}</div> : null}
    </div>
  )
}

/** Booked against predicted, with a plain status word rather than decoration. */
function StationTimings({ train }) {
  const { t } = useLanguage()
  const stateLabel = {
    past: t('detail.stDeparted'),
    current: t('detail.stHere'),
    next: t('detail.stNext'),
    upcoming: t('detail.stUpcoming'),
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-line-strong">
            {[
              t('detail.colStation'),
              t('detail.colScheduled'),
              t('detail.colPredicted'),
              t('detail.colStatus'),
              t('detail.colVariance'),
            ].map((head) => (
              <th
                key={head}
                scope="col"
                className="pb-2 pr-4 font-mono text-[0.5625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-muted"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {train.timeline.map((stop) => {
            const past = stop.state === 'past'
            const booked = stop.bookedArrMin ?? stop.bookedDepMin
            const predicted = stop.predictedArrMin ?? stop.predictedDepMin
            return (
              <tr
                key={stop.code}
                className={stop.state === 'next' ? 'bg-brand-soft/40' : undefined}
              >
                <th scope="row" className="py-2.5 pr-4 font-normal">
                  <Mono className={`text-xs ${past ? 'text-fg-muted' : 'font-bold text-fg'}`}>
                    {stop.code}
                  </Mono>
                  <span className="ml-2 text-[0.6875rem] text-fg-muted">{stop.name}</span>
                </th>
                <td className="py-2.5 pr-4 font-mono text-xs tabular-nums text-fg-muted">
                  {formatClock(booked)}
                </td>
                <td
                  className={`py-2.5 pr-4 font-mono text-xs tabular-nums ${past ? 'text-fg-muted' : 'font-semibold text-fg'}`}
                >
                  {formatClock(predicted)}
                </td>
                <td className="py-2.5 pr-4 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                  {stateLabel[stop.state]}
                </td>
                <td
                  className={`py-2.5 font-mono text-xs font-semibold tabular-nums ${
                    stop.delayMin > 0 ? 'text-caution' : 'text-brand-text'
                  }`}
                >
                  {stop.delayMin > 0 ? `+${stop.delayMin}` : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/**
 * How much slack to leave around the predicted arrival.
 *
 * This is a *presentation* of numbers the engine has already produced, not a
 * second forecast: how much of the run is still ahead, and how far the chain
 * still expects the arrival to move between here and the terminus. A long way
 * to go with a swinging forecast is a loose band; a short run holding steady
 * is a tight one. No prediction is recomputed.
 */
function etaConfidence(train) {
  const remaining = train.timeline.filter(
    (stop) => stop.state === 'upcoming' || stop.state === 'next',
  ).length
  const swing = Math.abs(Math.round(train.destinationDelay - train.delayMin))
  const margin = Math.max(2, swing + Math.ceil(remaining / 2))
  const level = margin <= 4 ? 'high' : margin <= 10 ? 'medium' : 'low'
  return { level, margin, remaining, swing }
}

const CONFIDENCE_TONE = {
  high: 'border-brand bg-brand-soft text-brand-text',
  medium: 'border-caution bg-caution-soft text-caution',
  low: 'border-danger bg-danger-soft text-danger',
}

export function TrainDetail({ trainNumber, onBack }) {
  const { t } = useLanguage()
  const { trains, minutes } = useNetwork()
  const { selectTrain, highlightedStop } = useSelection()

  const connectionRef = useRef(null)
  // Focus is moved a beat after the scroll starts; the handle is kept so
  // leaving the page cannot leave a timer running against a dead node.
  const focusTimerRef = useRef(0)
  const train = trains.find((item) => item.number === trainNumber) ?? null

  useEffect(() => {
    if (trainNumber) selectTrain(trainNumber)
  }, [trainNumber, selectTrain])

  useEffect(() => () => window.clearTimeout(focusTimerRef.current), [])

  const stats = useMemo(() => (train ? journeyStats(train, minutes) : null), [train, minutes])
  const delay = useMemo(() => (train ? delayNarrative(train) : null), [train])
  // Recomputed from the same simulation snapshot as everything else on the
  // page, so the factors and the arrival time they explain move together.
  const breakdown = useMemo(() => (train ? etaFactors(train, minutes) : null), [train, minutes])
  const confidence = useMemo(() => (train ? etaConfidence(train) : null), [train])
  const summary = useMemo(
    () => (train && stats ? passengerSummary(train, stats, formatClock, formatDuration) : []),
    [train, stats],
  )

  // "I'm travelling" brings the connection check into view and puts the cursor
  // in it, rather than only scrolling somewhere near it.
  const goToConnection = useCallback(() => {
    const node = connectionRef.current
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.clearTimeout(focusTimerRef.current)
    focusTimerRef.current = window.setTimeout(() => node.querySelector('select')?.focus(), 420)
  }, [])

  if (!train) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6">
        <p className="text-sm font-semibold text-fg">{t('journey.missingTitle')}</p>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-fg-muted">{t('journey.missingBody')}</p>
        <Button variant="secondary" onClick={onBack} className="mt-5">
          {t('journey.back')}
        </Button>
      </div>
    )
  }

  const moving = train.phase !== 'dwell' && train.phase !== 'origin' && train.phase !== 'arrived'
  const nextIn = minutesUntil(train.nextStationEtaMin, minutes)
  const endIn = minutesUntil(train.etaMinutes, minutes)
  const tone = STATUS_TONE[train.status] ?? STATUS_TONE['on-time']

  // What to call the next stop depends on what the train is doing (§11).
  const nextStopHeadline = !moving
    ? `${t('detail.atStation')} ${train.atStation?.name ?? train.prevStation.name}`
    : nextIn != null && nextIn <= 15
      ? `${t('detail.arrivingIn')} ${formatDuration(nextIn)}`
      : train.nextStation.name

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 border border-fg bg-fg px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[var(--tracking-rail)] text-page transition-colors hover:bg-fg-muted"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('journey.back')}
      </button>

      {/* 1 · Train status ---------------------------------------------------- */}
      <header>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Mono className="text-3xl font-bold leading-none text-fg sm:text-4xl">{train.number}</Mono>
          <h1 className="font-display text-2xl font-medium text-fg sm:text-3xl">{train.name}</h1>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
          <span>
            {train.origin.name} → {train.destination.name}
          </span>
          <span aria-hidden="true">·</span>
          {/* Says outright that these figures come from the simulation. */}
          <SourceBadge source="simulated" />
        </p>
      </header>

      <section className="mt-6 border-y border-line-strong py-6">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div className="min-w-0">
            <Eyebrow as="h2" tone="fg">
              {t('detail.whereIsIt')}
            </Eyebrow>

            <p className="mt-2 font-display text-[1.75rem] font-medium leading-tight text-fg sm:text-[2.5rem]">
              {moving ? (
                <>
                  {train.prevStation.name}{' '}
                  <span className="text-fg-muted" aria-hidden="true">
                    →
                  </span>{' '}
                  {train.nextStation.name}
                </>
              ) : (
                (train.atStation?.name ?? train.prevStation.name)
              )}
            </p>

            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
              {moving ? (
                <span className="flex items-center gap-1.5">
                  <Gauge className="size-4" aria-hidden="true" />
                  {train.speedKmh} km/h
                </span>
              ) : (
                <span>{t('focus.standing')}</span>
              )}
              <span aria-hidden="true">·</span>
              <span>
                {stats.coveredKm} km {t('detail.doneOf')} {stats.totalKm} km
              </span>
            </p>
          </div>

          <span
            className={`shrink-0 border px-3 py-1.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[var(--tracking-rail)] ${tone.chip}`}
          >
            {train.delayMin > 0
              ? `${t('focus.running')} +${train.delayMin} ${t('unit.min')}`
              : t('status.onTime')}
          </span>
        </div>

        {/* In short, high on the page where it is actually useful (§2). */}
        <div className="mt-5 border-l-2 border-brass bg-brass-soft px-4 py-3.5">
          <Eyebrow as="p" tone="fg">
            {t('detail.inShort')}
          </Eyebrow>
          <div className="mt-2 space-y-1.5">
            {summary.map((line) => (
              <p key={line.slice(0, 28)} className="text-[0.9375rem] leading-6 text-fg">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* I'm travelling (§4) */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={goToConnection}
            className="inline-flex items-center gap-2 border border-brand bg-brand px-4 py-2.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[var(--tracking-rail)] text-brand-fg transition-colors hover:bg-brand-hover"
          >
            <Ticket className="size-4" aria-hidden="true" />
            {t('detail.imTravelling')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
          <p className="text-sm text-fg-muted">{t('detail.imTravellingLead')}</p>
        </div>
      </section>

      {/* 2 · Next stop — the summary line, immediately under the status and
             above the fold: station, expected arrival, time remaining, and the
             delay it is running. */}
      <section className="mt-8 grid gap-x-8 gap-y-4 border-b border-line pb-6 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <Eyebrow as="h2" tone="fg">
            {t('detail.nextStop')}
          </Eyebrow>
          <p className="mt-1.5 font-display text-2xl font-medium text-fg">{nextStopHeadline}</p>
          <p className="mt-1 font-mono text-xs text-fg-muted">
            {train.nextStation.code} · {train.nextStation.name}
          </p>
        </div>

        <dl className="flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <dt className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
              {t('detail.expected')}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums text-fg">
              {formatClock(train.nextStationEtaMin)}
            </dd>
          </div>
          {nextIn != null ? (
            <div>
              <dt className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                {t('detail.inTime')}
              </dt>
              <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums text-fg">
                {formatDuration(nextIn)}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
              {t('focus.running')}
            </dt>
            <dd className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${tone.text}`}>
              {train.delayMin > 0 ? `+${train.delayMin}` : '0'}
            </dd>
          </div>
        </dl>
      </section>

      {/* 3 · The journey itself: progress on the left, every remaining call on
             the right. Both are on the page the moment it opens. */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <Section title={t('detail.howFar')} className="lg:col-span-5">
          <div
            className="max-h-[32rem] overflow-y-auto pr-1"
            tabIndex={0}
            role="group"
            aria-label={t('focus.journey')}
          >
            <JourneyBookmark train={train} highlightedStop={highlightedStop} />
          </div>
        </Section>

        {/* Out of disclosure and onto the page: every remaining call, booked
            against predicted, with the next one marked. */}
        <Section
          title={t('detail.stationTimings')}
          lead={t('upcoming.caption')}
          className="lg:col-span-7"
        >
          <StationTimings train={train} />
        </Section>
    </div>

      {/* 4 · On the map — directly under the journey it illustrates. It sits
             below the timings rather than above them, so the page opens on the
             figures a passenger came for; but it stays beside them rather than
             at the foot of the page, because it is the same journey drawn a
             second way. Component and props are untouched. */}
      <div className="mt-10 border-t-2 border-fg pt-6">
        <Section title={t('detail.onTheMap')} lead={t('detail.mapLead')}>
          <div className="relative h-[20rem] border border-line sm:h-[24rem] lg:h-[26rem]">
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-sunken">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                    Syncing train position…
                  </p>
                </div>
              }
            >
              <RailMap
                className="absolute inset-0"
                selectedTrain={train.number}
                focusMode
                onSelectTrain={() => {}}
                onSelectStation={() => {}}
              />
            </Suspense>
          </div>
        </Section>
      </div>

      {/* 5 · "I'm travelling" — will I catch my next train? ------------------- */}
      <div ref={connectionRef} className="mt-10 scroll-mt-24 border-t-2 border-fg pt-6">
        <ConnectionPlanner
          fixedTrain={train}
          headingId="connection-detail"
          onSelectTrain={(number) => selectTrain(number)}
        />
      </div>

      {/* 6 · Why this ETA ------------------------------------------------------ */}
      <div className="mt-10">
        <Section title={t('detail.whyThisEta')} lead={t('detail.whyLead')}>
          <div className="grid gap-6 lg:grid-cols-12">
            <dl className="border-t border-line lg:col-span-5">
              {[
                [t('detail.scheduledArrival'), formatClock(train.bookedArrivalMin), 'text-fg-muted'],
                [t('detail.predictedArrival'), formatClock(train.etaMinutes), 'text-fg'],
                [
                  t('detail.expectedDelay'),
                  train.destinationDelay > 0
                    ? `+${train.destinationDelay} ${t('unit.min')}`
                    : t('status.onTime'),
                  train.destinationDelay > 0 ? 'text-caution' : 'text-brand-text',
                ],
              ].map(([label, value, colour]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                >
                  <dt className="text-[0.8125rem] text-fg-muted">{label}</dt>
                  <dd className={`font-mono text-lg font-semibold tabular-nums ${colour}`}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="lg:col-span-7">
              <p className="text-[0.9375rem] leading-6 text-fg-muted">
                {t('detail.etaExplanation', {
                  station: train.destination.name,
                  minutes: train.destinationDelay,
                })}
              </p>
              {endIn != null ? (
                <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                  {t('detail.arrivesIn')} {formatDuration(endIn)}
                </p>
              ) : null}
            </div>
          </div>

          {/* The named conditions behind that arrival time (§2). */}
          <div className="mt-8 border-t border-line pt-6">
            <EtaFactors train={train} breakdown={breakdown} />
          </div>
        </Section>
      </div>

      {/* 7 · Delay recovery ---------------------------------------------------- */}
      <div className="mt-10">
        <Section
          title={t('recovery.title')}
          lead={
            train.delayMin > 0
              ? t('detail.whyLate', { minutes: train.delayMin })
              : t('detail.whyOnTime')
          }
        >
          {/* The three figures the narrative below is about, all read straight
              off the propagated chain. */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-line pb-5 sm:grid-cols-3">
            {[
              [t('recovery.currentDelay'), delay.current, delay.current > 0],
              [
                delay.ahead >= 0 ? t('recovery.additional') : t('recovery.expected'),
                Math.abs(delay.ahead),
                delay.ahead > 0,
              ],
              [
                t('recovery.atDestination', { station: train.destination.code }),
                train.destinationDelay,
                train.destinationDelay > 0,
              ],
            ].map(([label, value, warn]) => (
              <div key={label}>
                <dt className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                  {label}
                </dt>
                <dd
                  className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${warn ? 'text-caution' : 'text-brand-text'}`}
                >
                  {value} <span className="text-sm font-normal">{t('unit.min')}</span>
                </dd>
              </div>
            ))}
          </dl>

          {/* A sequence, not a chart: each row is one thing that happened. */}
          <ol className="mt-5 border-t border-line">
            {delay.events.map((event) => (
              <li key={event.id} className="flex items-start gap-4 border-b border-line py-3">
                <Mono
                  className={`w-14 shrink-0 pt-0.5 text-sm font-bold tabular-nums ${
                    event.kind === 'recovered'
                      ? 'text-brand-text'
                      : event.kind === 'lost'
                        ? 'text-caution'
                        : 'text-fg-muted'
                  }`}
                >
                  {event.minutes > 0 ? `+${event.minutes}` : event.minutes < 0 ? event.minutes : '0'}
                </Mono>
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium text-fg">{event.title}</p>
                  <p className="mt-0.5 text-[0.8125rem] leading-6 text-fg-muted">{event.detail}</p>
                </div>
              </li>
            ))}

            <li className="flex items-start gap-4 border-b border-line py-3">
              <Mono className={`w-14 shrink-0 pt-0.5 text-sm font-bold tabular-nums ${tone.text}`}>
                {delay.current > 0 ? `+${delay.current}` : '0'}
              </Mono>
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-semibold text-fg">{t('detail.rightNow')}</p>
                <p className="mt-0.5 text-[0.8125rem] leading-6 text-fg-muted">{delay.aheadLabel}</p>
              </div>
            </li>
          </ol>

          <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
            {t('detail.causeNote')}
          </p>
        </Section>
      </div>

      {/* 8 · ETA confidence ---------------------------------------------------- */}
      <div className="mt-10">
        <Section title={t('confidence.title')}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span
              className={`border px-3 py-1.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[var(--tracking-rail)] ${CONFIDENCE_TONE[confidence.level]}`}
            >
              {t(`confidence.${confidence.level}`)}
            </span>
            <p className="max-w-prose text-[0.9375rem] leading-6 text-fg-muted">
              {t('confidence.margin', { minutes: confidence.margin })}
            </p>
          </div>
        </Section>
      </div>

      {/* 9 · The operational material, folded away ------------------------------ */}
      <div className="mt-10">
        <Eyebrow as="h2" tone="fg" className="mb-1">
          {t('detail.moreDetail')}
        </Eyebrow>

        <Disclosure title={t('detail.journeyDetails')}>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {[
              [t('detail.covered'), `${stats.coveredKm} km`],
              [t('detail.remaining'), `${stats.remainingKm} km`],
              [t('detail.progress'), `${Math.round(stats.progress * 100)}%`],
              [t('detail.avgSpeed'), `${stats.averageKmh} km/h`],
              [t('detail.running'), formatDuration(stats.runningMin)],
              [t('detail.bookedCruise'), `${stats.bookedKmh} km/h`],
              [t('detail.category'), train.category],
              [
                t('detail.section'),
                train.section ? `${train.section.from.code}–${train.section.to.code}` : '—',
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                  {label}
                </dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-fg">{value}</dd>
              </div>
            ))}
          </dl>
        </Disclosure>

        <div className="border-t border-line pt-5">
          <Eyebrow as="h3" tone="fg" className="mb-3">
            {t('ask.title')}
          </Eyebrow>
          {/* Voice Mode announces about the train this page is showing. */}
          <AskRailSense trainNumber={train.number} />
        </div>
      </div>

      <p className="mt-6 border-t border-line pt-3 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        {t('common.simulated')}
      </p>
    </div>
  )
}
