import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { DelayBadge } from '../ui/DelayBadge'

const DOT = {
  completed: 'bg-brand border-brand',
  current: 'bg-accent border-accent',
  upcoming: 'bg-surface border-line-strong',
}

/**
 * The stations revealed inside an opened segment, spaced evenly across it so
 * the rail stays one straight line.
 *
 * Each node is a zero-width anchor with no transform of its own — Anime.js
 * owns the transform while the nodes fade in.
 */
export function IntermediateStations({ id, stations }) {
  const { t } = useLanguage()

  return (
    <div id={id}>
      {stations.map((station, index) => (
        <div
          key={station.code}
          data-intermediate
          className="absolute z-10 w-0"
          style={{
            left: `${((index + 1) / (stations.length + 1)) * 100}%`,
            top: 'calc(50% - 5px)',
          }}
        >
          <span
            className={cn(
              '-ml-[5px] block size-2.5 rounded-full border-2',
              DOT[station.status] ?? DOT.upcoming,
            )}
            aria-hidden="true"
          />

          <div className="absolute left-1/2 top-[42px] w-[124px] -translate-x-1/2 text-center">
            <p className="truncate text-xs font-medium leading-tight text-fg">{station.station}</p>
            <p className="mt-0.5 font-mono text-[0.625rem] font-semibold text-fg-subtle">
              {station.code}
            </p>
            <p className="mt-1 text-[0.6875rem] tabular-nums text-fg-muted">
              <span className="sr-only">{t('upcoming.scheduled')} </span>
              {station.scheduledTime}
              {station.scheduledArrival && station.scheduledDeparture ? (
                <span className="text-fg-subtle"> · {station.scheduledDeparture}</span>
              ) : null}
            </p>
            <p className="text-[0.6875rem] font-semibold tabular-nums text-fg">
              <span className="sr-only">{t('upcoming.railSense')} </span>
              {station.predictedTime}
              {station.predictedArrival && station.predictedDeparture ? (
                <span className="font-normal text-fg-subtle"> · {station.predictedDeparture}</span>
              ) : null}
            </p>
            <DelayBadge minutes={station.predictedDelayMinutes} size="sm" className="mt-0.5" />
          </div>
        </div>
      ))}
    </div>
  )
}
