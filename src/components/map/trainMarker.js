/**
 * The train marker, drawn into canvases for `map.addImage`.
 *
 * The marker is two images on two layers rather than one, because they need
 * different rotation behaviour. The badge carries the train glyph and stays
 * upright, so the locomotive is always the right way up and is recognisable at
 * a glance; the heading pip orbits it and *is* rotated, so direction of travel
 * is still unambiguous. Rotating the glyph itself would leave the train
 * upside-down on every southbound working.
 *
 * Drawing to canvas rather than mounting DOM markers is what lets the whole
 * fleet animate from one `setData` call: the icons are uploaded to the GPU
 * once and the per-frame update never touches React or the document.
 */

/**
 * Lucide's `train-front`, as SVG path data on its native 24×24 grid.
 *
 * Taken as literal path strings because these are stroked into a canvas, not
 * mounted as an element — importing the React component would give us a
 * `<svg>` we would then have to rasterise asynchronously, and an icon that
 * arrives after the first frame is an icon the map draws without.
 */
const TRAIN_GLYPH = [
  'M8 3.1V7a4 4 0 0 0 8 0V3.1',
  'm9 15-1-1',
  'm15 15 1-1',
  'M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z',
  'm8 19-2 3',
  'm16 19 2 3',
]

/** Ivory, so the glyph reads on every status colour without a second palette. */
const GLYPH_INK = '#f7f2ea'
const BADGE_EDGE = 'rgba(247,242,233,0.95)'
const PIP_EDGE = 'rgba(30,22,16,0.55)'

const dpr = () => Math.min(window.devicePixelRatio || 1, 2)

function surface(size) {
  const ratio = dpr()
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(size * ratio)
  canvas.height = Math.round(size * ratio)
  const ctx = canvas.getContext('2d')
  ctx.scale(ratio, ratio)
  ctx.translate(size / 2, size / 2)
  return { canvas, ctx, ratio }
}

const toImage = ({ canvas, ctx, ratio }) => ({
  width: canvas.width,
  height: canvas.height,
  data: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
  pixelRatio: ratio,
})

/**
 * Geometry for one marker size. `size` is the icon's box in CSS pixels; the
 * heading pip needs a wider box than the badge because it sits outside it.
 */
export function markerGeometry(selected) {
  const disc = selected ? 14 : 10.5
  return {
    disc,
    badgeSize: Math.ceil((disc + (selected ? 7 : 3)) * 2),
    pipRadius: disc + (selected ? 9 : 6.5),
    pipSize: Math.ceil((disc + (selected ? 9 : 6.5) + 6) * 2),
  }
}

/** The upright badge: a status-coloured disc carrying the locomotive glyph. */
export function badgeImage(color, selected) {
  const { disc, badgeSize } = markerGeometry(selected)
  const target = surface(badgeSize)
  const { ctx } = target

  // A soft status halo, so a selected service reads as selected even where the
  // route line underneath it is the same warm brass.
  if (selected) {
    ctx.beginPath()
    ctx.arc(0, 0, disc + 5.5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.globalAlpha = 0.18
    ctx.fill()
    ctx.globalAlpha = 1
  }

  ctx.beginPath()
  ctx.arc(0, 0, disc, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.lineWidth = selected ? 2.4 : 1.8
  ctx.strokeStyle = BADGE_EDGE
  ctx.stroke()

  // The glyph is authored on a 24-unit grid; scale it to sit inside the disc
  // with a little air, then draw it from its own centre.
  const glyph = disc * 1.5
  ctx.save()
  ctx.scale(glyph / 24, glyph / 24)
  ctx.translate(-12, -12)
  ctx.strokeStyle = GLYPH_INK
  ctx.lineWidth = 2.1
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const d of TRAIN_GLYPH) ctx.stroke(new Path2D(d))
  ctx.restore()

  return toImage(target)
}

/**
 * The heading pip: a small arrowhead sitting ahead of the badge, drawn
 * nose-up because MapLibre's `icon-rotate` treats 0° as north.
 */
export function headingImage(color, selected) {
  const { pipRadius, pipSize } = markerGeometry(selected)
  const target = surface(pipSize)
  const { ctx } = target
  const w = selected ? 5 : 4
  const h = selected ? 7 : 5.5

  ctx.beginPath()
  ctx.moveTo(0, -pipRadius - h / 2)
  ctx.lineTo(w, -pipRadius + h / 2)
  ctx.lineTo(-w, -pipRadius + h / 2)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.lineWidth = 1.1
  ctx.strokeStyle = PIP_EDGE
  ctx.stroke()

  return toImage(target)
}
