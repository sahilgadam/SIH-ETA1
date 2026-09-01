import { Hero } from '../components/home/Hero'
import { PopularTrains } from '../components/home/PopularTrains'
import { ValueStrip } from '../components/home/ValueStrip'

/** The landing page. Searches hand their criteria up to the app shell. */
export function Home({ onSearch, onOpenTrain }) {
  return (
    <>
      <Hero onSearch={onSearch} />
      <div className="rail-rule" aria-hidden="true" />
      <ValueStrip />
      <PopularTrains onSelectTrain={(train) => onOpenTrain(train.number)} />
    </>
  )
}
