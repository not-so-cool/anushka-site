import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../animations/gsap'

/**
 * 8 — ENDING
 * A timed sequence that plays once, when the section arrives. Every line before
 * the last big line appears, is held for its `hold` seconds, then dissolves.
 * The last big line, the small line and the heart then stay, and the group
 * breathes very slowly. Under reduced motion the same sequence plays as plain
 * fades, with no movement and no breathing.
 */
export default function Ending({ data }) {
  const root = useRef(null)

  // The last non-small line is where the sequence stops dissolving things.
  const finalIdx = Math.max(
    0,
    data.lines.reduce((acc, l, i) => (l.small ? acc : i), 0)
  )
  const transient = data.lines.slice(0, finalIdx)
  const finalGroup = data.lines.slice(finalIdx)

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

        gsap.set([...trans, ...finals, ...heart], { opacity: 0 })
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

        if (move) {
          // Created up front (paused) so the context can clean it up.
          const breathe = gsap
            .timeline({ paused: true, repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
            .to(group, { scale: 1.012, duration: 4.5 }, 0)
            .to(heart, { scale: 1.3, duration: 1.8 }, 0)
          tl.add(() => breathe.play())
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
        </div>
      </div>
    </section>
  )
}
