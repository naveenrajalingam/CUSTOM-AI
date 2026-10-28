import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { engineering } from '../content'
import { landingY, scrollToY } from '../lib/scroll'
import { CadConsole } from './CadConsole'

gsap.registerPlugin(ScrollTrigger)

// The agent's three stages as one pinned scene: scrolling moves through
// Execute → Augment → Design (the tabs glide there too), the words swapping out
// of a blur, while the CAD console keeps working beside them.

const { stages } = engineering
/** where the page settles: the middle of each stage */
const STOPS = [1 / 6, 1 / 2, 5 / 6]

const chip = ['bg-signal/15 text-signal', 'bg-paper/10 text-mist', 'bg-amber/15 text-amber']

export function EngineeringStages() {
  const ref = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        const s = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2
        setStage((prev) => (prev === s ? prev : s))
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${p.toFixed(4)})`
      },
    })
    return () => st.kill()
  }, [])

  const go = (i: number) => {
    setStage(i)
    if (ref.current) scrollToY(landingY(ref.current, STOPS[i]))
  }

  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : -1
    if (next < 0) return
    e.preventDefault()
    tabs.current[next]?.focus()
    go(next)
  }

  return (
    <div ref={ref} data-stops={JSON.stringify(STOPS)} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-16">
        <div className="mx-auto grid w-full max-w-[1320px] items-center gap-6 px-6 md:gap-10 md:px-10 lg:grid-cols-12 lg:gap-16">
          <div className="over-field lg:col-span-5">
            <div role="tablist" aria-label={engineering.stagesLabel} className="flex gap-1.5">
              {stages.map((s, i) => (
                <button
                  key={s.tab}
                  ref={(node) => {
                    tabs.current[i] = node
                  }}
                  type="button"
                  role="tab"
                  id={`stage-tab-${i}`}
                  aria-selected={stage === i}
                  aria-controls="stage-panel"
                  tabIndex={stage === i ? 0 : -1}
                  onClick={() => go(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`cut-sm cursor-pointer px-4 py-2 text-[0.875rem] font-semibold transition-colors duration-500 ease-[var(--ease-glide)] focus-visible:bg-signal focus-visible:text-ink focus-visible:outline-none ${
                    stage === i ? 'bg-paper text-ink' : 'bg-paper/[0.06] text-mist hover:bg-paper/10 hover:text-paper'
                  }`}
                >
                  {s.tab}
                </button>
              ))}
            </div>
            <div className="mt-5 h-px w-full max-w-[22rem] bg-[var(--line-strong)]" aria-hidden="true">
              <span ref={fillRef} className="block h-px origin-left scale-x-0 bg-signal" />
            </div>

            {/* every stage shares one grid cell, so the column keeps the height of the tallest */}
            <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${stage}`} aria-live="polite" className="mt-8 grid md:mt-10">
              {stages.map((s, i) => (
                <div key={s.tab} className={`blur-swap [grid-area:1/1] ${stage === i ? 'is-on' : 'pointer-events-none'}`} aria-hidden={stage !== i}>
                  <p className="flex items-center gap-2.5 text-[0.9375rem] text-mist">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-signal" />
                    {s.eyebrow}
                  </p>
                  <h3 className="display mt-4 text-[clamp(2.1rem,4.2vw,3.75rem)] text-paper">{s.title}</h3>
                  <p className={`mt-4 inline-block rounded-full px-3 py-1 text-[0.8125rem] font-semibold ${chip[i]}`}>{s.chip}</p>
                  <p className="measure mt-4 text-[1.0625rem] text-mist md:mt-5 md:text-[1.1875rem]">{s.copy}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 hidden items-center gap-2.5 text-[0.875rem] text-haze md:mt-8 md:flex">
              <span aria-hidden="true" className="live-dot h-2 w-2 rounded-[2px] bg-green" />
              {engineering.target}
            </p>
          </div>

          <div className="lg:col-span-7">
            <CadConsole stage={stage} />
          </div>
        </div>
      </div>
    </div>
  )
}
