import { useCallback, useEffect, useMemo, useState } from 'react'
import { coffees, FREE_SHIPPING, priceFor, SHIPPING_FEE, type Coffee, type Grind, type SizeId } from './data'

export interface CartLine {
  key: string
  id: string
  size: SizeId
  grind: Grind
  qty: number
}

export interface CartRow extends CartLine {
  coffee: Coffee
  unit: number
  total: number
}

const STORAGE_KEY = 'ember-demo-cart-v1'
const MAX_QTY = 20

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : []
    return Array.isArray(parsed) ? parsed.filter((l) => coffees.some((c) => c.id === l.id) && l.qty > 0) : []
  } catch {
    return []
  }
}

/** Cart state persisted to localStorage — nothing ever leaves the browser. */
export function useCart() {
  const [lines, setLines] = useState<CartLine[]>(read)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* storage unavailable (private mode) — cart still works in memory */
    }
  }, [lines])

  const add = useCallback((id: string, size: SizeId, grind: Grind, qty = 1) => {
    const key = `${id}|${size}|${grind}`
    setLines((prev) => {
      const found = prev.find((l) => l.key === key)
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      return [...prev, { key, id, size, grind, qty: Math.min(MAX_QTY, qty) }]
    })
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))))
  }, [])

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), [])
  const clear = useCallback(() => setLines([]), [])

  const summary = useMemo(() => {
    const rows: CartRow[] = lines.map((l) => {
      const coffee = coffees.find((c) => c.id === l.id)!
      const unit = priceFor(coffee, l.size)
      return { ...l, coffee, unit, total: Math.round(unit * l.qty * 100) / 100 }
    })
    const subtotal = Math.round(rows.reduce((s, r) => s + r.total, 0) * 100) / 100
    const count = rows.reduce((s, r) => s + r.qty, 0)
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE
    const toFree = Math.max(0, Math.round((FREE_SHIPPING - subtotal) * 100) / 100)
    return { rows, subtotal, count, shipping, toFree, total: Math.round((subtotal + shipping) * 100) / 100 }
  }, [lines])

  return { ...summary, add, setQty, remove, clear, maxQty: MAX_QTY }
}

export type Cart = ReturnType<typeof useCart>
