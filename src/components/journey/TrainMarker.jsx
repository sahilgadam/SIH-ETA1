import { TrainFront } from 'lucide-react'

/**
 * The train's position on the rail.
 *
 * The outer element carries no transform of its own. Anime.js slides it in on
 * first paint; after that `data-tracking="on"` hands movement to a CSS
 * transition, so following the simulation costs nothing per tick.
 */
export function TrainMarker({ markerRef, label }) {
  return (
    <div
      ref={markerRef}
      className="railsense-train-track pointer-events-none absolute left-0 top-1/2 z-30"
      style={{ willChange: 'transform' }}
    >
      <div className="flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="inline-flex items-center gap-1 rounded border border-brand bg-brand px-1.5 py-1 text-brand-fg shadow-sm">
          <TrainFront className="size-3.5" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </span>
        <span aria-hidden="true" className="h-2 w-px bg-brand" />
      </div>
    </div>
  )
}
