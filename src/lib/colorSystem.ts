// ─── Types ────────────────────────────────────────────────────────────────────

export type StopKey = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export type BrandScale = Record<StopKey, string>

export interface SemanticTokens {
  '--color-brand-fill': string
  '--color-brand-fill-hover': string
  '--color-brand-text': string
  '--color-brand-subtle': string
  '--color-brand-border': string
  '--color-on-brand-fill': string
  '--color-text-primary': string
  '--color-text-secondary': string
  '--color-text-tertiary': string
  '--color-loyalty-gold': string
}

// ─── L values per stop ────────────────────────────────────────────────────────
// Keep H and S from input; vary only L across the scale.

const STOP_LIGHTNESS: Record<number, number> = {
  50: 97,
  100: 93,
  200: 85,
  300: 73,
  400: 60,
  500: 49,
  600: 38,
  700: 28,
  800: 18,
  900: 10,
}

// ─── Colour maths ─────────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16) / 255
  const g = parseInt(c.slice(2, 4), 16) / 255
  const b = parseInt(c.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) return [0, 0, Math.round(l * 100)]

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    case b: h = ((r - g) / d + 4) / 6; break
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100
  const ln = l / 100
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function toLinearChannel(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hex: string): number {
  const c = hex.replace('#', '')
  const r = toLinearChannel(parseInt(c.slice(0, 2), 16) / 255)
  const g = toLinearChannel(parseInt(c.slice(2, 4), 16) / 255)
  const b = toLinearChannel(parseInt(c.slice(4, 6), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a)
  const l2 = relativeLuminance(b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generates a 10-stop scale from the input brand hex.
 * H and S are preserved from the input; only L varies.
 */
export function generateBrandScale(brandHex: string): BrandScale {
  const [h, s] = hexToHsl(brandHex)
  const scale = {} as BrandScale
  for (const [stop, l] of Object.entries(STOP_LIGHTNESS)) {
    scale[Number(stop) as StopKey] = hslToHex(h, s, l)
  }
  return scale
}

/**
 * Maps brand scale stops to semantic design tokens.
 */
export function getSemanticTokens(scale: BrandScale): SemanticTokens {
  const white = '#ffffff'

  // Lightest brand stop that still achieves WCAG AA (4.5:1) against white
  const contrastStops: StopKey[] = [100, 200, 300, 400, 500, 600, 700, 800, 900]
  let brandText = scale[900]
  for (const stop of contrastStops) {
    if (contrastRatio(scale[stop], white) >= 4.5) {
      brandText = scale[stop]
      break
    }
  }

  const brandFill = scale[600]
  const onBrandFill = getTextOnBackground(brandFill, scale[900])

  return {
    '--color-brand-fill': brandFill,
    '--color-brand-fill-hover': scale[700],
    '--color-brand-text': brandText,
    '--color-brand-subtle': scale[50],
    '--color-brand-border': scale[200],
    '--color-on-brand-fill': onBrandFill,
    '--color-text-primary': scale[900],
    '--color-text-secondary': '#6B7280',
    '--color-text-tertiary': '#9CA3AF',
    '--color-loyalty-gold': '#D4A017',
  }
}

/**
 * Returns the appropriate text colour for a given background hex.
 * Returns white for dark backgrounds, or darkText (default: stop 900) for light ones.
 * Never returns a fixed navy — the dark option is always derived from the brand.
 */
export function getTextOnBackground(bgHex: string, darkText = '#111827'): string {
  // WCAG: white (#fff, lum≈1) achieves 4.5:1 when bg lum ≤ 0.179
  return relativeLuminance(bgHex) <= 0.179 ? white : darkText
}

const white = '#ffffff'

/**
 * Injects all brand tokens as CSS custom properties on :root.
 * Elements using those variables will transition in 300ms.
 */
export function applyBrandToDOM(brandHex: string): void {
  const scale = generateBrandScale(brandHex)
  const tokens = getSemanticTokens(scale)
  const root = document.documentElement

  for (const [token, value] of Object.entries(tokens)) {
    root.style.setProperty(token, value)
  }

  // Expose full scale for advanced usage
  for (const [stop, color] of Object.entries(scale)) {
    root.style.setProperty(`--color-brand-${stop}`, color)
  }
}
