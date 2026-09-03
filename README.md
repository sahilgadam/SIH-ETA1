# RailSense

Passenger-facing web app for **dynamic Expected Time of Arrival (ETA) forecasting of Indian
Railways coaching trains**.

This repository contains the **landing page, search results, and the train journey
screen**, including the geographic map, voice search, delay recovery, ETA confidence,
connection protection and a **demo simulation** that drives all of them.

Everything runs on **mock data**. The forecast is a deterministic rule-based prototype —
no model is trained and none is called. The UI labels every figure with where it came
from (`Confirmed` / `Predicted` / `Simulated` / `Not available`) so nothing implies a live
Indian Railways feed.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Lucide React for icons
- Anime.js for the hero entrance and small micro-interactions
- Leaflet + React-Leaflet for the geographic map, lazily loaded so it stays out of the
  landing-page bundle

Three.js and React Three Fiber were removed: nothing in the app needed them, and they
were costing bundle size for no user-visible benefit.

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
               PerformanceMetrics, UpcomingStations, DelayRecovery,
               ETAConfidence, WeatherNote, HistoricalReliability,
               ConnectionProtection, PassengerSummary, SimulationControls
    map/       JourneyMap (lazy boundary), JourneyMapView (Leaflet), mapTheme
    voice/     VoiceSearch
    results/   search-result row
    layout/    navbar, footer, skip link
    ui/        reusable primitives (Button, TextField, StationField, badges, …)
  context/     theme and language providers
  data/        mock stations, trains, journeys, station coordinates,
               onward departures, and page content
  hooks/       useSimulation (the one clock), entrance, reduced-motion
  i18n/        English and Hindi copy
  lib/         simulation (the dynamic layer), eta (times),
               prediction (recovery/confidence/connections/summary/why),
               geo (map geometry), integrity (invariants), voiceIntent,
               speech, trust, search, motion, cn
  pages/       Home, Results, Journey
```

## Dynamic ETA model

Two different numbers, deliberately never conflated:

- `journey.current.delayMinutes` — how late the train is **right now**.
- `station.predictedDelayMinutes` — how late RailSense expects it to be **at that
  specific station**. For a passed station this is the observed delay; for one still
  ahead it is an independent forecast that can rise (congestion, restrictions, weather)
  or fall (expected recovery, running above booked speed).

A train can be +22 down now and forecast to arrive +19 — 12301 does exactly that at rest,
and the gap between the two numbers widens and narrows as the simulation runs.

Predicted arrival and departure times are **never stored**. `src/lib/eta.js` derives them
as `scheduled + predictedDelayMinutes`, so the invariant

    RailSense ETA − scheduled = displayed delay

holds by construction everywhere it is shown. The destination forecast in the header
comes from the destination station itself, so header and table cannot disagree.

That module is the replacement seam, and the simulation is the proof that it works: a
prediction engine only has to supply `predictedDelayMinutes` per station, and every panel
follows. A real model would slot in exactly where `src/lib/simulation.js` sits today.

"Why this ETA?" explains the *gap* between the current delay and the destination
forecast — its factors sum to that difference, not to the whole delay.

## The geographic map

`src/components/map/` draws the journey on a real slippy map (Leaflet over
OpenStreetMap-derived tiles), not an SVG mock-up. Route behind the train is solid;
**route ahead is dashed**, because every time on it is a forecast rather than an
observation.

The train marker is **not** stored as a coordinate. `src/lib/geo.js` interpolates it from
`current.distanceCoveredKm` against each station's `distanceFromOriginKm`, so the map
marker, the "distance covered" metric and the timeline marker are three readings of one
number. A train whose covered distance lands exactly on a station is reported as standing
at it, not as being between it and the previous one.

Station coordinates in `src/data/coordinates.js` are hand-authored to roughly a
kilometre — enough for the line to trace the real geography of India, not enough to place
a platform. They are labelled `Simulated` in the UI. Because the map draws straight
segments between consecutive stations, a station listed out of running order visibly
zigzags; that is how the Ankleshwar/Bharuch ordering bug in the original mock data was
found.

The map needs a network connection for tiles. Everything else in the app works offline.

## Prediction, and the one source of truth

`src/lib/eta.js` produces the times. `src/lib/prediction.js` produces everything the
screen *says about* them, all derived from the same `prediction.factors`:

- **Delay recovery** splits the factors into what the train is expected to lose and what
  it is expected to make back, so `current + additional − recovery = destination delay`
  holds exactly. The recovery panel and "Why this ETA?" are the same arithmetic shown
  twice — once grouped, once itemised.
- **Weather** reads the `weather` factor itself, and the panel is hidden entirely when
  that factor is zero. There is no separate weather estimate to disagree with the table.
- **Confidence** is High/Medium/Low, never a fabricated percentage. It is the one place a
  label changes a decision: its margin (5/10/18 min) is what a connection has to survive
  to be called safe.
- **Historical reliability** is derived from the last five arrival delays, so the median
  and the ± spread cannot contradict the bars beside them.
- **The passenger summary** is composed from the live forecast as a list of translation
  keys, never a hardcoded sentence.

## Connection protection

The passenger types the number of the train they are changing onto. The check is against
the **RailSense predicted arrival**, never the current delay:

    buffer        = connection departure − predicted arrival
    usable buffer = buffer − 10 minutes to physically change trains
    safe          = usable buffer survives the confidence margin

which gives four outcomes — safe, at risk, high risk, and already departed. A number we
hold no departure for returns `unavailable` and the panel says so rather than inventing a
risk. Onward departures live in `src/data/connections.js`; the numbers and names are real
services but the times are authored for the prototype, and the UI marks them `Simulated`.

All four outcomes are reachable in the demo — e.g. on 12951 (predicted 08:46 at New
Delhi): `12045` is high risk, `12015` at risk, `12057` safe, `12017` already gone.

## Voice — "Where's my train?"

A microphone button on the landing page and on the journey screen, not a separate page
and not a chatbot. `src/lib/voiceIntent.js` recognises three requests — where a train is,
when it reaches a named station, and how late it is — and answers each by reading the same
forecast the screen renders. `answerVoiceQuery` returns a translation key, so the spoken
answer and the displayed answer are the same string by construction. Anything it does not
recognise says so.

Digits are collected across the whole transcript, because recognisers return "12951",
"1 2 9 5 1" and "129 51" for the same utterance.

Speech recognition only exists in Chromium browsers. When it is missing, or the microphone
is refused, the panel says which and points at the typed search that is already on the
page — the app never breaks.

## The simulation

Press **Start** on a journey and the train runs. The map marker, the timeline marker,
the metrics, the station table, "Why this ETA?", confidence and connection risk all move
together, because they are all reading the same object.

`src/lib/simulation.js` is a **pure function**: `simulateJourney(base, elapsedMinutes)`
returns a *journey-shaped* object. That shape is the whole integration strategy — every
existing consumer keeps using `getForecast`, `getRoute`, `getRouteGeometry`,
`assessConnection` exactly as before, and none of them knows a simulation exists.

    base journey  →  useSimulation  →  journey (this render's truth)
                                         │
     ┌──────────┬──────────┬─────────────┼─────────────┬───────────┐
    map      timeline   metrics    station table   why / recovery
                                         │
                             confidence · connection · summary · voice

`src/hooks/useSimulation.js` holds **one interval and one number**, the elapsed simulated
minutes. Everything else is derived from it. Because the derivation is pure and nothing
accumulates across ticks:

- the same elapsed always produces the same state, so **Reset is exact**;
- a dropped or slow frame cannot make the panels drift apart;
- speed is `v₀·(1 + A·sin(2πt/P + φ))` and position is its **exact integral**, so the
  odometer and the speedometer can never disagree, and `A < 1` is what guarantees the
  train can never move backwards.

### How the delay evolves

The authored `predictedDelayMinutes` are no longer displayed. They are the route's
**baseline delay curve** — where this line loses and gains time — and the engine
integrates it forward from wherever the train actually is:

    section delta   = baseline[i+1] − baseline[i]     (only the part still ahead)
    contribution    = delta × factor share × factor multiplier(t)
    station delay   = current delay + Σ contributions up to that station

Factor *shares* come from the journey's own factor mix, so a minute lost on a section is
attributed to congestion, a restriction or the weather in the proportions that route
actually has. Each factor then runs on its own slow rhythm, every multiplier being exactly
1 at elapsed 0 — the simulation starts from the journey's stated conditions and diverges
from there.

A separate drift term moves the train's *actual* delay away from the baseline, which is
the point: without it the train would arrive exactly as first forecast and the forecast
would be worth nothing.

Two consequences worth stating: the delay is **not** propagated flat, and the forecast
genuinely rises, falls and fluctuates. On 12951 at rest the table reads +8, +9, +11, +12,
+12, +11, +10, +12, +14 across the remaining stations; thirty simulated minutes later it
reads something else, and the paragraph above it has been rewritten to match.

### Keeping the arithmetic honest

The factors are rounded together by largest-remainder so they still sum to the change they
explain. Since the current delay is already an integer, that makes

    current + additional − recovery = destination delay

exact at every point in the run, and the destination row of the table is by construction
the same number as the header.

Confidence is derived, never authored and never random: it follows how many minutes are
still in play ahead and how far conditions have wandered from nominal, so it rises as the
train nears its destination and falls when the factors start swinging. The reason text
under it names whichever driver is actually dominant.

A train that has arrived stops getting later — the conditions clock freezes at the moment
it reached the destination. (That was a real bug: without it the arrival delay kept
drifting after the train had stopped, and 2227 invariant checks failed.)

### Invariants

`src/lib/integrity.js` holds the promises the screen makes: predicted time matches the
delay printed beside it, the factors reconcile with the destination, covered + remaining =
total, the train stays inside its timeline segment, a passed station is never listed as
upcoming, and a connection verdict came from the *predicted* arrival. `assertJourneyInDev`
runs them on every render in development and is compiled out of production.

They are checked across the whole timeline, not just at rest: 5,403 simulated states
across the three trains, every invariant holding, no backward movement, and reset
reproducing the starting state exactly.

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
- Leaflet paints onto an SVG overlay and cannot read Tailwind classes, so the route
  colours in `src/components/map/mapTheme.js` mirror the tokens as literals. They are not
  `getComputedStyle` reads, because the `.dark` class is applied in an effect and reading
  during render would pick up the previous theme.
- All data is mock data in `src/data/`. Searching filters those objects; nothing calls a
  backend. The "Why this ETA?" factors are illustrative placeholders, not model output,
  and the panel says so.
- Both languages are kept at full key parity (285 keys each); a missing Hindi string
  falls back to English rather than rendering a raw key.
- `t()` picks a `<key>.one` variant when `minutes` is exactly 1, so generated sentences
  never read "1 minutes". Hindi's मिनट does not inflect, so its `.one` entries are the
  plural text verbatim — they exist only so a Hindi reader never falls through to English.
- Not affiliated with Indian Railways or IRCTC. Nothing here reads a live NTES or IRCTC
  feed, and no machine-learning model is trained or called.

## Not built yet

From the specification, still outstanding: smart alerts on prediction change, follow /
save a train, and recurring journeys. All three now have an obvious hook — alerts only
need to watch the destination ETA and the connection buffer that the simulation is
already moving.
