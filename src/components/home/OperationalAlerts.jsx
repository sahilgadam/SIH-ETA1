import { operationalEvents } from '../../data/alerts'
import { getImage } from '../../data/imagery'
import { useLanguage } from '../../context/LanguageProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'
import { SourceBadge } from '../ui/SourceBadge'

const image = getImage('signal-lamp')

const TYPE_TONE = {
  congestion: 'accent',
  restriction: 'accent',
  delay: 'accent',
}

const DOT_TONE = {
  congestion: 'border-caution bg-caution',
  restriction: 'border-caution bg-caution',
  delay: 'border-danger bg-danger',
}

/**
 * Alerts as an operational event chain, not notification cards. Every event
 * is the current section and prediction factor of one of this preview's
 * three sample trains (`src/data/alerts.js`), so a passenger can trace the
 * same cause the journey screen's "Why this ETA?" panel names.
 */
export function OperationalAlerts() {
  const { t } = useLanguage()
  const containerRef = useScrollReveal()

  return (
    <section id="alerts" aria-labelledby="alerts-title" className="border-b border-line bg-surface">
      <div ref={containerRef} className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:py-16">
        <div data-reveal className="max-w-2xl">
          <Eyebrow as="p">{t('alerts.eyebrow')}</Eyebrow>
          <h2 id="alerts-title" className="mt-3 font-display text-2xl font-medium text-fg sm:text-3xl">
            {t('alerts.title')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-fg-muted sm:text-base">{t('alerts.body')}</p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ol className="relative border-l border-line pl-6">
              {operationalEvents.map((event) => (
                <li key={event.id} data-reveal className="relative pb-9 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[calc(1.5rem+5px)] top-1 size-[9px] rounded-full border-2 ${DOT_TONE[event.type]}`}
                  />

                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Mono className="text-xs font-semibold text-fg-subtle">{event.time}</Mono>
                    <Eyebrow tone={TYPE_TONE[event.type]}>{t(`alerts.type.${event.type}`)}</Eyebrow>
                  </div>

                  <p className="mt-2 text-[0.9375rem] font-semibold text-fg">{event.location}</p>
                  <p className="mt-1 text-sm text-fg-muted">
                    <Mono className="font-semibold text-fg-subtle">{event.trainNumber}</Mono>{' '}
                    {event.trainName}
                  </p>

                  <p className="mt-2 flex items-baseline gap-2 text-xs text-fg-subtle">
                    {t('alerts.impact')}
                    <Mono className="text-sm font-semibold text-accent-hover">
                      +{event.impactMinutes} {t('unit.min')}
                    </Mono>
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <SourceBadge source="simulated" />
              <p className="text-xs leading-5 text-fg-subtle">{t('alerts.demoNote')}</p>
            </div>
          </div>

          <figure
            data-reveal
            className="relative order-first overflow-hidden border border-line bg-sunken lg:order-none lg:col-span-5"
          >
            <div className="aspect-[16/10] lg:h-full lg:aspect-auto">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="flex items-start justify-between gap-3 border-t border-line bg-surface px-3 py-2">
              <span className="shrink-0 font-mono text-[0.6875rem] font-semibold tracking-[var(--tracking-rail)] text-fg-subtle">
                {image.plate}
              </span>
              <span className="min-w-0 text-right text-[0.8125rem] leading-5 text-fg-muted">
                {image.caption}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
