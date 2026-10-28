import { lazy, Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import Snap from 'lenis/snap'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Architecture } from './components/Architecture'
import { BlueprintArt, NetworkArt } from './components/ChapterArt'
import { Chapter } from './components/Chapter'
import { Closing } from './components/Closing'
import { Contact } from './components/Contact'
import { Differentiator } from './components/Differentiator'
import { EngineeringStages } from './components/EngineeringStages'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { SignalCursor } from './components/SignalCursor'
import { SiteNav } from './components/SiteNav'
import { engineering, hr } from './content'
import { prefersReducedMotion } from './lib/motion'
import { glide, scrollToId, setScroller } from './lib/scroll'

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
    if (!id) return
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
    if (prefersReducedMotion()) return () => window.removeEventListener('load', refresh)

    // a soft, weighted glide like a trackpad on a Mac
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
    setScroller(lenis)
    if (import.meta.env.DEV) Object.assign(window, { __lenis: lenis }) // for checking scenes by hand
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // when you stop near a scene, the page settles onto it: each chapter opener
    // fully open, each stage of the agent, each card of the film strip, the
    // closing. Reading sections scroll freely.
    const snap = new Snap(lenis, { type: 'proximity', distanceThreshold: '30%', duration: 1.1, easing: glide, debounce: 400 })
    let removers: (() => void)[] = []
    const placeSnaps = () => {
      removers.forEach((remove) => remove())
      const vh = window.innerHeight
      const at = (el: HTMLElement | null, k = 0) =>
        el ? el.getBoundingClientRect().top + window.scrollY + Math.max(0, el.offsetHeight - vh) * k : null
      const points = [
        0,
        at(document.getElementById(engineering.id), 0.8),
        at(document.getElementById(hr.id), 0.8),
        ...[...document.querySelectorAll<HTMLElement>('[data-stops]')].flatMap((el) =>
          (JSON.parse(el.dataset.stops ?? '[]') as number[]).map((k) => at(el, k)),
        ),
        document.documentElement.scrollHeight - vh,
      ].filter((y): y is number => y !== null)
      removers = points.map((y) => snap.add(Math.round(y)))
    }
    ScrollTrigger.addEventListener('refresh', placeSnaps)
    placeSnaps()

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('load', refresh)
      ScrollTrigger.removeEventListener('refresh', placeSnaps)
      snap.destroy()
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
          <section aria-labelledby={`${engineering.id}-title`}>
            <Chapter
              id={engineering.id}
              art={<BlueprintArt />}
              focus={{ x: 0.62, y: 0.42 }}
              tint={0.25}
              tag={engineering.tag}
              title={engineering.title}
              lede={engineering.lede}
              accent="signal"
            />
            <EngineeringStages />
          </section>
          <section aria-labelledby={`${hr.id}-title`}>
            <Chapter
              id={hr.id}
              art={<NetworkArt />}
              focus={{ x: 0.5, y: 0.5 }}
              tint={0.25}
              tag={hr.tag}
              title={hr.title}
              lede={hr.lede}
              accent="amber"
              note={
                <span className="inline-flex items-center gap-2 rounded-full bg-deep/60 px-3.5 py-1.5 text-[0.875rem] text-mist ring-1 ring-[var(--line)] backdrop-blur-md">
                  <span aria-hidden="true" className="live-dot h-2 w-2 rounded-[2px] bg-amber" />
                  {hr.status}
                </span>
              }
            />
            <Gallery accent="amber" groups={hr.groups} />
            <Differentiator />
          </section>
          <Architecture />
        </main>
        <Closing />
        <Contact />
      </div>
    </div>
  )
}
