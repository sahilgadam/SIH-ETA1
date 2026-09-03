import { CloudRain } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { SourceBadge } from '../ui/SourceBadge'

/**
 * Weather, but only as a prediction input (§24).
 *
 * Rendered only when the run actually has a non-zero weather factor — the
 * caller passes `null` otherwise and nothing appears. The minute figure is the
 * same factor "Why this ETA?" itemises, never a second estimate.
 */
export function WeatherNote({ weather, className }) {
  const { t } = useLanguage()
  if (!weather) return null

  return (
    <section
      aria-labelledby="weather-title"
      className={cn('rounded-lg border border-line bg-surface p-5', className)}
    >
      <h2 id="weather-title" className="flex items-center gap-2 text-base font-bold text-fg">
        <CloudRain className="size-4 shrink-0 text-accent" aria-hidden="true" />
        {t('weather.title')}
      </h2>

      <p className="mt-3 text-sm leading-6 text-fg-muted">
        {t('weather.body', {
          condition: t(weather.conditionKey),
          station: weather.nearStationName,
        })}
      </p>

      <p className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <span className="text-sm text-fg">{t('weather.impact')}</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-danger">
          +{weather.impactMinutes} {t('unit.min')}
        </span>
      </p>

      <SourceBadge source="simulated" className="mt-3" />
    </section>
  )
}
