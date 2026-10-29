import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { prefersReducedMotion, useInView } from '../lib/motion'
import { Emerge } from './Emerge'

// Under an Enterprise Intelligence module's lede, in the manner of HR Central's
// flow: what the module does as a row of icon tiles on a thin line, each named
// beneath. While on screen it steps through them every few seconds; the current
// tile lights up and a box pops up under it with its title and line. Pointing at
// a tile (or focusing it) jumps there and holds; moving away plays on. The
// pop-up's room is kept, so nothing shifts. `onActive` hears which tile is
// current, so a visual beside it can follow along; `accent` is the section's colour.
// With `autoplay` off it holds still: a tile lights and shows its box only while
// it is pointed at, focused or tapped.

const STEP_MS = 3000

type Item = { name: string; title?: string; copy: string; icon: LucideIcon } // without a title, the box shows only the line

// each accent's classes and glows, written out so Tailwind generates them
const ACCENT = {
  amber: {
    idle: 'bg-deep text-amber ring-amber/35 group-hover:ring-amber/70',
    glow: 'rgb(245 177 52 / 0.45)',
    ring: 'rgb(245 177 52 / 0.4)',
    line: 'bg-[linear-gradient(to_right,rgb(238_242_248/0.08),rgb(245_177_52/0.45),rgb(238_242_248/0.08))]',
  },
  cyan: {
    idle: 'bg-deep text-cyan ring-cyan/35 group-hover:ring-cyan/70',
    glow: 'rgb(52 189 232 / 0.45)',
    ring: 'rgb(52 189 232 / 0.4)',
    line: 'bg-[linear-gradient(to_right,rgb(238_242_248/0.08),rgb(52_189_232/0.45),rgb(238_242_248/0.08))]',
  },
}

export function ModuleDetails({
  cards,
  onActive,
  accent = 'amber',
  autoplay = true,
}: {
  cards: Item[]
  onActive?: (i: number) => void
  accent?: keyof typeof ACCENT
  autoplay?: boolean
}) {
  const tone = ACCENT[accent]
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, '0px')
  const [calm] = useState(prefersReducedMotion)
  const [hover, setHover] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const n = cards.length
  const active = hover ?? (autoplay ? step : null)

  useEffect(() => {
    if (!autoplay || calm || !inView || hover !== null) return
    const id = window.setTimeout(() => setStep((k) => (k + 1) % n), STEP_MS)
    return () => window.clearTimeout(id)
  }, [autoplay, calm, inView, hover, step, n])

  useEffect(() => {
    if (active !== null) onActive?.(active)
  }, [active, onActive])

  const look = (i: number) => {
    setHover(i)
    setStep(i)
  }

  return (
    <Emerge className="mt-14 max-w-[30rem]">
      <div ref={box} className="relative pb-[5.75rem]">
        {/* the thin line the tiles sit on */}
        <span aria-hidden="true" className={`absolute top-[1.375rem] right-6 left-6 h-px ${tone.line}`} />
        <ol className="relative flex justify-between">
          {cards.map(({ name, title, copy, icon: Icon }, i) => {
            const on = i === active
            // the pop-up opens under its tile, kept inside the column at either end
            const popX = i === 0 ? 'left-0' : i === n - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'
            return (
              <li key={name} className={`relative ${on ? 'z-10' : ''}`}>
                <button
                  type="button"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && look(i)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
                  onFocus={(e) => e.currentTarget.matches(':focus-visible') && look(i)}
                  onBlur={() => setHover(null)}
                  onClick={() => (autoplay ? setStep(i) : setHover((h) => (h === i ? null : i)))}
                  aria-label={`${name}: ${title ? `${title}. ` : ''}${copy}`}
                  className="group flex cursor-default flex-col items-center gap-2 focus-visible:outline-none"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 transition-all duration-300 ${
                      on ? 'bg-paper text-ink ring-paper' : tone.idle
                    }`}
                    style={on ? { boxShadow: `0 0 26px ${tone.glow}` } : undefined}
                  >
                    <Icon aria-hidden="true" className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.9} />
                  </span>
                  <span className={`text-[0.8125rem] font-semibold transition-colors duration-300 ${on ? 'text-paper' : 'text-paper/70'}`}>{name}</span>
                </button>
                {on && (
                  <div
                    key={name}
                    aria-hidden="true"
                    className={`flow-pop pointer-events-none absolute top-full mt-3 w-72 rounded-2xl bg-deep/95 px-3.5 py-2.5 text-left ${popX}`}
                    style={{ boxShadow: `inset 0 0 0 1px ${tone.ring}, 0 24px 50px -20px rgb(0 0 0 / 0.85)` }}
                  >
                    {title && <p className="text-[0.875rem] font-semibold text-paper">{title}</p>}
                    <p className={`text-[0.8125rem] leading-snug ${title ? 'mt-0.5 text-mist' : 'text-[0.875rem] text-paper/90'}`}>{copy}</p>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </Emerge>
  )
}
