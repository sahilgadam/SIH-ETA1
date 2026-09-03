import { cn } from '../../lib/cn'

/**
 * The one wrapper every photograph in the editorial layer should go
 * through. A thin frame (never a rounded, shadowed "card"), an optional
 * plate/caption strip so a photo can always carry its purpose instead of
 * sitting in the layout unexplained, and a restrained hover pan — no
 * floating, no glow.
 */
export function EditorialFigure({
  src,
  alt,
  caption,
  plate,
  ratio = '4 / 5',
  priority = false,
  className,
  imgClassName,
}) {
  return (
    <figure className={cn('group relative overflow-hidden border border-line bg-sunken', className)}>
      <div className="overflow-hidden" style={{ aspectRatio: ratio }}>
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'h-full w-full object-cover',
            'transition-transform duration-[var(--motion-slow)] ease-[var(--ease-rail)]',
            'motion-safe:group-hover:scale-[1.035]',
            imgClassName,
          )}
        />
      </div>

      {caption || plate ? (
        <figcaption className="flex items-start justify-between gap-3 border-t border-line bg-surface px-3 py-2">
          {plate ? (
            <span className="shrink-0 font-mono text-[0.6875rem] font-semibold tracking-[var(--tracking-rail)] text-fg-subtle">
              {plate}
            </span>
          ) : null}
          {caption ? (
            <span className="min-w-0 text-right text-[0.8125rem] leading-5 text-fg-muted">
              {caption}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
