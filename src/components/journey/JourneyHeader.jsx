import { ArrowLeft, ArrowRight, CalendarDays, Radio } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { getForecast } from '../../lib/eta'
import { Button } from '../ui/Button'
import { ETASummary } from './ETASummary'

/** Train identity plus the headline ETA comparison, kept above the fold. */
export function JourneyHeader({ journey, onBack }) {
  const { t } = useLanguage()

  const forecast = getForecast(journey)
  const origin = journey.majorStations[0]
  const destination = journey.majorStations.at(-1)

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-3">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('journey.back')}
      </Button>

      <div className="mt-3 grid gap-5 rounded-lg border border-line bg-surface p-5 lg:grid-cols-12 lg:items-center">
        <div className="min-w-0 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-line bg-sunken px-2 py-1 font-mono text-sm font-semibold text-fg">
              {journey.trainNumber}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-soft px-2 py-1 text-xs font-semibold text-brand">
              <Radio className="size-3.5" aria-hidden="true" />
              {t('journey.running')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {journey.journeyDate}
            </span>
          </div>

          <h1 className="mt-2.5 text-xl font-bold tracking-tight text-fg sm:text-2xl">
            {journey.trainName}
          </h1>

          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fg-muted">
            <span>
              {origin.station}
              <span className="ml-1 font-mono text-xs text-fg-subtle">{origin.code}</span>
            </span>
            <ArrowRight className="size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
            <span>
              {destination.station}
              <span className="ml-1 font-mono text-xs text-fg-subtle">{destination.code}</span>
            </span>
            <span aria-hidden="true" className="text-fg-subtle">·</span>
            <span>{journey.current.totalDistanceKm} {t('unit.km')}</span>
          </p>
        </div>

        <ETASummary
          forecast={forecast}
          className="border-t border-line pt-4 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
        />
      </div>
    </div>
  )
}
