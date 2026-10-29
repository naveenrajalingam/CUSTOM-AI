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
  /** a line under the title; optional, for a chapter whose title says it all */
  lede?: string
  accent: 'cyan' | 'amber'
  /** a short status shown beside the product's badge */
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

const swatch = { cyan: 'bg-cyan', amber: 'bg-amber' }

export function Chapter({ id, image, art, focus, tint, name, title, lede, accent, note, children, aside, asideFirst = false, wide = 'text' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [shown, setShown] = useState(false)
  const scene = Boolean(image || art)

  useEffect(() => {
    const el = ref.current!
    if (!scene) {
      // a plain opener: its words arrive each time it comes on screen, and leave once it is
      // fully off it, so scrolling back brings them in again. The browser's own visibility
      // check can't work from stale measurements after a long jump down the page.
      const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting))
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
    className: `arrive ${shown ? 'is-on' : ''}`,
    style: { transitionDelay: shown ? `${d}s` : '0s' },
  })

  // one column: the product's name as a badge, the title, and the lede right beneath it
  const words = (
    <div className="over-field mx-auto w-full max-w-[1320px]">
      {/* the product's badge, with its status (if any) beside it */}
      <div {...swap(0)} className={`${swap(0).className} flex flex-wrap items-center gap-3`}>
        <p className="cut-border inline-flex items-center gap-2.5 px-4 py-2 text-[0.9375rem] font-semibold text-paper">
          <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] ${swatch[accent]}`} />
          <span>{name}</span>
        </p>
        {note}
      </div>
      <h2
        id={`${id}-title`}
        {...swap(0.08)}
        className={`${swap(0.08).className} display mt-6 max-w-[22ch] text-paper ${aside ? 'text-[clamp(1.85rem,3vw,2.9rem)]' : 'text-[clamp(2rem,3.6vw,3.5rem)]'}`}
      >
        {title}
      </h2>
      {lede && (
        <p {...swap(0.16)} className={`${swap(0.16).className} mt-5 max-w-[44rem] text-[1.0625rem] text-mist text-pretty md:text-[1.1875rem]`}>
          {lede}
        </p>
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
