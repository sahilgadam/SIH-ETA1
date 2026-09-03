import { useMemo } from 'react'
import { useLanguage } from '../context/LanguageProvider'
import { useNetwork } from '../context/NetworkProvider'
import { bulletins, liveStories } from '../data/bulletins'
import { formatClock, SIM_START_MINUTES } from '../lib/railSim'
import { Newspaper } from '../components/alerts/Newspaper'
import { Eyebrow } from '../components/ui/Eyebrow'

/**
 * Alerts, published as an operations bulletin.
 *
 * The front page leads on whatever the simulation is actually doing — the
 * worst-running services are turned into stories at render time — followed by
 * the slower authored operational notices. So the paper is never reporting a
 * network different from the one on the map.
 */
export function Alerts() {
  const { t } = useLanguage()
  const { trains, minutes } = useNetwork()

  const clock = formatClock(SIM_START_MINUTES + minutes)

  // Live stories lead; authored notices follow, ordered so each page opens on
  // something substantial rather than three briefs in a row.
  const stories = useMemo(() => {
    const live = liveStories(trains, formatClock)
    const authored = [...bulletins].sort((a, b) => {
      const rank = { lead: 0, feature: 1, standard: 2, brief: 3 }
      return rank[a.weight] - rank[b.weight]
    })
    return [...live, ...authored]
  }, [trains])

  return (
    <>
      <header className="border-b border-line bg-page">
        <div className="mx-auto max-w-[1320px] px-4 pb-6 pt-10 sm:px-6 lg:pb-8 lg:pt-14">
          <Eyebrow as="p">{t('alerts.eyebrow')}</Eyebrow>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h1 className="max-w-[15ch] font-display text-[2.5rem] font-medium leading-[1.05] text-fg sm:text-[3.25rem]">
              {t('alerts.title')}
            </h1>
            <p className="max-w-sm text-sm leading-6 text-fg-muted">{t('alerts.lead')}</p>
          </div>
        </div>
      </header>

      <section className="border-b border-line bg-ground-sand">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:py-14">
          <Newspaper stories={stories} clock={clock} />
        </div>
      </section>
    </>
  )
}
