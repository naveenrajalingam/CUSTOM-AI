import { useEffect, useRef, useState } from 'react'
import { SQUARES } from '../brand/mark'
import { hero } from '../content'
import { prefersReducedMotion, useInView } from '../lib/motion'

const delay = (s: number) => ({ animationDelay: `${s}s` })

/**
 * The hero, which fills the screen: the abstract network film plays behind the
 * headline, melting into the night at every edge and darkened behind the words
 * so they stay readable. The film loads just after first paint, fades in once
 * it is playing, and pauses off screen. With reduced motion it holds still on
 * its first frame.
 */
function NetworkFilm() {
  const box = useRef<HTMLDivElement>(null)
  const film = useRef<HTMLVideoElement>(null)
  const inView = useInView(box, '0px')
  const [calm] = useState(prefersReducedMotion)
  const [ready, setReady] = useState(false) // mounted after first paint
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 250)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const v = film.current
    if (!v || calm) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView, calm, ready])

  return (
    <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* the soft edges belong to this frame, so none of the film's edges ever shows */}
      <div className="feather-edges absolute inset-0 overflow-hidden">
        {ready && (
          <video
            ref={film}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1250ms] ease-[var(--ease-expo)] ${
              playing || calm ? 'opacity-90' : 'opacity-0'
            }`}
            src="/videos/hero-network-v2.mp4"
            muted
            loop
            playsInline
            preload={calm ? 'metadata' : 'auto'}
            onPlaying={() => setPlaying(true)}
          />
        )}
      </div>
      {/* the night deepens behind the words, so they read over the film */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-ink)_0%,rgb(8_17_40/0.82)_30%,rgb(8_17_40/0.25)_62%,transparent_85%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/5 bg-[linear-gradient(to_top,var(--color-ink),transparent)]" />
    </div>
  )
}

/**
 * The words above the film answer the scroll: going down, the tag, then each
 * word of the headline, then the line beneath lift away and fade one after
 * another (no blur here: blurring large text on every scroll frame is costly); coming back up, they return. Driven from refs in a
 * frame loop, never state; still with reduced motion. (The CSS entrance on load
 * animates the inner spans, so the drift is set on wrappers around them.)
 */
function useDrift(box: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = box.current
    if (!el || prefersReducedMotion()) return
    const parts = [...el.querySelectorAll<HTMLElement>('[data-drift]')]
    const n = parts.length
    let h = window.innerHeight
    const onResize = () => {
      h = window.innerHeight
    }
    let raf = 0
    let shown = -1
    const frame = () => {
      raf = 0
      const y = Math.min(window.scrollY, h)
      if (y === shown) return
      shown = y
      const t = y / (h * 0.55) // the whole drift is done a little past half a screen down
      parts.forEach((part, k) => {
        const p = Math.min(1, Math.max(0, t * 1.6 - (k / n) * 0.6))
        part.style.transform = p ? `translate3d(0, ${-p * 46}px, 0)` : ''
        part.style.opacity = p ? String(1 - p) : ''
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    frame()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [box])
}

export function Hero() {
  const words = useRef<HTMLDivElement>(null)
  useDrift(words)
  return (
    <header id={hero.id} className="relative flex min-h-svh items-center">
      <NetworkFilm />
      <div className="relative mx-auto w-full max-w-[1320px] px-6 pt-24 pb-16 md:px-10">
        <div ref={words} className="over-field max-w-[40rem]">
          <div data-drift className="will-change-transform">
            <p className="anim-stagger flex items-center gap-3 text-[0.9375rem] text-mist" style={delay(0.25)}>
              <span aria-hidden="true" className="flex gap-1">
                {SQUARES.map((s) => (
                  <span key={s.color} className="h-2 w-2 rounded-[2px]" style={{ background: s.color }} />
                ))}
              </span>
              {hero.tag}
            </p>
          </div>
          <h1 className="display mt-6 text-[clamp(2.6rem,6vw,5.5rem)] text-paper">
            {hero.title.map((line, i) => (
              <span key={line} className="block">
                <span className="anim-blur-rise inline-block" style={delay(0.35 + i * 0.16)}>
                  {line.split(' ').map((word, k, all) => (
                    <span key={k} data-drift className="inline-block will-change-transform">
                      {word}
                      {k < all.length - 1 ? '\u00a0' : ''}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>
          <div data-drift className="will-change-transform">
            <p className="anim-stagger measure mt-6 text-[1.125rem] text-mist md:mt-8 md:text-[1.25rem]" style={delay(0.6)}>
              {hero.lede}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
