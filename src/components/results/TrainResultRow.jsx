import { ArrowRight, ChevronRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { getForecast } from '../../lib/eta'
import { DelayBadge } from '../ui/DelayBadge'

/** One matching train in the results list. Selecting it opens the journey. */
export function TrainResultRow({ result, onSelect }) {
  const { t } = useLanguage()
  const { journey, boardingAt, alightingAt } = result
  const forecast = getForecast(journey)

  return (
    <li className="min-w-0 border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => onSelect(journey.trainNumber)}
        className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-150 hover:bg-sunken active:bg-sunken sm:px-5"
      >
        <span className="shrink-0 rounded-md border border-line bg-sunken px-2 py-1 font-mono text-sm font-semibold text-fg">
          {journey.trainNumber}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-fg">{journey.trainName}</span>

          <span className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-fg-muted">
            <span className="tabular-nums">
              <span className="font-semibold text-fg">
                {boardingAt.scheduledDeparture ?? boardingAt.scheduledArrival}
              </span>
              <span className="ml-1 font-mono text-fg-subtle">{boardingAt.code}</span>
            </span>
            <ArrowRight className="size-3 shrink-0 text-fg-subtle" aria-hidden="true" />
            <span className="tabular-nums">
              <span className="font-semibold text-fg">
                {alightingAt.scheduledArrival ?? alightingAt.scheduledDeparture}
              </span>
              <span className="ml-1 font-mono text-fg-subtle">{alightingAt.code}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{journey.runsOn}</span>
          </span>
        </span>

        <span className="hidden shrink-0 text-right sm:block">
          <span className="block text-xs text-fg-muted">{t('results.forecast')}</span>
          <span className="mt-0.5 block text-sm font-semibold tabular-nums text-fg">
            {forecast.predicted}
          </span>
          <DelayBadge minutes={forecast.delayMinutes} size="sm" className="mt-1" />
        </span>

        <ChevronRight
          className="size-4 shrink-0 text-fg-subtle transition-colors duration-150 group-hover:text-fg"
          aria-hidden="true"
        />
      </button>
    </li>
  )
}
