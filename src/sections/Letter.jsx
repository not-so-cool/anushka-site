import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import useReducedMotion from '../animations/useReducedMotion'
import SplitText from '../components/SplitText'

/**
 * 5 — A SMALL LETTER
 * The page warms from ivory to a slightly deeper paper tone as the section
 * arrives. Each paragraph then surfaces word by word (so it reads line by line
 * as it wraps) while the paragraphs already read settle back to a low opacity.
 * The sign-off stays lit, and the paper tone lifts again at the very end.
 */
export default function Letter({ data }) {
  const root = useRef(null)
  const reduced = useReducedMotion()

  const paragraphs = data.text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /* Paper tone in, and back out at the end (one timeline, length 10). */
      const bg = q('[data-letter-bg]')[0]
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top 85%',
            end: 'bottom 15%',
            scrub: true,
          },
        })
        .fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 1.5 })
        .to(bg, { opacity: 0, duration: 1.5 }, 8.5)

      /* Heading */
      const headingWords = q('[data-heading] .split-unit')
      gsap.set(headingWords, { yPercent: 115 })
      gsap.to(headingWords, {
        yPercent: 0,
        duration: 1.4,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-heading]')[0], start: 'top 82%', once: true },
      })

      /* Paragraphs: each one writes itself in (timed, not scrubbed) as it arrives */
      q('[data-letter-line]').forEach((el) => {
        const words = el.querySelectorAll('.split-unit')
        gsap.set(words, { opacity: 0 })
        gsap.set(el, { y: 18 })
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
          .to(el, { y: 0, duration: 1.6, ease: 'power3.out' }, 0)
          .to(
            words,
            {
              opacity: 1,
              duration: 0.9,
              ease: 'power1.out',
              stagger: { amount: Math.min(2.4, words.length * 0.09) },
            },
            0
          )
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={root}
      aria-labelledby="letter-heading"
      className="relative px-gutter pb-[26svh] pt-[16svh]"
    >
      <div
        data-letter-bg
        aria-hidden="true"
        className={`absolute inset-0 bg-paper ${reduced ? '' : 'opacity-0'}`}
      />

      <div className="relative">
        <SplitText
          as="h2"
          mask
          id="letter-heading"
          data-heading
          text={data.heading}
          className="font-display text-title"
        />

        <div className="mt-[8svh] flex flex-col gap-[5svh] md:ml-[16vw] md:max-w-[34em]">
          {paragraphs.map((p, i) => {
            const isFirst = i === 0
            const isLast = i === paragraphs.length - 1
            return (
              <SplitText
                key={i}
                as="p"
                data-letter-line
                text={p}
                className={`font-display text-letter text-charcoal ${
                  isFirst ? 'italic' : ''
                } ${isLast ? 'mt-[3svh] italic text-clay' : ''}`}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
