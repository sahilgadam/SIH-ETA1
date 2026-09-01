import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, stagger, utils } from 'animejs'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { getSegmentStations } from '../../lib/eta'
import { cn } from '../../lib/cn'
import { IntermediateStations } from './IntermediateStations'

/** Minimum width of a closed segment — wide enough that station labels clear. */
const COLLAPSED_WIDTH = 148
/** Horizontal room given to each revealed intermediate station. */
const SLOT_WIDTH = 150
/** Half a station dot: how far the rail runs under the neighbouring nodes. */
const DOT_OVERHANG = 7

function expandedWidthFor(segment) {
  return (segment.intermediateStations.length + 1) * SLOT_WIDTH
}

/**
 * The clickable rail between two major stations.
 *
 * Closed it is a plain straight line. Clicking it widens the segment with
 * Anime.js and fades in the intermediate stations; clicking again collapses it.
 */
export function JourneySegment({
  segment,
  fromStation,
  toStation,
  isExpanded,
  onToggle,
  completedPercent,
  onLayoutTick,
  onExpanded,
}) {
  const { t } = useLanguage()
  const prefersReducedMotion = usePrefersReducedMotion()

  const elementRef = useRef(null)
  const animationRef = useRef(null)
  const isFirstRun = useRef(true)

  // Intermediates stay mounted while the segment animates closed.
  const [isMounted, setIsMounted] = useState(isExpanded)

  const count = segment.intermediateStations.length
  const panelId = `segment-${segment.id}-stations`
  const targetWidth = isExpanded ? expandedWidthFor(segment) : COLLAPSED_WIDTH

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (isFirstRun.current) {
      isFirstRun.current = false
      element.style.minWidth = `${targetWidth}px`
      return
    }

    if (isExpanded) setIsMounted(true)

    if (prefersReducedMotion) {
      element.style.minWidth = `${targetWidth}px`
      setIsMounted(isExpanded)
      onLayoutTick()
      if (isExpanded) onExpanded(element)
      return
    }

    animationRef.current?.pause()

    const box = { width: parseFloat(element.style.minWidth) || COLLAPSED_WIDTH }
    animationRef.current = animate(box, {
      width: targetWidth,
      duration: 340,
      ease: 'outQuad',
      onUpdate: () => {
        element.style.minWidth = `${box.width}px`
        onLayoutTick()
      },
      onComplete: () => {
        if (isExpanded) onExpanded(element)
        else setIsMounted(false)
      },
    })

    return () => animationRef.current?.pause()
    // onLayoutTick/onExpanded are stable callbacks from the timeline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, targetWidth, prefersReducedMotion])

  // Fade the revealed stations in and out.
  useLayoutEffect(() => {
    if (!isMounted) return
    const nodes = elementRef.current?.querySelectorAll('[data-intermediate]')
    if (!nodes?.length) return

    if (prefersReducedMotion) {
      utils.set(nodes, { opacity: isExpanded ? 1 : 0, translateY: 0 })
      return
    }

    if (isExpanded) {
      utils.set(nodes, { opacity: 0, translateY: 6 })
      animate(nodes, {
        opacity: 1,
        translateY: 0,
        duration: 260,
        delay: stagger(35, { start: 110 }),
        ease: 'outQuad',
      })
    } else {
      animate(nodes, { opacity: 0, duration: 150, ease: 'outQuad' })
    }
  }, [isMounted, isExpanded, prefersReducedMotion])

  const toggleLabel = t(isExpanded ? 'journey.hideStops' : 'journey.showStops', {
    count,
    from: fromStation.station,
    to: toStation.station,
  })

  return (
    <div
      ref={elementRef}
      className="relative h-3.5 flex-1"
      style={{ minWidth: COLLAPSED_WIDTH }}
    >
      {/* The rail runs under the neighbouring dots so the line never breaks. */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 -mt-[1.5px] h-[3px] bg-line"
        style={{ left: -DOT_OVERHANG, right: -DOT_OVERHANG }}
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 -mt-[1.5px] h-[3px] bg-brand"
        style={{
          left: -DOT_OVERHANG,
          width: `calc((100% + ${DOT_OVERHANG * 2}px) * ${completedPercent / 100})`,
        }}
      />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className={cn(
          'group absolute inset-x-0 top-1/2 z-20 h-11 -translate-y-1/2 rounded',
          'transition-colors duration-150 hover:bg-brand/[0.06] active:bg-brand/10',
        )}
      >
        <span className="sr-only">{toggleLabel}</span>

        {count > 0 ? (
          <span
            aria-hidden="true"
            className={cn(
              'absolute left-1/2 top-[calc(50%+5px)] inline-flex -translate-x-1/2 items-center gap-0.5',
              'rounded border bg-surface px-1 py-px text-[0.625rem] font-semibold tabular-nums',
              'transition-colors duration-150',
              isExpanded
                ? 'border-brand text-brand'
                : 'border-line text-fg-subtle group-hover:border-brand group-hover:text-brand',
            )}
          >
            <ChevronDown
              className={cn('size-2.5 transition-transform duration-200', isExpanded && 'rotate-180')}
            />
            {count}
          </span>
        ) : null}
      </button>

      {isMounted ? (
        <IntermediateStations id={panelId} stations={getSegmentStations(segment)} />
      ) : (
        <div id={panelId} hidden />
      )}
    </div>
  )
}
