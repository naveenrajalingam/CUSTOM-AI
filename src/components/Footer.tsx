import { contact, footer, site } from '../content'
import { Logo } from './Logo'

// The foot of the page: who we are and how to reach us, the products, the company, and the offices.

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <div className="px-6 md:px-10">
      <div className="mx-auto max-w-[1320px]">
        <footer id={footer.id} className="relative mt-16 pt-6 pb-8 md:mt-24">
          <div className="grid gap-10 border-t border-[var(--line)] pt-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Logo label="Applied AI" />
              <p className="mt-4 max-w-[34ch] text-[0.9375rem] text-mist">{footer.blurb}</p>
              <a href={`mailto:${site.contactEmail}`} className="mt-4 inline-block text-[0.9375rem] font-semibold text-paper hover:text-cyan">
                {site.contactEmail}
              </a>
            </div>
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="md:col-span-2">
                <p className="text-[0.75rem] tracking-[0.12em] text-haze uppercase">{col.title}</p>
                <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="text-mist transition-colors hover:text-paper"
                      >
                        {l.label}
                        {l.external && <span aria-hidden="true"> ↗</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="md:col-span-3">
              <p className="text-[0.75rem] tracking-[0.12em] text-haze uppercase">{footer.officesTitle}</p>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-mist">
                {contact.locations.map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-[var(--line)] pt-6 text-[0.75rem] text-haze md:flex-row md:items-center md:justify-between">
            <p>
              © {YEAR} {footer.company}. All rights reserved.
            </p>
            <p className="tracking-[0.1em]">{footer.note}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
