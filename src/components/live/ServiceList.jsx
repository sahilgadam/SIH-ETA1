import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { formatClock } from '../../lib/railSim'
import { Mono } from '../ui/Mono'

/**
 * The live services rail (§17).
 *
 * Search, filter and sort over the running fleet. Search is deliberately loose
 * — number, name, origin, destination or any station on the route — because a
 * passenger types "rajdhani" or "mumbai", not a service ID.
 *
 * Selection is lifted: choosing a row is the same act as clicking the train on
 * the map, so the two stay in step through `SelectionProvider`.
 */

/** Status carried by glyph as well as colour (never colour alone). */
const STATUS = {
  'on-time': { glyph: '●', className: 'text-brand-text', label: 'On time' },
  watch: { glyph: '▲', className: 'text-caution', label: 'Watch' },
  delayed: { glyph: '■', className: 'text-caution', label: 'Delayed' },
  critical: { glyph: '◆', className: 'text-danger', label: 'Critical' },
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'on-time', label: 'On time' },
  { id: 'watch', label: 'Watch' },
  { id: 'late', label: 'Delayed' },
  { id: 'soon', label: 'Arriving soon' },
]

const SORTS = [
  { id: 'delay', label: 'Delay' },
  { id: 'eta', label: 'ETA' },
  { id: 'number', label: 'Number' },
]

function matches(train, query) {
  if (!query) return true
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    train.number.includes(q) ||
    train.name.toLowerCase().includes(q) ||
    train.origin.name.toLowerCase().includes(q) ||
    train.destination.name.toLowerCase().includes(q) ||
    train.stops.some((s) => s.code.toLowerCase() === q || s.name.toLowerCase().includes(q))
  )
}

export function ServiceList({ trains, selectedTrain, onSelect }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('delay')

  const visible = useMemo(() => {
    let list = trains.filter((train) => matches(train, query))

    if (filter === 'late') list = list.filter((t2) => t2.delayMin > 10)
    else if (filter === 'soon') list = list.filter((t2) => t2.phase === 'braking' || t2.phase === 'dwell')
    else if (filter !== 'all') list = list.filter((t2) => t2.status === filter)

    return [...list].sort((a, b) => {
      if (sort === 'eta') return a.etaMinutes - b.etaMinutes
      if (sort === 'number') return a.number.localeCompare(b.number)
      return b.delayMin - a.delayMin
    })
  }, [trains, query, filter, sort])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-line p-2.5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-subtle"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Train, name or station…"
            aria-label="Search services"
            className="w-full border border-line bg-page py-1.5 pl-8 pr-2 text-sm text-fg outline-none placeholder:text-fg-subtle focus-visible:border-brand"
          />
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={`border px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] transition-colors ${
                filter === item.id
                  ? 'border-fg bg-fg text-page'
                  : 'border-line text-fg-subtle hover:border-line-strong hover:text-fg'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            Sort
          </span>
          {SORTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSort(item.id)}
              aria-pressed={sort === item.id}
              className={`font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] transition-colors ${
                sort === item.id ? 'text-fg underline' : 'text-fg-subtle hover:text-fg'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
        {visible.map((train) => {
          const status = STATUS[train.status] ?? STATUS['on-time']
          const selected = train.number === selectedTrain
          return (
            <li key={train.number}>
              <button
                type="button"
                onClick={() => onSelect(selected ? null : train.number)}
                aria-pressed={selected}
                className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-2.5 border-l-2 px-2.5 py-2.5 text-left transition-colors ${
                  selected
                    ? 'border-l-brand bg-brand-soft'
                    : 'border-l-transparent hover:bg-sunken'
                }`}
              >
                <span className={`font-mono text-xs ${status.className}`} aria-hidden="true">
                  {status.glyph}
                </span>

                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <Mono className="text-sm font-bold text-fg">{train.number}</Mono>
                    <span className="truncate text-[0.6875rem] text-fg-muted">{train.name}</span>
                  </span>

                  <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[0.625rem] text-fg-subtle">
                    {train.origin.code}
                    <span
                      aria-hidden="true"
                      className="inline-block h-px w-4 bg-line-strong transition-all duration-300 group-hover:w-7"
                    />
                    {train.destination.code}
                  </span>

                  <span className="mt-0.5 block truncate text-[0.625rem] text-fg-subtle">
                    {train.phase === 'dwell' || train.phase === 'origin'
                      ? `At ${train.atStation?.code ?? '—'}`
                      : `${train.prevStation.code} → ${train.nextStation.code}`}
                    <span className="mx-1 opacity-50">·</span>
                    {train.speedKmh} km/h
                  </span>
                </span>

                <span className="text-right">
                  <Mono className="block text-sm font-semibold tabular-nums text-fg">
                    {formatClock(train.etaMinutes)}
                  </Mono>
                  <span
                    className={`font-mono text-[0.5625rem] uppercase tracking-wide ${
                      train.delayMin > 0 ? 'text-caution' : 'text-brand-text'
                    }`}
                  >
                    {train.delayMin > 0 ? `+${train.delayMin} ${t('unit.min')}` : t('status.onTime')}
                  </span>
                </span>
              </button>
            </li>
          )
        })}

        {!visible.length ? (
          <li className="px-3 py-8 text-center">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg">
              No services match
            </p>
            <p className="mt-1 text-xs text-fg-subtle">Try a different train, name or station.</p>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
