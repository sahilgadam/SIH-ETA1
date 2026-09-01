import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

/**
 * Scheduled arrival at the destination against the RailSense forecast for that
 * station. This is the predicted delay on arrival, not how late the train is now.
 */
export function ETASummary({ forecast, className }) {
  const { t } = useLanguage()
  const isLate = forecast.delayMinutes > 0
  const isEarly = forecast.delayMinutes < 0

  return (
    <section aria-labelledby="eta-title" className={cn('min-w-0', className)}>
      <h2 id="eta-title" className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
        {t('eta.title', { station: forecast.destinationName })}
      </h2>

      <dl className="mt-3 flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <dt className="text-xs text-fg-muted">{t('eta.scheduled')}</dt>
          <dd className="mt-0.5 text-2xl font-semibold tabular-nums leading-none text-fg-muted">
            {forecast.scheduled}
          </dd>
        </div>

        <ArrowRight className="mb-1 size-4 shrink-0 text-fg-subtle" aria-hidden="true" />

        <div>
          <dt className="text-xs font-medium text-brand">{t('eta.railSense')}</dt>
          <dd className="mt-0.5 text-3xl font-bold tabular-nums leading-none text-fg">
            {forecast.predicted}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-fg-muted">{t('eta.predictedDelay')}</dt>
          <dd
            className={cn(
              'mt-0.5 text-2xl font-semibold tabular-nums leading-none',
              isLate && 'text-danger',
              isEarly && 'text-brand',
              !isLate && !isEarly && 'text-brand',
            )}
          >
            {isLate ? `+${forecast.delayMinutes}` : isEarly ? forecast.delayMinutes : t('status.onTime')}
            {forecast.delayMinutes !== 0 ? (
              <span className="ml-1 text-sm font-medium">{t('unit.min')}</span>
            ) : null}
          </dd>
        </div>
      </dl>
    </section>
  )
}
