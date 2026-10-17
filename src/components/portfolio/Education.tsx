'use client'

import { useLocale } from '@/lib/i18n/locale-provider'
import { localize } from '@/lib/i18n/localize'
import type { Education as EducationType } from '@/lib/portfolio/types'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Education({ educations }: { educations: EducationType[] }) {
  const { t, locale } = useLocale()

  if (!educations.length) {
    return null
  }

  return (
    <section id="education" className="section border-t border-line">
      <div className="container-site">
        <SectionHeading eyebrow={t.education.eyebrow} title={t.education.title} />

        <div className="divide-y divide-line border-y border-line">
          {educations.map((edu, index) => {
            const description = localize(locale, edu.description || '', edu.descriptionAr)
            return (
              <Reveal key={edu.id} delay={Math.min(index * 0.04, 0.2)}>
                <article className="grid gap-4 py-8 md:grid-cols-[8rem_1fr] md:gap-12 md:py-10">
                  <div className="text-sm text-muted">
                    <div>{edu.startDate.slice(0, 4)}</div>
                    <div className="mt-1 text-xs">
                      {edu.endDate ? edu.endDate.slice(0, 4) : t.experience.present}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-ink md:text-[1.75rem]">
                      {localize(locale, edu.degree, edu.degreeAr)}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {localize(locale, edu.institution, edu.institutionAr)}
                    </p>
                    {edu.location && (
                      <p className="mt-2 text-xs uppercase tracking-wider text-muted">
                        {edu.location}
                      </p>
                    )}
                    {description && (
                      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-[15px]">
                        {description}
                      </p>
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
