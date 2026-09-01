import { animate } from 'animejs'

/** Small horizontal nudge used to draw attention to an invalid field. */
export function shake(element) {
  if (!element) return
  animate(element, {
    translateX: [0, -4, 4, -2, 0],
    duration: 260,
    ease: 'outQuad',
  })
}

/** Rotate the swap control to an absolute angle, so repeat clicks keep turning. */
export function spin(element, rotation) {
  if (!element) return
  animate(element, {
    rotate: rotation,
    duration: 320,
    ease: 'outQuad',
  })
}
