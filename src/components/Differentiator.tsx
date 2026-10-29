import { hr } from '../content'
import { Emerge } from './Emerge'

// What sets HR Central apart, as a pull-quote beside the chapter's heading: a
// large amber quotation mark, a thin amber rule, and the statement set lighter
// than the heading so the two never compete.
export function Differentiator() {
  const { differentiator: d } = hr
  return (
    <Emerge>
      <figure className="relative pl-7 md:pl-9">
        <span
          aria-hidden="true"
          className="absolute top-1 bottom-1 left-0 w-[3px] rounded-full bg-[linear-gradient(to_bottom,var(--color-amber),transparent)]"
        />
        <span aria-hidden="true" className="display block text-[2.75rem] leading-[0.6] text-amber/80">
          “
        </span>
        <blockquote className="mt-2 max-w-[38ch] text-[clamp(1.05rem,1.3vw,1.25rem)] leading-snug font-normal text-paper/80">{d.quote}</blockquote>
        <figcaption className="mt-3 text-[0.75rem] tracking-[0.14em] text-haze uppercase">{d.tag}</figcaption>
      </figure>
    </Emerge>
  )
}
