/**
 * Tile sources and the colours the map draws with.
 *
 * The map is a real slippy map over OpenStreetMap-derived tiles, so it needs a
 * network connection; `JourneyMap` shows a plain fallback if tiles fail rather
 * than leaving a grey box with no explanation.
 */
export const TILES = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
}

/**
 * Route colours per theme.
 *
 * Leaflet paints onto an SVG overlay and cannot read Tailwind classes, so these
 * mirror the tokens in `src/index.css` by hand. They are literals rather than
 * `getComputedStyle` reads because the `.dark` class is applied in an effect —
 * reading during render would pick up the previous theme's values.
 */
const PALETTES = {
  light: {
    covered: '#0b6b45',      // --brand
    ahead: '#62717a',        // --fg-subtle
    station: '#ffffff',      // --surface
    stationLine: '#62717a',  // --fg-subtle
    major: '#0b6b45',        // --brand
    train: '#b42318',        // --danger
  },
  dark: {
    covered: '#35a377',
    ahead: '#7d8d95',
    station: '#141e24',
    stationLine: '#7d8d95',
    major: '#35a377',
    train: '#f08a7d',
  },
}

export const getMapColors = (theme) => PALETTES[theme] ?? PALETTES.light
