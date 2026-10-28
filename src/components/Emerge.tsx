import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

/**
 * The same arrival as the chapter photos, for blocks of content: as a block
 * scrolls in it comes out of a soft blur, rises a little and settles, tied to
 * the scroll so it reverses smoothly too. Never wrap pinned or sticky scenes.
 */
export function Emerge({
  children,
  className = '',
  start = 'top 95%',
  end = 'top 62%',
}: {
  children: ReactNode
  className?: string
  /** ScrollTrigger positions for when the block starts and finishes arriving */
  start?: string
  end?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current!
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 36, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start, end, scrub: 0.9 },
        // drop the filter once settled so text renders crisp and cheap
        onComplete: () => gsap.set(el, { clearProps: 'filter' }),
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [start, end])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
