import { useEntrance } from '../../hooks/useEntrance'
import { getForecast, getPredictionBreakdown } from '../../lib/eta'
import { JourneyHeader } from './JourneyHeader'
import { JourneyTimeline } from './JourneyTimeline'
import { PerformanceMetrics } from './PerformanceMetrics'
import { UpcomingStations } from './UpcomingStations'
import { WhyThisETA } from './WhyThisETA'

/** Composes the whole journey view for one train. */
export function TrainJourney({ journey, onBack }) {
  const containerRef = useEntrance({ delay: 40, each: 60 })

  const forecast = getForecast(journey)
  const breakdown = getPredictionBreakdown(journey)

  return (
    <div ref={containerRef} className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
      <div data-enter>
        <JourneyHeader journey={journey} onBack={onBack} />
      </div>

      <div data-enter className="mt-5">
        <JourneyTimeline key={journey.trainNumber} journey={journey} />
      </div>

      <div data-enter className="mt-5">
        <PerformanceMetrics current={journey.current} />
      </div>

      <div data-enter className="mt-5 grid gap-5 lg:grid-cols-12">
        <WhyThisETA
          breakdown={breakdown}
          destinationName={forecast.destinationName}
          className="min-w-0 lg:col-span-5"
        />
        <UpcomingStations journey={journey} className="min-w-0 lg:col-span-7" />
      </div>
    </div>
  )
}
