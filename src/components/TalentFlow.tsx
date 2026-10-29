import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { stages } from '../lib/workflow'
import { prefersReducedMotion, useInView } from '../lib/motion'

// "Campus to Company", animated as a growth arc: a curve rising from the campus
// (bottom left) to the company (top right), like a career going up. Candidates
// stream along it as points of light. Each journey stage is a milestone flag:
// a dot on the curve, a thin stem, and a rounded tile with the stage's icon and
// name. The flags alternate above and below the curve, so every name has room
// to show; flags where AI works are green with a ✦, and candidates flash
// green as they pass them. While on screen it steps through the stages every
// few seconds: the current flag lights up and a box pops up beyond it with the
// stage's name and description; every other name stays clear. Pointing at a
// flag (or reaching it with the keyboard) jumps there, softens the others and
// holds only while the pointer stays on it; moving off plays on from it. A
// click or tap jumps there and keeps playing. On phones, where the arc lies
// flat and the names are hidden, the current stage appears under the row
// instead. The curve and the stream are
// canvas 2D and run only while on screen; the flags are HTML, and nothing here
// changes the page's height.

const STEP_MS = 3000 // how long each stage is shown before the next
const pad = (k: number) => String(k).padStart(2, '0')
const PAD = 0.07 // room at each end for the Campus / Company labels, as a share of the width
const CYAN = [52, 189, 232]
const AMBER = [245, 177, 52]
const GREEN = [20, 161, 126]
const n = stages.length
const isAI = stages.map((s) => !!s.ai)
const ARC_FROM = 0.5 // the arc's height at the campus, as a share of the box's height (from the top)
const ARC_TO = 0.44 // and at the company: the curve stays mid-box, leaving room for flags above and below it
const ARC_MIN_WIDTH = 768 // narrower than this, the arc lies flat

// a flag's stem fades toward the curve: downward for flags above it, upward for flags below
const STEM = {
  up: {
    on: 'bg-[linear-gradient(to_bottom,#eef2f8,rgb(238_242_248/0.15))]',
    off: 'bg-[linear-gradient(to_bottom,rgb(238_242_248/0.35),rgb(238_242_248/0.05))]',
  },
  down: {
    on: 'bg-[linear-gradient(to_top,#eef2f8,rgb(238_242_248/0.15))]',
    off: 'bg-[linear-gradient(to_top,rgb(238_242_248/0.35),rgb(238_242_248/0.05))]',
  },
}

/** Where gate i sits, as a share of the width. */
const gateAt = (i: number) => PAD + ((1 - 2 * PAD) * (i + 0.5)) / n

/** The arc's height at a point across the box (both as shares): flat at first, then climbing. */
const arcY = (fx: number) => {
  const t = Math.min(1, Math.max(0, (fx - PAD * 0.5) / (1 - PAD)))
  return ARC_FROM - (ARC_FROM - ARC_TO) * Math.pow(t, 1.8)
}

type Dot = {
  x: number
  lane: number
  speed: number
  phase: number
  r: number
  flash: number
}

export function TalentFlow() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [hover, setHover] = useState<number | null>(null) // a stage pointed at or focused: holds the steps
  const [step, setStep] = useState(0) // the stage the steps are on
  const [calm] = useState(prefersReducedMotion) // with reduced motion there are no steps, only what is pointed at
  const focus = hover ?? (calm ? null : step) // the stage shown
  const activeRef = useRef(-1) // the same, for the canvas: a glow behind its dot
  const inView = useInView(wrap, '100px')

  // step on every few seconds while on screen and nothing is pointed at
  useEffect(() => {
    if (calm || !inView || hover !== null) return
    const id = window.setTimeout(() => setStep((k) => (k + 1) % n), STEP_MS)
    return () => window.clearTimeout(id)
  }, [calm, inView, hover, step])

  useEffect(() => {
    activeRef.current = focus ?? -1
  }, [focus])

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx || !inView) return
    const reduced = prefersReducedMotion()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    const yAt = (fx: number) => (w < ARC_MIN_WIDTH ? 0.5 : arcY(fx)) * h
    // the arc never moves, so it is painted once per size into its own layer and copied each frame
    const arcLayer = document.createElement('canvas')
    const paintArc = () => {
      arcLayer.width = cv.width
      arcLayer.height = cv.height
      const a = arcLayer.getContext('2d')
      if (!a) return
      a.setTransform(dpr, 0, 0, dpr, 0, 0)
      // a soft wide glow under a fine line, campus cyan to company amber
      const ribbon = a.createLinearGradient(w * PAD * 0.5, 0, w * (1 - PAD * 0.5), 0)
      ribbon.addColorStop(0, 'rgba(52,189,232,0.55)')
      ribbon.addColorStop(1, 'rgba(245,177,52,0.55)')
      a.beginPath()
      for (let k = 0; k <= 80; k++) {
        const fx = PAD * 0.5 + (k / 80) * (1 - PAD)
        if (k === 0) a.moveTo(fx * w, yAt(fx))
        else a.lineTo(fx * w, yAt(fx))
      }
      a.strokeStyle = ribbon
      a.globalAlpha = 0.18
      a.lineWidth = 14
      a.lineCap = 'round'
      a.stroke()
      a.globalAlpha = 1
      a.lineWidth = 1.5
      a.stroke()
    }
    const size = () => {
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintArc()
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(cv)

    const count = w < 640 ? 36 : 80
    const dots: Dot[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      lane: Math.random() * 2 - 1,
      speed: 0.03 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
      r: 1.4 + Math.random() * 1.5,
      flash: 0,
    }))
    const glow = new Float32Array(n) // each ring's flash as candidates pass
    const mix = (a: number[], b: number[], t: number) => a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(',')
    let last = performance.now()
    let raf = 0

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, w, h)
      const band = h * (w < ARC_MIN_WIDTH ? 0.22 : 0.09)

      // the arc, from its layer
      if (arcLayer.width) ctx.drawImage(arcLayer, 0, 0, w, h)

      // a glow behind the picked ring, and a flash behind AI rings as candidates pass
      for (let i = 0; i < n; i++) {
        const on = i === activeRef.current
        const strength = on ? 1 : glow[i] * 0.6
        if (strength > 0.01) {
          const x = gateAt(i) * w
          const y = yAt(gateAt(i))
          const rgb = isAI[i] ? GREEN : [238, 242, 248]
          const g = ctx.createRadialGradient(x, y, 0, x, y, 30)
          g.addColorStop(0, `rgba(${rgb.join(',')},${0.3 * strength})`)
          g.addColorStop(1, `rgba(${rgb.join(',')},0)`)
          ctx.fillStyle = g
          ctx.fillRect(x - 30, y - 30, 60, 60)
        }
        glow[i] = Math.max(0, glow[i] - dt * 1.6)
      }

      // the candidates, streaming along the arc
      for (const d of dots) {
        if (!reduced) {
          d.x += d.speed * dt
          if (d.x > 1) {
            d.x -= 1
            d.lane = Math.random() * 2 - 1
          }
        }
        const fx = PAD * 0.5 + d.x * (1 - PAD) // share of the width
        // squeeze through each ring: narrow at a ring, widest halfway between two
        const u = ((fx - PAD) / (1 - 2 * PAD)) * n
        const between = u < 0 || u > n ? 1 : Math.abs((u % 1) - 0.5) * 2
        const y = yAt(fx) + d.lane * band * (0.1 + 0.9 * between) + Math.sin(now / 900 + d.phase) * 1.5
        // passing an AI ring lights the candidate up
        const gi = Math.floor(u)
        if (gi >= 0 && gi < n && between < 0.06 && isAI[gi]) {
          d.flash = 1
          glow[gi] = Math.min(1, glow[gi] + 0.35)
        }
        d.flash = Math.max(0, d.flash - dt * 1.8)
        const t = Math.min(1, Math.max(0, (fx - PAD) / (1 - 2 * PAD)))
        const base = mix(CYAN, AMBER, t)
        const rgb = d.flash > 0 ? mix(base.split(',').map(Number), GREEN, d.flash) : base
        const fade = Math.min(1, d.x / 0.06, (1 - d.x) / 0.06)
        ctx.fillStyle = `rgba(${rgb},${0.8 * fade})`
        const r = d.r + d.flash * 0.8
        ctx.fillRect(fx * w - r, y - r, r * 2, r * 2)
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [inView])

  // each flag's height on the arc, handed to CSS (the arc lies flat on phones)
  const onArc = (fx: number) => ({ '--arc-y': arcY(fx) }) as CSSProperties

  const shown = focus === null ? null : stages[focus]
  const SHADOW = '[text-shadow:0_0_6px_rgb(8_17_40),0_0_14px_rgb(8_17_40),0_1px_2px_rgb(8_17_40)]'

  return (
    <>
      {/* the band's height follows the window's, so the chapter's heading and the whole flow fit one screen */}
      <div
        ref={wrap}
        className="relative h-44 select-none md:h-[clamp(18rem,calc(100svh-19.25rem),26rem)]"
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
      >
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <span
          aria-hidden="true"
          className={`absolute top-[calc(50%+1.5rem)] left-0 font-mono ${SHADOW} text-[0.75rem] font-semibold tracking-[0.16em] text-cyan uppercase md:top-[calc(var(--arc-y)*100%+1.25rem)]`}
          style={onArc(PAD * 0.5)}
        >
          Campus
        </span>
        <span
          aria-hidden="true"
          className={`absolute top-[calc(50%-2.5rem)] right-0 font-mono ${SHADOW} text-[0.75rem] font-semibold tracking-[0.16em] text-amber uppercase md:top-[calc(var(--arc-y)*100%-2.25rem)]`}
          style={onArc(1 - PAD * 0.5)}
        >
          Company
        </span>
        {/* a milestone flag per stage, standing on the arc (even stages) or hanging from it (odd stages); its dot sits on the curve */}
        <ol aria-label="Campus to Company stages">
          {stages.map((s, i) => {
            const on = i === focus
            const blurred = hover !== null && !on // the others soften only while a step is pointed at
            const up = i % 2 === 0
            const Icon = s.icon
            // the pop-up centres on the step, eased inward at the first and last so it stays on screen
            const popX = i === 0 ? '-translate-x-[22%]' : i === n - 1 ? '-translate-x-[78%]' : '-translate-x-1/2'
            const look = () => {
              setHover(i)
              setStep(i)
            }
            return (
              <li
                key={s.id}
                className={`absolute top-1/2 -translate-x-1/2 md:top-[calc(var(--arc-y)*100%)] ${up ? '-translate-y-full' : ''} ${on ? 'z-10' : ''}`}
                style={{ left: `${gateAt(i) * 100}%`, ...onArc(gateAt(i)) }}
              >
                <button
                  type="button"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && look()}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
                  onFocus={(e) => e.currentTarget.matches(':focus-visible') && look()}
                  onBlur={() => setHover(null)}
                  onClick={() => setStep(i)}
                  aria-label={`${s.label}${s.ai ? `, with ${s.ai}` : ''}: ${s.line}`}
                  className={`group flex cursor-default items-center transition-[filter,opacity] duration-300 focus-visible:outline-none ${up ? 'flex-col' : 'flex-col-reverse'} ${
                    blurred ? 'opacity-45 blur-[1px]' : ''
                  }`}
                >
                  {/* the stage's name (phones show it under the row; while its pop-up is open, the pop-up carries it) */}
                  <span
                    className={`relative max-w-[7.5rem] text-center text-[0.75rem] leading-tight font-semibold ${SHADOW} transition-colors duration-300 max-md:hidden xl:text-[0.8125rem] 2xl:max-w-none 2xl:text-[0.875rem] 2xl:whitespace-nowrap ${
                      up ? 'mb-2' : 'mt-2'
                    } ${on ? 'hidden' : 'text-paper/85'}`}
                  >
                    {s.label}
                  </span>
                  {/* the tile */}
                  <span
                    className={`relative flex h-7 w-7 items-center justify-center rounded-lg ring-1 transition-all duration-300 md:h-9 md:w-9 md:rounded-xl ${
                      on ? 'bg-paper text-ink ring-paper' : `bg-deep ${s.ai ? 'text-green ring-green/55' : 'text-mist ring-paper/25'}`
                    }`}
                    style={on ? { boxShadow: `0 0 26px ${s.ai ? 'rgb(20 161 126 / 0.6)' : 'rgb(238 242 248 / 0.35)'}` } : undefined}
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={1.9} />
                    {s.ai && (
                      <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 text-[0.625rem] leading-none text-green">
                        ✦
                      </span>
                    )}
                  </span>
                  {/* the stem, fading toward the curve */}
                  <span aria-hidden="true" className={`block h-3 w-px md:h-7 ${STEM[up ? 'up' : 'down'][on ? 'on' : 'off']}`} />
                  {/* the dot on the curve: centred on the line */}
                  <span
                    aria-hidden="true"
                    className={`block h-2.5 w-2.5 rounded-[2px] ring-2 ring-ink transition-colors duration-300 ${up ? 'translate-y-1/2' : '-translate-y-1/2'} ${
                      on ? 'bg-paper' : s.ai ? 'bg-green' : 'bg-mist'
                    }`}
                  />
                </button>
                {/* the pop-up: which step, its AI, its name and what happens there; it opens beyond the flag's tile, on the flag's side of the curve, centred on the step (eased in at either end) */}
                {on && (
                  <span
                    key={s.id}
                    aria-hidden="true"
                    className={`flow-pop pointer-events-none absolute left-1/2 hidden w-72 rounded-2xl bg-deep/95 px-3.5 py-2.5 text-left md:block ${up ? 'bottom-full mb-2' : 'top-full mt-2'} ${popX}`}
                    style={{
                      boxShadow: `inset 0 0 0 1px ${s.ai ? 'rgb(20 161 126 / 0.5)' : 'rgb(238 242 248 / 0.2)'}, 0 24px 50px -20px rgb(0 0 0 / 0.85)`,
                    }}
                  >
                    {/* one line for the step and its name (and its AI, at the right), then what happens there */}
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-[0.9375rem] leading-snug font-semibold text-paper">
                        <span className="mr-1.5 font-mono text-[0.75rem] font-normal text-haze">{pad(i + 1)}</span>
                        {s.label}
                      </span>
                      {s.ai && <span className="shrink-0 text-[0.6875rem] text-green">✦ {s.ai}</span>}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-snug font-normal text-mist">{s.line}</span>
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </div>
      {/* phones (no names on the flags): the current stage, named, with its line (a fixed height, so the page never shifts) */}
      <p aria-hidden="true" className="mt-4 min-h-[5.5rem] text-center text-[0.9375rem] leading-snug text-mist md:hidden">
        {shown ? (
          <>
            <span className="block font-semibold text-paper">{shown.label}</span>
            {shown.line}
          </>
        ) : (
          'Tap a stage'
        )}
      </p>
    </>
  )
}
