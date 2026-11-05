export interface AurelProduct {
  id: string
  name: string
  kind: string
  size: string
  price: number
  keyIngredients: string[]
  use: string
  image: { name: string; widths: [number, number]; ratio: number; alt: string; position?: string }
}

export const products: AurelProduct[] = [
  {
    id: 'serum',
    name: 'Restoring Serum',
    kind: 'Daily serum',
    size: '30 ml',
    price: 64,
    keyIngredients: ['Oat lipids', 'Chamomile'],
    use: 'Two to three drops on clean skin, morning and evening.',
    image: { name: 'aurel-hero', widths: [1600, 960], ratio: 1067 / 1600, alt: 'Frosted serum bottle with a gold dropper on travertine', position: '80% 50%' },
  },
  {
    id: 'cream',
    name: 'Velvet Barrier Cream',
    kind: 'Moisturiser',
    size: '50 ml',
    price: 58,
    keyIngredients: ['Squalane', 'Oat lipids'],
    use: 'Warm a small amount between fingertips and press into skin.',
    image: { name: 'aurel-cream', widths: [800, 520], ratio: 1.5, alt: 'Frosted glass cream jar with a gold lid' },
  },
  {
    id: 'oil',
    name: 'Golden Facial Oil',
    kind: 'Face oil',
    size: '30 ml',
    price: 52,
    keyIngredients: ['Apricot kernel', 'Rosemary'],
    use: 'A few drops as the last step of your evening routine.',
    image: { name: 'aurel-oil', widths: [800, 520], ratio: 1.5, alt: 'Amber glass facial oil bottle with a black pump on a travertine block' },
  },
  {
    id: 'cleanser',
    name: 'Soft Milk Cleanser',
    kind: 'Cleanser',
    size: '150 ml',
    price: 36,
    keyIngredients: ['Chamomile', 'Squalane'],
    use: 'Massage onto dry skin, then rinse with lukewarm water.',
    image: { name: 'aurel-cleanser', widths: [800, 520], ratio: 1.5, alt: 'White tube of milk cleanser with a gold cap on a travertine block' },
  },
]

export interface Ingredient {
  id: string
  name: string
  latin: string
  role: string
  text: string
  /** hotspot position on the flat-lay, in % */
  x: number
  y: number
}

export const ingredients: Ingredient[] = [
  { id: 'oat', name: 'Oat lipids', latin: 'Avena sativa', role: 'Comfort', text: 'Naturally rich in lipids that help skin hold on to moisture and feel soft and supple.', x: 18, y: 30 },
  { id: 'chamomile', name: 'Chamomile', latin: 'Matricaria recutita', role: 'Calm', text: 'A classic soothing botanical, used to help skin that feels tight or easily irritated.', x: 51, y: 31 },
  { id: 'rosemary', name: 'Rosemary', latin: 'Rosmarinus officinalis', role: 'Balance', text: 'An antioxidant-rich leaf extract that supports a fresh, balanced-looking complexion.', x: 83, y: 40 },
  { id: 'squalane', name: 'Squalane', latin: 'Plant-derived', role: 'Softness', text: 'A lightweight, skin-friendly oil that softens without leaving a greasy film.', x: 30, y: 70 },
  { id: 'apricot', name: 'Apricot kernel oil', latin: 'Prunus armeniaca', role: 'Nourish', text: 'Cold-pressed and fast-absorbing, with a silky finish that leaves skin glowing.', x: 68, y: 72 },
]

export const benefits = [
  { title: 'Calming', text: 'Gentle botanicals for skin that is easily stressed.' },
  { title: 'Barrier-first', text: 'Lipid-rich textures that support the skin’s natural barrier.' },
  { title: 'Lightweight', text: 'Fast-absorbing layers that never feel heavy or sticky.' },
  { title: 'Minimal routine', text: 'Four essentials that work together — nothing extra.' },
]

/** Sample content — the layout is ready for real customer reviews. */
export const sampleReviews = [
  { quote: 'Placeholder review: a customer describes how the cream feels on their skin and how it fits into their evening routine.', name: 'Sample customer', product: 'Velvet Barrier Cream' },
  { quote: 'Placeholder review: a customer explains why the serum’s texture works under make-up and what they noticed after a few weeks.', name: 'Sample customer', product: 'Restoring Serum' },
  { quote: 'Placeholder review: a customer talks about the scent-free cleanser and how gentle it feels on dry, sensitive skin.', name: 'Sample customer', product: 'Soft Milk Cleanser' },
]

export const faqs = [
  { q: 'Which product should I start with?', a: 'Begin with the Soft Milk Cleanser and the Velvet Barrier Cream. Add the serum in the morning and the facial oil at night once your routine feels settled.' },
  { q: 'Are the formulas fragrance-free?', a: 'Yes. Aurel formulas are designed without added fragrance or essential-oil perfumes — any scent comes from the raw botanicals themselves.' },
  { q: 'How long does each product last?', a: 'Used daily, a 30 ml serum or oil typically lasts around two months, and the 50 ml cream about the same.' },
  { q: 'Are the products suitable for sensitive skin?', a: 'They are formulated with gentle ingredients, but every skin is different. Patch-test on a small area first and consult a dermatologist if you have a skin condition.' },
  { q: 'Can I return a product?', a: 'In a live store, this answer would explain the return window and conditions. Aurel is a design concept, so no orders are taken.' },
]
