import { useCallback, useEffect, useRef, useState } from 'react'
// maplibre-gl v6 ships named exports only; there is no default export.
import { LngLatBounds, Map as MapLibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Crosshair, Frame, Minus, Plus } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import { useTheme } from '../../context/ThemeProvider'
import {
  networkStations,
  positionOf,
  routeCoordinates,
  routes,
  trainNumbers,
  trainStateAt,
} from '../../lib/railSim'
import {
  baseStyle,
  BASEMAP_CREDIT,
  getBasemap,
  getMapPalette,
  INDIA_VIEW,
  TRAIN_COLORS,
} from './mapStyle'
import { badgeImage, headingImage } from './trainMarker'

/**
 * The live railway map.
 *
 * The ground is a real basemap (see mapStyle.js) so a route is read against
 * the country it actually crosses. Over it, the selected service is drawn as a
 * railway line in three states — already run, running now, still to run — all
 * three sliced from the *same* polyline at the *same* progress the journey
 * timeline reads, which is what stops the map and the timeline from ever
 * disagreeing about where the train is.
 *
 * Trains are a single GeoJSON source rendered as two symbol layers, not a DOM
 * marker each: the per-frame update is one `setData` call and the icons are
 * placed and rotated on the GPU, so the whole fleet animates without touching
 * React or the DOM.
 *
 * Station names are DOM overlays rather than a symbol layer, because the style
 * ships no glyph endpoint — and because it lets the labels use the site's own
 * typefaces over a basemap that has its own.
 */

const STATUSES = ['on-time', 'watch', 'delayed', 'critical']

const emptyFC = { type: 'FeatureCollection', features: [] }

const lineFC = (coordinates) => ({
  type: 'FeatureCollection',
  features:
    coordinates.length > 1
      ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } }]
      : [],
})

/** Line widths grow with zoom, so the route stays a route at either end. */
const byZoom = (near, far) => ['interpolate', ['linear'], ['zoom'], 4, near, 9, far]

/**
 * The same ramp, but picking between two sizes per feature.
 *
 * `zoom` is only legal at the very outside of an expression, so the test has
 * to sit inside each stop of the interpolation rather than around it.
 */
const byZoomCase = (test, [nearYes, farYes], [nearNo, farNo]) => [
  'interpolate',
  ['linear'],
  ['zoom'],
  4,
  ['case', test, nearYes, nearNo],
  9,
  ['case', test, farYes, farNo],
]

const boundsOf = (coordinates) =>
  coordinates.reduce((acc, c) => acc.extend(c), new LngLatBounds(coordinates[0], coordinates[0]))

const FIT_PADDING = { top: 46, bottom: 46, left: 46, right: 46 }

/** The stops of one service, as map features. */
function routeStopsFC(number) {
  const stops = routes.get(number)?.stops ?? []
  return {
    type: 'FeatureCollection',
    features: stops.map((stop, i) => ({
      type: 'Feature',
      properties: {
        code: stop.code,
        name: stop.name,
        terminus: i === 0 || i === stops.length - 1 ? 1 : 0,
      },
      geometry: { type: 'Point', coordinates: [stop.lng, stop.lat] },
    })),
  }
}

export function RailMap({
  selectedTrain,
  onSelectTrain,
  onSelectStation,
  followSelected,
  focusMode = false,
  className,
}) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { subscribe, trains, prefersReducedMotion } = useNetwork()

  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const readyRef = useRef(false)
  const [ready, setReady] = useState(false)
  const [labels, setLabels] = useState([])

  const selectedRef = useRef(selectedTrain)
  selectedRef.current = selectedTrain
  const followRef = useRef(followSelected)
  followRef.current = followSelected
  const focusRef = useRef(focusMode)
  focusRef.current = focusMode
  // Where the selected train is right now, kept fresh by the frame loop so the
  // locate control can jump to it without re-running the simulation.
  const trainPositionRef = useRef(null)

  const palette = getMapPalette(theme)
  const paletteRef = useRef(palette)
  paletteRef.current = palette
  const themeRef = useRef(theme)
  themeRef.current = theme

  // -- map creation --------------------------------------------------------
  useEffect(() => {
    if (mapRef.current) return
    let disposed = false

    const map = new MapLibreMap({
      container: containerRef.current,
      style: baseStyle(paletteRef.current),
      center: INDIA_VIEW.center,
      zoom: INDIA_VIEW.zoom,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      maxZoom: 14,
      minZoom: 3,
    })
    mapRef.current = map
    if (import.meta.env.DEV) window.__railmap = map

    map.on('load', async () => {
      if (disposed) return
      const p = paletteRef.current

      // -- fallback geography, drawn beneath the tiles ---------------------
      // Shipped with the app (see public/geo). Invisible whenever the basemap
      // loads; the reason the map degrades to a landmass rather than a blank
      // rectangle when it does not.
      try {
        const [india, states] = await Promise.all([
          fetch('/geo/india.json').then((r) => r.json()),
          fetch('/geo/india-states.json').then((r) => r.json()),
        ])
        if (disposed || !map.getStyle()) return

        map.addSource('india', { type: 'geojson', data: india })
        map.addSource('states', { type: 'geojson', data: states })
        map.addLayer({ id: 'land', type: 'fill', source: 'india', paint: { 'fill-color': p.land } })
        map.addLayer({
          id: 'state-lines',
          type: 'line',
          source: 'states',
          paint: { 'line-color': p.state, 'line-width': 0.8 },
        })
        map.addLayer({
          id: 'land-edge',
          type: 'line',
          source: 'india',
          paint: { 'line-color': p.landEdge, 'line-width': 1.1 },
        })
      } catch {
        /* the basemap is the map; the outline is only insurance */
      }
      if (disposed || !map.getStyle()) return

      // -- the basemap -----------------------------------------------------
      const basemap = getBasemap(themeRef.current)
      map.addSource('basemap', {
        type: 'raster',
        tiles: basemap.base,
        tileSize: 256,
        maxzoom: 16,
        attribution: basemap.attribution,
      })
      map.addLayer({
        id: 'basemap',
        type: 'raster',
        source: 'basemap',
        paint: {
          'raster-saturation': basemap.saturation,
          'raster-contrast': basemap.contrast,
          'raster-brightness-min': basemap.brightnessMin,
          'raster-brightness-max': basemap.brightnessMax,
          'raster-fade-duration': 220,
        },
      })
      // The wash that carries the stock basemap into RailSense's palette.
      map.addLayer({
        id: 'basemap-tint',
        type: 'background',
        paint: { 'background-color': p.tint, 'background-opacity': p.tintOpacity },
      })
      // Place names, for the basemaps that publish them as their own
      // transparent overlay. Hidden rather than merely transparent when the
      // theme has none, so MapLibre stops requesting the tiles altogether.
      map.addSource('basemap-labels', {
        type: 'raster',
        tiles: basemap.labels ?? basemap.base,
        tileSize: 256,
        maxzoom: 16,
      })
      map.addLayer({
        id: 'basemap-labels',
        type: 'raster',
        source: 'basemap-labels',
        layout: { visibility: basemap.labels ? 'visible' : 'none' },
        paint: { 'raster-fade-duration': 220 },
      })

      // -- corridors: every route in the fleet, drawn once and quietly ------
      map.addSource('corridors', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: trainNumbers.map((number) => ({
            type: 'Feature',
            properties: { number },
            geometry: { type: 'LineString', coordinates: routeCoordinates(number) },
          })),
        },
      })
      map.addLayer({
        id: 'corridor-casing',
        type: 'line',
        source: 'corridors',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.corridorCasing, 'line-width': byZoom(3.4, 5), 'line-opacity': 0.5 },
      })
      map.addLayer({
        id: 'corridor',
        type: 'line',
        source: 'corridors',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.corridor, 'line-width': byZoom(1.2, 2), 'line-opacity': 0.55 },
      })

      // -- the selected service --------------------------------------------
      map.addSource('route', { type: 'geojson', data: emptyFC })
      map.addSource('route-covered', { type: 'geojson', data: emptyFC })
      map.addSource('route-current', { type: 'geojson', data: emptyFC })
      map.addSource('route-stops', { type: 'geojson', data: emptyFC })

      // A pale casing under the whole line: without it a dark route disappears
      // into the basemap's own dark roads wherever the two cross.
      map.addLayer({
        id: 'route-halo',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.routeHalo, 'line-width': byZoom(11, 17), 'line-opacity': 0.9 },
      })
      // Three states, drawn in order (§21): the whole route as the "still to
      // run" line, the part already run over it, then the section the train is
      // inside as the one bright band.
      map.addLayer({
        id: 'route-ahead',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.routeAhead, 'line-width': byZoom(5.4, 8) },
      })
      map.addLayer({
        id: 'route-covered',
        type: 'line',
        source: 'route-covered',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.routeCovered, 'line-width': byZoom(6, 8.8) },
      })
      map.addLayer({
        id: 'route-current',
        type: 'line',
        source: 'route-current',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.routeCurrent, 'line-width': byZoom(7.6, 11) },
      })
      // Sleeper hatch over all three states, which is what makes the line read
      // as railway rather than as a road or a flight path.
      map.addLayer({
        id: 'route-ties',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'butt', 'line-join': 'round' },
        paint: {
          'line-color': p.routeTie,
          'line-width': byZoom(2.8, 4.6),
          'line-opacity': 0.75,
          'line-dasharray': [0.55, 1.5],
        },
      })

      // -- stations ---------------------------------------------------------
      map.addSource('stations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: networkStations.map((s) => ({
            type: 'Feature',
            properties: { code: s.code, name: s.name, major: s.major ? 1 : 0 },
            geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
          })),
        },
      })
      map.addLayer({
        id: 'stations',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'major'], 1], 5, 3],
          'circle-color': p.station,
          'circle-stroke-color': [
            'case',
            ['==', ['get', 'major'], 1],
            p.stationMajor,
            p.stationEdge,
          ],
          'circle-stroke-width': ['case', ['==', ['get', 'major'], 1], 2.2, 1.4],
        },
      })
      // The selected service's own calls, drawn over its line: origin and
      // terminus filled, intermediate stops open.
      map.addLayer({
        id: 'route-stops',
        type: 'circle',
        source: 'route-stops',
        paint: {
          // `zoom` has to be the outermost expression, so the terminus test
          // goes inside each stop rather than wrapping two interpolates —
          // written the other way round the style spec rejects the layer and
          // MapLibre drops it silently, taking every station marker with it.
          'circle-radius': byZoomCase(
            ['==', ['get', 'terminus'], 1],
            [5.6, 8],
            [4.2, 6],
          ),
          'circle-color': [
            'case',
            ['==', ['get', 'terminus'], 1],
            p.terminusFill,
            p.stopFill,
          ],
          'circle-stroke-color': p.stopEdge,
          'circle-stroke-width': ['case', ['==', ['get', 'terminus'], 1], 2.4, 2],
        },
      })

      // -- trains -----------------------------------------------------------
      for (const status of STATUSES) {
        map.addImage(`train-${status}`, badgeImage(TRAIN_COLORS[status], false))
        map.addImage(`train-${status}-sel`, badgeImage(TRAIN_COLORS[status], true))
        map.addImage(`heading-${status}`, headingImage(TRAIN_COLORS[status], false))
        map.addImage(`heading-${status}-sel`, headingImage(TRAIN_COLORS[status], true))
      }

      map.addSource('trains', { type: 'geojson', data: emptyFC })
      // The pip rotates with the heading; the badge stays upright so the
      // locomotive is never drawn upside-down.
      map.addLayer({
        id: 'train-heading',
        type: 'symbol',
        source: 'trains',
        layout: {
          'icon-image': ['get', 'heading'],
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      })
      map.addLayer({
        id: 'train-badge',
        type: 'symbol',
        source: 'trains',
        layout: {
          'icon-image': ['get', 'icon'],
          'icon-rotation-alignment': 'viewport',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      })

      // Open on the selected journey when there is one, so a passenger opening
      // their train sees their train — not the country with it somewhere in it.
      const opening = selectedRef.current ? routeCoordinates(selectedRef.current) : []
      map.fitBounds(
        opening.length
          ? boundsOf(opening)
          : boundsOf(networkStations.map((s) => [s.lng, s.lat])),
        { padding: FIT_PADDING, duration: 0, maxZoom: 9 },
      )

      readyRef.current = true
      setReady(true)
    })

    // Pointer affordances and selection.
    const hit = (event, layer) =>
      map.getLayer(layer) ? map.queryRenderedFeatures(event.point, { layers: [layer] })[0] : null

    map.on('click', (event) => {
      if (!readyRef.current) return
      const train = hit(event, 'train-badge')
      if (train) {
        onSelectTrain?.(train.properties.number)
        return
      }
      const station = hit(event, 'route-stops') ?? hit(event, 'stations')
      if (station) onSelectStation?.(station.properties.code)
    })

    map.on('mousemove', (event) => {
      if (!readyRef.current) return
      const over =
        hit(event, 'train-badge') ?? hit(event, 'route-stops') ?? hit(event, 'stations')
      map.getCanvas().style.cursor = over ? 'pointer' : ''
    })

    return () => {
      disposed = true
      map.remove()
      mapRef.current = null
      readyRef.current = false
    }
    // Handlers are read through refs; the map is created exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -- per-frame train positions ------------------------------------------
  useEffect(() => {
    if (!ready) return

    return subscribe((minutes) => {
      const map = mapRef.current
      const source = map?.getSource('trains')
      if (!source) return

      const features = []
      let selectedPosition = null

      for (const number of trainNumbers) {
        const state = trainStateAt(number, minutes)
        if (!state) continue
        const position = positionOf(state)
        if (!position) continue

        const isSelected = selectedRef.current === number
        if (isSelected) selectedPosition = position

        // Focused mode shows one service only — the others are removed from
        // the layer entirely rather than dimmed (§7).
        if (focusRef.current && !isSelected) continue

        const suffix = isSelected ? '-sel' : ''
        features.push({
          type: 'Feature',
          properties: {
            number: state.number,
            icon: `train-${state.status}${suffix}`,
            heading: `heading-${state.status}${suffix}`,
            bearing: position.bearing,
          },
          geometry: { type: 'Point', coordinates: [position.lng, position.lat] },
        })
      }

      source.setData({ type: 'FeatureCollection', features })
      trainPositionRef.current = selectedPosition

      // Keep the route's three states in step with the marker. All three are
      // slices of the same polyline at the same progress the timeline reads,
      // so map and timeline can never disagree about what has been run.
      if (selectedRef.current) {
        const covered = map.getSource('route-covered')
        const current = map.getSource('route-current')
        const coords = routeCoordinates(selectedRef.current)
        const state = trainStateAt(selectedRef.current, minutes)

        if (covered && current && coords.length && state) {
          const last = coords.length - 1
          const at = (v) => Math.min(Math.max(Math.round(v * last), 0), last)
          const upto = Math.max(1, at(state.position))

          covered.setData(lineFC(coords.slice(0, upto + 1)))
          current.setData(
            state.section
              ? lineFC(coords.slice(at(state.section.tFrom), at(state.section.tTo) + 1))
              : emptyFC,
          )
        }
      }

      if (followRef.current && selectedPosition) {
        map.easeTo({ center: [selectedPosition.lng, selectedPosition.lat], duration: 220 })
      }
    })
  }, [ready, subscribe])

  // -- selection: draw the route and frame it ------------------------------
  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return

    const route = map.getSource('route')
    const covered = map.getSource('route-covered')
    const current = map.getSource('route-current')
    const stops = map.getSource('route-stops')
    if (!route || !covered || !current || !stops) return

    const visible = (layer, on) => {
      if (map.getLayer(layer)) map.setLayoutProperty(layer, 'visibility', on ? 'visible' : 'none')
    }

    if (!selectedTrain) {
      route.setData(emptyFC)
      covered.setData(emptyFC)
      current.setData(emptyFC)
      stops.setData(emptyFC)
      map.setPaintProperty('corridor', 'line-opacity', 0.55)
      map.setPaintProperty('corridor-casing', 'line-opacity', 0.5)
      visible('stations', true)
      return
    }

    const coords = routeCoordinates(selectedTrain)
    route.setData(lineFC(coords))
    stops.setData(routeStopsFC(selectedTrain))

    // Everything else recedes so the chosen route dominates; in focused mode
    // the other corridors go entirely, leaving geography and one journey.
    map.setPaintProperty('corridor', 'line-opacity', focusMode ? 0 : 0.2)
    map.setPaintProperty('corridor-casing', 'line-opacity', focusMode ? 0 : 0.35)
    // The fleet's other stations would only crowd the calls that matter.
    visible('stations', !focusMode)

    if (!coords.length) return
    map.fitBounds(boundsOf(coords), {
      padding: FIT_PADDING,
      duration: prefersReducedMotion ? 0 : 900,
      maxZoom: 9,
    })
  }, [selectedTrain, ready, prefersReducedMotion, focusMode])

  // -- theme changes -------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return
    const p = palette

    const basemap = getBasemap(theme)
    // Swapping the tile template in place keeps the layers, and their paint,
    // put — rebuilding the style instead would drop every simulation layer.
    map.getSource('basemap')?.setTiles?.(basemap.base)
    map.getSource('basemap-labels')?.setTiles?.(basemap.labels ?? basemap.base)
    if (map.getLayer('basemap-labels')) {
      map.setLayoutProperty('basemap-labels', 'visibility', basemap.labels ? 'visible' : 'none')
    }

    const set = (layer, prop, value) => {
      if (map.getLayer(layer)) map.setPaintProperty(layer, prop, value)
    }
    set('background', 'background-color', p.void)
    set('basemap', 'raster-saturation', basemap.saturation)
    set('basemap', 'raster-contrast', basemap.contrast)
    set('basemap', 'raster-brightness-min', basemap.brightnessMin)
    set('basemap', 'raster-brightness-max', basemap.brightnessMax)
    set('basemap-tint', 'background-color', p.tint)
    set('basemap-tint', 'background-opacity', p.tintOpacity)
    set('land', 'fill-color', p.land)
    set('state-lines', 'line-color', p.state)
    set('land-edge', 'line-color', p.landEdge)
    set('corridor', 'line-color', p.corridor)
    set('corridor-casing', 'line-color', p.corridorCasing)
    set('route-halo', 'line-color', p.routeHalo)
    set('route-ahead', 'line-color', p.routeAhead)
    set('route-covered', 'line-color', p.routeCovered)
    set('route-current', 'line-color', p.routeCurrent)
    set('route-ties', 'line-color', p.routeTie)
    set('stations', 'circle-color', p.station)
    set('stations', 'circle-stroke-color', [
      'case',
      ['==', ['get', 'major'], 1],
      p.stationMajor,
      p.stationEdge,
    ])
    set('route-stops', 'circle-color', [
      'case',
      ['==', ['get', 'terminus'], 1],
      p.terminusFill,
      p.stopFill,
    ])
    set('route-stops', 'circle-stroke-color', p.stopEdge)
  }, [palette, theme, ready])

  // -- controls ------------------------------------------------------------
  const zoomBy = useCallback((delta) => {
    const map = mapRef.current
    if (!map) return
    map.easeTo({ zoom: map.getZoom() + delta, duration: 220 })
  }, [])

  const locateTrain = useCallback(() => {
    const map = mapRef.current
    const position = trainPositionRef.current
    if (!map || !position) return
    map.easeTo({
      center: [position.lng, position.lat],
      zoom: Math.max(map.getZoom(), 8),
      duration: 700,
    })
  }, [])

  const fitRoute = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const coords = selectedRef.current ? routeCoordinates(selectedRef.current) : []
    const points = coords.length ? coords : networkStations.map((s) => [s.lng, s.lat])
    if (!points.length) return
    map.fitBounds(boundsOf(points), { padding: FIT_PADDING, duration: 700, maxZoom: 9 })
  }, [])

  // -- station name overlays ----------------------------------------------
  // Projected on move rather than drawn as a symbol layer, so labels can use
  // the site's own type. In focused mode the selected service's own calls are
  // the labels that matter — a passenger tracing their journey needs to read
  // the stations it stops at, not whichever junctions happen to be nationally
  // important.
  const refreshLabels = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    const zoom = map.getZoom()
    const onRoute = focusRef.current && selectedRef.current ? routes.get(selectedRef.current) : null
    const stops = onRoute?.stops ?? []

    const candidates = stops.length
      ? stops.map((stop, i) => ({
          code: stop.code,
          // The terminals are the two names a passenger checks first; the rest
          // carry their code until there is room on screen for more.
          name: i === 0 || i === stops.length - 1 || zoom >= 6.4 ? stop.name : null,
          weight: i === 0 || i === stops.length - 1 ? 2 : 1,
          lng: stop.lng,
          lat: stop.lat,
        }))
      : networkStations
          .filter((s) => (zoom >= 5.4 ? true : s.major))
          .map((s) => ({
            code: s.code,
            name: zoom >= 7 ? s.name : null,
            weight: s.major ? 1 : 0,
            lng: s.lng,
            lat: s.lat,
          }))

    // Heavier labels claim their space first — when two collide it is the
    // least important one that drops out.
    const ordered = [...candidates].sort((a, b) => b.weight - a.weight)

    // Greedy collision rejection: without it, codes that sit close together
    // (NDLS and NZM, BCT and CSMT) overprint into unreadable glyph soup.
    const placed = []
    const next = []
    for (const station of ordered) {
      const point = map.project([station.lng, station.lat])
      const width = 12 + station.code.length * 6.4 + (station.name ? station.name.length * 5.4 + 7 : 0)
      const box = {
        x1: point.x - 4,
        y1: point.y - 10,
        x2: point.x + 10 + width,
        y2: point.y + 10,
      }
      const clash = placed.some(
        (b) => box.x1 < b.x2 && box.x2 > b.x1 && box.y1 < b.y2 && box.y2 > b.y1,
      )
      if (clash) continue
      placed.push(box)
      next.push({ ...station, x: point.x, y: point.y })
    }
    setLabels(next)
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return
    refreshLabels()
    map.on('move', refreshLabels)
    map.on('zoom', refreshLabels)
    map.on('idle', refreshLabels)
    return () => {
      map.off('move', refreshLabels)
      map.off('zoom', refreshLabels)
      map.off('idle', refreshLabels)
    }
    // selectedTrain/focusMode are read through refs inside refreshLabels, so
    // they are listed here to force a recompute when the mode changes.
  }, [ready, refreshLabels, selectedTrain, focusMode])

  const selectedState = trains.find((item) => item.number === selectedTrain)
  const controlButton =
    'flex size-7 items-center justify-center text-fg transition-colors hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent'

  return (
    <div className={className}>
      {/* Sized explicitly rather than with `absolute inset-0`: maplibre's own
          `.maplibregl-map` rule sets `position: relative` on this element,
          which cancels the inset stretching and collapses it to zero height. */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Labels sit above the canvas but must never eat a click meant for it. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {labels.map((label) => (
          <span
            key={label.code}
            className="absolute flex -translate-y-1/2 items-baseline gap-1.5 whitespace-nowrap border px-1.5 py-0.5"
            style={{
              left: label.x + 9,
              top: label.y,
              color: palette.label,
              background: palette.labelHalo,
              borderColor: label.weight >= 2 ? palette.stopEdge : 'transparent',
            }}
          >
            <span
              className={`font-mono text-[0.625rem] tracking-[0.08em] ${
                label.weight >= 1 ? 'font-semibold' : 'font-normal'
              }`}
            >
              {label.code}
            </span>
            {label.name ? (
              <span className="text-[0.625rem] leading-none opacity-75">{label.name}</span>
            ) : null}
          </span>
        ))}
      </div>

      {/* Zoom, locate the train, frame the route (§23). */}
      <div className="absolute right-2 top-2 flex flex-col divide-y divide-line border border-line bg-surface/95 backdrop-blur-[2px]">
        <button type="button" onClick={() => zoomBy(1)} aria-label={t('map.zoomIn')} className={controlButton}>
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => zoomBy(-1)} aria-label={t('map.zoomOut')} className={controlButton}>
          <Minus className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={locateTrain}
          disabled={!selectedTrain}
          aria-label={t('map.locateTrain')}
          title={t('map.locateTrain')}
          className={controlButton}
        >
          <Crosshair className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={fitRoute}
          aria-label={t('map.fitRoute')}
          title={t('map.fitRoute')}
          className={controlButton}
        >
          <Frame className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      {selectedState ? (
        <p className="pointer-events-none absolute left-2 top-2 border border-line bg-surface/90 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
          {t('map.tracing', { train: selectedState.number })}
        </p>
      ) : null}

      {/* Tile credit, in the site's own type rather than MapLibre's pill. */}
      <a
        href={BASEMAP_CREDIT.href}
        target="_blank"
        rel="noreferrer"
        title={BASEMAP_CREDIT.title}
        className="absolute bottom-0.5 right-1 font-mono text-[0.5rem] text-fg-subtle transition-colors hover:text-fg"
      >
        {BASEMAP_CREDIT.label}
      </a>
    </div>
  )
}
