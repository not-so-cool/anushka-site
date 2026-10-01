import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import SplitText from '../components/SplitText'

/**
 * 1 — OPENING
 * Intro: a charcoal curtain dissolves (the "background fades in"), ANUSHKA rises
 * letter by letter, then subtitle, tagline and hint arrive one after another.
 * Scroll: the letters spread outward, the whole block drifts up and dissolves,
 * so the typography travels away instead of vanishing.
 */
export default function Opening({ data }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { motion } = ctx.conditions
        const curtain = q('[data-curtain]')
        const chars = q('[data-title] .split-unit')
        const drift = q('[data-drift]')
        const sub = q('[data-sub]')
        const tagline = q('[data-tagline]')
        const hintWrap = q('[data-hint-wrap]')
        const hint = q('[data-hint]')

        if (!motion) {
          gsap.set(curtain, { display: 'none' })
          gsap.from([...q('[data-title]'), sub, tagline, hint], {
            opacity: 0,
            duration: 1.4,
            stagger: 0.35,
            ease: 'none',
          })
          return
        }

        /* ---------- Intro ---------- */
        gsap.set(chars, { yPercent: 115, opacity: 0 })
        gsap.set(sub, { opacity: 0, y: 26 })
        gsap.set(tagline, { opacity: 0, y: 14 })
        gsap.set(hint, { opacity: 0 })

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
        intro
          .to(curtain, { opacity: 0, duration: 2.8, ease: 'power1.inOut' }, 0)
          .to(chars, { yPercent: 0, opacity: 1, duration: 1.5, stagger: 0.11 }, 1.4)
          .to(sub, { opacity: 1, y: 0, duration: 1.6 }, 3.2)
          .to(tagline, { opacity: 1, y: 0, duration: 1.6 }, 4.3)
          .to(hint, { opacity: 1, duration: 1.4 }, 5.4)
          .set(curtain, { display: 'none' })

        gsap.to(hint, {
          y: 7,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 6,
        })

        /* ---------- Scroll: typography travels away ---------- */
        const n = chars.length
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .to(chars, { x: (i) => (i - (n - 1) / 2) * window.innerWidth * 0.05, duration: 1 }, 0)
          .to(drift, { y: () => -window.innerHeight * 0.2, duration: 1 }, 0)
          .to(drift, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 0.35)
          .to(hintWrap, { opacity: 0, duration: 0.2 }, 0)
      }
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={root}
      data-snap
      aria-label="Opening"
      className="relative flex h-svh min-h-[32rem] flex-col items-center justify-center px-gutter text-center"
    >
      <div
        data-curtain
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[8500] bg-charcoal"
      />

      <div data-drift className="flex flex-col items-center">
        <SplitText
          as="h1"
          by="char"
          mask
          data-title
          text={data.title}
          className="whitespace-nowrap font-display text-[length:clamp(3.5rem,17vw,17rem)] leading-[1] tracking-[-0.01em]"
        />
        <p data-sub className="mt-[3vh] font-display text-lead italic text-charcoal-soft">
          {data.subtitle}
        </p>
        <p data-tagline className="hand mt-4">
          {data.tagline}
        </p>
      </div>

      <div
        data-hint-wrap
        className="absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] flex justify-center"
      >
        <p data-hint className="font-sans text-note uppercase text-charcoal-soft">
          {data.hint}
        </p>
      </div>
    </section>
  )
}
