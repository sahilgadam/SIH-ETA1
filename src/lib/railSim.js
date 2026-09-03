/**
 * The RailSense timing engine.
 *
 * One engine produces every number the application shows: map position, speed,
 * delay, per-station predicted times, and the assistant's answers. Given the
 * same simulated minute it returns the same network, which is what keeps the
 * map marker, the station timeline and the spoken answer from disagreeing.
 *
 * HOW A DELAY PROPAGATES (§4)
 *
 * Nothing here is randomised per component. A train leaves its origin with a
 * departure delay, and every downstream time is *derived* from that by walking
 * the route forward:
 *
 *   actualDep[i]   = max(bookedDep[i], actualArr[i] + dwell)
 *   runTime[i]     = bookedRunTime[i] × (1 + congestion − slack)
 *   actualArr[i+1] = actualDep[i] + runTime[i]
 *   delay[i+1]     = actualArr[i+1] − bookedArr[i+1]
 *
 * So leaving 8 late arrives ~8 late unless something changes it; a congested
 * section pushes every later station out; and a late train that reaches a
 * section with slack — or clips a long booked dwell — gives time back and the
 * downstream delay falls. The chain is the model.
 *
 * WHY POSITIONS NEVER JUMP
 *
 * Section conditions come in two layers. The *base* congestion of a section is
 * fixed, so the running time of a section a train is already inside can never
 * change underneath it. A slow-moving *live* condition term is applied only to
 * sections the train has not yet entered — which is exactly where a real ETA
 * revision comes from ("conditions ahead have changed"). Predictions move;
 * the marker does not teleport.
 *
 * All data is simulated. See `data/liveTrains.js`.
 */

import { stationCoordinates } from '../data/coordinates'
import { liveTrains, majorStationCodes, stationNames } from '../data/liveTrains'
import { arcTable, nodeOffsets, toBezierSegments } from './geometry'

/** The simulated clock starts here, in minutes past midnight IST. */
export const SIM_START_MINUTES = 18 * 60 + 30

/**
 * Time spent accelerating (and again braking), in minutes.
 *
 * Deliberately absolute rather than a fraction of the section: a fraction
 * means a five-hour section spends three quarters of an hour accelerating and
 * the speed readout never settles, whereas real acceleration takes a few
 * minutes regardless of how long the run is. Capped so a very short section
 * still gets a sane profile.
 */
const RAMP_MINUTES = 3.5
const MAX_RAMP_FRACTION = 0.32

const rampFor = (runMin) => Math.min(RAMP_MINUTES / Math.max(runMin, 1), MAX_RAMP_FRACTION)
/** Shortest dwell a late train will hold for, in minutes. */
const MIN_DWELL = 1.5

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const formatClock = (minutes) => {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

/** Deterministic 0–1 hash, so "random-looking" values are stable and repeatable. */
function hash(...parts) {
  let h = 2166136261
  const s = parts.join('|')
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

// ---------------------------------------------------------------------------
// Route construction
// ---------------------------------------------------------------------------

/**
 * Resolve a train's stop list into absolute booked minutes, geometry, and a
 * section table. Done once per train at module load.
 */
function buildRoute(train) {
  const stops = train.stops.map(([code, arr, dep, km]) => {
    const coord = stationCoordinates[code]
    if (!coord) throw new Error(`No coordinates for station ${code} on train ${train.number}`)
    return {
      code,
      name: stationNames[code] ?? code,
      lat: coord[0],
      lng: coord[1],
      km,
      major: majorStationCodes.has(code),
      bookedArrText: arr,
      bookedDepText: dep,
    }
  })

  // Walk the timetable forward, rolling the day over whenever a time goes
  // backwards — an overnight service crosses midnight several times.
  let cursor = -Infinity
  let dayOffset = 0
  const resolve = (text) => {
    if (text == null) return null
    let abs = toMinutes(text) + dayOffset * 1440
    while (abs < cursor) {
      dayOffset += 1
      abs += 1440
    }
    cursor = abs
    return abs
  }

  for (const stop of stops) {
    stop.bookedArr = resolve(stop.bookedArrText)
    stop.bookedDep = resolve(stop.bookedDepText)
  }

  // Smooth the corridor through its stations so the drawn line reads as track
  // rather than as a zig-zag between points, and sample the *same* curve the
  // marker will ride.
  const points = stops.map((s) => ({ x: s.lng, y: s.lat }))
  const segments = toBezierSegments(points, 0.4)
  const table = arcTable(segments, 16)
  const offsets = nodeOffsets(segments, table, 16)
  stops.forEach((stop, i) => {
    stop.t = offsets[i]
  })

  const sections = []
  for (let i = 0; i < stops.length - 1; i += 1) {
    const from = stops[i]
    const to = stops[i + 1]
    const bookedRun = to.bookedArr - from.bookedDep
    const r = hash(train.number, 'sec', i)

    sections.push({
      index: i,
      from,
      to,
      km: to.km - from.km,
      bookedRunMin: Math.max(bookedRun, 1),
      // Fixed for the life of the section: this is what the train is running
      // in. Kept to single-digit percentages — on a three-hour section 4%
      // is already seven minutes, and long-distance delay compounds fast.
      congestion: r > 0.72 ? 0.015 + (r - 0.72) * 0.16 : 0,
      // Recovery capacity — only drawn on when the service is already late.
      slack: 0.008 + hash(train.number, 'slack', i) * 0.022,
      tFrom: from.t,
      tTo: to.t,
    })
  }

  return { stops, sections, table, segments }
}

/** Every route, built once. */
export const routes = new Map(
  liveTrains.map((train) => [train.number, { train, ...buildRoute(train) }]),
)

export const trainNumbers = liveTrains.map((t) => t.number)

/** The polyline for a route, as [lng, lat] pairs — ready for GeoJSON. */
export function routeCoordinates(number) {
  const route = routes.get(number)
  if (!route) return []
  return route.table.points.map((p) => [p.x, p.y])
}

/** Every distinct station across the fleet, for the map's station layer. */
export const networkStations = (() => {
  const byCode = new Map()
  for (const route of routes.values()) {
    for (const stop of route.stops) {
      if (!byCode.has(stop.code)) {
        byCode.set(stop.code, {
          code: stop.code,
          name: stop.name,
          lat: stop.lat,
          lng: stop.lng,
          major: stop.major,
          trains: [],
        })
      }
      byCode.get(stop.code).trains.push(route.train.number)
    }
  }
  return [...byCode.values()]
})()

export const stationByCode = new Map(networkStations.map((s) => [s.code, s]))

// ---------------------------------------------------------------------------
// Motion profile
// ---------------------------------------------------------------------------

/**
 * Distance covered (0–1) at time fraction `u` under a trapezoidal speed
 * profile: accelerate, cruise, brake. Endpoints are exact, so a train always
 * departs and arrives precisely on its computed times.
 */
function coveredAt(u, ramp) {
  const v = 1 / (1 - ramp)
  if (u <= ramp) return (v * u * u) / (2 * ramp)
  if (u <= 1 - ramp) return v * (ramp / 2 + (u - ramp))
  const w = 1 - u
  return 1 - (v * w * w) / (2 * ramp)
}

/** Normalised speed (0 at a stand, peak on the cruise) at time fraction `u`. */
function speedAt(u, ramp) {
  const v = 1 / (1 - ramp)
  if (u <= ramp) return (v * u) / ramp
  if (u <= 1 - ramp) return v
  return (v * (1 - u)) / ramp
}

// ---------------------------------------------------------------------------
// The propagation
// ---------------------------------------------------------------------------

/**
 * Walk the route forward and produce actual (simulated) times for every stop.
 * `liveFrom` is the first section index that the live condition term applies
 * to — everything before it is already under way and must not shift.
 */
function propagate(route, minutes, liveFrom) {
  const { stops, sections, train } = route
  const n = stops.length

  const actualArr = new Array(n).fill(null)
  const actualDep = new Array(n).fill(null)
  const runMin = new Array(sections.length).fill(0)

  actualDep[0] = stops[0].bookedDep + train.baseDelayMin

  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i]
    let factor = 1 + section.congestion

    // Conditions ahead: a slow, deterministic swing that only ever touches
    // sections this train has not entered yet.
    if (i >= liveFrom) {
      const phase = hash(train.number, 'live', i) * Math.PI * 2
      factor += Math.sin(minutes / 23 + phase) * 0.018 + Math.sin(minutes / 7.5 + phase * 1.6) * 0.008
    }

    const carriedDelay = actualDep[i] - stops[i].bookedDep
    if (carriedDelay > 0) factor -= section.slack // a late train uses its slack

    runMin[i] = Math.max(section.bookedRunMin * factor, 1)
    actualArr[i + 1] = actualDep[i] + runMin[i]

    // A service is not shown arriving before its booked time. Slack exists to
    // recover time already lost, not to put a train ahead of the timetable —
    // without this clamp a well-run service reports a negative variance, and
    // a connection window opens wider than it could really be.
    const bookedArr = stops[i + 1].bookedArr
    if (bookedArr != null && actualArr[i + 1] < bookedArr) {
      actualArr[i + 1] = bookedArr
      runMin[i] = actualArr[i + 1] - actualDep[i]
    }

    const next = stops[i + 1]
    if (next.bookedDep != null) {
      const bookedDwell = next.bookedDep - next.bookedArr
      const late = actualArr[i + 1] > next.bookedArr
      const dwell = late ? Math.min(bookedDwell, MIN_DWELL) : bookedDwell
      actualDep[i + 1] = Math.max(next.bookedDep, actualArr[i + 1] + dwell)
    }
  }

  return { actualArr, actualDep, runMin }
}

/** Which section (or dwell) the train occupies at `minutes`. */
function locate(route, times, minutes) {
  const { stops } = route
  const { actualArr, actualDep } = times

  if (minutes < actualDep[0]) return { kind: 'origin', index: 0 }

  for (let i = 0; i < stops.length - 1; i += 1) {
    if (minutes >= actualDep[i] && minutes < actualArr[i + 1]) return { kind: 'run', index: i }
    if (
      actualDep[i + 1] != null &&
      minutes >= actualArr[i + 1] &&
      minutes < actualDep[i + 1]
    ) {
      return { kind: 'dwell', index: i + 1 }
    }
  }
  return { kind: 'arrived', index: stops.length - 1 }
}

export function statusFor(delayMin) {
  if (delayMin <= 3) return 'on-time'
  if (delayMin <= 10) return 'watch'
  if (delayMin <= 25) return 'delayed'
  return 'critical'
}

/**
 * The complete state of one train at `minutes`.
 *
 * Services run on a repeating cycle so the map is never empty: a run that has
 * finished restarts a day later. `minutes` is simulated minutes since
 * SIM_START; everything returned is in absolute simulated minutes.
 */
export function trainStateAt(number, minutes) {
  const route = routes.get(number)
  if (!route) return null

  const { stops, sections, train } = route
  const clock = SIM_START_MINUTES + minutes

  // Loop the service: shift the clock into the run's own window.
  const first = stops[0].bookedDep
  const last = stops[stops.length - 1].bookedArr
  const span = last - first + 180 // a turnaround before it runs again
  let t = clock
  while (t < first) t += Math.ceil((first - t) / span) * span
  t = first + ((t - first) % span)

  // Pass 1 fixes where the train is; pass 2 lets conditions ahead move the
  // forecast without disturbing the section it is already inside.
  const pass1 = propagate(route, minutes, Number.POSITIVE_INFINITY)
  const where1 = locate(route, pass1, t)
  const liveFrom = where1.kind === 'run' ? where1.index + 1 : where1.index
  const times = propagate(route, minutes, liveFrom)
  const where = locate(route, times, t)

  const { actualArr, actualDep, runMin } = times

  let position
  let speedKmh = 0
  let phase
  let atStation = null
  let section = null
  let progressInSection = 0

  if (where.kind === 'run') {
    section = sections[where.index]
    const run = runMin[where.index]
    const ramp = rampFor(run)
    const u = Math.min(Math.max((t - actualDep[where.index]) / run, 0), 1)
    progressInSection = coveredAt(u, ramp)
    position = section.tFrom + (section.tTo - section.tFrom) * progressInSection
    speedKmh = Math.round(speedAt(u, ramp) * (section.km / run) * 60)
    phase = u <= ramp ? 'accelerating' : u >= 1 - ramp ? 'braking' : 'cruising'
  } else if (where.kind === 'dwell') {
    atStation = stops[where.index]
    position = atStation.t
    phase = 'dwell'
  } else if (where.kind === 'origin') {
    atStation = stops[0]
    position = stops[0].t
    phase = 'origin'
  } else {
    atStation = stops[stops.length - 1]
    position = atStation.t
    phase = 'arrived'
  }

  const idx = where.kind === 'run' ? where.index : where.index
  const prevStation = where.kind === 'run' ? stops[idx] : stops[Math.max(idx - 1, 0)]
  const nextStation =
    where.kind === 'run' ? stops[idx + 1] : stops[Math.min(idx + 1, stops.length - 1)]

  // Delay right now: measured at the last event that has actually happened.
  const refIndex = where.kind === 'run' ? where.index + 1 : where.index
  const bookedRef = stops[refIndex].bookedArr ?? stops[refIndex].bookedDep
  const delayMin = Math.max(0, Math.round((actualArr[refIndex] ?? actualDep[refIndex]) - bookedRef))

  const terminus = stops[stops.length - 1]
  const etaMinutes = actualArr[stops.length - 1]
  const destinationDelay = Math.max(0, Math.round(etaMinutes - terminus.bookedArr))

  // Per-station timeline (§5): booked vs predicted, and past/current/upcoming.
  const timeline = stops.map((stop, i) => {
    const arr = actualArr[i]
    const dep = actualDep[i]
    const booked = stop.bookedArr ?? stop.bookedDep
    const actual = arr ?? dep
    let state = 'upcoming'
    if (i < refIndex || (where.kind !== 'run' && i < where.index)) state = 'past'
    if (i === refIndex && where.kind !== 'run') state = 'current'
    if (where.kind === 'run' && i === where.index) state = 'past'
    if (where.kind === 'run' && i === where.index + 1) state = 'next'

    return {
      ...stop,
      state,
      bookedArrMin: stop.bookedArr,
      bookedDepMin: stop.bookedDep,
      predictedArrMin: arr,
      predictedDepMin: dep,
      // Clamped at zero: an early arrival is absorbed by the booked departure
      // (a train does not leave a station before its time), so reporting a
      // negative delay at a stop it has not reached would be misleading.
      delayMin:
        booked != null && actual != null ? Math.max(0, Math.round(actual - booked)) : 0,
    }
  })

  return {
    number: train.number,
    name: train.name,
    category: train.category,
    origin: stops[0],
    destination: terminus,
    stops,
    timeline,
    position,
    lat: null, // filled by positionOn() where geometry is needed
    phase,
    speedKmh,
    delayMin,
    destinationDelay,
    status: statusFor(delayMin),
    atStation,
    prevStation,
    nextStation,
    section: section
      ? {
          from: section.from,
          to: section.to,
          // Where this section sits along the route (0-1), so the map can
          // draw completed / current / remaining as three distinct states
          // from the same numbers the timeline uses.
          tFrom: section.tFrom,
          tTo: section.tTo,
          km: section.km,
          bookedRunMin: section.bookedRunMin,
          currentRunMin: Math.round(runMin[section.index]),
          congestion: section.congestion,
          signal: section.congestion > 0.16 ? 'red' : section.congestion > 0.06 ? 'amber' : 'green',
        }
      : null,
    progressInSection,
    progress: stops.length > 1 ? position : 0,
    etaMinutes,
    bookedArrivalMin: terminus.bookedArr,
    nextStationEtaMin: where.kind === 'run' ? actualArr[where.index + 1] : actualDep[where.index],
    simClock: clock,
  }
}

/** Geographic position of a train, as [lng, lat]. */
export function positionOf(state) {
  const route = routes.get(state.number)
  if (!route) return null
  const { table } = route
  const target = Math.min(Math.max(state.position, 0), 1) * table.length

  let lo = 0
  let hi = table.lengths.length - 1
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1
    if (table.lengths[mid] <= target) lo = mid
    else hi = mid
  }
  const span = table.lengths[hi] - table.lengths[lo] || 1
  const f = (target - table.lengths[lo]) / span
  const a = table.points[lo]
  const b = table.points[hi]

  return {
    lng: a.x + (b.x - a.x) * f,
    lat: a.y + (b.y - a.y) * f,
    // Screen bearing: 0° = north, clockwise, which is what MapLibre expects.
    bearing: (Math.atan2(b.x - a.x, b.y - a.y) * 180) / Math.PI,
  }
}

/** The whole fleet at `minutes`. */
export function networkAt(minutes) {
  return trainNumbers.map((number) => trainStateAt(number, minutes)).filter(Boolean)
}

/** Headline counts for the live header. */
export function summarise(trains) {
  const counts = { 'on-time': 0, watch: 0, delayed: 0, critical: 0 }
  for (const train of trains) counts[train.status] += 1
  const moving = trains.filter((t) => t.phase === 'cruising' || t.phase === 'accelerating' || t.phase === 'braking')
  return {
    counts,
    total: trains.length,
    running: moving.length,
    avgDelay: trains.reduce((s, t) => s + t.delayMin, 0) / (trains.length || 1),
    avgSpeed: moving.length ? Math.round(moving.reduce((s, t) => s + t.speedKmh, 0) / moving.length) : 0,
  }
}

/**
 * "In 18 min" rather than "at 06:30".
 *
 * `minutes` is simulated minutes since SIM_START; `target` is an absolute
 * simulated minute. Returns null once the moment has passed, so callers can
 * fall back to a plain clock time rather than printing "in -4 min".
 */
export function minutesUntil(targetMin, minutes) {
  const now = SIM_START_MINUTES + minutes
  const delta = Math.round(targetMin - now)
  return delta >= 0 ? delta : null
}

/** A short human phrasing of a wait: "18 min", "1 h 20 m". */
export function formatDuration(mins) {
  if (mins == null) return null
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h} h ${m} m` : `${h} h`
}

/** Services calling at a station, with their predicted times there (§7). */
export function callsAtStation(code, trains) {
  const calls = []
  for (const train of trains) {
    const stop = train.timeline.find((s) => s.code === code)
    if (!stop) continue
    calls.push({
      train,
      stop,
      predicted: stop.predictedArrMin ?? stop.predictedDepMin,
      booked: stop.bookedArrMin ?? stop.bookedDepMin,
      state: stop.state,
    })
  }
  return calls.sort((a, b) => (a.predicted ?? 0) - (b.predicted ?? 0))
}
