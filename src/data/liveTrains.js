/**
 * The running fleet for the live-network map.
 *
 * DEMO / SIMULATED DATA. Train numbers, names, station sequences and booked
 * times are modelled on real services so the map reads as a railway rather
 * than as filler, but every position, speed, delay and prediction in the app
 * is produced by `src/lib/railSim.js`. Nothing here is a live Indian Railways
 * feed, and the UI labels it as simulated wherever it is shown.
 *
 * A stop is `[code, arrival, departure, kmFromOrigin]`, with `null` arrival at
 * the origin and `null` departure at the terminus. Times are booked clock
 * times; a time earlier than the one before it means the service has crossed
 * midnight, and the engine resolves that into absolute minutes.
 *
 * Coordinates come from `data/coordinates.js` — every code used here must
 * exist there, which `railNetwork` asserts at module load.
 */

export const liveTrains = [
  {
    number: '12951',
    name: 'Mumbai Central – New Delhi Rajdhani Express',
    category: 'Rajdhani',
    baseDelayMin: 8,
    stops: [
      ['BCT', null, '17:00', 0],
      ['ST', '19:23', '19:28', 263],
      ['BRC', '20:48', '20:53', 392],
      ['RTM', '23:50', '23:55', 654],
      ['KOTA', '03:00', '03:05', 921],
      ['NDLS', '08:32', null, 1384],
    ],
  },
  {
    number: '12952',
    name: 'New Delhi – Mumbai Central Rajdhani Express',
    category: 'Rajdhani',
    baseDelayMin: 4,
    stops: [
      ['NDLS', null, '16:25', 0],
      ['KOTA', '21:38', '21:43', 463],
      ['RTM', '00:50', '00:55', 730],
      ['BRC', '03:47', '03:52', 992],
      ['ST', '05:12', '05:17', 1121],
      ['BCT', '08:15', null, 1384],
    ],
  },
  {
    number: '12301',
    name: 'Howrah – New Delhi Rajdhani Express',
    category: 'Rajdhani',
    baseDelayMin: 14,
    stops: [
      ['HWH', null, '16:50', 0],
      ['DHN', '20:10', '20:15', 259],
      ['GAYA', '22:05', '22:10', 448],
      ['DDU', '01:05', '01:15', 646],
      ['PRYJ', '02:45', '02:50', 796],
      ['CNB', '04:55', '05:00', 990],
      ['NDLS', '10:00', null, 1451],
    ],
  },
  {
    number: '12302',
    name: 'New Delhi – Howrah Rajdhani Express',
    category: 'Rajdhani',
    baseDelayMin: 0,
    stops: [
      ['NDLS', null, '16:55', 0],
      ['CNB', '21:35', '21:40', 461],
      ['PRYJ', '23:40', '23:45', 655],
      ['DDU', '01:20', '01:30', 805],
      ['GAYA', '03:25', '03:30', 1003],
      ['DHN', '05:10', '05:15', 1192],
      ['HWH', '09:55', null, 1451],
    ],
  },
  {
    number: '12002',
    name: 'Rani Kamlapati – New Delhi Shatabdi Express',
    category: 'Shatabdi',
    baseDelayMin: 0,
    stops: [
      ['RKMP', null, '05:40', 0],
      ['BPL', '05:55', '05:58', 8],
      ['BINA', '07:13', '07:15', 147],
      ['JHS', '08:33', '08:38', 291],
      ['GWL', '09:38', '09:40', 388],
      ['AGC', '10:53', '10:55', 506],
      ['NDLS', '13:10', null, 701],
    ],
  },
  {
    number: '12621',
    name: 'Tamil Nadu Express',
    category: 'Superfast',
    baseDelayMin: 22,
    stops: [
      ['MAS', null, '22:00', 0],
      ['BZA', '04:00', '04:10', 431],
      ['BPQ', '11:20', '11:25', 1041],
      ['NGP', '14:05', '14:15', 1251],
      ['BPL', '19:10', '19:20', 1642],
      ['JHS', '23:45', '23:50', 1933],
      ['AGC', '02:30', '02:32', 2035],
      ['NDLS', '06:45', null, 2183],
    ],
  },
  {
    number: '12841',
    name: 'Coromandel Express',
    category: 'Superfast',
    baseDelayMin: 6,
    stops: [
      ['HWH', null, '14:50', 0],
      ['KGP', '16:35', '16:40', 116],
      ['BBSR', '20:25', '20:30', 437],
      ['VSKP', '01:30', '01:45', 887],
      ['BZA', '06:20', '06:30', 1237],
      ['NLR', '08:55', '08:57', 1400],
      ['MAS', '11:45', null, 1662],
    ],
  },
  {
    number: '12842',
    name: 'Coromandel Express (Up)',
    category: 'Superfast',
    baseDelayMin: 0,
    stops: [
      ['MAS', null, '08:45', 0],
      ['NLR', '11:20', '11:22', 262],
      ['BZA', '13:55', '14:05', 425],
      ['VSKP', '18:40', '18:55', 775],
      ['BBSR', '23:55', '00:00', 1225],
      ['KGP', '03:45', '03:50', 1546],
      ['HWH', '05:40', null, 1662],
    ],
  },
  {
    number: '22691',
    name: 'KSR Bengaluru – Hazrat Nizamuddin Rajdhani',
    category: 'Rajdhani',
    baseDelayMin: 0,
    stops: [
      ['SBC', null, '20:00', 0],
      ['DMM', '22:48', '22:50', 200],
      ['GTL', '01:05', '01:10', 335],
      ['SC', '06:10', '06:25', 693],
      ['NGP', '13:20', '13:25', 1273],
      ['BPL', '18:35', '18:45', 1664],
      ['JHS', '22:30', '22:35', 1955],
      ['NZM', '05:55', null, 2365],
    ],
  },
  {
    number: '12627',
    name: 'Karnataka Express',
    category: 'Superfast',
    baseDelayMin: 17,
    stops: [
      ['SBC', null, '19:20', 0],
      ['DMM', '22:30', '22:32', 200],
      ['GTL', '00:50', '00:55', 335],
      ['SC', '06:00', '06:15', 693],
      ['NGP', '13:45', '13:50', 1273],
      ['BPL', '19:15', '19:25', 1664],
      ['JHS', '23:35', '23:40', 1955],
      ['AGC', '02:20', '02:22', 2057],
      ['NDLS', '06:15', null, 2205],
    ],
  },
  {
    number: '11301',
    name: 'Udyan Express',
    category: 'Mail/Express',
    baseDelayMin: 11,
    stops: [
      ['CSMT', null, '08:10', 0],
      ['PUNE', '11:35', '11:40', 192],
      ['SUR', '15:20', '15:25', 456],
      ['UBL', '21:40', '21:55', 810],
      ['SBC', '06:30', null, 1211],
    ],
  },
  {
    number: '12137',
    name: 'Punjab Mail',
    category: 'Mail/Express',
    baseDelayMin: 3,
    stops: [
      ['CSMT', null, '19:35', 0],
      ['KYN', '20:30', '20:33', 54],
      ['IGP', '21:50', '21:55', 137],
      ['MMR', '00:05', '00:10', 260],
      ['BSL', '02:10', '02:20', 434],
      ['ET', '05:35', '05:45', 738],
      ['JHS', '10:25', '10:30', 1043],
      ['AGC', '13:05', '13:10', 1263],
      ['NDLS', '16:30', null, 1534],
    ],
  },
  {
    number: '20901',
    name: 'Mumbai Central – Gandhinagar Vande Bharat Express',
    category: 'Vande Bharat',
    baseDelayMin: 0,
    stops: [
      ['BCT', null, '06:10', 0],
      ['ST', '08:50', '08:52', 263],
      ['BRC', '10:07', '10:09', 392],
      ['ADI', '11:25', null, 493],
    ],
  },
  {
    number: '12273',
    name: 'Howrah – New Delhi Duronto Express',
    category: 'Duronto',
    baseDelayMin: 5,
    stops: [
      ['HWH', null, '08:35', 0],
      ['DDU', '16:05', '16:15', 646],
      ['CNB', '19:55', '20:00', 990],
      ['NDLS', '00:05', null, 1451],
    ],
  },
  {
    number: '12909',
    name: 'Bandra Terminus – Hazrat Nizamuddin Garib Rath',
    category: 'Garib Rath',
    baseDelayMin: 9,
    stops: [
      ['BCT', null, '16:15', 0],
      ['ST', '18:48', '18:50', 263],
      ['BRC', '20:12', '20:17', 392],
      ['RTM', '23:15', '23:20', 654],
      ['KOTA', '02:35', '02:40', 921],
      ['NZM', '07:40', null, 1367],
    ],
  },
  {
    number: '12615',
    name: 'Grand Trunk Express',
    category: 'Express',
    baseDelayMin: 19,
    stops: [
      ['MAS', null, '19:15', 0],
      ['BZA', '01:20', '01:30', 431],
      ['BPQ', '08:35', '08:40', 1041],
      ['NGP', '11:25', '11:35', 1251],
      ['BPL', '16:30', '16:40', 1642],
      ['JHS', '20:55', '21:00', 1933],
      ['AGC', '23:40', '23:42', 2035],
      ['NDLS', '03:55', null, 2183],
    ],
  },
]

/** Full station names for every code the fleet touches. */
export const stationNames = {
  BCT: 'Mumbai Central', CSMT: 'Mumbai CSMT', ST: 'Surat', BRC: 'Vadodara Jn',
  RTM: 'Ratlam Jn', KOTA: 'Kota Jn', NDLS: 'New Delhi', NZM: 'Hazrat Nizamuddin',
  HWH: 'Howrah Jn', DHN: 'Dhanbad Jn', GAYA: 'Gaya Jn', DDU: 'Pt DD Upadhyaya Jn',
  PRYJ: 'Prayagraj Jn', CNB: 'Kanpur Central', RKMP: 'Rani Kamlapati', BPL: 'Bhopal Jn',
  BINA: 'Bina Jn', JHS: 'Jhansi Jn', GWL: 'Gwalior Jn', AGC: 'Agra Cantt',
  MAS: 'MGR Chennai Central', BZA: 'Vijayawada Jn', BPQ: 'Balharshah', NGP: 'Nagpur Jn',
  KGP: 'Kharagpur Jn', BBSR: 'Bhubaneswar', VSKP: 'Visakhapatnam', NLR: 'Nellore',
  SBC: 'KSR Bengaluru City', DMM: 'Dharmavaram Jn', GTL: 'Guntakal Jn', SC: 'Secunderabad Jn',
  PUNE: 'Pune Jn', SUR: 'Solapur Jn', UBL: 'Hubballi Jn', KYN: 'Kalyan Jn',
  IGP: 'Igatpuri', MMR: 'Manmad Jn', BSL: 'Bhusaval Jn', ET: 'Itarsi Jn', ADI: 'Ahmedabad Jn',
}

/** Stations drawn with heavier weight on the map. */
export const majorStationCodes = new Set([
  'NDLS', 'NZM', 'BCT', 'CSMT', 'HWH', 'MAS', 'SBC', 'SC', 'NGP', 'BPL', 'ADI', 'PUNE',
])
