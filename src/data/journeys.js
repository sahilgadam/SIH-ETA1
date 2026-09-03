/**
 * Mock journey data for the prototype.
 *
 * Nothing here comes from a live railway feed and no trained model produced
 * these numbers — they stand in for what the prediction service will return.
 *
 * A journey is a list of `majorStations` (the nodes drawn on the timeline) and
 * `segments`, where segment[i] joins majorStations[i] to majorStations[i + 1]
 * and carries the intermediate stations revealed when that segment is opened.
 *
 * TWO DISTINCT CONCEPTS, deliberately kept apart:
 *
 *   `current.delayMinutes`          how late the train is *right now*.
 *   `predictedDelayMinutes` (per station)
 *                                   how late RailSense expects the train to be
 *                                   when it reaches that specific station.
 *
 * The second is NOT a copy of the first. For a station already passed it is the
 * observed delay; for a station still ahead it is an independent forecast that
 * rises through congestion and falls where the train is expected to recover.
 *
 * Predicted arrival/departure times are never written here. They are derived in
 * `src/lib/eta.js` as `scheduled + predictedDelayMinutes`, so the rule
 * "RailSense ETA − Scheduled = displayed delay" holds by construction.
 *
 * SINCE THE SIMULATION EXISTS, `predictedDelayMinutes` on a station ahead of the
 * train is no longer displayed directly. It is the *baseline delay curve* for
 * the route — the shape of where this line loses and gains time — which
 * `src/lib/simulation.js` integrates forward from wherever the train actually
 * is, scaled by how each factor is currently running. The curve is the input;
 * the displayed forecast is the output.
 */

/**
 * Station factory. Arguments read like a timetable row:
 *   code, name, scheduled arrival, scheduled departure,
 *   predicted delay (minutes), distance from origin (km), status
 *
 * `status` is one of 'completed' | 'current' | 'upcoming'.
 * For a completed station the delay is what actually happened; for an upcoming
 * one it is the forecast for that station.
 */
const st = (code, station, scheduledArrival, scheduledDeparture, predictedDelayMinutes, distanceFromOriginKm, status) => ({
  code,
  station,
  scheduledArrival,
  scheduledDeparture,
  predictedDelayMinutes,
  distanceFromOriginKm,
  status,
})

const seg = (fromCode, toCode, distanceKm, intermediateStations) => ({
  id: `${fromCode}-${toCode}`,
  fromCode,
  toCode,
  distanceKm,
  intermediateStations,
})

// ---------------------------------------------------------------------------
// 12951 · Mumbai Central – New Delhi Rajdhani Express
//
// Between Shamgarh and Bhawani Mandi, 8 minutes down. The forecast worsens
// through the Kota junction area (+12), recovers on the fast Bharatpur–Mathura
// stretch (+10), then loses time again on the Delhi approach (+14).
// ---------------------------------------------------------------------------
const rajdhani12951 = {
  trainNumber: '12951',
  trainName: 'Mumbai Central – New Delhi Rajdhani Express',
  runsOn: 'Daily',
  journeyDate: '2026-09-01',
  status: 'running',

  majorStations: [
    st('BCT',  'Mumbai Central',  null,    '17:00', 0,  0,    'completed'),
    st('ST',   'Surat',           '19:23', '19:28', 3,  263,  'completed'),
    st('BRC',  'Vadodara Jn',     '20:48', '20:53', 4,  392,  'completed'),
    st('RTM',  'Ratlam Jn',       '23:50', '23:55', 6,  654,  'completed'),
    st('KOTA', 'Kota Jn',         '03:00', '03:05', 11, 921,  'upcoming'),
    st('NDLS', 'New Delhi',       '08:32', null,    14, 1384, 'upcoming'),
  ],

  segments: [
    seg('BCT', 'ST', 263, [
      st('BVI',  'Borivali',        '17:19', '17:21', 0, 34,  'completed'),
      st('BSR',  'Vasai Road',      '17:38', '17:40', 1, 64,  'completed'),
      st('PLG',  'Palghar',         '17:53', '17:55', 2, 87,  'completed'),
      st('VAPI', 'Vapi',            '18:35', '18:37', 2, 168, 'completed'),
      st('BL',   'Valsad',          '18:52', '18:54', 3, 199, 'completed'),
    ]),
    seg('ST', 'BRC', 129, [
      st('AKV',  'Ankleshwar Jn',   '19:55', '19:57', 4, 313, 'completed'),
      st('BH',   'Bharuch Jn',      '20:06', '20:08', 4, 322, 'completed'),
      st('MYG',  'Miyagam Karjan',  '20:28', '20:29', 4, 361, 'completed'),
    ]),
    seg('BRC', 'RTM', 262, [
      st('GDA',  'Godhra Jn',       '21:38', '21:40', 5, 465, 'completed'),
      st('DHD',  'Dahod',           '22:32', '22:34', 6, 546, 'completed'),
      st('MGN',  'Meghnagar',       '23:00', '23:02', 6, 590, 'completed'),
    ]),
    seg('RTM', 'KOTA', 267, [
      st('NAD',  'Nagda Jn',        '00:22', '00:24', 7,  695, 'completed'),
      st('SGZ',  'Shamgarh',        '01:15', '01:16', 8,  782, 'completed'),
      st('BWM',  'Bhawani Mandi',   '01:42', '01:43', 8,  826, 'upcoming'),
      st('RMA',  'Ramganj Mandi',   '02:05', '02:07', 9,  858, 'upcoming'),
    ]),
    seg('KOTA', 'NDLS', 463, [
      st('SWM',  'Sawai Madhopur',  '04:10', '04:12', 12, 1029, 'upcoming'),
      st('GGC',  'Gangapur City',   '04:52', '04:54', 12, 1094, 'upcoming'),
      st('BTE',  'Bharatpur Jn',    '05:48', '05:50', 11, 1183, 'upcoming'),
      st('MTJ',  'Mathura Jn',      '06:20', '06:22', 10, 1218, 'upcoming'),
      st('FDB',  'Faridabad',       '07:50', '07:51', 12, 1350, 'upcoming'),
    ]),
  ],

  // Where the train is now: 55% along segment 3 (Ratlam → Kota).
  current: {
    segmentIndex: 3,
    progress: 0.55,
    delayMinutes: 8,
    speedKmph: 92,
    averageSpeedKmph: 78,
    distanceCoveredKm: 801,
    distanceRemainingKm: 583,
    totalDistanceKm: 1384,
  },

  /**
   * The mix of causes on this route. The simulation uses these as attribution
   * weights — what share of any minute lost here is congestion, what share is a
   * restriction — and recomputes the actual minutes from the train's position.
   */
  prediction: {
    factors: [
      { id: 'congestion', labelKey: 'why.congestion', minutes: 5 },
      { id: 'speed-restriction', labelKey: 'why.restriction', minutes: 2 },
      { id: 'history', labelKey: 'why.history', minutes: 1 },
      { id: 'weather', labelKey: 'why.weather', minutes: 0 },
      { id: 'recovery', labelKey: 'why.recovery', minutes: -2 },
    ],
  },

  /**
   * The parts of the outlook that cannot be derived from the factors above.
   * Recovery minutes, additional delay and weather impact are NOT stored here —
   * they are read straight off `prediction.factors` in `src/lib/prediction.js`
   * so the recovery panel and "Why this ETA?" can never disagree.
   */
  outlook: {
    recoverySectionKey: 'recovery.section12951',
    // No weather factor on this run, so no weather panel is shown.
    weather: null,
    // Delay on arrival at the destination on the last five runs, most recent first.
    recentArrivalDelays: [12, 6, 18, 9, 4],
  },
}

// ---------------------------------------------------------------------------
// 12301 · Howrah – New Delhi Rajdhani Express
//
// 22 minutes down between DDU and Kanpur. The forecast peaks at +24 around
// Prayagraj, then falls back to +19 as the train is expected to recover time on
// the Kanpur–Delhi main line. A journey where the delay improves downstream.
// ---------------------------------------------------------------------------
const rajdhani12301 = {
  trainNumber: '12301',
  trainName: 'Howrah – New Delhi Rajdhani Express',
  runsOn: 'Daily',
  journeyDate: '2026-09-01',
  status: 'running',

  majorStations: [
    st('HWH',  'Howrah Jn',       null,    '16:50', 0,  0,    'completed'),
    st('DHN',  'Dhanbad Jn',      '20:05', '20:10', 9,  259,  'completed'),
    st('GAYA', 'Gaya Jn',         '22:15', '22:20', 14, 460,  'completed'),
    st('DDU',  'DDU Jn',          '00:50', '01:00', 20, 660,  'completed'),
    st('CNB',  'Kanpur Central',  '05:05', '05:10', 21, 1010, 'upcoming'),
    st('NDLS', 'New Delhi',       '10:00', null,    19, 1451, 'upcoming'),
  ],

  segments: [
    seg('HWH', 'DHN', 259, [
      st('BWN',  'Bardhaman Jn',   '17:45', '17:47', 3, 95,  'completed'),
      st('DGR',  'Durgapur',       '18:32', '18:34', 5, 158, 'completed'),
      st('ASN',  'Asansol Jn',     '19:05', '19:08', 7, 200, 'completed'),
    ]),
    seg('DHN', 'GAYA', 201, [
      st('GMO',  'Gomoh Jn',       '20:40', '20:42', 11, 305, 'completed'),
      st('KQR',  'Koderma Jn',     '21:22', '21:24', 12, 372, 'completed'),
    ]),
    seg('GAYA', 'DDU', 200, [
      st('DOS',  'Dehri-on-Sone',  '23:05', '23:07', 16, 553, 'completed'),
      st('SSM',  'Sasaram',        '23:22', '23:24', 17, 578, 'completed'),
      st('BBU',  'Bhabua Road',    '23:58', '00:00', 18, 617, 'completed'),
    ]),
    seg('DDU', 'CNB', 350, [
      st('PRYJ', 'Prayagraj Jn',   '02:40', '02:45', 24, 810, 'upcoming'),
      st('FTP',  'Fatehpur',       '04:05', '04:07', 23, 927, 'upcoming'),
    ]),
    seg('CNB', 'NDLS', 441, [
      st('ETW',  'Etawah',         '06:25', '06:27', 19, 1150, 'upcoming'),
      st('TDL',  'Tundla Jn',      '07:20', '07:22', 17, 1245, 'upcoming'),
      st('ALJN', 'Aligarh Jn',     '08:10', '08:12', 16, 1320, 'upcoming'),
      st('GZB',  'Ghaziabad',      '09:25', '09:27', 18, 1425, 'upcoming'),
    ]),
  ],

  current: {
    segmentIndex: 3,
    progress: 0.3,
    delayMinutes: 22,
    speedKmph: 74,
    averageSpeedKmph: 68,
    distanceCoveredKm: 765,
    distanceRemainingKm: 686,
    totalDistanceKm: 1451,
  },

  prediction: {
    factors: [
      { id: 'congestion', labelKey: 'why.congestion', minutes: 4 },
      { id: 'weather', labelKey: 'why.weather', minutes: 2 },
      { id: 'speed-restriction', labelKey: 'why.restriction', minutes: 1 },
      { id: 'history', labelKey: 'why.history', minutes: 0 },
      { id: 'running-speed', labelKey: 'why.runningSpeed', minutes: -3 },
      { id: 'recovery', labelKey: 'why.recovery', minutes: -7 },
    ],
  },

  outlook: {
    recoverySectionKey: 'recovery.section12301',
    weather: { conditionKey: 'weather.rain', nearStationCode: 'PRYJ' },
    recentArrivalDelays: [24, 31, 15, 22, 27],
  },
}

// ---------------------------------------------------------------------------
// 12002 · Rani Kamlapati – New Delhi Shatabdi Express
//
// Standing at Jhansi only 3 minutes down, but the forecast climbs steadily to
// +10 at New Delhi because of the busy Mathura–Delhi approach.
// ---------------------------------------------------------------------------
const shatabdi12002 = {
  trainNumber: '12002',
  trainName: 'Rani Kamlapati – New Delhi Shatabdi Express',
  runsOn: 'Daily',
  journeyDate: '2026-09-02',
  status: 'running',

  majorStations: [
    st('RKMP', 'Rani Kamlapati', null,    '05:40', 0,  0,   'completed'),
    st('BINA', 'Bina Jn',        '07:33', '07:35', 2,  139, 'completed'),
    st('JHS',  'Jhansi Jn',      '09:03', '09:08', 3,  291, 'current'),
    st('GWL',  'Gwalior Jn',     '10:10', '10:12', 5,  388, 'upcoming'),
    st('AGC',  'Agra Cantt',     '11:33', '11:35', 6,  506, 'upcoming'),
    st('NDLS', 'New Delhi',      '13:10', null,    10, 707, 'upcoming'),
  ],

  segments: [
    seg('RKMP', 'BINA', 139, [
      st('BPL', 'Bhopal Jn',      '05:52', '05:55', 0, 7,   'completed'),
      st('BHS', 'Vidisha',        '06:25', '06:27', 1, 60,  'completed'),
      st('BAQ', 'Ganj Basoda',    '06:55', '06:56', 2, 100, 'completed'),
    ]),
    seg('BINA', 'JHS', 152, [
      st('LAR', 'Lalitpur',       '08:12', '08:14', 3, 202, 'completed'),
      st('BAB', 'Babina',         '08:45', '08:46', 3, 265, 'completed'),
    ]),
    seg('JHS', 'GWL', 97, [
      st('DAA', 'Datia',          '09:28', '09:29', 4, 317, 'upcoming'),
      st('DBA', 'Dabra',          '09:45', '09:46', 4, 351, 'upcoming'),
    ]),
    seg('GWL', 'AGC', 118, [
      st('MRA', 'Morena',         '10:32', '10:33', 5, 427, 'upcoming'),
      st('DHO', 'Dhaulpur',       '10:52', '10:53', 6, 456, 'upcoming'),
    ]),
    seg('AGC', 'NDLS', 201, [
      st('MTJ', 'Mathura Jn',     '12:05', '12:07', 7, 560, 'upcoming'),
      st('KSV', 'Kosi Kalan',     '12:25', '12:26', 8, 610, 'upcoming'),
      st('PWL', 'Palwal',         '12:42', '12:43', 9, 650, 'upcoming'),
      st('FDB', 'Faridabad',      '12:55', '12:56', 9, 675, 'upcoming'),
    ]),
  ],

  // Standing at Jhansi: the marker sits exactly on the node.
  current: {
    segmentIndex: 2,
    progress: 0,
    delayMinutes: 3,
    speedKmph: 0,
    averageSpeedKmph: 88,
    distanceCoveredKm: 291,
    distanceRemainingKm: 416,
    totalDistanceKm: 707,
    haltedAt: 'Jhansi Jn',
  },

  prediction: {
    factors: [
      { id: 'congestion', labelKey: 'why.congestion', minutes: 5 },
      { id: 'speed-restriction', labelKey: 'why.restriction', minutes: 2 },
      { id: 'history', labelKey: 'why.history', minutes: 1 },
      { id: 'weather', labelKey: 'why.weather', minutes: 0 },
      { id: 'recovery', labelKey: 'why.recovery', minutes: -1 },
    ],
  },

  outlook: {
    recoverySectionKey: 'recovery.section12002',
    weather: null,
    recentArrivalDelays: [5, 2, 8, 3, 6],
  },
}

export const journeys = [rajdhani12951, rajdhani12301, shatabdi12002]

export function getJourney(trainNumber) {
  return journeys.find((journey) => journey.trainNumber === trainNumber) ?? null
}
