import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { networkAt, summarise } from '../lib/railSim'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * One simulation clock for the entire application (§64).
 *
 * There are deliberately two update channels, because they have different
 * costs and different needs:
 *
 *   subscribe(fn)  — called every animation frame with the current simulated
 *                    minute. The network diagram uses it to move markers by
 *                    writing transforms directly, so twelve trains animate at
 *                    60fps without React re-rendering anything.
 *
 *   trains/summary — React state, refreshed a few times a second. Numbers
 *                    (ETA, speed, delay, counts) don't need frame precision,
 *                    and re-rendering them at 60fps would be the single most
 *                    expensive thing on the page.
 *
 * Under reduced motion the clock holds still: the network is shown at a fixed
 * moment with every value present and readable (§62).
 */

const NetworkContext = createContext(null)

/** Simulated minutes advanced per real second at 1×. */
const MINUTES_PER_SECOND = 1.6
/** How often the React-visible snapshot is refreshed, in ms. */
const SNAPSHOT_MS = 260

export const SIM_SPEEDS = [1, 2, 5]

export function NetworkProvider({ children }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const [isRunning, setIsRunning] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [minutes, setMinutes] = useState(0)

  // The authoritative clock lives in a ref; state is a sampled view of it.
  const clockRef = useRef(0)
  const subscribersRef = useRef(new Set())
  const frameRef = useRef(0)

  const subscribe = useCallback((fn) => {
    subscribersRef.current.add(fn)
    fn(clockRef.current)
    return () => subscribersRef.current.delete(fn)
  }, [])

  const active = isRunning && !prefersReducedMotion

  useEffect(() => {
    if (!active) return

    let last = performance.now()
    let sinceSnapshot = 0

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1) // clamp: a backgrounded tab must not jump
      last = now

      clockRef.current += dt * MINUTES_PER_SECOND * speed
      for (const fn of subscribersRef.current) fn(clockRef.current)

      sinceSnapshot += dt * 1000
      if (sinceSnapshot >= SNAPSHOT_MS) {
        sinceSnapshot = 0
        setMinutes(clockRef.current)
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [active, speed])

  // Paused (or reduced-motion) still needs one correct snapshot to render.
  useEffect(() => {
    if (!active) setMinutes(clockRef.current)
  }, [active])

  const trains = useMemo(() => networkAt(minutes), [minutes])
  const summary = useMemo(() => summarise(trains), [trains])

  const value = useMemo(
    () => ({
      minutes,
      trains,
      summary,
      subscribe,
      prefersReducedMotion,
      controls: {
        isRunning: active,
        speed,
        setSpeed,
        play: () => setIsRunning(true),
        pause: () => setIsRunning(false),
        toggle: () => setIsRunning((v) => !v),
      },
    }),
    [minutes, trains, summary, subscribe, prefersReducedMotion, active, speed],
  )

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) throw new Error('useNetwork must be used inside <NetworkProvider>')
  return context
}
