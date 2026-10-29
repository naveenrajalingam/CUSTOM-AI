import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BookOpenCheck, Eye, FileText, MousePointer2, Network, ScanText, Workflow, type LucideIcon } from 'lucide-react'
import { training } from '../content'
import { Chapter } from './Chapter'
import { Emerge } from './Emerge'
import { ModuleDetails } from './ModuleDetails'
import { SectionGlow } from './SectionMarks'

// Training & L&D: the chapter's heading with the Observer Engine's overview, a
// console beside it, and under the overview what the engine does. The console plays an observed session: on the left a planner works in a
// supply planning workspace while the engine's frame follows each action (and
// then reads an internal procedure); on the right each action lands in the
// knowledge base as a step, and once all are in, a lesson is ready. The
// console follows the icon row under the overview: under Observe a dashed cyan
// eye follows the planner and records nothing; under Capture the amber frame
// retraces the work and each action lands as a step; Parse reads the
// procedure; Synthesize readies the lesson.

const SUB_MS = 950 // within a stage of several beats, the time between them (they loop while the stage is held)
const { session } = training
const N = session.steps.length

// what each stage plays: the element the engine's frame is on (marked data-step), how many steps the knowledge base holds
type Mode = 'observe' | 'capture' | 'parse' | 'lesson'
type Beat = { focus: number | null; captured: number; mode: Mode }
const SCRIPT: Beat[][] = [
  [0, 1, 2].map((f) => ({ focus: f, captured: 0, mode: 'observe' as const })), // observe: it follows the planner's work, recording nothing yet
  [0, 1, 2].map((f) => ({ focus: f, captured: f + 1, mode: 'capture' as const })), // capture: each action becomes a step
  [{ focus: 3, captured: N, mode: 'parse' }], // parse: it reads the procedure
  [{ focus: null, captured: N, mode: 'lesson' }], // synthesize: the lesson is ready
]
const TAG: Record<Mode, string> = { observe: 'OBSERVING', capture: 'CAPTURED', parse: 'PARSING', lesson: '' }

const ICONS: LucideIcon[] = [Eye, Workflow, ScanText, Network] // observe, capture, parse, synthesize
const ROWS = [
  ['FG-1042', '1,240', '1,180'],
  ['FG-2210', '860', '905'],
  ['SA-3301', '2,015', '1,940'],
]

function Console({ stage }: { stage: number }) {
  // how far into the current stage's beats it is (back to its first beat whenever the stage changes)
  const [sub, setSub] = useState({ stage, k: 0 })
  const k = sub.stage === stage ? sub.k : 0
  const beats = SCRIPT[stage]

  useEffect(() => {
    if (beats.length < 2) return
    const id = window.setTimeout(() => setSub({ stage, k: (k + 1) % beats.length }), SUB_MS)
    return () => window.clearTimeout(id)
  }, [beats, stage, k])

  const { focus, captured, mode } = beats[k]
  const lesson = mode === 'lesson'
  const watching = mode === 'observe'
  const edited = !(watching && focus === 0) // the planner has changed the forecast

  // the engine's frame sits over the element the step happens on (marked data-step), measured in the workspace
  const space = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState({ left: 0, top: 0, width: 0, height: 0 })
  useLayoutEffect(() => {
    const el = space.current
    if (!el || focus === null) return
    const measure = () => {
      const t = el.querySelector<HTMLElement>(`[data-step="${focus}"]`)
      if (!t) return
      let left = 0
      let top = 0
      for (let n: HTMLElement | null = t; n && n !== el; n = n.offsetParent as HTMLElement | null) {
        left += n.offsetLeft
        top += n.offsetTop
      }
      setAt({ left, top, width: t.offsetWidth, height: t.offsetHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [focus])

  return (
    <Emerge>
      <div role="img" aria-label={training.figureLabel} className="glass glass--still glass-edge">
        <div
          aria-hidden="true"
          className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.12em] text-haze"
        >
          <span className="live-dot h-1.5 w-1.5 rounded-[2px] bg-cyan" />
          {training.console}
          <span className="ml-auto font-sans tracking-normal text-haze/80">{session.modes[stage]}</span>
        </div>

        <div aria-hidden="true" className="grid gap-3 p-3 sm:grid-cols-[1.15fr_1fr]">
          {/* the observed workspace */}
          <div className="flex flex-col overflow-hidden rounded-xl bg-ink/70 ring-1 ring-[var(--line)]">
            <div className="flex items-center gap-1.5 border-b border-[var(--line)] px-3 py-2">
              <span className="h-2 w-2 rounded-[2px] bg-paper/20" />
              <span className="h-2 w-2 rounded-[2px] bg-paper/20" />
              <span className="h-2 w-2 rounded-[2px] bg-paper/20" />
              <span className="ml-2 truncate text-[0.6875rem] text-haze">{session.app}</span>
            </div>
            <div ref={space} className="relative min-h-56 flex-1 text-[0.6875rem]">
              {/* the plan's tabs */}
              <div className="absolute top-[4%] left-[3%] flex gap-1.5">
                <span data-step="0" className="rounded-md bg-cyan/15 px-2 py-1 font-semibold text-paper">
                  Supply plan
                </span>
                <span className="rounded-md px-2 py-1 text-haze">Inventory</span>
              </div>
              {/* the plan's table */}
              <div className="absolute top-[24%] right-[3%] left-[3%] space-y-1.5">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] px-2 font-mono text-[0.625rem] text-haze">
                  <span>Item</span>
                  <span>Demand</span>
                  <span>Supply</span>
                </div>
                {ROWS.map((r, i) => (
                  <div key={r[0]} className={`grid grid-cols-[1.2fr_1fr_1fr] rounded-md px-2 py-1 font-mono ${i === 1 ? 'bg-paper/[0.06]' : ''}`}>
                    <span className="text-mist">{r[0]}</span>
                    <span data-step={i === 1 ? 1 : undefined} className={`justify-self-start ${i === 1 && edited ? 'text-amber' : 'text-paper/85'}`}>
                      {i === 1 && edited ? '940' : r[1]}
                    </span>
                    <span className="text-paper/85">{r[2]}</span>
                  </div>
                ))}
              </div>
              {/* the procedure, and the scenario button */}
              <div
                data-step="3"
                className="absolute bottom-[5%] left-[3%] flex h-9 w-[34%] items-center gap-1.5 rounded-md bg-orange/10 px-2 text-orange ring-1 ring-orange/40"
              >
                <FileText className="h-3.5 w-3.5 shrink-0" strokeWidth={1.9} />
                <span className="truncate">SOP.pdf</span>
              </div>
              <div
                data-step="2"
                className={`absolute right-[3%] bottom-[5%] flex h-9 w-[33%] items-center justify-center rounded-md font-semibold transition-colors duration-300 ${
                  focus === 2 ? 'bg-cyan text-ink' : 'bg-cyan/15 text-paper'
                }`}
              >
                Run scenario
              </div>

              {/* the engine's frame, following the action, and the user's pointer */}
              {focus !== null && (
                <>
                  {/* while observing, a dashed cyan eye that only watches; after that, amber as it records */}
                  <span
                    className={`absolute rounded-lg border-2 transition-all duration-700 ease-[var(--ease-expo)] ${watching ? 'border-dashed border-cyan' : 'border-amber'}`}
                    style={{
                      left: at.left - 5,
                      top: at.top - 5,
                      width: at.width + 10,
                      height: at.height + 10,
                      boxShadow: watching ? '0 0 18px rgb(52 189 232 / 0.35)' : '0 0 18px rgb(245 177 52 / 0.45)',
                    }}
                  >
                    <span
                      className={`absolute -top-2.5 left-2 flex items-center gap-1 rounded px-1 font-mono text-[0.5625rem] leading-4 font-semibold text-ink ${watching ? 'bg-cyan' : 'bg-amber'}`}
                    >
                      {watching && <Eye className="h-2.5 w-2.5" strokeWidth={2.5} />}
                      {TAG[mode]}
                    </span>
                  </span>
                  {focus < N - 1 && (
                    <MousePointer2
                      className="absolute h-4 w-4 fill-paper text-ink transition-all duration-700 ease-[var(--ease-expo)]"
                      style={{ left: at.left + at.width * 0.7, top: at.top + at.height * 0.6 }}
                      strokeWidth={1.5}
                    />
                  )}
                  {focus === N - 1 && (
                    <span
                      className="scan-line absolute h-px bg-orange"
                      style={{ left: at.left, width: at.width, top: at.top, ['--scan' as string]: `${at.height}px` }}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* the knowledge base, filling up */}
          <div className="flex flex-col rounded-xl bg-ink/40 p-3 ring-1 ring-[var(--line)]">
            <p className="font-mono text-[0.625rem] tracking-[0.14em] text-haze uppercase">{session.kbLabel}</p>
            <ol className="relative mt-2.5 flex-1 space-y-1.5">
              {/* while it only watches, nothing is recorded yet */}
              <p
                className={`absolute inset-x-0 top-1 flex items-center gap-2 px-2 text-[0.75rem] text-haze transition-opacity duration-500 ${watching ? 'opacity-100' : 'opacity-0'}`}
              >
                <Eye className="h-3.5 w-3.5 text-cyan" strokeWidth={1.9} />
                {session.watching}
                <span className="live-dot">…</span>
              </p>
              {session.steps.map((s, i) => (
                <li
                  key={s.text}
                  className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-[0.75rem] leading-snug transition-[opacity,translate,background-color] duration-500 ${
                    i < captured ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                  } ${i === focus && !watching ? 'bg-paper/[0.07]' : ''}`}
                >
                  <span className="mt-px font-mono text-[0.625rem] text-haze">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-paper/90">
                    {s.text}
                    <span
                      className={`mt-0.5 block font-mono text-[0.5625rem] tracking-[0.12em] uppercase ${s.kind === 'Document' ? 'text-orange' : 'text-cyan'}`}
                    >
                      {s.kind}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <div
              className={`mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[0.75rem] font-semibold transition-all duration-500 ${
                lesson ? 'bg-amber/15 text-paper ring-1 ring-amber/60' : 'text-transparent ring-1 ring-[var(--line)]'
              }`}
              style={lesson ? { boxShadow: '0 0 22px rgb(245 177 52 / 0.25)' } : undefined}
            >
              <BookOpenCheck className={`h-4 w-4 shrink-0 ${lesson ? 'text-amber' : 'text-haze/40'}`} strokeWidth={1.9} />
              {session.lesson}
            </div>
          </div>
        </div>
      </div>
    </Emerge>
  )
}

export function ObserverEngine() {
  const [stage, setStage] = useState(0) // the icon row's current tile, which the console plays
  return (
    <section aria-labelledby={`${training.id}-title`} className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center pb-3">
      <SectionGlow accent="amber" side="left" />
      <Chapter
        id={training.id}
        name={training.name}
        title={training.title}
        lede={training.overview}
        accent="amber"
        wide="even"
        aside={<Console stage={stage} />}
        note={
          <span className="inline-flex items-center gap-2 text-[0.875rem] text-haze">
            <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-[2px] bg-amber" />
            {training.status}
          </span>
        }
      >
        <ModuleDetails cards={training.capabilities.map((c, i) => ({ ...c, icon: ICONS[i] }))} onActive={setStage} />
      </Chapter>
    </section>
  )
}
