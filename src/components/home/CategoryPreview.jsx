import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { categorySrc, categorySrcSet, trainCategories } from '../../data/trainCategories'
import { formatClock } from '../../lib/railSim'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'

/**
 * Featured service classes on the landing page.
 *
 * A short, asymmetric preview — one lead plate and a run of smaller ones —
 * that answers "what kind of train am I looking for" and hands the passenger
 * to the Trains page for the full explorer. Deliberately not the timetable
 * that used to sit here: discovery first, running order on its own page.
 */

const FEATURED = ['vande-bharat', 'rajdhani', 'shatabdi', 'duronto']

function liveFor(categoryName, trains) {
  const matches = trains.filter((t) => t.category === categoryName)
  if (!matches.length) return null
  // The one furthest from its booked time is the interesting one to show.
  return [...matches].sort((a, b) => b.delayMin - a.delayMin)[0]
}

function LeadPlate({ category, train, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(category.id)}
      className="group relative block h-full w-full overflow-hidden border border-line bg-ground-sand text-left"
    >
      <img
        src={categorySrc(category.image)}
        srcSet={categorySrcSet(category.image)}
        sizes="(max-width: 1024px) 100vw, 52vw"
        alt={`${category.name} service`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[var(--motion-slow)] ease-[var(--ease-rail)] motion-safe:group-hover:scale-[1.03]"
      />

      {/* Three stops, not two: with a straight fade the eyebrow sat where the
          wash was still light and washed out against the pale livery. */}
      <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(20,43,35,0.95)_0%,rgba(20,43,35,0.78)_45%,transparent_100%)] p-5 pt-20">
        <Eyebrow as="p" className="text-brass-bright">
          {category.tagline}
        </Eyebrow>
        <h3 className="mt-1.5 font-display text-3xl font-medium text-on-deep">{category.name}</h3>

        {train ? (
          <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.6875rem] text-on-deep-muted">
            <Mono className="font-bold text-on-deep">{train.number}</Mono>
            <span>
              {train.origin.code} → {train.destination.code}
            </span>
            <span className="opacity-50">·</span>
            <span className={train.delayMin > 0 ? 'text-sig-amber' : 'text-sig-green'}>
              {train.delayMin > 0 ? `+${train.delayMin} min` : 'On time'}
            </span>
            <span className="opacity-50">·</span>
            <span>ETA {formatClock(train.etaMinutes)}</span>
          </p>
        ) : null}
      </div>
    </button>
  )
}

function SmallPlate({ category, train, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(category.id)}
      className="group grid w-full grid-cols-[7.5rem_1fr] items-stretch border border-line bg-surface text-left transition-colors hover:bg-sunken sm:grid-cols-[10rem_1fr]"
    >
      <span className="overflow-hidden bg-ground-sand">
        <img
          src={categorySrc(category.image)}
          srcSet={categorySrcSet(category.image)}
          sizes="10rem"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[var(--motion-slow)] ease-[var(--ease-rail)] motion-safe:group-hover:scale-[1.04]"
        />
      </span>

      <span className="min-w-0 p-3.5">
        <span className="flex items-baseline justify-between gap-2">
          <span className="font-display text-lg font-medium text-fg">{category.name}</span>
          <ArrowRight
            className="size-3.5 shrink-0 text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg"
            aria-hidden="true"
          />
        </span>
        <span className="mt-0.5 block text-[0.6875rem] text-fg-muted">{category.tagline}</span>

        {train ? (
          <span className="mt-2 flex items-center gap-2 font-mono text-[0.625rem] text-fg-subtle">
            <Mono className="font-semibold text-fg">{train.number}</Mono>
            <span className="inline-block h-px w-4 bg-line-strong" aria-hidden="true" />
            {train.destination.code}
            <span className={train.delayMin > 0 ? 'text-caution' : 'text-brand-text'}>
              {train.delayMin > 0 ? `+${train.delayMin}` : 'RT'}
            </span>
          </span>
        ) : null}
      </span>
    </button>
  )
}

export function CategoryPreview({ onOpenTrains }) {
  const { t } = useLanguage()
  const { trains } = useNetwork()
  const containerRef = useScrollReveal()

  const featured = FEATURED.map((id) => trainCategories.find((c) => c.id === id)).filter(Boolean)
  const [lead, ...rest] = featured

  return (
    <section
      id="categories"
      aria-labelledby="categories-title"
      className="scroll-mt-24 border-b border-line bg-page"
    >
      <div ref={containerRef} className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:py-18">
        <div
          data-reveal
          className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line-strong pb-4"
        >
          <div>
            <Eyebrow as="p">{t('home.classesEyebrow')}</Eyebrow>
            <h2 id="categories-title" className="mt-2 max-w-lg font-display text-3xl font-medium text-fg sm:text-4xl">
              {t('home.classesTitle')}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onOpenTrains()}
            className="flex items-center gap-2 border border-line-strong px-3.5 py-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg transition-colors hover:border-brand hover:bg-brand-soft"
          >
            {t('home.classesCta')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Asymmetric: one large plate carries the section, three smaller ones
            list beside it — not four identical cards in a row. */}
        <div data-reveal className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="min-h-[20rem] lg:col-span-7 lg:min-h-[26rem]">
            <LeadPlate category={lead} train={liveFor(lead.name, trains)} onOpen={onOpenTrains} />
          </div>

          <div className="flex flex-col gap-3 lg:col-span-5">
            {rest.map((category) => (
              <SmallPlate
                key={category.id}
                category={category}
                train={liveFor(category.name, trains)}
                onOpen={onOpenTrains}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
