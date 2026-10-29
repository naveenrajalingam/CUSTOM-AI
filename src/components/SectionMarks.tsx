import { SQUARES } from '../brand/mark'

// What tells one section from the next: a soft wash of the section's own colour
// behind it, and a quiet divider between sections, a hairline with one of the
// mark's squares at its centre.

const WASH = {
  cyan: 'rgb(52 189 232 / 0.16)',
  amber: 'rgb(245 177 52 / 0.14)',
}

/** A large, blurred glow in the section's colour, on one side; sits behind the section's content. */
export function SectionGlow({ accent, side }: { accent: keyof typeof WASH; side: 'left' | 'right' }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ background: `radial-gradient(45% 55% at ${side === 'left' ? '22%' : '78%'} 45%, ${WASH[accent]}, transparent 70%)` }}
    />
  )
}

/** A hairline across the page with a brand square in the middle. */
export function SectionDivider({ color = 0 }: { color?: number }) {
  const c = SQUARES[color % SQUARES.length].color
  return (
    <div aria-hidden="true" className="mx-auto flex max-w-[1320px] items-center gap-4 px-6 pt-16 md:px-10 md:pt-20">
      <span className="h-px flex-1 bg-[linear-gradient(to_right,transparent,rgb(238_242_248/0.38))]" />
      <span className="h-2.5 w-2.5 rotate-45 rounded-[2px]" style={{ background: c, boxShadow: `0 0 14px ${c}` }} />
      <span className="h-px flex-1 bg-[linear-gradient(to_left,transparent,rgb(238_242_248/0.38))]" />
    </div>
  )
}
