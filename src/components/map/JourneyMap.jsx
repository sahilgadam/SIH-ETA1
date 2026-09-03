import { Map as MapIcon } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { SourceBadge } from '../ui/SourceBadge'

// Leaflet and its CSS are ~150 kB and only the journey screen needs them, so
// they stay out of the landing-page bundle entirely.
const JourneyMapView = lazy(() => import('./JourneyMapView'))

function MapSkeleton({ label }) {
  return (
    <div
      role="status"
      className="flex h-[22rem] items-center justify-center rounded-lg border border-line bg-sunken sm:h-[26rem] lg:h-[30rem]"
    >
      <span className="flex items-center gap-2 text-sm text-fg-muted">
        <MapIcon className="size-4 animate-pulse" aria-hidden="true" />
        {label}
      </span>
    </div>
  )
}

/** The map section: heading, trust labels, legend, and the lazily-loaded map. */
export function JourneyMap({ journey, className }) {
  const { t } = useLanguage()

  return (
    <section aria-labelledby="map-title" className={cn('min-w-0', className)}>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <h2 id="map-title" className="text-base font-bold text-fg">
          {t('map.title')}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5 text-[0.6875rem] text-fg-muted">
            <span aria-hidden="true" className="h-0.5 w-5 shrink-0 rounded-full bg-brand" />
            {t('map.legendCovered')}
          </span>
          <span className="flex items-center gap-1.5 text-[0.6875rem] text-fg-muted">
            <span
              aria-hidden="true"
              className="h-0 w-5 shrink-0 border-t-2 border-dotted border-fg-subtle"
            />
            {t('map.legendAhead')}
          </span>
        </div>
      </div>

      <Suspense fallback={<MapSkeleton label={t('map.loading')} />}>
        <JourneyMapView journey={journey} />
      </Suspense>

      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-fg-subtle">
        <SourceBadge source="simulated" />
        {t('map.disclaimer')}
      </p>
    </section>
  )
}
