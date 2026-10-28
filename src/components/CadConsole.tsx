import { useEffect, useMemo, useRef } from 'react'
import { engineering } from '../content'
import { ARRIVAL, buildCar, FRAME, VIEW, type Group, type Part } from '../lib/carParts'
import { prefersReducedMotion } from '../lib/motion'

// The Digital Design Agent at work: a robotic micro-factory. The car's parts
// start scattered across a blueprint floor; three robot arms slide in along
// their rails, pick each part, guide it in on a laser line and weld it into
// place, frame first and the last bolt at the end. The finished car is
// scanned, holds, fades, and the line resets: a 16 s loop drawn on a canvas.

const { cad } = engineering
const CYCLE_MS = 16000

// 0–.08 parts staged, arms slide in · .08–.70 assembling · .70–.86 assembled (scan) · .86–.96 fade and reset · .96–1 empty floor
const T = { in: 0.08, done: 0.7, hold: 0.86, end: 0.96 }
/** how long each part takes to travel, as a share of the assembly */
const TRAVEL = 0.09

const CYAN = '#34bde8'
const ORANGE = '#fb923c'
const GREEN = '#34d399'
const SHADE: Record<Group, string> = {
  chassis: '#5aa9cc',
  suspension: '#5aa9cc',
  powertrain: CYAN,
  drivetrain: CYAN,
  brake: CYAN,
  wheel: CYAN,
  interior: '#5aa9cc',
  body: CYAN,
  glass: '#8fdcf5',
  wiring: '#5aa9cc',
  fastener: '#d6f4ff',
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a))
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

type Flight = Part & { sx: number; sy: number; rot: number; delay: number; arm: number }

/** Where each part is staged on the floor, which arm places it, and when. */
function plan(parts: Part[]): Flight[] {
  const mid = { x: VIEW.w / 2, y: 260 }
  return parts.map((p, i) => {
    const dx = p.cx - mid.x
    const dy = p.cy - mid.y
    const len = Math.hypot(dx, dy) || 1
    const push = 120 + rand(i * 3 + 1) * 220
    const spread = (rand(i * 3 + 2) - 0.5) * 1.1
    const ax = (dx / len) * Math.cos(spread) - (dy / len) * Math.sin(spread)
    const ay = (dx / len) * Math.sin(spread) + (dy / len) * Math.cos(spread)
    // the arm nearest the part's place takes it: left top, bottom, right top
    const arm = p.cx < 380 ? 0 : p.cx < 640 ? 1 : 2
    return {
      ...p,
      // staged across the whole floor rather than pushed outward, so nothing piles up at the edges
      sx: Math.min(920, Math.max(80, p.cx + ax * push)) * 0.35 + (90 + rand(i * 5 + 7) * 820) * 0.65,
      sy: Math.min(370, Math.max(130, p.cy + ay * push * 0.6)) * 0.35 + (135 + rand(i * 5 + 8) * 225) * 0.65,
      rot: (rand(i * 3 + 3) - 0.5) * 2.4,
      delay: Math.min(1 - TRAVEL, ARRIVAL[p.group] * 0.86 + (p.cx / VIEW.w) * 0.05 + rand(i * 11) * 0.03),
      arm,
    }
  })
}

// three arms: two hanging from the top rail, one standing on the floor rail
const TOP = FRAME.top + 6
const FLOOR = FRAME.top + FRAME.h - 6
const ARMS = [
  { rail: TOP, park: 160, enter: -160, down: 1 },
  { rail: FLOOR, park: 500, enter: -160, down: -1 },
  { rail: TOP, park: 840, enter: VIEW.w + 160, down: 1 },
]
const L1 = 92
const L2 = 84

type Status = keyof typeof cad.status

export function CadConsole({ stage }: { stage: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const flights = useMemo(() => plan(buildCar()), [])
  const total = flights.length
  const shown = cad.parts

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const reduced = prefersReducedMotion()
    // when each part locked in (performance.now), for its weld; -1 while it's loose
    const lockedAt = new Float64Array(flights.length).fill(-1)
    const arms = ARMS.map((a) => ({ base: a.enter, tipX: a.enter, tipY: a.rail + a.down * 120, active: -1 }))
    let scale = 1
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(((w * FRAME.h) / VIEW.w) * dpr)
      scale = canvas.width / VIEW.w / dpr
    }

    let shownStatus: Status | null = null
    let shownCount = -1
    const dotClass: Record<Status, string> = {
      staged: 'bg-orange',
      assembling: 'bg-signal live-dot',
      assembled: 'bg-green',
      resetting: 'bg-haze',
    }
    const report = (count: number, status: Status) => {
      if (count !== shownCount) {
        shownCount = count
        countRef.current!.textContent = `${count.toLocaleString('en-US')} / ${shown.toLocaleString('en-US')}`
        countRef.current!.className = `font-semibold tabular-nums ${count === shown ? 'text-green' : 'text-signal'}`
      }
      if (status !== shownStatus) {
        shownStatus = status
        statusRef.current!.textContent = cad.status[status]
        dotRef.current!.className = `h-1.5 w-1.5 rounded-[2px] ${dotClass[status]}`
      }
    }

    const drawShape = (f: Flight) => {
      const s = f.shape
      ctx.beginPath()
      if (s.kind === 'line') {
        ctx.moveTo(s.x1, s.y1)
        ctx.lineTo(s.x2, s.y2)
        ctx.stroke()
      } else if (s.kind === 'arc') {
        const m = (s.a0 + s.a1) / 2
        ctx.arc(-Math.cos(m) * s.r, -Math.sin(m) * s.r, s.r, s.a0, s.a1)
        ctx.stroke()
      } else if (s.kind === 'rect') {
        ctx.rect(-s.w / 2, -s.h / 2, s.w, s.h)
        ctx.stroke()
      } else {
        ctx.arc(0, 0, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    /** One robot arm: carriage on its rail, two links reaching for (tx, ty), a gripper. */
    const drawArm = (base: number, rail: number, down: number, tx: number, ty: number, busy: boolean) => {
      const sx = base
      const sy = rail + down * 16
      let dx = tx - sx
      let dy = ty - sy
      let d = Math.hypot(dx, dy)
      const reach = L1 + L2 - 2
      if (d > reach) {
        dx *= reach / d
        dy *= reach / d
        d = reach
      }
      d = Math.max(d, Math.abs(L1 - L2) + 2)
      const a = Math.atan2(dy, dx)
      const bend = Math.acos(Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)))
      // the elbow bends away from the car
      const ea = a - bend * down
      const ex = sx + Math.cos(ea) * L1
      const ey = sy + Math.sin(ea) * L1
      const wx = sx + dx
      const wy = sy + dy

      ctx.globalAlpha = 0.9
      ctx.strokeStyle = CYAN
      // carriage
      ctx.lineWidth = 1.4
      ctx.strokeRect(sx - 16, rail - 6, 32, 12)
      ctx.beginPath()
      ctx.moveTo(sx, rail + down * 6)
      ctx.lineTo(sx, sy)
      ctx.stroke()
      // links
      ctx.lineWidth = 5
      ctx.globalAlpha = 0.18
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.lineTo(ex, ey)
      ctx.lineTo(wx, wy)
      ctx.stroke()
      ctx.globalAlpha = 0.95
      ctx.lineWidth = 1.6
      ctx.stroke()
      // joints
      for (const [jx, jy, r] of [[sx, sy, 5], [ex, ey, 4]] as const) {
        ctx.beginPath()
        ctx.arc(jx, jy, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      // gripper: two fingers, closed while carrying
      const ga = Math.atan2(wy - ey, wx - ex)
      const open = busy ? 3 : 7
      ctx.strokeStyle = busy ? ORANGE : CYAN
      ctx.beginPath()
      for (const side of [-1, 1]) {
        const ox = wx + Math.cos(ga + (side * Math.PI) / 2) * open
        const oy = wy + Math.sin(ga + (side * Math.PI) / 2) * open
        ctx.moveTo(ox, oy)
        ctx.lineTo(ox + Math.cos(ga) * 9, oy + Math.sin(ga) * 9)
      }
      ctx.stroke()
    }

    const frame = (phase: number, now: number) => {
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, -FRAME.top * dpr * scale)
      ctx.clearRect(0, FRAME.top, VIEW.w, FRAME.h)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const assembling = phase >= T.in && phase < T.done
      const tIn = range(phase, T.in, T.done)
      // the floor fades in at the start of a cycle, the finished car fades out at its end
      const fadeIn = range(phase, 0, 0.03)
      const fadeOut = 1 - range(phase, T.hold, T.end)
      const presence = phase >= T.end ? 0 : Math.min(fadeIn, fadeOut)
      // the arms slide in while parts are staged, and out as the line resets
      const armsIn = ease(range(phase, 0.01, T.in)) * (1 - ease(range(phase, T.hold, T.end)))

      // rails and the ground line
      ctx.globalAlpha = 0.22
      ctx.strokeStyle = CYAN
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, TOP)
      ctx.lineTo(VIEW.w, TOP)
      ctx.moveTo(0, FLOOR)
      ctx.lineTo(VIEW.w, FLOOR)
      ctx.moveTo(60, 370)
      ctx.lineTo(940, 370)
      ctx.stroke()

      // each part's progress, and which part each arm is carrying now
      const k = new Float32Array(flights.length)
      const best = [-1, -1, -1]
      const bestP = [-1, -1, -1]
      let locked = 0
      for (let i = 0; i < flights.length; i++) {
        const f = flights[i]
        const p = phase < T.in ? 0 : assembling ? ease(clamp((tIn - f.delay) / TRAVEL)) : phase < T.end ? 1 : 0
        k[i] = p
        if (p > 0 && p < 1 && p > bestP[f.arm]) {
          bestP[f.arm] = p
          best[f.arm] = i
        }
        if (p >= 1) {
          locked++
          if (lockedAt[i] < 0) lockedAt[i] = now
        } else lockedAt[i] = -1
      }

      // alignment guides: axis lines through each target joint, and a laser from the tool to it
      for (let a = 0; a < 3; a++) {
        const i = best[a]
        if (i < 0) continue
        const f = flights[i]
        ctx.globalAlpha = 0.14 * presence
        ctx.strokeStyle = CYAN
        ctx.lineWidth = 1
        ctx.setLineDash([3, 5])
        ctx.beginPath()
        ctx.moveTo(f.cx, FRAME.top)
        ctx.lineTo(f.cx, FRAME.top + FRAME.h)
        ctx.moveTo(0, f.cy)
        ctx.lineTo(VIEW.w, f.cy)
        ctx.stroke()
        const x = f.sx + (f.cx - f.sx) * k[i]
        const y = f.sy + (f.cy - f.sy) * k[i]
        ctx.globalAlpha = 0.75 * presence
        ctx.strokeStyle = ORANGE
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(f.cx, f.cy)
        ctx.stroke()
        ctx.setLineDash([])
        // the active joint: an orange point, pulsing
        ctx.fillStyle = ORANGE
        ctx.globalAlpha = (0.6 + 0.4 * Math.sin(now / 90)) * presence
        ctx.beginPath()
        ctx.arc(f.cx, f.cy, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // the parts: dim while staged, bright once placed
      for (let i = 0; i < flights.length; i++) {
        const f = flights[i]
        const p = k[i]
        const x = f.sx + (f.cx - f.sx) * p
        const y = f.sy + (f.cy - f.sy) * p
        ctx.globalAlpha = (0.14 + p * 0.81) * presence
        ctx.strokeStyle = SHADE[f.group]
        ctx.fillStyle = ctx.strokeStyle
        ctx.lineWidth = f.width
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(f.rot * (1 - p))
        drawShape(f)
        ctx.restore()
      }

      // welds: sparks fly from each joint as it locks, then it shows green for a moment
      for (let i = 0; i < flights.length; i++) {
        if (lockedAt[i] < 0) continue
        const age = now - lockedAt[i]
        if (age > 1400) continue
        const f = flights[i]
        if (age < 380) {
          const u = age / 380
          ctx.globalAlpha = (1 - u) * presence
          ctx.strokeStyle = ORANGE
          ctx.lineWidth = 1.2
          ctx.beginPath()
          for (let s = 0; s < 6; s++) {
            const ang = rand(i * 13 + s) * Math.PI * 2
            const r0 = 2 + u * 4
            const r1 = r0 + 3 + u * 9
            ctx.moveTo(f.cx + Math.cos(ang) * r0, f.cy + Math.sin(ang) * r0)
            ctx.lineTo(f.cx + Math.cos(ang) * r1, f.cy + Math.sin(ang) * r1)
          }
          ctx.stroke()
        }
        ctx.globalAlpha = (1 - age / 1400) * 0.9 * presence
        ctx.fillStyle = GREEN
        ctx.beginPath()
        ctx.arc(f.cx, f.cy, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }

      // the arms: each follows the part it carries, or rests over its station
      for (let a = 0; a < 3; a++) {
        const spec = ARMS[a]
        const arm = arms[a]
        const i = best[a]
        let tx: number
        let ty: number
        if (i >= 0) {
          const f = flights[i]
          tx = f.sx + (f.cx - f.sx) * k[i]
          ty = f.sy + (f.cy - f.sy) * k[i]
        } else {
          tx = spec.park + Math.sin(now / 900 + a) * 10
          ty = spec.rail + spec.down * 120
        }
        const glide = reduced ? 1 : 0.18
        arm.base += (Math.min(940, Math.max(60, tx)) - arm.base) * glide * 0.6
        arm.tipX += (tx - arm.tipX) * glide
        arm.tipY += (ty - arm.tipY) * glide
        const base = spec.enter + (arm.base - spec.enter) * armsIn
        const tipX = spec.enter + (arm.tipX - spec.enter) * armsIn
        if (armsIn > 0.01) drawArm(base, spec.rail, spec.down, tipX, arm.tipY, i >= 0)
      }

      // the finished car is scanned once, left to right
      if (phase >= T.done && phase < T.hold) {
        const u = range(phase, T.done, T.hold)
        const sx = 80 + u * 860
        const grad = ctx.createLinearGradient(sx - 60, 0, sx, 0)
        grad.addColorStop(0, 'rgba(52,189,232,0)')
        grad.addColorStop(1, 'rgba(52,189,232,0.16)')
        ctx.globalAlpha = 1
        ctx.fillStyle = grad
        ctx.fillRect(sx - 60, 125, 60, 250)
        ctx.strokeStyle = GREEN
        ctx.globalAlpha = 0.8
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(sx, 125)
        ctx.lineTo(sx, 375)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      const count = Math.round((locked / total) * shown)
      report(
        count,
        phase < T.in ? 'staged' : phase < T.done && locked < total ? 'assembling' : phase < T.hold ? 'assembled' : 'resetting',
      )
    }

    resize()
    // for checking any moment of the cycle by hand
    if (import.meta.env.DEV) Object.assign(window, { __cadFrame: (phase: number) => frame(phase, performance.now()) })
    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) frame(T.done + 0.01, 0)
    })
    ro.observe(canvas)

    if (reduced) {
      frame(T.done + 0.01, 0)
      return () => ro.disconnect()
    }

    // runs only while the console is on screen
    let raf = 0
    let running = false
    let elapsed = 0
    let last = 0
    const loop = (now: number) => {
      // dev only: hold the current frame while checking it by hand
      if (import.meta.env.DEV && '__cadPause' in window) {
        raf = requestAnimationFrame(loop)
        return
      }
      elapsed += Math.min(64, now - last)
      last = now
      frame((elapsed % CYCLE_MS) / CYCLE_MS, now)
      if (running) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(loop)
      } else if (!e.isIntersecting) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    io.observe(canvas)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [flights, total, shown])

  const s = engineering.stages[stage]

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0c0e14] ring-1 ring-[var(--line)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(238_242_248/0.25),transparent)]"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] px-5 py-3.5 text-[0.8125rem] md:px-7">
        <span className="flex items-center gap-2 text-mist">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[2px] bg-signal" />
          <span key={s.cadMode} className="anim-fade tracking-[0.06em]">
            {s.cadMode}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-mist">
          <span ref={countRef} className="font-semibold tabular-nums text-signal">
            0 / {shown.toLocaleString('en-US')}
          </span>
          <span className="text-haze uppercase">{cad.partsLabel}</span>
        </span>
      </div>

      {/* the blueprint floor: a faint dot-matrix grid */}
      <div
        role="img"
        aria-label={cad.label}
        className="relative bg-[radial-gradient(rgb(52_189_232/0.16)_1px,transparent_1.2px)] bg-[length:18px_18px] px-3 py-5 md:px-6 md:py-8"
      >
        <canvas ref={canvasRef} className="relative block h-auto w-full" />
      </div>

      <div className="flex items-center justify-center border-t border-[var(--line)] px-5 py-3.5 text-[0.75rem] tracking-[0.06em] text-mist md:text-[0.8125rem]">
        <span className="flex items-center gap-2">
          <span ref={dotRef} aria-hidden="true" className="h-1.5 w-1.5 rounded-[2px] bg-orange" />
          <span ref={statusRef} aria-hidden="true">
            {cad.status.staged}
          </span>
        </span>
      </div>
    </div>
  )
}
