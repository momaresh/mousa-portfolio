'use client'

import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Printer, ArrowLeft, Download } from 'lucide-react'
import { useLocale } from '@/lib/i18n/locale-provider'
import { localize } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/dictionaries'
import './cv.css'

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  profile: any
  skills: any[]
  experiences: any[]
  educations?: any[]
  services: any[]
  stats: any[]
  atsMode?: boolean
}

function parseFeatures(raw: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(raw || '[]') as unknown
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function cvLabels(locale: Locale) {
  const ar = locale === 'ar'
  return {
    back: ar ? 'رجوع' : 'Back',
    download: ar ? 'تحميل PDF' : 'Download PDF',
    print: ar ? 'طباعة' : 'Print',
    contact: ar ? 'التواصل' : 'Contact',
    skills: ar ? 'المهارات' : 'Skills',
    atAGlance: ar ? 'لمحة سريعة' : 'At a Glance',
    languages: ar ? 'اللغات' : 'Languages',
    summary: ar ? 'الهدف الوظيفي' : 'Professional Summary',
    experience: ar ? 'الخبرة العملية' : 'Professional Experience',
    education: ar ? 'المؤهلات الدراسية' : 'Education',
    services: ar ? 'الخدمات' : 'Areas of Expertise',
    present: ar ? 'حتى الآن' : 'Present',
    arabicNative: ar ? 'العربية (لغة أم)' : 'Arabic (Native)',
    englishPro: ar ? 'الإنجليزية (مستوى مهني)' : 'English (Professional)',
    generated: ar ? 'أُنشئ ديناميكياً' : 'Generated dynamically',
    modern: ar ? 'حديث' : 'Modern',
    ats: 'ATS',
  }
}

export default function CVDocument({
  profile,
  skills,
  experiences,
  educations = [],
  services,
  stats,
  atsMode = false,
}: Props) {
  const { locale } = useLocale()
  const labels = cvLabels(locale)

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const toggleMode = useCallback(() => {
    const url = new URL(window.location.href)
    if (atsMode) {
      url.searchParams.delete('ats')
    } else {
      url.searchParams.set('ats', '1')
    }
    window.location.href = url.toString()
  }, [atsMode])

  const skillsByCategory = useMemo(() => {
    return skills.reduce<Record<string, { label: string; items: any[] }>>((acc, skill) => {
      const key = skill.category
      const label = localize(locale, skill.category, skill.categoryAr)
      const group = acc[key] ?? { label, items: [] }
      group.label = label
      group.items.push(skill)
      acc[key] = group
      return acc
    }, {})
  }, [skills, locale])

  const initials = (profile.name || 'M')
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const displayName = localize(locale, profile.name, profile.nameAr)
  const displayTitle = localize(locale, profile.title, profile.titleAr)
  const displayBio = localize(locale, profile.bio, profile.bioAr)
  const displayLocation = localize(locale, profile.location, profile.locationAr)

  const renderServices = services.slice(0, 6).map((s) => {
    const featuresEn = parseFeatures(s.features)
    const featuresAr = parseFeatures(s.featuresAr)
    const features = locale === 'ar' && featuresAr.length > 0 ? featuresAr : featuresEn
    return {
      id: s.id,
      title: localize(locale, s.title, s.titleAr),
      firstFeature: features[0] || '',
    }
  })

  const cleanLink = (url?: string | null) => {
    if (!url) return ''
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
  }

  const dateLocale = locale === 'ar' ? 'ar-YE' : 'en-GB'

  return (
    <div className={`cv-shell ${atsMode ? 'ats-mode' : ''}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="cv-toolbar">
        <div className="cv-toolbar-title">
          CV — {displayName} {atsMode && <span className="cv-mode-pill">ATS Mode</span>}
        </div>
        <div className="cv-toolbar-actions">
          <Link href="/" className="cv-btn cv-btn-ghost">
            <ArrowLeft size={16} />
            {labels.back}
          </Link>
          <button
            onClick={toggleMode}
            className="cv-btn cv-btn-ghost"
            type="button"
            title={atsMode ? 'Modern layout' : 'ATS layout'}
          >
            {atsMode ? `🎨 ${labels.modern}` : `📄 ${labels.ats}`}
          </button>
          <button onClick={handlePrint} className="cv-btn cv-btn-primary" type="button">
            <Download size={16} />
            {labels.download}
          </button>
          <button onClick={handlePrint} className="cv-btn cv-btn-ghost" type="button">
            <Printer size={16} />
            {labels.print}
          </button>
        </div>
      </div>

      <article className="cv-document" id="cv-document">
        {atsMode ? (
          <main className="cv-main">
            <header className="cv-ats-header">
              <h1 className="cv-ats-name">{displayName}</h1>
              <p className="cv-ats-title">{displayTitle}</p>
              <div className="cv-ats-contact">
                {profile.email && <span>{profile.email}</span>}
                {profile.phone && <span>{profile.phone}</span>}
                {displayLocation && <span>{displayLocation}</span>}
                {profile.linkedin && <span>{cleanLink(profile.linkedin)}</span>}
              </div>
            </header>

            {displayBio && (
              <section className="cv-section">
                <h2 className="cv-section-title">{labels.summary}</h2>
                <p className="cv-summary">{displayBio}</p>
              </section>
            )}

            {Object.keys(skillsByCategory).length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">{labels.skills}</h2>
                <div className="cv-ats-skills-block">
                  {Object.entries(skillsByCategory).map(([key, group]) => (
                    <div key={key}>
                      <strong>{group.label}:</strong>{' '}
                      {group.items
                        .map((s: any) => localize(locale, s.name, s.nameAr))
                        .join(locale === 'ar' ? ' · ' : ', ')}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {experiences.length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">{labels.experience}</h2>
                {experiences.map((exp) => (
                  <div className="cv-item" key={exp.id}>
                    <div className="cv-item-header">
                      <h3 className="cv-item-title">
                        {localize(locale, exp.position, exp.positionAr)} —{' '}
                        {localize(locale, exp.company, exp.companyAr)}
                      </h3>
                      <span className="cv-item-date">
                        {exp.startDate} — {exp.endDate || labels.present}
                      </span>
                    </div>
                    {exp.location && <p className="cv-item-subtitle">{exp.location}</p>}
                    <p className="cv-item-body">
                      {localize(locale, exp.description, exp.descriptionAr)}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {educations.length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">{labels.education}</h2>
                {educations.map((edu) => (
                  <div className="cv-item" key={edu.id}>
                    <div className="cv-item-header">
                      <h3 className="cv-item-title">
                        {localize(locale, edu.degree, edu.degreeAr)}
                      </h3>
                      <span className="cv-item-date">
                        {edu.startDate} — {edu.endDate || labels.present}
                      </span>
                    </div>
                    <p className="cv-item-subtitle">
                      {localize(locale, edu.institution, edu.institutionAr)}
                    </p>
                    {localize(locale, edu.description, edu.descriptionAr) && (
                      <p className="cv-item-body">
                        {localize(locale, edu.description, edu.descriptionAr)}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {renderServices.length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">{labels.services}</h2>
                {renderServices.map((s) => (
                  <div className="cv-service" key={s.id}>
                    <strong>{s.title}</strong>
                    {s.firstFeature ? ` — ${s.firstFeature}` : ''}
                  </div>
                ))}
              </section>
            )}

            <section className="cv-section">
              <h2 className="cv-section-title">{labels.languages}</h2>
              <p className="cv-item-body">
                {labels.arabicNative}, {labels.englishPro}
              </p>
            </section>
          </main>
        ) : (
          <>
            <aside className="cv-sidebar">
              <div className="cv-avatar">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={displayName} />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <h1 className="cv-name">{displayName}</h1>
              <p className="cv-job">{displayTitle}</p>

              <section className="cv-side-section">
                <h2 className="cv-side-title">{labels.contact}</h2>
                <ul className="cv-contact-list">
                  {profile.email && (
                    <li>
                      <strong>✉</strong>
                      <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    </li>
                  )}
                  {profile.phone && (
                    <li>
                      <strong>☏</strong>
                      <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                    </li>
                  )}
                  {displayLocation && (
                    <li>
                      <strong>⌖</strong>
                      <span>{displayLocation}</span>
                    </li>
                  )}
                  {profile.linkedin && (
                    <li>
                      <strong>in</strong>
                      <a href={profile.linkedin}>{cleanLink(profile.linkedin)}</a>
                    </li>
                  )}
                  {profile.website && (
                    <li>
                      <strong>⌘</strong>
                      <a href={profile.website}>{cleanLink(profile.website)}</a>
                    </li>
                  )}
                </ul>
              </section>

              {Object.keys(skillsByCategory).length > 0 && (
                <section className="cv-side-section">
                  <h2 className="cv-side-title">{labels.skills}</h2>
                  {Object.entries(skillsByCategory).map(([key, group]) => (
                    <div className="cv-skill-group" key={key}>
                      <h3 className="cv-skill-group-title">{group.label}</h3>
                      <div className="cv-skill-tags">
                        {group.items.map((s: any) => (
                          <span
                            key={s.id}
                            className={`cv-skill-tag ${s.level === 'Advanced' ? 'advanced' : ''}`}
                          >
                            {localize(locale, s.name, s.nameAr)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {stats.length > 0 && (
                <section className="cv-side-section">
                  <h2 className="cv-side-title">{labels.atAGlance}</h2>
                  <div className="cv-stats-grid">
                    {stats.slice(0, 4).map((stat) => (
                      <div className="cv-stat-box" key={stat.id}>
                        <div className="cv-stat-value">{stat.value}</div>
                        <div className="cv-stat-label">
                          {localize(locale, stat.label, stat.labelAr)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="cv-side-section">
                <h2 className="cv-side-title">{labels.languages}</h2>
                <ul className="cv-contact-list">
                  <li>
                    <strong>—</strong>
                    <span>{labels.arabicNative}</span>
                  </li>
                  <li>
                    <strong>—</strong>
                    <span>{labels.englishPro}</span>
                  </li>
                </ul>
              </section>
            </aside>

            <main className="cv-main">
              {displayBio && (
                <section className="cv-section">
                  <h2 className="cv-section-title">{labels.summary}</h2>
                  <p className="cv-summary">{displayBio}</p>
                </section>
              )}

              {experiences.length > 0 && (
                <section className="cv-section">
                  <h2 className="cv-section-title">{labels.experience}</h2>
                  {experiences.map((exp) => (
                    <div className="cv-item" key={exp.id}>
                      <div className="cv-item-header">
                        <h3 className="cv-item-title">
                          {localize(locale, exp.position, exp.positionAr)}
                        </h3>
                        <span className="cv-item-date">
                          {exp.startDate} — {exp.endDate || labels.present}
                        </span>
                      </div>
                      <p className="cv-item-subtitle">
                        {localize(locale, exp.company, exp.companyAr)}
                        {locale === 'en' && exp.location ? ` · ${exp.location}` : ''}
                      </p>
                      <p className="cv-item-body">
                        {localize(locale, exp.description, exp.descriptionAr)}
                      </p>
                    </div>
                  ))}
                </section>
              )}

              {educations.length > 0 && (
                <section className="cv-section">
                  <h2 className="cv-section-title">{labels.education}</h2>
                  {educations.map((edu) => (
                    <div className="cv-item" key={edu.id}>
                      <div className="cv-item-header">
                        <h3 className="cv-item-title">
                          {localize(locale, edu.degree, edu.degreeAr)}
                        </h3>
                        <span className="cv-item-date">
                          {edu.startDate} — {edu.endDate || labels.present}
                        </span>
                      </div>
                      <p className="cv-item-subtitle">
                        {localize(locale, edu.institution, edu.institutionAr)}
                      </p>
                      {localize(locale, edu.description, edu.descriptionAr) && (
                        <p className="cv-item-body">
                          {localize(locale, edu.description, edu.descriptionAr)}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {renderServices.length > 0 && (
                <section className="cv-section">
                  <h2 className="cv-section-title">{labels.services}</h2>
                  <div className="cv-services-grid">
                    {renderServices.map((s) => (
                      <div className="cv-service" key={s.id}>
                        <strong>{s.title}</strong>
                        {s.firstFeature ? ` — ${s.firstFeature}` : ''}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <p className="cv-footer-note">
                {labels.generated} ·{' '}
                {new Date().toLocaleDateString(dateLocale, {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </main>
          </>
        )}
      </article>
    </div>
  )
}
