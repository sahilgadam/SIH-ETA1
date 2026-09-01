import { cn } from '../../lib/cn'

export const fieldLabel =
  'block text-xs font-semibold uppercase tracking-wide text-fg-muted'

/** Shared input shell so every field in the page lines up exactly. */
export function fieldInput({ invalid, hasIcon, className } = {}) {
  return cn(
    'h-12 w-full rounded-md border bg-surface text-[0.9375rem] text-fg',
    'placeholder:text-fg-subtle transition-colors duration-150',
    'hover:border-line-strong',
    hasIcon ? 'pl-10 pr-3' : 'px-3',
    invalid ? 'border-danger' : 'border-line',
    className,
  )
}

export const fieldIcon =
  'pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle'
