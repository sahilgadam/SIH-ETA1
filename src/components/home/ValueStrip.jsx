import { valueProps } from '../../data/content'
import { useLanguage } from '../../context/LanguageProvider'

/**
 * A single band explaining what the product does. Deliberately not four
 * floating feature cards — one surface, thin dividers, one line of copy each.
 */
export function ValueStrip() {
  const { t } = useLanguage()

  return (
    <section aria-labelledby="value-title" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <h2
          id="value-title"
          className="text-xs font-semibold uppercase tracking-wide text-fg-subtle"
        >
          {t('value.eyebrow')}
        </h2>

        <ul className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {valueProps.map((item) => {
            const Icon = item.icon
            return (
              <li
                key={item.id}
                id={item.id}
                className="scroll-mt-24 lg:px-6 lg:first:pl-0 lg:last:pr-0"
              >
                <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
                  <Icon className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  {t(item.titleKey)}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-fg-muted">{t(item.bodyKey)}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
