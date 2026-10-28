import { useEffect, useRef, useState, type FocusEvent } from 'react'
import type { nav } from '../content'

type Group = (typeof nav)[number]

/**
 * One intelligence area in the nav. Hovering (or clicking, or Enter) opens a
 * small glass panel of its products, which glides in out of a blur. An area
 * with no products yet is a plain label.
 */
export function NavMenu({ group, active }: { group: Group; active: boolean }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLLIElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef(0)
  const id = `menu-${group.label.toLowerCase().replace(/\s+/g, '-')}`

  const show = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  // a short grace period, so moving the pointer from the label down to the panel doesn't close it
  const hide = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 140)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const label = `nav-link text-[0.875rem] whitespace-nowrap ${active ? 'text-paper' : 'text-mist'}`

  if (!group.items.length) {
    return (
      <li>
        <span className={`${label} cursor-default`}>{group.label}</span>
      </li>
    )
  }

  const onBlur = (e: FocusEvent) => {
    if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
  }

  return (
    <li ref={rootRef} className="relative" onPointerEnter={(e) => e.pointerType === 'mouse' && show()} onPointerLeave={(e) => e.pointerType === 'mouse' && hide()} onBlur={onBlur}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-current={active ? 'true' : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`${label} flex cursor-pointer items-center gap-1.5 hover:text-paper`}
      >
        {group.label}
        <svg
          viewBox="0 0 12 8"
          aria-hidden="true"
          className={`h-1.5 w-2.5 transition-transform duration-500 ease-[var(--ease-glide)] ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>

      {/* the panel hangs a little below the bar; the padding keeps the pointer inside on the way down */}
      <div
        id={id}
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-5 transition-[opacity,filter,translate] duration-500 ease-[var(--ease-glide)] ${
          open ? 'visible translate-y-0 opacity-100 blur-0' : 'invisible -translate-y-1.5 opacity-0 blur-[6px]'
        }`}
      >
        <ul className="relative w-max min-w-[18rem] overflow-hidden rounded-2xl bg-deep/80 p-2 ring-1 ring-[var(--line)] backdrop-blur-xl shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(238_242_248/0.25),transparent)]"
          />
          {group.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="group/item block rounded-xl px-4 py-3 transition-colors duration-300 hover:bg-paper/[0.06] focus-visible:bg-paper/[0.06]"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2.5 text-[0.9375rem] font-semibold text-paper">
                    <span aria-hidden="true" className="h-2 w-2 rounded-[2px]" style={{ background: group.color }} />
                    {item.label}
                  </span>
                  <span className="text-[0.75rem] text-haze">{item.status}</span>
                </span>
                <span className="mt-1 block pl-[1.125rem] text-[0.8125rem] text-mist">{item.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
