import { stations } from '../data/stations'
import { routes } from './railSim'

/**
 * Train search, over the same fleet everything else runs on.
 *
 * This previously searched `data/journeys.js` — a second, three-train dataset
 * with its own timings — which meant a search for 12952 found nothing while
 * the map was actively tracking it. Search now reads the shared route table,
 * so a result and a live train are the same service (§17).
 *
 * These functions return train *numbers* and the relevant stops, not state:
 * the caller reads live running data from the simulation, so search results
 * carry the same delays and ETAs as the map.
 */

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

const allRoutes = () => [...routes.values()]

/** Services calling at `fromCode` and later at `toCode`. */
export function findTrainsBetween(fromCode, toCode) {
  if (!fromCode || !toCode) return []

  return allRoutes().flatMap(({ train, stops }) => {
    const board = stops.findIndex((s) => s.code === fromCode)
    const alight = stops.findIndex((s) => s.code === toCode)
    if (board === -1 || alight === -1 || board >= alight) return []
    return [{ number: train.number, boardingAt: stops[board], alightingAt: stops[alight] }]
  })
}

/** Services whose number or name matches a free-text query. */
export function findTrainsByQuery(query) {
  const value = query.trim().toLowerCase()
  if (!value) return []

  return allRoutes()
    .filter(
      ({ train }) =>
        train.number.includes(value) || train.name.toLowerCase().includes(value),
    )
    .map(({ train, stops }) => ({
      number: train.number,
      boardingAt: stops[0],
      alightingAt: stops[stops.length - 1],
    }))
}

/** Services that depart from a station (it must not be their final call). */
export function findTrainsFromStation(stationCode) {
  if (!stationCode) return []

  return allRoutes().flatMap(({ train, stops }) => {
    const index = stops.findIndex((s) => s.code === stationCode)
    if (index === -1 || index === stops.length - 1) return []
    return [{ number: train.number, boardingAt: stops[index], alightingAt: stops[stops.length - 1] }]
  })
}
