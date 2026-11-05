import { useDocumentMeta } from '@/lib/hooks'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  useDocumentMeta('Page not found')
  return (
    <section className="shell flex min-h-[100svh] flex-col justify-center gap-8 pt-24">
      <span className="label-mono text-signal">Error 404</span>
      <h1 className="display text-[clamp(3.5rem,12vw,11rem)]">
        Lost in the<br />atelier<span className="text-signal">.</span>
      </h1>
      <p className="max-w-md text-lg text-ivory/75">The page you are looking for doesn’t exist or has moved.</p>
      <div>
        <Button to="/">Back to home</Button>
      </div>
    </section>
  )
}
