import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { architecture } from '../content'
import { prefersReducedMotion } from '../lib/motion'
import { Emerge } from './Emerge'
import { trackSpot } from '../lib/spot'
import { Spotlight } from './Spotlight'

gsap.registerPlugin(ScrollTrigger)

// Where the two chapters meet: two beachheads side by side, the thesis they
// share, and the four-phase model both run on. A reading section: it scrolls
// freely, every block arriving out of a soft blur.

const { beachheads, thesis, model } = architecture

const accent = {
  signal: { bar: 'bg-signal', text: 'text-signal', color: 'var(--color-signal)' },
  amber: { bar: 'bg-amber', text: 'text-amber', color: 'var(--color-amber)' },
}

const GLASS = 'relative overflow-hidden rounded-3xl bg-deep/55 ring-1 ring-[var(--line)] backdrop-blur-xl'
const highlight = (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(238_242_248/0.25),transparent)]"
  />
)

/** The four phases on one line that fills as you read down the page. */
function Phases() {
  const lineRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(lineRef.current, { '--p': 1 })
      return
    }
    const tween = gsap.fromTo(
      lineRef.current,
      { '--p': 0 },
      {
        '--p': 1,
        ease: 'none',
        scrollTrigger: { trigger: listRef.current, start: 'top 80%', end: 'bottom 55%', scrub: 0.9 },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  const colors = ['bg-paper', 'bg-signal', 'bg-amber', 'bg-green']

  return (
    <div className="relative mt-12 md:mt-16">
      {/* the line: across on wide screens, down the side on phones */}
      <div aria-hidden="true" className="absolute top-[7px] bottom-0 left-[6px] w-px bg-[var(--line-strong)] md:top-[6px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto">
        <span ref={lineRef} className="absolute inset-0 origin-top scale-y-(--p) bg-signal [--p:0] md:origin-left md:scale-x-(--p) md:scale-y-100" />
      </div>
      <ol ref={listRef} className="relative grid gap-10 md:grid-cols-4 md:gap-8">
        {model.steps.map((s, i) => (
          <li key={s.title} className="pl-10 md:pl-0">
            <span aria-hidden="true" className={`absolute left-0 mt-0.5 block h-3.5 w-3.5 rounded-[3px] md:static md:mt-0 ${colors[i]}`} />
            <Emerge start="top 92%" end="top 70%">
              <p className="text-[0.8125rem] tracking-[0.14em] text-haze md:mt-8">{String(i + 1).padStart(2, '0')}</p>
              <h4 className="display mt-3 text-[clamp(1.6rem,2.2vw,2.1rem)] text-paper">{s.title}</h4>
              <p className="mt-3 max-w-[30ch] text-[1rem] text-mist">{s.body}</p>
            </Emerge>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Architecture() {
  return (
    <section id={architecture.id} aria-labelledby={`${architecture.id}-title`} className="relative px-6 pt-24 md:px-10 md:pt-32">
      <div className="mx-auto max-w-[1320px]">
        <Emerge className="over-field">
          <p className="flex items-center gap-2.5 text-[0.9375rem] text-mist">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-signal" />
            {architecture.tag}
          </p>
          <h2 id={`${architecture.id}-title`} className="display mt-5 max-w-[15ch] text-[clamp(2.5rem,5vw,4.5rem)] text-paper">
            {architecture.title}
          </h2>
          <p className="measure mt-6 text-[1.125rem] text-mist md:text-[1.25rem]">{architecture.lede}</p>
        </Emerge>

        <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-2 lg:gap-8" onPointerMove={trackSpot}>
          {beachheads.map((b) => {
            const a = accent[b.accent]
            return (
              <Emerge key={b.title}>
                <article
                  data-spot
                  className={`group ${GLASS} h-full p-7 transition-[translate,box-shadow] duration-700 ease-[var(--ease-glide)] hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)] hover:ring-[var(--line-strong)] md:p-10`}
                >
                  {highlight}
                  <Spotlight color={a.color} />
                  <span aria-hidden="true" className={`block h-1 w-10 rounded-full ${a.bar}`} />
                  <p className={`relative mt-6 text-[0.8125rem] tracking-[0.14em] uppercase ${a.text}`}>{b.tag}</p>
                  <h3 className="display relative mt-3 text-[clamp(1.9rem,3vw,2.75rem)] text-paper">{b.title}</h3>
                  <p className="relative mt-4 max-w-[40ch] text-[1.0625rem] text-mist">{b.body}</p>
                  <dl className="relative mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                    {b.rows.map(([k, v], i) => (
                      <div key={k} className="flex items-baseline justify-between gap-6 py-3.5">
                        <dt className="shrink-0 text-[0.8125rem] tracking-[0.1em] text-haze uppercase">{k}</dt>
                        <dd className={`text-right text-[0.9375rem] md:text-[1rem] ${i === b.rows.length - 1 ? `font-semibold ${a.text}` : 'text-paper'}`}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </Emerge>
            )
          })}
        </div>

        <Emerge className="mt-6 lg:mt-8">
          <div className={`${GLASS} grid gap-4 p-7 md:grid-cols-12 md:items-center md:gap-8 md:p-10`}>
            {highlight}
            <p className="flex items-center gap-2.5 text-[0.9375rem] text-paper md:col-span-4">
              <span aria-hidden="true" className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-signal" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-amber" />
              </span>
              {thesis.tag}
            </p>
            <p className="text-[1.0625rem] text-mist md:col-span-8 md:text-[1.1875rem]">{thesis.body}</p>
          </div>
        </Emerge>

        <div className="mt-24 md:mt-32">
          <Emerge className="over-field">
            <p className="flex items-center gap-2.5 text-[0.9375rem] text-mist">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-signal" />
              {model.tag}
            </p>
            <h3 className="display mt-5 max-w-[16ch] text-[clamp(2.5rem,5vw,4.5rem)] text-paper">{model.title}</h3>
            <p className="measure mt-6 text-[1.125rem] text-mist md:text-[1.25rem]">{model.lede}</p>
          </Emerge>
          <Phases />
        </div>
      </div>
    </section>
  )
}
