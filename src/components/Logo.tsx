import { useRef, type CSSProperties } from 'react'
import { FRAME_PATH, MARK_VIEWBOX, SQUARES } from '../brand/mark'

type Props = { className?: string; label?: string; interactive?: boolean }

// Mark coordinates (viewBox −4…171) to percentages of the drawn box.
const VB = { min: -4, size: 175 }
const pct = (v: number) => `${((v - VB.min) / VB.size) * 100}%`
// Centre of the white box the squares break out of.
const BOX = { x: 64.3, y: 101.9 }

/**
 * The SupplyChainz mark. With `interactive`, it is built in layers: a white
 * frame with real thickness and five squares floating in front. Hovering tilts
 * it toward the pointer and the squares break further out of the box, the idea
 * behind the mark, then spring back.
 */
export function Logo({ className = '', label, interactive = false }: Props) {
  const markRef = useRef<HTMLSpanElement>(null)

  const onMove = (e: React.PointerEvent) => {
    const el = markRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) / r.width
    const y = (e.clientY - (r.top + r.height / 2)) / r.height
    el.style.setProperty('--ry', `${Math.max(-1, Math.min(1, x)) * 28}deg`)
    el.style.setProperty('--rx', `${Math.max(-1, Math.min(1, y)) * -24}deg`)
  }
  const onLeave = () => {
    markRef.current?.style.setProperty('--ry', '0deg')
    markRef.current?.style.setProperty('--rx', '0deg')
  }

  const mark = interactive ? (
    <span ref={markRef} className="logo-3d relative block h-9 w-9 shrink-0" aria-hidden="true">
      <span className="logo-3d-body absolute inset-0">
        {/* the frame, stacked to give it depth when it tilts */}
        {[3, 2, 1].map((z) => (
          <svg key={z} viewBox={MARK_VIEWBOX} className="absolute inset-0 h-full w-full" style={{ transform: `translateZ(${-z * 1.2}px)` }}>
            <path d={FRAME_PATH} fill={`rgb(${150 - z * 18} ${164 - z * 18} ${190 - z * 16})`} />
          </svg>
        ))}
        <svg viewBox={MARK_VIEWBOX} className="absolute inset-0 h-full w-full">
          <path d={FRAME_PATH} fill="#eef2f8" />
        </svg>
        {SQUARES.map((s, i) => {
          const cx = s.x + s.size / 2
          const cy = s.y + s.size / 2
          const len = Math.hypot(cx - BOX.x, cy - BOX.y) || 1
          const style = {
            left: pct(s.x),
            top: pct(s.y),
            width: `${(s.size / VB.size) * 100}%`,
            height: `${(s.size / VB.size) * 100}%`,
            borderRadius: `${(s.rx / s.size) * 100 + 6}%`,
            '--c': s.color,
            '--dx': `${((cx - BOX.x) / len) * 7}px`,
            '--dy': `${((cy - BOX.y) / len) * 7}px`,
            '--z': `${6 + i * 1.5}px`,
            '--spin': `${(i % 2 ? 1 : -1) * (10 + i * 4)}deg`,
            transitionDelay: `${i * 35}ms`,
          } as CSSProperties
          return <span key={s.color} className="logo-3d-square absolute" style={style} />
        })}
      </span>
    </span>
  ) : (
    <svg viewBox={MARK_VIEWBOX} className="h-8 w-8 shrink-0 text-paper" aria-hidden="true" focusable="false">
      <path d={FRAME_PATH} fill="currentColor" />
      {SQUARES.map((s) => (
        <rect key={s.color} x={s.x} y={s.y} width={s.size} height={s.size} rx={s.rx} fill={s.color} />
      ))}
    </svg>
  )

  return (
    <span
      className={`group/logo inline-flex items-center gap-3 ${className}`}
      onPointerMove={interactive ? onMove : undefined}
      onPointerLeave={interactive ? onLeave : undefined}
    >
      {mark}
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.0625rem] tracking-[-0.01em] text-paper">SupplyChainz</span>
        {label && <span className="mt-1 text-[0.8125rem] text-mist">{label}</span>}
      </span>
    </span>
  )
}
