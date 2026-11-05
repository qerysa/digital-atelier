import { Copy } from 'lucide-react'
import { useRef } from 'react'
import { activeSocials, contactEmail, hasEmail } from '@/config/site'
import { contactCopy } from '@/data/content'
import { copyText } from '@/lib/hooks'
import { MaskHeading } from '@/components/ui/MaskHeading'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { toast } from '@/components/ui/Toast'
import { ContactForm } from './ContactForm'

const nextSteps = ['You share a few details about the project.', 'I reply with questions and a proposed approach.', 'We agree on scope, timeline and budget — then start.']

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const startProject = () => {
    const form = formRef.current
    if (!form) return
    form.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
    setTimeout(() => form.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true }), 500)
  }
  const copyEmail = async () => {
    toast((await copyText(contactEmail)) ? 'Email copied to clipboard' : `Copy failed — ${contactEmail}`)
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-ivory/10 bg-graphite-800 py-[clamp(96px,12vw,180px)]">
      <div className="shell">
        <div className="flex items-center gap-4">
          <span className="label-mono text-muted">(05)</span>
          <span className="h-px flex-1 bg-ivory/12" />
          <span className="label-mono text-muted">Contact</span>
        </div>

        <MaskHeading
          id="contact-title"
          lines={['Have a project', <>in mind<span className="text-signal">?</span></>]}
          className="display mt-10 text-[clamp(3rem,10.5vw,11.5rem)]"
        />

        <div className="mt-[clamp(48px,6vw,90px)] grid grid-cols-12 gap-x-6 gap-y-14">
          <Reveal className="col-span-12 flex flex-col gap-10 lg:col-span-5">
            <p className="max-w-md text-[20px] leading-relaxed text-ivory/85">{contactCopy.intro}</p>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button onClick={startProject}>Start a project</Button>
              {hasEmail && (
                <Button variant="outline" onClick={copyEmail} icon={<Copy size={15} strokeWidth={1.75} />}>
                  Copy email
                </Button>
              )}
            </div>
            {hasEmail && (
              <a href={`mailto:${contactEmail}`} className="w-fit border-b border-ivory/25 pb-1 text-lg transition-colors hover:border-signal hover:text-signal">
                {contactEmail}
              </a>
            )}

            <div>
              <p className="label-mono mb-4 text-muted">What happens next</p>
              <ol className="space-y-3">
                {nextSteps.map((s, i) => (
                  <li key={s} className="flex gap-4 border-t border-ivory/10 pt-3 text-[15px] text-ivory/80">
                    <span className="label-mono pt-0.5 text-signal">0{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            {activeSocials.length > 0 && (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {activeSocials.map((s) => (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="label-mono text-ivory/80 hover:text-signal">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal delay={0.1} className="col-span-12 lg:col-span-7">
            <ContactForm formRef={formRef} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
