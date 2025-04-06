export interface VectyConfig {
  variables?: Record<string, any>
  fonts?: FontsConfig[]
}

type TextWeight = 'thin' | 'light' | 'regular' | 'medium' | 'bold' | 'black'
  | 'extrabold' | 'extralight' | 'semibold' | 'ultralight' | 'ultrabold'
  | 'heavy' | 'extraheavy' | 'demibold' | 'demilight' | 'book' | 'normal' | number

type TextStyle = 'normal' | 'italic' | 'oblique'
type TextFormat = 'woff' | 'woff2' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg'

interface FontsConfig {
  name: string
  weight: TextWeight
  style?: TextStyle
  src: ArrayBuffer
  format?: TextFormat
}