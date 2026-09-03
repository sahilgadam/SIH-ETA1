/**
 * A locomotive driving wheel, drawn to scale-model proportions: tyre, rim,
 * eight spokes, a crank pin and the counterweight opposite it.
 *
 * Drawn centred on the origin so the parent can spin it with a plain
 * `rotate()` — the rotation is computed from distance travelled, not from a
 * timer, so the wheel rolls rather than merely spinning (§54).
 */
export function DrivingWheel({ r = 42 }) {
  const spokes = Array.from({ length: 8 }, (_, i) => (i * 360) / 8)

  return (
    <g>
      {/* Tyre */}
      <circle r={r} fill="none" stroke="var(--brass)" strokeWidth={r * 0.14} opacity={0.95} />
      <circle r={r * 0.93} fill="none" stroke="var(--ground-deep)" strokeWidth={r * 0.04} opacity={0.5} />

      {/* Spokes */}
      {spokes.map((angle) => (
        <rect
          key={angle}
          x={-r * 0.045}
          y={-r * 0.82}
          width={r * 0.09}
          height={r * 0.72}
          rx={r * 0.03}
          fill="var(--brass)"
          opacity={0.85}
          transform={`rotate(${angle})`}
        />
      ))}

      {/* Counterweight — the off-centre mass that makes the roll legible */}
      <path
        d={`M ${-r * 0.62} ${r * 0.38} A ${r * 0.74} ${r * 0.74} 0 0 0 ${r * 0.62} ${r * 0.38} L ${r * 0.4} ${r * 0.72} A ${r * 0.86} ${r * 0.86} 0 0 1 ${-r * 0.4} ${r * 0.72} Z`}
        fill="var(--brass)"
        opacity={0.72}
      />

      {/* Hub + crank pin */}
      <circle r={r * 0.2} fill="var(--brass)" />
      <circle r={r * 0.09} fill="var(--ground-deep)" />
      <circle cx={r * 0.52} cy={0} r={r * 0.075} fill="var(--ground-deep)" opacity={0.85} />
    </g>
  )
}
