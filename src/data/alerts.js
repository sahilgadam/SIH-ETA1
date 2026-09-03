/**
 * Operational events for the homepage alerts timeline.
 *
 * Not a fourth, unrelated random source: every field below is read straight
 * off `src/data/journeys.js` — the section a train is currently in, and the
 * prediction factor that is actually moving its forecast. Times are authored
 * for the prototype (the journeys have no wall-clock event log), so the
 * section renders them under the same `simulated` trust label as the rest of
 * the demo data.
 */
import { getJourney } from './journeys'

function factorMinutes(journey, factorId) {
  return journey.prediction.factors.find((factor) => factor.id === factorId)?.minutes ?? 0
}

function currentSection(journey) {
  const segment = journey.segments[journey.current.segmentIndex]
  const from = journey.majorStations.find((s) => s.code === segment.fromCode)
  const to = journey.majorStations.find((s) => s.code === segment.toCode)
  return { fromName: from.station, toName: to.station }
}

export const operationalEvents = (() => {
  const j12301 = getJourney('12301')
  const j12951 = getJourney('12951')
  const j12002 = getJourney('12002')

  const congestionSection = currentSection(j12301)
  const restrictionSection = currentSection(j12951)

  return [
    {
      id: 'congestion',
      time: '18:31',
      type: 'congestion',
      trainNumber: j12301.trainNumber,
      trainName: j12301.trainName,
      location: `${congestionSection.fromName} → ${congestionSection.toName}`,
      impactMinutes: factorMinutes(j12301, 'congestion'),
    },
    {
      id: 'restriction',
      time: '18:27',
      type: 'restriction',
      trainNumber: j12951.trainNumber,
      trainName: j12951.trainName,
      location: `${restrictionSection.fromName} → ${restrictionSection.toName}`,
      impactMinutes: factorMinutes(j12951, 'speed-restriction'),
    },
    {
      id: 'delay',
      time: '18:19',
      type: 'delay',
      trainNumber: j12002.trainNumber,
      trainName: j12002.trainName,
      location: j12002.current.haltedAt,
      impactMinutes: j12002.current.delayMinutes,
    },
  ]
})()
