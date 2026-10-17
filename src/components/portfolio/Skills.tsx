'use client'

import { useLocale } from '@/lib/i18n/locale-provider'
import { localize } from '@/lib/i18n/localize'
import type { Skill } from '@/lib/portfolio/types'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Skills({ skills }: { skills: Skill[] }) {
  const { t, locale } = useLocale()

  const byCategory = skills.reduce<Record<string, { label: string; items: Skill[] }>>(
    (acc, skill) => {
      const key = skill.category
      const label = localize(locale, skill.category, skill.categoryAr)
      const group = acc[key] ?? { label, items: [] }
      group.label = label
      group.items.push(skill)
      acc[key] = group
      return acc
    },
    {},
  )

  return (
    <section id="skills" className="section border-t border-line">
      <div className="container-site">
        <SectionHeading eyebrow={t.skills.eyebrow} title={t.skills.title} />
        <div className="space-y-10">
          {Object.entries(byCategory).map(([key, group], i) => (
            <Reveal key={key} delay={i * 0.05}>
              <div className="grid gap-3 border-t border-line pt-6 md:grid-cols-[14rem_1fr]">
                <h3 className="text-sm font-medium text-muted">{group.label}</h3>
                <p className="text-[15px] leading-8 text-ink-soft">
                  {group.items
                    .map((skill) => localize(locale, skill.name, skill.nameAr))
                    .join('  ·  ')}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
