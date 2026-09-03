import { getImage } from '../../data/imagery'
import { useLanguage } from '../../context/LanguageProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Eyebrow } from '../ui/Eyebrow'
import { RailLine } from '../ui/RailLine'

const image = getImage('bridge-crossing')

/**
 * The concept, explained rather than sold: what breaks about a schedule-only
 * ETA, what RailSense does instead, and the loop that keeps the estimate
 * current. Closes on the one full-bleed photograph this preview spends —
 * the scale-of-network image, used once.
 */
export function AboutRailSense() {
  const { t } = useLanguage()
  const containerRef = useScrollReveal()

  const loopNodes = [
    { id: 'observe', label: t('about.loopObserve') },
    { id: 'predict', label: t('about.loopPredict') },
    { id: 'update', label: t('about.loopUpdate') },
    { id: 'again', label: t('about.loopAgain') },
  ]

  return (
    <section id="about" aria-labelledby="about-title" className="border-b border-line bg-surface">
      <div ref={containerRef} className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:py-20">
        <div data-reveal className="max-w-3xl">
          <Eyebrow as="p">{t('about.eyebrow')}</Eyebrow>
          <h2
            id="about-title"
            className="mt-3 font-display text-[1.75rem] font-medium leading-tight text-fg sm:text-4xl"
          >
            {t('about.title')}
          </h2>
        </div>

        <div data-reveal className="mt-12 grid gap-x-10 gap-y-10 border-t border-line pt-10 sm:grid-cols-2">
          <div>
            <Eyebrow as="h3" tone="accent">
              {t('about.problemLabel')}
            </Eyebrow>
            <p className="mt-2.5 text-sm leading-7 text-fg-muted">{t('about.problemBody')}</p>
          </div>

          <div>
            <Eyebrow as="h3" tone="brand">
              {t('about.ideaLabel')}
            </Eyebrow>
            <p className="mt-2.5 text-sm leading-7 text-fg-muted">{t('about.ideaBody')}</p>
          </div>

          <div>
            <Eyebrow as="h3">{t('about.signalsLabel')}</Eyebrow>
            <p className="mt-2.5 text-sm leading-7 text-fg-muted">{t('about.signalsBody')}</p>
          </div>

          <div>
            <Eyebrow as="h3">{t('about.loopLabel')}</Eyebrow>
            <RailLine nodes={loopNodes} className="mt-6" />
            <p className="mt-6 text-sm leading-7 text-fg-muted">{t('about.loopBody')}</p>
          </div>
        </div>
      </div>

      <figure className="relative">
        <div className="h-[280px] sm:h-[380px]">
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
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
        />
        <figcaption className="absolute inset-x-4 bottom-3 flex items-center gap-2 sm:inset-x-6 sm:bottom-4">
          <span className="font-mono text-[0.6875rem] font-semibold tracking-[var(--tracking-rail)] text-white/80">
            {image.plate}
          </span>
          <span className="text-[0.8125rem] text-white/90">{image.caption}</span>
        </figcaption>
      </figure>
    </section>
  )
}
