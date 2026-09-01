import { useLanguage } from '../../context/LanguageProvider'

/** Hidden until focused, then jumps keyboard users straight to the search. */
export function SkipLink() {
  const { t } = useLanguage()

  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
    >
      {t('nav.skip')}
    </a>
  )
}
