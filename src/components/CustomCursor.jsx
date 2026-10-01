import { useEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'

/**
 * Subtle circular cursor, desktop (fine pointer + hover) only.
 * Expands over any element marked data-cursor="view" and shows a label.
 */
export default function CustomCursor({ label = 'view memory' }) {
  const wrap = useRef(null)
  const ring = useRef(null)
  const disc = useRef(null)
  const text = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!fine.matches) return undefined

    const root = document.documentElement
    const el = wrap.current

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })
    gsap.set(disc.current, { scale: 14 / 84, opacity: 0 })
    gsap.set(text.current, { opacity: 0 })

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })

    let visible = false
    let over = false
    let lastX = 0
    let lastY = 0
    let raf = 0

    const setOver = (on) => {
      if (on === over) return
      over = on
      gsap.to(ring.current, { opacity: on ? 0 : 1, duration: 0.25, overwrite: true })
      gsap.to(disc.current, {
        scale: on ? 1 : 14 / 84,
        opacity: on ? 1 : 0,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: true,
      })
      gsap.to(text.current, {
        opacity: on ? 1 : 0,
        duration: 0.3,
        delay: on ? 0.15 : 0,
        overwrite: true,
      })
    }

    const isPhoto = (node) =>
      !!(node && node.closest && node.closest('[data-cursor="view"]'))

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      lastX = e.clientX
      lastY = e.clientY
      if (!visible) {
        visible = true
        gsap.set(el, { x: lastX, y: lastY })
        gsap.to(el, { opacity: 1, duration: 0.4 })
      }
      xTo(lastX)
      yTo(lastY)
    }

    const onOver = (e) => setOver(isPhoto(e.target))

    // Photos move under a still pointer while scrolling — re-check on scroll.
    const onScroll = () => {
      if (!visible || raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        setOver(isPhoto(document.elementFromPoint(lastX, lastY)))
      })
    }

    const onLeave = () => {
      visible = false
      gsap.to(el, { opacity: 0, duration: 0.3 })
      setOver(false)
    }

    root.classList.add('has-cursor')
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerover', onOver)
    root.addEventListener('mouseleave', onLeave)

    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerover', onOver)
      root.removeEventListener('mouseleave', onLeave)
      if (raf) window.cancelAnimationFrame(raf)
      gsap.killTweensOf([el, ring.current, disc.current, text.current])
    }
  }, [])

  return (
    <div ref={wrap} className="cursor" aria-hidden="true">
      <span ref={ring} className="cursor-ring" />
      <span ref={disc} className="cursor-disc" />
      <span ref={text} className="cursor-label">
        {label.split(' ').map((w, i) => (
          <span key={i} className="block">
            {w}
          </span>
        ))}
      </span>
    </div>
  )
}
