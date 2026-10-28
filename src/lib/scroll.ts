import type Lenis from 'lenis'

// The page's one smooth scroller, shared so links can glide to a section.

let instance: Lenis | null = null

export function setScroller(l: Lenis | null) {
  instance = l
}

/** Hold the page still (while a dialog is open), or let it scroll again. */
export function setScrollLocked(locked: boolean) {
  if (instance) {
    if (locked) instance.stop()
    else instance.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/** Apple-like ease: quick to start, long soft landing. */
export const glide = (t: number) => 1 - Math.pow(1 - t, 4)

/** Glide to a point on the page. */
export function scrollToY(target: number) {
  const distance = Math.abs(target - window.scrollY)
  if (instance) {
    instance.scrollTo(target, { duration: Math.min(1.5, 0.7 + distance / 9000), easing: glide })
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' })
  }
}

/** Where to land inside an element's scroll length: 0 = its top, 1 = its last screen. */
export function landingY(el: HTMLElement, land: number) {
  const top = el.getBoundingClientRect().top + window.scrollY
  return top + Math.max(0, el.offsetHeight - window.innerHeight) * land
}

/**
 * Glide to a section. Elements may set data-land (0–1): where inside their
 * scroll length to land, so a chapter opener arrives already open.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return false
  scrollToY(landingY(el, Number(el.dataset.land ?? 0)))
  history.replaceState(null, '', id === 'top' ? window.location.pathname : `#${id}`)
  return true
}
