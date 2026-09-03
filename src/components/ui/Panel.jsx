import { cn } from '../../lib/cn'

const TONES = {
  surface: 'bg-surface',
  sunken: 'bg-sunken',
  page: 'bg-page',
}

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
}

/**
 * The one bordered container every panel, form and info card should build
 * from, replacing the hand-rolled "rounded-lg border border-line bg-surface
 * p-5" recipe repeated across the app. Near-square by design — the radius
 * comes from the token scale in index.css, not from this component.
 */
export function Panel({
  as: Tag = 'div',
  tone = 'surface',
  padding = 'md',
  bordered = true,
  elevated = false,
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        'rounded-sm',
        bordered && 'border border-line',
        elevated && 'shadow-sm',
        TONES[tone],
        PADDING[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
