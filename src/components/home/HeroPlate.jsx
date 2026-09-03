import { useEffect, useRef, useState } from 'react'
import { images, srcSetFor } from '../../data/imagery'
import { DrivingWheel } from '../railway/DrivingWheel'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * The hero plate: a driving wheel rolls along the lower edge of the
 * photograph from one corner to the other, and *its travel is what changes
 * the image* — the wipe boundary tracks the wheel, so the next plate is
 * uncovered by the wheel rather than merely cross-fading behind it.
 *
 * Two details make it read as rolling rather than spinning (§54):
 *
 *   - rotation is derived from distance covered (θ = d / r), never from a
 *     timer, so the rim speed matches the ground speed exactly;
 *   - the wheel reverses at each corner instead of teleporting back, and
 *     pauses briefly before setting off — the same slow-in/slow-out and
 *     dwell language the trains use elsewhere.
 *
 * The whole loop is written straight to the DOM from one rAF; React only
 * re-renders when the plate pair changes, roughly every seven seconds.
 */

/** Plates the hero cycles through, chosen for a strong horizon and a train in frame. */
const PLATE_IDS = ['hero', 'hill-run', 'bridge-crossing', 'platform-dusk-bridge']

const plates = PLATE_IDS.map((id) => images.find((image) => image.id === id)).filter(Boolean)

const ROLL_MS = 5200
const DWELL_MS = 1500
const WHEEL_PX = 92

/** Ease that starts and stops like a mass on rails, rather than linearly. */
const easeRail = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export function HeroPlate() {
  const prefersReducedMotion = usePrefersReducedMotion()

  const [pair, setPair] = useState({ current: 0, next: 1, dir: 1 })

  const frameRef = useRef(null)
  const wheelRef = useRef(null)
  const spinRef = useRef(null)
  const incomingRef = useRef(null)
  const widthRef = useRef(0)

  // Track the plate's width so the wheel's travel always ends exactly at the
  // far corner, at any breakpoint.
  useEffect(() => {
    const node = frameRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      widthRef.current = entry.contentRect.width
    })
    observer.observe(node)
    widthRef.current = node.getBoundingClientRect().width
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    let raf = 0
    let start = performance.now()
    let phase = 'roll'
    let cancelled = false

    const radius = WHEEL_PX / 2

    const apply = (progress, dir) => {
      const travel = Math.max(widthRef.current - WHEEL_PX, 1)
      const eased = easeRail(progress)
      // dir 1 → left corner to right corner; dir -1 → back again.
      const x = dir === 1 ? eased * travel : (1 - eased) * travel
      const degrees = ((x - (dir === 1 ? 0 : travel)) / radius) * (180 / Math.PI)

      if (wheelRef.current) wheelRef.current.style.transform = `translate3d(${x}px,0,0)`
      if (spinRef.current) spinRef.current.setAttribute('transform', `rotate(${degrees.toFixed(2)})`)

      // The wipe edge follows the wheel's centre across the plate. A soft
      // gradient rather than a hard clip: the wheel feathers the next plate
      // in behind itself instead of splitting the frame in two.
      const pct = ((x + radius) / Math.max(widthRef.current, 1)) * 100
      if (incomingRef.current) {
        const mask =
          dir === 1
            ? `linear-gradient(to right, #000 ${(pct - 7).toFixed(2)}%, transparent ${(pct + 1).toFixed(2)}%)`
            : `linear-gradient(to right, transparent ${(pct - 1).toFixed(2)}%, #000 ${(pct + 7).toFixed(2)}%)`
        incomingRef.current.style.maskImage = mask
        incomingRef.current.style.webkitMaskImage = mask
      }
    }

    const tick = (now) => {
      if (cancelled) return
      const elapsed = now - start

      if (phase === 'roll') {
        const progress = Math.min(elapsed / ROLL_MS, 1)
        apply(progress, pair.dir)
        if (progress >= 1) {
          phase = 'dwell'
          start = now
        }
      } else if (now - start >= DWELL_MS) {
        // The uncovered plate becomes the current one and the wheel sets off
        // back the other way towards the opposite corner.
        setPair((p) => ({
          current: p.next,
          next: (p.next + 1) % plates.length,
          dir: p.dir === 1 ? -1 : 1,
        }))
        return
      }

      raf = requestAnimationFrame(tick)
    }

    apply(0, pair.dir)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [pair, prefersReducedMotion])

  const current = plates[pair.current]
  const incoming = plates[pair.next]
  const sizes = '(max-width: 1024px) 100vw, 46vw'

  return (
    // Padding at the foot leaves the wheel room to sit on the plate's bottom
    // edge without being clipped — only the imagery is allowed to overflow.
    <figure ref={frameRef} className="relative m-0" style={{ paddingBottom: WHEEL_PX / 2 }}>
      <div className="relative aspect-4/5 w-full overflow-hidden bg-ground-deep sm:aspect-3/2 lg:aspect-4/5">
        <img
          src={current.src}
          srcSet={srcSetFor(current)}
          sizes={sizes}
          alt={current.alt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* The plate being uncovered. Hidden from assistive tech: it is the
            same subject mid-transition, and announcing it twice adds nothing. */}
        {!prefersReducedMotion ? (
          <img
            ref={incomingRef}
            key={incoming.src}
            src={incoming.src}
            srcSet={srcSetFor(incoming)}
            sizes={sizes}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              maskImage:
                pair.dir === 1
                  ? 'linear-gradient(to right, #000 -7%, transparent 1%)'
                  : 'linear-gradient(to right, transparent 99%, #000 107%)',
            }}
          />
        ) : null}

        {/* Foot of the frame darkens so the wheel and the caption hold against
            any plate in the rotation. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
          style={{ background: 'linear-gradient(to top, rgba(15,32,26,0.82), transparent)' }}
        />
      </div>

      {/* The rail the wheel runs on — the plate's bottom edge, made literal. */}
      <div
        className="absolute inset-x-0 h-px bg-brass/60"
        style={{ bottom: WHEEL_PX / 2 }}
        aria-hidden="true"
      />

      {!prefersReducedMotion ? (
        <div
          ref={wheelRef}
          className="pointer-events-none absolute bottom-0 left-0 will-change-transform"
          style={{ width: WHEEL_PX, height: WHEEL_PX }}
          aria-hidden="true"
        >
          <svg viewBox="-50 -50 100 100" className="h-full w-full overflow-visible">
            <g ref={spinRef}>
              <DrivingWheel r={42} />
            </g>
          </svg>
        </div>
      ) : null}

      <figcaption className="sr-only">{current.caption}</figcaption>
    </figure>
  )
}
