import { useEffect, useRef } from 'react'
import { addPulse, addWake, pointer } from '../lib/pointer'
import { prefersReducedMotion } from '../lib/motion'

// The page notices the visitor: the pointer is shared with the background field
// (squares part around it, a fast move leaves a wake), and every click sends a
// pulse through the field and opens a small square ripple on the page. The
// system cursor stays as it is.
export function SignalCursor() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current!
    const reduced = prefersReducedMotion()
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    let last = { x: 0, y: 0, t: performance.now() }
    let lastWake = 0

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      const now = performance.now()
      const dt = Math.max(1, now - last.t)
      const v = (Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt) * 1000
      pointer.speed += (v - pointer.speed) * 0.25
      last = { x: e.clientX, y: e.clientY, t: now }
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.inside = fine.matches
      if (!reduced && pointer.speed > 1100 && now - lastWake > 50) {
        lastWake = now
        addWake(e.clientX, e.clientY, Math.min(1, pointer.speed / 3000))
      }
    }
    const onLeave = () => {
      pointer.inside = false
    }
    const onDown = (e: PointerEvent) => {
      if (reduced) return
      addPulse(e.clientX, e.clientY)
      // a small square ripple, echoing the pulse in the field
      const ripple = document.createElement('span')
      ripple.className = 'signal-ripple'
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`
      layer.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      pointer.inside = false
    }
  }, [])

  return <div ref={layerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" />
}
