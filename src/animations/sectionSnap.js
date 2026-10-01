import { getLenis } from './smoothScroll'
import { prefersReducedMotion } from './gsap'

/**
 * "One scroll = next scene."
 * Elements marked data-snap are scene starts. When the visitor is at (or just
 * before) one and makes a single scroll gesture (wheel / trackpad / arrow, page
 * keys, space), we glide to the neighbouring scene instead of nudging a few
 * pixels. Long free-scrolling stretches (memory wall, letter, chapter) are left
 * alone: a scene is only targeted when it is close enough to be "next".
 * Touch devices keep native swipe scrolling (no wheel events are fired there).
 */
export function initSectionSnap(selector = '[data-snap]') {
  const lenis = getLenis()
  if (!lenis || prefersReducedMotion()) return () => {}

  let busy = false
  let failsafe = 0
  let cooldown = 0

  const points = () =>
    Array.from(document.querySelectorAll(selector))
      .map((el) => el.getBoundingClientRect().top + window.scrollY)
      .sort((a, b) => a - b)

  const findTarget = (dir) => {
    const y = window.scrollY
    const vh = window.innerHeight
    const pts = points()
    if (!pts.length) return null

    let near = pts[0]
    let best = Infinity
    pts.forEach((p) => {
      const d = Math.abs(p - y)
      if (d < best) {
        best = d
        near = p
      }
    })

    // Not at a scene start: only pull in a scene that is just ahead.
    if (best > vh * 0.3) {
      if (dir > 0) {
        const n = pts.find((p) => p > y + 8)
        return n !== undefined && n - y < vh * 0.5 ? n : null
      }
      return null
    }

    if (dir > 0) {
      if (y < near - 8) return near
      const n = pts.find((p) => p > near + 8)
      return n !== undefined && n - near < vh * 1.2 ? n : null
    }
    if (y > near + 8) return near
    const p = [...pts].reverse().find((q) => q < near - 8)
    return p !== undefined && near - p < vh * 1.2 ? p : null
  }

  const release = () => {
    window.clearTimeout(failsafe)
    window.clearTimeout(cooldown)
    // wait out trackpad inertia before listening again
    cooldown = window.setTimeout(() => {
      busy = false
    }, 700)
  }

  const glide = (target) => {
    busy = true
    window.clearTimeout(cooldown)
    window.clearTimeout(failsafe)
    failsafe = window.setTimeout(release, 3200)
    lenis.scrollTo(target, {
      duration: 1.7,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      lock: true,
      force: true,
      onComplete: release,
    })
  }

  const onWheel = (e) => {
    if (e.ctrlKey) return // pinch-zoom
    if (busy) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (Math.abs(e.deltaY) < 4) return
    const target = findTarget(e.deltaY > 0 ? 1 : -1)
    if (target === null) return
    e.preventDefault()
    e.stopPropagation()
    glide(target)
  }

  const onKey = (e) => {
    const t = e.target
    if (t && t.tagName && /input|textarea|select/i.test(t.tagName)) return
    let dir = 0
    if (e.key === 'ArrowDown' || e.key === 'PageDown') dir = 1
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') dir = -1
    else if (e.key === ' ') dir = e.shiftKey ? -1 : 1
    if (!dir) return
    if (busy) {
      e.preventDefault()
      return
    }
    const target = findTarget(dir)
    if (target === null) return
    e.preventDefault()
    glide(target)
  }

  window.addEventListener('wheel', onWheel, { passive: false, capture: true })
  window.addEventListener('keydown', onKey)

  return () => {
    window.clearTimeout(failsafe)
    window.clearTimeout(cooldown)
    window.removeEventListener('wheel', onWheel, { capture: true })
    window.removeEventListener('keydown', onKey)
  }
}
