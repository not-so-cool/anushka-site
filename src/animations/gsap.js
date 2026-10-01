import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 1 })

// Mobile URL-bar show/hide should not trigger a full re-measure mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true })

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  )
}

/**
 * ScrollTrigger.refresh on load, font-ready, and (debounced) resize/orientation.
 * Returns a cleanup function.
 */
export function setupScrollTriggerRefresh() {
  let timer = null
  const refresh = () => ScrollTrigger.refresh()

  const onResize = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(refresh, 200)
  }

  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)

  if (document.readyState === 'complete') {
    refresh()
  } else {
    window.addEventListener('load', refresh, { once: true })
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh)
  }

  return () => {
    window.clearTimeout(timer)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('orientationchange', onResize)
    window.removeEventListener('load', refresh)
  }
}

export { gsap, ScrollTrigger }
