/**
 * Service classes, and the plate that represents each one.
 *
 * Images were assigned by what the rendering actually shows, not in file
 * order — the liveries are specific and getting them wrong would be the
 * railway equivalent of a spelling mistake:
 *
 *   i1  streamlined self-propelled trainset, no separate locomotive → Vande Bharat
 *   i2  maroon WAP with maroon-and-cream LHB rake                   → Rajdhani
 *   i3  blue locomotive with blue ICF coaches                       → Mail/Express
 *   i4  yellow-and-green livery, the Duronto scheme                 → Duronto
 *   i5  cream loco with red band, red-and-cream rake                → Shatabdi
 *   i6  cream loco with red band, mixed long-distance rake          → Superfast
 *   i7  cream-and-green loco with green rake                        → Garib Rath
 *
 * `accent` picks the palette token each block is keyed to, so the categories
 * read as a set of related-but-distinct plates rather than one repeated card.
 */

export const trainCategories = [
  {
    id: 'vande-bharat',
    name: 'Vande Bharat',
    tagline: 'Self-propelled, chair-car, day journeys',
    description:
      'India’s fastest scheduled services. A distributed-power trainset rather than a locomotive and rake, which is why it accelerates out of a stop far harder than anything else on the same line.',
    image: 'i1',
    accent: 'brand',
  },
  {
    id: 'rajdhani',
    name: 'Rajdhani',
    tagline: 'Capital-bound, fully air-conditioned, priority pathing',
    description:
      'The premier overnight services to New Delhi. They hold the highest priority on the trunk routes, so a Rajdhani running late usually means the section itself is in trouble.',
    image: 'i2',
    accent: 'accent',
  },
  {
    id: 'shatabdi',
    name: 'Shatabdi',
    tagline: 'Same-day return, intercity, chair car',
    description:
      'Fast day trains that return the same evening. Short dwells and tight booked running times leave little slack to recover a delay once one has been picked up.',
    image: 'i5',
    accent: 'brass',
  },
  {
    id: 'duronto',
    name: 'Duronto',
    tagline: 'Non-stop between terminals',
    description:
      'Point-to-point services with only technical halts. Fewer intermediate stops means fewer places to lose time — and fewer to make it back.',
    image: 'i4',
    accent: 'caution',
  },
  {
    id: 'superfast',
    name: 'Superfast',
    tagline: 'Long-distance, high average speed',
    description:
      'The backbone of intercity travel: multi-day runs across several zones, where delay accumulates section by section and recovery depends entirely on the pathing ahead.',
    image: 'i6',
    accent: 'brand',
  },
  {
    id: 'garib-rath',
    name: 'Garib Rath',
    tagline: 'Air-conditioned, economy fares',
    description:
      'Air-conditioned travel at a lower fare, with a denser seating layout. Scheduled on the same trunk paths as the premium services but pathed behind them.',
    image: 'i7',
    accent: 'brand',
  },
  {
    id: 'mail-express',
    name: 'Mail / Express',
    tagline: 'The everyday network',
    description:
      'The most numerous class on the network and the one most exposed to congestion — more stops, longer dwells, and the first to be looped when a section runs hot.',
    image: 'i3',
    accent: 'ink',
  },
  {
    id: 'express',
    name: 'Express',
    tagline: 'Conventional long-haul',
    description:
      'Classic long-distance expresses running the full length of a corridor, calling at the intermediate junctions the faster services pass through.',
    image: 'i3',
    accent: 'ink',
  },
]

/** Category id for the `category` string carried on each service. */
export const categoryIdFor = (category) =>
  trainCategories.find((c) => c.name.toLowerCase() === String(category).toLowerCase())?.id ?? 'express'

export const categoryById = new Map(trainCategories.map((c) => [c.id, c]))

/** Responsive candidates for a category plate. */
export const categorySrcSet = (image) =>
  [640, 1280, 1920].map((w) => `/${image}-${w}.jpg ${w}w`).join(', ')

export const categorySrc = (image) => `/${image}-1280.jpg`
