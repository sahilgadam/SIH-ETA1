import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useLanguage } from '../context/LanguageProvider'
import { useNetwork } from '../context/NetworkProvider'
import { useSelection } from '../context/SelectionProvider'
import { callsAtStation, formatClock, networkStations, stationByCode } from '../lib/railSim'
import { ConnectionPlanner } from '../components/stations/ConnectionPlanner'
import { neighboursOf, StationGraph } from '../components/stations/StationGraph'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Mono } from '../components/ui/Mono'

/**
 * Station intelligence.
 *
 * Everything on this page is derived from the shared simulation: which
 * services call here, what they are doing right now, what this station is
 * connected to, and — the reason the page exists — whether a passenger
 * changing here will actually make their onward train.
 */

function Board({ title, calls, emptyLabel, onSelect }) {
  return (
    <div className="min-w-0">
      <p className="border-b border-line-strong pb-1.5 font-mono text-[0.5625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        {title}
      </p>

      {calls.length ? (
        <ul className="divide-y divide-line">
          {calls.map(({ train, stop, predicted, booked }) => (
            <li key={train.number}>
              <button
                type="button"
                onClick={() => onSelect(train.number)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-3 py-2.5 text-left transition-colors hover:bg-sunken"
              >
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <Mono className="text-sm font-bold text-fg">{train.number}</Mono>
                    <span className="truncate text-[0.6875rem] text-fg-muted">{train.name}</span>
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.625rem] text-fg-subtle">
                    {train.origin.code} → {train.destination.code}
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
                    {stop.delayMin > 0 ? `+${stop.delayMin} · bkd ${formatClock(booked)}` : 'On time'}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-xs text-fg-subtle">{emptyLabel}</p>
      )}
    </div>
  )
}

export function Stations({ onOpenTrainDetail }) {
  const { t } = useLanguage()
  const { trains } = useNetwork()
  const { selectedStation, focusStation, selectTrain } = useSelection()

  const [query, setQuery] = useState('')
  const code = selectedStation ?? 'NDLS'
  const station = stationByCode.get(code) ?? stationByCode.get('NDLS')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return networkStations
      .filter((s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query])

  const calls = useMemo(() => callsAtStation(station.code, trains), [station.code, trains])
  // Topology is a property of the timetable, not of the live snapshot.
  const neighbours = useMemo(() => neighboursOf(station.code), [station.code])

  const arriving = calls.filter((c) => c.state === 'next' || c.state === 'upcoming').slice(0, 6)
  const atPlatform = calls.filter((c) => c.state === 'current')
  const departed = calls.filter((c) => c.state === 'past').slice(-4)

  const busiest = [...networkStations]
    .map((s) => ({ ...s, count: s.trains.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const openTrain = (number) => {
    selectTrain(number)
    onOpenTrainDetail?.(number)
  }

  return (
    <>
      {/* Header + station picker ------------------------------------------ */}
      <header className="border-b border-line bg-page">
        <div className="mx-auto max-w-[1320px] px-4 pb-6 pt-10 sm:px-6 lg:pb-8 lg:pt-14">
          <Eyebrow as="p">{t('stations.eyebrow')}</Eyebrow>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="min-w-0">
              <h1 className="font-display text-[2.5rem] font-medium leading-[1.04] text-fg sm:text-[3.25rem]">
                {station.name}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-fg-muted">
                <Mono className="text-base font-bold text-fg">{station.code}</Mono>
                <span className="opacity-50">·</span>
                <span>
                  {station.lat.toFixed(3)}°N {station.lng.toFixed(3)}°E
                </span>
                <span className="opacity-50">·</span>
                <span>
                  {station.trains.length} {t('stations.servicesCall')}
                </span>
                <span className="opacity-50">·</span>
                <span>
                  {neighbours.length} {t('stations.connected')}
                </span>
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('stations.searchPlaceholder')}
                aria-label={t('stations.searchLabel')}
                className="w-full border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-fg outline-none placeholder:text-fg-subtle focus-visible:border-brand"
              />

              {results.length ? (
                <ul className="absolute z-20 mt-1 w-full border border-line-strong bg-surface shadow-[var(--shadow-warm-md)]">
                  {results.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        onClick={() => {
                          focusStation(item.code)
                          setQuery('')
                        }}
                        className="flex w-full items-baseline gap-2.5 px-3 py-2 text-left transition-colors hover:bg-sunken"
                      >
                        <Mono className="text-xs font-bold text-fg">{item.code}</Mono>
                        <span className="truncate text-xs text-fg-muted">{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {/* Busiest junctions, as quick picks. */}
          <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-line-strong pt-4">
            <span className="mr-1 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
              {t('stations.busiest')}
            </span>
            {busiest.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => focusStation(item.code)}
                aria-pressed={item.code === station.code}
                className={`border px-2 py-1 font-mono text-[0.625rem] font-semibold transition-colors ${
                  item.code === station.code
                    ? 'border-fg bg-fg text-page'
                    : 'border-line text-fg-subtle hover:border-line-strong hover:text-fg'
                }`}
              >
                {item.code}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Connections + boards --------------------------------------------- */}
      <section className="border-b border-line bg-ground-sand">
        <div className="mx-auto grid max-w-[1320px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:py-14">
          <div className="lg:col-span-7">
            <Eyebrow as="h2">{t('stations.networkTitle')}</Eyebrow>
            <p className="mt-2 max-w-prose text-sm leading-6 text-fg-muted">
              {t('stations.networkLead')}
            </p>

            <div className="mt-4 aspect-4/3 w-full border border-line bg-surface sm:aspect-square">
              <StationGraph code={station.code} />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            {atPlatform.length ? (
              <Board
                title={t('stations.atPlatform')}
                calls={atPlatform}
                emptyLabel=""
                onSelect={openTrain}
              />
            ) : null}

            <Board
              title={t('stations.arriving')}
              calls={arriving}
              emptyLabel={t('stations.noArrivals')}
              onSelect={openTrain}
            />

            <Board
              title={t('stations.departed')}
              calls={departed}
              emptyLabel={t('stations.noDepartures')}
              onSelect={openTrain}
            />
          </div>
        </div>
      </section>

      {/* Connection prediction -------------------------------------------- */}
      <section className="border-b border-line bg-page">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:py-14">
          <ConnectionPlanner stationCode={station.code} onSelectTrain={openTrain} />
        </div>
      </section>
    </>
  )
}
