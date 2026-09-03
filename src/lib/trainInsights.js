/**
 * Derived readings for the train detail page.
 *
 * Everything here is computed from a single `railSim` train state — the same
 * object Live Status renders. The detail page shows *more properties of the
 * same train*, never a second dataset (§16), so a figure quoted here can
 * never disagree with the map or the tracking panel.
 *
 * All values are simulated.
 */

import { SIM_START_MINUTES } from './railSim'

/** Distance run, distance left, and how far through the journey it is. */
export function journeyStats(train, minutes) {
  const totalKm = train.destination.km ?? 0

  // Where the train is in kilometres: the last call it left, plus however far
  // it has got into the current section.
  const section = train.section
  const coveredKm = section
    ? section.from.km + train.progressInSection * section.km
    : (train.atStation?.km ?? 0)

  const now = SIM_START_MINUTES + minutes
  const departed = train.timeline[0].predictedDepMin ?? train.timeline[0].bookedDepMin
  const runningMin = Math.max(now - departed, 0)

  return {
    totalKm: Math.round(totalKm),
    coveredKm: Math.round(coveredKm),
    remainingKm: Math.max(Math.round(totalKm - coveredKm), 0),
    progress: totalKm ? Math.min(coveredKm / totalKm, 1) : 0,
    runningMin: Math.round(runningMin),
    remainingMin: Math.max(Math.round(train.etaMinutes - now), 0),
    // Average over the whole run so far, which is always lower than the
    // current speed because it includes every station stop.
    averageKmh: runningMin > 0 ? Math.round((coveredKm / runningMin) * 60) : 0,
    currentKmh: train.speedKmh,
    // What the timetable expects over the section the train is in. Derived
    // from the booked distance and running time — `cruiseKmh` was a field on
    // the old schematic model and does not exist here, so reading it rendered
    // an empty figure.
    bookedKmh: section && section.bookedRunMin
      ? Math.round((section.km / section.bookedRunMin) * 60)
      : 0,
  }
}

/**
 * Why the arrival is what it is.
 *
 * These are the actual terms in the propagation, not invented weights: the
 * delay the service left with, what the current section is costing against
 * its booked running time, and what the chain expects to give back before the
 * destination. They sum to the predicted variance, give or take rounding.
 */
export function predictionFactors(train) {
  const departure = train.timeline[0]
  const carried = Math.max(departure.delayMin ?? 0, 0)

  const section = train.section
  const sectionCost = section ? Math.round(section.currentRunMin - section.bookedRunMin) : 0

  // What the rest of the chain does to the number between here and the end.
  const downstream = Math.round(train.destinationDelay - train.delayMin)

  const factors = [
    {
      id: 'carried',
      label: 'Delay at departure',
      minutes: carried,
      note: `${departure.code} · booked ${departure.bookedDepMin != null ? 'departure' : 'call'}`,
    },
    {
      id: 'section',
      label: section ? `Current section ${section.from.code}–${section.to.code}` : 'At a stand',
      minutes: sectionCost,
      note: section
        ? `booked ${section.bookedRunMin} min, running ${section.currentRunMin} min`
        : 'no section penalty while stopped',
    },
    {
      id: 'downstream',
      label: downstream >= 0 ? 'Expected further loss' : 'Expected recovery',
      minutes: downstream,
      note: 'across the remaining sections',
    },
  ]

  const peak = Math.max(...factors.map((f) => Math.abs(f.minutes)), 1)
  return factors.map((f) => ({ ...f, share: Math.abs(f.minutes) / peak }))
}

/**
 * How the delay behaves along the route — the propagation made visible.
 * Reads straight off the timeline, so a service that loses time at a junction
 * and claws it back on a fast stretch shows exactly that shape.
 */
export function delayProfile(train) {
  const peak = Math.max(...train.timeline.map((stop) => stop.delayMin), 1)
  return train.timeline.map((stop) => ({
    code: stop.code,
    name: stop.name,
    state: stop.state,
    delayMin: stop.delayMin,
    share: stop.delayMin / peak,
  }))
}

/** Two or three plain sentences a passenger could read aloud. */
export function passengerSummary(train, stats, formatClock, formatDuration) {
  const lines = []
  const moving = train.phase !== 'dwell' && train.phase !== 'origin' && train.phase !== 'arrived'

  lines.push(
    moving
      ? `${train.number} is between ${train.prevStation.name} and ${train.nextStation.name}, running at ${train.speedKmh} km/h.`
      : `${train.number} is standing at ${train.atStation?.name ?? train.prevStation.name}.`,
  )

  lines.push(
    train.delayMin > 0
      ? `It is ${train.delayMin} minutes behind its booked time and is expected into ${train.destination.name} at ${formatClock(train.etaMinutes)}, about ${formatDuration(stats.remainingMin)} from now.`
      : `It is running to time and is expected into ${train.destination.name} at ${formatClock(train.etaMinutes)}, about ${formatDuration(stats.remainingMin)} from now.`,
  )

  const swing = train.destinationDelay - train.delayMin
  if (swing < -1) {
    lines.push(`The forecast expects it to recover about ${Math.abs(swing)} minutes before the end of the run.`)
  } else if (swing > 1) {
    lines.push(`Conditions ahead are expected to add roughly ${swing} more minutes.`)
  }

  lines.push(`${stats.coveredKm} km of ${stats.totalKm} km run, ${stats.remainingKm} km remaining.`)
  return lines
}
