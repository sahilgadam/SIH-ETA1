import { ArrowLeft } from 'lucide-react'
import { callsAtStation, formatClock, stationByCode } from '../../lib/railSim'
import { Mono } from '../ui/Mono'

/**
 * A station's board (§7).
 *
 * Approaching, standing and recently departed services, each with its booked
 * and predicted time here — read from the same propagated chain the timeline
 * uses, so a train that is nine late on its own page is nine late on the
 * board too.
 */

const STATE_LABEL = {
  past: 'Departed',
  current: 'At platform',
  next: 'Approaching',
  upcoming: 'Due',
}

export function StationPanel({ code, trains, onBack, onSelectTrain }) {
  const station = stationByCode.get(code)
  if (!station) return null

  const calls = callsAtStation(code, trains)
  const upcoming = calls.filter((c) => c.state !== 'past')
  const departed = calls.filter((c) => c.state === 'past').slice(-4)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-line p-3">
        <div className="min-w-0">
          <Mono className="text-lg font-bold leading-none text-fg">{station.code}</Mono>
          <p className="mt-1 truncate text-[0.6875rem] text-fg-muted">{station.name}</p>
          <p className="mt-1 font-mono text-[0.625rem] text-fg-subtle">
            {upcoming.length} due · {station.trains.length} services call here
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

      <div className="min-h-0 flex-1 overflow-y-auto">
        <p className="border-b border-line bg-sunken px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
          Live departures
        </p>

        {upcoming.length ? (
          <ul className="divide-y divide-line">
            {upcoming.map(({ train, stop, predicted, booked, state }) => (
              <li key={train.number}>
                <button
                  type="button"
                  onClick={() => onSelectTrain(train.number)}
                  className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-sunken"
                >
                  <Mono className="text-sm font-bold text-fg">{train.number}</Mono>

                  <span className="min-w-0">
                    <span className="block truncate text-[0.6875rem] text-fg-muted">{train.name}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
                      {STATE_LABEL[state]}
                      <span className="opacity-50">·</span>
                      to {train.destination.code}
                    </span>
                  </span>

                  <span className="text-right">
                    <Mono className="block text-sm font-semibold tabular-nums text-fg">
                      {formatClock(predicted)}
                    </Mono>
                    <span
                      className={`font-mono text-[0.5625rem] tabular-nums ${
                        stop.delayMin > 0 ? 'text-caution' : 'text-brand-text'
                      }`}
                    >
                      {stop.delayMin > 0 ? `+${stop.delayMin}m · bkd ${formatClock(booked)}` : 'On time'}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-3 py-8 text-center">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg">
              Nothing further due
            </p>
            <p className="mt-1 text-xs text-fg-subtle">The board is quiet at this station.</p>
          </div>
        )}

        {departed.length ? (
          <>
            <p className="border-y border-line bg-sunken px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
              Recently departed
            </p>
            <ul className="divide-y divide-line">
              {departed.map(({ train, predicted }) => (
                <li key={train.number}>
                  <button
                    type="button"
                    onClick={() => onSelectTrain(train.number)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-fg-subtle transition-colors hover:bg-sunken"
                  >
                    <span className="flex min-w-0 items-baseline gap-2">
                      <Mono className="text-xs font-semibold">{train.number}</Mono>
                      <span className="truncate text-[0.625rem]">{train.name}</span>
                    </span>
                    <Mono className="shrink-0 text-xs tabular-nums">{formatClock(predicted)}</Mono>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <p className="border-t border-line px-3 py-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        Simulated board · no platform feed
      </p>
    </div>
  )
}
