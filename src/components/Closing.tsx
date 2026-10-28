import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FRAME_PATH, MARK_VIEWBOX, SQUARES } from '../brand/mark'
import { closing, contactHref, site } from '../content'
import { CutLink } from './CutLink'
import { Emerge } from './Emerge'
import { RevealImage } from './RevealImage'

gsap.registerPlugin(ScrollTrigger)

/** The mark, very large and soft: its squares breaking out of the frame. */
function MarkArt() {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <rect width="1600" height="1000" fill="#0b1531" />
      <defs>
        <radialGradient id="closing-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34bde8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#34bde8" stopOpacity="0" />
        </radialGradient>
        <filter id="closing-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <ellipse cx="1080" cy="470" rx="560" ry="420" fill="url(#closing-glow)" />
      <svg x="820" y="180" width="560" height="560" viewBox={MARK_VIEWBOX} filter="url(#closing-soft)">
        <path d={FRAME_PATH} fill="#eef2f8" fillOpacity="0.1" stroke="#eef2f8" strokeOpacity="0.35" strokeWidth="0.6" />
        {SQUARES.map((s) => (
          <rect key={s.color} x={s.x} y={s.y} width={s.size} height={s.size} rx={s.rx} fill={s.color} fillOpacity="0.85" />
        ))}
      </svg>
    </svg>
  )
}

// The page ends on its promise, opening out of the mark, before the form.
export function Closing() {
  const ref = useRef<HTMLElement>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      // fully open well before it reaches the top, so the hand-over never shows an empty screen
      end: 'top 40%',
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })
    return () => st.kill()
  }, [])

  return (
    <section ref={ref} aria-labelledby="closing-title" data-stops="[0]" className="relative flex h-svh min-h-[600px] flex-col">
      <div className="absolute inset-0">
        <RevealImage progressRef={progressRef} focus={{ x: 0.68, y: 0.46 }} tint={0.2} className="absolute inset-0">
          <MarkArt />
        </RevealImage>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink" />
      </div>
      <div className="over-field relative flex flex-1 items-center px-6 pt-20 md:px-10">
        <div className="mx-auto w-full max-w-[1320px]">
          <Emerge start="top 100%" end="top 74%">
            <h2 id="closing-title" className="display max-w-[14ch] text-[clamp(2.6rem,6.5vw,6rem)]">
              {closing.title}
            </h2>
            <p className="measure mt-6 text-[1.125rem] text-mist md:text-[1.25rem]">{closing.body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <CutLink href={contactHref}>{closing.primary}</CutLink>
              <CutLink href={site.hrCentralUrl} target="_blank" rel="noopener noreferrer" variant="outline">
                {closing.secondary} <span aria-hidden="true">↗</span>
              </CutLink>
            </div>
          </Emerge>
        </div>
      </div>
    </section>
  )
}
