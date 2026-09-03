import { AboutRailSense } from '../components/home/AboutRailSense'
import { CategoryPreview } from '../components/home/CategoryPreview'
import { DelayPropagation } from '../components/home/DelayPropagation'
import { FinalCta } from '../components/home/FinalCta'
import { Hero } from '../components/home/Hero'
import { JourneyDemo } from '../components/home/JourneyDemo'
import { ValueStrip } from '../components/home/ValueStrip'

/**
 * The landing page — a passenger's entry point, and nothing else.
 *
 * Home used to carry the whole product: a network-status strip, the live map,
 * the running timetable, the operational events feed and a station board. All
 * five now live on the pages they belong to (Live Status, Trains, Alerts,
 * Stations), which is what lets this page answer the four questions a
 * passenger actually arrives with, in order:
 *
 *   what train am I looking for   → hero search, then service classes
 *   where is it / when will it    → how a journey is tracked
 *   how reliable is that ETA      → why the forecast moves
 *
 * Discovery comes before explanation, and both come before the editorial and
 * capability material.
 */
export function Home({ onSearch, onOpenLive, onOpenTrains }) {
  return (
    <>
      <Hero onSearch={onSearch} />
      <CategoryPreview onOpenTrains={onOpenTrains} />
      <JourneyDemo />
      <DelayPropagation />
      <AboutRailSense />
      <ValueStrip />
      <FinalCta onOpenLive={onOpenLive} onOpenTrains={onOpenTrains} />
    </>
  )
}
