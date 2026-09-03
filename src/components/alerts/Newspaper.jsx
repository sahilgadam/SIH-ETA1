import { useEffect, useMemo, useRef, useState } from 'react'
import { animate } from 'animejs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { getImage, srcSetFor } from '../../data/imagery'
import { SEVERITY } from '../../data/bulletins'
import { Mono } from '../ui/Mono'

/**
 * The operations bulletin, as a newspaper.
 *
 * Two pieces of motion, both of them things paper actually does:
 *
 *   FOLD    the sheet arrives folded along its horizontal crease and opens
 *           downward around that fold — a rotateX about the top edge, with
 *           perspective, so it reads as a broadsheet being opened rather than
 *           a panel fading in.
 *
 *   TURN    a page rotates about the spine. The new spread is rendered
 *           underneath first, and the outgoing leaf turns over on top of it,
 *           which is what makes the page appear to have two sides without
 *           building an actual double-sided 3D object.
 *
 * Under reduced motion both are replaced by an instant change; the paper is
 * open on arrival and pages simply swap.
 */

const SEVERITY_TONE = {
  danger: 'text-danger-text border-danger',
  caution: 'text-caution border-caution',
  brass: 'text-brass-text border-brass',
  ink: 'text-fg-muted border-line-strong',
}

function Rule({ heavy = false }) {
  return (
    <div
      aria-hidden="true"
      className={heavy ? 'my-2.5 h-0.5 w-full bg-fg' : 'my-2.5 h-px w-full bg-line-strong'}
    />
  )
}

function SeverityTag({ severity, live }) {
  const meta = SEVERITY[severity] ?? SEVERITY.info
  return (
    <p className="flex items-center gap-2">
      <span
        className={`border-l-2 pl-1.5 font-mono text-[0.5625rem] font-bold uppercase tracking-[var(--tracking-rail)] ${
          SEVERITY_TONE[meta.tone]
        }`}
      >
        {meta.label}
      </span>
      {live ? (
        <span className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
          from live state
        </span>
      ) : null}
    </p>
  )
}

/** One story, set at the weight its position calls for. */
function Story({ story, compact = false }) {
  const image = story.image ? getImage(story.image) : null
  const lead = story.weight === 'lead'
  const feature = story.weight === 'feature'

  return (
    <article className="break-inside-avoid">
      <SeverityTag severity={story.severity} live={story.live} />

      <h3
        className={`mt-1.5 font-display font-medium leading-[1.1] text-fg ${
          lead
            ? 'text-[1.75rem] sm:text-[2.15rem]'
            : feature
              ? 'text-[1.35rem] sm:text-[1.6rem]'
              : compact
                ? 'text-[1rem]'
                : 'text-[1.15rem]'
        }`}
      >
        {story.headline}
      </h3>

      {image && (lead || feature) ? (
        <figure className="mt-3 m-0">
          <img
            src={image.src}
            srcSet={srcSetFor(image)}
            sizes="(max-width: 1024px) 100vw, 32vw"
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="w-full object-cover grayscale-[0.35] sepia-[0.18]"
            style={{ aspectRatio: lead ? '16 / 9' : '4 / 3' }}
          />
          <figcaption className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            {image.caption}
          </figcaption>
        </figure>
      ) : null}

      <p className={`mt-2 text-fg-muted ${lead ? 'text-[0.9375rem] leading-6' : 'text-[0.8125rem] leading-[1.55]'}`}>
        {story.standfirst}
      </p>

      {!compact
        ? story.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-2 text-[0.8125rem] leading-[1.55] text-fg-muted">
              {paragraph}
            </p>
          ))
        : null}

      <p className="mt-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        {story.section} · {story.place}
      </p>
    </article>
  )
}

/** A single printed page. */
function Page({ page, pageNumber, masthead, clock }) {
  const { t } = useLanguage()

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--paper)] px-5 py-5 sm:px-7">
      {masthead ? (
        <header>
          <p className="text-center font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            {t('alerts.mastheadKicker')}
          </p>
          <h2 className="mt-1 text-center font-display text-[2rem] font-medium leading-none text-fg sm:text-[2.6rem]">
            {t('alerts.mastheadTitle')}
          </h2>
          <Rule heavy />
          <p className="flex flex-wrap items-center justify-between gap-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
            <span>{t('alerts.edition')}</span>
            <span>{clock} IST</span>
            <span className="text-caution">{t('alerts.simulated')}</span>
          </p>
          <Rule />
        </header>
      ) : (
        <header>
          <p className="flex items-center justify-between font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            <span>{t('alerts.mastheadTitle')}</span>
            <span>{clock} IST</span>
          </p>
          <Rule />
        </header>
      )}

      {/* Newsprint columns. One on a narrow page, two once there is room. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="[column-gap:1.75rem] sm:[column-count:2] [&>*]:mb-5">
          {page.map((story, i) => (
            <Story key={story.id} story={story} compact={i > 1} />
          ))}
        </div>
      </div>

      <footer className="mt-3 shrink-0">
        <Rule />
        <p className="flex items-center justify-between font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
          <span>{t('alerts.footerNote')}</span>
          <Mono className="font-semibold">{pageNumber}</Mono>
        </p>
      </footer>
    </div>
  )
}

export function Newspaper({ stories, clock }) {
  const { t } = useLanguage()
  const prefersReducedMotion = usePrefersReducedMotion()

  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [turning, setTurning] = useState(null)

  const sheetRef = useRef(null)
  const leafRef = useRef(null)

  // Three stories to a page.
  const pages = useMemo(() => {
    const out = []
    for (let i = 0; i < stories.length; i += 3) out.push(stories.slice(i, i + 3))
    return out.length ? out : [[]]
  }, [stories])

  // Desktop reads a two-page spread; a narrow screen reads one page at a time.
  const [spreadMode, setSpreadMode] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const sync = () => setSpreadMode(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const step = spreadMode ? 2 : 1
  const lastIndex = Math.max(0, pages.length - step)

  // The unfold.
  useEffect(() => {
    if (!open || prefersReducedMotion || !sheetRef.current) return
    animate(sheetRef.current, {
      rotateX: [-82, 0],
      opacity: [0, 1],
      duration: 760,
      ease: 'outQuart',
    })
  }, [open, prefersReducedMotion])

  // The page turn: the outgoing leaf rotates about the spine over the top of
  // the spread that has already been swapped in beneath it.
  useEffect(() => {
    if (!turning || !leafRef.current) return
    const forward = turning.dir > 0
    const node = leafRef.current
    node.style.transformOrigin = forward ? 'left center' : 'right center'

    animate(node, {
      rotateY: forward ? [0, -172] : [0, 172],
      duration: 700,
      ease: 'inOutQuad',
      onComplete: () => setTurning(null),
    })
    animate(node, {
      opacity: [1, 1, 0],
      duration: 700,
      ease: 'linear',
    })
  }, [turning])

  const go = (dir) => {
    const next = Math.min(Math.max(index + dir * step, 0), lastIndex)
    if (next === index) return
    if (prefersReducedMotion) {
      setIndex(next)
      return
    }
    setTurning({ page: index, dir })
    setIndex(next)
  }

  // --- closed ------------------------------------------------------------
  if (!open) {
    const front = pages[0] ?? []
    return (
      <div className="mx-auto max-w-3xl" style={{ perspective: '2200px' }}>
        <div className="relative overflow-hidden border border-line-strong bg-[var(--paper)] shadow-[var(--shadow-warm-md)]">
          {/* The visible top half of a folded sheet. */}
          <div className="px-6 pb-0 pt-6">
            <p className="text-center font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
              {t('alerts.mastheadKicker')}
            </p>
            <h2 className="mt-1 text-center font-display text-[2.25rem] font-medium leading-none text-fg sm:text-[3rem]">
              {t('alerts.mastheadTitle')}
            </h2>
            <Rule heavy />
            <p className="flex flex-wrap items-center justify-between gap-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
              <span>{t('alerts.edition')}</span>
              <span>{clock} IST</span>
              <span className="text-caution">{t('alerts.simulated')}</span>
            </p>
            <Rule />

            {front[0] ? (
              <div className="pb-8">
                <SeverityTag severity={front[0].severity} live={front[0].live} />
                <h3 className="mt-1.5 font-display text-[1.6rem] font-medium leading-[1.12] text-fg sm:text-[2rem]">
                  {front[0].headline}
                </h3>
                <p className="mt-2 line-clamp-2 text-[0.875rem] leading-6 text-fg-muted">
                  {front[0].standfirst}
                </p>
              </div>
            ) : null}
          </div>

          {/* The crease, and the shadow the fold casts on the sheet below. */}
          <div
            aria-hidden="true"
            className="h-10 w-full"
            style={{
              background:
                'linear-gradient(to bottom, color-mix(in srgb, var(--fg) 16%, transparent) 0px, transparent 14px), var(--paper)',
            }}
          />
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 border border-fg bg-fg px-5 py-2.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-page transition-colors hover:bg-fg-muted"
          >
            {t('alerts.open')}
          </button>
          <p className="mt-2.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            {t('alerts.openHint')}
          </p>
        </div>
      </div>
    )
  }

  // --- open --------------------------------------------------------------
  const left = pages[index] ?? []
  const right = spreadMode ? (pages[index + 1] ?? null) : null
  const turningPage = turning ? (turning.dir > 0 ? (pages[turning.page + (spreadMode ? 1 : 0)] ?? pages[turning.page]) : pages[turning.page]) : null

  return (
    <div style={{ perspective: '2400px' }}>
      <div
        ref={sheetRef}
        className="relative mx-auto max-w-6xl border border-line-strong shadow-[var(--shadow-warm-md)]"
        style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
      >
        <div className="grid lg:grid-cols-2">
          <div className="min-h-[34rem] lg:min-h-[40rem] lg:border-r lg:border-line-strong">
            <Page page={left} pageNumber={index + 1} masthead={index === 0} clock={clock} />
          </div>

          {right ? (
            <div className="hidden min-h-[40rem] lg:block">
              <Page page={right} pageNumber={index + 2} masthead={false} clock={clock} />
            </div>
          ) : null}
        </div>

        {/* The turning leaf, over the spread that is already in place. */}
        {turningPage ? (
          <div
            ref={leafRef}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 w-full lg:w-1/2 ${
              turning.dir > 0 ? 'right-0' : 'left-0'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              boxShadow: '0 0 40px rgb(61 48 40 / 0.22)',
            }}
          >
            <Page page={turningPage} pageNumber={turning.page + 1} masthead={false} clock={clock} />
          </div>
        ) : null}
      </div>

      {/* Paging */}
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex items-center gap-1.5 border border-line-strong px-3 py-2 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg transition-colors hover:border-brand disabled:opacity-35"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          {t('alerts.prev')}
        </button>

        <p aria-live="polite" className="font-mono text-[0.625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
          {t('alerts.pageOf', { a: index + 1, b: pages.length })}
        </p>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={index >= lastIndex}
          className="flex items-center gap-1.5 border border-line-strong px-3 py-2 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg transition-colors hover:border-brand disabled:opacity-35"
        >
          {t('alerts.next')}
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            setIndex(0)
          }}
          className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle underline hover:text-fg"
        >
          {t('alerts.fold')}
        </button>
      </div>
    </div>
  )
}
