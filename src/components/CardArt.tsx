import type { ArtId } from '../content'

// Small looping line drawings for the HR Central cards, in the card's accent
// colour (currentColor), 1.5px strokes. Each loops quietly; with reduced motion
// they rest on a meaningful frame (see index.css).

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const faint = { ...S, strokeOpacity: 0.3 }

const art: Record<ArtId, React.ReactNode> = {
  // a profile assembling itself: a portrait square, then its lines
  profile: (
    <>
      <rect x="62" y="14" width="76" height="92" rx="6" {...faint} />
      <rect x="74" y="26" width="22" height="22" rx="4" {...S} />
      <path d="M104 32h22M104 42h16" {...S} pathLength={1} className="art-draw" />
      <path d="M74 62h52M74 74h52M74 86h34" {...S} pathLength={1} className="art-draw" style={{ animationDelay: '0.4s' }} />
    </>
  ),
  // a learning path that steps up to close the gap
  upskill: (
    <>
      <path d="M30 100h140" {...faint} />
      <path d="M36 96h30v-20h30v-20h30v-20h30" {...S} pathLength={1} className="art-draw" />
      {[66, 96, 126, 156].map((x, i) => (
        <rect key={x} x={x - 4} y={72 - i * 20} width="8" height="8" rx="1.5" fill="currentColor" className="art-blink" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
    </>
  ),
  // a test sheet, ticked off under a scan line
  assess: (
    <>
      {[26, 52, 78].map((y, i) => (
        <g key={y}>
          <rect x="54" y={y} width="16" height="16" rx="3" {...faint} />
          <path d={`M58 ${y + 8}l4 4l6 -8`} {...S} pathLength={1} className="art-draw" style={{ animationDelay: `${i * 0.5}s` }} />
          <path d={`M82 ${y + 8}h64`} {...faint} />
        </g>
      ))}
      <path d="M40 20h120" {...S} strokeOpacity="0.5" className="art-slide-y" />
    </>
  ),
  // a conversation: two bubbles, the agent thinking
  interview: (
    <>
      <path d="M40 26h70a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H60l-12 10V64h-8a6 6 0 0 1-6-6V32a6 6 0 0 1 6-6z" {...faint} />
      <path d="M92 54h62a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6h-6v10l-12-10H92a6 6 0 0 1-6-6V60a6 6 0 0 1 6-6z" {...S} />
      {[108, 122, 136].map((x, i) => (
        <rect key={x} x={x - 3} y="69" width="6" height="6" rx="1.2" fill="currentColor" className="art-blink" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
    </>
  ),
  // many applicants flowing into one shortlist
  pipeline: (
    <>
      {[22, 44, 66, 88].map((y) => (
        <path key={y} d={`M30 ${y + 8}C80 ${y + 8} 100 60 140 60`} {...S} strokeOpacity="0.55" className="art-flow" />
      ))}
      {[22, 44, 66, 88].map((y) => (
        <rect key={`r${y}`} x="18" y={y + 2} width="12" height="12" rx="2" {...faint} />
      ))}
      <rect x="140" y="48" width="24" height="24" rx="4" {...S} />
      <rect x="140" y="48" width="24" height="24" rx="4" {...S} className="art-ripple" />
    </>
  ),
  // a credential checked against its record
  verify: (
    <>
      <path d="M100 14l36 13v27c0 24-17 40-36 50-19-10-36-26-36-50V27z" {...faint} />
      <path d="M100 14l36 13v27c0 24-17 40-36 50-19-10-36-26-36-50V27z" {...S} className="art-breathe" />
      <path d="M86 58l10 10l20 -22" {...S} pathLength={1} className="art-draw" />
    </>
  ),
  // the organisation as a grid of roles, each lighting in turn
  hrms: (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const x = 64 + (i % 3) * 26
        const y = 18 + Math.floor(i / 3) * 30
        return (
          <g key={i}>
            <rect x={x} y={y} width="20" height="20" rx="3.5" {...faint} />
            <rect
              x={x}
              y={y}
              width="20"
              height="20"
              rx="3.5"
              fill="currentColor"
              fillOpacity="0.85"
              className={`art-cycle ${i === 0 ? 'art-first' : ''}`}
              style={{ animationDelay: `${(i * 7.5) / 9}s` }}
            />
          </g>
        )
      })}
    </>
  ),
  // a continuous loop: feedback, growth, review, around again
  lifecycle: (
    <>
      <rect x="44" y="20" width="112" height="80" rx="34" {...faint} />
      <rect x="44" y="20" width="112" height="80" rx="34" {...S} className="art-flow" />
      <path d="M70 60h14l6-14l10 28l8-20l6 6h16" {...S} pathLength={1} className="art-draw" />
    </>
  ),
}

export function CardArt({ id, className = '' }: { id: ArtId; className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {art[id]}
    </svg>
  )
}
