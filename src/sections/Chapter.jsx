import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import SplitText from '../components/SplitText'
import Print from '../components/Print'

const MASKS = {
  vertical: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  horizontal: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  rounded: ['inset(42% 42% 42% 42% round 50%)', 'inset(0% 0% 0% 0% round 0%)'],
  expand: ['inset(38% 38% 38% 38%)', 'inset(0% 0% 0% 0%)'],
}

/* Order matches data.chapter.photos: street, university, café, architecture, night. */
const LAYOUT = [
  {
    wrap: 'ml-[6vw] w-[62vw] md:ml-[8vw] md:w-[34vw]',
    aspect: '4 / 5', rot: -2, hover: -1.2, mask: 'horizontal', speed: 8, start: 88,
  },
  {
    wrap: 'z-10 -mt-[6vw] ml-auto mr-[6vw] w-[44vw] md:-mt-[22vw] md:mr-[10vw] md:w-[26vw]',
    aspect: '1 / 1', rot: 2.5, hover: 1.2, mask: 'rounded', speed: 22, start: 86,
  },
  {
    wrap: 'mt-[14vw] ml-[14vw] w-[70vw] md:mt-[6vw] md:ml-[30vw] md:w-[40vw]',
    aspect: '4 / 3', rot: 1, hover: 1, mask: 'expand', speed: 12, start: 85,
  },
  {
    wrap: 'z-10 mt-[10vw] ml-[6vw] w-[38vw] md:-mt-[16vw] md:w-[20vw]',
    aspect: '3 / 4', rot: -3, hover: -1.5, mask: 'vertical', speed: 32, start: 88,
  },
  {
    wrap: 'mt-[12vw] ml-auto mr-[8vw] w-[68vw] md:mt-[8vw] md:mr-[14vw] md:w-[36vw]',
    aspect: '5 / 4', rot: -1.5, hover: -1, mask: 'expand', speed: 16, start: 84,
  },
]

/**
 * 7 — HER NEW CHAPTER
 * Same visual language as the memory wall, but lighter and more open: fewer
 * prints, more air, no overlap-heavy stacking. It ends with a single line that
 * dissolves into plain ivory before the ending begins.
 */
export default function Chapter({ data }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // One shared trigger: every print reveals itself, one after another.
      const listTrigger = { trigger: q('[data-chapter-list]')[0], start: 'top 80%', once: true }
      q('[data-chapter-item]').forEach((item, i) => {
        const cfg = LAYOUT[i]
        if (!cfg) return
        const inner = item.querySelector('.print-inner')
        const img = item.querySelector('[data-print-photo] img')
        const cap = item.querySelector('.print-caption')
        const [from, to] = MASKS[cfg.mask]
        const enter = listTrigger

        gsap.fromTo(
          inner,
          { clipPath: from },
          {
            clipPath: to,
            duration: 1.7,
            delay: i * 0.4,
            ease: 'power3.inOut',
            scrollTrigger: enter,
            onComplete: () => gsap.set(inner, { clearProps: 'clipPath' }),
          }
        )

        if (cap && cap.dataset.mode === 'always') {
          cap.style.transition = 'none'
          gsap.fromTo(
            cap,
            { opacity: 0, y: -6 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              delay: 1.2 + i * 0.4,
              ease: 'power2.out',
              scrollTrigger: enter,
              onComplete: () => {
                cap.style.transition = ''
                gsap.set(cap, { clearProps: 'opacity,transform' })
              },
            }
          )
        }

        gsap.fromTo(
          item.querySelector('[data-chapter-move]'),
          { yPercent: cfg.speed },
          {
            yPercent: -cfg.speed,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )

        if (img) {
          gsap.set(img, { scale: 1.18 })
          gsap.fromTo(
            img,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        }
      })

      /* Closing line: rises word by word, then dissolves into plain ivory. */
      const words = q('[data-closing] .split-unit')
      gsap.set(words, { yPercent: 115 })
      gsap.to(words, {
        yPercent: 0,
        duration: 1.3,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-closing]')[0], start: 'top 85%', once: true },
      })

      gsap.to(q('[data-closing-wrap]'), {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: q('[data-closing-wrap]')[0],
          start: 'bottom 72%',
          end: 'bottom 40%',
          scrub: true,
        },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={root} aria-label="Her new chapter" className="relative bg-ivory pt-[14svh]">
      <div data-chapter-list className="relative pb-[10vw]">
        {data.photos.map((photo, i) => {
          const c = LAYOUT[i] ?? LAYOUT[0]
          return (
            <div key={photo.id} data-chapter-item className={`relative ${c.wrap}`}>
              <div data-chapter-move className="w-full">
                <Print
                  photo={photo}
                  aspect={c.aspect}
                  rotate={c.rot}
                  hoverDelta={c.hover}
                  captionMode="always"
                  className="w-full"
                />
              </div>
            </div>
          )
        })}
      </div>

      <div data-closing-wrap className="px-gutter pb-[32svh] pt-[16svh] text-center">
        <SplitText
          as="p"
          mask
          data-closing
          text={data.closing}
          className="mx-auto max-w-[12em] font-display text-title italic"
        />
      </div>
    </section>
  )
}
