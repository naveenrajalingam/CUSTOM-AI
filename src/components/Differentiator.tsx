import { hr } from '../content'
import { Emerge } from './Emerge'

// What sets HR Central apart, in a glass card beside the chapter's heading:
// the statement.
export function Differentiator() {
  const { differentiator: d } = hr
  return (
    <Emerge>
      <div className="relative overflow-hidden rounded-3xl bg-deep/80 p-7 ring-1 ring-[var(--line)] md:p-9">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(238_242_248/0.25),transparent)]"
        />
        <p className="flex items-center gap-2.5 text-[0.9375rem] text-mist">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-amber" />
          {d.tag}
        </p>
        <blockquote className="display mt-4 text-[clamp(1.25rem,1.7vw,1.6rem)] leading-snug text-paper">{d.quote}</blockquote>
      </div>
    </Emerge>
  )
}
