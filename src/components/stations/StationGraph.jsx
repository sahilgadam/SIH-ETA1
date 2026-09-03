import { useEffect, useMemo, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { routes, stationByCode } from '../../lib/railSim'

/**
 * What this station connects to.
 *
 * The spokes are not decorative: each one is a station that is the immediate
 * previous or next call of a service that actually stops here. The dashed
 * outer ring is where those services finish — the places reachable without
 * changing. Bearings come from the real coordinates, so Howrah sits east of
 * New Delhi and Mumbai south-west.
 *
 * Topology is read from the static route table rather than the live snapshot.
 * Which stations connect is a property of the timetable, not of today's
 * delays — and deriving it from the live array made it a new object on every
 * simulation tick, which restarted the draw-in animation four times a second
 * so the spokes never finished drawing.
 */

const PAD = 46

function bearing(from, to) {
  // Screen bearing: 0° = north, clockwise.
  const dLng = (to.lng - from.lng) * Math.cos(((from.lat + to.lat) / 2) * (Math.PI / 180))
  const dLat = to.lat - from.lat
  return Math.atan2(dLng, dLat)
}

const allRoutes = () => [...routes.values()]

/** Immediate neighbours of `code` across every service that calls there. */
export function neighboursOf(code) {
  const byCode = new Map()

  for (const { train, stops } of allRoutes()) {
    const index = stops.findIndex((stop) => stop.code === code)
    if (index === -1) continue

    for (const step of [-1, 1]) {
      const neighbour = stops[index + step]
      if (!neighbour) continue
      const entry = byCode.get(neighbour.code) ?? {
        code: neighbour.code,
        name: neighbour.name,
        lat: neighbour.lat,
        lng: neighbour.lng,
        km: Math.abs(neighbour.km - stops[index].km),
        services: [],
      }
      if (!entry.services.includes(train.number)) entry.services.push(train.number)
      byCode.set(neighbour.code, entry)
    }
  }

  return [...byCode.values()].sort((a, b) => b.services.length - a.services.length)
}

/**
 * The far end of every service calling here — reachable without changing.
 * Immediate neighbours are excluded; they are already drawn as spokes.
 */
export function destinationsOf(code) {
  const neighbourCodes = new Set(neighboursOf(code).map((n) => n.code))
  const byCode = new Map()

  for (const { train, stops } of allRoutes()) {
    if (!stops.some((stop) => stop.code === code)) continue
    for (const end of [stops[0], stops[stops.length - 1]]) {
      if (end.code === code || neighbourCodes.has(end.code)) continue
      const entry = byCode.get(end.code) ?? {
        code: end.code,
        name: end.name,
        lat: end.lat,
        lng: end.lng,
        services: [],
      }
      if (!entry.services.includes(train.number)) entry.services.push(train.number)
      byCode.set(end.code, entry)
    }
  }
  return [...byCode.values()].sort((a, b) => b.services.length - a.services.length)
}

export function StationGraph({ code }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const groupRef = useRef(null)
  const station = stationByCode.get(code)

  const layout = useMemo(() => {
    if (!station) return null

    const neighbours = neighboursOf(code)
    const destinations = destinationsOf(code)
    const maxKm = Math.max(...neighbours.map((n) => n.km), 1)

    const inner = neighbours.map((n) => {
      const angle = bearing(station, n)
      const r = 84 + Math.sqrt(n.km / maxKm) * 130
      return { ...n, angle, x: Math.sin(angle) * r, y: -Math.cos(angle) * r }
    })

    // Declustering: New Delhi's connections all lie to the south, so nodes on
    // near-identical bearings would print on top of each other. Push each
    // successive one further out along its own bearing instead of nudging it
    // sideways, which would put it in the wrong direction.
    const sorted = [...destinations].sort((a, b) => bearing(station, a) - bearing(station, b))
    let previousAngle = null
    let stack = 0
    const outer = sorted.map((d) => {
      const angle = bearing(station, d)
      if (previousAngle !== null && Math.abs(angle - previousAngle) < 0.26) stack += 1
      else stack = 0
      previousAngle = angle
      const r = 250 + stack * 46
      return { ...d, angle, x: Math.sin(angle) * r, y: -Math.cos(angle) * r }
    })

    // Fit the frame to what is actually drawn. A fixed square left half the
    // plate empty whenever a station's connections all ran one way.
    const points = [{ x: 0, y: 0 }, ...inner, ...outer]
    const minX = Math.min(...points.map((p) => p.x)) - PAD - 34
    const maxX = Math.max(...points.map((p) => p.x)) + PAD + 34
    const minY = Math.min(...points.map((p) => p.y)) - PAD
    const maxY = Math.max(...points.map((p) => p.y)) + PAD

    return {
      inner,
      outer,
      viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
    }
  }, [code, station])

  // Draw the spokes in when the station changes. Depends on `code` alone, so
  // it runs once per station rather than on every simulation tick.
  useEffect(() => {
    if (prefersReducedMotion || !groupRef.current) return
    const lines = groupRef.current.querySelectorAll('[data-spoke]')
    lines.forEach((line, i) => {
      const length = line.getTotalLength?.() ?? 240
      line.style.transition = 'none'
      line.style.strokeDasharray = `${length}`
      line.style.strokeDashoffset = `${length}`
      void line.getBoundingClientRect() // flush, so the reset is not batched away
      line.style.transition = `stroke-dashoffset 620ms var(--ease-rail) ${i * 55}ms`
      line.style.strokeDashoffset = '0'
    })
  }, [code, prefersReducedMotion])

  if (!station || !layout) return null

  return (
    <svg
      viewBox={layout.viewBox}
      className="h-full w-full"
      role="img"
      aria-label={`Stations connected to ${station.name}`}
    >
      {/* Reachable without changing: quieter, drawn first. */}
      <g>
        {layout.outer.map((node) => (
          <line
            key={`reach-${node.code}`}
            x1={0}
            y1={0}
            x2={node.x}
            y2={node.y}
            stroke="var(--line)"
            strokeWidth={1}
            strokeDasharray="3 5"
          />
        ))}
      </g>

      <g ref={groupRef}>
        {layout.inner.map((node) => (
          <line
            key={`spoke-${node.code}`}
            data-spoke
            x1={0}
            y1={0}
            x2={node.x}
            y2={node.y}
            stroke="var(--line-strong)"
            strokeWidth={Math.min(1.4 + node.services.length * 0.7, 3.6)}
            strokeLinecap="round"
          />
        ))}
      </g>

      {layout.outer.map((node) => (
        <g key={`reach-node-${node.code}`}>
          <circle cx={node.x} cy={node.y} r={3.5} fill="var(--surface)" stroke="var(--line-strong)" strokeWidth={1.2} />
          <text
            x={node.x}
            y={node.y - 9}
            textAnchor="middle"
            className="font-mono"
            fontSize={9.5}
            letterSpacing={0.4}
            fill="var(--fg-subtle)"
          >
            {node.code}
          </text>
        </g>
      ))}

      {layout.inner.map((node) => (
        <g key={node.code}>
          <circle cx={node.x} cy={node.y} r={5.5} fill="var(--surface)" stroke="var(--brass)" strokeWidth={1.8} />
          <text
            x={node.x}
            y={node.y - 12}
            textAnchor="middle"
            className="font-mono"
            fontSize={11.5}
            fontWeight={600}
            letterSpacing={0.5}
            fill="var(--fg)"
          >
            {node.code}
          </text>
          <text
            x={node.x}
            y={node.y + 19}
            textAnchor="middle"
            className="font-mono"
            fontSize={9}
            fill="var(--fg-subtle)"
          >
            {node.services.length} svc · {Math.round(node.km)} km
          </text>
        </g>
      ))}

      {/* The hub. */}
      <circle r={14} fill="var(--brand)" />
      <circle r={20} fill="none" stroke="var(--brand)" strokeWidth={1} opacity={0.35} />
      <text
        y={4}
        textAnchor="middle"
        className="font-mono"
        fontSize={10.5}
        fontWeight={700}
        fill="var(--brand-fg)"
      >
        {station.code.slice(0, 4)}
      </text>
    </svg>
  )
}
