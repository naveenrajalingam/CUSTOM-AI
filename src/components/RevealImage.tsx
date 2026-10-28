import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { clamp, lerp, prefersReducedMotion } from '../lib/motion'

// A picture that opens like an aperture of light as you scroll: it starts as a
// soft glow centred on its subject and widens until it fills the screen,
// settling from a slight zoom. Every edge is feathered and the top and bottom
// melt into the star field, so it never reads as a box. Progress (0–1) comes
// from the parent's scroll trigger; motion is smoothed every frame so it glides
// rather than steps. Give it a photo (`src`) or drawn art (`children`).

const smooth = (t: number) => t * t * (3 - 2 * t)

export function RevealImage({
  src,
  alt = '',
  children,
  progressRef,
  focus = { x: 0.5, y: 0.5 },
  tint = 0.45,
  className = '',
}: {
  /** base path without size suffix, e.g. /images/engineering; served as -1000.webp and -2000.webp */
  src?: string
  alt?: string
  /** drawn art in place of a photo */
  children?: ReactNode
  progressRef: RefObject<number>
  focus?: { x: number; y: number }
  /** strength of the navy grade; lower for art already made in the brand palette */
  tint?: number
  className?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current!
    const media = mediaRef.current!
    const reduced = prefersReducedMotion()
    let shown = reduced ? 1 : 0
    let raf = 0
    let running = false

    const apply = (p: number) => {
      const open = smooth(clamp(p / 0.8)) // aperture: a point of light → the whole screen
      const clear = smooth(clamp(p / 0.4)) // the first moments are soft, then crisp
      const radius = lerp(6, 160, open) // % of the frame, feathered over its outer half
      frame.style.setProperty('--r', `${radius.toFixed(2)}%`)
      media.style.transform = `scale(${lerp(1.16, 1.03, open)})`
      media.style.filter = `blur(${lerp(5, 0, clear).toFixed(2)}px) saturate(${lerp(0.7, 0.9 + (0.45 - tint) * 0.4, open)}) brightness(${lerp(0.45, 0.95 + (0.45 - tint) * 0.3, open)})`
      frame.style.opacity = String(smooth(clamp(p / 0.12)))
    }

    const loop = () => {
      const target = reduced ? 1 : (progressRef.current ?? 0)
      shown += (target - shown) * 0.18
      if (Math.abs(target - shown) < 0.0005) shown = target
      apply(shown)
      if (running) raf = requestAnimationFrame(loop)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true
          raf = requestAnimationFrame(loop)
        } else if (!e.isIntersecting) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '200px' },
    )
    apply(shown)
    io.observe(frame)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [progressRef, tint])

  return (
    <div className={`reveal-melt pointer-events-none ${className}`} aria-hidden={alt ? undefined : true}>
      <div
        ref={frameRef}
        className="reveal-aperture absolute inset-0 overflow-hidden"
        style={{ opacity: 0, '--fx': `${focus.x * 100}%`, '--fy': `${focus.y * 100}%` } as CSSProperties}
      >
        <div ref={mediaRef} className="absolute inset-0 will-change-transform">
          {src ? (
            <img
              src={`${src}-2000.webp`}
              srcSet={`${src}-1000.webp 1000w, ${src}-2000.webp 2000w`}
              sizes="100vw"
              alt={alt}
              decoding="async"
              className="h-full w-full object-cover"
              style={{ objectPosition: `${focus.x * 100}% ${focus.y * 100}%` }}
            />
          ) : (
            children
          )}
        </div>
        {/* brand grade: pull toward navy, deepen the lower third where the type sits */}
        <div className="absolute inset-0 bg-[#1c305c] mix-blend-multiply" style={{ opacity: tint }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgb(8_17_40/0.75)_100%)]" />
      </div>
    </div>
  )
}
