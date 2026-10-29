import { useEffect, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/**
 * The arrival for blocks of content: the first time a block scrolls into view
 * it comes out of soft focus, rises a little and settles, then stays (the
 * devkit's .arrive). It is a one-off CSS transition, not tied to the scroll,
 * so scrolling past it afterwards costs nothing.
 */
export function Emerge({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown])

  return (
    <div ref={ref} className={`arrive ${shown ? 'is-on' : ''} ${className}`}>
      {children}
    </div>
  )
}
