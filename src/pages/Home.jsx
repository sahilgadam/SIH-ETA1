import { AboutRailSense } from '../components/home/AboutRailSense'
import { DelayPropagation } from '../components/home/DelayPropagation'
import { Hero } from '../components/home/Hero'
import { JourneyDemo } from '../components/home/JourneyDemo'
import { LiveNetwork } from '../components/home/LiveNetwork'
import { LiveStrip } from '../components/home/LiveStrip'
import { OperationalAlerts } from '../components/home/OperationalAlerts'
import { PopularTrains } from '../components/home/PopularTrains'
import { StationsBoard } from '../components/home/StationsBoard'
import { ValueStrip } from '../components/home/ValueStrip'

/**
 * The landing page.
 *
 * Section order follows the passenger's actual questions (§11, §69): search,
 * then what the network is doing right now, then the trains themselves —
 * useful running information arrives before any explanation of the product.
 * Editorial and capability material comes last, once the tool has already
 * proved what it does.
 */
export function Home({ onSearch, onOpenTrain, onOpenLive }) {
  return (
    <>
      <Hero onSearch={onSearch} />
      <LiveStrip />
      <LiveNetwork onOpenLive={onOpenLive} />
      <PopularTrains onSelectTrain={(train) => onOpenTrain(train.number)} />
      <JourneyDemo />
      <DelayPropagation />
      <OperationalAlerts />
      <StationsBoard onSearch={onSearch} />
      <AboutRailSense />
      <ValueStrip />
    </>
  )
}
