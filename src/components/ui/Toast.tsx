import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

type Listener = (msg: string) => void
const listeners = new Set<Listener>()

/** Shows a short confirmation message. */
export function toast(message: string) {
  listeners.forEach((l) => l(message))
}

export function ToastHost() {
  const [msg, setMsg] = useState<{ text: string; id: number } | null>(null)
  useEffect(() => {
    const l: Listener = (text) => setMsg({ text, id: Date.now() })
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 2600)
    return () => clearTimeout(t)
  }, [msg])
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-[4px] border border-ivory/15 bg-graphite-700 px-4 py-3 text-sm text-ivory shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <span className="grid size-5 place-items-center rounded-full bg-lime text-graphite">
              <Check size={13} strokeWidth={2.5} />
            </span>
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
