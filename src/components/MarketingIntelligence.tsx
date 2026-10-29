import { useEffect, useRef, useState } from 'react'
import { BrainCircuit, Radar, TrendingUp, type LucideIcon } from 'lucide-react'
import { marketing } from '../content'
import { prefersReducedMotion, useInView } from '../lib/motion'
import { Chapter } from './Chapter'
import { Emerge } from './Emerge'
import { ModuleDetails } from './ModuleDetails'
import { SectionGlow } from './SectionMarks'

// Marketing Intelligence: the chapter's heading with the module's overview, a
// signal field beside it, and under the overview what the module does.
//
// The field is the overview drawn as "noise into insight": on the left, a
// drift of small square signals arrives in no order, coloured by where it comes
// from (web cyan, social orange, internal green); in the middle a vertical lens
// of light, the intelligence engine, sorts them; on the right they leave as
// three clean amber streams, one per output. It follows the icon row under the
// overview: Ingest fills the left with signal, Analyze brightens the lens and
// slows the signals as they are sorted (naming what it notices), and Synthesize
// lights the streams and each output in turn. Pointing at a source in the
// legend shows what it draws on. Canvas 2D, run only while on screen; with
// reduced motion it is one still frame.

const SOURCE_COLORS = ['#34bde8', '#ea7532', '#14a17e'] // web, social, internal: cyan, orange, green
const SOURCE_RGB = [
  [52, 189, 232],
  [234, 117, 50],
  [20, 161, 126],
]
const AMBER_RGB = [245, 177, 52]
const LANES = [0.24, 0.5, 0.76] // the three streams' heights, as a share of the field
const LENS = 0.5 // where the lens stands, as a share of the width
const END = 0.7 // where the streams hand over to the outputs' names
const ICONS: LucideIcon[] = [Radar, BrainCircuit, TrendingUp] // ingest, analyze, synthesize
const SUB_MS = 950 // within a stage, the time between its beats (they loop while the stage is held)

type Signal = { x: number; y: number; vy: number; src: number; lane: number; size: number; phase: number }

function SignalField({ stage }: { stage: number }) {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const inView = useInView(box, '100px')
  const [calm] = useState(prefersReducedMotion)
  const [hot, setHot] = useState<number | null>(null) // the source pointed at in the legend, if any

  // the beat within the stage (back to the first whenever the stage changes), looping through the three outputs
  const [sub, setSub] = useState({ stage, k: 0 })
  const k = sub.stage === stage ? sub.k : 0
  useEffect(() => {
    if (calm) return
    const id = window.setTimeout(() => setSub({ stage, k: (k + 1) % LANES.length }), SUB_MS)
    return () => window.clearTimeout(id)
  }, [calm, stage, k])

  // the frame loop reads these, so changing stage never restarts it
  const live = useRef({ stage, k, hot })
  useEffect(() => {
    live.current = { stage, k, hot }
  }, [stage, k, hot])

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx || !inView) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    const size = () => {
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(cv)

    const cap = w < 480 ? 260 : 620 // enough that the drift stays full from edge to lens
    const signals: Signal[] = []
    const spawn = (x = -4): Signal => ({
      x,
      y: (0.08 + Math.random() * 0.7) * h, // the drift keeps above the legend in the bottom-left
      vy: (Math.random() - 0.5) * 30,
      src: Math.floor(Math.random() * 3),
      lane: Math.floor(Math.random() * 3),
      size: 1.6 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
    })
    let lensGlow = 0.4
    let streamGlow = 0.3
    let fieldGlow = 1
    let carry = 0
    let last = performance.now()
    let raf = 0

    const step = (dt: number, now: number) => {
      const { stage: st } = live.current
      // each stage brings its part of the field forward
      const goalLens = st === 1 ? 1 : 0.35
      const goalStream = st === 2 ? 1 : 0.3
      const goalField = st === 0 ? 1 : 0.55
      lensGlow += (goalLens - lensGlow) * Math.min(1, dt * 3)
      streamGlow += (goalStream - streamGlow) * Math.min(1, dt * 3)
      fieldGlow += (goalField - fieldGlow) * Math.min(1, dt * 3)

      carry += dt * (w < 480 ? 0.5 : 1) * (st === 0 ? 75 : 50)
      while (carry >= 1 && signals.length < cap) {
        signals.push(spawn())
        carry -= 1
      }
      carry = Math.min(carry, 1)

      const lensX = LENS * w
      const endX = END * w
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i]
        const laneY = LANES[s.lane] * h
        let vx: number
        if (s.x < lensX - 0.16 * w) {
          // the drift: no order yet
          vx = 62 + Math.sin(now / 700 + s.phase) * 16
          s.vy += (Math.random() - 0.5) * 120 * dt
          s.vy *= 0.97
          s.y += s.vy * dt
          if (s.y < 0.06 * h || s.y > 0.8 * h) s.vy *= -1
        } else if (s.x < lensX) {
          // approaching the lens: drawn toward its stream, slower while analyzing
          const t = (s.x - (lensX - 0.16 * w)) / (0.16 * w)
          vx = st === 1 ? 26 : 52
          s.y += (laneY - s.y) * Math.min(1, dt * (1.5 + t * 6))
        } else {
          // sorted: straight along its stream, quicker
          vx = 120
          s.y += (laneY - s.y) * Math.min(1, dt * 12)
        }
        s.x += vx * dt
        if (s.x > endX + 6) signals.splice(i, 1)
      }
    }

    const draw = (now: number) => {
      const { k: kk, hot: ht, stage: st } = live.current
      ctx.clearRect(0, 0, w, h)
      const lensX = LENS * w
      const endX = END * w

      // the streams' guides, from the lens to the outputs
      LANES.forEach((ly, i) => {
        const lit = st === 2 && kk === i
        const a = (lit ? 0.75 : 0.18) * streamGlow + 0.05
        const g = ctx.createLinearGradient(lensX, 0, endX, 0)
        g.addColorStop(0, `rgba(245,177,52,0)`)
        g.addColorStop(1, `rgba(245,177,52,${a})`)
        ctx.strokeStyle = g
        ctx.lineWidth = lit ? 2 : 1
        ctx.beginPath()
        ctx.moveTo(lensX, ly * h)
        ctx.lineTo(endX, ly * h)
        ctx.stroke()
      })

      // the lens: a soft column of light with a bright core
      const glow = ctx.createLinearGradient(lensX - 40, 0, lensX + 40, 0)
      glow.addColorStop(0, 'rgba(245,177,52,0)')
      glow.addColorStop(0.5, `rgba(245,177,52,${0.08 + 0.22 * lensGlow})`)
      glow.addColorStop(1, 'rgba(245,177,52,0)')
      ctx.fillStyle = glow
      ctx.fillRect(lensX - 40, 0.04 * h, 80, 0.92 * h)
      const core = ctx.createLinearGradient(0, 0.04 * h, 0, 0.96 * h)
      core.addColorStop(0, 'rgba(238,242,248,0)')
      core.addColorStop(0.5, `rgba(238,242,248,${0.35 + 0.55 * lensGlow})`)
      core.addColorStop(1, 'rgba(238,242,248,0)')
      ctx.fillStyle = core
      ctx.fillRect(lensX - 1, 0.04 * h, 2, 0.92 * h)
      // a slow scan travelling up the lens while it analyzes
      if (lensGlow > 0.5) {
        const sy = (1 - ((now / 1600) % 1)) * 0.92 * h + 0.04 * h
        ctx.fillStyle = `rgba(245,177,52,${0.8 * lensGlow})`
        ctx.fillRect(lensX - 7, sy - 1, 14, 2)
      }

      // the signals: squares, coloured by source on the left, turning amber once sorted
      for (const s of signals) {
        const sorted = s.x >= lensX
        const t = sorted ? Math.min(1, (s.x - lensX) / (0.06 * w)) : 0
        const from = SOURCE_RGB[s.src]
        const rgb = from.map((v, c) => Math.round(v + (AMBER_RGB[c] - v) * t))
        let a = sorted ? 0.35 + 0.65 * streamGlow : 0.35 + 0.65 * fieldGlow
        if (sorted && st === 2 && s.lane === kk) a = 1
        if (!sorted && ht !== null) a *= s.src === ht ? 1.4 : 0.25
        a *= Math.min(1, s.x / 30, (endX + 6 - s.x) / 40)
        ctx.fillStyle = `rgba(${rgb.join(',')},${Math.max(0, Math.min(1, a))})`
        const r = sorted ? s.size * 0.9 : s.size
        ctx.fillRect(s.x - r, s.y - r, r * 2, r * 2)
        if (sorted && a > 0.4) {
          // a short trail behind sorted signals
          ctx.fillStyle = `rgba(${rgb.join(',')},${a * 0.25})`
          ctx.fillRect(s.x - r - 14, s.y - 0.6, 14, 1.2)
        }
      }
    }

    if (calm) {
      // one still frame: let the field fill, then draw it once
      for (let i = 0; i < 600; i++) step(1 / 30, i * 33)
      draw(0)
      return () => ro.disconnect()
    }
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      step(dt, now)
      draw(now)
      raf = requestAnimationFrame(frame)
    }
    // start with the field already full, so it never opens empty
    for (let i = 0; i < 450; i++) step(1 / 30, i * 33)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [inView, calm])

  const shown = hot === null ? null : marketing.sources[hot]

  return (
    <Emerge>
      <div ref={box} className="glass glass--still glass-edge">
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.12em] text-haze">
          <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-[2px] bg-amber" />
          {marketing.console}
          <span className="ml-auto font-sans tracking-normal text-haze/80">{marketing.modes[stage]}</span>
        </div>
        <div className="relative aspect-[13/9] w-full" role="img" aria-label={marketing.figureLabel}>
          <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />

          {/* the lens's name, and what it notices while analyzing */}
          <div aria-hidden="true" className="pointer-events-none absolute top-[3%] left-1/2 -translate-x-1/2 text-center">
            <span className="font-mono text-[0.625rem] tracking-[0.18em] text-haze">{marketing.lensLabel}</span>
          </div>
          {stage === 1 && (
            <div
              key={k}
              aria-hidden="true"
              className="flow-pop pointer-events-none absolute top-[11%] left-1/2 -translate-x-1/2 rounded-lg px-3 py-1 text-[0.75rem] font-semibold whitespace-nowrap text-paper"
              style={{ background: 'rgb(13 26 58 / 0.9)', boxShadow: 'inset 0 0 0 1px rgb(245 177 52 / 0.6)' }}
            >
              {marketing.insights[k]}
            </div>
          )}

          {/* the outputs, where the streams arrive */}
          {marketing.outputs.map((o, i) => {
            const lit = stage === 2 && k === i
            return (
              <div
                key={o}
                aria-hidden="true"
                className="pointer-events-none absolute right-[3%] flex -translate-y-1/2 items-center gap-2 transition-opacity duration-500"
                style={{ top: `${LANES[i] * 100}%`, opacity: stage === 2 ? (lit ? 1 : 0.6) : 0.45 }}
              >
                <span
                  className={`h-2 w-2 rounded-[2px] transition-shadow duration-500 ${lit ? 'bg-amber' : 'bg-amber/60'}`}
                  style={lit ? { boxShadow: '0 0 12px rgb(245 177 52 / 0.9)' } : undefined}
                />
                <span className={`text-[0.8125rem] font-semibold whitespace-nowrap ${lit ? 'text-paper' : 'text-mist'}`}>{o}</span>
              </div>
            )
          })}

          {/* the sources: a legend; pointing at one shows what it draws on */}
          <ul className="absolute bottom-[4%] left-[3%] flex flex-col gap-1.5" onPointerLeave={(e) => e.pointerType === 'mouse' && setHot(null)}>
            {marketing.sources.map((src, i) => (
              <li key={src.name}>
                <button
                  type="button"
                  aria-label={`${src.name}: ${src.examples.join(', ')}`}
                  aria-expanded={hot === i}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(i)}
                  onFocus={(e) => e.currentTarget.matches(':focus-visible') && setHot(i)}
                  onBlur={() => setHot(null)}
                  onClick={() => setHot((h) => (h === i ? null : i))}
                  className={`flex cursor-pointer items-center gap-2 text-[0.75rem] font-semibold transition-opacity duration-300 ${
                    hot === null || hot === i ? 'opacity-100' : 'opacity-40'
                  } ${stage === 0 || hot !== null ? 'text-paper' : 'text-mist'}`}
                >
                  <span className="h-2 w-2 rounded-[2px]" style={{ background: SOURCE_COLORS[i] }} />
                  {src.name}
                </button>
              </li>
            ))}
          </ul>
          {shown && hot !== null && (
            <div
              key={shown.name}
              aria-hidden="true"
              className="flow-pop pointer-events-none absolute bottom-[4%] left-[34%] w-[min(13rem,40%)] rounded-2xl bg-deep/95 px-3.5 py-3"
              style={{ boxShadow: `inset 0 0 0 1px ${SOURCE_COLORS[hot]}88, 0 24px 50px -20px rgb(0 0 0 / 0.85)` }}
            >
              <p className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase" style={{ color: SOURCE_COLORS[hot] }}>
                {shown.name}
              </p>
              <ul className="mt-2 space-y-1">
                {shown.examples.map((x) => (
                  <li key={x} className="flex items-center gap-2 text-[0.8125rem] leading-snug text-paper/90">
                    <span className="h-1 w-1 shrink-0 rounded-[1px]" style={{ background: SOURCE_COLORS[hot] }} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Emerge>
  )
}

export function MarketingIntelligence() {
  const [stage, setStage] = useState(0) // the icon row's current tile, which the field plays
  return (
    <section aria-labelledby={`${marketing.id}-title`} className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center pb-3">
      <SectionGlow accent="amber" side="right" />
      <Chapter
        id={marketing.id}
        name={marketing.name}
        title={marketing.title}
        lede={marketing.overview}
        accent="amber"
        wide="even"
        aside={<SignalField stage={stage} />}
        note={
          <span className="inline-flex items-center gap-2 text-[0.875rem] text-haze">
            <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-[2px] bg-amber" />
            {marketing.status}
          </span>
        }
      >
        <ModuleDetails cards={marketing.capabilities.map((c, i) => ({ ...c, icon: ICONS[i] }))} onActive={setStage} />
      </Chapter>
    </section>
  )
}
