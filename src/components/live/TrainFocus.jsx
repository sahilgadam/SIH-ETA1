import { ArrowLeft, ArrowRight, Gauge } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import { formatClock, formatDuration, minutesUntil } from '../../lib/railSim'
import { JourneyBookmark } from './JourneyBookmark'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'

/**
 * The selected train, in full.
 *
 * The first screenful answers the four questions a passenger actually has,
 * in that order (§9): where is it, where is it going, when does it get there,
 * how late is it. Everything below that is elaboration.
 *
 * Times are given both absolutely and relatively — "18:42" *and* "in 18 min" —
 * because a clock time alone makes the reader do the subtraction (§13).
 *
 * Every value comes from the shared simulation state passed in as `train`;
 * this component computes no railway logic of its own.
 */

const STATUS_TONE = {
  'on-time': 'text-brand-text',
  watch: 'text-caution',
  delayed: 'text-caution',
  critical: 'text-danger',
}

function Field({ label, value, sub, tone }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        {label}
      </p>
      <p className={`mt-1 truncate text-[0.9375rem] font-semibold ${tone ?? 'text-fg'}`}>{value}</p>
      {sub ? <p className="mt-0.5 truncate font-mono text-[0.625rem] text-fg-muted">{sub}</p> : null}
    </div>
  )
}

/** The headline block: position, destination, arrival, lateness. */
function CurrentStatus({ train, minutes }) {
  const { t } = useLanguage()
  const moving = train.phase !== 'dwell' && train.phase !== 'origin' && train.phase !== 'arrived'

  const nextIn = minutesUntil(train.nextStationEtaMin, minutes)
  const endIn = minutesUntil(train.etaMinutes, minutes)

  return (
    <div className="border-b border-line-strong bg-sunken px-4 py-3.5 sm:px-5">
      {/* Where is it — the largest thing on the panel. */}
      <Eyebrow as="p">{moving ? t('focus.between') : t('focus.at')}</Eyebrow>

      {moving ? (
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-display text-xl font-medium text-fg sm:text-2xl">
            {train.prevStation.name}
          </span>
          <span className="text-fg-subtle" aria-hidden="true">
            →
          </span>
          <span className="font-display text-xl font-medium text-fg sm:text-2xl">
            {train.nextStation.name}
          </span>
        </p>
      ) : (
        <p className="mt-1 font-display text-xl font-medium text-fg sm:text-2xl">
          {train.atStation?.name ?? train.prevStation.name}
        </p>
      )}

      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] text-fg-muted">
        {moving ? (
          <span className="flex items-center gap-1.5">
            <Gauge className="size-3.5" aria-hidden="true" />
            {train.speedKmh} km/h
          </span>
        ) : (
          <span>{t('focus.standing')}</span>
        )}
        <span className="opacity-50">·</span>
        <span>
          {Math.round(train.progress * 100)}% {t('focus.ofJourney')}
        </span>
      </p>

      {/* The three numbers, on one rule. */}
      <dl className="mt-3 grid grid-cols-2 gap-4 border-t border-line pt-3 sm:grid-cols-3">
        <Field
          label={t('focus.nextStop')}
          value={train.nextStation.code}
          sub={
            nextIn != null
              ? `${formatClock(train.nextStationEtaMin)} · ${t('focus.in')} ${formatDuration(nextIn)}`
              : formatClock(train.nextStationEtaMin)
          }
        />
        <Field
          label={`${t('focus.arrives')} ${train.destination.code}`}
          value={formatClock(train.etaMinutes)}
          sub={endIn != null ? `${t('focus.in')} ${formatDuration(endIn)}` : null}
        />
        <Field
          label={t('focus.running')}
          value={train.delayMin > 0 ? `+${train.delayMin} min` : t('status.onTime')}
          tone={STATUS_TONE[train.status]}
          sub={
            train.delayMin > 0
              ? `${t('focus.booked')} ${formatClock(train.bookedArrivalMin)}`
              : t('focus.toBookedTime')
          }
        />
      </dl>
    </div>
  )
}

/** The full summary, from the same train object (§14). */
function Details({ train }) {
  const { t } = useLanguage()
  const rows = [
    [t('detail.number'), train.number],
    [t('detail.name'), train.name],
    [t('detail.category'), train.category],
    [t('detail.origin'), `${train.origin.name} · ${train.origin.code}`],
    [t('detail.destination'), `${train.destination.name} · ${train.destination.code}`],
    [t('detail.calls'), `${train.timeline.length} ${t('detail.stops')}`],
    [
      t('detail.section'),
      train.section
        ? `${train.section.from.code}–${train.section.to.code} · ${train.section.km} km`
        : `${t('detail.standingAt')} ${train.atStation?.code ?? '—'}`,
    ],
    [
      t('detail.runningTime'),
      train.section
        ? `${t('detail.booked')} ${train.section.bookedRunMin} min · ${t('detail.actual')} ${train.section.currentRunMin} min`
        : '—',
    ],
    [t('detail.signal'), train.section ? train.section.signal : '—'],
    [t('detail.speed'), train.phase === 'dwell' ? t('focus.standing') : `${train.speedKmh} km/h`],
    [t('detail.bookedArrival'), formatClock(train.bookedArrivalMin)],
    [t('detail.predictedArrival'), formatClock(train.etaMinutes)],
    [t('detail.variance'), train.destinationDelay > 0 ? `+${train.destinationDelay} min` : t('status.onTime')],
  ]

  return (
    <dl className="divide-y divide-line border-y border-line">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[9rem_1fr] gap-3 px-4 py-2 sm:px-5">
          <dt className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            {label}
          </dt>
          <dd className="min-w-0 truncate font-mono text-[0.6875rem] text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function TrainFocus({
  train,
  highlightedStop,
  onBack,
  onViewDetails,
  showBack = true,
  // On the dedicated detail page the summary is the point, so it is open and
  // there is nowhere further to send the reader.
  detailsMode = 'link',
}) {
  const { t } = useLanguage()
  const { minutes } = useNetwork()

  if (!train) return null

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      {/* Identity, with both navigations on one row -------------------------
          Keeping the details call-to-action up here rather than in a band of
          its own matters now the panel is only half the viewport tall: it was
          pushing the journey — the thing the panel exists to show — entirely
          below the fold. */}
      <div className="shrink-0 border-b border-line px-4 pb-2.5 pt-3 sm:px-5">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 border border-fg bg-fg px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[var(--tracking-rail)] text-page shadow-[var(--shadow-warm-sm)] transition-colors hover:bg-fg-muted"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {t('focus.backToNetwork')}
            </button>
          ) : null}

          {detailsMode === 'link' ? (
            <button
              type="button"
              onClick={onViewDetails}
              className="ml-auto inline-flex items-center gap-2 border border-brand bg-brand px-3 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[var(--tracking-rail)] text-brand-fg shadow-[var(--shadow-warm-sm)] transition-colors hover:bg-brand-hover"
            >
              {t('focus.viewDetails')}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <Mono className="text-2xl font-bold leading-none text-fg">{train.number}</Mono>
            <p className="mt-1 truncate text-sm text-fg-muted">{train.name}</p>
          </div>

          {/* Route and class share the badge row: at half-viewport height the
              panel cannot afford a line of its own for two station codes. */}
          <span className="flex shrink-0 items-center gap-2.5">
            <Mono className="text-[0.625rem] text-fg-subtle">
              {train.origin.code} → {train.destination.code}
            </Mono>
            <span className="border border-line px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
              {train.category}
            </span>
          </span>
        </div>
      </div>

      {/* The status is pinned outside the scroll area. With the panel only
          half the viewport, letting it scroll away meant the journey and the
          "where is it right now" answer could never be on screen together —
          and the status is the thing that must always be readable. */}
      <div className="shrink-0">
        <CurrentStatus train={train} minutes={minutes} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">

        {/* The full summary is shown inline only on the dedicated detail
            page; in tracking mode the header button leads there instead. */}
        {detailsMode === 'inline' ? (
          <div className="border-b border-line">
            <p className="px-4 py-3 font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg sm:px-5">
              {t('focus.summary')}
            </p>
            <Details train={train} />
          </div>
        ) : null}

        {/* The journey itself. */}
        <div className="px-4 py-3.5 sm:px-5">
          <Eyebrow as="h3" className="mb-2.5">
            {t('focus.journey')}
          </Eyebrow>
          <JourneyBookmark train={train} highlightedStop={highlightedStop} />
        </div>
      </div>

      <p className="shrink-0 border-t border-line px-4 py-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle sm:px-5">
        {t('common.simulated')}
      </p>
    </div>
  )
}
