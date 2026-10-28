// SupplyChainz mark geometry, in the mark's own SVG units (y down).
// Source: the vector used on the SupplyChainz concept sites (scz-v1…v5).
// Swap for the approved brand file when it is supplied; both the flat and 3D logos read from here.

export const MARK_VIEWBOX = '-4 -4 175 175'

export const FRAME_PATH =
  'M125.69 88.73L125.69 151.85C125.69 158.16 120.57 163.28 114.26 163.28L14.32 163.28C8.01 163.28 2.89 158.16 2.89 151.85L2.89 51.9C2.89 45.58 8.01 40.47 14.32 40.47L77.45 40.47L60.31 57.61L24.61 57.61C22.08 57.61 20.03 59.66 20.03 62.18L20.03 141.56C20.03 144.09 22.08 146.13 24.61 146.13L103.97 146.13C106.5 146.13 108.55 144.09 108.55 141.56L108.55 105.88L125.69 88.73Z'

export type Square = { x: number; y: number; size: number; rx: number; color: string }

export const SQUARES: Square[] = [
  { x: 85.92, y: 40.4, size: 39.8, rx: 4.38, color: '#EA7532' },
  { x: 73.35, y: 2.08, size: 21.23, rx: 2.34, color: '#34BDE8' },
  { x: 134.27, y: 6.17, size: 25.72, rx: 2.83, color: '#ED1B24' },
  { x: 48.71, y: 86.29, size: 31.16, rx: 3.43, color: '#F5B134' },
  { x: 142.85, y: 88.74, size: 21.23, rx: 2.34, color: '#14A17E' },
]

/** Visual centre of the mark, used to centre it in 3D. */
export const MARK_CENTER = { x: 83.5, y: 82.7 }
