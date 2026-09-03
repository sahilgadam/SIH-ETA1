import { ArrowRight } from 'lucide-react'
import { popularTrains } from '../../data/trains'
import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { formatClock } from '../../lib/railSim'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'

/**
 * Active services — a digital timetable, not a card grid (§34).
 *
 * Rows are dense and scannable, and the visual priority is the one the
 * passenger actually reads in order (§79): number, service, route, live
 * status, arrival. Services that are also running in the simulation carry a
 * live badge and a moving arrival time; the rest show their booked times and
 * say so, rather than implying a feed that isn't there.
 */

const STATUS_STYLE = {
  'on-time': { glyph: '●', className: 'text-brand-text' },
  watch: { glyph: '▲', className: 'text-caution' },
  delayed: { glyph: '■', className: 'text-caution' },
  critical: { glyph: '◆', className: 'text-danger' },
  stopped: { glyph: '▬', className: 'text-fg-subtle' },
}

function TrainRow({ train, live, onSelect, t }) {
  const status = live ? (STATUS_STYLE[live.status] ?? STATUS_STYLE['on-time']) : null

  return (
    <li className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => onSelect(train)}
        className="group grid w-full grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 px-3 py-3.5 text-left transition-colors hover:bg-sunken sm:grid-cols-[5.5rem_1fr_auto_auto] sm:px-4"
      >
        <Mono className="text-base font-bold text-fg">{train.number}</Mono>

        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-fg">{train.name}</span>

          {/* The route line grows on hover — the row's own small piece of rail. */}
          <span className="mt-1 flex items-center gap-2 font-mono text-[0.6875rem] text-fg-muted">
            <span className="font-semibold">{train.from.code}</span>
            <span
              aria-hidden="true"
              className="inline-block h-px w-6 bg-line-strong transition-all duration-300 ease-[var(--ease-rail)] group-hover:w-12"
            />
            <span className="sr-only"> to </span>
            <span className="font-semibold">{train.to.code}</span>
            <span className="ml-1 hidden opacity-70 sm:inline">{train.duration}</span>
          </span>
        </span>

        <span className="font-mono text-xs tabular-nums text-fg-muted">
          <span className="sr-only">{t('popular.departs')} </span>
          {train.departs}
          <span aria-hidden="true" className="mx-1 opacity-50">
            →
          </span>
          <span className="sr-only">{t('popular.arrives')} </span>
          {train.arrives}
        </span>

        <span className="flex items-center justify-end gap-3 sm:w-40">
          {live ? (
            <span className="text-right">
              <span className={`flex items-center justify-end gap-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] ${status.className}`}>
                <span aria-hidden="true">{status.glyph}</span>
                {live.delayMin > 0 ? `+${live.delayMin} ${t('unit.min')}` : t('status.onTime')}
              </span>
              <Mono className="mt-0.5 block text-sm font-semibold tabular-nums text-fg">
                {formatClock(live.etaMinutes)}
              </Mono>
            </span>
          ) : (
            <span className="font-mono text-[0.625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
              {train.runsOn}
            </span>
          )}

          <ArrowRight
            className="size-4 shrink-0 text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg"
            aria-hidden="true"
          />
        </span>
      </button>
    </li>
  )
}

export function PopularTrains({ onSelectTrain }) {
  const { t } = useLanguage()
  const { trains } = useNetwork()
  const containerRef = useScrollReveal()

  const liveByNumber = new Map(trains.map((train) => [train.number, train]))

  return (
    <section
      id="popular-trains"
      aria-labelledby="popular-title"
      className="scroll-mt-20 border-b border-line bg-ground-sand"
    >
      <div ref={containerRef} className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:py-16">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line-strong pb-4">
          <div>
            <Eyebrow as="p">{t('results.timetableLabel')}</Eyebrow>
            <h2 id="popular-title" className="mt-2 font-display text-3xl font-medium text-fg">
              {t('section.activeTrains')}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-fg-muted">{t('section.activeTrainsLead')}</p>
        </div>

        <ul data-reveal className="mt-1">
          {popularTrains.map((train) => (
            <TrainRow
              key={train.number}
              train={train}
              live={liveByNumber.get(train.number) ?? null}
              onSelect={onSelectTrain}
              t={t}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
