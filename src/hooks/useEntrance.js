import { useLayoutEffect, useRef } from 'react'
import { animate, stagger, utils } from 'animejs'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Fades a group of elements in on mount. Children are selected with
 * `[data-enter]` so markup stays declarative.
 *
 * Runs in a layout effect: the elements are hidden and animated in the same
 * frame, so nothing flashes. Without JS the content simply stays visible.
 */
export function useEntrance({ delay = 0, distance = 10, each = 70 } = {}) {
  const containerRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const targets = container.querySelectorAll('[data-enter]')
    if (!targets.length) return

    if (prefersReducedMotion) {
      utils.set(targets, { opacity: 1, translateY: 0 })
      return
    }

    utils.set(targets, { opacity: 0, translateY: distance })

    const animation = animate(targets, {
      opacity: 1,
      translateY: 0,
      duration: 520,
      delay: stagger(each, { start: delay }),
      ease: 'outQuad',
    })

    return () => {
      animation.revert()
      utils.set(targets, { opacity: 1, translateY: 0 })
    }
  }, [delay, distance, each, prefersReducedMotion])

  return containerRef
}
