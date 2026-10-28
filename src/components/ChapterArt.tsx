// Drawn art for the chapter openers, made in the brand palette so it sits in the
// star field like a photo would: a blueprint of a car for engineering, a
// network of people for talent. Both fill the screen; the subject sits where
// the chapter's aperture opens (see `focus` in App).

const rand = (seed: number) => {
  // small deterministic hash, so the drawing is the same on every visit
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const line = { vectorEffect: 'non-scaling-stroke' as const }

/** A coupe drawn as a technical blueprint, with guide lines and a faint grid. */
export function BlueprintArt() {
  const cyan = '#34bde8'
  const wheels = [560, 1060]
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <rect width="1600" height="1000" fill="#0b1633" />
      {/* the drafting grid */}
      <g stroke={cyan} strokeOpacity="0.07" strokeWidth="1" style={line}>
        {Array.from({ length: 33 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="1000" />
        ))}
        {Array.from({ length: 21 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="1600" y2={i * 50} />
        ))}
      </g>
      {/* the drawing sits right of centre and a little high, clear of the chapter title */}
      <g transform="translate(190 -50)">
      {/* guides: the ground, the centre line, rings round the middle of the car */}
      <g stroke={cyan} strokeWidth="1" fill="none" style={line}>
        <line x1="200" y1="578" x2="1400" y2="578" strokeOpacity="0.35" />
        <line x1="810" y1="230" x2="810" y2="700" strokeOpacity="0.25" strokeDasharray="4 6" />
        <line x1="300" y1="470" x2="1320" y2="470" strokeOpacity="0.18" strokeDasharray="4 6" />
        <circle cx="810" cy="470" r="150" strokeOpacity="0.12" strokeDasharray="3 5" />
        <circle cx="810" cy="470" r="300" strokeOpacity="0.08" strokeDasharray="3 7" />
        {/* overall length, with end ticks */}
        <line x1="400" y1="300" x2="1205" y2="300" strokeOpacity="0.4" />
        <line x1="400" y1="288" x2="400" y2="312" strokeOpacity="0.5" />
        <line x1="1205" y1="288" x2="1205" y2="312" strokeOpacity="0.5" />
        <line x1="400" y1="312" x2="400" y2="490" strokeOpacity="0.15" strokeDasharray="2 5" />
        <line x1="1205" y1="312" x2="1205" y2="465" strokeOpacity="0.15" strokeDasharray="2 5" />
        {wheels.map((x) => (
          <line key={x} x1={x} y1="420" x2={x} y2="640" strokeOpacity="0.25" strokeDasharray="4 6" />
        ))}
      </g>
      {/* the car */}
      <g stroke={cyan} strokeWidth="1.6" fill="none" strokeLinejoin="round" style={line}>
        <path
          d="M420 522 L402 498 C 410 482 440 474 480 468 L640 450 C 690 420 720 392 770 372 C 820 356 880 354 912 360 C 960 372 1010 404 1046 424 L1150 440 C 1180 446 1200 458 1206 474 L1208 522 L1124 524 A 64 64 0 0 0 996 524 L624 524 A 64 64 0 0 0 496 524 Z"
          fill="rgb(52 189 232 / 0.05)"
        />
        <path d="M664 452 L774 386 C 830 370 880 368 904 374 L990 428 Z" strokeOpacity="0.8" />
        <path d="M842 380 L846 446" strokeOpacity="0.6" />
        <path d="M486 470 L1150 444" strokeOpacity="0.45" />
        <path d="M800 452 L808 520" strokeOpacity="0.55" />
        <path d="M1046 470 L1100 466" strokeOpacity="0.55" />
        {wheels.map((x) => (
          <g key={x}>
            <circle cx={x} cy="524" r="52" />
            <circle cx={x} cy="524" r="31" strokeOpacity="0.7" />
            <circle cx={x} cy="524" r="7" strokeOpacity="0.7" />
            {Array.from({ length: 5 }, (_, i) => {
              const a = (i / 5) * Math.PI * 2
              return (
                <line
                  key={i}
                  x1={x + Math.cos(a) * 9}
                  y1={524 + Math.sin(a) * 9}
                  x2={x + Math.cos(a) * 29}
                  y2={524 + Math.sin(a) * 29}
                  strokeOpacity="0.55"
                />
              )
            })}
          </g>
        ))}
      </g>
      {/* measured points */}
      <g fill={cyan}>
        {[
          [402, 498],
          [640, 450],
          [912, 360],
          [1206, 474],
          [810, 470],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" rx="1" />
        ))}
      </g>
      </g>
    </svg>
  )
}

/** People as squares, joined into one network that runs from campus to retirement. */
export function NetworkArt() {
  const n = 74
  const colors = ['#f5b134', '#f5b134', '#f5b134', '#eef2f8', '#eef2f8', '#ea7532', '#34bde8', '#14a17e']
  const nodes = Array.from({ length: n }, (_, i) => {
    const u = i / (n - 1)
    const x = 140 + u * 1320 + (rand(i * 3 + 1) - 0.5) * 60
    const band = Math.sin(u * Math.PI * 1.6 + 0.4) * 120
    const y = 500 + band + (rand(i * 3 + 2) - 0.5) * 300 * (0.4 + Math.sin(u * Math.PI) * 0.6)
    const s = 5 + Math.pow(rand(i * 3 + 3), 3) * 12
    return { x, y, s, c: colors[i % colors.length] }
  })
  // each person joins the next few along the way
  const links: [number, number][] = []
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter(({ j }) => j > i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
    near.forEach(({ j, d }) => d < 230 && links.push([i, j]))
  })
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <rect width="1600" height="1000" fill="#0d1838" />
      <defs>
        <radialGradient id="talent-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5b134" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f5b134" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="800" cy="500" rx="620" ry="300" fill="url(#talent-glow)" />
      <g stroke="#f5b134" strokeOpacity="0.28" strokeWidth="1" style={line}>
        {links.map(([i, j]) => (
          <line key={`${i}-${j}`} x1={nodes[i].x} y1={nodes[i].y} x2={nodes[j].x} y2={nodes[j].y} />
        ))}
      </g>
      {nodes.map((p, i) => (
        <rect key={i} x={p.x - p.s / 2} y={p.y - p.s / 2} width={p.s} height={p.s} rx={p.s * 0.2} fill={p.c} fillOpacity={0.55 + rand(i + 99) * 0.45} />
      ))}
    </svg>
  )
}
