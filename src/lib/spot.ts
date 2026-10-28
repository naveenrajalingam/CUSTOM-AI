import type { PointerEvent } from 'react'

/** Sets --mx/--my on whichever card (any element with data-spot) the pointer is over, for its Spotlight. */
export function trackSpot(e: PointerEvent<HTMLElement>) {
  const card = (e.target as Element).closest<HTMLElement>('[data-spot]')
  if (!card) return
  const r = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${e.clientX - r.left}px`)
  card.style.setProperty('--my', `${e.clientY - r.top}px`)
}
