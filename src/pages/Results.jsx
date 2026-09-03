import { useMemo } from 'react'
import { ArrowLeft, ArrowRight, SearchX } from 'lucide-react'
import { useLanguage } from '../context/LanguageProvider'
import { useNetwork } from '../context/NetworkProvider'
import { useEntrance } from '../hooks/useEntrance'
import {
  findTrainsBetween,
  findTrainsByQuery,
  findTrainsFromStation,
  resolveStationCode,
} from '../lib/search'
import { formatClock, formatDuration, minutesUntil } from '../lib/railSim'
import { Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Mono } from '../components/ui/Mono'

/** Runs the search criteria against the shared fleet. */
function runSearch(criteria) {
  if (criteria.kind === 'route') {
    return findTrainsBetween(resolveStationCode(criteria.from), resolveStationCode(criteria.to))
  }
  if (criteria.kind === 'station') {
    return findTrainsFromStation(resolveStationCode(criteria.station))
  }
  return findTrainsByQuery(criteria.query)
}

const STATUS = {
  'on-time': { glyph: '●', className: 'text-brand-text' },
  watch: { glyph: '▲', className: 'text-caution' },
  delayed: { glyph: '■', className: 'text-caution' },
  critical: { glyph: '◆', className: 'text-danger' },
}

/**
 * Search results.
 *
 * Rows carry live running data because a result *is* a running service — the
 * same object the map is tracking, not a separate search-only record (§17).
 * Selecting one opens the focused train view.
 */
export function Results({ criteria, onSelectTrain, onBack }) {
  const { t } = useLanguage()
  const { trains, minutes } = useNetwork()
  const containerRef = useEntrance({ delay: 40, each: 50 })

  const hits = useMemo(() => runSearch(criteria), [criteria])
  const byNumber = useMemo(() => new Map(trains.map((train) => [train.number, train])), [trains])

  return (
    <section className="bg-page">
      <div ref={containerRef} className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:py-12">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 flex items-center gap-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {t('results.back')}
        </button>

        <div data-enter>
          <Eyebrow as="p">{t('results.timetableLabel')}</Eyebrow>
          <h1 className="mt-2 font-display text-3xl font-medium text-fg sm:text-4xl">
            {hits.length} {t('trains.servicesRunning')}
          </h1>
        </div>

        {hits.length ? (
          <ul data-enter className="mt-6 border-t border-line-strong">
            {hits.map(({ number, boardingAt, alightingAt }) => {
              const train = byNumber.get(number)
              if (!train) return null
              const status = STATUS[train.status] ?? STATUS['on-time']
              const away = minutesUntil(train.nextStationEtaMin, minutes)

              return (
                <li key={number} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => onSelectTrain(number)}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-3.5 text-left transition-colors hover:bg-sunken"
                  >
                    <span className={`font-mono text-xs ${status.className}`} aria-hidden="true">
                      {status.glyph}
                    </span>

                    <span className="min-w-0">
                      <span className="flex items-baseline gap-2">
                        <Mono className="text-base font-bold text-fg">{train.number}</Mono>
                        <span className="truncate text-sm text-fg-muted">{train.name}</span>
                      </span>

                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[0.625rem] text-fg-subtle">
                        <span className="font-semibold text-fg-muted">
                          {boardingAt.code} → {alightingAt.code}
                        </span>
                        <span>
                          {t('live.nextCol')} {train.nextStation.code}
                          {away != null && away <= 600 ? ` · ${t('focus.in')} ${formatDuration(away)}` : ''}
                        </span>
                      </span>
                    </span>

                    <span className="flex items-center gap-3 text-right">
                      <span>
                        <Mono className="block text-sm font-semibold tabular-nums text-fg">
                          {formatClock(train.etaMinutes)}
                        </Mono>
                        <span
                          className={`font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] ${
                            train.delayMin > 0 ? 'text-caution' : 'text-brand-text'
                          }`}
                        >
                          {train.delayMin > 0 ? `+${train.delayMin} ${t('unit.min')}` : t('status.onTime')}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg"
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div data-enter className="mt-8 border border-dashed border-line px-6 py-16 text-center">
            <SearchX className="mx-auto size-6 text-fg-subtle" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg">
              {t('trains.emptyTitle')}
            </p>
            <p className="mt-1.5 text-sm text-fg-muted">{t('trains.emptyBody')}</p>
            <Button variant="secondary" onClick={onBack} className="mt-5">
              {t('results.back')}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
