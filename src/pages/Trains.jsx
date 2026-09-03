import { useMemo, useState } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageProvider'
import { useNetwork } from '../context/NetworkProvider'
import { useSelection } from '../context/SelectionProvider'
import { categorySrc, categorySrcSet, trainCategories } from '../data/trainCategories'
import { formatClock } from '../lib/railSim'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Mono } from '../components/ui/Mono'

/**
 * Train discovery, organised by service class.
 *
 * Deliberately not a grid of identical cards: each class is an editorial band
 * with its own plate, and the bands alternate side so the page reads as a
 * sequence of spreads rather than a catalogue. The running data in every band
 * is live from the shared simulation, so a service shown here as nine late is
 * nine late on the map too.
 */

const STATUS = {
  'on-time': { glyph: '●', className: 'text-brand-text', label: 'On time' },
  watch: { glyph: '▲', className: 'text-caution', label: 'Watch' },
  delayed: { glyph: '■', className: 'text-caution', label: 'Delayed' },
  critical: { glyph: '◆', className: 'text-danger', label: 'Critical' },
}

function matches(train, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    train.number.includes(q) ||
    train.name.toLowerCase().includes(q) ||
    train.origin.name.toLowerCase().includes(q) ||
    train.destination.name.toLowerCase().includes(q) ||
    train.origin.code.toLowerCase() === q ||
    train.destination.code.toLowerCase() === q ||
    train.stops.some((s) => s.code.toLowerCase() === q || s.name.toLowerCase().includes(q))
  )
}

/** One running service inside a category band. */
function ServiceRow({ train, onOpen }) {
  const status = STATUS[train.status] ?? STATUS['on-time']

  return (
    <li className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => onOpen(train.number)}
        className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 py-3 text-left"
      >
        <span className={`font-mono text-xs ${status.className}`} aria-hidden="true">
          {status.glyph}
        </span>

        <span className="min-w-0">
          <span className="flex items-baseline gap-2">
            <Mono className="text-sm font-bold text-fg">{train.number}</Mono>
            <span className="truncate text-[0.6875rem] text-fg-muted">{train.name}</span>
          </span>

          <span className="mt-1 flex items-center gap-2 font-mono text-[0.625rem] text-fg-subtle">
            <span className="font-semibold">{train.origin.code}</span>
            <span
              aria-hidden="true"
              className="inline-block h-px w-5 bg-line-strong transition-all duration-300 ease-[var(--ease-rail)] group-hover:w-10"
            />
            <span className="font-semibold">{train.destination.code}</span>
            {/* No extra opacity: fg-subtle is already the dimmed step, and
                stacking 80% on top of it falls under 4.5:1. */}
            <span className="ml-1">
              {train.phase === 'dwell' ? `at ${train.atStation?.code}` : `${train.prevStation.code}→${train.nextStation.code}`}
            </span>
          </span>
        </span>

        <span className="flex items-center gap-3 text-right">
          <span>
            <Mono className="block text-sm font-semibold tabular-nums text-fg">
              {formatClock(train.etaMinutes)}
            </Mono>
            <span
              className={`font-mono text-[0.5625rem] uppercase tracking-wide ${
                train.delayMin > 0 ? 'text-caution' : 'text-brand-text'
              }`}
            >
              {train.delayMin > 0 ? `+${train.delayMin} min` : status.label}
            </span>
          </span>
          <ArrowRight
            className="size-4 shrink-0 text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg"
            aria-hidden="true"
          />
        </span>
      </button>
    </li>
  )
}

/** One service class, as an editorial band. */
function CategoryBand({ category, trains, flipped, onOpen }) {
  if (!trains.length) return null

  return (
    <section
      aria-labelledby={`cat-${category.id}`}
      className={`border-b border-line ${flipped ? 'bg-ground-sand' : 'bg-page'}`}
    >
      <div className="mx-auto grid max-w-[1320px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:py-16">
        {/* The plate. Order flips band to band so the page has a rhythm. */}
        <div className={`lg:col-span-6 ${flipped ? 'lg:order-2' : ''}`}>
          <figure className="relative m-0 overflow-hidden border border-line bg-surface">
            <img
              src={categorySrc(category.image)}
              srcSet={categorySrcSet(category.image)}
              sizes="(max-width: 1024px) 100vw, 46vw"
              alt={`${category.name} rake`}
              loading="lazy"
              decoding="async"
              className="aspect-16/10 w-full object-cover"
            />
            <figcaption className="absolute left-0 top-0 border-b border-r border-line bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-2.5 py-1.5 font-mono text-[0.5625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-muted backdrop-blur-[2px]">
              {trains.length} running
            </figcaption>
          </figure>
        </div>

        <div className={`min-w-0 lg:col-span-6 ${flipped ? 'lg:order-1' : ''}`}>
          <Eyebrow as="p">{category.tagline}</Eyebrow>
          <h2
            id={`cat-${category.id}`}
            className="mt-2 font-display text-[2rem] font-medium leading-tight text-fg sm:text-[2.5rem]"
          >
            {category.name}
          </h2>
          <p className="mt-3 max-w-prose text-sm leading-6 text-fg-muted">{category.description}</p>

          <ul className="mt-5 border-t border-line-strong">
            {trains.map((train) => (
              <ServiceRow key={train.number} train={train} onOpen={onOpen} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Trains({ initialCategory, onOpenTrainDetail }) {
  const { t } = useLanguage()
  const { trains } = useNetwork()
  const { selectTrain } = useSelection()

  const [query, setQuery] = useState('')
  const [active, setActive] = useState(initialCategory ?? 'all')

  // Only classes that actually have a service running are offered.
  const populated = useMemo(() => {
    const names = new Set(trains.map((train) => train.category))
    return trainCategories.filter((category) => names.has(category.name))
  }, [trains])

  const filtered = useMemo(() => trains.filter((train) => matches(train, query)), [trains, query])

  const bands = useMemo(() => {
    const list = active === 'all' ? populated : populated.filter((c) => c.id === active)
    return list
      .map((category) => ({
        category,
        trains: filtered.filter((train) => train.category === category.name),
      }))
      .filter((band) => band.trains.length)
  }, [populated, active, filtered])

  // Browsing is a search context: picking a service opens its record, the
  // same page a search result opens (§7). Selecting it as well keeps the map
  // and the assistant pointed at the same train.
  const openTrain = (number) => {
    selectTrain(number)
    onOpenTrainDetail?.(number)
  }

  return (
    <>
      <header className="border-b border-line bg-page">
        <div className="mx-auto max-w-[1320px] px-4 pb-6 pt-10 sm:px-6 lg:pb-8 lg:pt-14">
          <Eyebrow as="p">{t('trains.eyebrow')}</Eyebrow>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h1 className="max-w-[16ch] font-display text-[2.5rem] font-medium leading-[1.05] text-fg sm:text-[3.25rem]">
              {t('trains.title')}
            </h1>
            <p className="max-w-sm text-sm leading-6 text-fg-muted">{t('trains.lead')}</p>
          </div>

          {/* Search + class filter, on one rule. */}
          <div className="mt-8 border-t border-line-strong pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-0 flex-1 sm:max-w-sm">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('trains.searchPlaceholder')}
                  aria-label={t('trains.searchLabel')}
                  className="w-full border border-line bg-surface py-2.5 pl-9 pr-8 text-sm text-fg outline-none placeholder:text-fg-subtle focus-visible:border-brand"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={t('trains.clearSearch')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[{ id: 'all', name: t('trains.allClasses') }, ...populated].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    aria-pressed={active === item.id}
                    className={`border px-2.5 py-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] transition-colors ${
                      active === item.id
                        ? 'border-fg bg-fg text-page'
                        : 'border-line text-fg-subtle hover:border-line-strong hover:text-fg'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
              {filtered.length} {t('trains.servicesRunning')} · {t('common.simulated')}
            </p>
          </div>
        </div>
      </header>

      {bands.length ? (
        bands.map((band, index) => (
          <CategoryBand
            key={band.category.id}
            category={band.category}
            trains={band.trains}
            flipped={index % 2 === 1}
            onOpen={openTrain}
          />
        ))
      ) : (
        <div className="border-b border-line bg-page">
          <div className="mx-auto max-w-[1320px] px-4 py-20 text-center sm:px-6">
            <p className="font-mono text-[0.75rem] uppercase tracking-[var(--tracking-rail)] text-fg">
              {t('trains.emptyTitle')}
            </p>
            <p className="mt-2 text-sm text-fg-muted">{t('trains.emptyBody')}</p>
          </div>
        </div>
      )}
    </>
  )
}
