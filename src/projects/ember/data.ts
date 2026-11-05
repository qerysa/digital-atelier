export type Roast = 'Light' | 'Medium' | 'Dark'

export interface Coffee {
  id: string
  name: string
  origin: string
  region: string
  process: string
  varietal: string
  altitude: string
  roast: Roast
  notes: string[]
  /** price for 250 g */
  price: number
  bag: string
  ink: string
  label: string
  description: string
}

export const coffees: Coffee[] = [
  {
    id: 'yirgacheffe-bloom',
    name: 'Yirgacheffe Bloom',
    origin: 'Ethiopia',
    region: 'Gedeo Zone',
    process: 'Washed',
    varietal: 'Heirloom',
    altitude: '1,900–2,100 m',
    roast: 'Light',
    notes: ['Jasmine', 'Bergamot', 'White peach'],
    price: 19,
    bag: '#E8C6A2',
    ink: '#3B2116',
    label: '#F7EEE2',
    description: 'Floral and tea-like, with a silky body and a long, sweet citrus finish. Our brightest filter roast.',
  },
  {
    id: 'huila-sunrise',
    name: 'Huila Sunrise',
    origin: 'Colombia',
    region: 'Huila',
    process: 'Washed',
    varietal: 'Caturra, Castillo',
    altitude: '1,600–1,850 m',
    roast: 'Medium',
    notes: ['Red apple', 'Caramel', 'Cocoa nib'],
    price: 17,
    bag: '#C4552D',
    ink: '#2A160E',
    label: '#F7EEE2',
    description: 'Balanced and round — juicy red fruit up front, caramel sweetness through the middle. An everyday favourite.',
  },
  {
    id: 'kirinyaga-fire',
    name: 'Kirinyaga Fire',
    origin: 'Kenya',
    region: 'Kirinyaga',
    process: 'Washed',
    varietal: 'SL28, SL34',
    altitude: '1,700–1,900 m',
    roast: 'Light',
    notes: ['Blackcurrant', 'Grapefruit', 'Hibiscus'],
    price: 22,
    bag: '#7B2E3A',
    ink: '#2A0F14',
    label: '#F7EEE2',
    description: 'Vivid and structured with deep berry acidity. Exceptional as a pour-over or a bright, modern espresso.',
  },
  {
    id: 'antigua-ember',
    name: 'Antigua Ember',
    origin: 'Guatemala',
    region: 'Antigua',
    process: 'Washed',
    varietal: 'Bourbon',
    altitude: '1,500–1,700 m',
    roast: 'Medium',
    notes: ['Brown sugar', 'Orange zest', 'Almond'],
    price: 18,
    bag: '#D9A441',
    ink: '#33210C',
    label: '#F7EEE2',
    description: 'Sweet, nutty and gently bright. Grown in volcanic soil — the coffee our name was inspired by.',
  },
  {
    id: 'cerrado-velvet',
    name: 'Cerrado Velvet',
    origin: 'Brazil',
    region: 'Cerrado Mineiro',
    process: 'Natural',
    varietal: 'Yellow Catuaí',
    altitude: '1,000–1,200 m',
    roast: 'Dark',
    notes: ['Dark chocolate', 'Hazelnut', 'Molasses'],
    price: 16,
    bag: '#4A2E1F',
    ink: '#F3E9DC',
    label: '#2A1A12',
    description: 'Heavy, velvety and low in acidity. Built for milk drinks and anyone who loves a classic, chocolatey cup.',
  },
  {
    id: 'house-espresso',
    name: 'House Espresso',
    origin: 'Blend',
    region: 'Brazil · Colombia',
    process: 'Natural & washed',
    varietal: 'Mixed',
    altitude: '1,100–1,800 m',
    roast: 'Dark',
    notes: ['Cacao', 'Toffee', 'Dark cherry'],
    price: 16,
    bag: '#1E140F',
    ink: '#F3E9DC',
    label: '#2E1F16',
    description: 'Our espresso backbone: syrupy, sweet and forgiving across grinders and machines.',
  },
]

export const sizes = [
  { id: '250g', label: '250 g', multiplier: 1 },
  { id: '500g', label: '500 g', multiplier: 1.85 },
  { id: '1kg', label: '1 kg', multiplier: 3.4 },
] as const

export const grinds = ['Whole bean', 'Espresso', 'Filter', 'French press'] as const

export type SizeId = (typeof sizes)[number]['id']
export type Grind = (typeof grinds)[number]

export const FREE_SHIPPING = 50
export const SHIPPING_FEE = 6

export const roastLevel: Record<Roast, number> = { Light: 1, Medium: 2, Dark: 3 }

export const priceFor = (coffee: Coffee, size: SizeId) => {
  const m = sizes.find((s) => s.id === size)?.multiplier ?? 1
  return Math.round(coffee.price * m * 100) / 100
}
