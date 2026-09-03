/**
 * The dynamic layer over a static journey.
 *
 * `simulateJourney(base, elapsedMinutes)` returns a journey-shaped object with
 * the position, delay, per-station forecast, factors and confidence advanced to
 * that point in simulated time. Because the shape is unchanged, every existing
 * consumer — the Leaflet map, the timeline, the upcoming-stations table,
 * connection protection, voice — keeps reading from `journey` and needs no
 * knowledge that a simulation exists at all.
 *
 * ONE SOURCE OF TRUTH, and it is a pure function.
 *
 * Everything is derived from the single scalar `elapsedMinutes`. Nothing is
 * accumulated across ticks and nothing is random, so:
 *   - the same elapsed always produces the same state (reset is exact),
 *   - a dropped or late frame cannot make the state drift,
 *   - the train can never move backwards.
 *
 * The authored `predictedDelayMinutes` in `src/data/journeys.js` are no longer
 * displayed directly. They are the *baseline delay curve* for the route — the
 * shape of where this line loses and gains time — which the engine integrates
 * forward from wherever the train actually is.
 */

import { getHistory } from './prediction'

const TAU = Math.PI * 2

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// ---------------------------------------------------------------------------
// Motion
//
// Speed is v(t) = v0 · (1 + A·sin(2πt/P + φ)) and position is its exact
// integral, so the odometer and the speedometer can never disagree. A < 1 keeps
// speed strictly positive, which is what guarantees the train never reverses.
// ---------------------------------------------------------------------------

const SPEED_WOBBLE = 0.22
const SPEED_PERIOD_MIN = 47

/** Phase chosen so the first displayed speed matches the journey's own figure. */
function speedPhase(journey) {
  const ratio = journey.current.speedKmph / journey.current.averageSpeedKmph - 1
  return Math.asin(clamp(ratio / SPEED_WOBBLE, -1, 1))
}

const speedAt = (v0, phase, t) => v0 * (1 + SPEED_WOBBLE * Math.sin((TAU * t) / SPEED_PERIOD_MIN + phase))

/** ∫₀ᵗ v/60 dt — kilometres covered since the simulation started. */
function distanceAt(v0, phase, t) {
  const k = TAU / SPEED_PERIOD_MIN
  const wobble = (SPEED_WOBBLE / k) * (Math.cos(phase) - Math.cos(k * t + phase))
  return (v0 / 60) * (t + wobble)
}

/**
 * Inverse of `distanceAt` by bisection. Used to date a station the train passed
 * during the run, so its observed delay is the delay it had *when it got there*
 * rather than the delay right now.
 */
function elapsedAtDistance(v0, phase, km) {
  if (km <= 0) return 0
  let low = 0
  let high = ((km * 60) / (v0 * (1 - SPEED_WOBBLE))) + SPEED_PERIOD_MIN

  for (let i = 0; i < 40; i += 1) {
    const mid = (low + high) / 2
    if (distanceAt(v0, phase, mid) < km) low = mid
    else high = mid
  }
  return (low + high) / 2
}

// ---------------------------------------------------------------------------
// Conditions
//
// Each factor runs on its own slow rhythm. Every multiplier is exactly 1 at
// elapsed 0, so the simulation starts from the journey's stated conditions and
// diverges from there. Periods are deliberately unrelated so the combination
// does not visibly repeat during a demo.
// ---------------------------------------------------------------------------

const RHYTHMS = {
  congestion: { amplitude: 0.55, periodMin: 95 },
  'speed-restriction': { amplitude: 0.4, periodMin: 143 },
  weather: { amplitude: 0.5, periodMin: 176 },
  history: { amplitude: 0, periodMin: 1 },
  recovery: { amplitude: 0.45, periodMin: 121 },
  'running-speed': { amplitude: 0.35, periodMin: 88 },
}

const multiplierFor = (id, t) => {
  const rhythm = RHYTHMS[id]
  if (!rhythm || rhythm.amplitude === 0) return 1
  return Math.max(0, 1 + rhythm.amplitude * Math.sin((TAU * t) / rhythm.periodMin))
}

/** How far conditions have wandered from nominal. 0 at the start of the run. */
const volatilityAt = (t) =>
  ['congestion', 'speed-restriction', 'weather', 'recovery'].reduce(
    (total, id) => total + Math.abs(multiplierFor(id, t) - 1),
    0,
  )

/**
 * How the train's *actual* running diverges from the route's baseline curve.
 * This is what makes the forecast worth having: without it the train would
 * simply arrive exactly as first predicted.
 */
const DRIFT_MINUTES = 4.5
const DRIFT_PERIOD_MIN = 67
const driftAt = (t) => DRIFT_MINUTES * Math.sin((TAU * t) / DRIFT_PERIOD_MIN)

// ---------------------------------------------------------------------------
// Route helpers
// ---------------------------------------------------------------------------

/** Every station in running order, each knowing where it lives in the journey. */
function routeSlots(journey) {
  const slots = []
  journey.majorStations.forEach((station, mi) => {
    slots.push({ station, kind: 'major', mi })
    journey.segments[mi]?.intermediateStations.forEach((intermediate, ii) => {
      slots.push({ station: intermediate, kind: 'intermediate', mi, ii })
    })
  })
  return slots
}

/** The baseline delay curve, interpolated between stations by distance. */
function baselineDelayAt(slots, km) {
  if (km <= slots[0].station.distanceFromOriginKm) return slots[0].station.predictedDelayMinutes

  for (let i = 1; i < slots.length; i += 1) {
    const previous = slots[i - 1].station
    const next = slots[i].station
    if (km > next.distanceFromOriginKm) continue

    const span = next.distanceFromOriginKm - previous.distanceFromOriginKm
    const ratio = span > 0 ? (km - previous.distanceFromOriginKm) / span : 1
    return (
      previous.predictedDelayMinutes +
      (next.predictedDelayMinutes - previous.predictedDelayMinutes) * ratio
    )
  }
  return slots.at(-1).station.predictedDelayMinutes
}

/**
 * Splits the journey's authored factors into the share of lost time and the
 * share of recovered time each one accounts for. These shares are what turns a
 * section's raw baseline delta into named, explainable minutes.
 */
function attribution(journey) {
  const factors = journey.prediction.factors
  const positives = factors.filter((factor) => factor.minutes > 0)
  const negatives = factors.filter((factor) => factor.minutes < 0)

  const lossTotal = positives.reduce((total, factor) => total + factor.minutes, 0)
  const gainTotal = -negatives.reduce((total, factor) => total + factor.minutes, 0)

  // A journey with no factor of one sign attributes that sign to a sensible
  // default rather than silently dropping the minutes.
  const loss = positives.length
    ? positives.map((f) => ({ id: f.id, labelKey: f.labelKey, share: f.minutes / lossTotal }))
    : [{ id: 'congestion', labelKey: 'why.congestion', share: 1 }]
  const gain = negatives.length
    ? negatives.map((f) => ({ id: f.id, labelKey: f.labelKey, share: -f.minutes / gainTotal }))
    : [{ id: 'recovery', labelKey: 'why.recovery', share: 1 }]

  return { loss, gain, order: factors.map((f) => ({ id: f.id, labelKey: f.labelKey })) }
}

/**
 * Rounds a set of values to integers whose sum is the rounded total.
 *
 * Without this the itemised factors could sum to one minute more or less than
 * the destination delay they are supposed to explain, and the arithmetic the
 * recovery panel promises would visibly fail.
 */
function roundPreservingSum(values) {
  const target = Math.round(values.reduce((total, value) => total + value, 0))
  const floors = values.map(Math.floor)
  const shortfall = target - floors.reduce((total, value) => total + value, 0)

  const order = values
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)

  const result = [...floors]
  for (let i = 0; i < shortfall; i += 1) result[order[i % order.length].index] += 1
  return result
}

// ---------------------------------------------------------------------------
// The engine
// ---------------------------------------------------------------------------

/** Distance either side of a station within which the train counts as "at" it. */
const AT_STATION_KM = 1.5

/**
 * The journey as it stands after `elapsedMinutes` of simulated running.
 *
 * At elapsed 0 the position, speed and station statuses are the journey's own
 * authored values, so a reset lands exactly back where the demo started.
 */
export function simulateJourney(base, elapsedMinutes = 0) {
  const slots = routeSlots(base)
  const totalKm = base.current.totalDistanceKm
  const startKm = base.current.distanceCoveredKm
  const v0 = base.current.averageSpeedKmph
  const phase = speedPhase(base)

  const t = Math.max(0, elapsedMinutes)
  const isStart = t === 0

  const trainKm = clamp(startKm + distanceAt(v0, phase, t), startKm, totalKm)
  const hasArrived = trainKm >= totalKm

  // A train that has arrived stops getting later. Freezing the clock at the
  // moment it reached the destination keeps its arrival delay fixed, and keeps
  // it equal to the observed delay recorded against the destination station.
  const arrivalMinutes = hasArrived ? elapsedAtDistance(v0, phase, totalKm - startKm) : t
  const conditionsAt = Math.min(t, arrivalMinutes)

  // The route's baseline curve is offset so that it agrees with the delay the
  // journey says the train has right now. Without this the first simulated tick
  // would jump the delay to whatever the curve happens to say at that km.
  const baselineOffset = base.current.delayMinutes - baselineDelayAt(slots, startKm)

  const delayAtKm = (km, at) =>
    baselineDelayAt(slots, km) + baselineOffset + driftAt(Math.min(at, arrivalMinutes))

  const currentDelayMinutes = isStart
    ? base.current.delayMinutes
    : Math.round(delayAtKm(trainKm, conditionsAt))

  // --- Forecast ahead -------------------------------------------------------
  // Integrate the baseline curve forward from the train, scaling each section's
  // lost and recovered minutes by how its factors are currently running.

  const attr = attribution(base)
  const totals = new Map(attr.order.map((factor) => [factor.id, 0]))
  const forecast = new Map() // slot index -> unrounded cumulative delay
  let cumulative = 0

  for (let i = 0; i < slots.length - 1; i += 1) {
    const from = slots[i].station
    const to = slots[i + 1].station
    if (to.distanceFromOriginKm <= trainKm) continue

    const span = to.distanceFromOriginKm - from.distanceFromOriginKm
    // Only the part of this section the train has not run yet is forecast.
    const ahead = span > 0 ? clamp((to.distanceFromOriginKm - Math.max(trainKm, from.distanceFromOriginKm)) / span, 0, 1) : 1
    const delta = (to.predictedDelayMinutes - from.predictedDelayMinutes) * ahead

    const shares = delta >= 0 ? attr.loss : attr.gain
    for (const factor of shares) {
      const minutes = delta * factor.share * multiplierFor(factor.id, conditionsAt)
      totals.set(factor.id, totals.get(factor.id) + minutes)
      cumulative += minutes
    }

    forecast.set(i + 1, cumulative)
  }

  // Round the factors together so they still sum to the change they explain.
  const factorIds = attr.order.map((factor) => factor.id)
  const rounded = roundPreservingSum(factorIds.map((id) => totals.get(id)))
  const factors = attr.order.map((factor, index) => ({
    id: factor.id,
    labelKey: factor.labelKey,
    minutes: rounded[index],
  }))
  const netChangeMinutes = rounded.reduce((total, value) => total + value, 0)

  // --- Rebuild the stations -------------------------------------------------

  const resolved = new Map()
  slots.forEach((slot, index) => {
    const km = slot.station.distanceFromOriginKm
    let status
    if (km > trainKm + AT_STATION_KM) status = 'upcoming'
    else if (km < trainKm - AT_STATION_KM) status = 'completed'
    else status = hasArrived ? 'completed' : 'current'

    let predictedDelayMinutes
    if (km <= startKm) {
      // Passed before the simulation began: keep what the journey recorded.
      predictedDelayMinutes = slot.station.predictedDelayMinutes
    } else if (km <= trainKm) {
      // Passed during the run: the delay it actually had on arrival there.
      predictedDelayMinutes = Math.round(
        delayAtKm(km, elapsedAtDistance(v0, phase, km - startKm)),
      )
    } else if (index === slots.length - 1) {
      // The destination is the factors' own answer, so the header and the last
      // row of the table are the same number by construction.
      predictedDelayMinutes = currentDelayMinutes + netChangeMinutes
    } else {
      predictedDelayMinutes = currentDelayMinutes + Math.round(forecast.get(index) ?? 0)
    }

    resolved.set(index, { ...slot.station, status, predictedDelayMinutes })
  })

  const majorStations = []
  const segmentStations = new Map()
  slots.forEach((slot, index) => {
    const station = resolved.get(index)
    if (slot.kind === 'major') majorStations.push(station)
    else {
      if (!segmentStations.has(slot.mi)) segmentStations.set(slot.mi, [])
      segmentStations.get(slot.mi).push(station)
    }
  })

  // --- Position for the timeline -------------------------------------------

  let segmentIndex = 0
  for (let i = 0; i < majorStations.length - 1; i += 1) {
    if (majorStations[i].distanceFromOriginKm <= trainKm) segmentIndex = i
  }
  const from = majorStations[segmentIndex]
  const to = majorStations[segmentIndex + 1]
  const segmentSpan = to.distanceFromOriginKm - from.distanceFromOriginKm
  const progress = segmentSpan > 0 ? clamp((trainKm - from.distanceFromOriginKm) / segmentSpan, 0, 1) : 0

  // --- Live metrics ---------------------------------------------------------

  const hoursRunAtStart = startKm > 0 ? startKm / v0 : 0
  const hoursRun = hoursRunAtStart + t / 60
  const distanceCoveredKm = Math.round(trainKm)

  const current = isStart
    ? { ...base.current }
    : {
        ...base.current,
        segmentIndex,
        progress,
        delayMinutes: currentDelayMinutes,
        speedKmph: hasArrived ? 0 : Math.round(speedAt(v0, phase, t)),
        averageSpeedKmph: hoursRun > 0 ? Math.round(distanceCoveredKm / hoursRun) : v0,
        distanceCoveredKm,
        distanceRemainingKm: totalKm - distanceCoveredKm,
        haltedAt: hasArrived ? majorStations.at(-1).station : undefined,
      }

  return {
    ...base,
    status: hasArrived ? 'arrived' : base.status,
    majorStations,
    segments: base.segments.map((segment, mi) => ({
      ...segment,
      intermediateStations: segmentStations.get(mi) ?? [],
    })),
    current,
    prediction: { ...base.prediction, factors },
    outlook: { ...base.outlook, ...deriveConfidence(base, factors, conditionsAt) },
    simulation: {
      elapsedMinutes: t,
      hasArrived,
      volatility: volatilityAt(conditionsAt),
      driftMinutes: driftAt(conditionsAt),
      progressAlongRoute: totalKm > 0 ? trainKm / totalKm : 0,
    },
  }
}

// ---------------------------------------------------------------------------
// Confidence, derived rather than authored
// ---------------------------------------------------------------------------

const CONFIDENCE_BANDS = { high: 2.5, medium: 5 }

/**
 * Confidence follows two things a passenger would recognise: how many minutes
 * are still in play ahead of the train, and how unsettled conditions currently
 * are. It therefore rises naturally as the train nears its destination and
 * falls when the factors start swinging — never at random.
 */
function deriveConfidence(base, factors, elapsed) {
  const lossAhead = factors.filter((f) => f.minutes > 0).reduce((n, f) => n + f.minutes, 0)
  const gainAhead = -factors.filter((f) => f.minutes < 0).reduce((n, f) => n + f.minutes, 0)
  const inPlay = lossAhead + gainAhead
  const volatility = volatilityAt(elapsed)
  const history = getHistory(base)

  const score =
    (inPlay * (0.55 + 0.45 * volatility)) / 4 +
    (history?.variationMinutes ?? 0) * 0.25 +
    Math.abs(driftAt(elapsed)) * 0.3

  const confidence =
    score < CONFIDENCE_BANDS.high ? 'high' : score < CONFIDENCE_BANDS.medium ? 'medium' : 'low'

  const dominant = factors
    .filter((f) => f.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)[0]

  let reason
  if (volatility > 1.1) reason = 'volatile'
  else if (confidence === 'high') reason = 'stable'
  else if (gainAhead > lossAhead) reason = 'recovery'
  else reason = 'driver'

  return {
    confidence,
    confidenceReason: {
      key: `confidence.reason.${reason}`,
      params: {
        causeKey: dominant?.labelKey.replace('why.', 'cause.') ?? 'cause.congestion',
        sectionKey: base.outlook.recoverySectionKey,
        minutes: Math.max(lossAhead, gainAhead),
      },
    },
  }
}
