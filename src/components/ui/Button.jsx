import { cn } from '../../lib/cn'

const VARIANTS = {
  primary:
    'bg-brand text-brand-fg border border-transparent hover:bg-brand-hover active:bg-brand-hover',
  secondary:
    'bg-surface text-fg border border-line-strong hover:bg-sunken hover:border-fg active:bg-sunken',
  ghost:
    'bg-transparent text-fg-muted border border-transparent hover:bg-sunken hover:text-fg active:bg-sunken',
}

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-5 text-[0.9375rem] gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-sm font-semibold tracking-tight',
        'transition-[background-color,border-color,color] duration-[var(--motion-fast)] ease-[var(--ease-snap)]',
        'active:translate-y-px',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
