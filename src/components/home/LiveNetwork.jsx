import { lazy, Suspense } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { SIM_SPEEDS, useNetwork } from '../../context/NetworkProvider'
import { useSelection } from '../../context/SelectionProvider'
import { formatClock, SIM_START_MINUTES } from '../../lib/railSim'
import { ServiceList } from '../live/ServiceList'
import { Eyebrow } from '../ui/Eyebrow'

const RailMap = lazy(() =>
  import('../map/RailMap').then((m) => ({ default: m.RailMap })),
)

/**
 * The live network on the landing page.
 *
 * The same geographic map and the same service list as the Live Status screen,
 * shown at a glance — selecting anything here carries straight through to the
 * full screen, because both read the one `SelectionProvider`. Previously this
 * section was an abstract schematic, which looked like a diagram of a railway
 * rather than a railway being tracked.
 */

function Metric({ label, value, unit }) {
  return (
    <div>
      <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-on-deep-muted">
        {label}
      </p>
      <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-on-deep">
        {value}
        {unit ? <span className="ml-1 text-xs font-normal text-on-deep-muted">{unit}</span> : null}
      </p>
    </div>
  )
}

export function LiveNetwork({ onOpenLive }) {
  const { t } = useLanguage()
  const { trains, summary, minutes, controls, prefersReducedMotion } = useNetwork()
  const { selectedTrain, selectTrain, clear } = useSelection()

  return (
    <section id="live-network" className="bg-ground-deep text-on-deep">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:py-18">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-on-deep-line pb-5">
          <div>
            <Eyebrow as="p" className="text-brass-bright">
              {t('live.title')}
            </Eyebrow>
            <p className="mt-2 max-w-md text-sm leading-6 text-on-deep-muted">{t('live.subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-end gap-5">
            <Metric label={t('live.running')} value={`${summary.running}/${summary.total}`} />
            <Metric label={t('live.avgDelay')} value={summary.avgDelay.toFixed(1)} unit="min" />
            <Metric label={t('live.avgSpeed')} value={summary.avgSpeed} unit="km/h" />
            <div className="border-l border-on-deep-line pl-5">
              <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-on-deep-muted">
                IST
              </p>
              <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-brass-bright">
                {formatClock(SIM_START_MINUTES + minutes)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 pt-5 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="relative h-[24rem] overflow-hidden border border-on-deep-line sm:h-[30rem]">
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center bg-ground-deep-2">
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-on-deep-muted">
                      Syncing train positions…
                    </p>
                  </div>
                }
              >
                <RailMap
                  className="absolute inset-0"
                  selectedTrain={selectedTrain}
                  onSelectTrain={(number) => selectTrain(number)}
                  onSelectStation={() => {}}
                />
              </Suspense>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={controls.toggle}
                  disabled={prefersReducedMotion}
                  aria-label={controls.isRunning ? t('net.pause') : t('net.play')}
                  className="flex items-center gap-1.5 border border-on-deep-line px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[var(--tracking-rail)] text-on-deep transition-colors hover:border-brass disabled:opacity-40"
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
                      className={`border px-2.5 py-1.5 font-mono text-[0.625rem] transition-colors ${
                        controls.speed === value
                          ? 'border-brass bg-brass/20 text-brass-bright'
                          : 'border-on-deep-line text-on-deep-muted hover:text-on-deep'
                      } ${i > 0 ? '-ml-px' : ''}`}
                    >
                      {value}×
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenLive}
                className="flex items-center gap-1.5 border border-brass px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[var(--tracking-rail)] text-brass-bright transition-colors hover:bg-brass/15"
              >
                Open live status
                <ArrowRight className="size-3" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* The same list the full screen uses. It keeps its own light
              surface rather than being restyled for the dark ground — one
              component, one palette, and the contrast reads as a panel set
              into the control-room wall. */}
          <div className="lg:col-span-4">
            <div className="h-[24rem] overflow-hidden border border-on-deep-line bg-surface sm:h-[30rem]">
              <ServiceList
                trains={trains}
                selectedTrain={selectedTrain}
                onSelect={(number) => (number ? selectTrain(number) : clear())}
              />
            </div>
          </div>
        </div>

        <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-on-deep-muted">
          Simulated positions · demo data · not a live Indian Railways feed
        </p>
      </div>
    </section>
  )
}
