import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import SplitText from '../components/SplitText'

/* Staggered indents so the list reads like a scattered thought, not a column. */
const INDENTS = [
  'ml-0',
  'ml-[8vw] md:ml-[14vw]',
  'ml-[3vw] md:ml-[4vw]',
  'ml-[12vw] md:ml-[28vw]',
  'ml-[2vw] md:ml-[10vw]',
  'ml-[10vw] md:ml-[20vw]',
]

const FROM = {
  left: { x: '-9vw' },
  right: { x: '9vw' },
  up: { y: -46 },
  down: { y: 56 },
}

/**
 * 4 — THINGS I REMEMBER
 * As the section arrives, the heading rises and every line then enters by
 * itself from its own direction, one after another.
 */
export default function Remember({ data }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const words = q('[data-heading] .split-unit')
      const lines = q('[data-remember-line]')

      gsap.set(words, { yPercent: 115 })
      lines.forEach((el, i) => {
        const dir = FROM[data.lines[i]?.from] ?? FROM.up
        gsap.set(el, { opacity: 0, ...dir })
      })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: root.current, start: 'top 60%', once: true },
      })
      tl.to(words, { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0)
      lines.forEach((el, i) => {
        tl.to(el, { opacity: 1, x: 0, y: 0, duration: 1.5 }, 0.9 + i * 0.35)
      })
    })

    return () => mm.revert()
  }, [data.lines])

  return (
    <section
      ref={root}
      aria-labelledby="remember-heading"
      className="relative z-30 bg-ivory pb-[24svh] pl-gutter pr-gutter pt-[16svh]"
    >
      <SplitText
        as="h2"
        mask
        data-heading
        id="remember-heading"
        text={data.heading}
        className="font-display text-title"
      />

      <div className="mt-[10svh] flex flex-col gap-[6svh] md:gap-[7svh]">
        {data.lines.map((line, i) => (
          <p
            key={line.text}
            data-remember-line
            className={`max-w-[18em] font-display text-[length:clamp(1.75rem,4.4vw,4rem)] italic leading-[1.1] text-charcoal ${INDENTS[i] ?? ''}`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </section>
  )
}
