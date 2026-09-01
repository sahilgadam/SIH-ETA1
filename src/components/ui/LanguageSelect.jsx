import { useId } from 'react'
import { ChevronDown, Languages } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

/**
 * Native select so it behaves correctly on touch devices and with a keyboard.
 * Changing it re-renders every string on the page.
 */
export function LanguageSelect({ className }) {
  const { language, setLanguage, languages, t } = useLanguage()
  const id = useId()

  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {t('language.label')}
      </label>

      <Languages
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
        aria-hidden="true"
      />
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-fg-muted"
        aria-hidden="true"
      />

      <select
        id={id}
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className={cn(
          'h-9 cursor-pointer appearance-none rounded-md border border-line bg-surface',
          'pl-8 pr-7 text-sm font-medium text-fg transition-colors duration-150',
          'hover:bg-sunken',
        )}
      >
        {languages.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
