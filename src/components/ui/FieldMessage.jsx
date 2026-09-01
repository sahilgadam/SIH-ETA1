import { CircleAlert, Info } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Inline feedback under a form. `tone="error"` announces assertively,
 * `tone="info"` politely.
 */
export function FieldMessage({ id, tone = 'error', children, className }) {
  if (!children) return null

  const isError = tone === 'error'
  const Icon = isError ? CircleAlert : Info

  return (
    <p
      id={id}
      role={isError ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-1.5 text-sm leading-5',
        isError ? 'text-danger' : 'text-fg-muted',
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
