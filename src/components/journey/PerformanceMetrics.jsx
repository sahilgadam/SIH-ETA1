import { Clock, Gauge, MapPin, Route, TrendingUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

/**
 * Five figures about where the train is *now*. Deliberately kept apart from the
 * forecast panels: `current.delayMinutes` is how late it is at this moment, not
 * how late it is predicted to be anywhere ahead.
 */
export function PerformanceMetrics({ current, className }) {
  const { t } = useLanguage()

  const metrics = [
    {
      id: 'current-speed',
      icon: Gauge,
      label: t('metrics.currentSpeed'),
      value: `${current.speedKmph}`,
      unit: t('unit.kmph'),
      note: current.speedKmph === 0 ? t('metrics.halted', { station: current.haltedAt }) : null,
    },
    {
      id: 'average-speed',
      icon: TrendingUp,
      label: t('metrics.averageSpeed'),
      value: `${current.averageSpeedKmph}`,
      unit: t('unit.kmph'),
    },
    {
      id: 'current-delay',
      icon: Clock,
      label: t('metrics.currentDelay'),
      value: current.delayMinutes > 0 ? `+${current.delayMinutes}` : '0',
      unit: t('unit.min'),
      tone: current.delayMinutes > 0 ? 'late' : 'ok',
    },
    {
      id: 'distance-covered',
      icon: Route,
      label: t('metrics.distanceCovered'),
      value: `${current.distanceCoveredKm}`,
      unit: t('unit.km'),
    },
    {
      id: 'distance-remaining',
      icon: MapPin,
      label: t('metrics.distanceRemaining'),
      value: `${current.distanceRemainingKm}`,
      unit: t('unit.km'),
    },
  ]

  return (
    <section
      aria-labelledby="metrics-title"
      className={cn('rounded-lg border border-line bg-surface px-5 py-4', className)}
    >
      <h2 id="metrics-title" className="sr-only">
        {t('metrics.title')}
      </h2>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-line">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.id} className="min-w-0 lg:px-5 lg:first:pl-0 lg:last:pr-0">
              <dt className="flex items-center gap-1.5 text-xs text-fg-muted">
                <Icon className="size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
                {metric.label}
              </dt>
              <dd
                className={cn(
                  'mt-1 text-xl font-semibold tabular-nums leading-none',
                  metric.tone === 'late' ? 'text-danger' : 'text-fg',
                )}
              >
                {metric.value}
                <span className="ml-1 text-xs font-medium text-fg-muted">{metric.unit}</span>
              </dd>
              {metric.note ? (
                <p className="mt-1 truncate text-[0.6875rem] text-fg-subtle">{metric.note}</p>
              ) : null}
            </div>
          )
        })}
      </dl>
    </section>
  )
}
