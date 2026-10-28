import { useEffect, useRef, useState } from 'react'
import { contactHref, nav } from '../content'
import { CutLink } from './CutLink'
import { Logo } from './Logo'
import { NavMenu } from './NavMenu'

const delay = (s: number) => ({ animationDelay: `${s}s` })

/**
 * One slim glass bar for the whole page: logo left, the three intelligence
 * areas centred (each opens onto its products), the call to action right. The
 * area you're reading is marked, and a hairline of cyan shows
 * how far you've read. On phone-sized screens, where they can't fit, the areas fold into a small glass menu.
 */
export function SiteNav() {
  const [solid, setSolid] = useState(false)
  const [current, setCurrent] = useState('')
  const [open, setOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? window.scrollY / max : 0
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
        setSolid(window.scrollY > 24)

        // the area whose product section covers the middle of the screen
        const mid = window.innerHeight / 2
        let active = ''
        for (const group of nav) {
          for (const item of group.items) {
            const el = document.getElementById(item.href.slice(1))
            if (!el) continue
            const section = el.closest('section') ?? el
            const r = section.getBoundingClientRect()
            if (r.top <= mid && r.bottom >= mid) active = group.label
          }
        }
        setCurrent(active)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,box-shadow] duration-700 ease-[var(--ease-glide)] ${
        solid || open
          ? 'bg-ink/55 shadow-[0_1px_0_rgb(238_242_248/0.06)] backdrop-blur-xl backdrop-saturate-150'
          : 'bg-transparent'
      }`}
    >
      <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 px-6 md:px-10 min-[900px]:grid-cols-[1fr_auto_1fr] min-[900px]:gap-6">
        <a href="#top" className="anim-stagger justify-self-start" style={delay(0.1)} aria-label="SupplyChainz Applied AI, back to top">
          <Logo label="Applied AI" interactive />
        </a>

        <ul className="anim-stagger hidden items-center gap-6 min-[900px]:flex xl:gap-9" style={delay(0.2)}>
          {nav.map((group) => (
            <NavMenu key={group.label} group={group} active={current === group.label} />
          ))}
        </ul>

        <div className="anim-stagger flex items-center gap-3 justify-self-end" style={delay(0.3)}>
          <CutLink href={contactHref} size="sm" variant="outline">
            Let’s talk
          </CutLink>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="cut-border flex h-10 w-10 cursor-pointer items-center justify-center text-paper min-[900px]:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-500 ease-[var(--ease-glide)] ${open ? 'top-1.5 rotate-45' : 'top-0.5'}`}
              />
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-500 ease-[var(--ease-glide)] ${open ? 'top-1.5 -rotate-45' : 'top-2.5'}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* phones: the same three areas and their products, then the call to action */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-[var(--line)] px-6 pt-2 pb-6 md:px-10 min-[900px]:hidden"
      >
        <ul className="divide-y divide-[var(--line)]">
          {nav.map((group) => (
            <li key={group.label} className="py-4">
              <p className="flex items-center gap-2.5 text-[0.8125rem] text-haze">
                <span aria-hidden="true" className="h-2 w-2 rounded-[2px]" style={{ background: group.color }} />
                {group.label}
              </p>
              {group.items.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="mt-2 block">
                  <span className="flex items-center justify-between text-[1.0625rem] font-semibold text-paper">
                    {item.label}
                    <span className="text-[0.75rem] font-normal text-mist">{item.status}</span>
                  </span>
                  <span className="block text-[0.9375rem] text-mist">{item.note}</span>
                </a>
              ))}
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px">
        <div ref={barRef} className="h-px origin-left scale-x-0 bg-signal/80" />
      </div>
    </nav>
  )
}
