# RailSense

Passenger-facing web app for **dynamic Expected Time of Arrival (ETA) forecasting of Indian
Railways coaching trains**.

This repository contains the **landing page, search results, and the train journey
screen**. The ETA prediction engine and the Three.js map view are not implemented yet —
all forecasts shown are illustrative mock values.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Lucide React for icons
- Anime.js for the hero entrance and small micro-interactions
- Three.js + React Three Fiber — installed and ready for the future journey/map view;
  deliberately not used on the landing page

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint
```

## Layout of the source

```
src/
  components/
    home/      landing-page sections (hero, search forms, value strip, popular trains)
    journey/   TrainJourney, JourneyTimeline, JourneySegment, StationNode,
               IntermediateStations, TrainMarker, ETASummary, WhyThisETA,
               PerformanceMetrics, UpcomingStations
    results/   search-result row
    layout/    navbar, footer, skip link
    ui/        reusable primitives (Button, TextField, StationField, badges, …)
  context/     theme and language providers
  data/        mock stations, trains, journeys and page content
  hooks/       entrance animation, reduced-motion preference
  i18n/        English and Hindi copy
  lib/         class-name helper, search matching, Anime.js micro-interactions
  pages/       Home, Results, Journey
```

## Dynamic ETA model

Two different numbers, deliberately never conflated:

- `journey.current.delayMinutes` — how late the train is **right now**.
- `station.predictedDelayMinutes` — how late RailSense expects it to be **at that
  specific station**. For a passed station this is the observed delay; for one still
  ahead it is an independent forecast that can rise (congestion, restrictions, weather)
  or fall (expected recovery, running above booked speed).

A train can be +22 down now and forecast to arrive +19 — 12301 does exactly that.

Predicted arrival and departure times are **never stored**. `src/lib/eta.js` derives them
as `scheduled + predictedDelayMinutes`, so the invariant

    RailSense ETA − scheduled = displayed delay

holds by construction everywhere it is shown. The destination forecast in the header
comes from the destination station itself, so header and table cannot disagree.

That module is the replacement seam: a real prediction engine only needs to supply
`predictedDelayMinutes` per station, and every panel keeps working unchanged.

"Why this ETA?" explains the *gap* between the current delay and the destination
forecast — its factors sum to that difference, not to the whole delay.

## The journey timeline

`JourneyTimeline` draws one straight, continuous horizontal rail through a journey's
`majorStations`. The line between each pair is a `JourneySegment` button: clicking it
widens that segment with Anime.js and fades in the `intermediateStations` held on that
segment in `src/data/journeys.js`. One segment is open at a time, so the whole journey
stays readable when everything is closed.

The train marker is positioned from measured DOM geometry rather than assumed widths, so
it stays on the rail while a segment expands and when the viewport resizes.

Navigation between Home, Results and Journey is plain component state mirrored into
`history.pushState`, so the browser back button works. The URL is deliberately left
untouched — the landing page uses hash anchors for its sections.

## Notes

- Colours are CSS custom properties in `src/index.css`, mapped into Tailwind with
  `@theme inline`, so light and dark themes share one source of truth.
- The theme is applied by an inline script in `index.html` before first paint to avoid a flash.
- All data is mock data in `src/data/`. Searching filters those objects; nothing calls a
  backend. The "Why this ETA?" factors are illustrative placeholders, not model output,
  and the panel says so.
- Not affiliated with Indian Railways or IRCTC.
