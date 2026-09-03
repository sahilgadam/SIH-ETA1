import { lazy, Suspense } from 'react'
import { Crosshair, Maximize2, Pause, Play, RotateCcw } from 'lucide-react'
import { useLanguage } from '../context/LanguageProvider'
import { SIM_SPEEDS, useNetwork } from '../context/NetworkProvider'
import { useSelection } from '../context/SelectionProvider'
import { formatClock, SIM_START_MINUTES } from '../lib/railSim'
import { ServiceList } from '../components/live/ServiceList'
import { StationPanel } from '../components/live/StationPanel'
import { StationTimeline } from '../components/live/StationTimeline'
import { Eyebrow } from '../components/ui/Eyebrow'

// MapLibre and its CSS are ~250 kB and only this screen needs them.
const RailMap = lazy(() =>
  import('../components/map/RailMap').then((m) => ({ default: m.RailMap })),
)

/**
 * Live Status — the map-first operations screen.
 *
 * Map dominates, one panel beside it (§18). That panel is a single slot that
 * shows whichever thing is selected: the fleet by default, one service's route
 * when a train is chosen, one station's board when a station is. Keeping it to
 * one slot is what stops this becoming a dashboard grid.
 */

function MapFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-sunken">
      {/* fg-muted, not fg-subtle: the subtle step lands at 4.47:1 on the
          sunken surface, a hair under AA. */}
      <p className="font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        Syncing train positions…
      </p>
    </div>
  )
}

function Metric({ label, value, unit }) {
  return (
    <div>
      <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-fg">
        {value}
        {unit ? <span className="ml-1 text-[0.625rem] font-normal text-fg-subtle">{unit}</span> : null}
      </p>
    </div>
  )
}

export function LiveStatus() {
  const { t } = useLanguage()
  const { trains, summary, minutes, controls, prefersReducedMotion } = useNetwork()
  const {
    selectedTrain,
    selectedStation,
    highlightedStop,
    followSelected,
    setFollowSelected,
    selectTrain,
    focusStation,
    clear,
  } = useSelection()

  const train = trains.find((item) => item.number === selectedTrain) ?? null

  return (
    <section className="border-b border-line bg-page">
      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5">
        {/* Header ---------------------------------------------------------- */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-3">
          <div>
            <Eyebrow as="h1">{t('live.title')}</Eyebrow>
            <p className="mt-1.5 max-w-lg text-sm text-fg-muted">{t('live.subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-end gap-4 sm:gap-6">
            <Metric label={t('live.running')} value={`${summary.running}/${summary.total}`} />
            <Metric label={t('live.avgDelay')} value={summary.avgDelay.toFixed(1)} unit="min" />
            <Metric label={t('live.avgSpeed')} value={summary.avgSpeed} unit="km/h" />
            <div className="border-l border-line pl-4 sm:pl-6">
              <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
                Simulated IST
              </p>
              <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-brand-text">
                {formatClock(SIM_START_MINUTES + minutes)}
              </p>
            </div>
          </div>
        </div>

        {/* Map + panel ----------------------------------------------------- */}
        <div className="mt-3 grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="relative h-[26rem] overflow-hidden border border-line sm:h-[32rem] lg:h-[38rem]">
              <Suspense fallback={<MapFallback />}>
                <RailMap
                  className="absolute inset-0"
                  selectedTrain={selectedTrain}
                  followSelected={followSelected}
                  onSelectTrain={(number) => selectTrain(number)}
                  onSelectStation={(code) => focusStation(code)}
                />
              </Suspense>
            </div>

            {/* Controls: few, and all of them do something (§8). */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={controls.toggle}
                  disabled={prefersReducedMotion}
                  aria-label={controls.isRunning ? t('net.pause') : t('net.play')}
                  className="flex items-center gap-1.5 border border-line px-2 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg transition-colors hover:border-brand disabled:opacity-40"
                >
                  {controls.isRunning ? <Pause className="size-3" /> : <Play className="size-3" />}
                  {controls.isRunning ? t('net.pause') : t('net.play')}
                </button>

                <div className="flex" role="group" aria-label={t('net.speed')}>
                  {SIM_SPEEDS.map((value, i) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => controls.setSpeed(value)}
                      aria-pressed={controls.speed === value}
                      className={`border px-2 py-1.5 font-mono text-[0.5625rem] transition-colors ${
                        controls.speed === value
                          ? 'border-fg bg-fg text-page'
                          : 'border-line text-fg-subtle hover:text-fg'
                      } ${i > 0 ? '-ml-px' : ''}`}
                    >
                      {value}×
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setFollowSelected((v) => !v)}
                  disabled={!selectedTrain}
                  aria-pressed={followSelected}
                  className={`flex items-center gap-1.5 border px-2 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] transition-colors disabled:opacity-40 ${
                    followSelected ? 'border-brand bg-brand-soft text-brand-text' : 'border-line text-fg-muted hover:text-fg'
                  }`}
                >
                  <Crosshair className="size-3" aria-hidden="true" />
                  Follow
                </button>

                <button
                  type="button"
                  onClick={clear}
                  disabled={!selectedTrain && !selectedStation}
                  className="flex items-center gap-1.5 border border-line px-2 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted transition-colors hover:text-fg disabled:opacity-40"
                >
                  <RotateCcw className="size-3" aria-hidden="true" />
                  Reset view
                </button>
              </div>

              <p className="flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
                <Maximize2 className="size-3" aria-hidden="true" />
                Simulated positions · demo data
              </p>
            </div>
          </div>

          {/* One panel slot, three states. */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="h-[26rem] overflow-hidden border border-line bg-surface sm:h-[32rem] lg:h-[38rem]">
              {train ? (
                <StationTimeline
                  train={train}
                  highlightedStop={highlightedStop}
                  onBack={clear}
                  onSelectStation={(code) => focusStation(code)}
                />
              ) : selectedStation ? (
                <StationPanel
                  code={selectedStation}
                  trains={trains}
                  onBack={clear}
                  onSelectTrain={(number) => selectTrain(number)}
                />
              ) : (
                <ServiceList
                  trains={trains}
                  selectedTrain={selectedTrain}
                  onSelect={(number) => (number ? selectTrain(number) : clear())}
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
