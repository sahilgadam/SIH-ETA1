/**
 * Station boards, and the thing that makes them useful: the link between them.
 *
 * A passenger standing at a junction does not want an arrivals list and a
 * departures list side by side to compare by hand. They want to say "I get in
 * on 12952" and be told which departures they can actually catch. So the
 * departure board here can be *annotated* with a transfer window measured
 * against a specific arriving service.
 *
 * Everything is derived from the shared `railSim` state, so a delay picked up
 * on the map narrows these transfer windows without anything being
 * recalculated separately.
 */

import { CONNECTION_STATUS, MIN_TRANSFER_MIN } from './connections'
import { SIM_START_MINUTES } from './railSim'

export function transferStatus(transferMin) {
  if (transferMin < 0) return 'missed'
  if (transferMin < MIN_TRANSFER_MIN) return 'at-risk'
  if (transferMin < 12) return 'tight'
  if (transferMin < 25) return 'likely'
  return 'comfortable'
}

export const STATUS_META = CONNECTION_STATUS

/**
 * Everything calling at a station, split into what it is doing there.
 *
 * `arrivals` are services still to come in; `departures` are services still to
 * leave; `atPlatform` are standing there now. Ordered by the time each thing
 * actually happens, which is how a board reads.
 */
export function stationBoard(code, trains, minutes) {
  const now = SIM_START_MINUTES + minutes
  const arrivals = []
  const departures = []
  const atPlatform = []

  for (const train of trains) {
    const stop = train.timeline.find((s) => s.code === code)
    if (!stop) continue

    const isOrigin = stop.code === train.origin.code
    const isTerminus = stop.code === train.destination.code

    if (stop.state === 'current') {
      atPlatform.push({ train, stop })
    }

    // Still to arrive: it has an arrival time here and has not reached it.
    if (!isOrigin && stop.predictedArrMin != null && stop.state !== 'past' && stop.state !== 'current') {
      arrivals.push({
        train,
        stop,
        at: stop.predictedArrMin,
        booked: stop.bookedArrMin,
        inMin: Math.round(stop.predictedArrMin - now),
        from: train.origin,
      })
    }

    // Still to leave: it has a departure time here and has not left.
    if (!isTerminus && stop.predictedDepMin != null && stop.state !== 'past') {
      departures.push({
        train,
        stop,
        at: stop.predictedDepMin,
        booked: stop.bookedDepMin,
        inMin: Math.round(stop.predictedDepMin - now),
        to: train.destination,
      })
    }
  }

  arrivals.sort((a, b) => a.at - b.at)
  departures.sort((a, b) => a.at - b.at)

  return {
    arrivals,
    departures,
    atPlatform,
    counts: {
      arrivals: arrivals.length,
      departures: departures.length,
      atPlatform: atPlatform.length,
    },
    nextArrival: arrivals[0] ?? null,
    nextDeparture: departures[0] ?? null,
  }
}

/**
 * Services that call here and could be the one a passenger is arriving on —
 * i.e. this station is not where they started.
 */
export function arrivingServices(code, trains) {
  return trains
    .map((train) => {
      const stop = train.timeline.find((s) => s.code === code)
      if (!stop || stop.code === train.origin.code || stop.predictedArrMin == null) return null
      return { train, stop, at: stop.predictedArrMin }
    })
    .filter(Boolean)
    .sort((a, b) => a.at - b.at)
}

/**
 * Annotate a departure board with the transfer window from one arrival.
 *
 * This is the whole point of the page: the same departures, but now each one
 * carries "you would have 11 minutes" and whether that is enough.
 */
export function withTransfers(departures, arrival) {
  if (!arrival) return departures.map((d) => ({ ...d, transferMin: null, status: null }))

  return departures
    .filter((d) => d.train.number !== arrival.train.number)
    .map((d) => {
      // A plain difference. These minutes are absolute and already carry the
      // day a service actually runs on, so folding the gap into ±12 hours —
      // which an earlier same-day model needed — would now turn a departure
      // twenty hours before an arrival into a comfortable three-hour change.
      const transferMin = Math.round(d.at - arrival.at)
      return { ...d, transferMin, status: transferStatus(transferMin) }
    })
    // A change you have to wait three hours for is a different journey, and
    // one that left long before you arrived is not an option at all. Keep the
    // near misses, because "you were eight minutes short" is worth saying.
    .filter((d) => d.transferMin > -45 && d.transferMin < 180)
    .sort((a, b) => a.transferMin - b.transferMin)
}

/** Departures grouped by where they are going, for "what can I catch". */
export function groupByDestination(departures) {
  const groups = new Map()
  for (const departure of departures) {
    const key = departure.to.code
    if (!groups.has(key)) groups.set(key, { destination: departure.to, services: [] })
    groups.get(key).services.push(departure)
  }
  return [...groups.values()].sort((a, b) => a.services[0].at - b.services[0].at)
}
