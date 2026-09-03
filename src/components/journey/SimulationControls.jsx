import { Pause, Play, RotateCcw } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { SIMULATION_SPEEDS } from '../../hooks/useSimulation'
import { SourceBadge } from '../ui/SourceBadge'

/**
 * Demo playback for the journey screen.
 *
 * Deliberately one quiet strip rather than a control panel: the passenger
 * information is the product, and this only exists so the forecast can be
 * watched evolving. It carries the `Simulated` trust label because that is
 * exactly what pressing play produces.
 */
export function SimulationControls({ controls, elapsedMinutes, className }) {
  const { t } = useLanguage()
  const { isRunning, speed, setSpeed, start, pause, reset, hasArrived } = controls

  const hours = Math.floor(elapsedMinutes / 60)
  const minutes = Math.floor(elapsedMinutes % 60)
  const clock = `${hours > 0 ? `${hours}h ` : ''}${minutes}m`

  return (
    <section
      aria-labelledby="simulation-title"
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-line bg-sunken px-4 py-3',
        className,
      )}
    >
      <h2 id="simulation-title" className="text-sm font-semibold text-fg">
        {t('sim.title')}
      </h2>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={isRunning ? pause : start}
          disabled={hasArrived && !isRunning}
          className={cn(
            'inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold',
            'transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50',
            isRunning
              ? 'border border-line-strong bg-surface text-fg hover:bg-sunken'
              : 'bg-brand text-brand-fg hover:bg-brand-hover',
          )}
        >
          {isRunning ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
          {isRunning ? t('sim.pause') : t('sim.start')}
        </button>

        <button
          type="button"
          onClick={reset}
          disabled={elapsedMinutes === 0}
          className={cn(
            'inline-flex h-9 items-center gap-1.5 rounded-md border border-line-strong bg-surface px-3',
            'text-sm font-semibold text-fg transition-colors duration-150 hover:bg-sunken',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {t('sim.reset')}
        </button>
      </div>

      <div
        role="group"
        aria-label={t('sim.speedLabel')}
        className="flex items-center gap-0.5 rounded-md border border-line-strong bg-surface p-0.5"
      >
        {SIMULATION_SPEEDS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSpeed(option)}
            aria-pressed={speed === option}
            className={cn(
              'h-8 rounded px-2.5 text-xs font-semibold tabular-nums transition-colors duration-150',
              speed === option ? 'bg-brand text-brand-fg' : 'text-fg-muted hover:bg-sunken hover:text-fg',
            )}
          >
            {option}×
          </button>
        ))}
      </div>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
        <span aria-live="polite">
          {hasArrived
            ? t('sim.arrived')
            : elapsedMinutes > 0
              ? t('sim.elapsed', { clock })
              : t('sim.idle')}
        </span>
        <SourceBadge source="simulated" />
      </p>
    </section>
  )
}
