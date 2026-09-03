/**
 * Invariants the journey screen depends on.
 *
 * These are the promises the UI makes to the passenger — that the ETA matches
 * the delay beside it, that the factors add up to the arrival they explain,
 * that a station the train has passed cannot still be listed as upcoming.
 * `checkJourney` returns every violation rather than throwing, so it can run
 * over a whole simulated timeline in a test and report all of them at once.
 *
 * `assertJourneyInDev` runs it on each render in development only; production
 * builds drop it entirely.
 */

import { getForecast, getRoute, toMinutes } from './eta'
import { assessConnection, getRecovery } from './prediction'

const fail = (issues, rule, detail) => issues.push({ rule, detail })

/** Every invariant, checked against one journey state. Returns a list of failures. */
export function checkJourney(journey) {
  const issues = []
  const route = getRoute(journey)
  const { current } = journey

  // --- Route shape ---------------------------------------------------------
  route.forEach((station, index) => {
    if (index === 0) return
    if (station.distanceFromOriginKm < route[index - 1].distanceFromOriginKm) {
      fail(issues, 'distance-monotonic', `${route[index - 1].code} → ${station.code}`)
    }
  })

  // --- Times match delays --------------------------------------------------
  route.forEach((station) => {
    const scheduled = toMinutes(station.scheduledTime)
    const predicted = toMinutes(station.predictedTime)
    if (scheduled == null || predicted == null) return

    // Compare modulo a day so a forecast crossing midnight is not a failure.
    const difference = ((predicted - scheduled + 720 + 1440) % 1440) - 720
    if (difference !== station.predictedDelayMinutes) {
      fail(
        issues,
        'eta-matches-delay',
        `${station.code}: ${station.scheduledTime}→${station.predictedTime} is ${difference}, delay says ${station.predictedDelayMinutes}`,
      )
    }
  })

  // --- Destination is the last row of the table ----------------------------
  const forecast = getForecast(journey)
  const finalStation = route.at(-1)
  if (forecast.delayMinutes !== finalStation.predictedDelayMinutes) {
    fail(
      issues,
      'destination-matches-final-station',
      `header ${forecast.delayMinutes} vs table ${finalStation.predictedDelayMinutes}`,
    )
  }

  // --- Factors reconcile with the destination delay ------------------------
  const recovery = getRecovery(journey)
  const reconciled =
    recovery.currentDelayMinutes + recovery.additionalDelayMinutes - recovery.recoveryMinutes
  if (reconciled !== recovery.destinationDelayMinutes) {
    fail(
      issues,
      'factors-reconcile',
      `${recovery.currentDelayMinutes} + ${recovery.additionalDelayMinutes} − ${recovery.recoveryMinutes} = ${reconciled}, destination says ${recovery.destinationDelayMinutes}`,
    )
  }

  // --- Distances -----------------------------------------------------------
  if (current.distanceCoveredKm + current.distanceRemainingKm !== current.totalDistanceKm) {
    fail(
      issues,
      'distance-sums',
      `${current.distanceCoveredKm} + ${current.distanceRemainingKm} ≠ ${current.totalDistanceKm}`,
    )
  }
  if (current.distanceCoveredKm < 0 || current.distanceCoveredKm > current.totalDistanceKm) {
    fail(issues, 'train-within-route', `covered ${current.distanceCoveredKm}`)
  }

  // --- Position agrees with the timeline -----------------------------------
  const from = journey.majorStations[current.segmentIndex]
  const to = journey.majorStations[current.segmentIndex + 1]
  if (!from || !to) {
    fail(issues, 'segment-in-range', `segmentIndex ${current.segmentIndex}`)
  } else if (current.progress < 0 || current.progress > 1) {
    fail(issues, 'progress-in-range', `progress ${current.progress}`)
  } else if (
    current.distanceCoveredKm + 1 < from.distanceFromOriginKm ||
    current.distanceCoveredKm - 1 > to.distanceFromOriginKm
  ) {
    fail(
      issues,
      'segment-contains-train',
      `${current.distanceCoveredKm} km outside ${from.code}–${to.code}`,
    )
  }

  // --- Passed stations are never upcoming ----------------------------------
  route.forEach((station) => {
    const passed = station.distanceFromOriginKm < current.distanceCoveredKm - 2
    if (passed && station.status === 'upcoming') {
      fail(issues, 'passed-not-upcoming', `${station.code} at ${station.distanceFromOriginKm} km`)
    }
    if (!passed && station.status === 'completed' && station.distanceFromOriginKm > current.distanceCoveredKm + 2) {
      fail(issues, 'ahead-not-completed', `${station.code} at ${station.distanceFromOriginKm} km`)
    }
  })

  return issues
}

/**
 * Checks that a connection verdict was reached from the predicted arrival
 * rather than the scheduled one — the whole point of the feature.
 */
export function checkConnection(journey, trainNumber) {
  const issues = []
  const assessment = assessConnection(journey, trainNumber)
  if (assessment.status === 'unavailable') return issues

  const forecast = getForecast(journey)
  if (assessment.predictedArrival !== forecast.predicted) {
    fail(issues, 'connection-uses-predicted-arrival', assessment.predictedArrival)
  }
  const expected = toMinutes(assessment.connection.scheduledDeparture) - toMinutes(forecast.predicted)
  if (assessment.bufferMinutes !== expected) {
    fail(issues, 'connection-buffer', `${assessment.bufferMinutes} vs ${expected}`)
  }
  return issues
}

/** Development-only guard. Bundled out of production by the `import.meta.env` check. */
export function assertJourneyInDev(journey) {
  if (!import.meta.env?.DEV) return
  const issues = checkJourney(journey)
  if (issues.length) {
    console.error(
      `[RailSense] journey invariants failed for ${journey.trainNumber}:`,
      issues.map((issue) => `${issue.rule} — ${issue.detail}`),
    )
  }
}
