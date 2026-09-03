/**
 * Turns the stored journey data into the forecast the UI renders.
 *
 * This module is the seam. Today `predictedDelayMinutes` is authored per
 * station in `src/data/journeys.js`; when a real prediction engine exists it
 * only has to supply that one number per station and everything below —
 * predicted times, the destination ETA, the upcoming-station table — keeps
 * working unchanged.
 *
 * Predicted times are always derived, never stored, so the invariant
 *
 *     predicted time − scheduled time === predicted delay
 *
 * cannot drift out of sync with what the UI displays.
 */

const MINUTES_PER_DAY = 24 * 60

export function toMinutes(hhmm) {
  if (!hhmm) return null
  const [hours, minutes] = hhmm.split(':').map(Number)
  return hours * 60 + minutes
}

export function toClock(minutes) {
  if (minutes == null) return null
  const wrapped = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  const hours = Math.floor(wrapped / 60)
  return `${String(hours).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`
}

/** Shift a "HH:MM" scheduled time by a delay in minutes, wrapping past midnight. */
export function shift(hhmm, deltaMinutes) {
  const base = toMinutes(hhmm)
  return base == null ? null : toClock(base + deltaMinutes)
}

/**
 * Expand one stored station into the shape components render.
 *
 * The delay applies to both arrival and departure, so a station's booked halt
 * length is preserved and predicted departure never precedes predicted arrival.
 */
export function resolveStation(station) {
  const delay = station.predictedDelayMinutes

  const predictedArrival = shift(station.scheduledArrival, delay)
  const predictedDeparture = shift(station.scheduledDeparture, delay)

  return {
    ...station,
    predictedArrival,
    predictedDeparture,
    // What a single-time display should show: arrival for every station except
    // the origin, which only has a departure.
    scheduledTime: station.scheduledArrival ?? station.scheduledDeparture,
    predictedTime: predictedArrival ?? predictedDeparture,
  }
}

export const resolveStations = (stations) => stations.map(resolveStation)

/** The timeline nodes, with predictions resolved. */
export const getMajorStations = (journey) => resolveStations(journey.majorStations)

/** The stations revealed inside one segment, with predictions resolved. */
export const getSegmentStations = (segment) => resolveStations(segment.intermediateStations)

/**
 * Every station of a journey in running order — majors interleaved with the
 * intermediates of the segment that follows them.
 */
export function getRoute(journey) {
  const route = []

  journey.majorStations.forEach((station, index) => {
    route.push({ ...resolveStation(station), isMajor: true })

    const segment = journey.segments[index]
    if (!segment) return

    segment.intermediateStations.forEach((intermediate) => {
      route.push({ ...resolveStation(intermediate), isMajor: false, segmentId: segment.id })
    })
  })

  return route
}

/** Stations the train has not reached yet, in order. */
export const getRemainingStations = (journey) =>
  getRoute(journey).filter((station) => station.status !== 'completed')

/**
 * The headline forecast, taken from the destination station itself so the
 * header can never disagree with the last row of the journey.
 */
export function getForecast(journey) {
  const destination = resolveStation(journey.majorStations.at(-1))

  return {
    destinationCode: destination.code,
    destinationName: destination.station,
    scheduled: destination.scheduledTime,
    predicted: destination.predictedTime,
    delayMinutes: destination.predictedDelayMinutes,
  }
}

/**
 * How the forecast moves from "how late the train is now" to "how late we
 * expect it to be at the destination". The factors explain the gap between the
 * two; they are not a restatement of either one.
 */
export function getPredictionBreakdown(journey) {
  const currentDelay = journey.current.delayMinutes
  const { delayMinutes: predictedDelay } = getForecast(journey)

  return {
    currentDelayMinutes: currentDelay,
    predictedDelayMinutes: predictedDelay,
    netChangeMinutes: predictedDelay - currentDelay,
    factors: journey.prediction.factors,
  }
}

/**
 * Change in predicted delay from the previous station, so the table can show
 * where the forecast worsens and where the train is expected to make time up.
 */
export function withDelayTrend(stations) {
  return stations.map((station, index) => ({
    ...station,
    delayTrendMinutes:
      index === 0 ? null : station.predictedDelayMinutes - stations[index - 1].predictedDelayMinutes,
  }))
}
