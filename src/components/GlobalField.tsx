import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { MAX_PULSES, MAX_WAKES, pointer as visitor } from '../lib/pointer'
import { ease, lerp, prefersReducedMotion } from '../lib/motion'

// One deep-space field of square points (the squares of the brand mark) fixed
// behind the whole page. Scrolling carries the camera slowly through it on a
// gentle orbit, so the background is never still while you read. Sections are
// transparent on top, so there are no seams.

const INK = '#081128'

/**
 * Square points with a soft glow, drawn with depth: each drifts on its own slow
 * loop and twinkles, far ones fade into the dark, the nearest soften like an
 * out-of-focus foreground. They part around the pointer, a fast move leaves a
 * wake, and a click sends a soft ring outward through them.
 */
function squareMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: 1 },
      uMax: { value: 6 },
      uFog: { value: 0.00105 },
      uMotion: { value: 1 },
      uOpacity: { value: 1 },
      // the visitor's pointer, in CSS px with y up: x, y, strength, radius
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector4(0, 0, 0, 120) },
      // pulses from clicks (x, y, start time, strength) and the wake of fast moves
      uPulse: { value: Array.from({ length: MAX_PULSES }, () => new THREE.Vector4(0, 0, -99, 0)) },
      uWake: { value: Array.from({ length: MAX_WAKES }, () => new THREE.Vector4(0, 0, -99, 0)) },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aPhase;
      uniform float uTime;
      uniform float uScale;
      uniform float uMax;
      uniform float uFog;
      uniform float uMotion;
      uniform vec2 uRes;
      uniform vec4 uPointer;
      uniform vec4 uPulse[${MAX_PULSES}];
      uniform vec4 uWake[${MAX_WAKES}];
      varying vec3 vColor;
      varying float vAlpha;
      varying float vSoft;
      void main() {
        vec3 p = position;
        p += uMotion * vec3(sin(uTime * 0.11 + aPhase), sin(uTime * 0.09 + aPhase * 1.7), cos(uTime * 0.1 + aPhase * 0.7)) * 5.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float depth = max(1.0, -mv.z);
        float size = aSize * uScale / depth;
        gl_PointSize = clamp(size, 1.0, uMax);
        vSoft = clamp((size - uMax * 0.55) / (uMax * 0.6), 0.0, 1.0);
        float fog = exp(-(uFog * depth) * (uFog * depth));
        float twinkle = 0.72 + 0.28 * sin(uTime * (0.5 + fract(aPhase * 3.1) * 1.5) + aPhase * 5.0);
        vAlpha = fog * mix(1.0, twinkle, uMotion);
        vColor = aColor;
        vec4 clip = projectionMatrix * mv;

        // the pointer passes through the field like a hand through water
        vec2 sp = (clip.xy / clip.w * 0.5 + 0.5) * uRes;
        vec2 push = vec2(0.0);
        float lit = 0.0;
        vec2 d = sp - uPointer.xy;
        float r = length(d) + 0.001;
        float near = exp(-(r * r) / (uPointer.w * uPointer.w)) * uPointer.z;
        push += d / r * near * 11.0 + vec2(-d.y, d.x) / r * near * 3.0;
        lit += near * 0.35;
        for (int i = 0; i < ${MAX_WAKES}; i++) {
          vec4 wk = uWake[i];
          float age = uTime - wk.z;
          if (age < 0.0 || age > 1.4) continue;
          vec2 dw = sp - wk.xy;
          float rw = length(dw) + 0.001;
          float f = exp(-(rw * rw) / 6400.0) * wk.w * exp(-age * 2.6);
          push += dw / rw * f * 12.0;
          lit += f * 0.3;
        }
        for (int i = 0; i < ${MAX_PULSES}; i++) {
          vec4 pl = uPulse[i];
          float age = uTime - pl.z;
          if (age < 0.0 || age > 2.6) continue;
          vec2 dp = sp - pl.xy;
          float rp = length(dp) + 0.001;
          float ring = exp(-pow((rp - age * 720.0) / 60.0, 2.0)) * exp(-age * 1.2) * pl.w;
          push += dp / rp * ring * 16.0;
          lit += ring * 1.8;
        }
        push *= uMotion;
        clip.xy += push / uRes * 2.0 * clip.w;
        gl_Position = clip;
        vAlpha *= 1.0 + lit * uMotion;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vAlpha;
      varying float vSoft;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = max(abs(c.x), abs(c.y));
        float edge = 0.03 + vSoft * 0.2;
        float core = 1.0 - smoothstep(0.33 - edge, 0.33 + edge * 0.5, d);
        float glow = (1.0 - smoothstep(0.0, 0.5, length(c))) * 0.3;
        float a = max(core, glow) * vAlpha * uOpacity;
        if (a < 0.004) discard;
        gl_FragColor = vec4(vColor, a);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

function buildField(count: number) {
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const phase = new Float32Array(count)
  const paper = new THREE.Color('#eef2f8')
  const tmp = new THREE.Color()
  const arms = 4
  for (let i = 0; i < count; i++) {
    const shell = i > count * 0.86 // a sparse far shell for depth
    let x: number, y: number, z: number
    if (shell) {
      const u = Math.random() * 2 - 1
      const t = Math.random() * Math.PI * 2
      const r = 1100 + Math.random() * 500
      const s = Math.sqrt(1 - u * u)
      x = Math.cos(t) * s * r
      y = u * r * 0.6
      z = Math.sin(t) * s * r
    } else {
      const r = 40 + Math.pow(Math.random(), 0.65) * 950
      const arm = (Math.floor(Math.random() * arms) / arms) * Math.PI * 2
      const a = arm + r * 0.0042 + (Math.random() - 0.5) * (0.5 + 120 / r)
      x = Math.cos(a) * r
      z = Math.sin(a) * r
      y = (Math.random() + Math.random() + Math.random() - 1.5) * (36 + r * 0.16)
    }
    pos.set([x, y, z], i * 3)
    // all plain, soft light: coloured stars caught the eye too much
    tmp.set(paper)
    const dim = shell ? 0.35 : 0.55 + Math.random() * 0.45
    col.set([tmp.r * dim, tmp.g * dim, tmp.b * dim], i * 3)
    // a spread of sizes, so near and far read as depth rather than one flat layer
    size[i] = 3.6 * (0.7 + Math.pow(Math.random(), 2) * 0.9)
    phase[i] = Math.random() * Math.PI * 2
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
  return geo
}

export default function GlobalField() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current!
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
    } catch {
      return // no WebGL: the plain navy page remains
    }
    const small = window.matchMedia('(max-width: 767px)').matches
    // capped: the field is soft points, so extra pixels cost GPU time without looking sharper
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    renderer.setClearColor(INK)
    host.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 4000)
    const reduced = prefersReducedMotion()

    // sparse on purpose: a calm backdrop rather than a dotted pattern
    const geo = buildField(small ? 400 : 850)
    const mat = squareMaterial()
    // keep points near the camera from ballooning into big squares
    mat.uniforms.uMax.value = (small ? 5 : 6) * renderer.getPixelRatio()
    mat.uniforms.uMotion.value = reduced ? 0 : 1
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    const look = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      look.tx = e.clientX / window.innerWidth - 0.5
      look.ty = e.clientY / window.innerHeight - 0.5
    }

    let w = 1
    let h = 1
    let maxScroll = 0 // how far the page can scroll, measured when it changes
    const measure = () => {
      maxScroll = document.documentElement.scrollHeight - h
    }
    const pageSize = new ResizeObserver(measure)
    pageSize.observe(document.body)
    const resize = () => {
      w = Math.max(1, window.innerWidth)
      h = Math.max(1, window.innerHeight)
      measure()
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.fov = w < h ? 68 : 50
      camera.updateProjectionMatrix()
      // the same size rule as three's own points: size × (half the drawing height) ÷ depth
      mat.uniforms.uScale.value = (h * renderer.getPixelRatio()) / 2
    }

    const start = performance.now()
    let travel = 0
    const ptr = { x: 0, y: 0, on: 0 }
    const toTime = (stamp: number) => (stamp - start) / 1000

    const render = (now: number) => {
      const t = reduced ? 0 : (now - start) / 1000
      const target = maxScroll > 0 ? window.scrollY / maxScroll : 0
      // follows the scroll closely, so the field never keeps drifting after the page stops
      travel += (target - travel) * (reduced ? 1 : 0.35)
      const g = ease(travel)

      look.x += (look.tx - look.x) * 0.04
      look.y += (look.ty - look.y) * 0.04

      // a slow orbit through the field: wide and high behind the hero, closer and lower by the end
      const a = 0.6 + g * 2.6
      const r = lerp(360, 150, g)
      camera.position.set(Math.sin(a) * r + look.x * 18, lerp(180, 40, g) - look.y * 12, Math.cos(a) * r)
      camera.lookAt(0, 0, 0)
      points.rotation.y = t * 0.012

      // quiet behind the type at the top, fuller as the story goes on
      // full behind the hero, fading to a faint trace once you scroll past it, so the reading sections stay calm
      const pastHero = Math.min(1, window.scrollY / (h * 1.1))
      mat.uniforms.uOpacity.value = lerp(0.5, 0.08, pastHero * pastHero * (3 - 2 * pastHero))
      mat.uniforms.uTime.value = t

      ptr.x += (visitor.x - ptr.x) * 0.25
      ptr.y += (visitor.y - ptr.y) * 0.25
      ptr.on += ((visitor.inside ? 1 : 0) - ptr.on) * 0.08
      visitor.speed *= 0.9
      const u = mat.uniforms
      u.uRes.value.set(w, h)
      u.uPointer.value.set(ptr.x, h - ptr.y, ptr.on, 80 + Math.min(visitor.speed, 2400) * 0.015)
      visitor.pulses.forEach((pl, i) => u.uPulse.value[i].set(pl.x, h - pl.y, toTime(pl.t), 1))
      visitor.wakes.forEach((wk, i) => u.uWake.value[i].set(wk.x, h - wk.y, toTime(wk.t), wk.s))

      renderer.render(scene, camera)
    }

    let raf = 0
    let running = false
    let odd = false
    const loop = (now: number) => {
      odd = !odd
      const faint = window.scrollY > h * 1.1
      if (!faint || odd) render(now)
      if (running && !reduced) raf = requestAnimationFrame(loop)
    }
    const play = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const pause = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    // with reduced motion the field is still: draw it once, and again when the page moves
    const still = () => requestAnimationFrame(render)

    resize()
    if (reduced) {
      still()
      window.addEventListener('scroll', still, { passive: true })
    } else {
      play()
      window.addEventListener('pointermove', onPointer, { passive: true })
    }
    const onResize = () => {
      resize()
      if (reduced) still()
    }
    window.addEventListener('resize', onResize)
    const onVisibility = () => (document.hidden ? pause() : !reduced && play())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      pause()
      pageSize.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', still)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
}
