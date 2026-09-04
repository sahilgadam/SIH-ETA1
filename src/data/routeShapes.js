/**
 * The alignment each service is drawn along.
 *
 * A route's booked stops are only the places it *calls*. Drawn on a real map,
 * a curve through six Rajdhani stops cuts straight across Rajasthan, because
 * the stations are hundreds of kilometres apart and nothing in between tells
 * the curve where the track goes. These lists add the intermediate stations
 * the line actually runs through — every code already exists in
 * `data/coordinates.js`, where they were authored for exactly this purpose.
 *
 * A shape is GEOMETRY ONLY. It changes where the line is drawn and where the
 * marker rides, and nothing else: no timing, delay, ETA or prediction reads
 * it. `railSim.buildRoute` requires a shape to contain every booked stop, in
 * running order, beginning at the origin and ending at the terminus — a shape
 * that fails any of those is ignored and the route falls back to a curve
 * through its stops, so a mistake here can only cost accuracy, never crash.
 */

// Shared alignments, so an up working and its down working cannot drift apart.
const WESTERN_MUMBAI_SURAT = ['BVI', 'BSR', 'PLG', 'VAPI', 'BL']
const WESTERN_SURAT_VADODARA = ['AKV', 'BH', 'MYG']
const WESTERN_VADODARA_RATLAM = ['GDA', 'DHD', 'MGN']
const WESTERN_RATLAM_KOTA = ['NAD', 'SGZ', 'BWM', 'RMA']
const WESTERN_KOTA_DELHI = ['SWM', 'GGC', 'BTE', 'MTJ', 'KSV', 'PWL']

const CHORD_HOWRAH_DHANBAD = ['BWN', 'DGR', 'ASN']
const CHORD_DHANBAD_GAYA = ['GMO', 'KQR']
const CHORD_GAYA_DDU = ['DOS', 'SSM', 'BBU']
const CHORD_PRAYAGRAJ_KANPUR = ['FTP']
const CHORD_KANPUR_DELHI = ['ETW', 'TDL', 'ALJN', 'GZB']

const CENTRAL_BHOPAL_JHANSI = ['BHS', 'BAQ', 'BINA', 'LAR', 'BAB']
const CENTRAL_JHANSI_AGRA = ['DAA', 'DBA', 'GWL', 'MRA', 'DHO']
const CENTRAL_AGRA_DELHI = ['MTJ', 'KSV', 'PWL']

/** Mumbai Central – Kota – New Delhi, the Western Railway trunk. */
const WESTERN_TRUNK = [
  'BCT',
  ...WESTERN_MUMBAI_SURAT,
  'ST',
  ...WESTERN_SURAT_VADODARA,
  'BRC',
  ...WESTERN_VADODARA_RATLAM,
  'RTM',
  ...WESTERN_RATLAM_KOTA,
  'KOTA',
  ...WESTERN_KOTA_DELHI,
]

/** Howrah – Gaya – Kanpur – New Delhi, the Grand Chord. */
const GRAND_CHORD = [
  'HWH',
  ...CHORD_HOWRAH_DHANBAD,
  'DHN',
  ...CHORD_DHANBAD_GAYA,
  'GAYA',
  ...CHORD_GAYA_DDU,
  'DDU',
  'PRYJ',
  ...CHORD_PRAYAGRAJ_KANPUR,
  'CNB',
  ...CHORD_KANPUR_DELHI,
  'NDLS',
]

/** Bhopal – Jhansi – Agra – New Delhi, the Central trunk into the capital. */
const CENTRAL_TRUNK = [
  'BPL',
  ...CENTRAL_BHOPAL_JHANSI,
  'JHS',
  ...CENTRAL_JHANSI_AGRA,
  'AGC',
  ...CENTRAL_AGRA_DELHI,
  'NDLS',
]

/** Nagpur – Secunderabad and Vijayawada – Chennai, for the southern runs. */
const DECCAN_NAGPUR_SECUNDERABAD = ['BPQ', 'KZJ']
const COAST_VIJAYAWADA_CHENNAI = ['OGL', 'NLR', 'GDR']

const reverse = (shape) => [...shape].reverse()

export const routeShapes = {
  // --- Western Railway ------------------------------------------------------
  12951: [...WESTERN_TRUNK, 'NDLS'],
  12952: reverse([...WESTERN_TRUNK, 'NDLS']),
  12909: [...WESTERN_TRUNK, 'FDB', 'NZM'],
  12954: reverse([...WESTERN_TRUNK, 'FDB', 'NZM']),
  20901: ['BCT', ...WESTERN_MUMBAI_SURAT, 'ST', ...WESTERN_SURAT_VADODARA, 'BRC', 'ND', 'ADI'],

  // --- Grand Chord ----------------------------------------------------------
  12301: GRAND_CHORD,
  12273: GRAND_CHORD,
  12302: reverse(GRAND_CHORD),
  12304: reverse(GRAND_CHORD),

  // --- Central trunk --------------------------------------------------------
  12002: ['RKMP', ...CENTRAL_TRUNK],
  12279: ['JHS', ...CENTRAL_JHANSI_AGRA, 'AGC', ...CENTRAL_AGRA_DELHI, 'NDLS'],
  12280: reverse(['JHS', ...CENTRAL_JHANSI_AGRA, 'AGC', ...CENTRAL_AGRA_DELHI, 'NDLS']),
  12034: ['CNB', 'ETW', 'TDL', 'AGC', ...CENTRAL_AGRA_DELHI, 'NDLS'],
  12137: ['CSMT', 'KYN', 'IGP', 'MMR', 'BSL', 'ET', ...CENTRAL_TRUNK],

  // --- Deccan and East Coast ------------------------------------------------
  12626: reverse(CENTRAL_TRUNK).concat('ET', 'NGP', ...DECCAN_NAGPUR_SECUNDERABAD, 'SC'),
  12616: reverse(CENTRAL_TRUNK).concat(
    'ET',
    'NGP',
    ...DECCAN_NAGPUR_SECUNDERABAD,
    'BZA',
    ...COAST_VIJAYAWADA_CHENNAI,
    'MAS',
  ),
  12621: reverse(
    reverse(CENTRAL_TRUNK).concat(
      'ET',
      'NGP',
      ...DECCAN_NAGPUR_SECUNDERABAD,
      'BZA',
      ...COAST_VIJAYAWADA_CHENNAI,
      'MAS',
    ),
  ),
  12615: reverse(
    reverse(CENTRAL_TRUNK).concat(
      'ET',
      'NGP',
      ...DECCAN_NAGPUR_SECUNDERABAD,
      'BZA',
      ...COAST_VIJAYAWADA_CHENNAI,
      'MAS',
    ),
  ),
  12627: ['SBC', 'YPR', 'TK', 'DMM', 'GTL', 'BAY', 'SC', 'KZJ', 'BPQ', 'NGP', 'ET', ...CENTRAL_TRUNK],
  22691: [
    'SBC',
    'YPR',
    'TK',
    'DMM',
    'GTL',
    'BAY',
    'SC',
    'KZJ',
    'BPQ',
    'NGP',
    'ET',
    'BPL',
    ...CENTRAL_BHOPAL_JHANSI,
    'JHS',
    ...CENTRAL_JHANSI_AGRA,
    'AGC',
    ...CENTRAL_AGRA_DELHI,
    'FDB',
    'NZM',
  ],
  12841: ['HWH', 'SRC', 'KGP', 'CTC', 'BBSR', 'KUR', 'BAM', 'VSKP', 'RJY', 'BZA', 'OGL', 'NLR', 'GDR', 'MAS'],
  12842: reverse([
    'HWH',
    'SRC',
    'KGP',
    'CTC',
    'BBSR',
    'KUR',
    'BAM',
    'VSKP',
    'RJY',
    'BZA',
    'OGL',
    'NLR',
    'GDR',
    'MAS',
  ]),
  11301: ['CSMT', 'PUNE', 'SUR', 'UBL', 'TK', 'YPR', 'SBC'],
}
