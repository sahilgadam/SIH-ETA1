import { Fragment, useEffect, useRef } from 'react'
import { useNetwork } from '../../context/NetworkProvider'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { formatClock, formatDuration, minutesUntil } from '../../lib/railSim'
import { Mono } from '../ui/Mono'

/**
 * The journey bookmark.
 *
 * The passenger's question is not "list the stops", it is "how far has my
 * train got". So the list is drawn as one running rail with the train's
 * position marked on it, and the rail itself changes character at that point:
 *
 *   REACHED    thick dark rail · filled nodes · full-strength type · actual times
 *   HERE NOW   the bookmark — a marker sitting between two calls, not on one
 *   UPCOMING   thin pale rail · hollow nodes · muted type · predicted times
 *
 * The boundary is the bookmark, and it moves as the simulation runs. Nothing
 * here is computed locally: `state` for every stop comes from the same
 * propagated chain the map draws, so the dark/light boundary on this list and
 * the dark/light boundary on the map are the same fact (§29).
 *
 * State is carried by weight, fill, thickness and label as well as colour, so
 * it survives being read without colour (§11).
 */

function StopNode({ state }) {
  if (state === 'past') {
    return <span className="block size-3 rounded-full bg-fg" aria-hidden="true" />
  }
  if (state === 'current') {
    return (
      <span className="relative block size-3.5" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-accent" />
        <span className="absolute -inset-1 rounded-full border border-accent opacity-45" />
      </span>
    )
  }
  if (state === 'next') {
    return (
      <span
        className="block size-3 rounded-full border-[2.5px] border-accent bg-page"
        aria-hidden="true"
      />
    )
  }
  return (
    <span className="block size-2.5 rounded-full border border-line-strong bg-page" aria-hidden="true" />
  )
}

/**
 * The bookmark itself: a squared brass tab clamped on the rail, carrying the
 * running speed. Square and clamped rather than a teardrop pin — it marks a
 * position on a line, which is not what a map pin means.
 */
function Bookmark({ train, innerRef }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const ref = useRef(null)

  // A slow drift along the section rather than a pulse: it should read as
  // "moving", not as "look at me".
  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return
    ref.current.style.transition = 'transform 900ms var(--ease-rail)'
    ref.current.style.transform = `translateY(${(train.progressInSection - 0.5) * 10}px)`
  }, [train.progressInSection, prefersReducedMotion])

  return (
    <li ref={innerRef} className="relative flex gap-3 py-1">
      <span className="flex w-3.5 shrink-0 justify-center" aria-hidden="true">
        {/* The rail continues behind the bookmark. */}
        <span className="w-[3px] bg-[linear-gradient(to_bottom,var(--fg),var(--line-strong))]" />
      </span>

      <div ref={ref} className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 border-l-[3px] border-brass bg-brass-soft px-3 py-2">
          <span className="flex size-6 shrink-0 items-center justify-center bg-brass" aria-hidden="true">
            <svg viewBox="-10 -6 20 12" className="size-4">
              <path d="M -7 -3.2 L 3.5 -3.2 L 7.2 0 L 3.5 3.2 L -7 3.2 Z" fill="var(--brass-soft)" />
            </svg>
          </span>

          <div className="min-w-0">
            <p className="font-mono text-[0.5625rem] font-bold uppercase tracking-[var(--tracking-rail)] text-brass-text">
              Train is here
            </p>
            <p className="mt-0.5 truncate font-mono text-[0.6875rem] text-fg">
              {train.phase === 'dwell' || train.phase === 'origin' ? (
                <>Standing at {train.atStation?.code}</>
              ) : (
                <>
                  {train.prevStation.code} → {train.nextStation.code}
                  <span className="mx-1.5 opacity-50">·</span>
                  {train.speedKmh} km/h
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

function Stop({ stop, minutes, isLast, highlighted }) {
  const past = stop.state === 'past'
  const upcoming = stop.state === 'upcoming' || stop.state === 'next'

  const time = stop.predictedArrMin ?? stop.predictedDepMin
  const booked = stop.bookedArrMin ?? stop.bookedDepMin
  const away = upcoming ? minutesUntil(time, minutes) : null

  return (
    <li className={`relative flex gap-3 ${highlighted ? 'bg-brand-soft' : ''}`}>
      {/* The rail. Thick and dark behind a reached stop, thin and pale ahead
          of one — the boundary is the whole point. */}
      <span className="flex w-3.5 shrink-0 flex-col items-center" aria-hidden="true">
        <span className={past ? 'h-2 w-[3px] bg-fg' : 'h-2 w-px bg-line-strong'} />
        <StopNode state={stop.state} />
        {!isLast ? (
          <span className={`w-full flex-1 ${past ? 'w-[3px] bg-fg' : 'w-px bg-line-strong'} mx-auto`} />
        ) : null}
      </span>

      <div className="min-w-0 flex-1 pb-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="min-w-0">
            <Mono
              className={`text-sm ${past ? 'font-bold text-fg' : stop.state === 'next' ? 'font-bold text-fg' : 'font-semibold text-fg-muted'}`}
            >
              {stop.code}
            </Mono>
            <span
              className={`ml-2 truncate text-[0.6875rem] ${past ? 'text-fg-muted' : 'text-fg-subtle'}`}
            >
              {stop.name}
            </span>
          </span>

          <span className="shrink-0 text-right">
            <Mono
              className={`block text-sm tabular-nums ${past ? 'font-semibold text-fg' : 'font-semibold text-fg-muted'}`}
            >
              {formatClock(time)}
            </Mono>
            {booked != null && time !== booked ? (
              <span className="font-mono text-[0.5625rem] tabular-nums text-fg-subtle line-through">
                {formatClock(booked)}
              </span>
            ) : null}
          </span>
        </div>

        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)]">
          <span className={past ? 'text-fg-muted' : 'text-fg-subtle'}>
            {past ? 'Departed' : stop.state === 'current' ? 'At platform' : stop.state === 'next' ? 'Next stop' : 'Upcoming'}
          </span>

          <span className={stop.delayMin > 0 ? 'text-caution' : 'text-brand-text'}>
            {stop.delayMin > 0 ? `+${stop.delayMin} min` : 'On time'}
          </span>

          {/* "in 18 min", so nobody has to subtract two clock times (§13). */}
          {away != null && away <= 600 ? (
            <span className="text-fg-muted">· in {formatDuration(away)}</span>
          ) : null}
        </p>
      </div>
    </li>
  )
}

export function JourneyBookmark({ train, highlightedStop }) {
  const { minutes } = useNetwork()
  const prefersReducedMotion = usePrefersReducedMotion()
  const bookmarkRef = useRef(null)

  // Open at the train's position rather than at the origin.
  //
  // The panel is only half the viewport, so a long route puts the bookmark
  // below the fold — which defeats the point of a bookmark. Scroll the list
  // so the train is centred whenever the selected service changes. Keyed on
  // the train number, not on the clock, so it does not fight the reader while
  // they scroll through the rest of the route.
  useEffect(() => {
    const el = bookmarkRef.current
    if (!el) return

    let parent = el.parentElement
    while (parent && parent.scrollHeight <= parent.clientHeight) parent = parent.parentElement
    if (!parent) return

    const elRect = el.getBoundingClientRect()
    const parentRect = parent.getBoundingClientRect()
    const delta = elRect.top - parentRect.top - (parent.clientHeight / 2 - elRect.height / 2)

    parent.scrollTo({
      top: Math.max(parent.scrollTop + delta, 0),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [train?.number, prefersReducedMotion])

  if (!train) return null

  // The bookmark is inserted between the last reached call and the next one,
  // which is exactly where the train physically is.
  const insertAfter = train.timeline.findIndex((stop) => stop.state === 'next') - 1

  return (
    <ol className="relative">
      {train.timeline.map((stop, i) => (
        // Fragment, not a wrapper element: only <li> may be a child of <ol>.
        <Fragment key={stop.code}>
          <Stop
            stop={stop}
            minutes={minutes}
            isLast={i === train.timeline.length - 1}
            highlighted={highlightedStop === stop.code}
          />
          {i === insertAfter ? <Bookmark train={train} innerRef={bookmarkRef} /> : null}
        </Fragment>
      ))}
    </ol>
  )
}
