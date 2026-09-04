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
 *   trains/summary — React state, refreshed once a second. Numbers (ETA,
 *                    speed, delay, counts) don't need frame precision, and
 *                    re-rendering them at 60fps would be the single most
 *                    expensive thing on the page.
 *
 * Both channels read the *same* `clockRef`, so the marker on the map, the
 * station timings, the delay chain and a spoken announcement are all reading
 * one clock and can never disagree about what time it is.
 *
 * Under reduced motion the clock holds still: the network is shown at a fixed
 * moment with every value present and readable (§62).
 */

const NetworkContext = createContext(null)

/**
 * How fast railway time runs against real time at 1×.
 *
 * ONE RAILWAY MINUTE TAKES ONE REAL MINUTE.
 *
 * This used to be 1.6 simulated minutes per real *second* — the timetable
 * advanced about a minute and a half between one tick of a wristwatch and the
 * next. Every number derived from the clock inherited that: an ETA moved while
 * you were reading it, "arrives in 14 min" fell to "arrives in 3 min" inside
 * ten seconds, and a train crossed a two-hour section in a minute and a half.
 * Railway minutes were, quite literally, behaving like real-world seconds.
 *
 * Because position, the delay propagation, per-station timings, the timeline
 * and the connection windows are all derived from this single number,
 * correcting it here corrects every one of them together — there is no second
 * clock anywhere to fall out of step with.
 *
 * Faster rates remain available through the speed control, as an explicit
 * demo choice rather than the default behaviour.
 */
const MINUTES_PER_REAL_MINUTE = 1
const MINUTES_PER_SECOND = MINUTES_PER_REAL_MINUTE / 60

/**
 * How often the React-visible snapshot is refreshed, in ms.
 *
 * Everything on screen is quantised to whole minutes (clock times, delays,
 * countdowns) or rounds to a whole km/h, so a one-second cadence is already
 * finer than anything that can visibly change. Anything quicker would only
 * re-render the tree for identical output — and would make announcements and
 * countdowns twitch for no reason.
 */
const SNAPSHOT_MS = 1000

/**
 * Real-time multipliers. 1× is the honest, real-time rate; the rest are demo
 * speeds for showing a whole journey without waiting for it.
 */
export const SIM_SPEEDS = [1, 2, 5, 10]

export function NetworkProvider({ children }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const [isRunning, setIsRunning] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [minutes, setMinutes] = useState(0)

  // The authoritative clock lives in a ref; state is a sampled view of it.
  const clockRef = useRef(0)
  const subscribersRef = useRef(new Set())

  const subscribe = useCallback((fn) => {
    const subscribers = subscribersRef.current
    subscribers.add(fn)
    fn(clockRef.current)
    return () => subscribers.delete(fn)
  }, [])

  const active = isRunning && !prefersReducedMotion

  useEffect(() => {
    if (!active) return

    let last = performance.now()
    let sinceSnapshot = 0
    // Owned by this effect run, so a re-run (play/pause, speed change) can
    // only ever cancel its own frame — two loops can never overlap.
    let frame = 0
    let stopped = false

    const tick = (now) => {
      if (stopped) return

      const dt = Math.min((now - last) / 1000, 0.1) // clamp: a backgrounded tab must not jump
      last = now

      clockRef.current += dt * MINUTES_PER_SECOND * speed
      for (const fn of subscribersRef.current) fn(clockRef.current)

      sinceSnapshot += dt * 1000
      if (sinceSnapshot >= SNAPSHOT_MS) {
        sinceSnapshot = 0
        setMinutes(clockRef.current)
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => {
      stopped = true
      cancelAnimationFrame(frame)
    }
  }, [active, speed])

  // Paused (or reduced-motion) still needs one correct snapshot to render.
  useEffect(() => {
    if (!active) setMinutes(clockRef.current)
  }, [active])

  const trains = useMemo(() => networkAt(minutes), [minutes])
  const summary = useMemo(() => summarise(trains), [trains])

  const play = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const toggle = useCallback(() => setIsRunning((v) => !v), [])

  const controls = useMemo(
    () => ({ isRunning: active, speed, setSpeed, play, pause, toggle }),
    [active, speed, play, pause, toggle],
  )

  const value = useMemo(
    () => ({
      minutes,
      trains,
      summary,
      subscribe,
      prefersReducedMotion,
      controls,
    }),
    [minutes, trains, summary, subscribe, prefersReducedMotion, controls],
  )

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) throw new Error('useNetwork must be used inside <NetworkProvider>')
  return context
}
