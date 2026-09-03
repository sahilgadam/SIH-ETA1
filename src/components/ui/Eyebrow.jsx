import { cn } from '../../lib/cn'

// Small, uppercase, always under 12px — WCAG's "large text" contrast
// exemption never applies here, so these use the darker -hover step of each
// hue rather than the base token used for buttons and larger surfaces.
const TONES = {
  muted: 'text-fg-subtle',
  brand: 'text-brand-text',
  accent: 'text-accent-hover',
  fg: 'text-fg-muted',
}

/**
 * A small, wide-tracked technical label in the mono face — the station-board
 * / manifest-header voice used for section kickers, panel headings and
 * operational context. Not a decoration: it should always name something
 * true about the content beside it.
 */
export function Eyebrow({ as: Tag = 'p', tone = 'muted', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'font-mono text-[0.6875rem] font-semibold uppercase leading-none',
        'tracking-[var(--tracking-rail)]',
        TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
