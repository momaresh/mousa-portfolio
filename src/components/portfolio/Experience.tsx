'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n/locale-provider'
import { localize } from '@/lib/i18n/localize'
import type { Experience as ExperienceType } from '@/lib/portfolio/types'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'

export function Experience({ experiences }: { experiences: ExperienceType[] }) {
  const { t, locale } = useLocale()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section id="experience" className="section border-t border-line">
      <div className="container-site">
        <SectionHeading eyebrow={t.experience.eyebrow} title={t.experience.title} />

        <div className="divide-y divide-line border-y border-line">
          {experiences.map((exp, index) => {
            const description = localize(locale, exp.description, exp.descriptionAr)
            const company = localize(locale, exp.company, exp.companyAr)
            const isOpen = expanded === exp.id
            const long = description.length > 280

            return (
              <Reveal key={exp.id} delay={Math.min(index * 0.04, 0.2)}>
                <article className="grid gap-4 py-8 md:grid-cols-[8rem_1fr] md:gap-12 md:py-10">
                  <div className="text-sm text-muted">
                    <div>{exp.startDate.slice(0, 4)}</div>
                    <div className="mt-1 text-xs">
                      {exp.endDate ? exp.endDate.slice(0, 4) : t.experience.present}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-start gap-4">
                      {exp.logoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={exp.logoUrl}
                          alt={company}
                          className="h-10 w-10 object-contain opacity-90"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-2xl text-ink md:text-[1.75rem]">
                          {localize(locale, exp.position, exp.positionAr)}
                        </h3>
                        {exp.websiteUrl ? (
                          <a
                            href={exp.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-sm text-muted link-underline"
                          >
                            {company}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-muted">{company}</p>
                        )}
                        {exp.isCurrent && (
                          <p className="mt-2 text-xs uppercase tracking-wider text-muted">
                            {t.experience.current}
                          </p>
                        )}
                      </div>
                    </div>

                    <p
                      className={cn(
                        'mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-[15px]',
                        long && !isOpen && 'line-clamp-4',
                      )}
                    >
                      {description}
                    </p>
                    {long && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : exp.id)}
                        className="mt-3 text-sm text-muted link-underline"
                      >
                        {isOpen ? t.experience.showLess : t.experience.readMore}
                      </button>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
