import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { DelayBadge } from '../ui/DelayBadge'

const DOT = {
  completed: 'bg-brand border-brand',
  current: 'bg-accent border-accent ring-4 ring-accent/25',
  upcoming: 'bg-surface border-line-strong',
}

/**
 * A major station: the dot sits in the rail row, the label is absolutely
 * positioned beneath it so it never affects the horizontal layout.
 *
 * `align` pulls the first and last labels inside the track so they are not
 * clipped by the scroll container.
 */
export function StationNode({ station, align = 'center' }) {
  const { t } = useLanguage()

  return (
    <div className="relative z-10 shrink-0" data-node={station.code}>
      <span
        className={cn('block size-3.5 rounded-full border-2', DOT[station.status] ?? DOT.upcoming)}
        aria-hidden="true"
      />

      <div
        className={cn(
          'absolute top-[30px] w-32',
          align === 'start' && 'left-0 text-left',
          align === 'end' && 'right-0 text-right',
          align === 'center' && 'left-1/2 -translate-x-1/2 text-center',
        )}
      >
        <p className="truncate text-sm font-semibold leading-tight text-fg">{station.station}</p>
        <p className="mt-0.5 font-mono text-[0.6875rem] font-semibold text-fg-subtle">
          {station.code}
        </p>
        <p className="mt-1.5 text-xs tabular-nums text-fg-muted">
          <span className="sr-only">{t('upcoming.scheduled')} </span>
          {station.scheduledTime}
        </p>
        <p className="text-xs font-semibold tabular-nums text-fg">
          <span className="sr-only">{t('upcoming.railSense')} </span>
          {station.predictedTime}
        </p>
        <DelayBadge minutes={station.predictedDelayMinutes} size="sm" className="mt-1" />
      </div>
    </div>
  )
}
