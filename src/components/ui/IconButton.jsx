import { cn } from '../../lib/cn'

/** Square, icon-only control. `label` becomes the accessible name. */
export function IconButton({ label, className, children, type = 'button', ...props }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-md',
        'border border-line text-fg-muted transition-colors duration-150',
        'hover:bg-sunken hover:text-fg active:bg-sunken',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
