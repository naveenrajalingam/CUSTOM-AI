import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealImage } from './RevealImage'

gsap.registerPlugin(ScrollTrigger)

// A chapter opener: the product's name, the chapter title rising out of a blur and the lede,
// laid across the full width of the page. With a picture (`image` or
// `art`) it becomes a full-screen scene: the picture opens out of a point of
// light as you scroll in, and the bottom fades into the chapter's content.
// Without one it is a plain opening block that flows straight into the content;
// it can carry more below the lede (`children`) and a panel beside it (`aside`).

type Props = {
  id: string
  /** a photo (base path, see RevealImage); without one, `art` is shown */
  image?: string
  art?: ReactNode
  focus?: { x: number; y: number }
  tint?: number
  /** the product this chapter is about, shown above the title */
  name: string
  title: string
  lede: string
  accent: 'signal' | 'amber'
  /** a line under the lede, e.g. a status */
  note?: ReactNode
  /** more of the chapter under the lede, in the same column */
  children?: ReactNode
  /** a panel beside the heading on wide screens */
  aside?: ReactNode
  /** put the aside on the left on wide screens */
  asideFirst?: boolean
  /** which side gets more room when there is an aside */
  wide?: 'text' | 'aside' | 'even'
}

const swatch = { signal: 'bg-signal', amber: 'bg-amber' }

export function Chapter({ id, image, art, focus, tint, name, title, lede, accent, note, children, aside, asideFirst = false, wide = 'text' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [shown, setShown] = useState(false)
  const scene = Boolean(image || art)

  useEffect(() => {
    const el = ref.current!
    if (!scene) {
      // a plain opener: its words arrive once it is on screen and stay. The browser's own
      // visibility check can't work from stale measurements after a long jump down the page.
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return
        setShown(true)
        io.disconnect()
      })
      io.observe(el)
      return () => io.disconnect()
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
        const on = self.progress > 0.35
        setShown((prev) => (prev === on ? prev : on))
      },
    })
    return () => st.kill()
  }, [scene])

  const swap = (d: number) => ({
    className: `blur-swap ${shown ? 'is-on' : ''}`,
    style: { transitionDelay: shown ? `${d}s` : '0s' },
  })

  // one column: the product's name as a badge, the title, and the lede right beneath it
  const words = (
    <div className="over-field mx-auto w-full max-w-[1320px]">
      <p
        {...swap(0)}
        className={`${swap(0).className} inline-flex items-center gap-2.5 rounded-full bg-deep/80 px-4 py-2 text-[0.9375rem] font-semibold text-paper ring-1 ring-[var(--line-strong)]`}
      >
        <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] ${swatch[accent]}`} />
        {name}
      </p>
      <h2
        id={`${id}-title`}
        {...swap(0.08)}
        className={`${swap(0.08).className} display mt-6 max-w-[22ch] text-paper ${aside ? 'text-[clamp(1.85rem,3vw,2.9rem)]' : 'text-[clamp(2rem,3.6vw,3.5rem)]'}`}
      >
        {title}
      </h2>
      <p {...swap(0.16)} className={`${swap(0.16).className} mt-5 max-w-[44rem] text-[1.0625rem] text-mist text-pretty md:text-[1.1875rem]`}>
        {lede}
      </p>
      {note && (
        <div {...swap(0.24)} className={`${swap(0.24).className} mt-6`}>
          {note}
        </div>
      )}
    </div>
  )

  if (!scene) {
    const spans = { text: [7, 5], aside: [5, 7], even: [6, 6] }[wide]
    const text = ['', '', '', '', '', 'min-[900px]:col-span-5', 'min-[900px]:col-span-6', 'min-[900px]:col-span-7'][spans[0]]
    const side = ['', '', '', '', '', 'min-[900px]:col-span-5', 'min-[900px]:col-span-6', 'min-[900px]:col-span-7'][spans[1]]
    return (
      <div ref={ref} id={id} className="relative scroll-mt-16 px-6 pt-10 md:px-10 md:pt-12">
        {aside ? (
          <div className="mx-auto grid w-full max-w-[1320px] items-center gap-10 min-[900px]:grid-cols-12 lg:gap-14">
            <div className={text}>
              {words}
              {children}
            </div>
            <div className={`${side} ${asideFirst ? 'min-[900px]:order-first' : ''}`}>{aside}</div>
          </div>
        ) : (
          <>
            {words}
            {children}
          </>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} id={id} data-land="0.8" className="relative h-[180vh]">
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
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-[12vh] md:px-10">{words}</div>
      </div>
    </div>
  )
}
