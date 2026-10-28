import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { engineering } from '../content'
import { prefersReducedMotion, useInView } from '../lib/motion'
import { CadConsole } from './CadConsole'
import { Chapter } from './Chapter'
import { Emerge } from './Emerge'
import { SectionGlow } from './SectionMarks'

// The Digital Design Agent chapter in one screen: its heading and the agent's
// three stages (Execute → Augment → Design) on the left, the robotic CAD
// console working beside them. While the section is on screen the stages play
// through on their own every 5 seconds (the progress line under the tabs shows the
// time left); choosing a tab jumps there and the cycle carries on from it.

const { stages } = engineering
const STAGE_MS = 5000

export function EngineeringStages() {
  const ref = useRef<HTMLElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [stage, setStage] = useState(0)
  const inView = useInView(ref, '0px')
  const playing = inView && !prefersReducedMotion()

  // advance every few seconds while playing; restarting on each stage keeps the timer in step with the line
  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setStage((s) => (s + 1) % stages.length), STAGE_MS)
    return () => window.clearTimeout(id)
  }, [playing, stage])

  const choose = (i: number) => setStage(i)

  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : -1
    if (next < 0) return
    e.preventDefault()
    tabs.current[next]?.focus()
    choose(next)
  }

  return (
    <section
      ref={ref}
      aria-labelledby={`${engineering.id}-title`}
      className="relative"
    >
      <SectionGlow accent="signal" side="right" />
      <Chapter
        id={engineering.id}
        name={engineering.name}
        title={engineering.title}
        lede={engineering.lede}
        accent="signal"
        wide="even"
        aside={
          <Emerge>
            <CadConsole stage={stage} />
          </Emerge>
        }
      >
        <Emerge className="over-field mt-10 md:mt-12">
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
                onClick={() => choose(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={`cut-sm cursor-pointer px-4 py-2 text-[0.875rem] font-semibold transition-colors duration-500 ease-[var(--ease-glide)] focus-visible:bg-signal focus-visible:text-ink focus-visible:outline-none ${
                  stage === i ? 'bg-paper text-ink' : 'bg-paper/[0.06] text-mist hover:bg-paper/10 hover:text-paper'
                }`}
              >
                {s.tab}
              </button>
            ))}
          </div>
          {/* time left on this stage while it plays; how far along the three stages otherwise */}
          <div className="mt-4 h-px w-full max-w-[22rem] bg-[var(--line-strong)]" aria-hidden="true">
            <span
              key={`${stage}-${playing}`}
              className="block h-px origin-left bg-signal"
              style={
                playing
                  ? { animation: `stage-time ${STAGE_MS}ms linear forwards` }
                  : { transform: `scaleX(${(stage + 1) / stages.length})`, transition: 'transform 0.5s var(--ease-glide)' }
              }
            />
          </div>

          {/* every stage shares one grid cell, so the column keeps the height of the tallest */}
          <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${stage}`} className="mt-6 grid">
            {stages.map((s, i) => (
              <div key={s.tab} className={`blur-swap [grid-area:1/1] ${stage === i ? 'is-on' : 'pointer-events-none'}`} aria-hidden={stage !== i}>
                <h3 className="text-[1.25rem] font-semibold text-paper md:text-[1.375rem]">{s.title}</h3>
                <p className="mt-2 max-w-[28rem] text-[1.0625rem] text-mist text-pretty">{s.copy}</p>
              </div>
            ))}
          </div>
        </Emerge>
      </Chapter>
    </section>
  )
}
