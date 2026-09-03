import { useState } from 'react'
import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import { useEntrance } from '../../hooks/useEntrance'
import { formatClock } from '../../lib/railSim'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'
import { HeroPlate } from './HeroPlate'
import { RouteSearchForm } from './RouteSearchForm'
import { TrainSearchForm } from './TrainSearchForm'

/**
 * The hero (§12).
 *
 * An asymmetric editorial split: the claim and the search on the left, a
 * large photographic plate on the right carrying a live instrument readout.
 * The search is presented as a two-mode instrument rather than three stacked
 * forms in a card — route search is the default because it is what most
 * passengers arrive wanting, and train-number search is one tab away.
 *
 * Voice has deliberately moved out of this block to the persistent assistant
 * (§17): it is a convenience, not the primary way in.
 */

/** A single reading in the plate's overlay. */
function Reading({ label, value, tone = 'text-on-deep' }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-on-deep-muted">
        {label}
      </dt>
      <dd className={`mt-1 truncate font-mono text-sm font-semibold tabular-nums ${tone}`}>{value}</dd>
    </div>
  )
}

/**
 * The readout overlaid on the plate. It is wired to the same simulation the
 * rest of the site runs on, so the number moving in the hero is the same
 * train the network diagram is showing further down the page.
 */
function PlateInstrument() {
  const { t } = useLanguage()
  const { trains } = useNetwork()
  const train = trains.find((item) => item.number === '12951') ?? trains[0]
  if (!train) return null

  const late = train.delayMin > 0

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 sm:inset-x-4 sm:top-4">
      <div className="border border-on-deep-line bg-[color-mix(in_srgb,var(--ground-deep)_78%,transparent)] p-3.5 backdrop-blur-[3px] sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Mono className="text-lg font-bold leading-none text-on-deep">{train.number}</Mono>
            <p className="mt-1 truncate text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-on-deep-muted">
              {train.name}
            </p>
          </div>
          <span className="shrink-0 border border-brass/50 px-1.5 py-0.5 font-mono text-[0.5625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-brass-bright">
            {t('instrument.demo')}
          </span>
        </div>

        <dl className="mt-3.5 grid grid-cols-3 gap-3 border-t border-on-deep-line pt-3">
          {/* At stand the current station is where it sits; running, it is the
              one just departed — never the same value as NEXT. */}
          <Reading
            label={t('instrument.current')}
            value={train.atStation ? train.atStation.code : `${train.prevStation?.code ?? '—'} ↗`}
          />
          <Reading label={t('instrument.next')} value={train.nextStation?.code ?? '—'} />
          <Reading
            label={t('instrument.eta')}
            value={formatClock(train.etaMinutes)}
            tone={late ? 'text-sig-amber' : 'text-sig-green'}
          />
        </dl>

        <p className="mt-2 font-mono text-[0.625rem] font-semibold tabular-nums text-on-deep-muted">
          {late ? (
            <span className="text-sig-amber">
              +{String(train.delayMin).padStart(2, '0')} {t('unit.min')}
            </span>
          ) : (
            <span className="text-sig-green">{t('status.onTime')}</span>
          )}
          <span className="mx-2 opacity-40">/</span>
          {train.speedKmh} km/h
        </p>
      </div>
    </div>
  )
}

export function Hero({ onSearch }) {
  const { t } = useLanguage()
  const containerRef = useEntrance({ delay: 60 })
  const [mode, setMode] = useState('route')

  const tab = (id, label) => (
    <button
      key={id}
      type="button"
      onClick={() => setMode(id)}
      aria-pressed={mode === id}
      className={`border px-3 py-1.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] transition-colors ${
        mode === id
          ? 'border-fg bg-fg text-page'
          : 'border-line text-fg-subtle hover:border-line-strong hover:text-fg'
      }`}
    >
      {label}
    </button>
  )

  return (
    <section id="top" className="border-b border-line bg-ground-paper">
      <div ref={containerRef} className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="grid items-stretch gap-10 py-10 lg:grid-cols-12 lg:gap-14 lg:py-16">
          <div className="lg:col-span-7">
            <Eyebrow as="p" tone="brand" data-enter>
              {t('hero.eyebrow')}
            </Eyebrow>

            {/* The headline is set in two deliberate lines: the second is the
                promise, and it gets the display weight. */}
            <h1
              data-enter
              className="mt-4 max-w-[17ch] font-display text-[2.5rem] font-medium leading-[1.03] tracking-tight text-fg sm:text-[3.3rem] lg:text-[3.85rem]"
            >
              {t('hero.title')}
            </h1>

            <p data-enter className="mt-5 max-w-lg text-base leading-7 text-fg-muted">
              {t('hero.subtitle')}
            </p>

            <div data-enter id="find-train" className="mt-9 scroll-mt-24">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3">
                <Eyebrow as="h2">{t('hero.findTitle')}</Eyebrow>
                <div className="flex gap-1.5">
                  {tab('route', t('search.byRoute'))}
                  {tab('train', t('search.byTrain'))}
                </div>
              </div>

              {mode === 'route' ? (
                <RouteSearchForm onSearch={onSearch} />
              ) : (
                <TrainSearchForm onSearch={onSearch} />
              )}
            </div>
          </div>

          <div data-enter className="lg:col-span-5">
            <div className="relative h-full">
              <HeroPlate />
              <PlateInstrument />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
