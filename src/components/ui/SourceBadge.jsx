import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { getSource } from '../../lib/trust'

const TONES = {
  confirmed: 'text-brand',
  predicted: 'text-accent',
  simulated: 'text-caution',
  unavailable: 'text-fg-subtle',
}

/**
 * Says where one figure came from. Uses a dot *and* a word, never colour alone,
 * so it still reads without colour vision or in a monochrome print.
 */
export function SourceBadge({ source, className }) {
  const { t } = useLanguage()
  const entry = getSource(source)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[0.6875rem] font-medium',
        TONES[entry.tone],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
      {t(entry.labelKey)}
    </span>
  )
}
