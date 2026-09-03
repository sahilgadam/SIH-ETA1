import { cn } from '../../lib/cn'

/**
 * The signature visual language of RailSense: a single hairline rail
 * threading a row of station nodes, each with a small manifest-style label.
 * This is the one motif reused everywhere a sequence, a route or a divider
 * needs to feel like this product rather than a generic template — a
 * process rail on a marketing section, a route rail in a journey summary,
 * or an unlabelled node row used purely as a section divider.
 *
 * `nodes` should only carry labels when the content is a genuine ordered
 * sequence (a route's stations, a real process) — for a plain divider, pass
 * nodes without `label`/`sublabel` and the rail still draws with quiet,
 * unlabelled ticks.
 *
 * `activeIndex` marks how far along the line is "live": stations before it
 * read as passed, the node at it pulses as the current position, stations
 * after it stay open. Omit it (-1) for a purely decorative rail.
 */
export function RailLine({ nodes = [], activeIndex = -1, className }) {
  if (!nodes.length) return null

  return (
    <div className={cn('relative', className)}>
      <div
        aria-hidden="true"
        className="rail-line-track pointer-events-none absolute inset-x-0 top-[4px]"
      />
      <ul className="relative flex items-start justify-between gap-2">
        {nodes.map((node, index) => {
          const state =
            activeIndex < 0
              ? undefined
              : index < activeIndex
                ? 'passed'
                : index === activeIndex
                  ? 'live'
                  : undefined

          return (
            <li
              key={node.id ?? index}
              className="flex min-w-0 flex-col items-center gap-2 text-center"
            >
              <span className="rail-node" data-state={state} aria-hidden="true" />
              {node.label ? (
                <span className="flex flex-col items-center">
                  <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                    {node.label}
                  </span>
                  {node.sublabel ? (
                    <span className="mt-0.5 text-[0.6875rem] text-fg-subtle">{node.sublabel}</span>
                  ) : null}
                </span>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
