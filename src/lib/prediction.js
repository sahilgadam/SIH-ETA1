/**
 * Everything the journey screen says *about* the forecast, derived from the
 * one forecast `src/lib/eta.js` already produces.
 *
 * Nothing in here is a second opinion. Recovery minutes, additional delay and
 * weather impact are read straight off `journey.prediction.factors`, so the
 * recovery panel, the weather note and "Why this ETA?" are three views of the
 * same arithmetic and cannot drift apart. Connection risk is computed from the
 * predicted arrival, never from the current delay.
 *
 * This is a deterministic rule-based prototype over mock data. No model is
 * trained and none is called; the UI labels it that way throughout.
 */

import { getConnectionsAt, findConnection } from '../data/connections'
import { getForecast, toMinutes, toClock } from './eta'

// ---------------------------------------------------------------------------
// Where the train is
// ---------------------------------------------------------------------------

/**
 * The train's position in words, using the timeline's major stations because
 * that is what a passenger recognises. Returns the same pair of stations the
 * map marker sits between.
 */
export function getCurrentLocation(journey) {
  const { segmentIndex, progress, haltedAt } = journey.current
  const from = journey.majorStations[segmentIndex]
  const to = journey.majorStations[segmentIndex + 1]

  if (haltedAt || progress === 0) {
    return { kind: 'at', station: haltedAt ?? from.station, fromStation: from.station, toStation: to?.station }
  }

  return { kind: 'between', fromStation: from.station, toStation: to?.station ?? from.station }
}

// ---------------------------------------------------------------------------
// Delay recovery  (§18)
// ---------------------------------------------------------------------------

/**
 * Splits the forecast factors into the time the train is expected to lose and
 * the time it is expected to make back, so
 *
 *     currentDelay + additionalDelay − recovery === destination delay
 *
 * holds exactly. `recoveryMinutes` is reported positive because the panel reads
 * "expected recovery: 4 min".
 */
export function getRecovery(journey) {
  const factors = journey.prediction.factors
  const currentDelayMinutes = journey.current.delayMinutes
  const { delayMinutes: destinationDelayMinutes, destinationName } = getForecast(journey)

  const additionalDelayMinutes = factors
    .filter((factor) => factor.minutes > 0)
    .reduce((total, factor) => total + factor.minutes, 0)

  const recoveryMinutes = -factors
    .filter((factor) => factor.minutes < 0)
    .reduce((total, factor) => total + factor.minutes, 0)

  return {
    currentDelayMinutes,
    additionalDelayMinutes,
    recoveryMinutes,
    destinationDelayMinutes,
    destinationName,
    sectionKey: journey.outlook.recoverySectionKey,
    // True when the train is expected to arrive better than it is running now.
    isNetRecovery: destinationDelayMinutes < currentDelayMinutes,
  }
}

// ---------------------------------------------------------------------------
// Confidence  (§19)
// ---------------------------------------------------------------------------

/**
 * How much slack to allow around a predicted arrival, in minutes, per
 * confidence level. A lower confidence has to widen a connection's required
 * buffer — that is the only place confidence changes a decision rather than
 * just a label.
 */
export const CONFIDENCE_MARGINS = { high: 5, medium: 10, low: 18 }

export function getConfidence(journey) {
  const level = journey.outlook.confidence
  return {
    level,
    marginMinutes: CONFIDENCE_MARGINS[level],
    // Derived in `src/lib/simulation.js` from what is still in play ahead and
    // how unsettled conditions are — never authored, never random.
    reason: journey.outlook.confidenceReason,
  }
}

// ---------------------------------------------------------------------------
// Why this ETA (§7) — the explanation, generated from the current forecast
// ---------------------------------------------------------------------------

/**
 * The paragraph above the factor table, composed from the factors themselves.
 *
 * Returned as `{ key, params }` sentences for the caller to translate, so the
 * words move whenever the numbers do. There is no stored paragraph that could
 * go on describing conditions the forecast has left behind.
 */
export function getEtaExplanation(journey) {
  const location = getCurrentLocation(journey)
  const recovery = getRecovery(journey)
  const forecast = getForecast(journey)
  const now = journey.current.delayMinutes

  const sentences = []

  sentences.push({
    key: location.kind === 'at' ? 'why.explain.atNow' : 'why.explain.betweenNow',
    params: { station: location.station, from: location.fromStation, to: location.toStation, minutes: now },
  })

  const dominant = journey.prediction.factors
    .filter((factor) => factor.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)[0]

  if (recovery.additionalDelayMinutes > 0 && dominant) {
    sentences.push({
      key: 'why.explain.loss',
      params: {
        causeKey: dominant.labelKey.replace('why.', 'cause.'),
        minutes: recovery.additionalDelayMinutes,
        destination: forecast.destinationName,
      },
    })
  }

  if (recovery.recoveryMinutes > 0) {
    sentences.push({
      key: 'why.explain.gain',
      params: { minutes: recovery.recoveryMinutes, sectionKey: journey.outlook.recoverySectionKey },
    })
  }

  sentences.push({
    key:
      forecast.delayMinutes > 0 ? 'why.explain.resultLate'
      : forecast.delayMinutes < 0 ? 'why.explain.resultEarly'
      : 'why.explain.resultOnTime',
    params: {
      destination: forecast.destinationName,
      minutes: Math.abs(forecast.delayMinutes),
      arrival: forecast.predicted,
    },
  })

  return sentences
}

// ---------------------------------------------------------------------------
// Weather  (§24) — surfaced only when it actually moves the forecast
// ---------------------------------------------------------------------------

/**
 * Returns null unless the run has a weather factor with a non-zero contribution.
 * The minute figure is the factor itself, so the weather note and the
 * "Why this ETA?" row always show the same number.
 */
export function getWeather(journey) {
  const { weather } = journey.outlook
  if (!weather) return null

  const factor = journey.prediction.factors.find((entry) => entry.id === 'weather')
  if (!factor || factor.minutes === 0) return null

  const near = [...journey.majorStations, ...journey.segments.flatMap((s) => s.intermediateStations)]
    .find((station) => station.code === weather.nearStationCode)

  return {
    conditionKey: weather.conditionKey,
    nearStationName: near?.station ?? weather.nearStationCode,
    impactMinutes: factor.minutes,
  }
}

// ---------------------------------------------------------------------------
// Historical reliability  (§25) — secondary, supports trust in the forecast
// ---------------------------------------------------------------------------

export function getHistory(journey) {
  const runs = journey.outlook.recentArrivalDelays
  if (!runs?.length) return null

  const sorted = [...runs].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]

  return {
    runs,
    medianDelayMinutes: median,
    bestDelayMinutes: sorted[0],
    worstDelayMinutes: sorted.at(-1),
    // Half the spread, phrased as the "±" a passenger can plan around.
    variationMinutes: Math.round((sorted.at(-1) - sorted[0]) / 2),
  }
}

// ---------------------------------------------------------------------------
// Connection protection  (§20, §21)
// ---------------------------------------------------------------------------

/** Minutes a passenger needs on the ground to physically change trains. */
export const MINIMUM_TRANSFER_MINUTES = 10

export const CONNECTION_STATUS = {
  SAFE: 'safe',
  AT_RISK: 'at-risk',
  HIGH_RISK: 'high-risk',
  MISSED: 'missed',
  UNAVAILABLE: 'unavailable',
}

/**
 * Assesses one connection against the RailSense predicted arrival.
 *
 *   buffer        = connection departure − predicted arrival
 *   usable buffer = buffer − the time it takes to change trains
 *
 * A connection is safe only when the usable buffer still survives the
 * uncertainty margin for this run's confidence level. That is why the same
 * four-minute buffer can read differently on a high- and a low-confidence run.
 *
 * Returns the `unavailable` status — never a fabricated risk — when we hold no
 * departure for the number that was typed.
 */
export function assessConnection(journey, trainNumber) {
  const forecast = getForecast(journey)
  const connection = findConnection(forecast.destinationCode, trainNumber)

  if (!connection) {
    return { status: CONNECTION_STATUS.UNAVAILABLE, trainNumber: String(trainNumber ?? '').trim() }
  }

  const confidence = getConfidence(journey)
  const arrivalMinutes = toMinutes(forecast.predicted)
  const scheduledArrivalMinutes = toMinutes(forecast.scheduled)
  const departureMinutes = toMinutes(connection.scheduledDeparture)

  const bufferMinutes = departureMinutes - arrivalMinutes
  const scheduledBufferMinutes = departureMinutes - scheduledArrivalMinutes
  const usableBufferMinutes = bufferMinutes - MINIMUM_TRANSFER_MINUTES

  let status
  if (bufferMinutes < 0) status = CONNECTION_STATUS.MISSED
  else if (usableBufferMinutes < 0) status = CONNECTION_STATUS.HIGH_RISK
  else if (usableBufferMinutes < confidence.marginMinutes) status = CONNECTION_STATUS.AT_RISK
  else status = CONNECTION_STATUS.SAFE

  return {
    status,
    connection,
    arrivalStationName: forecast.destinationName,
    predictedArrival: forecast.predicted,
    scheduledArrival: forecast.scheduled,
    bufferMinutes,
    scheduledBufferMinutes,
    usableBufferMinutes,
    transferMinutes: MINIMUM_TRANSFER_MINUTES,
    confidence,
    // How much of the buffer the forecast has already eaten, for the explanation.
    bufferLostMinutes: scheduledBufferMinutes - bufferMinutes,
  }
}

/** The onward departures we hold for this journey's destination. */
export const getOnwardDepartures = (journey) => getConnectionsAt(getForecast(journey).destinationCode)

// ---------------------------------------------------------------------------
// What this means for me  (§22)
// ---------------------------------------------------------------------------

/**
 * The passenger summary as a list of `{ key, params }` sentences, composed from
 * the live forecast so it can never contradict the panels above it. The caller
 * runs each through `t()`.
 */
export function getPassengerSummary(journey, assessment) {
  const location = getCurrentLocation(journey)
  const recovery = getRecovery(journey)
  const forecast = getForecast(journey)
  const sentences = []

  // 1 — where it is and how late it is right now.
  const now = journey.current.delayMinutes
  sentences.push({
    key: location.kind === 'at'
      ? (now > 0 ? 'summary.atLate' : 'summary.atOnTime')
      : (now > 0 ? 'summary.betweenLate' : 'summary.betweenOnTime'),
    params: {
      station: location.station,
      from: location.fromStation,
      to: location.toStation,
      minutes: now,
    },
  })

  // 2 — where the forecast is heading, and the single biggest reason.
  const biggestCause = journey.prediction.factors
    .filter((factor) => factor.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)[0]

  const direction =
    forecast.delayMinutes > now ? 'summary.forecastWorse'
    : forecast.delayMinutes < now ? 'summary.forecastBetter'
    : 'summary.forecastSteady'

  sentences.push({
    key: direction,
    params: {
      destination: forecast.destinationName,
      minutes: Math.abs(forecast.delayMinutes),
      arrival: forecast.predicted,
      recovery: recovery.recoveryMinutes,
      // The same factor, in the lowercase form that reads inside a sentence.
      // 'why.congestion' (a table row) becomes 'cause.congestion' (inline prose).
      causeKey: biggestCause?.labelKey.replace('why.', 'cause.'),
    },
  })

  // 3 — the connection, only when one has actually been assessed.
  if (assessment && assessment.status !== CONNECTION_STATUS.UNAVAILABLE) {
    sentences.push({
      key: `summary.connection.${assessment.status}`,
      params: {
        train: assessment.connection.trainNumber,
        departure: assessment.connection.scheduledDeparture,
        minutes: Math.abs(assessment.bufferMinutes),
      },
    })
  }

  return sentences
}

export { toClock }
