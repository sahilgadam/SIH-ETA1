/**
 * Will I make my connection?
 *
 * Built entirely on the shared simulation: my train's *predicted* arrival at
 * the interchange and the connecting service's *predicted* departure from it
 * both come from `railSim`'s propagated delay chain. So when a train picks up
 * ten minutes on Live Status, the transfer window here narrows by ten minutes
 * without anything being recomputed separately (§10).
 *
 * All times are simulated demo data.
 */

/** Realistic minimum to change platforms at a large Indian junction. */
export const MIN_TRANSFER_MIN = 5

/**
 * Signed gap between two absolute simulated minutes, resolved to the nearest
 * sensible time-of-day reading.
 *
 * Services run daily, so a raw subtraction across two trains booked on
 * different days produces nonsense like a 900-minute wait. Folding the
 * difference into ±12 hours gives the interpretation a passenger would make:
 * a connection is either shortly after arrival, or it has already gone.
 */
function signedGap(fromMin, toMin) {
  const wrapped = (((toMin - fromMin) % 1440) + 1440) % 1440
  return wrapped > 720 ? wrapped - 1440 : wrapped
}

export const CONNECTION_STATUS = {
  comfortable: { id: 'comfortable', label: 'Comfortable', tone: 'brand' },
  likely: { id: 'likely', label: 'Likely', tone: 'brand' },
  tight: { id: 'tight', label: 'Tight', tone: 'caution' },
  'at-risk': { id: 'at-risk', label: 'At risk', tone: 'caution' },
  missed: { id: 'missed', label: 'Likely missed', tone: 'danger' },
}

function statusFor(transferMin) {
  if (transferMin < 0) return 'missed'
  if (transferMin < MIN_TRANSFER_MIN) return 'at-risk'
  if (transferMin < 12) return 'tight'
  if (transferMin < 25) return 'likely'
  return 'comfortable'
}

/** Stations where `train` calls and at least one other service also calls. */
export function interchangesFor(train, trains) {
  if (!train) return []
  return train.timeline
    .slice(0, -1) // you cannot change at your own destination and continue
    .filter((stop) => trains.some((other) => other.number !== train.number && other.stops.some((s) => s.code === stop.code)))
    .map((stop) => ({
      code: stop.code,
      name: stop.name,
      state: stop.state,
      predictedArrMin: stop.predictedArrMin ?? stop.predictedDepMin,
      delayMin: stop.delayMin,
    }))
}

/** Services a passenger could join at `code` after arriving on `train`. */
export function connectingServicesAt(code, train, trains) {
  const myStop = train?.timeline.find((s) => s.code === code)
  if (!myStop) return []
  const myArrival = myStop.predictedArrMin ?? myStop.predictedDepMin

  return trains
    .filter((other) => other.number !== train.number)
    .map((other) => {
      const stop = other.timeline.find((s) => s.code === code)
      if (!stop) return null
      const departure = stop.predictedDepMin ?? stop.predictedArrMin
      if (departure == null) return null
      return {
        train: other,
        stop,
        departure,
        transferMin: Math.round(signedGap(myArrival, departure)),
      }
    })
    .filter(Boolean)
    // Anything more than four hours out is a different journey, not a connection.
    .filter((option) => option.transferMin > -90 && option.transferMin < 240)
    .sort((a, b) => a.transferMin - b.transferMin)
}

/**
 * The full prediction for one specific change.
 *
 * Returns the two times, the window between them, a status, and — when the
 * connection is in doubt — the next services that would still work.
 */
export function predictConnection({ train, code, connecting, trains }) {
  if (!train || !code || !connecting) return null

  const myStop = train.timeline.find((s) => s.code === code)
  const connStop = connecting.timeline.find((s) => s.code === code)
  if (!myStop || !connStop) return null

  const arrival = myStop.predictedArrMin ?? myStop.predictedDepMin
  const bookedArrival = myStop.bookedArrMin ?? myStop.bookedDepMin
  const departure = connStop.predictedDepMin ?? connStop.predictedArrMin
  const bookedDeparture = connStop.bookedDepMin ?? connStop.bookedArrMin

  const transferMin = Math.round(signedGap(arrival, departure))
  const bookedTransferMin = Math.round(signedGap(bookedArrival, bookedDeparture))
  const status = statusFor(transferMin)

  // Alternatives only matter when the booked connection is doubtful.
  const alternatives =
    status === 'missed' || status === 'at-risk'
      ? connectingServicesAt(code, train, trains)
          .filter(
            (option) =>
              option.train.number !== connecting.number &&
              option.transferMin >= MIN_TRANSFER_MIN &&
              // Heading broadly the same way as the service being missed.
              option.train.destination.code === connecting.destination.code,
          )
          .slice(0, 3)
      : []

  // If nothing serves the same destination, widen to anything usable onward.
  const fallback =
    alternatives.length === 0 && (status === 'missed' || status === 'at-risk')
      ? connectingServicesAt(code, train, trains)
          .filter((o) => o.train.number !== connecting.number && o.transferMin >= MIN_TRANSFER_MIN)
          .slice(0, 3)
      : []

  return {
    station: { code, name: myStop.name },
    train,
    connecting,
    arrival,
    bookedArrival,
    departure,
    bookedDeparture,
    transferMin,
    bookedTransferMin,
    // How much of the booked window the delay has eaten.
    lostMin: bookedTransferMin - transferMin,
    status,
    alternatives: alternatives.length ? alternatives : fallback,
    alternativesAreOnward: alternatives.length === 0 && fallback.length > 0,
  }
}
