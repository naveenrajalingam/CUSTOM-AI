// The visitor's pointer, shared with the background field so the squares can
// react to it: they part around the pointer, a fast move leaves a wake, and a
// click or tap sends a pulse through them. Times are performance.now() stamps.

type Mark = { x: number; y: number; t: number }

export const pointer = {
  /** CSS px from the top left of the window */
  x: 0,
  y: 0,
  /** a fine pointer is over the page (no hover on touch screens) */
  inside: false,
  /** px per second, smoothed */
  speed: 0,
  /** the latest pulses, newest last */
  pulses: [] as Mark[],
  /** points dropped along a fast move, newest last */
  wakes: [] as (Mark & { s: number })[],
}

export const MAX_PULSES = 4
export const MAX_WAKES = 6

export function addPulse(x: number, y: number) {
  pointer.pulses.push({ x, y, t: performance.now() })
  if (pointer.pulses.length > MAX_PULSES) pointer.pulses.shift()
}

export function addWake(x: number, y: number, s: number) {
  pointer.wakes.push({ x, y, t: performance.now(), s })
  if (pointer.wakes.length > MAX_WAKES) pointer.wakes.shift()
}
