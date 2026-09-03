import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Eyebrow } from '../ui/Eyebrow'

/**
 * The closing statement.
 *
 * A dark railway-green band that restates the product's one claim and offers
 * the two things a passenger actually wants next — the live map, or the
 * timetable. Set as an editorial sign-off rather than a marketing panel with
 * a gradient and a rounded button.
 */
export function FinalCta({ onOpenLive, onOpenTrains }) {
  const { t } = useLanguage()
  const containerRef = useScrollReveal()

  return (
    <section className="bg-ground-deep text-on-deep">
      <div ref={containerRef} className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div data-reveal className="lg:col-span-7">
            <Eyebrow as="p" className="text-brass-bright">
              {t('cta.eyebrow')}
            </Eyebrow>
            <p className="mt-4 max-w-[18ch] font-display text-[2.25rem] font-medium leading-[1.06] text-on-deep sm:text-[3rem]">
              {t('cta.title')}
            </p>
            <p className="mt-5 max-w-md text-sm leading-6 text-on-deep-muted">{t('cta.body')}</p>
          </div>

          <div data-reveal className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <button
              type="button"
              onClick={onOpenLive}
              className="flex items-center gap-2 border border-brass bg-brass/15 px-4 py-2.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-brass-bright transition-colors hover:bg-brass/25"
            >
              {t('cta.live')}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onOpenTrains}
              className="flex items-center gap-2 border border-on-deep-line px-4 py-2.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-on-deep transition-colors hover:border-brass"
            >
              {t('cta.trains')}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* A single running rail as the sign-off rule. */}
        <div className="mt-12 h-px w-full bg-on-deep-line" aria-hidden="true" />
        <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-on-deep-muted">
          {t('cta.note')}
        </p>
      </div>
    </section>
  )
}
