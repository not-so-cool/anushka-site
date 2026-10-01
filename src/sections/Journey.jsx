import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import useReducedMotion from '../animations/useReducedMotion'
import useMediaQuery from '../animations/useMediaQuery'
import SplitText from '../components/SplitText'
import Print from '../components/Print'

/* Two compositions of the same abstract map: wide (desktop) and tall (mobile). */
const VIEW = {
  wide: {
    w: 1000,
    h: 400,
    cols: 10,
    rows: 5,
    from: [720, 290],
    to: [230, 110],
    d: 'M720 290 C 620 110, 420 30, 230 110',
    fromSide: 'below',
    toSide: 'below',
  },
  tall: {
    w: 400,
    h: 600,
    cols: 5,
    rows: 8,
    from: [290, 470],
    to: [110, 120],
    d: 'M290 470 C 380 330, 60 300, 110 120',
    fromSide: 'below',
    toSide: 'above',
  },
}

function Graticule({ w, h, cols, rows }) {
  const xs = Array.from({ length: cols - 1 }, (_, i) => ((i + 1) * w) / cols)
  const ys = Array.from({ length: rows - 1 }, (_, i) => ((i + 1) * h) / rows)
  return (
    <g data-grat>
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none">
        {xs.map((x, i) => (
          <path key={`v${i}`} d={`M${x} 0 Q${x + w * 0.03} ${h / 2} ${x} ${h}`} />
        ))}
        {ys.map((y, i) => (
          <path key={`h${i}`} d={`M0 ${y} Q${w / 2} ${y - h * 0.04} ${w} ${y}`} />
        ))}
      </g>
    </g>
  )
}

function Label({ point, view, side, name, coords, which }) {
  const left = `${(point[0] / view.w) * 100}%`
  const top = `${(point[1] / view.h) * 100}%`
  const offset = side === 'above' ? '-translate-y-full -mt-4' : 'mt-4'
  return (
    <div className="absolute" style={{ left, top }}>
      <div
        data-label={which}
        className={`-translate-x-1/2 text-center ${offset}`}
      >
        <p className="font-sans text-note uppercase text-charcoal">{name}</p>
        <p className="mt-1 whitespace-nowrap font-sans text-[0.625rem] tracking-[0.12em] text-charcoal-soft">
          {coords}
        </p>
      </div>
    </div>
  )
}

function RouteMap({ kind, from, to, className }) {
  const v = VIEW[kind]
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${v.w} / ${v.h}` }}>
      <svg
        viewBox={`0 0 ${v.w} ${v.h}`}
        className="absolute inset-0 h-full w-full text-charcoal"
        fill="none"
        aria-hidden="true"
      >
        <Graticule w={v.w} h={v.h} cols={v.cols} rows={v.rows} />
        <path
          data-route-ghost
          d={v.d}
          className="stroke-charcoal"
          strokeWidth="1"
          strokeDasharray="2 7"
          opacity="0.22"
        />
        <path
          data-route-path
          d={v.d}
          pathLength="1"
          className="stroke-clay"
          strokeWidth="1.6"
          strokeLinecap="butt"
        />
        <g data-marker="from" data-ox={v.from[0]} data-oy={v.from[1]}>
          <circle cx={v.from[0]} cy={v.from[1]} r="4.5" className="fill-clay" />
          <circle cx={v.from[0]} cy={v.from[1]} r="11" className="stroke-clay" strokeWidth="0.8" opacity="0.5" />
        </g>
        <g data-marker="to" data-ox={v.to[0]} data-oy={v.to[1]}>
          <circle cx={v.to[0]} cy={v.to[1]} r="4.5" className="fill-clay" />
          <circle cx={v.to[0]} cy={v.to[1]} r="11" className="stroke-clay" strokeWidth="0.8" opacity="0.5" />
        </g>
      </svg>

      <Label point={v.from} view={v} side={v.fromSide} name={from.label} coords={from.coords} which="from" />
      <Label point={v.to} view={v} side={v.toSide} name={to.label} coords={to.coords} which="to" />
    </div>
  )
}

/**
 * 6 — INDIA → PARIS
 * Scene A (pinned): "And then you moved." lifts away, "India → Paris" appears,
 * the graticule fades up and a thin route line draws between two small markers.
 * Scene B: "Paris" rises letter by letter, a wide print opens out of a small
 * rectangle, and the closing line settles beneath.
 */
export default function Journey({ data }) {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 768px)')
  const { reveal } = data

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /* ---------- Scene A ---------- */
      const scene = q('[data-scene]')[0]
      const introWrap = q('[data-intro-wrap]')[0]
      const introWords = q('[data-intro] .split-unit')
      const titleWords = q('[data-route-title] .split-unit')
      const grat = q('[data-grat]')
      const ghosts = q('[data-route-ghost]')
      const paths = q('[data-route-path]')
      const fromMarkers = q('[data-marker="from"]')
      const toMarkers = q('[data-marker="to"]')
      const fromLabels = q('[data-label="from"]')
      const toLabels = q('[data-label="to"]')

      gsap.set(introWords, { yPercent: 115 })
      gsap.set(titleWords, { yPercent: 115 })
      gsap.set(grat, { opacity: 0 })
      gsap.set(ghosts, { opacity: 0 })
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set([...fromLabels, ...toLabels], { opacity: 0, y: 8 })
      ;[...fromMarkers, ...toMarkers].forEach((m) => {
        gsap.set(m, { svgOrigin: `${m.dataset.ox} ${m.dataset.oy}`, scale: 0 })
      })

      // The whole scene plays by itself once it comes up (about 7 seconds).
      gsap
        .timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: { trigger: scene, start: 'top 45%', once: true },
        })
        .to(introWords, { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0)
        .to(introWrap, { opacity: 0, y: -40, duration: 1, ease: 'power2.in' }, 1.9)
        .to(titleWords, { yPercent: 0, stagger: 0.18, duration: 1.2 }, 2.6)
        .to(grat, { opacity: 1, duration: 1.2 }, 2.8)
        .to(ghosts, { opacity: 0.22, duration: 1.2 }, 2.8)
        .to(fromMarkers, { scale: 1, duration: 0.7, ease: 'back.out(2)' }, 3.2)
        .to(fromLabels, { opacity: 1, y: 0, duration: 0.8 }, 3.3)
        .to(paths, { strokeDashoffset: 0, duration: 3, ease: 'power1.inOut' }, 3.9)
        .to(toMarkers, { scale: 1, duration: 0.7, ease: 'back.out(2)' }, 6.6)
        .to(toLabels, { opacity: 1, y: 0, duration: 0.8 }, 6.7)

      /* ---------- Scene B ---------- */
      const parisChars = q('[data-paris] .split-unit')
      gsap.set(parisChars, { yPercent: 115 })
      gsap.to(parisChars, {
        yPercent: 0,
        duration: 1.4,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-paris]')[0], start: 'top 88%', once: true },
      })

      gsap.fromTo(
        q('[data-dateline]'),
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.9,
          scrollTrigger: { trigger: q('[data-paris]')[0], start: 'top 88%', once: true },
        }
      )

      const heroWrap = q('[data-hero-print]')[0]
      const inner = heroWrap.querySelector('.print-inner')
      const img = heroWrap.querySelector('[data-print-photo] img')

      // A small rectangle opens into the full print.
      gsap.fromTo(
        inner,
        { clipPath: 'inset(34% 30% 34% 30%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 2,
          delay: 0.6,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: heroWrap, start: 'top 85%', once: true },
          // clip-path would also clip the print's shadow, so drop it once fully open
          onComplete: () => gsap.set(inner, { clearProps: 'clipPath' }),
        }
      )

      if (img) {
        gsap.set(img, { scale: 1.2 })
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: heroWrap, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      }

      const lineWords = q('[data-reveal-line] .split-unit')
      gsap.set(lineWords, { yPercent: 115 })
      gsap.to(lineWords, {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-reveal-line]')[0], start: 'top 88%', once: true },
      })
    })

    return () => mm.revert()
  }, [])

  const sceneClass = reduced
    ? 'relative flex flex-col items-center gap-[10svh] px-gutter py-[18svh] text-center'
    : 'relative h-svh min-h-[34rem]'
  const layerClass = reduced
    ? 'flex flex-col items-center'
    : 'absolute inset-0 flex flex-col items-center justify-center px-gutter'

  return (
    <section ref={root} aria-label="India to Paris" className="relative">
      {/* Scene A */}
      <div data-scene data-snap className={sceneClass}>
        <div data-intro-wrap className={layerClass}>
          <SplitText
            as="h2"
            mask
            data-intro
            text={data.intro}
            className="font-display text-title text-center"
          />
        </div>

        <div className={layerClass}>
          <SplitText
            as="h2"
            mask
            data-route-title
            text={data.route}
            className="mb-[4svh] text-center font-display text-title italic"
          />
          <RouteMap
            kind="wide"
            from={data.from}
            to={data.to}
            className="hidden w-[min(88vw,72rem)] md:block"
          />
          <RouteMap
            kind="tall"
            from={data.from}
            to={data.to}
            className="w-[70vw] max-w-[22rem] md:hidden"
          />
        </div>
      </div>

      {/* Scene B */}
      <div data-snap className="relative px-gutter pb-[24svh] pt-[8svh]">
        <div className="flex items-end justify-between gap-6">
          <SplitText
            as="h3"
            by="char"
            mask
            data-paris
            text={reveal.title}
            className="font-display text-display italic"
          />
          <p data-dateline className="hand pb-[2.5vw]">
            {reveal.dateline}
          </p>
        </div>

        <div data-hero-print className="mt-[3vw]">
          <Print
            photo={reveal.photo}
            aspect={wide ? '16 / 9' : '4 / 5'}
            rotate={0.6}
            hoverDelta={-0.6}
            className="w-full"
          />
        </div>

        <SplitText
          as="p"
          mask
          data-reveal-line
          text={reveal.line}
          className="mx-auto mt-[12svh] max-w-[16em] text-center font-display text-[length:clamp(1.75rem,4.4vw,4rem)] italic leading-[1.1]"
        />
      </div>
    </section>
  )
}
