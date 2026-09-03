/**
 * The editorial photography layer. Every image ships with the purpose it was
 * chosen for, so a page section pulls a plate by intent (`getImage('hero')`)
 * rather than a bare file name — the discipline is "each photograph has a
 * job," not "drop a picture in the gap."
 *
 * Each plate ships as three JPEG widths (640/1280/1920) generated from the
 * 2752px originals, which live outside `public/` in `assets-source/` so they
 * are archived without being served. `src` is the 1280 default; use
 * `srcSetFor(image)` with a `sizes` attribute to let the browser choose.
 */
export const images = [
  {
    id: 'hero',
    n: 1,
    src: '/img1-1280.jpg',
    plate: '01',
    alt: 'A WAP-7 electric locomotive approaching at golden hour on open double track, catenary wires converging into the distance.',
    caption: 'Down line, golden hour.',
    purpose: 'Primary hero backdrop — the single most characteristic image of the product: a train arriving, on time, in the open.',
  },
  {
    id: 'control-room',
    n: 7,
    src: '/img7-1280.jpg',
    plate: '02',
    alt: 'Railway operations staff in a control room monitoring a wall of section-control and signalling diagrams.',
    caption: 'Section control, not a demo screen.',
    purpose: 'How-it-works / trust section — grounds the prediction engine in the real operational discipline it stands in for.',
  },
  {
    id: 'converging-tracks',
    n: 4,
    src: '/img4-1280.jpg',
    plate: '03',
    alt: 'Empty converging railway tracks and signal gantries at dawn, fog softening the vanishing point.',
    caption: 'Points and signals, first light.',
    purpose: 'Graphic section divider / track-geometry texture — abstract enough to sit behind type, still unmistakably railway.',
  },
  {
    id: 'signal-lamp',
    n: 6,
    src: '/img6-1280.jpg',
    plate: '04',
    alt: 'Close-up of a lineside signal lamp glowing amber at dusk, numbered P-21, with a train softly out of focus behind it.',
    caption: 'Signal P-21, caution aspect.',
    purpose: 'Alerts / confidence / caution-state illustration — the amber signal is the literal referent for the caution token.',
  },
  {
    id: 'bridge-crossing',
    n: 10,
    src: '/img10-1280.jpg',
    plate: '05',
    alt: 'Aerial view of a long passenger train crossing a girder bridge over a wide riverbed, hills in the distance.',
    caption: 'Crossing the Narmada.',
    purpose: 'Full-bleed edge-to-edge break — the one epic, scale-of-network image reserved for a single dramatic moment, not tiled.',
  },
  {
    id: 'hill-run',
    n: 3,
    src: '/img3-1280.jpg',
    plate: '06',
    alt: 'A passenger train curving through green hills with motion blur in the foreground, a brick kiln smoking in the distance.',
    caption: 'En route through the Ghats.',
    purpose: 'Live-tracking / journey-in-motion illustration — implies speed and route rather than a static timetable.',
  },
  {
    id: 'platform-day',
    n: 2,
    src: '/img2-1280.jpg',
    plate: '07',
    alt: 'A train arriving at a station platform in daylight, passengers walking with luggage past a tea stall.',
    caption: 'Platform 3, on arrival.',
    purpose: 'Stations / departure-board section — ordinary platform life, not an empty architectural shot.',
  },
  {
    id: 'platform-dusk-crowd',
    n: 9,
    src: '/img9-1280.jpg',
    plate: '08',
    alt: 'A crowded station platform at dusk, families waiting with luggage as a train approaches.',
    caption: 'Waiting for the 18:40.',
    purpose: 'Live status — the human reality a "live" badge stands in for: people, luggage, a specific train still approaching.',
  },
  {
    id: 'coach-interior',
    n: 8,
    src: '/img8-1280.jpg',
    plate: '09',
    alt: 'Interior of an AC chair car coach in daylight, passengers reading, resting and looking at phones.',
    caption: 'Chair car, mid-journey.',
    purpose: 'About / passenger-summary section — the traveller RailSense is actually built for.',
  },
  {
    id: 'platform-dusk-bridge',
    n: 5,
    src: '/img5-1280.jpg',
    plate: '10',
    alt: 'A station platform at blue hour with an overhead footbridge lit against a darkening sky, a train pulling in below.',
    caption: 'Foot overbridge, blue hour.',
    purpose: 'Closing / footer backdrop — a quieter, atmospheric sign-off image.',
  },
]

const imagesById = new Map(images.map((image) => [image.id, image]))

export function getImage(id) {
  return imagesById.get(id) ?? null
}

/** Responsive candidates for a plate. Pair with an explicit `sizes`. */
export function srcSetFor(image) {
  if (!image) return undefined
  return [640, 1280, 1920].map((w) => `/img${image.n}-${w}.jpg ${w}w`).join(', ')
}
