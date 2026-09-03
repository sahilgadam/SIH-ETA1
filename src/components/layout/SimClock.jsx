import { useLanguage } from '../../context/LanguageProvider'
import { useClock } from '../../hooks/useClock'
import { cn } from '../../lib/cn'

/**
 * The small technical status readout in the navbar: a live IST clock behind
 * a "simulation active" dot.
 */
export function SimClock({ className }) {
  const { t } = useLanguage()
  const now = useClock()

  return (
    <div
      className={cn(
        'hidden items-center gap-2 border-l border-line pl-3 font-mono text-[0.6875rem] xl:flex',
        className,
      )}
    >
      <span className="relative flex size-1.5 shrink-0" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-60 motion-reduce:animate-none" />
        <span className="relative block size-1.5 rounded-full bg-brand" />
      </span>
      <span className="font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        {t('nav.simulationActive')}
      </span>
      <span className="tabular-nums text-fg-subtle">{now} IST</span>
    </div>
  )
}
