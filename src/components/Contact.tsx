import { useState, type FormEvent, type ReactNode } from 'react'
import { contact, footer, site } from '../content'
import { Emerge } from './Emerge'
import { Logo } from './Logo'

// The page's last stop: the "Let's talk" form in the site's glass, the address
// to write to directly, and the footer. There is no server, so sending checks
// the form and opens the visitor's own email app with the message filled in.

const YEAR = new Date().getFullYear()
const { fields } = contact

const INPUT =
  'w-full rounded-xl bg-ink/55 px-4 py-3.5 text-[1rem] text-paper ring-1 ring-[var(--line-strong)] transition-[box-shadow,background-color] duration-300 ease-[var(--ease-glide)] placeholder:text-haze/80 hover:ring-paper/30 focus:bg-ink/80 focus:ring-2 focus:ring-signal focus:outline-none aria-invalid:ring-orange'

type Key = 'name' | 'email' | 'company' | 'message'
const required: { key: Key; error: string }[] = [
  { key: 'name', error: fields.nameError },
  { key: 'email', error: fields.emailError },
  { key: 'company', error: fields.companyError },
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
  const subject = `[Applied AI] ${get('topic')} — ${get('company')}`
  const body = [
    `${fields.name}: ${get('name')}`,
    `${fields.email}: ${get('email')}`,
    `${fields.company}: ${get('company')}`,
    get('role') ? `${fields.role}: ${get('role')}` : null,
    `${fields.topic} ${get('topic')}`,
    '',
    get('message'),
  ]
    .filter((line) => line !== null)
    .join('\n')
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function Contact() {
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

  return (
    <section id={contact.id} aria-labelledby="contact-title" className="relative px-6 pt-24 md:px-10 md:pt-32">
      <div className="mx-auto max-w-[1320px]">
        <Emerge className="over-field">
          <h2 id="contact-title" className="display text-[clamp(3.5rem,9vw,8rem)] leading-[0.95] text-paper">
            {contact.title}
          </h2>
          <p className="measure mt-6 text-[1.125rem] text-mist md:mt-8 md:text-[1.25rem]">{contact.lede}</p>
        </Emerge>

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
          <Emerge className="lg:col-span-7">
            <form
              noValidate
              onSubmit={onSubmit}
              className="relative overflow-hidden rounded-3xl bg-deep/55 p-7 ring-1 ring-[var(--line)] backdrop-blur-xl md:p-10"
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
                <Field id="contact-company" label={fields.company} required error={errors.company}>
                  <input
                    id="contact-company"
                    name="company"
                    required
                    autoComplete="organization"
                    placeholder={fields.companyPlaceholder}
                    className={INPUT}
                    {...invalid('company')}
                  />
                </Field>
                <Field id="contact-role" label={fields.role}>
                  <input id="contact-role" name="role" autoComplete="organization-title" placeholder={fields.rolePlaceholder} className={INPUT} />
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
                      rows={5}
                      placeholder={fields.messagePlaceholder}
                      className={`${INPUT} min-h-[9rem] resize-y`}
                      {...invalid('message')}
                    />
                  </Field>
                </div>
              </div>

              <label className="mt-7 flex cursor-pointer items-start gap-3.5 text-[0.9375rem] text-mist">
                <input type="checkbox" name="consent" defaultChecked className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-signal" />
                <span>
                  {contact.consent}{' '}
                  <a href={site.privacyUrl} className="font-semibold text-paper underline underline-offset-4 hover:text-signal">
                    {contact.privacyLabel}
                  </a>
                  .
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
                    <a href={`mailto:${site.contactEmail}`} className="text-paper underline underline-offset-4 hover:text-signal">
                      {site.contactEmail}
                    </a>
                    .
                  </>
                )}
              </p>
            </form>
          </Emerge>

          <Emerge className="over-field lg:col-span-5">
            <div className="border-t border-[var(--line-strong)] pt-6">
              <p className="text-[0.9375rem] text-haze">{contact.emailTitle}</p>
              <a
                href={`mailto:${site.contactEmail}`}
                className="mt-3 inline-block text-[clamp(1.75rem,2.8vw,2.5rem)] font-semibold tracking-tight break-all text-paper transition-colors duration-300 hover:text-signal"
              >
                {site.contactEmail}
              </a>
            </div>
            <div className="mt-10 border-t border-[var(--line-strong)] pt-6">
              <p className="text-[0.9375rem] text-haze">{contact.locationsTitle}</p>
              <p className="mt-3 text-[1.1875rem] text-paper md:text-[1.25rem]">{contact.locations.join(' · ')}</p>
            </div>
            <p className="mt-10 rounded-2xl bg-deep/45 p-6 text-[1rem] text-mist ring-1 ring-[var(--line)] backdrop-blur-md">
              {contact.partner.before} <strong className="font-semibold text-paper">{contact.partner.strong}</strong> {contact.partner.after}
            </p>
          </Emerge>
        </div>
      </div>

      <footer id={footer.id} className="relative mt-24 pt-6 pb-6 md:mt-32 md:pb-8">
        <div className="relative flex flex-col gap-6 border-t border-[var(--line)] pt-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo label="Applied AI" />
            <p className="mt-4 text-[0.75rem] tracking-[0.1em] text-haze">{footer.note}</p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.875rem]">
              {footer.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="nav-link text-mist hover:text-paper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[0.75rem] text-haze">
              © {YEAR} {footer.brand}
            </p>
          </div>
        </div>
      </footer>
    </section>
  )
}
