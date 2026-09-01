import { CircleCheck, CircleDot, Circle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

const CONFIG = {
  completed: { icon: CircleCheck, labelKey: 'status.completed', className: 'text-brand' },
  current: { icon: CircleDot, labelKey: 'status.current', className: 'text-accent' },
  upcoming: { icon: Circle, labelKey: 'status.upcoming', className: 'text-fg-subtle' },
}

/** Station progress: passed, currently here, or still ahead. */
export function StatusBadge({ status, showLabel = true, className }) {
  const { t } = useLanguage()
  const config = CONFIG[status] ?? CONFIG.upcoming
  const Icon = config.icon

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs', config.className, className)}>
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {showLabel ? t(config.labelKey) : <span className="sr-only">{t(config.labelKey)}</span>}
    </span>
  )
}
