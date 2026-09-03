/**
 * The RailSense map style.
 *
 * This is a bespoke style, not a tile provider's. There is no raster basemap
 * and no vector tile service behind it: the ground is a solid parchment fill,
 * the landmass and state hairlines are two small GeoJSON files we ship
 * ourselves, and everything above that is drawn from the simulation. That is
 * a deliberate choice — it is why the map cannot look like Google Maps, and
 * it means the map has no API key, no attribution requirement and no runtime
 * dependency on a third party.
 *
 * It also means no `glyphs` endpoint, so the style contains no text layers.
 * Station names are rendered as DOM overlays in the site's own typefaces,
 * which we could not have matched with map fonts anyway.
 *
 * MapLibre cannot read CSS custom properties, so these mirror the tokens in
 * `src/index.css` by hand — literals rather than getComputedStyle reads,
 * because the theme class is applied in an effect and reading during render
 * would pick up the previous theme.
 */

export const MAP_PALETTE = {
  light: {
    void: '#e7dccb', // sea / outside the landmass
    land: '#f4efe4',
    landEdge: '#c3ae91',
    state: '#ded0b9',
    corridor: '#b09477',
    corridorCasing: '#f4efe4',
    // The selected journey in three states (§21). Read as a sequence:
    // remaining is the lightest, already-run is the darkest, and the section
    // the train is inside is the one bright band.
    activeRoute: '#c9a970',   // remaining — light brass
    activeCasing: '#fbf7ef',
    coveredRoute: '#3b2920',  // already run — deep brown, darkest on the map
    currentSection: '#96733e', // running now — muted brass, strongest weight
    station: '#f8f5ee',
    stationEdge: '#7a6248',
    stationMajor: '#96733e',
    label: '#3b2920',
    labelHalo: 'rgba(247,242,233,0.9)',
    congestion: '#b45c3c',
  },
  dark: {
    void: '#101a16',
    land: '#1b2a24',
    landEdge: '#33463c',
    state: '#243329',
    corridor: '#6c5644',
    corridorCasing: '#1b2a24',
    activeRoute: '#8a7248',
    activeCasing: '#101a16',
    coveredRoute: '#e2d6c0',  // on a dark map the already-run line is the pale one
    currentSection: '#d8bd8a',
    station: '#101a16',
    stationEdge: '#9d8a72',
    stationMajor: '#c3a46b',
    label: '#e9e0d1',
    labelHalo: 'rgba(16,26,22,0.9)',
    congestion: '#d16a59',
  },
}

/** Status colours for train icons — fixed across themes, like signal aspects. */
export const TRAIN_COLORS = {
  'on-time': '#3e7455',
  watch: '#b97732',
  delayed: '#b97732',
  critical: '#a64637',
}

export const getMapPalette = (theme) => MAP_PALETTE[theme] ?? MAP_PALETTE.light

/** The India view the map opens on and resets to. */
export const INDIA_VIEW = {
  center: [80.5, 21.5],
  zoom: 3.85,
}

/**
 * A complete MapLibre style with only a background layer. Every other source
 * and layer is added in `RailMap` once the GeoJSON has loaded, so the map can
 * paint immediately instead of waiting on a network round trip.
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
