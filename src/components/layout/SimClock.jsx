import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import { formatClock, SIM_START_MINUTES } from '../../lib/railSim'
import { cn } from '../../lib/cn'

/**
 * The technical status readout in the navbar.
 *
 * It reads the *simulation* clock, not the wall clock. It used to run its own
 * `setInterval` against `Date.now()`, which meant the one time displayed
 * permanently across the whole application was the only time on screen that
 * had nothing to do with the times every page was computed from — the navbar
 * said 14:07 while the journey page was working in the 18:30 timetable.
 *
 * Reading `minutes` from the network context also removes the last independent
 * timer outside the simulation: there is now exactly one thing in the app that
 * advances time, and everything else samples it.
 */
export function SimClock({ className }) {
  const { t } = useLanguage()
  const { minutes, controls } = useNetwork()

  return (
    <div
      className={cn(
        'hidden items-center gap-2 border-l border-line pl-3 font-mono text-[0.6875rem] xl:flex',
        className,
      )}
    >
      <span className="relative flex size-1.5 shrink-0" aria-hidden="true">
        {/* The pulse means "running" — a paused simulation must not pulse. */}
        {controls.isRunning ? (
          <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-60 motion-reduce:animate-none" />
        ) : null}
        <span
          className={cn(
            'relative block size-1.5 rounded-full',
            controls.isRunning ? 'bg-brand' : 'bg-fg-subtle',
          )}
        />
      </span>
      <span className="font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        {controls.isRunning ? t('nav.simulationActive') : t('nav.simulationPaused')}
      </span>
      <span className="tabular-nums text-fg-subtle">
        {formatClock(SIM_START_MINUTES + minutes)} IST
      </span>
    </div>
  )
}
