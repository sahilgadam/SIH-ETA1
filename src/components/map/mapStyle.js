/**
 * The RailSense map style.
 *
 * The ground is a real basemap: Esri's public raster tiles, so the map shows
 * India as it is — coastline, rivers, state borders, cities, roads and the
 * countries around it — rather than a flat plate with station codes on it.
 * The tiles need no API key and no account, which is what makes them safe to
 * ship straight to a static host.
 *
 * Two things keep a stock basemap looking like RailSense rather than like a
 * generic web map: the raster is desaturated a little, and a parchment (or, in
 * dark mode, an ink) wash is laid over it at low opacity. Everything above the
 * wash — corridors, the selected route, stations, trains — is drawn from the
 * simulation in the palette below.
 *
 * `public/geo/india.json` is still drawn, underneath the tiles. It is invisible
 * whenever the tiles load and is there for the case where they do not: the map
 * degrades to the landmass it always had instead of to a blank rectangle.
 *
 * The style carries no `glyphs` endpoint, so it has no text layers. Station
 * names are DOM overlays in the site's own typefaces, which map fonts could
 * not have matched anyway.
 *
 * MapLibre cannot read CSS custom properties, so these mirror the tokens in
 * `src/index.css` by hand — literals rather than getComputedStyle reads,
 * because the theme class is applied in an effect and reading during render
 * would pick up the previous theme.
 */

/**
 * Esri's public ArcGIS Online basemaps.
 *
 * Chosen over the obvious alternatives for reasons that only show up in
 * production: CARTO's keyless endpoints now return tiles stamped API KEY
 * REQUIRED across the middle of them, and openstreetmap.org's own tile servers
 * block applications under their usage policy — both fail on the deployed site
 * while looking fine in a local test. These need no key, no account and no
 * origin allow-list, and they carry an attribution requirement we meet in the
 * corner of the map.
 *
 * Note the `{z}/{y}/{x}` order: ArcGIS puts row before column, the reverse of
 * every XYZ scheme, and getting it the usual way round yields a map of
 * somewhere else entirely.
 */
const esriTiles = (service) => [
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`,
]

const ESRI_ATTRIBUTION =
  'Tiles <a href="https://www.esri.com" target="_blank" rel="noreferrer">© Esri</a> — ' +
  'Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom'

/**
 * The credit RailSense prints in the corner of the map.
 *
 * Rendered by the component rather than by MapLibre's own AttributionControl,
 * which insists on a pill of its default sans-serif wide enough to cover a
 * third of a panel this size. Same obligation, met in the site's own type: the
 * short form is on screen and the full source list is on the link's tooltip.
 */
export const BASEMAP_CREDIT = {
  label: 'Tiles © Esri',
  title: 'Tiles © Esri — Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom',
  href: 'https://www.esri.com',
}

/**
 * World Street Map in daylight — its warm stone-and-cream cartography is
 * already most of the way to RailSense's parchment, so it needs steadying
 * rather than repainting. At night the Dark Gray Canvas, which ships its
 * labels as a separate transparent overlay: `labels` is that second layer, and
 * a basemap without one simply leaves it switched off.
 */
export const BASEMAPS = {
  light: {
    base: esriTiles('World_Street_Map'),
    labels: null,
    attribution: ESRI_ATTRIBUTION,
    // Calmed down so the railway on top of it is unmistakably the subject.
    saturation: -0.22,
    contrast: -0.05,
    brightnessMin: 0.05,
    brightnessMax: 1,
  },
  dark: {
    base: esriTiles('Canvas/World_Dark_Gray_Base'),
    labels: esriTiles('Canvas/World_Dark_Gray_Reference'),
    attribution: ESRI_ATTRIBUTION,
    saturation: -0.08,
    contrast: 0.06,
    brightnessMin: 0.03,
    // Esri's Dark Gray Canvas is a mid charcoal; RailSense's night page is
    // nearly black. Pulled down here and washed with ink below, so the panel
    // sits in the page rather than glowing out of it.
    brightnessMax: 0.72,
  },
}

export const MAP_PALETTE = {
  light: {
    void: '#dfe7ea', // sea, and whatever the tiles have not covered yet
    // The wash that pulls the basemap towards parchment.
    tint: '#f4f0e7',
    tintOpacity: 0.16,

    // Fallback geography, drawn under the tiles (see the note above).
    land: '#f4efe4',
    landEdge: '#c3ae91',
    state: '#ded0b9',

    // Every other service's corridor: present, never competing.
    corridor: '#7a6248',
    corridorCasing: '#f8f5ee',

    // The selected journey, read as a sequence (§21). A light halo under the
    // whole route is what lets it hold its own over a map with roads on it.
    routeHalo: '#f8f5ee',
    routeAhead: '#8d7357', // still to run — quiet warm grey-brown
    routeCovered: '#2c2019', // already run — deepest ink on the map
    routeCurrent: '#b8791f', // running now — the one bright band
    routeTie: 'rgba(248,245,238,0.75)', // sleeper hatch across the whole line

    station: '#f8f5ee',
    stationEdge: '#2c2019',
    stationMajor: '#96733e',
    stopFill: '#f8f5ee',
    stopEdge: '#2c2019',
    terminusFill: '#2c2019',

    label: '#2c2019',
    labelHalo: 'rgba(248,245,238,0.92)',
    congestion: '#b45c3c',
  },
  dark: {
    void: '#0d1512',
    tint: '#17231f',
    // Heavier than the daylight wash, and drawn *under* the place-name
    // overlay, so the ground darkens while the city names stay crisp.
    tintOpacity: 0.46,

    land: '#1b2a24',
    landEdge: '#33463c',
    state: '#243329',

    corridor: '#8a7561',
    corridorCasing: '#101a16',

    routeHalo: '#101a16',
    routeAhead: '#7d6a52',
    routeCovered: '#ece2ce', // on a dark map the already-run line is the pale one
    routeCurrent: '#e0bb74',
    routeTie: 'rgba(16,26,22,0.7)',

    station: '#101a16',
    stationEdge: '#cbb9a2',
    stationMajor: '#c3a46b',
    stopFill: '#17231f',
    stopEdge: '#f4f0e7',
    terminusFill: '#f4f0e7',

    label: '#f4f0e7',
    labelHalo: 'rgba(16,26,22,0.92)',
    congestion: '#d16a59',
  },
}

/** Status colours for train markers — fixed across themes, like signal aspects. */
export const TRAIN_COLORS = {
  'on-time': '#3e7455',
  watch: '#b97732',
  delayed: '#b97732',
  critical: '#a64637',
}

export const getMapPalette = (theme) => MAP_PALETTE[theme] ?? MAP_PALETTE.light
export const getBasemap = (theme) => BASEMAPS[theme] ?? BASEMAPS.light

/** The India view the map opens on and resets to. */
export const INDIA_VIEW = {
  center: [80.5, 21.5],
  zoom: 3.85,
}

/**
 * A complete MapLibre style with only a background layer. The basemap and
 * every simulation layer is added in `RailMap` once the map is up, so the
 * panel paints its own colour immediately instead of sitting blank until the
 * first tile lands.
 */
export function baseStyle(palette) {
  return {
    version: 8,
    name: 'RailSense',
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': palette.void },
      },
    ],
  }
}
