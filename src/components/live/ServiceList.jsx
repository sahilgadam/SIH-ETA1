import { useMemo, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import { formatClock, formatDuration, minutesUntil } from '../../lib/railSim'
import { Mono } from '../ui/Mono'

/**
 * The running order.
 *
 * Two layouts from one component, because they are the same list at two
 * widths: `rail` is the narrow column beside a map, `wide` is the full-width
 * table beneath one. Compact operational rows either way — a fleet list is
 * something you scan, not a set of cards to browse.
 *
 * Search is deliberately loose (number, name, origin, destination, any station
 * on the route) because a passenger types "rajdhani" or "mumbai", not an ID.
 */

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

/** Where the service is right now, in one phrase. */
function positionLabel(train) {
  if (train.phase === 'dwell' || train.phase === 'origin') return `At ${train.atStation?.code ?? '—'}`
  return `${train.prevStation.code} → ${train.nextStation.code}`
}

function Row({ train, selected, onSelect, wide, minutes }) {
  const { t } = useLanguage()
  const status = STATUS[train.status] ?? STATUS['on-time']
  const nextIn = minutesUntil(train.nextStationEtaMin, minutes)

  const delayCell = (
    <span
      className={`font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] ${
        train.delayMin > 0 ? 'text-caution' : 'text-brand-text'
      }`}
    >
      {train.delayMin > 0 ? `+${train.delayMin} ${t('unit.min')}` : t('status.onTime')}
    </span>
  )

  if (wide) {
    return (
      <li className="border-b border-line last:border-b-0">
        <button
          type="button"
          onClick={() => onSelect(selected ? null : train.number)}
          aria-pressed={selected}
          className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 border-l-2 px-3 py-2.5 text-left transition-colors sm:grid-cols-[auto_minmax(0,17rem)_minmax(0,1fr)_8rem_7rem_auto] ${
            selected ? 'border-l-brand bg-brand-soft' : 'border-l-transparent hover:bg-sunken'
          }`}
        >
          <span className={`font-mono text-xs ${status.className}`} aria-hidden="true">
            {status.glyph}
          </span>

          {/* flex + min-w-0 on both: `truncate` needs a flex context and a
              shrinkable box, otherwise the long service names overran the
              route column instead of ellipsing. */}
          <span className="flex min-w-0 items-baseline gap-2">
            <Mono className="shrink-0 text-sm font-bold text-fg">{train.number}</Mono>
            <span className="min-w-0 truncate text-[0.6875rem] text-fg-muted">{train.name}</span>
          </span>

          <span className="flex min-w-0 items-center gap-2 font-mono text-[0.625rem] text-fg-subtle">
            <span className="font-semibold text-fg-muted">{train.origin.code}</span>
            <span
              aria-hidden="true"
              className="inline-block h-px w-5 shrink-0 bg-line-strong transition-all duration-300 ease-[var(--ease-rail)] group-hover:w-9"
            />
            <span className="font-semibold text-fg-muted">{train.destination.code}</span>
          </span>

          <span className="min-w-0 font-mono text-[0.625rem] text-fg-muted">
            <span className="text-fg-subtle">{t('live.nextCol')} </span>
            {train.nextStation.code}
            {nextIn != null && nextIn <= 600 ? (
              <span className="block text-fg-subtle">{t('focus.in')} {formatDuration(nextIn)}</span>
            ) : null}
          </span>

          <span>
            <Mono className="block text-sm font-semibold tabular-nums text-fg">
              {formatClock(train.etaMinutes)}
            </Mono>
            {delayCell}
          </span>

          <ArrowRight
            className="hidden size-4 shrink-0 text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg sm:block"
            aria-hidden="true"
          />
        </button>
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(selected ? null : train.number)}
        aria-pressed={selected}
        className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-2.5 border-l-2 px-2.5 py-2.5 text-left transition-colors ${
          selected ? 'border-l-brand bg-brand-soft' : 'border-l-transparent hover:bg-sunken'
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
          <span className="mt-0.5 block truncate font-mono text-[0.625rem] text-fg-subtle">
            {positionLabel(train)}
            <span className="mx-1 opacity-50">·</span>
            {train.speedKmh} km/h
          </span>
        </span>

        <span className="text-right">
          <Mono className="block text-sm font-semibold tabular-nums text-fg">
            {formatClock(train.etaMinutes)}
          </Mono>
          {delayCell}
        </span>
      </button>
    </li>
  )
}

export function ServiceList({ trains, selectedTrain, onSelect, layout = 'rail' }) {
  const { t } = useLanguage()
  const { minutes } = useNetwork()
  const wide = layout === 'wide'

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
    <div className={wide ? 'flex flex-col' : 'flex h-full min-h-0 flex-col'}>
      <div className={`border-b border-line p-2.5 ${wide ? 'sm:flex sm:items-center sm:gap-4' : ''}`}>
        <div className={`relative ${wide ? 'sm:w-64 sm:shrink-0' : ''}`}>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-subtle"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('live.searchPlaceholder')}
            aria-label={t('live.searchLabel')}
            className="w-full border border-line bg-page py-1.5 pl-8 pr-2 text-sm text-fg outline-none placeholder:text-fg-subtle focus-visible:border-brand"
          />
        </div>

        <div className={wide ? 'mt-2 flex flex-wrap items-center gap-3 sm:mt-0' : ''}>
          <div className="mt-2 flex flex-wrap gap-1 sm:mt-0">
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

          <div className="mt-1.5 flex items-center gap-1.5 sm:mt-0">
            <span className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
              {t('live.sort')}
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

          {wide ? (
            <p className="ml-auto font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
              {visible.length} {t('trains.servicesRunning')}
            </p>
          ) : null}
        </div>
      </div>

      <ul
        className={
          wide
            ? 'max-h-[30rem] overflow-y-auto'
            : 'min-h-0 flex-1 divide-y divide-line overflow-y-auto'
        }
      >
        {visible.map((train) => (
          <Row
            key={train.number}
            train={train}
            selected={train.number === selectedTrain}
            onSelect={onSelect}
            wide={wide}
            minutes={minutes}
          />
        ))}

        {!visible.length ? (
          <li className="px-3 py-8 text-center">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[var(--tracking-rail)] text-fg">
              {t('trains.emptyTitle')}
            </p>
            <p className="mt-1 text-xs text-fg-subtle">{t('trains.emptyBody')}</p>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
