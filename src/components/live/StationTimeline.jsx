import { ArrowLeft } from 'lucide-react'
import { formatClock } from '../../lib/railSim'
import { Mono } from '../ui/Mono'

/**
 * The selected service's whole route (§5).
 *
 * Every call shows its booked time, its predicted time and the variance, and
 * the three states — already called, here now, still ahead — are carried by
 * the node's shape and weight as well as by colour. The delays down this list
 * are not independent guesses: they are one propagated chain from the
 * departure delay, which is why a train that recovers shows the variance
 * shrinking as you read down.
 */

function Node({ state }) {
  if (state === 'past') {
    return <span className="relative z-10 block size-2.5 rounded-full bg-fg-subtle" aria-hidden="true" />
  }
  if (state === 'current') {
    return (
      <span className="relative z-10 flex size-3.5 items-center justify-center" aria-hidden="true">
        <span className="absolute inline-flex size-full rounded-full bg-danger opacity-40 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2.5 rounded-full bg-danger" />
      </span>
    )
  }
  if (state === 'next') {
    return (
      <span
        className="relative z-10 block size-2.5 rounded-full border-2 border-danger bg-page"
        aria-hidden="true"
      />
    )
  }
  return (
    <span
      className="relative z-10 block size-2.5 rounded-full border border-line-strong bg-page"
      aria-hidden="true"
    />
  )
}

export function StationTimeline({ train, highlightedStop, onBack, onSelectStation }) {
  if (!train) return null

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-line p-3">
        <div className="min-w-0">
          <Mono className="text-lg font-bold leading-none text-fg">{train.number}</Mono>
          <p className="mt-1 truncate text-[0.6875rem] text-fg-muted">{train.name}</p>
          <p className="mt-1 font-mono text-[0.625rem] text-fg-subtle">
            {train.origin.code} → {train.destination.code}
            <span className="mx-1.5 opacity-50">·</span>
            {train.category}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center gap-1 border border-line px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted transition-colors hover:border-brand hover:text-fg"
        >
          <ArrowLeft className="size-3" aria-hidden="true" />
          All
        </button>
      </div>

      <dl className="grid grid-cols-3 gap-2 border-b border-line p-3">
        {[
          { label: 'Speed', value: train.phase === 'dwell' ? 'At stand' : `${train.speedKmh} km/h` },
          { label: 'Delay', value: train.delayMin > 0 ? `+${train.delayMin} min` : 'On time' },
          { label: 'Into ' + train.destination.code, value: formatClock(train.etaMinutes) },
        ].map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
              {item.label}
            </dt>
            <dd className="mt-0.5 truncate font-mono text-sm font-semibold tabular-nums text-fg">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {train.section ? (
        <p className="border-b border-line px-3 py-2 font-mono text-[0.625rem] text-fg-subtle">
          Section {train.section.from.code}–{train.section.to.code}
          <span className="mx-1.5 opacity-50">·</span>
          {train.section.km} km
          <span className="mx-1.5 opacity-50">·</span>
          booked {train.section.bookedRunMin}m, running {train.section.currentRunMin}m
          <span className="mx-1.5 opacity-50">·</span>
          <span
            className={
              train.section.signal === 'red'
                ? 'text-danger'
                : train.section.signal === 'amber'
                  ? 'text-caution'
                  : 'text-brand-text'
            }
          >
            signal {train.section.signal}
          </span>
        </p>
      ) : null}

      <ol className="relative min-h-0 flex-1 overflow-y-auto p-3">
        {/* The rail the nodes thread onto. */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-[1.06rem] top-3 w-px bg-line-strong"
        />

        {train.timeline.map((stop) => {
          const highlighted = highlightedStop === stop.code
          const booked = stop.bookedArrMin ?? stop.bookedDepMin
          const predicted = stop.predictedArrMin ?? stop.predictedDepMin

          return (
            <li key={stop.code} className="relative flex gap-3 py-2">
              <span className="mt-1 flex w-3.5 shrink-0 justify-center">
                <Node state={stop.state} />
              </span>

              <button
                type="button"
                onClick={() => onSelectStation?.(stop.code)}
                className={`min-w-0 flex-1 border px-2 py-1.5 text-left transition-colors ${
                  highlighted
                    ? 'border-brand bg-brand-soft'
                    : 'border-transparent hover:border-line hover:bg-sunken'
                }`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0">
                    <Mono
                      className={`text-xs font-bold ${stop.state === 'past' ? 'text-fg-subtle' : 'text-fg'}`}
                    >
                      {stop.code}
                    </Mono>
                    <span className="ml-2 truncate text-[0.6875rem] text-fg-muted">{stop.name}</span>
                  </span>

                  <span className="shrink-0 text-right">
                    <Mono
                      className={`block text-xs font-semibold tabular-nums ${
                        stop.state === 'past' ? 'text-fg-subtle' : 'text-fg'
                      }`}
                    >
                      {formatClock(predicted)}
                    </Mono>
                    <span className="font-mono text-[0.5625rem] tabular-nums text-fg-subtle">
                      {formatClock(booked)}
                    </span>
                  </span>
                </span>

                <span className="mt-0.5 flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)]">
                  <span className="text-fg-subtle">
                    {stop.state === 'past'
                      ? 'Departed'
                      : stop.state === 'current'
                        ? 'Here now'
                        : stop.state === 'next'
                          ? 'Next'
                          : 'Ahead'}
                  </span>
                  <span className={stop.delayMin > 0 ? 'text-caution' : 'text-brand-text'}>
                    {stop.delayMin > 0 ? `+${stop.delayMin} min` : 'On time'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <p className="border-t border-line px-3 py-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        Predicted times · simulated demo data
      </p>
    </div>
  )
}
