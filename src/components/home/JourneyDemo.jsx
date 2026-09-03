import { useLanguage } from '../../context/LanguageProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Eyebrow } from '../ui/Eyebrow'
import { RailLine } from '../ui/RailLine'

const nodes = [
  { id: 'bct', label: 'BCT', sublabel: 'Mumbai Central' },
  { id: 'st', label: 'ST', sublabel: 'Surat' },
  { id: 'brc', label: 'BRC', sublabel: 'Vadodara' },
  { id: 'rtm', label: 'RTM', sublabel: 'Ratlam' },
  { id: 'ndls', label: 'NDLS', sublabel: 'New Delhi' },
]

/**
 * A conceptual, looping illustration of the same route shown live on the
 * 12951 journey page — not a second simulation, just this route's real
 * timetable and forecast, held still, with a marker sweeping the line to
 * carry the idea before a passenger ever opens a journey.
 */
export function JourneyDemo() {
  const { t } = useLanguage()
  const containerRef = useScrollReveal()

  return (
    <section aria-labelledby="demo-title" className="border-b border-line bg-surface">
      <div ref={containerRef} className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:py-16">
        <div data-reveal className="max-w-2xl">
          <Eyebrow as="p">{t('demo.eyebrow')}</Eyebrow>
          <h2 id="demo-title" className="mt-3 font-display text-2xl font-medium text-fg sm:text-3xl">
            {t('demo.title')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-fg-muted sm:text-base">{t('demo.body')}</p>
        </div>

        <div data-reveal className="relative mt-14 sm:mt-16">
          <RailLine nodes={nodes} />
          <span
            aria-hidden="true"
            className="journey-demo-marker absolute top-[4px] -ml-[5.5px] block size-[11px] -translate-y-1/2 rounded-full border-2 border-accent bg-accent"
            style={{ boxShadow: '0 0 0 3px var(--surface)' }}
          />
        </div>

        <dl data-reveal className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-4 border-t border-line pt-6 sm:mt-14">
          <div>
            <dt className="text-xs text-fg-muted">{t('demo.scheduled')}</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums leading-none text-fg-muted">
              08:32
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-brand-text">{t('demo.predicted')}</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums leading-none text-fg">08:46</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-muted">{t('eta.predictedDelay')}</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums leading-none text-accent-hover">
              +14 <span className="text-sm font-medium">{t('unit.min')}</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
