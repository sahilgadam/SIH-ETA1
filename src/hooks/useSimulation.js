import { useCallback, useEffect, useMemo, useState } from 'react'
import { simulateJourney } from '../lib/simulation'

/** One clock for the whole journey screen. */
const TICK_MS = 400
/** Simulated minutes advanced per tick at 1×. */
const MINUTES_PER_TICK = 1

export const SIMULATION_SPEEDS = [1, 2, 5]

/**
 * Drives the journey forward in simulated time.
 *
 * There is exactly one interval and exactly one piece of state that matters —
 * the elapsed simulated minutes. Everything the screen shows is derived from it
 * by `simulateJourney`, which is pure, so the map, the timeline and the metrics
 * cannot fall out of step with each other and a reset is exact.
 */
export function useSimulation(baseJourney) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  // A new train is a new run. Adjusting state during render is React's own
  // pattern for this and avoids a wasted pass through the old train's clock.
  const trainNumber = baseJourney.trainNumber
  const [lastTrainNumber, setLastTrainNumber] = useState(trainNumber)
  if (lastTrainNumber !== trainNumber) {
    setLastTrainNumber(trainNumber)
    setElapsedMinutes(0)
    setIsPlaying(false)
    setSpeed(1)
  }

  const journey = useMemo(
    () => simulateJourney(baseJourney, elapsedMinutes),
    [baseJourney, elapsedMinutes],
  )

  // Nothing left to simulate once the train is in, so the clock stops on its
  // own. Derived rather than set from an effect: there is no state to correct.
  const { hasArrived } = journey.simulation
  const isRunning = isPlaying && !hasArrived

  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      setElapsedMinutes((current) => current + MINUTES_PER_TICK * speed)
    }, TICK_MS)

    return () => clearInterval(id)
  }, [isRunning, speed])

  const start = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])
  const reset = useCallback(() => {
    setIsPlaying(false)
    setElapsedMinutes(0)
  }, [])

  return {
    journey,
    controls: { isRunning, speed, setSpeed, start, pause, reset, hasArrived },
    elapsedMinutes,
  }
}
