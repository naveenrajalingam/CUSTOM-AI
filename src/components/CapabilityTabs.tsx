import { useRef, useState, type KeyboardEvent } from 'react'
import type { Capability } from '../content'
import { trackSpot } from '../lib/spot'
import { CardArt } from './CardArt'
import { Emerge } from './Emerge'
import { Spotlight } from './Spotlight'

// HR Central's capabilities on one screen: two tabs, one per side of the talent
// lifecycle, each showing its four capabilities as a row of glass cards. Switching
// tabs swaps the cards out of a soft blur; nothing scrolls sideways.

type Group = { title: string; caption: string; items: Capability[] }

const CARD =
  'group relative flex h-full flex-col overflow-hidden rounded-3xl bg-deep/80 p-6 ring-1 ring-[var(--line)] transition-[translate,box-shadow] duration-500 ease-[var(--ease-glide)] hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)] hover:ring-[var(--line-strong)] md:p-7'

export function CapabilityTabs({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const color = 'var(--color-amber)'

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = groups.length
    const next = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i + n - 1) % n : -1
    if (next < 0) return
    e.preventDefault()
    tabs.current[next]?.focus()
    setActive(next)
  }

  // cards are numbered straight through the groups
  const firstNumber = groups.map((_, g) => groups.slice(0, g).reduce((sum, gr) => sum + gr.items.length, 1))

  return (
    <div className="px-6 pt-10 md:px-10 md:pt-12">
      <div className="mx-auto max-w-[1320px]">
        <Emerge>
          <div role="tablist" aria-label="HR Central capabilities" className="grid gap-3 sm:flex sm:flex-wrap">
            {groups.map((g, i) => (
              <button
                key={g.title}
                ref={(node) => {
                  tabs.current[i] = node
                }}
                type="button"
                role="tab"
                id={`hr-tab-${i}`}
                aria-selected={active === i}
                aria-controls="hr-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={`cut flex cursor-pointer items-baseline gap-3 px-6 py-3.5 text-left transition-colors duration-500 ease-[var(--ease-glide)] ${
                  active === i ? 'bg-paper text-ink' : 'bg-paper/[0.06] text-mist hover:bg-paper/10 hover:text-paper'
                }`}
              >
                <span className="text-[1rem] font-semibold">{g.title}</span>
                <span className={`text-[0.875rem] ${active === i ? 'text-ink/70' : 'text-haze'}`}>{g.caption}</span>
              </button>
            ))}
          </div>
        </Emerge>

        {/* both groups share one grid cell, so the panel keeps the height of the taller one */}
        <div id="hr-panel" role="tabpanel" aria-labelledby={`hr-tab-${active}`} className="mt-8 grid md:mt-10" onPointerMove={trackSpot}>
          {groups.map((g, gi) => (
            <ul
              key={g.title}
              aria-hidden={active !== gi}
              className={`blur-swap grid gap-5 [grid-area:1/1] sm:grid-cols-2 lg:grid-cols-4 ${active === gi ? 'is-on' : 'pointer-events-none'}`}
            >
              {g.items.map((item, i) => (
                <li key={item.title} className="h-full">
                  <article data-spot className={CARD}>
                    <Spotlight color={color} />
                    <p className="relative text-[0.8125rem] tracking-[0.14em] text-amber">
                      {String(firstNumber[gi] + i).padStart(2, '0')}
                    </p>
                    <CardArt id={item.art} className="relative my-4 h-24 w-full text-amber md:h-28" />
                    <h3 className="display relative text-[clamp(1.2rem,1.4vw,1.375rem)] text-paper">{item.title}</h3>
                    <p className="relative mt-3 flex-1 text-[1rem] text-mist">{item.body}</p>
                    <ul className="relative mt-5 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <li key={t} className="rounded-full bg-paper/[0.06] px-3 py-1 text-[0.8125rem] text-mist ring-1 ring-[var(--line)]">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
