import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { climb } from '../lib/climb'
import { prefersReducedMotion, useInView } from '../lib/motion'

// HR Central as a climb: a glowing trail rises from bottom-left to top-right
// like a path up a hill, with a neon node at each of the seven stages and its
// name below and to the right of it, clear of the trail. One professional
// climbs it: while on screen it steps through the stages every few seconds,
// and the climber walks up the trail to the current node (from the top, it
// fades and starts again at the bottom). The current node glows and pulses,
// the trail lights up to it, the view drifts gently toward it, and its name
// and line show beneath. Pointing at a node (or focusing it) jumps there and
// holds; arrow keys step through; moving away plays on. With reduced motion
// the climber simply stands at the current node and the view stays put.

const STEP_MS = 3500
const W = 1200
const H = 340
// the trail: steep, then a ledge, then steep again, then the long last pitch
const NODES: [number, number][] = [
  [70, 300],
  [240, 262],
  [400, 222],
  [560, 170],
  [730, 148],
  [890, 95],
  [1060, 50],
]
const n = NODES.length

// a smooth curve through the nodes (Catmull-Rom as cubic Béziers)
type Pt = [number, number]
const SEGS = NODES.slice(0, -1).map((p1, i) => {
  const p0 = NODES[i - 1] ?? p1
  const p2 = NODES[i + 1]
  const p3 = NODES[i + 2] ?? p2
  const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
  const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
  return [p1, c1, c2, p2] as Pt[]
})
const TRAIL = `M${NODES[0][0]} ${NODES[0][1]} ` + SEGS.map(([, c1, c2, p2]) => `C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`).join(' ')

// how far along the trail each node is (0 to 1), measured by sampling each curve
const bez = (s: Pt[], t: number): Pt => {
  const u = 1 - t
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return [k[0] * s[0][0] + k[1] * s[1][0] + k[2] * s[2][0] + k[3] * s[3][0], k[0] * s[0][1] + k[1] * s[1][1] + k[2] * s[2][1] + k[3] * s[3][1]]
}
const SEG_LEN = SEGS.map((s) => {
  let len = 0
  let prev = bez(s, 0)
  for (let k = 1; k <= 40; k++) {
    const p = bez(s, k / 40)
    len += Math.hypot(p[0] - prev[0], p[1] - prev[1])
    prev = p
  }
  return len
})
const TOTAL = SEG_LEN.reduce((a, b) => a + b, 0)
const AT = NODES.map((_, i) => SEG_LEN.slice(0, i).reduce((a, b) => a + b, 0) / TOTAL)

const WALK_SPEED = 0.16 // share of the trail per second

export function ClimbFlow() {
  const wrap = useRef<HTMLDivElement>(null)
  const trail = useRef<SVGPathElement>(null)
  const climber = useRef<SVGGElement>(null)
  const inView = useInView(wrap, '0px')
  const [calm] = useState(prefersReducedMotion)
  const [hover, setHover] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const active = hover ?? step
  const target = useRef(AT[0]) // the trail position the climber walks toward
  const pos = useRef({ at: AT[0], fade: 1 }) // where the climber is on the trail, kept across steps
  useEffect(() => {
    target.current = AT[active]
  }, [active])

  useEffect(() => {
    if (calm || !inView || hover !== null) return
    const id = window.setTimeout(() => setStep((k) => (k + 1) % n), STEP_MS)
    return () => window.clearTimeout(id)
  }, [calm, inView, hover, step])

  // the climber walks along the trail toward the current node, from a ref in a frame loop (never state)
  useEffect(() => {
    const path = trail.current
    const g = climber.current
    if (!path || !g) return
    const len = path.getTotalLength()
    const me = pos.current
    let raf = 0
    let last = performance.now()
    const place = () => {
      const p = path.getPointAtLength(me.at * len)
      g.setAttribute('transform', `translate(${p.x} ${p.y})`)
      g.style.opacity = String(me.fade)
    }
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const goal = target.current
      if (goal < me.at - 0.001) {
        // back to an earlier stage: fade out, reappear there
        me.fade = Math.max(0, me.fade - dt * 4)
        if (me.fade === 0) me.at = goal
      } else {
        me.fade = Math.min(1, me.fade + dt * 4)
        // a steady walk, a little quicker when it has fallen behind
        me.at = Math.min(goal, me.at + Math.max(WALK_SPEED, (goal - me.at) * 1.5) * dt)
      }
      g.classList.toggle('is-walking', goal - me.at > 0.002 && me.fade > 0.5)
      place()
      if (inView && !calm) raf = requestAnimationFrame(frame)
    }
    if (calm || !inView) {
      me.at = target.current
      me.fade = 1
      place()
      return
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [calm, inView, active])

  const look = (i: number) => {
    setHover(i)
    setStep(i)
  }
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const next = (active + d + n) % n
    look(next)
    wrap.current?.querySelector<SVGGElement>(`[data-node="${next}"]`)?.focus()
  }

  // the camera: a gentle drift toward the current node
  const [nx, ny] = NODES[active]
  const camera = calm ? undefined : `translate(${(W / 2 - nx) * 0.06}px, ${(H / 2 - ny) * 0.06}px)`
  const s = climb[active]

  return (
    <div ref={wrap} onKeyDown={onKey}>
      <div
        className="relative h-48 select-none md:h-[clamp(14rem,calc(100svh-25rem),24rem)]"
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full overflow-visible"
          role="group"
          aria-label="The climb from onboarding to hiring, in seven stages"
        >
          <defs>
            <linearGradient id="climb-trail" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#34bde8" />
              <stop offset="1" stopColor="#f5b134" />
            </linearGradient>
            <linearGradient id="climb-suit" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4a6aa8" />
              <stop offset="1" stopColor="#0d1a3a" />
            </linearGradient>
            <radialGradient id="climb-head" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#eef2f8" />
              <stop offset="1" stopColor="#8292b4" />
            </radialGradient>
            <filter id="climb-glow" x="-1" y="-1" width="3" height="3">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <g style={{ transform: camera, transition: 'transform 1.4s var(--ease-glide)' }}>
            {/* the trail: a soft glow, a faint dotted line, and the climbed part lit up to the current node */}
            <path d={TRAIL} fill="none" stroke="url(#climb-trail)" strokeWidth={16} strokeLinecap="round" opacity={0.12} filter="url(#climb-glow)" />
            <path ref={trail} d={TRAIL} fill="none" stroke="rgb(238 242 248 / 0.18)" strokeWidth={1.5} strokeDasharray="2 7" strokeLinecap="round" />
            <path
              d={TRAIL}
              fill="none"
              stroke="url(#climb-trail)"
              strokeWidth={3}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              style={{ strokeDashoffset: 1 - AT[active], transition: 'stroke-dashoffset 1.6s var(--ease-glide)' }}
            />

            {/* a node per stage: a neon square on the trail, its name below and to the right */}
            {climb.map((c, i) => {
              const [x, y] = NODES[i]
              const on = i === active
              const reached = i <= active
              const color = reached ? '#f5b134' : '#9aa8c3'
              return (
                <g
                  key={c.id}
                  data-node={i}
                  role="button"
                  tabIndex={0}
                  aria-label={`${c.label}: ${c.line}`}
                  aria-pressed={on}
                  className="cursor-pointer focus-visible:outline-none"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && look(i)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
                  onFocus={(e) => e.currentTarget.matches(':focus-visible') && look(i)}
                  onBlur={() => setHover(null)}
                  onClick={() => setStep(i)}
                  style={{ opacity: on ? 1 : reached ? 0.85 : 0.55, transition: 'opacity 0.5s var(--ease-glide)' }}
                >
                  <rect x={x - 30} y={y - 30} width={210} height={90} fill="transparent" />
                  <g transform={`translate(${x} ${y})`}>
                    {on && <rect x={-18} y={-18} width={36} height={36} fill={color} opacity={0.55} filter="url(#climb-glow)" />}
                    {on && !calm && <rect x={-9} y={-9} width={18} height={18} rx={2} fill="none" stroke={color} strokeWidth={1.5} className="climb-pulse" />}
                    <rect
                      x={-7}
                      y={-7}
                      width={14}
                      height={14}
                      rx={2}
                      transform="rotate(45)"
                      fill={on ? color : '#081128'}
                      stroke={color}
                      strokeWidth={2}
                      style={{ transition: 'fill 0.4s var(--ease-glide)' }}
                    />
                  </g>
                  <text
                    x={x + 20}
                    y={y + 36}
                    fontSize={24}
                    fontWeight={600}
                    fill={on ? '#eef2f8' : '#9aa8c3'}
                    className="max-md:hidden"
                    style={{ transition: 'fill 0.4s var(--ease-glide)' }}
                  >
                    {c.label}
                  </text>
                </g>
              )
            })}

            {/* the climber: a professional in a suit, shaded for depth, legs swinging while walking */}
            <g ref={climber} aria-hidden="true" style={{ transition: 'opacity 0.2s var(--ease-glide)' }}>
              <ellipse cx={0} cy={0} rx={11} ry={2.6} fill="#000" opacity={0.5} />
              <g transform="translate(0 -4) scale(1.35) rotate(-6)">
                <line className="climb-leg" x1={0} y1={-14} x2={0} y2={0} stroke="#1c305c" strokeWidth={3.6} strokeLinecap="round" />
                <line className="climb-leg climb-leg-2" x1={0} y1={-14} x2={0} y2={0} stroke="#1c305c" strokeWidth={3.6} strokeLinecap="round" />
                <rect x={-6.5} y={-29} width={13} height={16} rx={4} fill="url(#climb-suit)" stroke="rgb(238 242 248 / 0.35)" strokeWidth={0.8} />
                <path d="M0 -27 L1.6 -23 L0 -17 L-1.6 -23 Z" fill="#f5b134" />
                <rect x={6} y={-17} width={7} height={5.5} rx={1} fill="#0d1a3a" stroke="rgb(238 242 248 / 0.45)" strokeWidth={0.8} />
                <circle cx={0} cy={-34} r={5.2} fill="url(#climb-head)" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* the current stage, in words (a fixed height, so the page never shifts) */}
      <div aria-live="polite" className="mx-auto mt-4 min-h-[4.75rem] max-w-[46rem] text-center">
        <p key={s.id} className="flow-pop">
          <span className="display block text-[clamp(1.5rem,2.2vw,2rem)] text-paper">{s.label}</span>
          <span className="mt-1.5 block text-[0.9375rem] text-mist">{s.line}</span>
        </p>
      </div>
    </div>
  )
}
