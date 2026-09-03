import { getImage } from '../../data/imagery'
import { useLanguage } from '../../context/LanguageProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Eyebrow } from '../ui/Eyebrow'

const image = getImage('converging-tracks')

/**
 * A full-bleed editorial break, not another bordered panel: the photograph
 * runs to the true edge of the viewport on one side, the copy sits in a
 * narrow, book-like column on the other.
 */
export function DelayPropagation() {
  const { t } = useLanguage()
  const containerRef = useScrollReveal()

  return (
    <section aria-labelledby="propagation-title" className="border-b border-line bg-surface">
      <div ref={containerRef} className="grid lg:grid-cols-2">
        <div
          data-reveal
          className="relative order-2 aspect-[4/3] overflow-hidden bg-sunken lg:order-1 lg:aspect-auto lg:min-h-[420px]"
        >
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="order-1 flex items-center px-4 py-12 sm:px-6 lg:order-2 lg:px-16 lg:py-0">
          <div data-reveal className="max-w-[30rem]">
            <Eyebrow as="p">{t('propagation.eyebrow')}</Eyebrow>
            <h2
              id="propagation-title"
              className="mt-3 font-display text-2xl font-medium leading-tight text-fg sm:text-3xl"
            >
              {t('propagation.title')}
            </h2>
            <p className="mt-4 text-sm leading-7 text-fg-muted sm:text-base">
              {t('propagation.body1')}
            </p>
            <p className="mt-3 text-sm leading-7 text-fg-muted sm:text-base">
              {t('propagation.body2')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
