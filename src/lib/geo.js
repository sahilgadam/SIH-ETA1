/**
 * Turns a journey into the shapes the Leaflet map draws.
 *
 * The train's position is interpolated from `current.distanceCoveredKm` against
 * each station's `distanceFromOriginKm`, not from a separately stored latitude.
 * That keeps the marker, the "distance covered" metric and the timeline marker
 * all reading from one number.
 *
 * Coordinates are the approximate ones in `src/data/coordinates.js`, so the
 * route traces the real shape of the line without claiming survey accuracy.
 */

import { getCoordinates } from '../data/coordinates'
import { getRoute } from './eta'

/** Linear interpolation between two `[lat, lng]` points. */
const lerp = ([aLat, aLng], [bLat, bLng], t) => [aLat + (bLat - aLat) * t, aLng + (bLng - aLng) * t]

/** The journey's stations in running order, dropping any we have no point for. */
export function getRouteStations(journey) {
  return getRoute(journey)
    .map((station) => ({ ...station, position: getCoordinates(station.code) }))
    .filter((station) => station.position)
}

/**
 * Where the train is along a route, interpolated between the two stations that
 * bracket the distance it has covered.
 *
 * Takes the station list rather than rebuilding it, so the index it reports
 * indexes the caller's own array — the route can then be split there exactly.
 * A train whose covered distance lands on a station is reported as standing at
 * it, not as being between it and the one before.
 */
export function locateTrain(stations, distanceCoveredKm) {
  const last = stations.length - 1
  const nextIndex = stations.findIndex((station) => station.distanceFromOriginKm >= distanceCoveredKm)

  // Past the last mapped station, or before the first: sit on the end point.
  if (nextIndex === -1) {
    return { position: stations[last].position, atStation: stations[last], index: last, progress: 1 }
  }
  if (nextIndex === 0) {
    return { position: stations[0].position, atStation: stations[0], index: 0, progress: 0 }
  }

  const previous = stations[nextIndex - 1]
  const next = stations[nextIndex]
  const span = next.distanceFromOriginKm - previous.distanceFromOriginKm
  const progress = span > 0 ? (distanceCoveredKm - previous.distanceFromOriginKm) / span : 1

  // Exactly on a station — standing at it rather than running between two.
  if (progress >= 1) return { position: next.position, atStation: next, index: nextIndex, progress: 1 }

  return { position: lerp(previous.position, next.position, progress), previous, next, index: nextIndex, progress }
}

/**
 * The route split at the train.
 *
 * `covered` is drawn solid — it is where the train has actually been.
 * `ahead` is drawn dashed, because everything past the marker is forecast.
 * The train's own point belongs to both so the two lines meet under the marker.
 */
export function getRouteGeometry(journey) {
  const stations = getRouteStations(journey)
  const train = locateTrain(stations, journey.current.distanceCoveredKm)

  // Points strictly behind the marker, then the marker itself.
  const behind = stations.slice(0, train.atStation ? train.index : train.index).map((s) => s.position)
  const infront = stations.slice(train.atStation ? train.index + 1 : train.index).map((s) => s.position)

  return {
    stations,
    train,
    covered: [...behind, train.position],
    ahead: [train.position, ...infront],
    bounds: stations.map((station) => station.position),
  }
}

/** The next station the train will call at, for the map summary and voice reply. */
export const getNextStation = (journey) =>
  getRouteStations(journey).find((station) => station.status !== 'completed') ?? null
