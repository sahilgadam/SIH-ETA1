import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

/** Signed delay in minutes: "+8 min", "On time", "-2 min". */
export function DelayBadge({ minutes, size = 'md', className }) {
  const { t } = useLanguage()

  const isLate = minutes > 0
  const isEarly = minutes < 0

  return (
    <span
      className={cn(
        'inline-flex items-center rounded font-semibold tabular-nums',
        size === 'sm' ? 'px-1 py-px text-[0.6875rem]' : 'px-1.5 py-0.5 text-xs',
        isLate && 'bg-danger-soft text-danger',
        isEarly && 'bg-brand-soft text-brand',
        !isLate && !isEarly && 'bg-sunken text-fg-muted',
        className,
      )}
    >
      {isLate ? `+${minutes} ${t('unit.min')}` : null}
      {isEarly ? `${minutes} ${t('unit.min')}` : null}
      {!isLate && !isEarly ? t('status.onTime') : null}
    </span>
  )
}
