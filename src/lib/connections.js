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
 * The times these are measured from are absolute minutes that already carry
 * the day each service runs on, so the gap is a plain subtraction. Folding it
 * into ±12 hours — which an earlier model, where every train was assumed to be
 * mid-run on one shared day, did need — would report a departure twenty hours
 * before an arrival as a comfortable three-hour connection.
 */
function gapBetween(fromMin, toMin) {
  return toMin - fromMin
}

/**
 * Five internal bands, three things a passenger is actually told. The finer
 * grading still drives the colour and the alternatives, but the words on
 * screen are the ones someone would use about their own journey.
 */
export const CONNECTION_STATUS = {
  comfortable: { id: 'comfortable', label: 'Likely to make it', tone: 'brand' },
  likely: { id: 'likely', label: 'Likely to make it', tone: 'brand' },
  tight: { id: 'tight', label: 'Connection is tight', tone: 'caution' },
  'at-risk': { id: 'at-risk', label: 'Connection is tight', tone: 'caution' },
  missed: { id: 'missed', label: 'Likely to miss it', tone: 'danger' },
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
        transferMin: Math.round(gapBetween(myArrival, departure)),
      }
    })
    .filter(Boolean)
    // Anything more than three hours out is a different journey, not a
    // connection; anything long gone is not an option worth listing.
    .filter((option) => option.transferMin > -45 && option.transferMin < 180)
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

  const transferMin = Math.round(gapBetween(arrival, departure))
  const bookedTransferMin = Math.round(gapBetween(bookedArrival, bookedDeparture))
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
