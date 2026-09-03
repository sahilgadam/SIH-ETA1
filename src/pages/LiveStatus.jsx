import { lazy, Suspense } from 'react'
import { Crosshair, Pause, Play, RotateCcw } from 'lucide-react'
import { useLanguage } from '../context/LanguageProvider'
import { SIM_SPEEDS, useNetwork } from '../context/NetworkProvider'
import { useSelection } from '../context/SelectionProvider'
import { formatClock, SIM_START_MINUTES } from '../lib/railSim'
import { ServiceList } from '../components/live/ServiceList'
import { StationPanel } from '../components/live/StationPanel'
import { TrainFocus } from '../components/live/TrainFocus'
import { Eyebrow } from '../components/ui/Eyebrow'

// MapLibre and its CSS are ~250 kB and only the map screens need them.
const RailMap = lazy(() =>
  import('../components/map/RailMap').then((m) => ({ default: m.RailMap })),
)

/**
 * Live Status, in two modes.
 *
 * NETWORK   the whole railway: a wide map with the running order beneath it.
 *           The old summary strip (running / mean delay / mean speed) is gone
 *           — averages across a fleet are not what anyone opens a tracker to
 *           read, and the space now carries the map and the services instead.
 *
 * FOCUSED   one service: the map halves and an information panel takes the
 *           other half. Every other train leaves the map, so the passenger is
 *           looking at their journey rather than at the network with their
 *           journey somewhere in it.
 *
 * Both modes read the same simulation and the same selection, so entering and
 * leaving focus changes only the framing, never the facts.
 */

function MapFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-sunken">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        Syncing train positions…
      </p>
    </div>
  )
}

/** Simulation transport + the map's few genuinely useful controls (§23). */
function MapControls({ focused }) {
  const { t } = useLanguage()
  const { controls, prefersReducedMotion, minutes } = useNetwork()
  const { selectedTrain, followSelected, setFollowSelected, clear } = useSelection()

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface px-2.5 py-2">
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

        {focused ? (
          <button
            type="button"
            onClick={() => setFollowSelected((v) => !v)}
            aria-pressed={followSelected}
            className={`flex items-center gap-1.5 border px-2 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] transition-colors ${
              followSelected
                ? 'border-brand bg-brand-soft text-brand-text'
                : 'border-line text-fg-muted hover:text-fg'
            }`}
          >
            <Crosshair className="size-3" aria-hidden="true" />
            {t('focus.follow')}
          </button>
        ) : null}

        {selectedTrain ? (
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-1.5 border border-line px-2 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted transition-colors hover:text-fg"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            {t('focus.resetView')}
          </button>
        ) : null}
      </div>

      {/* The clock lives here now that the stats strip is gone — it is the one
          number the rest of the screen is computed against. */}
      <p className="flex items-center gap-2 font-mono text-[0.625rem] text-fg-muted">
        <span className="font-semibold tabular-nums text-brand-text">
          {formatClock(SIM_START_MINUTES + minutes)}
        </span>
        <span className="uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
          {t('common.simulated')}
        </span>
      </p>
    </div>
  )
}

export function LiveStatus({ onOpenTrainDetail }) {
  const { t } = useLanguage()
  const { trains } = useNetwork()
  const {
    selectedTrain,
    selectedStation,
    highlightedStop,
    followSelected,
    selectTrain,
    focusStation,
    clear,
  } = useSelection()

  const train = trains.find((item) => item.number === selectedTrain) ?? null
  const focused = Boolean(train)

  const mapPanel = (
    <div className="relative h-full">
      <Suspense fallback={<MapFallback />}>
        <RailMap
          className="absolute inset-0"
          selectedTrain={selectedTrain}
          followSelected={followSelected}
          focusMode={focused}
          onSelectTrain={(number) => selectTrain(number)}
          onSelectStation={(code) => focusStation(code)}
        />
      </Suspense>
    </div>
  )

  // -- focused: one service, map beside its journey --------------------------
  if (focused) {
    return (
      <section className="bg-page">
        <div className="mx-auto max-w-[1700px] px-3 py-3 sm:px-5 sm:py-4">
          <div className="grid gap-3 lg:h-[calc(100dvh-8.5rem)] lg:min-h-[38rem] lg:grid-cols-2">
            <div className="flex min-h-0 flex-col border border-line">
              <div className="h-[20rem] flex-1 sm:h-[26rem] lg:h-auto">{mapPanel}</div>
              <MapControls focused />
            </div>

            <div className="min-h-0 overflow-hidden border border-line">
              <div className="h-[34rem] lg:h-full">
                <TrainFocus
                  train={train}
                  highlightedStop={highlightedStop}
                  onBack={clear}
                  onViewDetails={() => onOpenTrainDetail?.(train.number)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // -- network: the whole railway, services beside it ------------------------
  return (
    <section className="bg-page">
      <div className="mx-auto max-w-[1700px] px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 pb-2.5">
          <div>
            <Eyebrow as="h1">{t('live.title')}</Eyebrow>
            <p className="mt-1 max-w-xl text-sm text-fg-muted">
              {t('live.subtitle', { count: trains.length })}
            </p>
          </div>
          <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            {t('live.selectHint')}
          </p>
        </div>

        {/* An operational workspace: the map and the running order share the
            viewport side by side, so the list can be scrolled without the
            network leaving the screen. */}
        <div className="grid gap-3 lg:h-[calc(100dvh-11rem)] lg:min-h-[36rem] lg:grid-cols-2">
          <div className="flex min-h-0 flex-col border border-line">
            <div className="h-[22rem] flex-1 sm:h-[28rem] lg:h-auto">{mapPanel}</div>
            <MapControls focused={false} />
          </div>

          <div className="min-h-0 overflow-hidden border border-line bg-surface">
            <div className="h-[32rem] lg:h-full">
              {selectedStation ? (
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
          </div>
        </div>
      </div>
    </section>
  )
}
