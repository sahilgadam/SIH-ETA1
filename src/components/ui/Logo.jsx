import { cn } from '../../lib/cn'
import { useLanguage } from '../../context/LanguageProvider'

/**
 * RailSense wordmark: a thin-bordered instrument mark — two rails, three
 * sleeper ticks, one signal node — rather than an icon dropped into a
 * solid colour tile. The mark is a miniature of the RailLine motif used
 * everywhere else, so the brand and the signature visual language are
 * literally the same shape.
 */
export function Logo({ className, showTagline = false }) {
  const { t } = useLanguage()

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-sm border border-line-strong bg-surface"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path d="M4 8h16M4 16h16" stroke="var(--fg)" strokeWidth="1.4" strokeLinecap="round" />
          <path
            d="M7.5 8v8M12 8v8M16.5 8v8"
            stroke="var(--line-strong)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="16.5" cy="12" r="2.1" fill="var(--brand)" />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.1875rem] font-medium tracking-tight text-fg">
          Rail<span className="text-brand-text">Sense</span>
        </span>
        {showTagline ? (
          <span className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            {t('brand.tagline')}
          </span>
        ) : null}
      </span>
    </span>
  )
}
