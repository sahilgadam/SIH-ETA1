import { cn } from '../../lib/cn'

/**
 * Inline monospace treatment for operational values — train numbers,
 * timestamps, coordinates, distances. Tabular figures so a column of these
 * never jitters, and tight tracking so digits read as one instrument
 * reading rather than loose prose.
 */
export function Mono({ as: Tag = 'span', className, children }) {
  return <Tag className={cn('font-mono tabular-nums tracking-tight', className)}>{children}</Tag>
}
