import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate } from 'animejs'
import { useLanguage } from '../../context/LanguageProvider'
import { getMajorStations } from '../../lib/eta'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { JourneySegment } from './JourneySegment'
import { StationNode } from './StationNode'
import { TrainMarker } from './TrainMarker'

/**
 * The horizontal journey timeline: one straight, continuous rail through the
 * major stations, with a clickable segment between each pair.
 *
 * Only one segment is open at a time — the point of the collapsed view is that
 * the whole journey stays readable at a glance.
 */
export function JourneyTimeline({ journey }) {
  const { t } = useLanguage()
  const prefersReducedMotion = usePrefersReducedMotion()

  const [expandedSegmentId, setExpandedSegmentId] = useState(null)

  const scrollRef = useRef(null)
  const railRef = useRef(null)
  const markerRef = useRef(null)

  // Predictions resolved once for the whole rail.
  const majorStations = useMemo(() => getMajorStations(journey), [journey])

  // The marker tracks where the train IS, independent of any forecast ahead.
  const { segmentIndex: currentSegment, progress } = journey.current

  /** Distance in px from the rail's left edge to the train's position. */
  const measureMarkerX = useCallback(() => {
    const rail = railRef.current
    if (!rail) return null

    const railLeft = rail.getBoundingClientRect().left
    const centerOf = (code) => {
      const node = rail.querySelector(`[data-node="${code}"]`)
      if (!node) return null
      const rect = node.getBoundingClientRect()
      return rect.left + rect.width / 2 - railLeft
    }

    const from = centerOf(majorStations[currentSegment].code)
    const to = centerOf(majorStations[currentSegment + 1].code)
    if (from == null || to == null) return null

    return from + (to - from) * progress
  }, [majorStations, currentSegment, progress])

  const placeMarker = useCallback((x, withAnimation) => {
    const marker = markerRef.current
    if (!marker || x == null) return

    if (withAnimation) {
      animate(marker, { translateX: x, duration: 520, ease: 'outQuad' })
    } else {
      marker.style.transform = `translateX(${x}px)`
    }
  }, [])

  /** Called on every frame of a segment animation so the marker tracks the rail. */
  const handleLayoutTick = useCallback(() => {
    placeMarker(measureMarkerX(), false)
  }, [measureMarkerX, placeMarker])

  // Slide the train in from the origin when the journey first renders.
  useLayoutEffect(() => {
    const marker = markerRef.current
    const target = measureMarkerX()
    if (!marker || target == null) return

    if (prefersReducedMotion) {
      marker.style.transform = `translateX(${target}px)`
      marker.style.opacity = '1'
      return
    }

    const rail = railRef.current
    const originNode = rail?.querySelector(`[data-node="${majorStations[0].code}"]`)
    const originX = originNode
      ? originNode.getBoundingClientRect().left +
        originNode.getBoundingClientRect().width / 2 -
        rail.getBoundingClientRect().left
      : 0

    marker.style.transform = `translateX(${originX}px)`
    marker.style.opacity = '0'

    const animation = animate(marker, {
      translateX: target,
      opacity: 1,
      duration: 780,
      delay: 140,
      ease: 'outQuad',
    })

    return () => animation.revert()
  }, [majorStations, measureMarkerX, prefersReducedMotion])

  // Keep the marker glued to the rail when the viewport changes.
  useEffect(() => {
    const rail = railRef.current
    if (!rail || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => placeMarker(measureMarkerX(), false))
    observer.observe(rail)
    return () => observer.disconnect()
  }, [measureMarkerX, placeMarker])

  /** Bring a freshly opened segment into view without moving the page. */
  const handleExpanded = useCallback((segmentElement) => {
    const scroller = scrollRef.current
    if (!scroller || !segmentElement) return

    const segmentRect = segmentElement.getBoundingClientRect()
    const scrollerRect = scroller.getBoundingClientRect()
    if (segmentRect.left >= scrollerRect.left && segmentRect.right <= scrollerRect.right) return

    const offset =
      segmentRect.left -
      scrollerRect.left +
      scroller.scrollLeft -
      (scrollerRect.width - segmentRect.width) / 2

    scroller.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' })
  }, [])

  const lastIndex = majorStations.length - 1

  return (
    <section aria-labelledby="timeline-title" className="rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-4">
        <h2 id="timeline-title" className="text-base font-bold text-fg">
          {t('journey.timelineTitle')}
        </h2>
        <p className="text-xs text-fg-muted">{t('journey.timelineHint')}</p>
      </div>

      <div
        ref={scrollRef}
        tabIndex={0}
        role="group"
        aria-label={t('journey.timelineRegion')}
        className="overflow-x-auto overflow-y-hidden px-5"
      >
        <div className="min-w-full pb-36 pt-14">
          <div ref={railRef} className="relative flex items-center">
            {majorStations.map((station, index) => {
              const segment = journey.segments[index]
              const completedPercent =
                index < currentSegment ? 100 : index === currentSegment ? progress * 100 : 0

              return (
                <Fragment key={station.code}>
                  <StationNode
                    station={station}
                    align={index === 0 ? 'start' : index === lastIndex ? 'end' : 'center'}
                  />
                  {segment ? (
                    <JourneySegment
                      segment={segment}
                      fromStation={station}
                      toStation={majorStations[index + 1]}
                      isExpanded={expandedSegmentId === segment.id}
                      onToggle={() =>
                        setExpandedSegmentId((current) =>
                          current === segment.id ? null : segment.id,
                        )
                      }
                      completedPercent={completedPercent}
                      onLayoutTick={handleLayoutTick}
                      onExpanded={handleExpanded}
                    />
                  ) : null}
                </Fragment>
              )
            })}

            <TrainMarker
              markerRef={markerRef}
              label={t('journey.markerLabel', { train: journey.trainNumber })}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
