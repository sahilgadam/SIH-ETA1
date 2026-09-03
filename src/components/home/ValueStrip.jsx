import { valueProps } from '../../data/content'
import { useLanguage } from '../../context/LanguageProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'

/**
 * What the product does, as a stacked ledger of full-width rows — never a
 * grid of four floating feature cards. Each row reads left to right like a
 * manifest entry: an index, an icon, a name, then the explanation.
 */
export function ValueStrip() {
  const { t } = useLanguage()
  const containerRef = useScrollReveal()

  return (
    <section aria-labelledby="value-title" className="border-b border-line bg-surface">
      <div ref={containerRef} className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:py-14">
        <Eyebrow as="h2" id="value-title" data-reveal>
          {t('value.eyebrow')}
        </Eyebrow>

        <ul className="mt-5 border-t border-line">
          {valueProps.map((item, index) => {
            const Icon = item.icon
            return (
              <li
                key={item.id}
                id={item.id}
                data-reveal
                className="scroll-mt-24 border-b border-line py-6 sm:grid sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-7"
              >
                <div className="flex items-center gap-3 sm:col-span-4 lg:col-span-3">
                  <Mono className="text-xs text-fg-subtle">{String(index + 1).padStart(2, '0')}</Mono>
                  <Icon className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-fg sm:text-base">{t(item.titleKey)}</h3>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-fg-muted sm:col-span-8 sm:mt-0 lg:col-span-9">
                  {t(item.bodyKey)}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
