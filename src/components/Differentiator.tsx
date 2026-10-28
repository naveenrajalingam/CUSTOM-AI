import { hr, site } from '../content'
import { CutLink } from './CutLink'
import { Emerge } from './Emerge'

// What sets HR Central apart, said once and large, with the way out to the platform.
export function Differentiator() {
  const { differentiator: d } = hr
  return (
    <div className="px-6 pt-24 pb-8 md:px-10 md:pt-32">
      <Emerge className="over-field mx-auto max-w-[1320px]">
        <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-amber" />
        <p className="mt-6 flex items-center gap-2.5 text-[0.9375rem] text-mist">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-amber" />
          {d.tag}
        </p>
        <blockquote className="display mt-6 max-w-[24ch] text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.08] text-paper">{d.quote}</blockquote>
        <div className="mt-10">
          <CutLink href={site.hrCentralUrl} target="_blank" rel="noopener noreferrer" variant="outline">
            {d.cta} <span aria-hidden="true">↗</span>
          </CutLink>
        </div>
      </Emerge>
    </div>
  )
}
