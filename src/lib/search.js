import { stations } from '../data/stations'
import { journeys } from '../data/journeys'
import { getRoute } from './eta'

/**
 * Turn whatever the user typed into a station code.
 * Accepts "New Delhi (NDLS)", "NDLS", "new delhi" or a city name.
 */
export function resolveStationCode(input) {
  const value = input.trim()
  if (!value) return null

  const inParens = value.match(/\(([A-Z]{2,5})\)\s*$/i)
  if (inParens) return inParens[1].toUpperCase()

  const lower = value.toLowerCase()
  const byCode = stations.find((s) => s.code.toLowerCase() === lower)
  if (byCode) return byCode.code

  const byName = stations.find(
    (s) => s.name.toLowerCase() === lower || s.city.toLowerCase() === lower,
  )
  if (byName) return byName.code

  const partial = stations.find(
    (s) => s.name.toLowerCase().includes(lower) || s.city.toLowerCase().includes(lower),
  )
  return partial ? partial.code : null
}

/**
 * Trains that call at `fromCode` and later at `toCode`, matched against the
 * full route (major and intermediate stations alike).
 */
export function findTrainsBetween(fromCode, toCode) {
  if (!fromCode || !toCode) return []

  return journeys.flatMap((journey) => {
    const route = getRoute(journey)
    const boardIndex = route.findIndex((s) => s.code === fromCode)
    const alightIndex = route.findIndex((s) => s.code === toCode)
    if (boardIndex === -1 || alightIndex === -1 || boardIndex >= alightIndex) return []

    return [{ journey, boardingAt: route[boardIndex], alightingAt: route[alightIndex] }]
  })
}

/** Trains whose number or name matches a free-text query. */
export function findTrainsByQuery(query) {
  const value = query.trim().toLowerCase()
  if (!value) return []

  return journeys
    .filter(
      (journey) =>
        journey.trainNumber.includes(value) ||
        journey.trainName.toLowerCase().includes(value),
    )
    .map((journey) => ({
      journey,
      boardingAt: journey.majorStations[0],
      alightingAt: journey.majorStations.at(-1),
    }))
}

/** Trains that depart from a station (it must not be their final stop). */
export function findTrainsFromStation(stationCode) {
  if (!stationCode) return []

  return journeys.flatMap((journey) => {
    const route = getRoute(journey)
    const index = route.findIndex((s) => s.code === stationCode)
    if (index === -1 || index === route.length - 1) return []

    return [{ journey, boardingAt: route[index], alightingAt: route.at(-1) }]
  })
}
