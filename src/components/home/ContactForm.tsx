import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, Copy, Send } from 'lucide-react'
import { useId, useRef, useState, type FormEvent } from 'react'
import { contactEmail, hasEmail, hasFormEndpoint, site } from '@/config/site'
import { contactCopy } from '@/data/content'
import { copyText } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

interface Values {
  name: string
  email: string
  type: string
  budget: string
  details: string
}
type Errors = Partial<Record<keyof Values, string>>

const EMPTY: Values = { name: '', email: '', type: '', budget: '', details: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: Values): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address, e.g. name@company.com.'
  if (!v.type) e.type = 'Choose the type of project.'
  if (!v.budget) e.budget = 'Choose a budget range — “Not sure yet” is fine.'
  if (v.details.trim().length < 20) e.details = 'Tell me a little more — at least 20 characters.'
  return e
}

function composeMessage(v: Values) {
  return [
    `Hi,`,
    ``,
    v.details.trim(),
    ``,
    `— Project type: ${v.type}`,
    `— Budget range: ${v.budget}`,
    `— Name: ${v.name.trim()}`,
    `— Reply to: ${v.email.trim()}`,
  ].join('\n')
}

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error' | 'unconfigured'

export function ContactForm({ formRef }: { formRef?: React.RefObject<HTMLFormElement | null> }) {
  const uid = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')
  const summaryRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    const next = { ...values, [k]: val }
    setValues(next)
    if (touched[k]) setErrors(validate(next))
  }
  const blur = (k: keyof Values) => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(values))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ name: true, email: true, type: true, budget: true, details: true })
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }

    if (hasFormEndpoint) {
      setStatus('sending')
      setServerError('')
      try {
        const res = await fetch(site.contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...values, message: composeMessage(values) }),
        })
        if (!res.ok) throw new Error(`Server responded with ${res.status}`)
        setStatus('sent')
        setValues(EMPTY)
        setTouched({})
      } catch (err) {
        setServerError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('error')
      }
      return
    }

    if (hasEmail) {
      const subject = encodeURIComponent(`New project inquiry — ${values.type}`)
      const body = encodeURIComponent(composeMessage(values))
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
      setStatus('mailto')
      return
    }

    if (import.meta.env.DEV) console.warn('[contact] Add contact.email or contact.formEndpoint in src/config/site.ts')
    setStatus('unconfigured')
  }

  const fieldError = (k: keyof Values) => (touched[k] ? errors[k] : undefined)
  const errorCount = Object.keys(errors).filter((k) => touched[k as keyof Values]).length

  const inputCls = (k: keyof Values) =>
    cn(
      'w-full rounded-[3px] border bg-graphite px-4 py-3.5 text-[16px] text-ivory placeholder:text-muted/70 transition-colors focus:outline-none focus-visible:outline-none',
      fieldError(k) ? 'border-signal' : 'border-ivory/15 hover:border-ivory/30 focus:border-ivory/60',
    )

  if (status === 'sent' || status === 'mailto') {
    return (
      <div className="rounded-[6px] border border-ivory/12 bg-graphite-700 p-8 md:p-10" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-lime text-graphite">
          <Check size={22} />
        </span>
        <h3 className="mt-6 font-display text-3xl font-medium uppercase tracking-[-0.03em]">
          {status === 'sent' ? 'Message sent' : 'Your email is ready'}
        </h3>
        <p className="mt-3 max-w-md text-ivory/75">
          {status === 'sent'
            ? 'Thanks — your project details were delivered. You will get a reply at the address you provided.'
            : `Your email app should have opened with the message pre-filled — just press send. If nothing opened, copy the message and send it to ${contactEmail}.`}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {status === 'mailto' && (
            <button
              type="button"
              onClick={async () => toast((await copyText(composeMessage(values))) ? 'Message copied' : 'Copy failed — select the text manually')}
              className="inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-ivory/25 px-4 label-mono hover:border-ivory"
            >
              <Copy size={15} /> Copy message
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setStatus('idle')
              if (status === 'sent') setValues(EMPTY)
            }}
            className="inline-flex min-h-11 items-center rounded-[3px] px-4 label-mono text-muted hover:text-ivory"
          >
            {status === 'sent' ? 'Send another' : 'Back to the form'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${uid}-note`} className="rounded-[6px] border border-ivory/12 bg-graphite-700 p-6 md:p-10">
      <AnimatePresence>
        {errorCount > 0 && status === 'idle' && Object.keys(touched).length >= 5 && (
          <motion.div
            ref={summaryRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p role="alert" className="mb-6 flex items-center gap-2 rounded-[3px] border border-signal/40 bg-signal/10 px-4 py-3 text-[15px] text-ivory">
              <AlertCircle size={17} className="text-signal" />
              Please check {errorCount === 1 ? '1 field' : `${errorCount} fields`} below.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 md:grid-cols-2">
        <Field id={`${uid}-name`} label="Name" error={fieldError('name')}>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => blur('name')}
            aria-invalid={!!fieldError('name')}
            aria-describedby={fieldError('name') ? `${uid}-name-err` : undefined}
            placeholder="Jane Cooper"
            className={inputCls('name')}
          />
        </Field>
        <Field id={`${uid}-email`} label="Email" error={fieldError('email')}>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={() => blur('email')}
            aria-invalid={!!fieldError('email')}
            aria-describedby={fieldError('email') ? `${uid}-email-err` : undefined}
            placeholder="jane@company.com"
            className={inputCls('email')}
          />
        </Field>
      </div>

      <ChipGroup
        id={`${uid}-type`}
        label="Project type"
        options={contactCopy.projectTypes}
        value={values.type}
        onChange={(v) => {
          set('type', v)
          setTouched((t) => ({ ...t, type: true }))
        }}
        error={fieldError('type')}
      />
      <ChipGroup
        id={`${uid}-budget`}
        label="Budget range (USD)"
        options={contactCopy.budgets}
        value={values.budget}
        onChange={(v) => {
          set('budget', v)
          setTouched((t) => ({ ...t, budget: true }))
        }}
        error={fieldError('budget')}
      />

      <div className="mt-6">
        <Field id={`${uid}-details`} label="Project details" error={fieldError('details')} hint={`${values.details.trim().length} / 20+ characters`}>
          <textarea
            id={`${uid}-details`}
            name="details"
            rows={5}
            value={values.details}
            onChange={(e) => set('details', e.target.value)}
            onBlur={() => blur('details')}
            aria-invalid={!!fieldError('details')}
            aria-describedby={fieldError('details') ? `${uid}-details-err` : undefined}
            placeholder="What are you building, who is it for, and when would you like to launch?"
            className={cn(inputCls('details'), 'resize-y')}
          />
        </Field>
      </div>

      {status === 'error' && (
        <p role="alert" className="mt-6 flex items-start gap-2 rounded-[3px] border border-signal/40 bg-signal/10 px-4 py-3 text-[15px]">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-signal" />
          <span>
            The message could not be sent ({serverError}).{' '}
            {hasEmail ? (
              <>
                Please try again, or email <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a> directly.
              </>
            ) : (
              'Please try again in a moment.'
            )}
          </span>
        </p>
      )}
      {status === 'unconfigured' && (
        <p role="alert" className="mt-6 flex items-start gap-2 rounded-[3px] border border-ivory/20 bg-ivory/5 px-4 py-3 text-[15px]">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-muted" />
          Contact details for this site are being set up. Please check back soon.
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${uid}-note`} className="max-w-xs text-[13px] leading-snug text-muted">
          {hasFormEndpoint
            ? 'Your message is sent securely to my inbox.'
            : 'No data is stored on this site — sending opens your email app with a pre-filled message.'}
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-[3px] bg-signal px-6 label-mono !text-[13px] font-medium text-graphite transition-opacity disabled:opacity-60"
        >
          <span className="absolute inset-0 origin-left scale-x-0 bg-ivory transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
          <span className="relative">{status === 'sending' ? 'Sending…' : 'Send inquiry'}</span>
          <Send size={15} className="relative transition-transform duration-500 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  )
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="label-mono text-ivory/80">
          {label} <span className="text-signal" aria-hidden>*</span>
        </label>
        {hint && <span className="font-mono text-[11px] text-muted">{hint}</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 flex items-center gap-1.5 text-[14px] text-[#FF8A6E]"
          >
            <AlertCircle size={14} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChipGroup({ id, label, options, value, onChange, error }: { id: string; label: string; options: string[]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset className="mt-6" aria-describedby={error ? `${id}-err` : undefined} aria-invalid={!!error}>
      <legend className="mb-3 label-mono text-ivory/80">
        {label} <span className="text-signal" aria-hidden>*</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => {
          const checked = value === o
          return (
            <label
              key={o}
              className={cn(
                'relative inline-flex min-h-11 cursor-pointer items-center rounded-[3px] border px-4 text-[15px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal',
                checked ? 'border-ivory bg-ivory text-graphite' : error ? 'border-signal/60 hover:border-ivory/50' : 'border-ivory/15 hover:border-ivory/50',
              )}
            >
              <input
                id={i === 0 ? id : undefined}
                type="radio"
                name={id}
                value={o}
                checked={checked}
                onChange={() => onChange(o)}
                className="sr-only"
              />
              {o}
            </label>
          )
        })}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 flex items-center gap-1.5 text-[14px] text-[#FF8A6E]">
            <AlertCircle size={14} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </fieldset>
  )
}
