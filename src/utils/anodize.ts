export type AnodizeStop = { v: number; hex: string; label: string }

// Precise titanium anodizing color stops based on actual voltage-to-color data
export const ANODIZE_STOPS: AnodizeStop[] = [
  { v: 0, hex: '#B5B5B5', label: 'Raw Titanium' },
  { v: 10, hex: '#CD7F32', label: 'Light Bronze' },
  { v: 11, hex: '#B87333', label: 'Copper' },
  { v: 15, hex: '#CD7F32', label: 'Bronze' },
  { v: 18, hex: '#A0522D', label: 'Dark Bronze' },
  { v: 20, hex: '#9370DB', label: 'Light Purple' },
  { v: 23, hex: '#800080', label: 'Purple' },
  { v: 25, hex: '#800080', label: 'Purple' },
  { v: 28, hex: '#663399', label: 'Dark Purple' },
  { v: 30, hex: '#191970', label: 'Dark Blue' },
  { v: 32, hex: '#0000FF', label: 'Blue' },
  { v: 35, hex: '#90EE90', label: 'Light Green' },
  { v: 36, hex: '#20B2AA', label: 'Light Blue-Green' },
  { v: 40, hex: '#FFFF00', label: 'Yellow' },
  { v: 45, hex: '#FFC0CB', label: 'Pink' },
  { v: 50, hex: '#008000', label: 'Green' },
  { v: 51, hex: '#FFD700', label: 'Golden Yellow' },
  { v: 60, hex: '#FFA500', label: 'Orange' },
  { v: 65, hex: '#FFD700', label: 'Gold' },
  { v: 70, hex: '#FFD700', label: 'Bright Gold' },
  { v: 75, hex: '#FF69B4', label: 'Hot Pink' },
  { v: 81, hex: '#FF1493', label: 'Deep Pink' },
  { v: 85, hex: '#FF00FF', label: 'Magenta' },
  { v: 90, hex: '#FFB6C1', label: 'Light Pink' },
  { v: 95, hex: '#008080', label: 'Teal' },
  { v: 100, hex: '#00FF7F', label: 'Spring Green' },
  { v: 106, hex: '#32CD32', label: 'Lime Green' },
  { v: 110, hex: '#87CEEB', label: 'Light Blue' },
]

export function levelToVoltage(level: number): number {
  const t = Math.max(0, Math.min(1, level))
  return Math.round(t * 110)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = hex.replace('#', '')
  const bigint = parseInt(m, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => n.toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

function lerp(a: number, b: number, t: number): number { return a + (b - a) * t }

export function voltageToHexLabel(v: number): { hex: string; label: string } {
  const voltage = Math.max(0, Math.min(110, v))
  // Find bracketing stops
  let a = ANODIZE_STOPS[0]
  let b = ANODIZE_STOPS[ANODIZE_STOPS.length - 1]
  for (let i = 0; i < ANODIZE_STOPS.length - 1; i++) {
    const s = ANODIZE_STOPS[i]
    const t = ANODIZE_STOPS[i + 1]
    if (voltage >= s.v && voltage <= t.v) { a = s; b = t; break }
  }
  const span = b.v - a.v || 1
  const t = (voltage - a.v) / span
  const ca = hexToRgb(a.hex)
  const cb = hexToRgb(b.hex)
  const r = Math.round(lerp(ca.r, cb.r, t))
  const g = Math.round(lerp(ca.g, cb.g, t))
  const bch = Math.round(lerp(ca.b, cb.b, t))
  const hex = rgbToHex(r, g, bch)
  // Nearest label by absolute delta
  let nearest = a
  for (const s of ANODIZE_STOPS) {
    if (Math.abs(s.v - voltage) < Math.abs(nearest.v - voltage)) nearest = s
  }
  return { hex, label: nearest.label }
}

export function levelToHexLabel(level: number): { hex: string; label: string; voltage: number } {
  const v = levelToVoltage(level)
  const { hex, label } = voltageToHexLabel(v)
  return { hex, label, voltage: v }
}

// Generate CSS gradient from the anodize stops
export function generateAnodizeGradient(): string {
  const stops = ANODIZE_STOPS.map(stop => {
    const percent = (stop.v / 110 * 100).toFixed(1)
    return `${stop.hex} ${percent}%`
  }).join(', ')
  return `linear-gradient(90deg, ${stops})`
}
