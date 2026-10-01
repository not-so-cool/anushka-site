import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import SplitText from '../components/SplitText'
import Print from '../components/Print'

/* Positions keep clear of the centred text block on desktop and mobile. */
const PHOTO_LAYOUT = [
  {
    pos: 'left-[5%] top-[8%] w-[30vw] md:left-[7%] md:top-[13%] md:w-[16vw]',
    aspect: '4 / 5', rot: -4, hover: -1.5,
  },
  {
    pos: 'right-[6%] top-[13%] w-[26vw] md:right-[8%] md:top-[9%] md:w-[13vw]',
    aspect: '1 / 1', rot: 3, hover: 1.5,
  },
  {
    pos: 'bottom-[4%] left-[10%] w-[26vw] md:bottom-[8%] md:left-auto md:right-[5%] md:w-[13vw]',
    aspect: '3 / 4', rot: 2, hover: 1.2,
  },
]

/**
 * 2 — 15 YEARS
 * One scroll brings the section in and the whole thing plays by itself:
 * "15", then "years", the prints one after another, then the line.
 * As you leave, the numeral shrinks and the rest dissolves (scrubbed).
 */
export default function Years({ data }) {
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
        if (!ctx.conditions.motion) {
          gsap.from(q('[data-fifteen], [data-years], [data-line], [data-year-photo]'), {
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 60%', once: true },
          })
          return
        }

        const stage = q('[data-stage]')
        const numeral = q('[data-numeral]')
        const fifteen = q('[data-fifteen]')
        const yearsWords = q('[data-years] .split-unit')
        const lineWords = q('[data-line] .split-unit')
        const photos = q('[data-year-photo]')

        gsap.set(fifteen, { opacity: 0, y: 80, scale: 1.06 })
        gsap.set(yearsWords, { yPercent: 115 })
        gsap.set(lineWords, { yPercent: 115 })
        gsap.set(photos, { opacity: 0, y: 60 })

        // Plays once, on its own, as soon as the section comes up.
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: root.current, start: 'top 50%', once: true },
          })
          .to(fifteen, { opacity: 1, y: 0, scale: 1, duration: 2 }, 0)
          .to(yearsWords, { yPercent: 0, stagger: 0.15, duration: 1.2 }, 0.9)
          .to(photos, { opacity: 1, y: 0, stagger: 0.35, duration: 1.6 }, 1.5)
          .to(lineWords, { yPercent: 0, stagger: 0.06, duration: 1.2 }, 2.6)

        // Leaving: the numeral shrinks while everything else lets go.
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
          .to(numeral, { scale: 0.35, yPercent: -6, duration: 1, ease: 'power2.inOut' }, 0)
          .to(stage, { opacity: 0, duration: 0.8, ease: 'power1.in' }, 0.2)
      }
    )

    return () => mm.revert()
  }, [])

  return (
    <section ref={root} data-snap className="relative z-20 min-h-svh">
      <div
        data-stage
        className="absolute inset-0 flex items-center justify-center px-gutter"
      >
        {data.photos.map((photo, i) => {
          const L = PHOTO_LAYOUT[i] ?? PHOTO_LAYOUT[0]
          return (
            <div key={photo.id} data-year-photo className={`absolute ${L.pos}`}>
              <Print
                photo={photo}
                aspect={L.aspect}
                rotate={L.rot}
                hoverDelta={L.hover}
                className="w-full"
              />
            </div>
          )
        })}

        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 data-numeral className="flex flex-col items-center">
            <span
              data-fifteen
              className="font-display text-mega max-md:text-[length:clamp(9rem,62vw,20rem)]"
            >
              {data.number}
            </span>
            <SplitText
              as="span"
              mask
              data-years
              text={data.word}
              className="-mt-[1.5vw] block font-display text-title italic"
            />
          </h2>

          <SplitText
            as="p"
            mask
            data-line
            text={data.line}
            className="mt-6 max-w-[20em] font-display text-lead text-charcoal-soft"
          />
        </div>
      </div>
    </section>
  )
}
