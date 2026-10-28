import { SQUARES } from '../brand/mark'
import { contactHref, engineering, hero, pillars } from '../content'
import { useReducedMotion } from '../lib/motion'
import { CutLink } from './CutLink'

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
 * Applied AI at the centre, branching into its three intelligence pillars.
 * Light travels out along each live branch; the planned one is drawn dashed.
 */
function Branches() {
  const reduced = useReducedMotion()
  return (
    <svg viewBox="0 0 560 420" className="h-auto w-full max-w-[560px] overflow-visible" aria-hidden="true">
      {/* the core: a chamfered square, the shape of the mark */}
      <g transform={`translate(${CORE.x} ${CORE.y})`}>
        <rect x="-36" y="-36" width="72" height="72" rx="6" fill="rgb(13 26 58 / 0.7)" stroke="rgb(238 242 248 / 0.22)" />
        <rect x="-36" y="-36" width="72" height="72" rx="6" fill="none" stroke="#34bde8" strokeOpacity="0.35" className="art-breathe" />
        {SQUARES.map((s, i) => (
          <rect key={s.color} x={-21 + (i % 3) * 15} y={-14 + Math.floor(i / 3) * 16} width="10" height="10" rx="2" fill={s.color} />
        ))}
      </g>
      <text x={CORE.x} y={CORE.y + 62} textAnchor="middle" className="fill-paper font-display" style={{ fontSize: 17 }}>
        {hero.core}
      </text>

      {pillars.map((p, i) => {
        const e = ENDS[i]
        const d = branch(e)
        const live = p.status === 'Active'
        return (
          <g key={p.name}>
            <path d={d} fill="none" stroke="rgb(238 242 248 / 0.14)" strokeWidth="1.5" strokeDasharray={live ? undefined : '3 6'} />
            {live && <path d={d} fill="none" stroke={p.color} strokeOpacity="0.7" strokeWidth="1.5" className="art-flow" />}
            {live && !reduced && (
              <rect x="-3" y="-3" width="6" height="6" rx="1.2" fill={p.color}>
                <animateMotion dur={`${3.4 + i * 0.6}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.22 1 0.36 1" />
              </rect>
            )}
            <rect x={e.x - 7} y={e.y - 7} width="14" height="14" rx="3" fill={p.color} fillOpacity={live ? 1 : 0.45} />
            {live && <rect x={e.x - 7} y={e.y - 7} width="14" height="14" rx="3" fill="none" stroke={p.color} className="art-ripple" />}
            <text x={e.x + 22} y={e.y - 3} className="fill-paper" style={{ fontSize: 16, fontWeight: 600 }}>
              {p.name}
            </text>
            <text x={e.x + 22} y={e.y + 18} className={live ? 'fill-mist' : 'fill-haze'} style={{ fontSize: 13.5 }}>
              {p.focus}
              {!live && ` · ${p.status}`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function Hero() {
  return (
    <header id={hero.id} className="relative flex min-h-svh flex-col">
      <div className="mx-auto grid w-full max-w-[1320px] flex-1 items-center gap-12 px-6 pt-28 pb-20 md:px-10 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-16">
        <div className="over-field lg:col-span-6">
          <p className="anim-stagger flex items-center gap-3 text-[0.9375rem] text-mist" style={delay(0.25)}>
            <span aria-hidden="true" className="flex gap-1">
              {SQUARES.map((s) => (
                <span key={s.color} className="h-2 w-2 rounded-[2px]" style={{ background: s.color }} />
              ))}
            </span>
            {hero.tag}
          </p>
          <h1 className="display mt-6 text-[clamp(3.25rem,6.6vw,7.25rem)] text-paper">
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
          <div className="anim-stagger mt-10 flex flex-wrap items-center gap-3" style={delay(0.75)}>
            <CutLink href={contactHref}>{hero.primary}</CutLink>
            <CutLink href={`#${engineering.id}`} variant="outline">
              {hero.secondary}
            </CutLink>
          </div>
        </div>

        <div className="anim-fade hidden justify-center sm:flex lg:col-span-6 lg:justify-end" style={delay(0.9)} role="img" aria-label={hero.figureLabel}>
          <Branches />
        </div>
        {/* phones: the same three branches as a list, so the labels stay readable */}
        <ul className="anim-fade divide-y divide-[var(--line)] border-y border-[var(--line)] sm:hidden" style={delay(0.9)} aria-label={hero.figureLabel}>
          {pillars.map((p) => (
            <li key={p.name} className="flex items-center gap-4 py-3.5">
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: p.color, opacity: p.status === 'Active' ? 1 : 0.45 }} />
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

      {/* a scroll cue while the page rests at the top */}
      <div className="pointer-events-none flex justify-center pb-6 md:pb-8">
        <span aria-hidden="true" className="anim-stagger scroll-cue" style={delay(1.1)} />
      </div>
    </header>
  )
}
