import { useEffect } from 'react'
import { initSmoothScroll } from './smoothScroll'
import { initSectionSnap } from './sectionSnap'
import { setupScrollTriggerRefresh } from './gsap'

/** Call once, in App. Sets up Lenis, scene snapping and ScrollTrigger refresh. */
export default function useSmoothScroll() {
  useEffect(() => {
    const stopSmooth = initSmoothScroll()
    const stopSnap = initSectionSnap()
    const stopRefresh = setupScrollTriggerRefresh()
    return () => {
      stopSnap()
      stopSmooth()
      stopRefresh()
    }
  }, [])
}
