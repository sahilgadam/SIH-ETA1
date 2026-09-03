import { useMemo } from 'react'
import { ArrowLeft, SearchX } from 'lucide-react'
import { TrainResultRow } from '../components/results/TrainResultRow'
import { useLanguage } from '../context/LanguageProvider'
import { useEntrance } from '../hooks/useEntrance'
import {
  findTrainsBetween,
  findTrainsByQuery,
  findTrainsFromStation,
  resolveStationCode,
} from '../lib/search'
import { Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'

/** Runs the search criteria against the mock journeys and lists what matched. */
function runSearch(criteria) {
  if (criteria.kind === 'route') {
    return findTrainsBetween(resolveStationCode(criteria.from), resolveStationCode(criteria.to))
  }
  if (criteria.kind === 'station') {
    return findTrainsFromStation(resolveStationCode(criteria.station))
  }
  return findTrainsByQuery(criteria.query)
}

/** The list of trains matching a search — the step between home and a journey. */
export function Results({ criteria, onSelectTrain, onBack }) {
  const { t } = useLanguage()
  const containerRef = useEntrance({ delay: 40, each: 50 })

  const results = useMemo(() => runSearch(criteria), [criteria])

  const { title, subtitle } = useMemo(() => {
    const count = results.length
    if (criteria.kind === 'route') {
      return {
        title: t('results.routeTitle', { from: criteria.from, to: criteria.to }),
        subtitle: t('results.routeSubtitle', { count }),
      }
    }
    if (criteria.kind === 'station') {
      return {
        title: t('results.stationTitle', { station: criteria.station }),
        subtitle: t('results.stationSubtitle', { count }),
      }
    }
    return {
      title: t('results.trainTitle', { query: criteria.query }),
      subtitle: t('results.trainSubtitle', { count }),
    }
  }, [criteria, results.length, t])

  return (
    <div ref={containerRef} className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
      <div data-enter>
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-3">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('results.back')}
        </Button>

        <Eyebrow as="p" className="mt-4">
          {t('results.timetableLabel')}
        </Eyebrow>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-tight text-fg sm:text-[1.75rem]">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-fg-muted">{subtitle}</p>
      </div>

      {results.length > 0 ? (
        <ul data-enter className="mt-5 overflow-hidden border border-line bg-surface">
          {results.map((result) => (
            <TrainResultRow
              key={result.journey.trainNumber}
              result={result}
              onSelect={onSelectTrain}
            />
          ))}
        </ul>
      ) : (
        <div
          data-enter
          className="mt-5 rounded-lg border border-line bg-surface px-5 py-10 text-center"
        >
          <SearchX className="mx-auto size-6 text-fg-subtle" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-fg">{t('results.emptyTitle')}</p>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-fg-muted">
            {t('results.emptyBody')}
          </p>
          <Button variant="secondary" size="md" onClick={onBack} className="mt-5">
            {t('results.emptyAction')}
          </Button>
        </div>
      )}

      <p data-enter className="mt-4 text-xs text-fg-subtle">
        {t('results.sampleNote')}
      </p>
    </div>
  )
}
