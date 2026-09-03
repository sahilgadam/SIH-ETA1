/**
 * The RailSense train marker (§52).
 *
 * A compact top-down locomotive silhouette built from SVG geometry: a
 * chamfered nose that makes direction of travel unambiguous, a body, a
 * cab band, and two bogies. It is drawn nose-right at the origin so the
 * renderer can place it with a single `translate(x,y) rotate(heading)` and
 * have it face along the rail.
 *
 * Deliberately not a dot, not a pin, not an emoji — at this size the
 * silhouette still reads as "a train, going that way" which is the one thing
 * the diagram has to communicate at a glance.
 */

const STATUS_FILL = {
  'on-time': 'var(--sig-green)',
  watch: 'var(--sig-amber)',
  delayed: 'var(--sig-amber)',
  critical: 'var(--sig-red)',
  stopped: 'var(--brass-bright)',
}

export function TrainMarker({ status = 'on-time', scale = 1, selected = false, dimmed = false }) {
  const fill = STATUS_FILL[status] ?? STATUS_FILL['on-time']

  return (
    <g transform={`scale(${scale})`} opacity={dimmed ? 0.32 : 1}>
      {selected ? (
        <rect x={-13} y={-7.5} width={26} height={15} rx={3} fill="none" stroke={fill} strokeWidth={1} opacity={0.55} />
      ) : null}

      {/* Bogies: read as wheels at size without ever being drawn as circles
          that would spin unconvincingly at 8px. */}
      <rect x={-7.5} y={-5.4} width={4} height={10.8} rx={1} fill="var(--ground-deep)" opacity={0.55} />
      <rect x={3.5} y={-5.4} width={4} height={10.8} rx={1} fill="var(--ground-deep)" opacity={0.55} />

      {/* Body + chamfered nose, drawn as one path so the silhouette stays crisp. */}
      <path
        d="M -9.5 -4.2 L 5.5 -4.2 L 9.6 0 L 5.5 4.2 L -9.5 4.2 Z"
        fill={fill}
        stroke="var(--ground-deep)"
        strokeWidth={0.6}
        strokeLinejoin="round"
      />

      {/* Cab band — a single light detail that keeps the nose readable. */}
      <path d="M 3.4 -3.5 L 5.2 -3.5 L 8.4 0 L 5.2 3.5 L 3.4 3.5 Z" fill="var(--on-deep)" opacity={0.72} />
    </g>
  )
}
