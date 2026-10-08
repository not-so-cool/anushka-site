import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import SplitText from '../components/SplitText'

export default function Screen({ data }) {
  const root = useRef(null)
  const videoRef = useRef(null)
  const [missing, setMissing] = useState(!data.videoSrc)
  const [needsSound, setNeedsSound] = useState(false)

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()

    // A hand-drawn-style line through the first word of the heading.
    const firstWord = q('[data-heading] .split-unit')[0]
    let line = null
    if (firstWord) {
      firstWord.style.position = 'relative'
      line = document.createElement('span')
      line.setAttribute('aria-hidden', 'true')
      line.className = 'absolute left-0 right-0 top-[58%] h-[0.055em] origin-left bg-charcoal'
      firstWord.appendChild(line)
    }

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const words = q('[data-heading] .split-unit')
      const tv = q('[data-tv]')
      const note = q('[data-note]')

      gsap.set(words, { yPercent: 115 })
      gsap.set(tv, { opacity: 0, y: 70, clipPath: 'inset(30% 12% 30% 12%)' })
      gsap.set(note, { opacity: 0 })
      if (line) gsap.set(line, { scaleX: 0 })

      const tl = gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root.current, start: 'top 60%', once: true },
        })
        .to(words, { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0)
        .to(
          tv,
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.8,
            ease: 'power3.inOut',
            onComplete: () => gsap.set(tv, { clearProps: 'clipPath' }),
          },
          0.6
        )
        .to(note, { opacity: 1, duration: 1.2 }, 2.2)

      if (line) tl.to(line, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 1.7)
    })

    return () => {
      mm.revert()
      if (line) line.remove()
      if (firstWord) firstWord.style.position = ''
    }
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let started = false
    let unlocked = false

    const tryPlay = () => {
      v.volume = 1
      v.muted = false
      const p = v.play()
      if (p && p.catch) {
        p.catch(() => {
          v.muted = true
          setNeedsSound(true)
          v.play().catch(() => {})
        })
      }
    }

    const EVENTS = ['click', 'touchend', 'keydown']
    const unlock = () => {
      EVENTS.forEach((e) => window.removeEventListener(e, unlock))
      if (unlocked || started) return
      unlocked = true
      v.volume = 0
      v.muted = false
      const restore = () => {
        v.volume = 1
      }
      const p = v.play()
      if (p && p.then) {
        p.then(() => {
          if (!started) {
            v.pause()
            v.currentTime = 0
          }
          restore()
        }).catch(restore)
      } else {
        restore()
      }
    }
    EVENTS.forEach((e) => window.addEventListener(e, unlock))

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6 && !started && !reduce) {
          started = true
          tryPlay()
        } else if (entry.intersectionRatio < 0.15 && !v.paused) {
          v.pause()
        }
      },
      { threshold: [0, 0.15, 0.6] }
    )
    io.observe(v)

    const onVolume = () => {
      if (!v.muted && v.volume > 0) setNeedsSound(false)
    }
    v.addEventListener('volumechange', onVolume)

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, unlock))
      io.disconnect()
      v.removeEventListener('volumechange', onVolume)
    }
  }, [missing])

  const turnOnSound = () => {
    const v = videoRef.current
    if (!v) return
    v.volume = 1
    v.muted = false
    setNeedsSound(false)
    v.play().catch(() => {})
  }

  return (
    <section
      ref={root}
      aria-labelledby="screen-heading"
      className="relative px-gutter pb-[22svh] pt-[18svh]"
    >
      <SplitText
        as="h2"
        mask
        id="screen-heading"
        data-heading
        text={data.heading}
        className="font-display text-title"
      />

      <div
        data-tv
        className="mx-auto mt-[8svh] w-[min(92vw,64rem)] rounded-[1.1rem] bg-charcoal p-[clamp(8px,1.4vw,18px)] shadow-[0_30px_50px_-30px_rgb(35_33_30/0.55)]"
      >
        <div className="relative aspect-video overflow-hidden rounded-[0.55rem] bg-[#1c1b19]">
          {missing ? (
            <div className="absolute inset-0 grid place-items-center px-6 text-center">
              <p className="font-sans text-note uppercase text-ivory/60">
                ADD VIDEO → /public{data.videoSrc || '/videos/birthday.mp4'}
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={data.videoSrc}
                poster={data.poster || undefined}
                title={data.title}
                controls
                playsInline
                preload="auto"
                onError={() => setMissing(true)}
                className="absolute inset-0 h-full w-full bg-black object-contain"
              />
              {needsSound ? (
                <button
                  type="button"
                  onClick={turnOnSound}
                  className="absolute left-4 top-4 rounded-full bg-ivory/90 px-4 py-2 font-sans text-note uppercase text-charcoal"
                >
                  tap for sound
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>

      <p data-note className="hand mt-[4svh] text-center">
        {data.note}
      </p>
    </section>
  )
}