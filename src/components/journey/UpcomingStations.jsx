import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { getRemainingStations, withDelayTrend } from '../../lib/eta'
import { cn } from '../../lib/cn'
import { DelayBadge } from '../ui/DelayBadge'
import { StatusBadge } from '../ui/StatusBadge'

/** How the forecast moved since the previous station on the route. */
function DelayTrend({ minutes }) {
  const { t } = useLanguage()
  if (!minutes) return null

  const isWorse = minutes > 0
  const Icon = isWorse ? ChevronUp : ChevronDown

  return (
    <span
      className={cn(
        'ml-1 inline-flex items-center text-[0.6875rem] font-semibold tabular-nums',
        isWorse ? 'text-danger' : 'text-brand',
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      <span className="sr-only">{t('upcoming.trend')} </span>
      {Math.abs(minutes)}
    </span>
  )
}

/**
 * Every station still ahead of the train, each with its own forecast rather
 * than a repeat of the current delay.
 */
export function UpcomingStations({ journey, className }) {
  const { t } = useLanguage()

  const remaining = withDelayTrend(getRemainingStations(journey))

  return (
    <section
      aria-labelledby="upcoming-title"
      className={cn('flex min-h-0 min-w-0 flex-col rounded-lg border border-line bg-surface', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-4">
        <h2 id="upcoming-title" className="text-base font-bold text-fg">
          {t('upcoming.title')}
        </h2>
        <p className="text-xs text-fg-muted">{t('upcoming.count', { count: remaining.length })}</p>
      </div>

      <div className="relative max-h-[420px] overflow-auto">
        <table className="w-full min-w-[540px] border-collapse text-sm">
          <caption className="sr-only">{t('upcoming.caption')}</caption>
          <thead className="sticky top-0 z-10 bg-sunken">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">
              <th scope="col" className="px-5 py-2.5">{t('upcoming.station')}</th>
              <th scope="col" className="px-3 py-2.5 text-right">{t('upcoming.scheduled')}</th>
              <th scope="col" className="px-3 py-2.5 text-right">{t('upcoming.railSense')}</th>
              <th scope="col" className="px-3 py-2.5 text-right">{t('upcoming.difference')}</th>
              <th scope="col" className="px-5 py-2.5">{t('upcoming.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {remaining.map((station) => (
              <tr key={station.code} className={station.status === 'current' ? 'bg-accent-soft' : undefined}>
                <th scope="row" className="px-5 py-2.5 text-left font-normal">
                  <span className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        'truncate',
                        station.isMajor ? 'font-semibold text-fg' : 'text-fg-muted',
                      )}
                    >
                      {station.station}
                    </span>
                    <span className="shrink-0 font-mono text-[0.6875rem] font-semibold text-fg-subtle">
                      {station.code}
                    </span>
                  </span>
                </th>
                <td className="px-3 py-2.5 text-right tabular-nums text-fg-muted">
                  {station.scheduledTime}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-fg">
                  {station.predictedTime}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right">
                  <DelayBadge minutes={station.predictedDelayMinutes} size="sm" />
                  <DelayTrend minutes={station.delayTrendMinutes} />
                </td>
                <td className="px-5 py-2.5">
                  <StatusBadge status={station.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
