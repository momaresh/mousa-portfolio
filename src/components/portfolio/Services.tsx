'use client'

import { useLocale } from '@/lib/i18n/locale-provider'
import { localize } from '@/lib/i18n/localize'
import type { Service } from '@/lib/portfolio/types'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

function parseFeatures(raw: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(raw || '[]') as unknown
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function Services({ services }: { services: Service[] }) {
  const { t, locale } = useLocale()

  return (
    <section id="services" className="section border-t border-line">
      <div className="container-site">
        <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} />
        <div className="grid gap-0 border-t border-line md:grid-cols-2">
          {services.map((service, i) => {
            const featuresEn = parseFeatures(service.features)
            const featuresAr = parseFeatures(service.featuresAr)
            const features =
              locale === 'ar' && featuresAr.length > 0 ? featuresAr : featuresEn
            const isStartCol = i % 2 === 0

            return (
              <Reveal key={service.id} delay={Math.min(i * 0.04, 0.2)}>
                <article
                  className={`border-b border-line py-6 md:py-8 ${
                    isStartCol ? 'md:border-e md:pe-8' : 'md:ps-8'
                  }`}
                >
                  <p className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display mt-3 text-2xl text-ink">
                    {localize(locale, service.title, service.titleAr)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {localize(locale, service.description, service.descriptionAr)}
                  </p>
                  <ul className="mt-5 space-y-1.5">
                    {features.slice(0, 4).map((feature) => (
                      <li key={feature} className="text-sm text-ink-soft">
                        — {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
