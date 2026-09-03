import { getConnectionsAt } from '../../data/connections'
import { getImage } from '../../data/imagery'
import { useLanguage } from '../../context/LanguageProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'
import { SourceBadge } from '../ui/SourceBadge'
import { DepartureBoardCard } from './DepartureBoardCard'

const image = getImage('platform-day')
const FEATURED_STATION = { code: 'NDLS', name: 'New Delhi' }

/**
 * "A station is where journeys intersect" — a featured station photograph
 * paired with a real departure board, not a search field alone. The rows
 * come straight from `connectionsByStation`, the same simulated onward
 * departures Connection Protection reads on the journey screen.
 */
export function StationsBoard({ onSearch }) {
  const { t } = useLanguage()
  const departures = getConnectionsAt(FEATURED_STATION.code).slice(0, 6)
  const containerRef = useScrollReveal()

  return (
    <section id="station-board" aria-labelledby="stations-title" className="border-b border-line bg-surface">
      <div ref={containerRef} className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:py-16">
        <div data-reveal className="max-w-2xl">
          <Eyebrow as="p">{t('stations.eyebrow')}</Eyebrow>
          <h2 id="stations-title" className="mt-3 font-display text-2xl font-medium text-fg sm:text-3xl">
            {t('stations.title')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-fg-muted sm:text-base">{t('stations.body')}</p>
        </div>

        <div data-reveal className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <figure className="relative overflow-hidden border border-line bg-sunken lg:col-span-5">
            <div className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="font-display text-xl font-medium text-white">{FEATURED_STATION.name}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Mono className="text-sm font-semibold text-white/90">{FEATURED_STATION.code}</Mono>
                <span className="inline-flex items-center gap-1.5 rounded-sm bg-white/15 px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-white">
                  <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
                  {t('stations.liveDepartures')}
                </span>
              </div>
            </figcaption>
          </figure>

          {/* min-w-0: a grid item's default `min-width: auto` lets the wide
              departure table stretch the track instead of scrolling inside it,
              which pushed the whole page into horizontal scroll on mobile. */}
          <div className="min-w-0 lg:col-span-7">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <caption className="sr-only">{t('stations.liveDepartures')}</caption>
                <thead>
                  <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    <th scope="col" className="py-2.5 pr-3">{t('stations.time')}</th>
                    <th scope="col" className="px-3 py-2.5">{t('stations.train')}</th>
                    <th scope="col" className="px-3 py-2.5">{t('stations.destination')}</th>
                    <th scope="col" className="py-2.5 pl-3 text-right">{t('stations.platform')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {departures.map((train) => (
                    <tr key={train.trainNumber}>
                      <td className="py-3 pr-3 align-top">
                        <Mono className="text-sm font-semibold text-fg">{train.scheduledDeparture}</Mono>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <Mono className="text-xs font-semibold text-fg-subtle">{train.trainNumber}</Mono>
                        <p className="mt-0.5 max-w-[16rem] truncate text-sm text-fg">{train.trainName}</p>
                      </td>
                      <td className="px-3 py-3 align-top text-sm text-fg-muted">{train.toStation}</td>
                      <td className="py-3 pl-3 text-right align-top">
                        <Mono className="text-sm text-fg-muted">{train.platform ?? '—'}</Mono>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SourceBadge source="simulated" className="mt-3" />

            <DepartureBoardCard onSearch={onSearch} className="mt-8 border-t border-line pt-6" />
          </div>
        </div>
      </div>
    </section>
  )
}
