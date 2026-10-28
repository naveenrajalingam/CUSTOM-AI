// The car the Digital Design Agent assembles: a side-view "anatomy" of a coupe
// built from 600-odd separate parts (body panels, glass, chassis, powertrain,
// drivetrain, exhaust, suspension, interior, wiring, fasteners and two fully
// built wheels). Every part is a small shape in a 1000 × 420 drawing; each
// knows the group it belongs to, which sets its colour and when it arrives.

export const VIEW = { w: 1000, h: 420 }
/** The band of the drawing the console shows: the car from roof to ground, with a little air. */
export const FRAME = { top: 110, h: 285 }

export type Group =
  | 'chassis'
  | 'suspension'
  | 'powertrain'
  | 'drivetrain'
  | 'wheel'
  | 'brake'
  | 'interior'
  | 'body'
  | 'glass'
  | 'wiring'
  | 'fastener'

/** A shape drawn around its own centre (cx, cy), so it can fly and turn about it. */
export type Shape =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'arc'; r: number; a0: number; a1: number }
  | { kind: 'rect'; w: number; h: number }
  | { kind: 'dot'; r: number }

export type Part = { cx: number; cy: number; shape: Shape; group: Group; width: number }

type P = [number, number]

/** Order in which the groups arrive, 0 → 1: the frame first, the last bolts at the end. */
export const ARRIVAL: Record<Group, number> = {
  chassis: 0,
  suspension: 0.1,
  powertrain: 0.18,
  drivetrain: 0.24,
  brake: 0.3,
  wheel: 0.36,
  interior: 0.46,
  body: 0.54,
  glass: 0.66,
  wiring: 0.74,
  fastener: 0.8,
}

/** Points along a smooth curve through the given points (Catmull–Rom). */
function curve(points: P[], segments: number): P[] {
  const out: P[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * (points.length - 1)
    const k = Math.min(points.length - 2, Math.floor(t))
    const u = t - k
    const p0 = points[Math.max(0, k - 1)]
    const p1 = points[k]
    const p2 = points[k + 1]
    const p3 = points[Math.min(points.length - 1, k + 2)]
    const f = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u)
    out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
  }
  return out
}

/** Points along a straight line, ends included. */
function straight(a: P, b: P, segments: number): P[] {
  return Array.from({ length: segments + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / segments, a[1] + ((b[1] - a[1]) * i) / segments] as P)
}

export function buildCar(): Part[] {
  const parts: Part[] = []

  const line = (a: P, b: P, group: Group, width = 1.6) => {
    const cx = (a[0] + b[0]) / 2
    const cy = (a[1] + b[1]) / 2
    parts.push({ cx, cy, group, width, shape: { kind: 'line', x1: a[0] - cx, y1: a[1] - cy, x2: b[0] - cx, y2: b[1] - cy } })
  }
  /** A polyline as one part per segment. */
  const path = (pts: P[], group: Group, width?: number) => {
    for (let i = 0; i < pts.length - 1; i++) line(pts[i], pts[i + 1], group, width)
  }
  /** A circle (or part of one) as one part per segment, each turning about its own middle. */
  const ring = (cx: number, cy: number, r: number, segments: number, group: Group, width = 1.6, from = 0, to = Math.PI * 2) => {
    const step = (to - from) / segments
    for (let i = 0; i < segments; i++) {
      const a = from + step * (i + 0.5)
      const mx = cx + Math.cos(a) * r
      const my = cy + Math.sin(a) * r
      // stored relative to the segment's middle: the arc's own centre sits at (-cos a·r, -sin a·r)
      parts.push({ cx: mx, cy: my, group, width, shape: { kind: 'arc', r, a0: a - step / 2, a1: a + step / 2 } })
    }
  }
  const rect = (x: number, y: number, w: number, h: number, group: Group, width = 1.4) =>
    parts.push({ cx: x + w / 2, cy: y + h / 2, group, width, shape: { kind: 'rect', w, h } })
  const dot = (x: number, y: number, r: number, group: Group) => parts.push({ cx: x, cy: y, group, width: 0, shape: { kind: 'dot', r } })

  const FRONT = 760
  const REAR = 250
  const AXLE_Y = 312

  // ---- body: the profile, both wheel arches and the sill
  const roof = curve(
    [
      [108, 330], [100, 292], [112, 256], [170, 236], [260, 224], [318, 214], [392, 156], [470, 142],
      [560, 140], [624, 170], [690, 212], [790, 226], [860, 240], [902, 262], [916, 296], [908, 330],
    ],
    72,
  )
  path(roof, 'body', 2)
  path(straight([908, 330], [832, 330], 3), 'body', 2)
  ring(FRONT, AXLE_Y, 72, 12, 'body', 2, Math.PI * 2, Math.PI)
  path(straight([688, 330], [322, 330], 18), 'body', 2)
  ring(REAR, AXLE_Y, 72, 12, 'body', 2, Math.PI * 2, Math.PI)
  path(straight([178, 330], [108, 330], 3), 'body', 2)
  // doors, handles, mirror, lamps, grille
  path([[505, 216], [690, 222], [688, 320], [512, 322], [505, 216]].flatMap((p, i, a) => (i < a.length - 1 ? straight(p as P, a[i + 1] as P, 4).slice(0, -1) : [p as P])), 'body', 1.2)
  path(straight([330, 218], [330, 318], 4), 'body', 1.2)
  path(straight([330, 318], [512, 322], 5), 'body', 1.2)
  rect(632, 238, 22, 5, 'body', 1.2)
  rect(452, 236, 22, 5, 'body', 1.2)
  path([[676, 206], [700, 198], [706, 212], [684, 214]], 'body', 1.2)
  rect(866, 248, 34, 12, 'body', 1.2)
  for (let i = 0; i < 3; i++) line([870 + i * 10, 251], [874 + i * 10, 257], 'body', 1)
  rect(102, 262, 14, 24, 'body', 1.2)
  for (let i = 0; i < 2; i++) line([105, 268 + i * 8], [113, 268 + i * 8], 'body', 1)
  for (let i = 0; i < 4; i++) line([904 + i * 2.5, 272], [906 + i * 2.5, 300], 'body', 1)

  // ---- glass: side windows and the B-pillar
  const glass = curve([[338, 214], [400, 166], [470, 154], [555, 152], [615, 178], [668, 212]], 20)
  path(glass, 'glass', 1.4)
  path(straight([668, 212], [338, 214], 8), 'glass', 1.4)
  line([500, 153], [505, 214], 'glass', 1.4)

  // ---- chassis: rails, crossmembers, floor pan
  path(straight([130, 322], [890, 322], 26), 'chassis', 1.5)
  for (let x = 150; x <= 870; x += 55) line([x, 316], [x, 330], 'chassis', 1.5)
  path(straight([300, 340], [700, 340], 12), 'chassis', 1.2)

  // ---- powertrain: engine block, cylinders, pistons, head, intake, pulleys, radiator, battery
  rect(770, 252, 90, 44, 'powertrain', 1.5)
  for (let i = 0; i < 4; i++) {
    rect(774 + i * 21, 236, 16, 18, 'powertrain', 1.3)
    line([782 + i * 21, 258], [782 + i * 21, 284], 'powertrain', 1.2)
    rect(777 + i * 21, 270 + (i % 2) * 6, 10, 6, 'powertrain', 1)
  }
  line([770, 234], [860, 234], 'powertrain', 1.5)
  for (let i = 0; i < 4; i++) ring(782 + i * 21, 228, 6, 2, 'powertrain', 1, Math.PI, Math.PI * 2)
  ring(866, 272, 8, 6, 'powertrain', 1.2)
  ring(868, 292, 5, 4, 'powertrain', 1.2)
  for (let i = 0; i < 6; i++) line([880, 248 + i * 8], [896, 248 + i * 8], 'powertrain', 1)
  rect(706, 250, 24, 16, 'powertrain', 1.2)

  // ---- drivetrain: gearbox, driveshaft, differential, fuel tank, exhaust and muffler
  rect(700, 282, 50, 26, 'drivetrain', 1.4)
  path(straight([700, 300], [296, 300], 14), 'drivetrain', 1.6)
  ring(286, 300, 10, 6, 'drivetrain', 1.4)
  rect(180, 296, 72, 22, 'drivetrain', 1.2)
  path(straight([764, 348], [222, 348], 16), 'drivetrain', 1.3)
  rect(160, 340, 62, 15, 'drivetrain', 1.3)
  line([160, 348], [118, 344], 'drivetrain', 1.3)

  // ---- suspension at each axle: coil spring, damper, two control arms
  for (const cx of [REAR, FRONT]) {
    const coil: P[] = Array.from({ length: 9 }, (_, i) => [cx - 6 + (i % 2) * 12, 238 + i * 6.5])
    path(coil, 'suspension', 1.4)
    line([cx + 16, 240], [cx + 16, 292], 'suspension', 1.4)
    line([cx, AXLE_Y], [cx - 58, 324], 'suspension', 1.4)
    line([cx, AXLE_Y - 10], [cx + 50, 318], 'suspension', 1.4)
  }

  // ---- interior: seats, headrests, steering, dashboard, pedals
  for (const sx of [560, 405]) {
    line([sx, 302], [sx + 34, 302], 'interior', 1.5)
    line([sx, 302], [sx - 14, 236], 'interior', 1.5)
    line([sx - 14, 236], [sx - 4, 234], 'interior', 1.2)
    rect(sx - 22, 220, 14, 13, 'interior', 1.2)
  }
  ring(650, 238, 14, 8, 'interior', 1.4)
  line([650, 238], [690, 262], 'interior', 1.3)
  path(curve([[618, 214], [660, 226], [702, 232]], 6), 'interior', 1.3)
  line([700, 300], [690, 312], 'interior', 1.2)
  line([712, 300], [702, 312], 'interior', 1.2)

  // ---- wiring harness: short runs from the battery to the lamps
  const harness = straight([716, 268], [200, 282], 24)
  for (let i = 0; i < harness.length - 1; i += 1) {
    const [a, b] = [harness[i], harness[i + 1]]
    line(a, [a[0] + (b[0] - a[0]) * 0.6, a[1] + (b[1] - a[1]) * 0.6], 'wiring', 1)
  }

  // ---- the wheels: tyre, tread, rim, spokes, hub, brake disc, caliper, lug nuts
  for (const cx of [REAR, FRONT]) {
    ring(cx, AXLE_Y, 56, 28, 'wheel', 2.2)
    ring(cx, AXLE_Y, 47, 20, 'wheel', 1.2)
    ring(cx, AXLE_Y, 38, 16, 'wheel', 1.5)
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      line([cx + Math.cos(a) * 11, AXLE_Y + Math.sin(a) * 11], [cx + Math.cos(a) * 35, AXLE_Y + Math.sin(a) * 35], 'wheel', 1.2)
    }
    ring(cx, AXLE_Y, 8, 6, 'wheel', 1.4)
    ring(cx, AXLE_Y, 27, 14, 'brake', 1.4)
    rect(cx + 18, AXLE_Y - 30, 12, 20, 'brake', 1.3)
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2
      dot(cx + Math.cos(a) * 17, AXLE_Y + Math.sin(a) * 17, 1.8, 'fastener')
    }
  }

  // ---- fasteners: rivets along the body seam and bolts along the rails
  for (let i = 2; i < roof.length - 2; i += 3) dot(roof[i][0], roof[i][1], 1.6, 'fastener')
  for (let x = 140; x <= 880; x += 26) dot(x, 322, 1.6, 'fastener')

  return parts
}
