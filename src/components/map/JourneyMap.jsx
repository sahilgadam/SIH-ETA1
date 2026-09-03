import { lazy, Suspense } from 'react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { routes } from '../../lib/railSim'
import { SourceBadge } from '../ui/SourceBadge'

// MapLibre is ~250 kB gzipped and only the map screens need it.
const RailMap = lazy(() => import('./RailMap').then((m) => ({ default: m.RailMap })))

/**
 * The journey screen's map.
 *
 * This used to be a separate Leaflet map over OpenStreetMap raster tiles,
 * which meant the app shipped two map libraries and two visual languages —
 * a generic slippy map here and the RailSense map everywhere else. It now
 * renders the same `RailMap` with this service preselected, so the route
 * drawing, the covered-distance line and the moving marker are the ones the
 * rest of the product uses.
 */
function MapSkeleton({ label }) {
  return (
    <div
      role="status"
      className="flex h-[22rem] items-center justify-center border border-line bg-sunken sm:h-[26rem] lg:h-[30rem]"
    >
      <span className="font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        {label}
      </span>
    </div>
  )
}

export function JourneyMap({ journey, className }) {
  const { t } = useLanguage()

  // Only services the simulation actually runs can be traced on the map.
  const traceable = routes.has(journey.trainNumber)

  return (
    <section aria-labelledby="map-title" className={cn('min-w-0', className)}>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <h2 id="map-title" className="text-base font-bold text-fg">
          {t('map.title')}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5 text-[0.6875rem] text-fg-muted">
            <span aria-hidden="true" className="h-0.5 w-5 shrink-0 bg-brand" />
            {t('map.legendCovered')}
          </span>
          <span className="flex items-center gap-1.5 text-[0.6875rem] text-fg-muted">
            <span aria-hidden="true" className="h-0.5 w-5 shrink-0 bg-brass" />
            {t('map.legendAhead')}
          </span>
        </div>
      </div>

      <div className="relative h-[22rem] overflow-hidden border border-line sm:h-[26rem] lg:h-[30rem]">
        {traceable ? (
          <Suspense fallback={<MapSkeleton label={t('map.loading')} />}>
            <RailMap
              className="absolute inset-0"
              selectedTrain={journey.trainNumber}
              onSelectTrain={() => {}}
              onSelectStation={() => {}}
            />
          </Suspense>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-sm text-fg-muted">{t('map.disclaimer')}</p>
          </div>
        )}
      </div>

      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-fg-subtle">
        <SourceBadge source="simulated" />
        {t('map.disclaimer')}
      </p>
    </section>
  )
}
