import { lazy, Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Chapter } from './components/Chapter'
import { CampusToCompany } from './components/CampusToCompany'
import { Contact } from './components/Contact'
import { Differentiator } from './components/Differentiator'
import { Footer } from './components/Footer'
import { EngineeringStages } from './components/EngineeringStages'
import { Hero } from './components/Hero'
import { MarketingIntelligence } from './components/MarketingIntelligence'
import { ObserverEngine } from './components/ObserverEngine'
import { SectionDivider, SectionGlow } from './components/SectionMarks'
import { SignalCursor } from './components/SignalCursor'
import { SiteNav } from './components/SiteNav'
import { contactHref, engineering, hr } from './content'
import { prefersReducedMotion } from './lib/motion'
import { jumpToId, scrollToId, setScroller } from './lib/scroll'

gsap.registerPlugin(ScrollTrigger)

// the fixed star field behind the whole page; three.js loads just after first paint
const GlobalField = lazy(() => import('./components/GlobalField'))

function useAfterPaint() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 250)
    return () => window.clearTimeout(id)
  }, [])
  return ready
}

/** Every in-page link glides instead of jumping. */
function useGlideLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const id = a.getAttribute('href')!.slice(1)
      if (id && scrollToId(id)) e.preventDefault()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

/**
 * Arriving with a #hash (a link to a section, or #lets-talk): open the page
 * right at that section, without a glide down from the top. Once fonts and
 * images have settled it lands again, in case they moved the layout, unless
 * the reader has started scrolling by then.
 */
function useArrivalHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    // #lets-talk opens the contact window instead (see Contact)
    if (!id || `#${id}` === contactHref) return
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    let reading = false
    const readerMoved = () => {
      reading = true
    }
    const land = () => {
      if (reading) return
      ScrollTrigger.refresh()
      jumpToId(id)
    }
    const moves = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    moves.forEach((m) => window.addEventListener(m, readerMoved, { passive: true, once: true }))
    const frame = requestAnimationFrame(land)
    document.fonts?.ready.then(land)
    window.addEventListener('load', land, { once: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('load', land)
      moves.forEach((m) => window.removeEventListener(m, readerMoved))
      reading = true // a late fonts.ready must not move the page after this
    }
  }, [])
}

function useSmoothScroll() {
  useEffect(() => {
    // pinned sections need fresh measurements once images and fonts have settled
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    // and whenever the page's height changes, so no block is left waiting at a stale position
    let lastHeight = 0
    let timer = 0
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight
      if (h === lastHeight) return
      lastHeight = h
      window.clearTimeout(timer)
      timer = window.setTimeout(refresh, 150)
    })
    ro.observe(document.body)
    const stopWatching = () => {
      window.removeEventListener('load', refresh)
      ro.disconnect()
      window.clearTimeout(timer)
    }
    if (prefersReducedMotion()) return stopWatching

    // the wheel, trackpad and touch scroll natively (instant, familiar, at the visitor's own
    // system speed); Lenis only glides the page when a link or button sends it to a section,
    // and following a link first stops any leftover glide
    const lenis = new Lenis({ smoothWheel: false, stopInertiaOnNavigate: true })
    setScroller(lenis)
    if (import.meta.env.DEV) Object.assign(window, { __lenis: lenis }) // for checking scenes by hand
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      stopWatching()
      setScroller(null)
      lenis.destroy()
    }
  }, [])
}

// One continuous story: what Applied AI is → the engineering agent at work →
// the talent platform → where the two meet → the promise → the conversation.
// Chapters fade into each other over the star field; nothing is boxed off.
export default function App() {
  useSmoothScroll()
  useGlideLinks()
  useArrivalHash()
  const fieldReady = useAfterPaint()
  return (
    <div id="top">
      {fieldReady && (
        <Suspense fallback={null}>
          <GlobalField />
        </Suspense>
      )}
      <a
        href={`#${engineering.id}`}
        className="cut fixed top-3 left-3 z-50 -translate-y-24 bg-paper px-4 py-2 text-sm font-semibold text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteNav />
      <SignalCursor />
      {/* all content floats over the fixed field */}
      <div className="relative z-[1]">
        <Hero />
        <main>
          <SectionDivider color={1} />
          <EngineeringStages />
          <SectionDivider color={3} />
          <section aria-labelledby={`${hr.id}-title`} className="relative">
            <SectionGlow accent="amber" side="left" />
            <CampusToCompany
              intro={
                <Chapter
                  id={hr.id}
                  name={hr.name}
                  title={hr.title}
                  accent="amber"
                  aside={<Differentiator />}
                  note={
                    <span className="inline-flex items-center gap-2 text-[0.875rem] text-haze">
                      <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-full bg-amber" />
                      {hr.status}
                    </span>
                  }
                />
              }
            />
          </section>
          <SectionDivider color={0} />
          <ObserverEngine />
          <SectionDivider color={4} />
          <MarketingIntelligence />
        </main>
        <Footer />
      </div>
      {/* the "Let's talk" window, opened from any Let's talk link */}
      <Contact />
    </div>
  )
}
