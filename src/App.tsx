import { lazy, Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Chapter } from './components/Chapter'
import { Contact } from './components/Contact'
import { CapabilityTabs } from './components/CapabilityTabs'
import { Differentiator } from './components/Differentiator'
import { Footer } from './components/Footer'
import { EngineeringStages } from './components/EngineeringStages'
import { Hero } from './components/Hero'
import { SectionDivider, SectionGlow } from './components/SectionMarks'
import { SignalCursor } from './components/SignalCursor'
import { SiteNav } from './components/SiteNav'
import { contactHref, engineering, hr } from './content'
import { prefersReducedMotion } from './lib/motion'
import { scrollToId, setScroller } from './lib/scroll'

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

/** Arriving with a #hash (an old link to a section, or #lets-talk): glide there once the page has settled. */
function useArrivalHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    // #lets-talk opens the contact window instead (see Contact)
    if (!id || `#${id}` === contactHref) return
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const go = () => {
      ScrollTrigger.refresh()
      scrollToId(id)
    }
    const t = window.setTimeout(go, 400)
    return () => window.clearTimeout(t)
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

    // a light glide: smooth, but close behind the wheel so it never feels late
    const lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, touchMultiplier: 1.4 })
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
            <Chapter
              id={hr.id}
              name={hr.name}
              title={hr.title}
              lede={hr.lede}
              accent="amber"
              aside={<Differentiator />}
              asideFirst
              note={
                <span className="inline-flex items-center gap-2 rounded-full bg-deep/80 px-3.5 py-1.5 text-[0.875rem] text-mist ring-1 ring-[var(--line)]">
                  <span aria-hidden="true" className="live-dot h-2 w-2 rounded-[2px] bg-amber" />
                  {hr.status}
                </span>
              }
            />
            <CapabilityTabs groups={hr.groups} />
          </section>
        </main>
        <Footer />
      </div>
      {/* the "Let's talk" window, opened from any Let's talk link */}
      <Contact />
    </div>
  )
}
