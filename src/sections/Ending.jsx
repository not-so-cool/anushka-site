import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../animations/gsap'

export default function Ending({ data }) {
  const root = useRef(null)
  const blown = useRef(false)

  const finalIdx = Math.max(
    0,
    data.lines.reduce((acc, l, i) => (l.small ? acc : i), 0)
  )
  const transient = data.lines.slice(0, finalIdx)
  const finalGroup = data.lines.slice(finalIdx)

  const blow = () => {
    if (blown.current) return
    blown.current = true
    const q = gsap.utils.selector(root)
    const flame = q('[data-flame]')
    gsap.killTweensOf(flame)
    gsap
      .timeline()
      .to(
        flame,
        { scaleY: 0.15, scaleX: 0.5, opacity: 0, svgOrigin: '16 23', duration: 0.6, ease: 'power2.in' },
        0
      )
      .to(q('[data-candle-hint]'), { opacity: 0, duration: 0.5 }, 0)
      .to(q('[data-candle-after]'), { opacity: 1, y: 0, duration: 1.8, ease: 'power2.out' }, 0.7)
  }

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const move = ctx.conditions.motion
        const trans = q('[data-end-transient]')
        const finals = q('[data-end-final]')
        const heart = q('[data-heart]')
        const group = q('[data-end-group]')
        const candleWrap = q('[data-candle-wrap]')
        const flame = q('[data-flame]')
        const after = q('[data-candle-after]')

        gsap.set([...trans, ...finals, ...heart, ...candleWrap], { opacity: 0 })
        gsap.set(after, { opacity: 0, y: 10 })
        if (move) gsap.set([...trans, ...finals], { y: 14 })

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } })

        trans.forEach((el, i) => {
          const hold = data.lines[i].hold ?? 1.8
          tl.to(el, { opacity: 1, y: 0, duration: 1.6 })
            .to(el, { opacity: 0, y: move ? -10 : 0, duration: 1.2 }, `+=${hold}`)
            .to({}, { duration: 0.4 })
        })

        finals.forEach((el, i) => {
          const hold = data.lines[finalIdx + i].hold ?? 1.4
          tl.to(el, { opacity: 1, y: 0, duration: 1.6 }, i === 0 ? '+=0' : '+=0.2')
          tl.to({}, { duration: hold })
        })

        tl.to(heart, { opacity: 0.85, duration: 1.4 })
        tl.to(candleWrap, { opacity: 1, duration: 1.4 }, '+=0.6')

        if (move) {
          const flicker = gsap.to(flame, {
            scaleY: 1.1,
            rotation: 2.5,
            svgOrigin: '16 23',
            duration: 0.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            paused: true,
          })
          const breathe = gsap
            .timeline({ paused: true, repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
            .to(group, { scale: 1.012, duration: 4.5 }, 0)
            .to(heart, { scale: 1.3, duration: 1.8 }, 0)
          tl.add(() => {
            flicker.play()
            breathe.play()
          })
        }

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 30%',
          once: true,
          onEnter: () => tl.play(),
        })
      }
    )

    return () => mm.revert()
  }, [data, finalIdx])

  return (
    <section
      ref={root}
      data-snap
      aria-label="Ending"
      className="relative flex min-h-svh items-center justify-center px-gutter pb-[env(safe-area-inset-bottom)] text-center"
    >
      <div className="grid w-full place-items-center">
        {transient.map((line) => (
          <p
            key={line.text}
            data-end-transient
            className="col-start-1 row-start-1 max-w-[14em] font-display text-title italic"
          >
            {line.text}
          </p>
        ))}

        <div
          data-end-group
          className="col-start-1 row-start-1 flex flex-col items-center gap-[4svh]"
        >
          {finalGroup.map((line) =>
            line.small ? (
              <p key={line.text} data-end-final className="hand">
                {line.text}
              </p>
            ) : (
              <p
                key={line.text}
                data-end-final
                className="max-w-[14em] font-display text-title italic"
              >
                {line.text}
              </p>
            )
          )}
          <span data-heart aria-hidden="true" className="text-sm leading-none text-clay">
            {data.heart}
          </span>

          <div data-candle-wrap className="mt-[2svh] flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={blow}
              aria-label="Blow out the candle"
              className="relative h-20 w-10"
            >
              <svg viewBox="0 0 32 64" className="h-full w-full" fill="none" aria-hidden="true">
                <g data-flame>
                  <path
                    d="M16 4 C 21 12, 22 18, 16 23 C 10 18, 11 12, 16 4 Z"
                    className="fill-clay"
                  />
                </g>
                <line x1="16" y1="23" x2="16" y2="29" className="stroke-charcoal" strokeWidth="1" />
                <rect
                  x="11"
                  y="29"
                  width="10"
                  height="33"
                  rx="1"
                  className="fill-paper-deep stroke-charcoal/30"
                  strokeWidth="0.8"
                />
              </svg>
            </button>
            <p data-candle-hint className="hand">
              {data.candle.hint}
            </p>
            <p data-candle-after className="font-display text-lead italic">
              {data.candle.after}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}