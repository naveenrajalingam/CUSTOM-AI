import { Fragment, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Capability } from '../content'
import { prefersReducedMotion } from '../lib/motion'
import { trackSpot } from '../lib/spot'
import { CardArt } from './CardArt'
import { Spotlight } from './Spotlight'

gsap.registerPlugin(ScrollTrigger)

// A side-scrolling film strip: scrolling down pins the screen and slides a row
// of glass cards across it, in groups, each opened by a title panel. The card
// nearest the centre is in focus; a progress line per group fills underneath.

type Accent = 'signal' | 'amber'
type Group = { title: string; caption: string; items: Capability[] }

const tone: Record<Accent, { text: string; color: string; bar: string }> = {
  signal: { text: 'text-signal', color: 'var(--color-signal)', bar: 'bg-signal' },
  amber: { text: 'text-amber', color: 'var(--color-amber)', bar: 'bg-amber' },
}

const CARD =
  'group relative flex h-[min(60svh,28rem)] w-[min(80vw,25rem)] shrink-0 flex-col overflow-hidden rounded-3xl p-7 ring-1 ring-[var(--line)] backdrop-blur-xl transition-[translate,box-shadow] duration-700 ease-[var(--ease-glide)] hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)] hover:ring-[var(--line-strong)] md:h-[min(62svh,30rem)] md:w-[min(34vw,27rem)] md:p-9'

function TitlePanel({ title, caption, accent }: { title: string; caption: string; accent: Accent }) {
  return (
    <div data-card="title" className="over-field flex w-[min(80vw,25rem)] shrink-0 flex-col justify-center md:w-[min(34vw,27rem)]">
      <span aria-hidden="true" className={`h-1 w-10 rounded-full ${tone[accent].bar}`} />
      <h3 className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)] text-paper">{title}</h3>
      <p className="mt-5 max-w-[30ch] text-[1rem] text-mist">{caption}</p>
    </div>
  )
}

export function Gallery({ accent, groups, className = '' }: { accent: Accent; groups: Group[]; className?: string }) {
  const outer = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const fills = useRef<(HTMLSpanElement | null)[]>([])
  const labels = useRef<(HTMLSpanElement | null)[]>([])
  const [distance, setDistance] = useState(0)

  // how far the strip travels: its overflow past the screen
  useEffect(() => {
    const measure = () => {
      const el = track.current
      if (el) setDistance(Math.max(0, el.scrollWidth - el.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current!)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = outer.current!
    const strip = track.current!
    const cards = [...strip.querySelectorAll<HTMLElement>('[data-card]')]
    const arts = cards.map((c) => c.querySelector<SVGElement>('svg'))
    const still = prefersReducedMotion()

    // where the page settles: each card centred (the first and last as near as the strip allows)
    const centres = cards.map((c) => c.offsetLeft + c.offsetWidth / 2)
    const mid = strip.clientWidth / 2
    const stops: number[] = []
    for (const c of centres) {
      const k = distance > 0 ? Math.min(1, Math.max(0, (c - mid) / distance)) : 0
      if (!stops.length || k - stops[stops.length - 1] > 0.05) stops.push(k)
    }
    el.dataset.stops = JSON.stringify(stops)

    // each later group starts at its title panel: the progress line splits there
    const starts = cards.flatMap((c, i) => (i > 0 && c.dataset.card === 'title' ? [i] : []))
    const splits = [0, ...starts.map((i) => (distance > 0 ? Math.min(0.95, Math.max(0.05, (centres[i] - mid) / distance)) : 0.5)), 1]

    const apply = (p: number) => {
      const x = p * distance
      strip.style.transform = `translate3d(${(-x).toFixed(1)}px, 0, 0)`
      for (let g = 0; g < splits.length - 1; g++) {
        const a = splits[g]
        const b = splits[g + 1]
        const k = Math.min(1, Math.max(0, (p - a) / (b - a)))
        const fill = fills.current[g]
        const label = labels.current[g]
        if (fill) fill.style.transform = `scaleX(${k.toFixed(4)})`
        if (label) label.style.color = p >= a && (p < b || g === splits.length - 2) ? 'var(--color-paper)' : 'var(--color-haze)'
      }
      if (still) return
      cards.forEach((c, i) => {
        const signed = (centres[i] - x - mid) / (strip.clientWidth * 0.75)
        // focus by light alone: scaling would make the gaps between cards uneven
        const focus = 1 - Math.min(1, Math.abs(signed))
        c.style.opacity = (0.4 + focus * 0.6).toFixed(3)
        // the drawing sits a little deeper than its card: it drifts against the
        // scroll, and comes into focus, glowing, as its card reaches the centre
        const art = arts[i]
        if (!art) return
        art.style.transform = `translate3d(${(signed * -36).toFixed(1)}px, 0, 0)`
        art.style.filter = `blur(${((1 - focus) * 3).toFixed(2)}px) drop-shadow(0 0 ${(3 + focus * 7).toFixed(1)}px color-mix(in srgb, currentColor ${Math.round(20 + focus * 40)}%, transparent))`
      })
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => apply(self.progress),
    })
    apply(st.progress)
    // the section's height just changed with the strip: re-measure every trigger below
    ScrollTrigger.refresh()
    return () => st.kill()
  }, [distance])

  const { text, color } = tone[accent]
  // cards are numbered straight through the groups
  const firstNumber = groups.map((_, g) => groups.slice(0, g).reduce((sum, gr) => sum + gr.items.length, 1))

  return (
    <div ref={outer} className={`relative ${className}`} style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16">
        <div
          ref={track}
          onPointerMove={trackSpot}
          className="flex items-center gap-5 px-[max(1.5rem,calc((100%-1320px)/2))] will-change-transform md:gap-8 md:px-[max(2.5rem,calc((100%-1320px)/2))]"
        >
          {groups.map((group, g) => (
            <Fragment key={group.title}>
              {g > 0 && (
                // a beam of light between the groups
                <div
                  aria-hidden="true"
                  className="relative mx-2 h-[min(46svh,22rem)] w-px shrink-0 md:mx-8"
                  style={{ background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }}
                >
                  <span
                    className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-[2px]"
                    style={{ background: color, boxShadow: `0 0 18px 4px ${color}` }}
                  />
                </div>
              )}
              <TitlePanel title={group.title} caption={group.caption} accent={accent} />
              {group.items.map((item, i) => {
                return (
                  <article
                    key={item.title}
                    data-card
                    data-spot
                    className={`${CARD} ${g % 2 ? 'bg-[linear-gradient(160deg,rgb(28_48_92/0.75),rgb(13_26_58/0.6))]' : 'bg-deep/60'}`}
                  >
                    <Spotlight color={color} />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-[3rem] opacity-20 blur-3xl"
                      style={{ background: color }}
                    />
                    <p className={`relative text-[0.8125rem] tracking-[0.14em] ${text}`}>{String(firstNumber[g] + i).padStart(2, '0')}</p>
                    <CardArt id={item.art} className={`relative my-3 min-h-0 w-full flex-1 ${text}`} />
                    <h4 className="display relative text-[clamp(1.6rem,2.4vw,2.25rem)] text-paper">{item.title}</h4>
                    <p className="relative mt-3 text-[1rem] text-mist md:text-[1.0625rem]">{item.body}</p>
                    <ul className="relative mt-4 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <li key={t} className="rounded-full bg-paper/[0.06] px-3 py-1 text-[0.8125rem] text-mist ring-1 ring-[var(--line)]">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </Fragment>
          ))}
        </div>

        {/* how far along the strip you are, one line per group */}
        <div className="mx-auto mt-10 flex w-full max-w-[1320px] gap-6 px-6 md:px-10 min-[1400px]:px-0" aria-hidden="true">
          {groups.map((group, i) => (
            <div key={group.title} className="w-32 md:w-40">
              <div className="h-px bg-[var(--line-strong)]">
                <span
                  ref={(node) => {
                    fills.current[i] = node
                  }}
                  className={`block h-px origin-left scale-x-0 ${tone[accent].bar}`}
                />
              </div>
              <span
                ref={(node) => {
                  labels.current[i] = node
                }}
                className="mt-3 block text-[0.8125rem] text-haze transition-colors duration-500"
              >
                {group.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
