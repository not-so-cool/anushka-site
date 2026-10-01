import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import useReducedMotion from '../animations/useReducedMotion'
import Print from '../components/Print'

/* Four different mask reveals, applied to each print's frame. */
const MASKS = {
  vertical: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  horizontal: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  rounded: ['inset(42% 42% 42% 42% round 50%)', 'inset(0% 0% 0% 0% round 0%)'],
  expand: ['inset(38% 38% 38% 38%)', 'inset(0% 0% 0% 0%)'],
}

/* Asymmetric scatter. Mobile and desktop are composed separately with
   responsive margins/widths; some prints overlap on purpose. */
const SCATTER = [
  {
    wrap: 'ml-[7vw] w-[52vw] md:ml-[10vw] md:w-[30vw]',
    aspect: '4 / 5', rot: -2.5, hover: -1.2, mask: 'vertical', speed: 10, start: 90,
  },
  {
    wrap: 'z-10 -mt-[20vw] ml-auto mr-[5vw] w-[40vw] md:-mt-[14vw] md:ml-[32vw] md:mr-0 md:w-[22vw]',
    aspect: '1 / 1', rot: 3.5, hover: 1.2, mask: 'horizontal', speed: 26, start: 85,
  },
  {
    wrap: '-mt-[4vw] ml-[18vw] w-[32vw] md:-mt-[30vw] md:ml-auto md:mr-[9vw] md:w-[17vw]',
    aspect: '3 / 4', rot: -4, hover: -1.5, mask: 'rounded', speed: 42, start: 88,
  },
  {
    wrap: 'mt-[12vw] ml-auto mr-[4vw] w-[66vw] md:-mt-[4vw] md:ml-[26vw] md:mr-0 md:w-[44vw]',
    aspect: '4 / 3', rot: 1.2, hover: 1, mask: 'expand', speed: 14, start: 82,
  },
]

/* Horizontal strip: sizes in vw so the composition holds on any screen. */
const STRIP = [
  { w: 'w-[62vw] md:w-[26vw]', aspect: '4 / 5', rot: -2, mt: 'mt-[-6svh]' },
  { w: 'w-[76vw] md:w-[34vw]', aspect: '5 / 4', rot: 1.5, mt: 'mt-[14svh]' },
  { w: 'w-[60vw] md:w-[26vw]', aspect: '1 / 1', rot: -1, mt: 'mt-[-12svh]' },
  { w: 'w-[58vw] md:w-[23vw]', aspect: '3 / 4', rot: 2.5, mt: 'mt-[10svh]' },
]

/* The three prints start as one pile in the middle and fan out across the screen. */
const stackFinal = (wide) =>
  wide
    ? [
        { rotation: -6, xPercent: -88 },
        { rotation: 2, xPercent: 0 },
        { rotation: 5.5, xPercent: 88 },
      ]
    : [
        { rotation: -7, xPercent: -34 },
        { rotation: 2, xPercent: 0 },
        { rotation: 6, xPercent: 34 },
      ]
const STACK_START = [
  { rotation: -14, xPercent: 0, y: 160 },
  { rotation: 8, xPercent: 0, y: 200 },
  { rotation: -3, xPercent: 0, y: 240 },
]

/**
 * 3 — MEMORY WALL
 * A) scattered prints: masked reveals, each at its own scroll position, with the
 *    frame and the photo inside it drifting at different speeds.
 * B) a stack of three that rotates into place, scrubbed.
 * C) exactly ONE horizontal sequence: the strip pins and slides sideways while
 *    you scroll down.
 * The section is pulled up 30svh so its first prints rise beneath the shrinking "15".
 */
export default function MemoryWall({ data }) {
  const root = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
        wide: '(min-width: 768px)',
      },
      (ctx) => {
        const stackPrints = q('[data-stack-print]')
        const FINAL = stackFinal(ctx.conditions.wide)

        if (!ctx.conditions.motion) {
          // Static composition for reduced motion.
          gsap.set(stackPrints, {
            rotation: (i) => FINAL[i].rotation,
            xPercent: (i) => FINAL[i].xPercent,
          })
          return
        }

        /* ---------- A) scatter ---------- */
        // One shared trigger: all four prints reveal themselves, one after another.
        const scatterTrigger = { trigger: q('[data-scatter]')[0], start: 'top 80%', once: true }
        q('[data-wall-item]').forEach((item, i) => {
          const cfg = SCATTER[i]
          if (!cfg) return
          const inner = item.querySelector('.print-inner')
          const img = item.querySelector('[data-print-photo] img')
          const cap = item.querySelector('.print-caption')
          const [from, to] = MASKS[cfg.mask]

          gsap.fromTo(
            inner,
            { clipPath: from },
            {
              clipPath: to,
              duration: 1.7,
              delay: i * 0.4,
              ease: 'power3.inOut',
              scrollTrigger: scatterTrigger,
              onComplete: () => gsap.set(inner, { clearProps: 'clipPath' }),
            }
          )

          // The caption waits for the photo, then settles in.
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
                scrollTrigger: scatterTrigger,
                onComplete: () => {
                  cap.style.transition = ''
                  gsap.set(cap, { clearProps: 'opacity,transform' })
                },
              }
            )
          }

          // Frame drifts at one speed…
          gsap.fromTo(
            item.querySelector('[data-wall-move]'),
            { yPercent: cfg.speed },
            {
              yPercent: -cfg.speed,
              ease: 'none',
              scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
          // …and the photo inside drifts at another.
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

        /* ---------- B) stack that rotates into place ---------- */
        const stackTl = gsap.timeline({
          scrollTrigger: {
            trigger: q('[data-stack]')[0],
            start: 'top 80%',
            once: true,
          },
        })
        stackPrints.forEach((p, i) => {
          stackTl.fromTo(
            p,
            { opacity: 0, scale: 0.9, ...STACK_START[i] },
            { opacity: 1, scale: 1, y: 0, ...FINAL[i], duration: 1.5, ease: 'power3.out' },
            i * 0.45
          )
        })

        /* ---------- C) the ONE horizontal sequence ---------- */
        const strip = q('[data-strip]')[0]
        const track = q('[data-track]')[0]
        const travel = () => Math.max(0, track.scrollWidth - window.innerWidth)

        const slide = gsap.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: strip,
            start: 'top top',
            end: () => '+=' + travel(),
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        q('[data-strip-print]').forEach((item, i) => {
          const img = item.querySelector('[data-print-photo] img')
          if (img) {
            gsap.set(img, { scale: 1.25 })
            gsap.fromTo(
              img,
              { xPercent: -9 },
              {
                xPercent: 9,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  containerAnimation: slide,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              }
            )
          }
          gsap.fromTo(
            item,
            { yPercent: i % 2 ? 5 : -5 },
            {
              yPercent: i % 2 ? -5 : 5,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                containerAnimation: slide,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
        })
      }
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={root}
      aria-label="Memory wall"
      data-snap
      className="relative z-10"
    >
      <h2 className="sr-only">Memories</h2>

      {/* A) scatter */}
      <div data-scatter className="relative pb-[16vw] pt-[12svh]">
        {data.scatter.map((photo, i) => {
          const c = SCATTER[i] ?? SCATTER[0]
          return (
            <div key={photo.id} data-wall-item className={`relative ${c.wrap}`}>
              <div data-wall-move className="w-full">
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

      {/* B) stack: a pile that fans out, centred on its own screen */}
      <div className="flex min-h-[90svh] items-center justify-center overflow-x-clip py-[10svh]">
        <div data-stack className="relative aspect-[4/5] w-[52vw] md:w-[24vw]">
          {data.stack.map((photo) => (
            <div key={photo.id} data-stack-print className="absolute left-0 top-0 w-full">
              <Print photo={photo} aspect="4 / 5" captionMode="always" className="w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* C) the single horizontal sequence */}
      <div
        data-strip
        className={`relative h-svh min-h-[30rem] ${reduced ? 'overflow-x-auto' : 'overflow-hidden'}`}
        {...(reduced
          ? { tabIndex: 0, role: 'region', 'aria-label': 'Photo strip, scroll sideways' }
          : {})}
      >
        <div data-track className="flex h-full w-max items-center gap-[9vw] pl-[14vw] pr-[18vw]">
          {data.horizontal.map((photo, i) => {
            const s = STRIP[i] ?? STRIP[0]
            return (
              <div key={photo.id} data-strip-print className={`shrink-0 ${s.w} ${s.mt}`}>
                <Print photo={photo} aspect={s.aspect} rotate={s.rot} className="w-full" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
