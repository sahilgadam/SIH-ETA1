import { History } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { DelayBadge } from '../ui/DelayBadge'

/**
 * How this service has actually run recently (§25).
 *
 * Kept deliberately small and secondary: it exists to support trust in the
 * forecast above it, not to become a statistics panel. Every figure is derived
 * from the same list of recent arrivals, so nothing here is a separate claim.
 */
export function HistoricalReliability({ history, className }) {
  const { t } = useLanguage()
  if (!history) return null

  const worst = Math.max(...history.runs, 1)

  return (
    <section
      aria-labelledby="history-title"
      className={cn('rounded-lg border border-line bg-surface p-5', className)}
    >
      <h2 id="history-title" className="flex items-center gap-2 text-base font-bold text-fg">
        <History className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
        {t('history.title')}
      </h2>

      <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
        <div>
          <dt className="text-xs text-fg-muted">{t('history.typical')}</dt>
          <dd className="mt-1">
            <DelayBadge minutes={history.medianDelayMinutes} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-fg-muted">{t('history.variation')}</dt>
          <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-fg">
            ±{history.variationMinutes} {t('unit.min')}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-fg-muted">{t('history.lastRuns', { count: history.runs.length })}</p>

      {/* Most recent run first, matching the order the data is authored in. */}
      <ul className="mt-2 flex items-end gap-1.5" aria-hidden="true">
        {history.runs.map((minutes, index) => (
          <li key={index} className="flex-1">
            <span
              className="block rounded-sm bg-line-strong"
              style={{ height: `${Math.max(4, (minutes / worst) * 32)}px` }}
            />
          </li>
        ))}
      </ul>
      <p className="mt-1.5 font-mono text-[0.6875rem] tabular-nums text-fg-subtle">
        {history.runs.map((minutes) => `+${minutes}`).join(' · ')}
      </p>
    </section>
  )
}
