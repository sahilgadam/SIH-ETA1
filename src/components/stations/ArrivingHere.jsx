import { useEffect, useRef } from 'react'
import { ArrowRight, Train } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { formatClock, formatDuration } from '../../lib/railSim'
import { STATUS_META } from '../../lib/stationBoard'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'

/**
 * "I'm arriving here."
 *
 * The station page's primary act. Choose the service you are arriving on and
 * the departure board stops being a timetable and becomes a set of answers:
 * this one you'll catch, this one is tight, this one has already gone.
 *
 * The transfer bar is the only motion on the page that runs continuously,
 * because it is the one number that moves on its own — as the incoming train
 * loses time the window visibly closes (§12).
 */

const TONE = {
  brand: { text: 'text-brand-text', bar: 'var(--brand)', border: 'border-brand', bg: 'bg-brand-soft' },
  caution: { text: 'text-caution', bar: 'var(--caution)', border: 'border-caution', bg: 'bg-caution-soft' },
  danger: { text: 'text-danger', bar: 'var(--danger)', border: 'border-danger', bg: 'bg-danger-soft' },
}

/** One catchable (or missed) departure, with its window drawn to scale. */
function Option({ option, onOpenTrain }) {
  const { t } = useLanguage()
  const meta = STATUS_META[option.status]
  const tone = TONE[meta.tone]
  const barRef = useRef(null)

  // A fixed 90-minute reference, so the bars are comparable between rows
  // rather than each filling its own track. It is matched to the widest window
  // the board offers — against the old 40-minute reference every option past
  // the first half hour drew as a full bar and the row carried no comparison.
  const share = Math.max(0, Math.min(option.transferMin / 90, 1))
  useEffect(() => {
    if (barRef.current) barRef.current.style.width = `${Math.max(share * 100, 2)}%`
  }, [share])

  return (
    <li className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => onOpenTrain(option.train.number)}
        className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 py-3 text-left"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <Mono className="text-sm font-bold text-fg">{option.train.number}</Mono>
            <span className="truncate text-[0.8125rem] text-fg-muted">{option.train.name}</span>
          </span>
          <span className="mt-0.5 block font-mono text-[0.625rem] text-fg-muted">
            {t('station.to')} {option.to.name} ({option.to.code})
          </span>

          {/* The window, to scale. */}
          <span className="mt-2 flex items-center gap-2.5">
            <span className="h-1.5 w-32 bg-sunken">
              <span
                ref={barRef}
                className="block h-full transition-[width] duration-500 ease-[var(--ease-rail)] motion-reduce:transition-none"
                style={{ width: '2%', background: tone.bar }}
              />
            </span>
            <span className={`font-mono text-[0.625rem] font-bold uppercase tracking-[var(--tracking-rail)] ${tone.text}`}>
              {option.transferMin >= 0
                ? `${formatDuration(option.transferMin)} ${t('station.toChange')}`
                : t('station.departsBefore')}
            </span>
          </span>
        </span>

        <span className="text-right">
          <Mono className="block text-lg font-semibold tabular-nums text-fg">
            {formatClock(option.at)}
          </Mono>
          <span className={`font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] ${tone.text}`}>
            {meta.label}
          </span>
          <ArrowRight
            className="ml-auto mt-1 size-3.5 text-fg-muted transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </button>
    </li>
  )
}

export function ArrivingHere({
  station,
  services,
  arrival,
  arrivingNumber,
  onChangeArriving,
  options,
  onOpenTrain,
}) {
  const { t } = useLanguage()

  const catchable = options.filter((o) => o.status !== 'missed')
  const missed = options.filter((o) => o.status === 'missed')
  const best = catchable.find((o) => o.status === 'comfortable' || o.status === 'likely') ?? catchable[0]

  return (
    <section aria-labelledby="arriving-title" className="border border-line-strong bg-surface">
      <div className="border-b border-line bg-sunken px-4 py-4 sm:px-5">
        <Eyebrow as="p" tone="fg">
          {t('station.arrivingHere')}
        </Eyebrow>
        <h2 id="arriving-title" className="mt-1.5 font-display text-2xl font-medium text-fg">
          {t('station.whatCanICatch')}
        </h2>
        <p className="mt-1.5 max-w-prose text-sm leading-6 text-fg-muted">
          {t('station.arrivingLead', { station: station.name })}
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-3">
          <label className="min-w-0 flex-1 sm:max-w-md">
            <span className="flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
              <Train className="size-3.5" aria-hidden="true" />
              {t('station.imArrivingOn')}
            </span>
            <select
              value={arrivingNumber ?? ''}
              onChange={(event) => onChangeArriving(event.target.value || null)}
              className="mt-1.5 w-full border border-line bg-page px-2.5 py-2.5 font-mono text-xs text-fg outline-none focus-visible:border-brand"
            >
              <option value="">{t('station.chooseArriving')}</option>
              {services.map((service) => (
                <option key={service.train.number} value={service.train.number}>
                  {service.train.number} · {service.train.name.slice(0, 38)} · {formatClock(service.at)}
                </option>
              ))}
            </select>
          </label>

          {arrival ? (
            <div>
              <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                {t('station.youArrive')}
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-fg">
                {formatClock(arrival.at)}
              </p>
              <p
                className={`font-mono text-[0.625rem] ${arrival.stop.delayMin > 0 ? 'text-caution' : 'text-brand-text'}`}
              >
                {arrival.stop.delayMin > 0
                  ? `+${arrival.stop.delayMin} ${t('unit.min')}`
                  : t('status.onTime')}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Outcomes */}
      {arrival ? (
        <div aria-live="polite">
          {best ? (
            <div className={`border-b border-line ${TONE[STATUS_META[best.status].tone].bg} px-4 py-3 sm:px-5`}>
              <p className="text-sm leading-6 text-fg">
                {t('station.bestOption', {
                  train: best.train.number,
                  destination: best.to.name,
                  time: formatClock(best.at),
                  minutes: best.transferMin,
                })}
              </p>
            </div>
          ) : null}

          <div className="px-4 py-3 sm:px-5">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
              {t('station.canCatch')} · {catchable.length}
            </p>
            {catchable.length ? (
              <ul className="mt-1">
                {catchable.slice(0, 6).map((option) => (
                  <Option key={option.train.number} option={option} onOpenTrain={onOpenTrain} />
                ))}
              </ul>
            ) : (
              <p className="py-4 text-sm text-fg-muted">{t('station.nothingCatchable')}</p>
            )}
          </div>

          {missed.length ? (
            <details className="border-t border-line px-4 py-3 sm:px-5">
              <summary className="cursor-pointer font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                {t('station.alreadyGone')} · {missed.length}
              </summary>
              <ul className="mt-1">
                {missed.slice(0, 4).map((option) => (
                  <Option key={option.train.number} option={option} onOpenTrain={onOpenTrain} />
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      ) : (
        <p className="px-4 py-8 text-center text-sm text-fg-muted sm:px-5">
          {t('station.choosePrompt')}
        </p>
      )}

      <p className="border-t border-line px-4 py-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted sm:px-5">
        {t('connect.note')}
      </p>
    </section>
  )
}
