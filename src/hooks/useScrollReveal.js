import { useEffect, useRef } from 'react'
import { animate, utils } from 'animejs'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Scroll-triggered counterpart to `useEntrance`: elements marked
 * `[data-reveal]` fade and lift into place the first time they cross into
 * the viewport, then are left alone. Meant for editorial sections further
 * down a page, where animating everything in at mount would be both wrong
 * (nothing is visible yet) and wasted motion.
 */
export function useScrollReveal({ distance = 16, each = 60, threshold = 0.2 } = {}) {
  const containerRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const targets = Array.from(container.querySelectorAll('[data-reveal]'))
    if (!targets.length) return

    if (prefersReducedMotion) {
      utils.set(targets, { opacity: 1, translateY: 0 })
      return
    }

    utils.set(targets, { opacity: 0, translateY: distance })

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => {
            const index = Math.max(targets.indexOf(entry.target), 0)
            animate(entry.target, {
              opacity: 1,
              translateY: 0,
              duration: 720,
              delay: (index % 6) * each,
              ease: 'outQuad',
            })
            observer.unobserve(entry.target)
          })
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [distance, each, threshold, prefersReducedMotion])

  return containerRef
}
