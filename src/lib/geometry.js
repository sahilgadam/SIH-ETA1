/**
 * Curve geometry for the railway network diagram.
 *
 * The network is authored as a handful of control points per route. Those
 * points are converted to a Catmull-Rom spline expressed as cubic béziers,
 * and the *same* segments are used twice:
 *
 *   - `pathD()` renders them as an SVG `d` attribute
 *   - `arcTable()` / `pointAt()` sample them for train positions
 *
 * Sharing one representation is the whole point: a marker positioned from an
 * independently-derived polyline drifts visibly off the drawn rail on curves.
 * Here the marker is on the line because it is solving the same equation.
 */

/** Catmull-Rom through `points`, as cubic bézier segments. */
export function toBezierSegments(points, tension = 0.5) {
  if (points.length < 2) return []

  const segments = []
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? points[i + 1]

    segments.push({
      p1,
      c1: { x: p1.x + ((p2.x - p0.x) / 6) * tension, y: p1.y + ((p2.y - p0.y) / 6) * tension },
      c2: { x: p2.x - ((p3.x - p1.x) / 6) * tension, y: p2.y - ((p3.y - p1.y) / 6) * tension },
      p2,
    })
  }
  return segments
}

/** The SVG `d` string for a segment list. */
export function pathD(segments) {
  if (!segments.length) return ''
  const [first] = segments
  let d = `M ${first.p1.x.toFixed(2)} ${first.p1.y.toFixed(2)}`
  for (const s of segments) {
    d += ` C ${s.c1.x.toFixed(2)} ${s.c1.y.toFixed(2)}, ${s.c2.x.toFixed(2)} ${s.c2.y.toFixed(2)}, ${s.p2.x.toFixed(2)} ${s.p2.y.toFixed(2)}`
  }
  return d
}

function cubicAt(s, u) {
  const v = 1 - u
  const a = v * v * v
  const b = 3 * v * v * u
  const c = 3 * v * u * u
  const d = u * u * u
  return {
    x: a * s.p1.x + b * s.c1.x + c * s.c2.x + d * s.p2.x,
    y: a * s.p1.y + b * s.c1.y + c * s.c2.y + d * s.p2.y,
  }
}

/**
 * Arc-length lookup table. Sampling uniformly in the bézier parameter would
 * bunch samples on tight curves and make a constant-speed train visibly
 * surge; walking cumulative distance instead keeps speed honest.
 */
export function arcTable(segments, perSegment = 24) {
  const points = []
  const lengths = [0]
  let total = 0

  segments.forEach((s, si) => {
    const start = si === 0 ? 0 : 1
    for (let i = start; i <= perSegment; i += 1) {
      const point = cubicAt(s, i / perSegment)
      if (points.length) {
        const prev = points[points.length - 1]
        total += Math.hypot(point.x - prev.x, point.y - prev.y)
        lengths.push(total)
      }
      points.push(point)
    }
  })

  return { points, lengths, length: total }
}

/**
 * Position and heading at normalised distance `t` (0–1) along the table.
 * The angle is taken from the neighbouring samples so a marker can be rotated
 * to face its direction of travel.
 */
export function pointAt(table, t) {
  const { points, lengths, length } = table
  if (!points.length) return { x: 0, y: 0, angle: 0 }

  const target = Math.min(Math.max(t, 0), 1) * length

  // Binary search the cumulative-length table.
  let lo = 0
  let hi = lengths.length - 1
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1
    if (lengths[mid] <= target) lo = mid
    else hi = mid
  }

  const span = lengths[hi] - lengths[lo] || 1
  const u = (target - lengths[lo]) / span
  const a = points[lo]
  const b = points[hi]

  return {
    x: a.x + (b.x - a.x) * u,
    y: a.y + (b.y - a.y) * u,
    angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  }
}

/** Normalised distance of each authored control point along the curve. */
export function nodeOffsets(segments, table, perSegment = 24) {
  if (!segments.length) return [0]
  const offsets = [0]
  for (let i = 1; i <= segments.length; i += 1) {
    offsets.push(table.lengths[i * perSegment] / table.length)
  }
  return offsets
}
