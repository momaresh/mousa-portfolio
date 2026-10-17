'use client'

import { useLocale } from '@/lib/i18n/locale-provider'
import { localize } from '@/lib/i18n/localize'
import type { Integration } from '@/lib/portfolio/types'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Integrations({ integrations }: { integrations: Integration[] }) {
  const { t, locale } = useLocale()
  if (!integrations.length) return null

  return (
    <section className="section border-t border-line">
      <div className="container-site">
        <SectionHeading eyebrow={t.integrations.eyebrow} title={t.integrations.title} />
        <div className="columns-1 gap-x-12 sm:columns-2">
          {integrations.map((item) => (
            <div key={item.id} className="mb-8 break-inside-avoid border-t border-line pt-4">
              <h4 className="text-sm font-medium text-ink">
                {localize(locale, item.name, item.nameAr)}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {localize(locale, item.description, item.descriptionAr)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
