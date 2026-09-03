import { useCallback, useEffect, useRef, useState } from 'react'
// maplibre-gl v6 ships named exports only; there is no default export.
import { LngLatBounds, Map as MapLibreMap, NavigationControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useNetwork } from '../../context/NetworkProvider'
import { useTheme } from '../../context/ThemeProvider'
import {
  networkStations,
  positionOf,
  routeCoordinates,
  trainNumbers,
  trainStateAt,
} from '../../lib/railSim'
import { baseStyle, getMapPalette, INDIA_VIEW, TRAIN_COLORS } from './mapStyle'

/**
 * The live railway map.
 *
 * Trains are a single GeoJSON source rendered as a symbol layer, not thirteen
 * DOM markers: the per-frame update is one `setData` call and the icons are
 * rotated and drawn on the GPU, so the whole fleet animates without touching
 * React or the DOM. Icons are generated once into canvases and registered with
 * `addImage`, which is also what lets each train carry its own status colour
 * and heading.
 *
 * Station names are DOM overlays rather than a symbol layer, because the style
 * ships no glyph endpoint (see mapStyle.js) — and because it lets the labels
 * use the site's own typefaces.
 */

const STATUSES = ['on-time', 'watch', 'delayed', 'critical']

/**
 * Draw the train marker into a canvas for `addImage`.
 *
 * The silhouette matches the SVG marker used elsewhere: a chamfered nose so
 * direction of travel is unambiguous, a body, and a light cab band. Drawn
 * nose-up because MapLibre's `icon-rotate` treats 0° as north.
 */
function trainIcon(color, scale = 1, ring = false) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = 30 * scale
  const h = 30 * scale
  const canvas = document.createElement('canvas')
  canvas.width = w * dpr
  canvas.height = h * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.translate(w / 2, h / 2)
  const s = scale

  if (ring) {
    ctx.beginPath()
    ctx.arc(0, 0, 13 * s, 0, Math.PI * 2)
    ctx.strokeStyle = color
    ctx.globalAlpha = 0.45
    ctx.lineWidth = 1.5 * s
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  // Body, nose pointing up (-y).
  ctx.beginPath()
  ctx.moveTo(-4.2 * s, 6.0 * s)
  ctx.lineTo(-4.2 * s, -4.0 * s)
  ctx.lineTo(0, -8.4 * s)
  ctx.lineTo(4.2 * s, -4.0 * s)
  ctx.lineTo(4.2 * s, 6.0 * s)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = 'rgba(20,30,26,0.85)'
  ctx.lineWidth = 1 * s
  ctx.stroke()

  // Cab band / headlight end.
  ctx.beginPath()
  ctx.moveTo(-3.1 * s, -4.4 * s)
  ctx.lineTo(0, -7.2 * s)
  ctx.lineTo(3.1 * s, -4.4 * s)
  ctx.closePath()
  ctx.fillStyle = 'rgba(247,242,233,0.9)'
  ctx.fill()

  return {
    width: canvas.width,
    height: canvas.height,
    data: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
    pixelRatio: dpr,
  }
}

const emptyFC = { type: 'FeatureCollection', features: [] }

export function RailMap({ selectedTrain, onSelectTrain, onSelectStation, followSelected, className }) {
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

  const palette = getMapPalette(theme)
  const paletteRef = useRef(palette)
  paletteRef.current = palette

  // -- map creation --------------------------------------------------------
  useEffect(() => {
    if (mapRef.current) return

    const map = new MapLibreMap({
      container: containerRef.current,
      style: baseStyle(paletteRef.current),
      center: INDIA_VIEW.center,
      zoom: INDIA_VIEW.zoom,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      maxZoom: 11,
      minZoom: 3,
    })
    mapRef.current = map
    if (import.meta.env.DEV) window.__railmap = map

    map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right')

    map.on('load', async () => {
      const p = paletteRef.current

      // Landmass and states, shipped with the app (see public/geo).
      const [india, states] = await Promise.all([
        fetch('/geo/india.json').then((r) => r.json()),
        fetch('/geo/india-states.json').then((r) => r.json()),
      ])

      map.addSource('india', { type: 'geojson', data: india })
      map.addSource('states', { type: 'geojson', data: states })

      map.addLayer({
        id: 'land',
        type: 'fill',
        source: 'india',
        paint: { 'fill-color': p.land },
      })
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

      // Corridors: every route in the fleet, drawn once and quietly.
      const corridors = {
        type: 'FeatureCollection',
        features: trainNumbers.map((number) => ({
          type: 'Feature',
          properties: { number },
          geometry: { type: 'LineString', coordinates: routeCoordinates(number) },
        })),
      }
      map.addSource('corridors', { type: 'geojson', data: corridors })
      map.addSource('active-route', { type: 'geojson', data: emptyFC })
      map.addSource('covered-route', { type: 'geojson', data: emptyFC })

      map.addLayer({
        id: 'corridor-casing',
        type: 'line',
        source: 'corridors',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.corridorCasing, 'line-width': 4.5, 'line-opacity': 0.7 },
      })
      map.addLayer({
        id: 'corridor',
        type: 'line',
        source: 'corridors',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.corridor, 'line-width': 1.5, 'line-opacity': 0.75 },
      })

      // The selected service: its whole route, then the part already run.
      map.addLayer({
        id: 'active-casing',
        type: 'line',
        source: 'active-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.activeCasing, 'line-width': 8, 'line-opacity': 0.85 },
      })
      map.addLayer({
        id: 'active-route',
        type: 'line',
        source: 'active-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.activeRoute, 'line-width': 3 },
      })
      map.addLayer({
        id: 'covered-route',
        type: 'line',
        source: 'covered-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': p.coveredRoute, 'line-width': 3.4 },
      })

      // Stations.
      const stations = {
        type: 'FeatureCollection',
        features: networkStations.map((s) => ({
          type: 'Feature',
          properties: { code: s.code, name: s.name, major: s.major ? 1 : 0 },
          geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
        })),
      }
      map.addSource('stations', { type: 'geojson', data: stations })
      map.addLayer({
        id: 'stations',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'major'], 1], 5, 3],
          'circle-color': p.station,
          'circle-stroke-color': ['case', ['==', ['get', 'major'], 1], p.stationMajor, p.stationEdge],
          'circle-stroke-width': ['case', ['==', ['get', 'major'], 1], 2.2, 1.4],
        },
      })

      // Train icons, one image per status plus a selected variant.
      for (const status of STATUSES) {
        map.addImage(`train-${status}`, trainIcon(TRAIN_COLORS[status], 1))
        map.addImage(`train-${status}-sel`, trainIcon(TRAIN_COLORS[status], 1.7, true))
      }

      map.addSource('trains', { type: 'geojson', data: emptyFC })
      map.addLayer({
        id: 'trains',
        type: 'symbol',
        source: 'trains',
        layout: {
          'icon-image': ['get', 'icon'],
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-size': 1,
        },
      })

      // Frame the running network rather than the whole country: a fixed
      // centre leaves the Bay of Bengal taking up a third of the panel.
      const lngs = networkStations.map((s) => s.lng)
      const lats = networkStations.map((s) => s.lat)
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 54, duration: 0 },
      )

      readyRef.current = true
      setReady(true)
    })

    // Pointer affordances and selection.
    const hit = (event, layer) => map.queryRenderedFeatures(event.point, { layers: [layer] })[0]

    map.on('click', (event) => {
      const train = hit(event, 'trains')
      if (train) {
        onSelectTrain?.(train.properties.number)
        return
      }
      const station = hit(event, 'stations')
      if (station) onSelectStation?.(station.properties.code)
    })

    map.on('mousemove', (event) => {
      if (!readyRef.current) return
      const over = hit(event, 'trains') || hit(event, 'stations')
      map.getCanvas().style.cursor = over ? 'pointer' : ''
    })

    return () => {
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

        features.push({
          type: 'Feature',
          properties: {
            number: state.number,
            icon: `train-${state.status}${isSelected ? '-sel' : ''}`,
            bearing: position.bearing,
          },
          geometry: { type: 'Point', coordinates: [position.lng, position.lat] },
        })
      }

      source.setData({ type: 'FeatureCollection', features })

      // Keep the covered part of the selected route in step with the marker.
      if (selectedRef.current) {
        const covered = map.getSource('covered-route')
        const coords = routeCoordinates(selectedRef.current)
        const state = trainStateAt(selectedRef.current, minutes)
        if (covered && coords.length && state) {
          const upto = Math.max(2, Math.round(state.position * (coords.length - 1)) + 1)
          covered.setData({
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords.slice(0, upto) } },
            ],
          })
        }
      }

      if (followRef.current && selectedPosition) {
        map.easeTo({ center: [selectedPosition.lng, selectedPosition.lat], duration: 220 })
      }
    })
  }, [ready, subscribe])

  // -- selection: draw the route and fly to it -----------------------------
  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return

    const active = map.getSource('active-route')
    const covered = map.getSource('covered-route')
    if (!active || !covered) return

    if (!selectedTrain) {
      active.setData(emptyFC)
      covered.setData(emptyFC)
      map.setPaintProperty('corridor', 'line-opacity', 0.75)
      return
    }

    const coords = routeCoordinates(selectedTrain)
    active.setData({
      type: 'FeatureCollection',
      features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } }],
    })

    // Everything else recedes so the chosen route dominates (§9).
    map.setPaintProperty('corridor', 'line-opacity', 0.22)

    const bounds = coords.reduce(
      (acc, c) => acc.extend(c),
      new LngLatBounds(coords[0], coords[0]),
    )
    map.fitBounds(bounds, {
      padding: { top: 60, bottom: 60, left: 60, right: 60 },
      duration: prefersReducedMotion ? 0 : 900,
      maxZoom: 7,
    })
  }, [selectedTrain, ready, prefersReducedMotion])

  // -- theme changes -------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return
    const p = palette
    const set = (layer, prop, value) => {
      if (map.getLayer(layer)) map.setPaintProperty(layer, prop, value)
    }
    set('background', 'background-color', p.void)
    set('land', 'fill-color', p.land)
    set('state-lines', 'line-color', p.state)
    set('land-edge', 'line-color', p.landEdge)
    set('corridor', 'line-color', p.corridor)
    set('corridor-casing', 'line-color', p.corridorCasing)
    set('active-route', 'line-color', p.activeRoute)
    set('active-casing', 'line-color', p.activeCasing)
    set('covered-route', 'line-color', p.coveredRoute)
    set('stations', 'circle-color', p.station)
    set('stations', 'circle-stroke-color', [
      'case',
      ['==', ['get', 'major'], 1],
      p.stationMajor,
      p.stationEdge,
    ])
  }, [palette, ready])

  // -- station name overlays ----------------------------------------------
  // Projected on move rather than drawn as a symbol layer, so labels can use
  // the site's own type. Only major stations, and only when zoomed in enough
  // to have room for them.
  const refreshLabels = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    const zoom = map.getZoom()
    const candidates = networkStations
      .filter((s) => (zoom >= 5.4 ? true : s.major))
      // Major stations claim their space first, so when two codes collide it
      // is the minor one that drops out.
      .sort((a, b) => Number(b.major) - Number(a.major))

    // Greedy collision rejection: without it, codes that sit close together
    // (NDLS and NZM, BCT and CSMT) overprint into unreadable glyph soup.
    const placed = []
    const next = []
    for (const station of candidates) {
      const point = map.project([station.lng, station.lat])
      const box = {
        x1: point.x - 4,
        y1: point.y - 7,
        x2: point.x + 10 + station.code.length * 6.2,
        y2: point.y + 7,
      }
      const clash = placed.some(
        (b) => box.x1 < b.x2 && box.x2 > b.x1 && box.y1 < b.y2 && box.y2 > b.y1,
      )
      if (clash) continue
      placed.push(box)
      next.push({ code: station.code, major: station.major, x: point.x, y: point.y })
    }
    setLabels(next)
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return
    refreshLabels()
    map.on('move', refreshLabels)
    map.on('zoom', refreshLabels)
    return () => {
      map.off('move', refreshLabels)
      map.off('zoom', refreshLabels)
    }
  }, [ready, refreshLabels])

  const selectedState = trains.find((t) => t.number === selectedTrain)

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
            className={`absolute -translate-y-1/2 whitespace-nowrap font-mono text-[0.625rem] tracking-[0.08em] ${
              label.major ? 'font-semibold' : 'font-normal opacity-80'
            }`}
            style={{
              left: label.x + (label.major ? 9 : 7),
              top: label.y,
              color: palette.label,
              textShadow: `0 0 3px ${palette.labelHalo}, 0 0 3px ${palette.labelHalo}`,
            }}
          >
            {label.code}
          </span>
        ))}
      </div>

      {selectedState ? (
        <p className="pointer-events-none absolute bottom-2 left-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
          Tracing {selectedState.number} · simulated
        </p>
      ) : null}
    </div>
  )
}
