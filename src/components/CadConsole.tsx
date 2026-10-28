import { useEffect, useRef } from 'react'
import rawSvg from '../assets/exploded-assembly.svg?raw'
import { engineering } from '../content'
import { prefersReducedMotion } from '../lib/motion'

// The Digital Design Agent at work: a 50-part car assembly that explodes into
// its modules and reassembles itself on a 12 s cycle, with live telemetry. The
// drawing is the original Design A artwork, recoloured to the brand palette.

const { cad } = engineering

/** Original Tailwind cyans and oranges → brand cyan and orange. */
const svg = rawSvg
  .replace(/#(38BDF8|22D3EE|06B6D4)/gi, '#34BDE8')
  .replace(/#(F97316|FB923C|EA580C)/gi, '#EA7532')
  .replace(/rgba\((56, 189, 248|34, 211, 238|6, 182, 212),/g, 'rgba(52, 189, 232,')
  .replace(/rgba\((249, 115, 22|251, 146, 60),/g, 'rgba(234, 117, 50,')
  .replace(/rgba\(100, 116, 139,/g, 'rgba(154, 168, 195,')
  .replace(/class="[^"]*my-auto[^"]*"/, 'class="cad-svg block h-auto w-full max-w-[560px]"')

const CYCLE_MS = 12000
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const staggered = (t: number, delay: number) => easeInOutCubic(Math.max(0, Math.min(1, (t - delay * 0.3) / (1 - delay * 0.3))))

type Status = keyof typeof cad.status
const dot: Record<Status, string> = {
  assembled: 'bg-green',
  exploding: 'bg-signal live-dot',
  exploded: 'bg-orange',
  reassembling: 'bg-signal live-dot',
}

export function CadConsole({ stage }: { stage: number }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = stageRef.current!
    const parts = [...root.querySelectorAll<SVGGElement>('.explode-part')].map((el) => ({
      el,
      ex: parseFloat(el.dataset.ex ?? '0'),
      ey: parseFloat(el.dataset.ey ?? '0'),
      delay: parseFloat(el.dataset.delay ?? '0'),
      glow: false,
    }))
    const guides = root.querySelector<SVGGElement>('#assembly-guide-lines')
    const total = cad.totalNodes
    let shownStatus: Status | null = null

    const setStatus = (s: Status) => {
      if (s === shownStatus) return
      shownStatus = s
      statusRef.current!.textContent = cad.status[s]
      dotRef.current!.className = `h-1.5 w-1.5 rounded-[2px] ${dot[s]}`
    }

    const frame = (phase: number) => {
      // 0–.08 assembled · .08–.42 explode · .42–.52 exploded · .52–.88 reassemble · .88–1 assembled
      let amount = 0
      let exploding = false
      let reassembling = false
      if (phase < 0.08) amount = 0
      else if (phase < 0.42) {
        exploding = true
        amount = easeInOutCubic((phase - 0.08) / 0.34)
      } else if (phase < 0.52) amount = 1
      else if (phase < 0.88) {
        reassembling = true
        amount = 1 - easeInOutCubic((phase - 0.52) / 0.36)
      }

      for (const p of parts) {
        const k = exploding
          ? staggered((phase - 0.08) / 0.34, p.delay)
          : reassembling
            ? 1 - staggered((phase - 0.52) / 0.36, (1 - p.delay) * 0.3) // outer parts come back first
            : amount
        p.el.setAttribute('transform', `translate(${(p.ex * k).toFixed(2)}, ${(p.ey * k).toFixed(2)})`)
        const glow = k > 0.1 && k < 0.9
        if (glow !== p.glow) {
          p.glow = glow
          if (glow) p.el.setAttribute('filter', 'url(#cyanGlow)')
          else p.el.removeAttribute('filter')
        }
      }
      guides?.setAttribute('opacity', (amount > 0.15 ? Math.min(1, (amount - 0.15) * 2) : 0).toFixed(3))

      const count = Math.max(0, Math.min(total, Math.floor(total * (1 - amount))))
      const done = count >= total
      countRef.current!.textContent = `${count.toLocaleString('en-US')} / ${total.toLocaleString('en-US')}`
      countRef.current!.className = `font-semibold tabular-nums ${done ? 'text-green' : 'text-signal'}`

      setStatus(amount < 0.05 ? 'assembled' : amount > 0.95 ? 'exploded' : reassembling ? 'reassembling' : 'exploding')
    }

    if (prefersReducedMotion()) {
      frame(0)
      return
    }

    // runs only while the console is on screen
    let raf = 0
    let running = false
    let elapsed = 0
    let last = 0
    const loop = (now: number) => {
      elapsed += Math.min(64, now - last)
      last = now
      frame((elapsed % CYCLE_MS) / CYCLE_MS)
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
    frame(0)
    io.observe(root)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  const s = engineering.stages[stage]

  return (
    <div className="relative overflow-hidden rounded-3xl bg-deep/55 ring-1 ring-[var(--line)] backdrop-blur-xl">
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
          <span ref={countRef} className="font-semibold tabular-nums text-green">
            {cad.totalNodes.toLocaleString('en-US')} / {cad.totalNodes.toLocaleString('en-US')}
          </span>
          <span className="text-haze uppercase">{cad.nodesLabel}</span>
        </span>
      </div>

      <div ref={stageRef} role="img" aria-label={cad.label} className="relative flex items-center justify-center px-4 py-6 md:px-8 md:py-10">
        {/* a soft cyan light behind the car */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_55%,rgb(52_189_232/0.12),transparent_70%)]"
        />
        <div className="relative w-full max-w-[560px]" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>

      <div className="flex items-center justify-center border-t border-[var(--line)] px-5 py-3.5 text-[0.75rem] tracking-[0.06em] text-mist md:text-[0.8125rem]">
        <span className="flex items-center gap-2">
          <span ref={dotRef} aria-hidden="true" className="h-1.5 w-1.5 rounded-[2px] bg-green" />
          <span ref={statusRef} aria-hidden="true">
            {cad.status.assembled}
          </span>
        </span>
      </div>
    </div>
  )
}
