import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { pillars, type ClimbPillar } from '../lib/climb'

// HR Central as two journeys on slides, one at a time: Campus to Hire (for
// candidates), then Hire to Fire (for companies). Swipe (or drag), use the
// arrows, the dots or the arrow keys to move between them. Each slide is a
// stepper of the journey's stages beside a panel telling one stage: its name
// and what happens there. Pointing at a stage (or focusing or tapping it)
// shows it; the stepper's line fills to it (cyan for the first journey, amber
// for the second) and the stages before it stay lit.

const SWIPE_PX = 50 // how far a swipe must travel to change slides

export function TwoJourneys() {
  const [slide, setSlide] = useState(0)
  const start = useRef<number | null>(null)
  const count = pillars.length
  const go = (k: number) => setSlide(Math.min(count - 1, Math.max(0, k)))

  const onDown = (e: PointerEvent) => {
    start.current = e.clientX
  }
  const onUp = (e: PointerEvent) => {
    if (start.current === null) return
    const dx = e.clientX - start.current
    start.current = null
    if (Math.abs(dx) < SWIPE_PX) return
    go(slide + (dx < 0 ? 1 : -1))
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(slide + 1)
    else if (e.key === 'ArrowLeft') go(slide - 1)
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label="HR Central journeys" onKeyDown={onKey} className="[--row:2.5rem]">
      {/* the controls: back, a dot per journey, next */}
      <div className="flex items-center justify-end gap-4">
        <Arrow dir={-1} disabled={slide === 0} onClick={() => go(slide - 1)} />
        <div className="flex gap-2">
          {pillars.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Show ${p.label}`}
              aria-current={i === slide}
              onClick={() => go(i)}
              className="h-2.5 rounded-[2px] transition-all duration-500"
              style={{ width: i === slide ? '1.75rem' : '0.625rem', background: i === slide ? p.color : 'rgb(238 242 248 / 0.25)' }}
            />
          ))}
        </div>
        <Arrow dir={1} disabled={slide === count - 1} onClick={() => go(slide + 1)} />
      </div>

      <div className="mt-6 touch-pan-y overflow-hidden select-none" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (start.current = null)}>
        <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {pillars.map((p, i) => (
            <div
              key={p.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${p.label}`}
              aria-hidden={i !== slide}
              inert={i !== slide}
              className="w-full shrink-0 px-px"
            >
              <Journey pillar={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Arrow({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  const Icon = dir < 0 ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={dir < 0 ? 'Previous journey' : 'Next journey'}
      disabled={disabled}
      onClick={onClick}
      className="cut-border grid h-10 w-10 place-items-center text-paper transition-opacity duration-300 disabled:opacity-30"
    >
      <span>
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
      </span>
    </button>
  )
}

function Journey({ pillar }: { pillar: ClimbPillar }) {
  const [active, setActive] = useState(0)
  const n = pillar.stages.length
  const shown = pillar.stages[active]

  return (
    <div className="grid items-center gap-10 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[900px]:gap-20">
      <div>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[2px]" style={{ background: pillar.color, boxShadow: `0 0 10px ${pillar.color}` }} />
          <h3 className="display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight text-paper">{pillar.label}</h3>
        </div>
        <p className="mt-1.5 text-[0.9375rem] text-haze">{pillar.audience}</p>

        <ol className="relative mt-8">
          {/* the line through the stages, filled up to the current one */}
          <span
            aria-hidden="true"
            className="absolute left-[5.5px] w-px bg-paper/15"
            style={{ top: 'calc(var(--row) / 2)', height: `calc(var(--row) * ${n - 1})` }}
          >
            <span
              className="absolute inset-x-0 top-0 transition-[height] duration-700"
              style={{ height: `calc(var(--row) * ${active})`, background: pillar.color, boxShadow: `0 0 8px ${pillar.color}` }}
            />
          </span>
          {pillar.stages.map((s, i) => {
            const on = i === active
            const passed = i <= active
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${s.label}: ${s.line}`}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-center gap-3 text-left text-[1rem] whitespace-nowrap focus-visible:outline-none"
                  style={{ height: 'var(--row)' }}
                >
                  <span
                    aria-hidden="true"
                    className={`relative h-3 w-3 shrink-0 rounded-[2px] border transition-all duration-500 ${on ? 'scale-[1.3]' : ''}`}
                    style={{
                      background: passed ? pillar.color : 'var(--color-ink)',
                      borderColor: passed ? pillar.color : 'rgb(238 242 248 / 0.25)',
                      boxShadow: on ? `0 0 14px ${pillar.color}` : undefined,
                    }}
                  />
                  <span
                    className={`rounded-[4px] px-2.5 py-1 transition-colors duration-300 group-hover:text-paper ${
                      on ? 'bg-paper/[0.07] font-semibold text-paper' : passed ? 'text-mist' : 'text-haze/80'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* the current stage, in words, at a size you can read from across the room */}
      <div className="glass glass--still glass-edge relative flex min-h-[18rem] flex-col justify-center overflow-hidden p-8 md:p-12 min-[900px]:min-h-[22rem]">
        <span aria-hidden="true" className="absolute inset-x-10 top-0 h-px" style={{ background: pillar.color, boxShadow: `0 0 12px 1px ${pillar.color}` }} />
        <div aria-live="polite" key={shown.id} className="flow-pop">
          <p className="display text-[clamp(2rem,3.4vw,3rem)] leading-tight text-paper">{shown.label}</p>
          <p className="mt-4 max-w-[34ch] text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-snug text-mist">{shown.line}</p>
        </div>
      </div>
    </div>
  )
}
