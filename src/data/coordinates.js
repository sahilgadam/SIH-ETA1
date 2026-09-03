/**
 * Approximate coordinates for every station on the sample journeys.
 *
 * These are hand-authored to roughly a kilometre — enough for the route to
 * trace the real geography of India on the map, not enough to place a platform.
 * Nothing here comes from a survey or a railway GIS feed, and the map legend
 * says so under the data-trust labels in `src/lib/trust.js`.
 *
 * The map draws straight segments between consecutive stations, so a station
 * placed out of running order would visibly zigzag. Keep this file consistent
 * with the running order in `src/data/journeys.js`.
 */
export const stationCoordinates = {
  // 12951 · Mumbai Central – New Delhi (Western + Kota route)
  BCT: [18.969, 72.819],
  BVI: [19.231, 72.857],
  BSR: [19.468, 72.847],
  PLG: [19.694, 72.765],
  VAPI: [20.372, 72.907],
  BL: [20.61, 72.93],
  ST: [21.206, 72.843],
  AKV: [21.626, 73.01],
  BH: [21.708, 72.997],
  MYG: [22.052, 73.133],
  BRC: [22.31, 73.181],
  GDA: [22.772, 73.615],
  DHD: [22.836, 74.256],
  MGN: [23.0, 74.55],
  RTM: [23.331, 75.04],
  NAD: [23.456, 75.418],
  SGZ: [24.187, 75.628],
  BWM: [24.424, 75.998],
  RMA: [24.653, 75.943],
  KOTA: [25.18, 75.845],
  SWM: [26.023, 76.353],
  GGC: [26.472, 76.72],
  BTE: [27.216, 77.48],

  // 12301 · Howrah – New Delhi (Grand Chord)
  HWH: [22.583, 88.342],
  BWN: [23.242, 87.866],
  DGR: [23.535, 87.32],
  ASN: [23.683, 86.976],
  DHN: [23.796, 86.428],
  GMO: [23.869, 86.15],
  KQR: [24.47, 85.594],
  GAYA: [24.802, 85.005],
  DOS: [24.918, 84.185],
  SSM: [24.951, 84.03],
  BBU: [25.052, 83.567],
  DDU: [25.283, 83.12],
  PRYJ: [25.441, 81.826],
  FTP: [25.928, 80.807],
  CNB: [26.456, 80.351],
  ETW: [26.78, 79.023],
  TDL: [27.216, 78.236],
  ALJN: [27.897, 78.078],
  GZB: [28.667, 77.437],

  // 12002 · Rani Kamlapati – New Delhi (Bhopal – Jhansi – Agra)
  RKMP: [23.221, 77.435],
  BPL: [23.268, 77.401],
  BHS: [23.525, 77.812],
  BAQ: [23.851, 77.936],
  BINA: [24.183, 78.196],
  LAR: [24.69, 78.412],
  BAB: [25.245, 78.478],
  JHS: [25.45, 78.489],
  DAA: [25.671, 78.463],
  DBA: [25.891, 78.331],
  GWL: [26.216, 78.174],
  MRA: [26.501, 78.0],
  DHO: [26.7, 77.892],
  AGC: [27.157, 77.996],

  // Shared by the Kota and Agra routes into Delhi
  MTJ: [27.494, 77.677],
  KSV: [27.797, 77.436],
  PWL: [28.146, 77.328],
  FDB: [28.39, 77.312],
  NDLS: [28.643, 77.219],
}

/** `[lat, lng]` for a station code, or `null` when it is not mapped. */
export const getCoordinates = (code) => stationCoordinates[code] ?? null
