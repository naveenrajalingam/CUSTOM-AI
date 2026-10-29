import { useEffect, useRef, useState } from 'react'
import { pillars, type ClimbPillar } from '../lib/climb'
import { prefersReducedMotion, useInView } from '../lib/motion'

// HR Central as two journeys, one after the other with room to breathe:
// Campus to Hire (for candidates), then Hire to Retire (for companies), the
// second mirrored so the page zig-zags. Each has a stepper of its stages and,
// beside it, a panel telling the current stage: its name and what happens
// there. Each plays on its own while it is on screen: the stepper's line fills
// to the current stage (cyan for the first, amber for the second) and passed
// stages stay lit. Pointing at a stage (or focusing it) jumps there and holds;
// moving away plays on.

const STEP_MS = 3000

export function TwoJourneys() {
  return (
    <div className="space-y-16 [--row:2.5rem] md:space-y-20">
      {pillars.map((p, i) => (
        <Journey key={p.id} pillar={p} mirror={i % 2 === 1} />
      ))}
    </div>
  )
}

function Journey({ pillar, mirror }: { pillar: ClimbPillar; mirror: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const inView = useInView(wrap, '0px')
  const [calm] = useState(prefersReducedMotion)
  const [hover, setHover] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const n = pillar.stages.length
  const active = hover ?? step
  const shown = pillar.stages[active]

  useEffect(() => {
    if (calm || !inView || hover !== null) return
    const id = window.setTimeout(() => setStep((k) => (k + 1) % n), STEP_MS)
    return () => window.clearTimeout(id)
  }, [calm, inView, hover, step, n])

  const look = (k: number) => {
    setHover(k)
    setStep(k)
  }
  const leave = () => setHover(null)

  return (
    <div
      ref={wrap}
      className={`grid items-center gap-10 min-[900px]:gap-20 ${mirror ? 'min-[900px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : 'min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'}`}
    >
      <div className={mirror ? 'min-[900px]:order-last' : ''}>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[2px]" style={{ background: pillar.color, boxShadow: `0 0 10px ${pillar.color}` }} />
          <h3 className="display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight text-paper">{pillar.label}</h3>
        </div>
        <p className="mt-1.5 text-[0.9375rem] text-haze">{pillar.audience}</p>

        <ol className="relative mt-8" onPointerLeave={(e) => e.pointerType === 'mouse' && leave()}>
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
                  onPointerEnter={(e) => e.pointerType === 'mouse' && look(i)}
                  onFocus={(e) => e.currentTarget.matches(':focus-visible') && look(i)}
                  onBlur={leave}
                  onClick={() => look(i)}
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
