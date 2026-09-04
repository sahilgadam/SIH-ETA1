import { useCallback, useMemo, useRef, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { useLanguage } from '../context/LanguageProvider'
import { useNetwork } from '../context/NetworkProvider'
import { useSelection } from '../context/SelectionProvider'
import { formatClock, formatDuration, networkStations, stationByCode } from '../lib/railSim'
import { arrivingServices, groupByDestination, stationBoard, withTransfers } from '../lib/stationBoard'
import { AskRailSense } from '../components/assistant/AskRailSense'
import { ArrivingHere } from '../components/stations/ArrivingHere'
import { ConnectionPlanner } from '../components/stations/ConnectionPlanner'
import { neighboursOf, StationGraph } from '../components/stations/StationGraph'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Mono } from '../components/ui/Mono'

/**
 * The station page, as a decision tool.
 *
 * The order is the order a passenger thinks in: I am arriving here → what can
 * I catch → will I make it → what else is running → and only then, what this
 * station is connected to. The connectivity diagram used to open the page. It
 * is interesting, but it is not what anyone standing on a concourse needs
 * first, so it now closes the page instead.
 *
 * Every figure comes from the shared simulation.
 */

function Stat({ label, value, sub }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-fg">{value}</p>
      {sub ? <p className="mt-0.5 max-w-[14rem] truncate text-[0.6875rem] text-fg-muted">{sub}</p> : null}
    </div>
  )
}

/** A compact live-board row — arrivals and departures share the shape. */
function BoardRow({ entry, kind, onOpen, t }) {
  const late = entry.stop.delayMin > 0
  const other = kind === 'arrival' ? entry.from : entry.to

  return (
    <li className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => onOpen(entry.train.number)}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-2.5 text-left"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <Mono className="text-sm font-bold text-fg">{entry.train.number}</Mono>
            <span className="truncate text-[0.8125rem] text-fg-muted">{entry.train.name}</span>
          </span>
          <span className="mt-0.5 block font-mono text-[0.625rem] text-fg-muted">
            {kind === 'arrival' ? t('station.from') : t('station.to')} {other.name}
            {entry.inMin >= 0 && entry.inMin <= 600 ? (
              <span className="ml-2">
                · {t('focus.in')} {formatDuration(entry.inMin)}
              </span>
            ) : null}
          </span>
        </span>

        <span className="shrink-0 text-right">
          <Mono className="block text-base font-semibold tabular-nums text-fg">
            {formatClock(entry.at)}
          </Mono>
          <span
            className={`font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] ${
              late ? 'text-caution' : 'text-brand-text'
            }`}
          >
            {late ? `+${entry.stop.delayMin} ${t('unit.min')}` : t('status.onTime')}
          </span>
        </span>
      </button>
    </li>
  )
}

function Board({ title, entries, kind, empty, onOpen, t, accent }) {
  return (
    <div className="min-w-0">
      <p
        className={`flex items-center gap-2 border-b-2 pb-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg ${accent}`}
      >
        {title}
        <span className="font-normal text-fg-muted">{entries.length}</span>
      </p>
      {entries.length ? (
        <ul>
          {entries.slice(0, 6).map((entry) => (
            <BoardRow key={entry.train.number} entry={entry} kind={kind} onOpen={onOpen} t={t} />
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-xs text-fg-muted">{empty}</p>
      )}
    </div>
  )
}

export function Stations({ onOpenTrainDetail }) {
  const { t } = useLanguage()
  const { trains, minutes } = useNetwork()
  const { selectedStation, focusStation, selectTrain } = useSelection()

  const [query, setQuery] = useState('')
  const [arrivingNumber, setArrivingNumber] = useState(null)
  const arrivingRef = useRef(null)

  const code = selectedStation ?? 'NDLS'
  const station = stationByCode.get(code) ?? stationByCode.get('NDLS')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return networkStations
      .filter((s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query])

  const board = useMemo(
    () => stationBoard(station.code, trains, minutes),
    [station.code, trains, minutes],
  )
  const services = useMemo(() => arrivingServices(station.code, trains), [station.code, trains])
  const neighbours = useMemo(() => neighboursOf(station.code), [station.code])

  // Open the station already answering the question (§20). Waiting for the
  // passenger to pick a train first left the page's whole point behind an
  // interaction, so it opens on the arriving service that actually has
  // somewhere to go — the passenger can change it, and the choice they make
  // always wins.
  const suggested = useMemo(() => {
    if (!services.length) return null
    const useful = services.find(
      (service) => withTransfers(board.departures, service).some((o) => o.status !== 'missed'),
    )
    return (useful ?? services[0]).train.number
  }, [services, board.departures])

  const chosen = arrivingNumber ?? suggested
  const arrival = services.find((s) => s.train.number === chosen) ?? null
  const options = useMemo(() => withTransfers(board.departures, arrival), [board.departures, arrival])
  const grouped = useMemo(() => groupByDestination(board.departures), [board.departures])

  const openTrain = useCallback(
    (number) => {
      selectTrain(number)
      onOpenTrainDetail?.(number)
    },
    [selectTrain, onOpenTrainDetail],
  )

  const goToArriving = useCallback(() => {
    const node = arrivingRef.current
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => node.querySelector('select')?.focus(), 420)
  }, [])

  const changeStation = useCallback(
    (next) => {
      focusStation(next)
      setArrivingNumber(null)
      setQuery('')
    },
    [focusStation],
  )

  const busiest = [...networkStations]
    .map((s) => ({ ...s, count: s.trains.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-5 sm:px-6 lg:py-8">
      {/* Station header + search --------------------------------------------- */}
      <header className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <Eyebrow as="p" tone="fg">
            {t('stations.eyebrow')}
          </Eyebrow>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className="font-display text-[2.25rem] font-medium leading-none text-fg sm:text-[3rem]">
              {station.name}
            </h1>
            <Mono className="text-2xl font-bold text-fg-muted">{station.code}</Mono>
          </div>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('stations.searchPlaceholder')}
            aria-label={t('stations.searchLabel')}
            className="w-full border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-fg outline-none placeholder:text-fg-muted focus-visible:border-brand"
          />
          {results.length ? (
            <ul className="absolute z-20 mt-1 w-full border border-line-strong bg-surface shadow-[var(--shadow-warm-md)]">
              {results.map((item) => (
                <li key={item.code}>
                  <button
                    type="button"
                    onClick={() => changeStation(item.code)}
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
      </header>

      {/* Live station status -------------------------------------------------- */}
      <section className="mt-5 border-y border-line-strong py-4">
        <Eyebrow as="h2" tone="fg" className="mb-3">
          {t('station.liveStatus')}
        </Eyebrow>

        <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
          <Stat label={t('station.arrivals')} value={board.counts.arrivals} />
          <Stat label={t('station.departures')} value={board.counts.departures} />
          <Stat label={t('station.atPlatform')} value={board.counts.atPlatform} />

          {board.nextArrival ? (
            <Stat
              label={t('station.nextArrival')}
              value={formatClock(board.nextArrival.at)}
              sub={`${board.nextArrival.train.number} · ${board.nextArrival.train.name}`}
            />
          ) : null}
          {board.nextDeparture ? (
            <Stat
              label={t('station.nextDeparture')}
              value={formatClock(board.nextDeparture.at)}
              sub={`${board.nextDeparture.train.number} · ${board.nextDeparture.train.name}`}
            />
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={goToArriving}
            className="inline-flex items-center gap-2 border border-brand bg-brand px-4 py-2.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[var(--tracking-rail)] text-brand-fg transition-colors hover:bg-brand-hover"
          >
            {t('station.seeMyConnections')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
          <p className="text-sm text-fg-muted">{t('station.heroLead')}</p>
        </div>
      </section>

      {/* I'm arriving here ---------------------------------------------------- */}
      <div ref={arrivingRef} className="mt-6 scroll-mt-24">
        <ArrivingHere
          station={station}
          services={services}
          arrival={arrival}
          arrivingNumber={chosen}
          onChangeArriving={setArrivingNumber}
          options={options}
          onOpenTrain={openTrain}
        />
      </div>

      {/* Boards ---------------------------------------------------------------- */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Board
          title={t('station.arrivingSoon')}
          entries={board.arrivals}
          kind="arrival"
          empty={t('stations.noArrivals')}
          onOpen={openTrain}
          t={t}
          accent="border-b-brand"
        />
        <Board
          title={t('station.departingSoon')}
          entries={board.departures}
          kind="departure"
          empty={t('stations.noDepartures')}
          onOpen={openTrain}
          t={t}
          accent="border-b-brass"
        />
      </div>

      {/* What can I catch from here -------------------------------------------- */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium text-fg">
          {t('station.catchFrom', { station: station.name })}
        </h2>
        <p className="mt-1.5 max-w-prose text-sm leading-6 text-fg-muted">{t('station.catchLead')}</p>

        {grouped.length ? (
          <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.slice(0, 9).map((group) => (
              <div key={group.destination.code} className="min-w-0">
                <p className="border-b border-line-strong pb-1 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                  {t('station.to')} {group.destination.name}
                </p>
                <ul>
                  {group.services.slice(0, 3).map((service) => (
                    <li key={service.train.number} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        onClick={() => openTrain(service.train.number)}
                        className="flex w-full items-baseline justify-between gap-3 py-2 text-left"
                      >
                        <span className="min-w-0">
                          <Mono className="text-xs font-bold text-fg">{service.train.number}</Mono>
                          <span className="ml-2 truncate text-[0.6875rem] text-fg-muted">
                            {service.train.name}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <Mono className="block text-xs font-semibold tabular-nums text-fg">
                            {formatClock(service.at)}
                          </Mono>
                          <span
                            className={`font-mono text-[0.5rem] uppercase ${
                              service.stop.delayMin > 0 ? 'text-caution' : 'text-brand-text'
                            }`}
                          >
                            {service.stop.delayMin > 0
                              ? `+${service.stop.delayMin}`
                              : t('status.onTime')}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 border border-dashed border-line px-4 py-8 text-center text-sm text-fg-muted">
            {t('stations.noDepartures')}
          </p>
        )}
      </section>

      {/* Explicit connection check --------------------------------------------- */}
      <div className="mt-10">
        <ConnectionPlanner
          stationCode={station.code}
          headingId="station-connection"
          onSelectTrain={openTrain}
        />
      </div>

      {/* Connectivity, now that the useful questions are answered ---------------- */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium text-fg">{t('station.connectivity')}</h2>
        <p className="mt-1.5 max-w-prose text-sm leading-6 text-fg-muted">
          {t('station.connectivityLead', { station: station.name })}
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="aspect-4/3 w-full border border-line bg-surface">
              <StationGraph code={station.code} onSelectStation={changeStation} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="border-b border-line-strong pb-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
              {t('station.directConnections')} · {neighbours.length}
            </p>
            <ul>
              {neighbours.map((neighbour) => (
                <li key={neighbour.code} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    onClick={() => changeStation(neighbour.code)}
                    className="flex w-full items-baseline justify-between gap-3 py-2.5 text-left"
                  >
                    <span className="min-w-0">
                      <Mono className="text-sm font-bold text-fg">{neighbour.code}</Mono>
                      <span className="ml-2 truncate text-[0.6875rem] text-fg-muted">
                        {neighbour.name}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[0.625rem] text-fg-muted">
                      {Math.round(neighbour.km)} km · {neighbour.services.length} {t('station.services')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
              <span className="mr-1 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
                {t('stations.busiest')}
              </span>
              {busiest.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => changeStation(item.code)}
                  aria-pressed={item.code === station.code}
                  className={`border px-2 py-1 font-mono text-[0.625rem] font-semibold transition-colors ${
                    item.code === station.code
                      ? 'border-fg bg-fg text-page'
                      : 'border-line text-fg-muted hover:border-line-strong hover:text-fg'
                  }`}
                >
                  {item.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Assistant --------------------------------------------------------------- */}
      <section className="mt-10 border-t border-line pt-5">
        <Eyebrow as="h2" tone="fg" className="mb-3">
          {t('ask.title')}
        </Eyebrow>
        <AskRailSense />
      </section>

      <p className="mt-6 border-t border-line pt-3 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        {t('common.simulated')}
      </p>
    </div>
  )
}
