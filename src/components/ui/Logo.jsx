import { cn } from '../../lib/cn'
import { useLanguage } from '../../context/LanguageProvider'

/** RailSense wordmark: a rail-track glyph plus the name. */
export function Logo({ className, showTagline = false }) {
  const { t } = useLanguage()

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-md bg-brand"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M8 4h8a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 16 17H8a2.5 2.5 0 0 1-2.5-2.5v-8A2.5 2.5 0 0 1 8 4Z"
            stroke="var(--brand-fg)"
            strokeWidth="1.6"
          />
          <path d="M5.5 9.5h13M9 20l-1.5-3M15 20l1.5-3" stroke="var(--brand-fg)" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="9.25" cy="13.25" r="1.05" fill="var(--brand-fg)" />
          <circle cx="14.75" cy="13.25" r="1.05" fill="var(--brand-fg)" />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-bold tracking-tight text-fg">
          Rail<span className="text-brand">Sense</span>
        </span>
        {showTagline ? (
          <span className="mt-1 text-xs text-fg-muted">{t('brand.tagline')}</span>
        ) : null}
      </span>
    </span>
  )
}
