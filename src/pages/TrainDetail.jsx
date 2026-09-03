import { lazy, Suspense, useEffect, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageProvider'
import { useNetwork } from '../context/NetworkProvider'
import { useSelection } from '../context/SelectionProvider'
import { formatClock, formatDuration, minutesUntil } from '../lib/railSim'
import { delayProfile, journeyStats, passengerSummary, predictionFactors } from '../lib/trainInsights'
import { AskRailSense } from '../components/assistant/AskRailSense'
import { JourneyBookmark } from '../components/live/JourneyBookmark'
import { ConnectionPlanner } from '../components/stations/ConnectionPlanner'
import { Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Mono } from '../components/ui/Mono'

const RailMap = lazy(() =>
  import('../components/map/RailMap').then((m) => ({ default: m.RailMap })),
)

/**
 * The canonical train detail page.
 *
 * ONE page, reached two ways — from a search result and from "View train
 * details" in Live Status (§8, §18) — so there is a single source of truth for
 * what a service's full record looks like.
 *
 * It is not the network screen. It shows one train, at length: identity,
 * current status, the journey bookmark, a focused map, every booked-versus-
 * predicted call, why the arrival is what it is, how the delay behaves along
 * the route, and the connection check. All of it derived from the same
 * `railSim` object Live Status renders (§16).
 */

function Metric({ label, value, unit, tone }) {
  return (
    <div className="min-w-0 p-4">
      {/* fg-muted, not fg-subtle: the subtle step measures 4.47:1 against the
          sunken band this row sits on, a hair under AA. */}
      <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        {label}
      </p>
      <p className={`mt-1.5 font-mono text-xl font-semibold tabular-nums ${tone ?? 'text-fg'}`}>
        {value}
        {unit ? <span className="ml-1 text-[0.6875rem] font-normal text-fg-muted">{unit}</span> : null}
      </p>
    </div>
  )
}

function Panel({ title, children, className = '' }) {
  return (
    <section className={`border border-line bg-surface ${className}`}>
      <p className="border-b border-line px-4 py-2.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg">
        {title}
      </p>
      {children}
    </section>
  )
}

/** Booked against predicted, for every call on the route. */
function StationTimings({ train }) {
  const { t } = useLanguage()

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {[
              t('detail.colStation'),
              t('detail.colBookedArr'),
              t('detail.colPredArr'),
              t('detail.colBookedDep'),
              t('detail.colPredDep'),
              t('detail.colVariance'),
            ].map((head) => (
              <th
                key={head}
                scope="col"
                className="px-3 py-2 font-mono text-[0.5625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-subtle"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {train.timeline.map((stop) => {
            const past = stop.state === 'past'
            return (
              <tr key={stop.code} className={stop.state === 'next' ? 'bg-brand-soft' : undefined}>
                <th scope="row" className="px-3 py-2 font-normal">
                  <Mono className={`text-xs ${past ? 'font-bold text-fg' : 'font-semibold text-fg-muted'}`}>
                    {stop.code}
                  </Mono>
                  <span className="ml-2 text-[0.6875rem] text-fg-subtle">{stop.name}</span>
                </th>
                {[
                  stop.bookedArrMin,
                  stop.predictedArrMin,
                  stop.bookedDepMin,
                  stop.predictedDepMin,
                ].map((value, i) => (
                  <td
                    key={i}
                    className={`px-3 py-2 font-mono text-xs tabular-nums ${
                      i % 2 ? 'text-fg' : 'text-fg-subtle'
                    }`}
                  >
                    {value != null ? formatClock(value) : '—'}
                  </td>
                ))}
                <td
                  className={`px-3 py-2 font-mono text-xs font-semibold tabular-nums ${
                    stop.delayMin > 0 ? 'text-caution' : 'text-brand-text'
                  }`}
                >
                  {stop.delayMin > 0 ? `+${stop.delayMin}` : '0'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function TrainDetail({ trainNumber, onBack }) {
  const { t } = useLanguage()
  const { trains, minutes } = useNetwork()
  const { selectTrain, highlightedStop } = useSelection()

  const train = trains.find((item) => item.number === trainNumber) ?? null

  // Opening the record points the shared selection at it, so the assistant
  // and any map already on screen agree with the page.
  useEffect(() => {
    if (trainNumber) selectTrain(trainNumber)
  }, [trainNumber, selectTrain])

  const stats = useMemo(() => (train ? journeyStats(train, minutes) : null), [train, minutes])
  const factors = useMemo(() => (train ? predictionFactors(train) : []), [train])
  const profile = useMemo(() => (train ? delayProfile(train) : []), [train])
  const summary = useMemo(
    () => (train && stats ? passengerSummary(train, stats, formatClock, formatDuration) : []),
    [train, stats],
  )

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

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-5 sm:px-6 lg:py-8">
      {/* Header ------------------------------------------------------------- */}
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 border border-fg bg-fg px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[var(--tracking-rail)] text-page transition-colors hover:bg-fg-muted"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('journey.back')}
      </button>

      <header className="border-b border-line-strong pb-4">
        <Eyebrow as="p">{train.category}</Eyebrow>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Mono className="text-4xl font-bold leading-none text-fg sm:text-5xl">{train.number}</Mono>
          <h1 className="font-display text-2xl font-medium text-fg sm:text-3xl">{train.name}</h1>
        </div>
        <p className="mt-2 font-mono text-xs text-fg-muted">
          {train.origin.name} ({train.origin.code}) → {train.destination.name} ({train.destination.code})
          <span className="mx-2 opacity-50">·</span>
          {train.timeline.length} {t('detail.stops')}
          <span className="mx-2 opacity-50">·</span>
          {stats.totalKm} km
        </p>
      </header>

      {/* Current status ------------------------------------------------------ */}
      <section className="mt-5 border border-line bg-sunken">
        <div className="border-b border-line px-4 py-3.5">
          {/* tone="fg" (the fg-muted step) rather than a className override:
              `cn` concatenates, so both colour classes would land on the
              element and the winner would depend on stylesheet order. */}
          <Eyebrow as="p" tone="fg">
            {moving ? t('focus.between') : t('focus.at')}
          </Eyebrow>
          <p className="mt-1 font-display text-2xl font-medium text-fg sm:text-3xl">
            {moving
              ? `${train.prevStation.name} → ${train.nextStation.name}`
              : (train.atStation?.name ?? train.prevStation.name)}
          </p>
        </div>

        <dl className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
          <Metric
            label={t('focus.nextStop')}
            value={train.nextStation.code}
            unit={nextIn != null ? `· ${formatDuration(nextIn)}` : null}
          />
          <Metric label={t('detail.predictedArrival')} value={formatClock(train.etaMinutes)} />
          <Metric
            label={t('focus.running')}
            value={train.delayMin > 0 ? `+${train.delayMin}` : '0'}
            unit="min"
            tone={train.delayMin > 0 ? 'text-caution' : 'text-brand-text'}
          />
          <Metric label={t('detail.speed')} value={moving ? train.speedKmh : 0} unit="km/h" />
          <Metric
            label={t('detail.remaining')}
            value={stats.remainingKm}
            unit={`km · ${formatDuration(stats.remainingMin)}`}
          />
        </dl>
      </section>

      {/* Map + bookmark ------------------------------------------------------ */}
      <div className="mt-5 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Panel title={t('detail.route')}>
            <div className="relative h-[22rem] sm:h-[28rem]">
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center bg-sunken">
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                      Syncing train position…
                    </p>
                  </div>
                }
              >
                {/* This service only — never the network (§12). */}
                <RailMap
                  className="absolute inset-0"
                  selectedTrain={train.number}
                  focusMode
                  onSelectTrain={() => {}}
                  onSelectStation={() => {}}
                />
              </Suspense>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-5">
          <Panel title={t('focus.journey')} className="h-full">
            <div
              className="max-h-[28rem] overflow-y-auto px-4 py-3"
              tabIndex={0}
              role="group"
              aria-label={t('focus.journey')}
            >
              <JourneyBookmark train={train} highlightedStop={highlightedStop} />
            </div>
          </Panel>
        </div>
      </div>

      {/* Prediction ---------------------------------------------------------- */}
      <div className="mt-5 grid gap-4 lg:grid-cols-12">
        <Panel title={t('detail.whyThisEta')} className="lg:col-span-5">
          <ul className="space-y-3 p-4">
            {factors.map((factor) => (
              <li key={factor.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-[0.8125rem] text-fg">{factor.label}</span>
                  <Mono
                    className={`shrink-0 text-sm font-semibold tabular-nums ${
                      factor.minutes > 0 ? 'text-caution' : factor.minutes < 0 ? 'text-brand-text' : 'text-fg-muted'
                    }`}
                  >
                    {factor.minutes > 0 ? '+' : ''}
                    {factor.minutes} min
                  </Mono>
                </div>
                <div
                  className="mt-1.5 h-1.5"
                  style={{
                    width: `${Math.max(factor.share * 100, 3)}%`,
                    background: factor.minutes < 0 ? 'var(--brand)' : 'var(--caution)',
                    transition: 'width 400ms var(--ease-rail)',
                  }}
                  aria-hidden="true"
                />
                <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
                  {factor.note}
                </p>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-4 py-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            {t('detail.factorsNote')}
          </p>
        </Panel>

        <Panel title={t('detail.delayProfile')} className="lg:col-span-7">
          <div className="p-4">
            <p className="mb-3 max-w-prose text-[0.8125rem] leading-6 text-fg-muted">
              {t('detail.delayProfileLead')}
            </p>
            <ul className="space-y-1.5">
              {profile.map((stop) => (
                <li key={stop.code} className="grid grid-cols-[3.5rem_1fr_3rem] items-center gap-2">
                  <Mono
                    className={`text-[0.6875rem] ${stop.state === 'past' ? 'font-bold text-fg' : 'text-fg-muted'}`}
                  >
                    {stop.code}
                  </Mono>
                  <span className="h-2.5 bg-sunken">
                    <span
                      className="block h-full"
                      style={{
                        width: `${Math.max(stop.share * 100, stop.delayMin > 0 ? 4 : 0)}%`,
                        background:
                          stop.state === 'past' ? 'var(--fg-muted)' : 'var(--caution)',
                        transition: 'width 400ms var(--ease-rail)',
                      }}
                      aria-hidden="true"
                    />
                  </span>
                  <Mono
                    className={`text-right text-[0.6875rem] tabular-nums ${
                      stop.delayMin > 0 ? 'text-caution' : 'text-brand-text'
                    }`}
                  >
                    {stop.delayMin > 0 ? `+${stop.delayMin}` : '0'}
                  </Mono>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      {/* Timings -------------------------------------------------------------- */}
      <div className="mt-5">
        <Panel title={t('detail.stationTimings')}>
          <StationTimings train={train} />
        </Panel>
      </div>

      {/* Performance + summary ------------------------------------------------ */}
      <div className="mt-5 grid gap-4 lg:grid-cols-12">
        <Panel title={t('detail.performance')} className="lg:col-span-5">
          <dl className="grid grid-cols-2 divide-x divide-y divide-line">
            <Metric label={t('detail.covered')} value={stats.coveredKm} unit="km" />
            <Metric label={t('detail.remaining')} value={stats.remainingKm} unit="km" />
            <Metric label={t('detail.avgSpeed')} value={stats.averageKmh} unit="km/h" />
            <Metric label={t('detail.bookedCruise')} value={stats.bookedKmh} unit="km/h" />
            <Metric label={t('detail.running')} value={formatDuration(stats.runningMin)} />
            <Metric
              label={t('detail.progress')}
              value={`${Math.round(stats.progress * 100)}%`}
            />
          </dl>
          {train.section ? (
            <p className="border-t border-line px-4 py-2.5 font-mono text-[0.625rem] text-fg-muted">
              {t('detail.section')}: {train.section.from.code}–{train.section.to.code}
              <span className="mx-1.5 opacity-50">·</span>
              {train.section.km} km
              <span className="mx-1.5 opacity-50">·</span>
              {t('detail.signal')}{' '}
              <span
                className={
                  train.section.signal === 'red'
                    ? 'text-danger'
                    : train.section.signal === 'amber'
                      ? 'text-caution'
                      : 'text-brand-text'
                }
              >
                {train.section.signal}
              </span>
            </p>
          ) : null}
        </Panel>

        <Panel title={t('detail.summary')} className="lg:col-span-7">
          <ul className="space-y-2.5 p-4">
            {summary.map((line) => (
              <li key={line.slice(0, 30)} className="text-[0.9375rem] leading-6 text-fg">
                {line}
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-4 py-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            {t('common.simulated')}
          </p>
        </Panel>
      </div>

      {/* Connections + assistant ---------------------------------------------- */}
      <div className="mt-5 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ConnectionPlanner
            stationCode={train.nextStation.code}
            onSelectTrain={(number) => selectTrain(number)}
          />
        </div>
        <Panel title={t('ask.title')} className="lg:col-span-5">
          <div className="p-4">
            <AskRailSense />
          </div>
        </Panel>
      </div>
    </div>
  )
}
