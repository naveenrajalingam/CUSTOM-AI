import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealImage } from './RevealImage'

gsap.registerPlugin(ScrollTrigger)

// A full-screen chapter opener: its picture opens out of a point of light as
// you scroll in, then the chapter title rises out of a blur. The bottom fades
// into the page so the chapter's content follows without a visible break.

type Props = {
  id: string
  /** a photo (base path, see RevealImage); without one, `art` is shown */
  image?: string
  art?: ReactNode
  focus?: { x: number; y: number }
  tint?: number
  tag: string
  title: string
  lede: string
  accent: 'signal' | 'amber'
  /** a line under the lede, e.g. a status */
  note?: ReactNode
}

const swatch = { signal: 'bg-signal', amber: 'bg-amber' }

export function Chapter({ id, image, art, focus, tint, tag, title, lede, accent, note }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
        const on = self.progress > 0.55
        setShown((prev) => (prev === on ? prev : on))
      },
    })
    return () => st.kill()
  }, [])

  const swap = (d: number) => ({
    className: `blur-swap ${shown ? 'is-on' : ''}`,
    style: { transitionDelay: shown ? `${d}s` : '0s' },
  })

  return (
    <div ref={ref} id={id} data-land="0.8" className="relative h-[230vh] scroll-mt-0">
      <div className="sticky top-0 h-svh overflow-hidden">
        <RevealImage
          src={image ? `/images/${image}` : undefined}
          progressRef={progressRef}
          focus={focus}
          tint={tint}
          className="absolute inset-0"
        >
          {art}
        </RevealImage>
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-[12vh] md:px-10">
          <div className="over-field mx-auto w-full max-w-[1320px]">
            <p {...swap(0)} className={`${swap(0).className} flex items-center gap-2.5 text-[0.9375rem] text-mist`}>
              <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] ${swatch[accent]}`} />
              {tag}
            </p>
            <h2 id={`${id}-title`} {...swap(0.08)} className={`${swap(0.08).className} display mt-5 max-w-[15ch] text-[clamp(2.6rem,7vw,6.5rem)] text-paper`}>
              {title}
            </h2>
            <p {...swap(0.2)} className={`${swap(0.2).className} measure mt-6 text-[1.125rem] text-mist md:text-[1.25rem]`}>
              {lede}
            </p>
            {note && (
              <div {...swap(0.3)} className={`${swap(0.3).className} mt-6`}>
                {note}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
