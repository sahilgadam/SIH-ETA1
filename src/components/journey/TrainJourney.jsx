import { useState } from 'react'
import { useEntrance } from '../../hooks/useEntrance'
import { useSimulation } from '../../hooks/useSimulation'
import { getForecast, getPredictionBreakdown } from '../../lib/eta'
import { assertJourneyInDev } from '../../lib/integrity'
import {
  assessConnection,
  getConfidence,
  getEtaExplanation,
  getHistory,
  getPassengerSummary,
  getRecovery,
  getWeather,
} from '../../lib/prediction'
import { JourneyMap } from '../map/JourneyMap'
import { AskRailSense } from '../assistant/AskRailSense'
import { ConnectionProtection } from './ConnectionProtection'
import { DelayRecovery } from './DelayRecovery'
import { ETAConfidence } from './ETAConfidence'
import { HistoricalReliability } from './HistoricalReliability'
import { JourneyHeader } from './JourneyHeader'
import { JourneyTimeline } from './JourneyTimeline'
import { PassengerSummary } from './PassengerSummary'
import { PerformanceMetrics } from './PerformanceMetrics'
import { SimulationControls } from './SimulationControls'
import { UpcomingStations } from './UpcomingStations'
import { WeatherNote } from './WeatherNote'
import { WhyThisETA } from './WhyThisETA'

/**
 * Composes the whole journey view for one train.
 *
 *     base journey  →  useSimulation  →  journey (this render's truth)
 *                                          │
 *      ┌──────────┬──────────┬─────────────┼─────────────┬───────────┐
 *     map      timeline   metrics    station table   why / recovery
 *                                          │
 *                              confidence · connection · summary · voice
 *
 * `useSimulation` hands back a journey-shaped object, so every panel below is
 * reading the same forecast through the same accessors it always did. Nothing
 * here knows the simulation exists beyond the controls strip, and no panel
 * holds its own copy of a prediction.
 *
 * The only state is the connecting train *number*. Its verdict is recomputed
 * from the live forecast every render, which is what keeps connection risk
 * moving as the predicted arrival moves.
 */
export function TrainJourney({ journey: baseJourney, onBack }) {
  const containerRef = useEntrance({ delay: 40, each: 60 })
  const [connectionNumber, setConnectionNumber] = useState('')

  const { journey, controls, elapsedMinutes } = useSimulation(baseJourney)

  // Development-only: shouts in the console the moment the forecast the screen
  // is about to render stops adding up. Compiled out of production builds.
  assertJourneyInDev(journey)

  const forecast = getForecast(journey)
  const breakdown = getPredictionBreakdown(journey)
  const explanation = getEtaExplanation(journey)
  const recovery = getRecovery(journey)
  const confidence = getConfidence(journey)
  const weather = getWeather(journey)
  const history = getHistory(journey)

  const assessment = connectionNumber ? assessConnection(journey, connectionNumber) : null
  const summary = getPassengerSummary(journey, assessment)

  return (
    <div ref={containerRef} className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
      <div data-enter>
        <JourneyHeader journey={journey} onBack={onBack} />
      </div>

      <div data-enter className="mt-4">
        <SimulationControls controls={controls} elapsedMinutes={elapsedMinutes} />
      </div>

      <div data-enter className="mt-5">
        <JourneyMap journey={journey} />
      </div>

      <div data-enter className="mt-5">
        <JourneyTimeline key={journey.trainNumber} journey={journey} />
      </div>

      <div data-enter className="mt-5">
        <PerformanceMetrics current={journey.current} />
      </div>

      <div data-enter className="mt-5 grid gap-5 lg:grid-cols-12">
        <UpcomingStations journey={journey} className="min-w-0 lg:col-span-7" />
        <WhyThisETA
          breakdown={breakdown}
          explanation={explanation}
          destinationName={forecast.destinationName}
          className="min-w-0 lg:col-span-5"
        />
      </div>

      {/* One bordered instrument cluster, not three separate cards side by
          side: a single panel with internal dividers, exactly like
          PerformanceMetrics above it. WeatherNote renders nothing when the
          run has no weather factor, so the dividers reflow on their own. */}
      <div
        data-enter
        className="mt-5 grid divide-y divide-line border border-line bg-surface md:grid-cols-2 md:divide-y-0 md:divide-x lg:grid-cols-3"
      >
        <DelayRecovery recovery={recovery} className="min-w-0 p-5" />
        <ETAConfidence confidence={confidence} className="min-w-0 p-5" />
        <WeatherNote weather={weather} className="min-w-0 p-5" />
        <HistoricalReliability history={history} className="min-w-0 p-5" />
      </div>

      <div data-enter className="mt-5 grid gap-5 lg:grid-cols-12">
        <ConnectionProtection
          journey={journey}
          assessment={assessment}
          connectionNumber={connectionNumber}
          onConnectionChange={setConnectionNumber}
          className="min-w-0 lg:col-span-7"
        />
        {/* The same assistant as the dock — one engine, one set of answers,
            rather than a second voice panel with its own behaviour (§14). */}
        <div className="min-w-0 border border-line bg-surface p-4 lg:col-span-5">
          <AskRailSense />
        </div>
      </div>

      <div data-enter className="mt-5">
        <PassengerSummary sentences={summary} />
      </div>
    </div>
  )
}
