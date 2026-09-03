import { MessageSquareText } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

/**
 * The whole forecast in plain language (§22).
 *
 * Composed in `getPassengerSummary` from the same forecast every panel above
 * uses, so it cannot say something the numbers contradict. Nothing here is a
 * hardcoded sentence — the connection line only appears once a connection has
 * actually been assessed.
 */
export function PassengerSummary({ sentences, className }) {
  const { t } = useLanguage()

  return (
    <section
      aria-labelledby="summary-title"
      className={cn('rounded-lg border border-line bg-brand-soft p-5', className)}
    >
      <h2 id="summary-title" className="flex items-center gap-2 text-base font-bold text-fg">
        <MessageSquareText className="size-4 shrink-0 text-brand" aria-hidden="true" />
        {t('summary.title')}
      </h2>

      <p className="mt-3 text-[0.9375rem] leading-7 text-fg">
        {sentences
          .map(({ key, params }) =>
            // The dominant cause arrives as a translation key so the summary
            // and the "Why this ETA?" row always name it the same way.
            t(key, params.causeKey ? { ...params, cause: t(params.causeKey) } : params),
          )
          .join(' ')}
      </p>
    </section>
  )
}
