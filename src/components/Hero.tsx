import { useState } from 'react'
import { SQUARES } from '../brand/mark'
import { hero, pillars } from '../content'
import { useReducedMotion } from '../lib/motion'

const delay = (s: number) => ({ animationDelay: `${s}s` })

// where the three branches end, in the diagram's own units
const ENDS = [
  { x: 330, y: 92 },
  { x: 330, y: 210 },
  { x: 330, y: 328 },
]
const CORE = { x: 112, y: 210 }
const branch = (e: { x: number; y: number }) => `M${CORE.x + 36} ${CORE.y} C 230 ${CORE.y}, 230 ${e.y}, ${e.x - 12} ${e.y}`

/**
 * Applied AI at the centre, branching into its three intelligence pillars,
 * each drawn the same way: light travels out along every branch. Pointing at
 * a branch lights it and dims the others; a live branch glides to its section.
 */
function Branches() {
  const reduced = useReducedMotion()
  const [hot, setHot] = useState<number | null>(null)
  return (
    <svg viewBox="0 0 560 420" className="h-auto w-full max-w-[560px] overflow-visible" aria-labelledby="branches-title">
      <title id="branches-title">{hero.figureLabel}</title>
      {/* the core: a chamfered square, the shape of the mark */}
      <g transform={`translate(${CORE.x} ${CORE.y})`} aria-hidden="true">
        <rect x="-36" y="-36" width="72" height="72" rx="6" fill="rgb(13 26 58 / 0.7)" stroke="rgb(238 242 248 / 0.22)" />
        <rect x="-36" y="-36" width="72" height="72" rx="6" fill="none" stroke="#34bde8" strokeOpacity="0.35" className="art-breathe" />
        {SQUARES.map((s, i) => (
          <rect key={s.color} x={-21 + (i % 3) * 15} y={-14 + Math.floor(i / 3) * 16} width="10" height="10" rx="2" fill={s.color} />
        ))}
      </g>
      <text x={CORE.x} y={CORE.y + 62} textAnchor="middle" className="fill-paper font-display font-bold" style={{ fontSize: 17 }} aria-hidden="true">
        {hero.core}
      </text>

      {pillars.map((p, i) => {
        const e = ENDS[i]
        const d = branch(e)
        const planned = p.status !== 'Active'
        const lit = hot === i
        const body = (
          <g
            style={{ opacity: hot === null || lit ? 1 : 0.3, transition: 'opacity 0.45s var(--ease-glide)' }}
            onPointerEnter={() => setHot(i)}
            onPointerLeave={() => setHot(null)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
          >
            {/* a generous, invisible target around the label */}
            <rect x={e.x - 18} y={e.y - 26} width="230" height="54" fill="transparent" />
            <path d={d} fill="none" stroke="rgb(238 242 248 / 0.14)" strokeWidth="1.5" />
            <path
              d={d}
              fill="none"
              stroke={p.color}
              strokeOpacity={lit ? 1 : 0.7}
              strokeWidth={lit ? 2.5 : 1.5}
              className="art-flow"
              style={{ transition: 'stroke-width 0.35s var(--ease-glide)' }}
            />
            {!reduced && (
              <rect x="-3" y="-3" width="6" height="6" rx="1.2" fill={p.color}>
                <animateMotion dur={`${3.4 + i * 0.6}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.22 1 0.36 1" />
              </rect>
            )}
            <rect x={e.x - 7} y={e.y - 7} width="14" height="14" rx="3" fill={p.color} />
            <rect x={e.x - 7} y={e.y - 7} width="14" height="14" rx="3" fill="none" stroke={p.color} className="art-ripple" />
            <text x={e.x + 22} y={e.y - 3} className="fill-paper" style={{ fontSize: 16, fontWeight: 600 }}>
              {p.name}
              {p.href && (
                <tspan className="fill-signal" style={{ opacity: lit ? 1 : 0, transition: 'opacity 0.3s' }}>
                  {' →'}
                </tspan>
              )}
            </text>
            <text x={e.x + 22} y={e.y + 18} className="fill-mist" style={{ fontSize: 13.5 }}>
              {p.focus}
              {planned && ` · ${p.status}`}
            </text>
          </g>
        )
        // live branches lead to their product's section
        return p.href ? (
          <a key={p.name} href={p.href} aria-label={`${p.name}: ${p.product}`} className="cursor-pointer focus-visible:outline-none">
            {body}
          </a>
        ) : (
          <g key={p.name}>{body}</g>
        )
      })}
    </svg>
  )
}

export function Hero() {
  return (
    <header id={hero.id} className="relative">
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-12 px-6 pt-28 pb-0 md:px-10 min-[900px]:grid-cols-12 min-[900px]:gap-10 min-[900px]:pt-32">
        <div className="over-field min-[900px]:col-span-6">
          <p className="anim-stagger flex items-center gap-3 text-[0.9375rem] text-mist" style={delay(0.25)}>
            <span aria-hidden="true" className="flex gap-1">
              {SQUARES.map((s) => (
                <span key={s.color} className="h-2 w-2 rounded-[2px]" style={{ background: s.color }} />
              ))}
            </span>
            {hero.tag}
          </p>
          <h1 className="display mt-6 text-[clamp(2.6rem,5vw,4.75rem)] text-paper">
            {hero.title.map((line, i) => (
              <span key={line} className="block">
                <span className="anim-blur-rise inline-block" style={delay(0.35 + i * 0.16)}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="anim-stagger measure mt-6 text-[1.125rem] text-mist md:mt-8 md:text-[1.25rem]" style={delay(0.6)}>
            {hero.lede}
          </p>
        </div>

        <div className="anim-fade hidden justify-center sm:flex min-[900px]:col-span-6 min-[900px]:justify-end" style={delay(0.9)}>
          <Branches />
        </div>
        {/* phones: the same three branches as a list, so the labels stay readable */}
        <ul className="anim-fade divide-y divide-[var(--line)] border-y border-[var(--line)] sm:hidden" style={delay(0.9)} aria-label={hero.figureLabel}>
          {pillars.map((p) => (
            <li key={p.name} className="flex items-center gap-4 py-3.5">
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: p.color }} />
              <span className="flex-1">
                <span className="block text-[1rem] font-semibold text-paper">{p.name}</span>
                <span className="block text-[0.875rem] text-mist">
                  {p.focus}
                  {p.status !== 'Active' && ` · ${p.status}`}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

    </header>
  )
}
