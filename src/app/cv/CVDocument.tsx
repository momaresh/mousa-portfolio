'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { Printer, ArrowLeft, Download } from 'lucide-react'
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

export default function CVDocument({
  profile,
  skills,
  experiences,
  educations = [],
  services,
  stats,
  atsMode = false,
}: Props) {
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

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, any[]>>((acc, s) => {
    const group = acc[s.category] ?? []
    group.push(s)
    acc[s.category] = group
    return acc
  }, {})

  // Initials for avatar fallback
  const initials = (profile.name || 'M')
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const displayName = profile.nameAr || profile.name
  const displayTitle = profile.titleAr || profile.title
  const displayBio = profile.bioAr || profile.bio
  const displayLocation = profile.locationAr || profile.location

  // Parse service features safely
  const renderServices = services.slice(0, 6).map((s) => {
    let firstFeature = ''
    try {
      const arr = JSON.parse(s.features || '[]')
      if (Array.isArray(arr) && arr.length > 0) firstFeature = arr[0]
    } catch {
      firstFeature = ''
    }
    return { ...s, firstFeature }
  })

  const cleanLink = (url?: string | null) => {
    if (!url) return ''
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
  }

  return (
    <div className={`cv-shell ${atsMode ? 'ats-mode' : ''}`}>
      {/* Toolbar (hidden in print) */}
      <div className="cv-toolbar">
        <div className="cv-toolbar-title">
          CV — {profile.name} {atsMode && <span className="cv-mode-pill">ATS Mode</span>}
        </div>
        <div className="cv-toolbar-actions">
          <Link href="/" className="cv-btn cv-btn-ghost">
            <ArrowLeft size={16} />
            Back
          </Link>
          <button onClick={toggleMode} className="cv-btn cv-btn-ghost" type="button" title={atsMode ? 'Switch to Modern (designed) layout' : 'Switch to ATS-optimized plain layout'}>
            {atsMode ? '🎨 Modern' : '📄 ATS'}
          </button>
          <button onClick={handlePrint} className="cv-btn cv-btn-primary" type="button">
            <Download size={16} />
            Download PDF
          </button>
          <button onClick={handlePrint} className="cv-btn cv-btn-ghost" type="button">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      <article className="cv-document" id="cv-document">
        {atsMode ? (
          /* ============ ATS LAYOUT (plain, single-column) ============ */
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
                <h2 className="cv-section-title">Professional Summary</h2>
                <p className="cv-summary">{displayBio}</p>
              </section>
            )}

            {Object.keys(skillsByCategory).length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">Skills</h2>
                <div className="cv-ats-skills-block">
                  {Object.entries(skillsByCategory).map(([cat, items]) => (
                    <div key={cat}>
                      <strong>{cat}:</strong>{' '}
                      {items.map((s: any) => s.name).join(', ')}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {experiences.length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">Professional Experience</h2>
                {experiences.map((exp) => (
                  <div className="cv-item" key={exp.id}>
                    <div className="cv-item-header">
                      <h3 className="cv-item-title">
                        {exp.positionAr || exp.position} — {exp.companyAr || exp.company}
                      </h3>
                      <span className="cv-item-date">
                        {exp.startDate} — {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.location && (
                      <p className="cv-item-subtitle">{exp.location}</p>
                    )}
                    <p className="cv-item-body">{exp.descriptionAr || exp.description}</p>
                  </div>
                ))}
              </section>
            )}

            {educations.length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">Education</h2>
                {educations.map((edu) => (
                  <div className="cv-item" key={edu.id}>
                    <div className="cv-item-header">
                      <h3 className="cv-item-title">{edu.degreeAr || edu.degree}</h3>
                      <span className="cv-item-date">
                        {edu.startDate} — {edu.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="cv-item-subtitle">{edu.institutionAr || edu.institution}</p>
                    {(edu.descriptionAr || edu.description) && (
                      <p className="cv-item-body">{edu.descriptionAr || edu.description}</p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {renderServices.length > 0 && (
              <section className="cv-section">
                <h2 className="cv-section-title">Areas of Expertise</h2>
                {renderServices.map((s) => (
                  <div className="cv-service" key={s.id}>
                    <strong>{s.title}</strong>
                    {s.firstFeature ? ` — ${s.firstFeature}` : ''}
                  </div>
                ))}
              </section>
            )}

            <section className="cv-section">
              <h2 className="cv-section-title">Languages</h2>
              <p className="cv-item-body">Arabic (Native), English (Professional working proficiency)</p>
            </section>
          </main>
        ) : (
          <>
            {/* ============ MODERN SIDEBAR ============ */}
            <aside className="cv-sidebar">
          <div className="cv-avatar">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <h1 className="cv-name">{displayName}</h1>
          <p className="cv-job">{displayTitle}</p>

          {/* Contact */}
          <section className="cv-side-section">
            <h2 className="cv-side-title">Contact</h2>
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

          {/* Skills */}
          {Object.keys(skillsByCategory).length > 0 && (
            <section className="cv-side-section">
              <h2 className="cv-side-title">Skills</h2>
              {Object.entries(skillsByCategory).map(([cat, items]) => (
                <div className="cv-skill-group" key={cat}>
                  <h3 className="cv-skill-group-title">{cat}</h3>
                  <div className="cv-skill-tags">
                    {items.map((s) => (
                      <span
                        key={s.id}
                        className={`cv-skill-tag ${s.level === 'Advanced' ? 'advanced' : ''}`}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <section className="cv-side-section">
              <h2 className="cv-side-title">At a Glance</h2>
              <div className="cv-stats-grid">
                {stats.slice(0, 4).map((stat) => (
                  <div className="cv-stat-box" key={stat.id}>
                    <div className="cv-stat-value">{stat.value}</div>
                    <div className="cv-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages (static) */}
          <section className="cv-side-section">
            <h2 className="cv-side-title">Languages</h2>
            <ul className="cv-contact-list">
              <li>
                <strong>—</strong>
                <span>Arabic (Native)</span>
              </li>
              <li>
                <strong>—</strong>
                <span>English (Professional)</span>
              </li>
            </ul>
          </section>
        </aside>

        {/* ============ MAIN ============ */}
        <main className="cv-main">
          {/* Summary */}
          {displayBio && (
            <section className="cv-section">
              <h2 className="cv-section-title">الهدف الوظيفي / Summary</h2>
              <p className="cv-summary">{displayBio}</p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title">الخبرة العملية</h2>
              {experiences.map((exp) => (
                <div className="cv-item" key={exp.id}>
                  <div className="cv-item-header">
                    <h3 className="cv-item-title">{exp.positionAr || exp.position}</h3>
                    <span className="cv-item-date">
                      {exp.startDate} — {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="cv-item-subtitle">
                    {exp.companyAr || exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  <p className="cv-item-body">{exp.descriptionAr || exp.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title">المؤهلات الدراسية</h2>
              {educations.map((edu) => (
                <div className="cv-item" key={edu.id}>
                  <div className="cv-item-header">
                    <h3 className="cv-item-title">{edu.degreeAr || edu.degree}</h3>
                    <span className="cv-item-date">
                      {edu.startDate} — {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="cv-item-subtitle">{edu.institutionAr || edu.institution}</p>
                  {(edu.descriptionAr || edu.description) && (
                    <p className="cv-item-body">{edu.descriptionAr || edu.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Services */}
          {renderServices.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title">الخدمات</h2>
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
            Generated dynamically · {new Date().toLocaleDateString('en-GB', {
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
