import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

let lenis = null

/**
 * Starts Lenis and drives it from GSAP's ticker so ScrollTrigger and smooth
 * scrolling share one clock. Skipped entirely for reduced-motion users
 * (native scrolling is used instead). Returns a cleanup function.
 */
export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {}

  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2, // touch keeps native momentum scrolling
  })

  lenis.on('scroll', ScrollTrigger.update)

  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis
