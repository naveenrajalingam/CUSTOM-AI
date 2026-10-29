import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { contact, contactHref, site } from '../content'
import { setScrollLocked } from '../lib/scroll'

// "Let's talk": the contact form in a window over the page, opened by any
// "Let's talk" link. There is no server, so sending checks the form and opens
// the visitor's own email app with the message filled in.

const { fields } = contact

const INPUT =
  'w-full rounded-xl bg-ink/55 px-4 py-3.5 text-[1rem] text-paper ring-1 ring-[var(--line-strong)] transition-[box-shadow,background-color] duration-300 ease-[var(--ease-glide)] placeholder:text-haze/80 hover:ring-paper/30 focus:bg-ink/80 focus:ring-2 focus:ring-cyan focus:outline-none aria-invalid:ring-orange'

type Key = 'name' | 'email' | 'message'
const required: { key: Key; error: string }[] = [
  { key: 'name', error: fields.nameError },
  { key: 'email', error: fields.emailError },
  { key: 'message', error: fields.messageError },
]
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-paper">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-orange">
            *
          </span>
        )}
      </label>
      <div className="mt-2.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[0.875rem] text-orange">
          {error}
        </p>
      )}
    </div>
  )
}

/** One line per field, so the email reads cleanly in any mail app. */
function compose(data: FormData) {
  const get = (k: string) => String(data.get(k) ?? '').trim()
  const subject = `[Applied AI] ${get('topic')} — ${get('name')}`
  const body = [`${fields.name}: ${get('name')}`, `${fields.email}: ${get('email')}`, `${fields.topic} ${get('topic')}`, '', get('message')].join('\n')
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function Contact() {
  const ref = useRef<HTMLDialogElement>(null)
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const [feedback, setFeedback] = useState<'invalid' | 'sent' | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const found: Partial<Record<Key, string>> = {}
    for (const { key, error } of required) {
      const v = String(data.get(key) ?? '').trim()
      if (!v || (key === 'email' && !EMAIL.test(v))) found[key] = error
    }
    setErrors(found)
    const first = required.find(({ key }) => found[key])
    if (first) {
      setFeedback('invalid')
      form.querySelector<HTMLElement>(`#contact-${first.key}`)?.focus()
      return
    }
    window.location.href = compose(data)
    setFeedback('sent')
  }

  // typing into a field clears its error
  const clear = (key: Key) => () => setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  const invalid = (key: Key) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `contact-${key}-error` : undefined,
    onInput: clear(key),
  })

  // open from any "Let's talk" link (and when the page is opened at #lets-talk); the page holds still behind it
  useEffect(() => {
    const dialog = ref.current!
    const open = () => {
      if (dialog.open) return
      dialog.showModal()
      setScrollLocked(true)
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.(`a[href="${contactHref}"]`)
      if (!a) return
      e.preventDefault()
      open()
    }
    const onClose = () => setScrollLocked(false)
    document.addEventListener('click', onClick, true)
    dialog.addEventListener('close', onClose)
    if (window.location.hash === contactHref) open()
    return () => {
      document.removeEventListener('click', onClick, true)
      dialog.removeEventListener('close', onClose)
    }
  }, [])

  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      id={contact.id}
      aria-labelledby="contact-title"
      data-lenis-prevent
      // a click on the dimmed backdrop (the dialog element itself) closes it
      onClick={(e) => e.target === e.currentTarget && close()}
      className="contact-dialog m-auto max-h-[92svh] w-[min(68rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl bg-deep p-0 text-paper ring-1 ring-[var(--line-strong)] backdrop:bg-ink/75 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-7 md:p-10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(238_242_248/0.25),transparent)]"
        />
        <button
          type="button"
          onClick={close}
          aria-label={contact.close}
          className="cut-sm absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center bg-paper/[0.06] text-mist transition-colors hover:bg-paper/10 hover:text-paper"
        >
          <svg viewBox="0 0 14 14" aria-hidden="true" className="h-3.5 w-3.5">
            <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <h2 id="contact-title" className="display pr-12 text-[clamp(1.85rem,3vw,2.75rem)] text-paper">
          {contact.title}
        </h2>
        <p className="mt-3 max-w-[40rem] text-[1.0625rem] text-mist">{contact.lede}</p>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <form
              noValidate
              onSubmit={onSubmit}
              className="relative"
            >
              {/* a soft light along the top edge of the glass */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(238_242_248/0.25),transparent)]"
              />
              <div className="grid gap-6 md:grid-cols-2 md:gap-x-7">
                <Field id="contact-name" label={fields.name} required error={errors.name}>
                  <input id="contact-name" name="name" required autoComplete="name" placeholder={fields.namePlaceholder} className={INPUT} {...invalid('name')} />
                </Field>
                <Field id="contact-email" label={fields.email} required error={errors.email}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={fields.emailPlaceholder}
                    className={INPUT}
                    {...invalid('email')}
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field id="contact-topic" label={fields.topic} required>
                    <div className="relative">
                      <select
                        id="contact-topic"
                        name="topic"
                        required
                        defaultValue={contact.topics[0].value}
                        className={`${INPUT} appearance-none pr-12 [&>option]:bg-deep [&>option]:text-paper`}
                      >
                        {contact.topics.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <svg
                        viewBox="0 0 12 8"
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-5 h-2 w-3 -translate-y-1/2 text-mist"
                      >
                        <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </div>
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field id="contact-message" label={fields.message} required error={errors.message}>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      placeholder={fields.messagePlaceholder}
                      className={`${INPUT} min-h-[9rem] resize-y`}
                      {...invalid('message')}
                    />
                  </Field>
                </div>
              </div>

              <label className="mt-7 flex cursor-pointer items-start gap-3.5 text-[0.9375rem] text-mist">
                <input type="checkbox" name="consent" defaultChecked className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-cyan" />
                <span>
                  {contact.consent}
                  {/* only once there is a privacy page to point to */}
                  {site.privacyUrl && (
                    <>
                      {' '}
                      {contact.privacyLead}{' '}
                      <a href={site.privacyUrl} className="font-semibold text-paper underline underline-offset-4 hover:text-cyan">
                        {contact.privacyLabel}
                      </a>
                      .
                    </>
                  )}
                </span>
              </label>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  className="cut inline-flex cursor-pointer items-center justify-center bg-paper px-7 py-3.5 text-[0.9375rem] font-semibold text-ink transition-colors duration-300 hover:bg-white"
                >
                  {contact.submit}
                </button>
              </div>
              <p role="status" className={`mt-5 text-[0.9375rem] empty:hidden ${feedback === 'invalid' ? 'text-orange' : 'text-mist'}`}>
                {feedback === 'invalid' && contact.invalid}
                {feedback === 'sent' && (
                  <>
                    {contact.sent}{' '}
                    <a href={`mailto:${site.contactEmail}`} className="text-paper underline underline-offset-4 hover:text-cyan">
                      {site.contactEmail}
                    </a>
                    .
                  </>
                )}
              </p>
            </form>
          </div>
          <div className="lg:col-span-4">
            <div className="border-t border-[var(--line-strong)] pt-6">
              <p className="text-[0.9375rem] text-haze">{contact.emailTitle}</p>
              <a
                href={`mailto:${site.contactEmail}`}
                className="mt-3 inline-block text-[1.25rem] font-semibold tracking-tight break-all text-paper transition-colors duration-300 hover:text-cyan"
              >
                {site.contactEmail}
              </a>
            </div>
            <div className="mt-8 border-t border-[var(--line-strong)] pt-6">
              <p className="text-[0.9375rem] text-haze">{contact.locationsTitle}</p>
              <p className="mt-3 text-[1.1875rem] text-paper md:text-[1.25rem]">{contact.locations.join(' · ')}</p>
            </div>
            <p className="mt-8 rounded-2xl bg-deep/70 p-6 text-[1rem] text-mist ring-1 ring-[var(--line)]">
              {contact.partner.before} <strong className="font-semibold text-paper">{contact.partner.strong}</strong> {contact.partner.after}
            </p>

          </div>
        </div>
      </div>
    </dialog>
  )
}
