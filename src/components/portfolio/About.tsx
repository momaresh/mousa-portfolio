'use client'

import { useLocale } from '@/lib/i18n/locale-provider'
import { localize } from '@/lib/i18n/localize'
import type { Profile } from '@/lib/portfolio/types'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function About({ profile }: { profile: Profile | null }) {
  const { t, locale } = useLocale()
  const bio = localize(locale, profile?.bio || '', profile?.bioAr)
  const location = localize(locale, profile?.location || '—', profile?.locationAr)

  return (
    <section id="about" className="section border-t border-line">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} className="mb-0" />
          </div>
          <Reveal className="md:col-span-8">
            <p className="text-lg leading-relaxed text-ink-soft md:text-xl md:leading-[1.7]">{bio}</p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
              <div>
                <div className="font-display text-3xl text-ink">{profile?.yearsOfExp || 7}+</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted">
                  {t.about.experience}
                </div>
              </div>
              <div>
                <div className="font-display text-3xl text-ink">{profile?.projectsCount || 6}+</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted">
                  {t.about.projects}
                </div>
              </div>
              <div>
                <div className="font-display text-xl leading-snug text-ink md:text-2xl">{location}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted">
                  {locale === 'ar' ? 'الموقع' : 'Location'}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
