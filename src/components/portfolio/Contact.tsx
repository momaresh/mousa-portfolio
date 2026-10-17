'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n/locale-provider'
import type { Profile } from '@/lib/portfolio/types'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Contact({ profile }: { profile: Profile | null }) {
  const { t, locale } = useLocale()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 3000)
    } catch {
      /* silent */
    }
    setSending(false)
  }

  return (
    <section id="contact" className="section border-t border-line">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} className="mb-8" />
            <Reveal>
              <div className="space-y-5 text-sm">
                {profile?.email && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{t.contact.email}</p>
                    <a href={`mailto:${profile.email}`} className="mt-1 inline-block link-underline">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile?.whatsapp && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">WhatsApp</p>
                    <a
                      href={`https://api.whatsapp.com/send?phone=${profile.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block link-underline"
                    >
                      {profile.whatsapp}
                    </a>
                  </div>
                )}
                {profile?.linkedin && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">LinkedIn</p>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block link-underline"
                    >
                      {profile.linkedin.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  </div>
                )}
                {profile?.location && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">
                      {locale === 'ar' ? 'الموقع' : 'Location'}
                    </p>
                    <p className="mt-1 text-ink-soft">
                      {locale === 'ar' && profile.locationAr ? profile.locationAr : profile.location}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal className="md:col-span-7" delay={0.08}>
            <form onSubmit={onSubmit} className="space-y-2">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t.contact.namePh}
                className="input-field"
                aria-label={t.contact.name}
              />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t.contact.emailPh}
                className="input-field"
                aria-label={t.contact.email}
              />
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder={t.contact.subjectPh}
                className="input-field"
                aria-label={t.contact.subject}
              />
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t.contact.messagePh}
                className="input-field resize-none"
                aria-label={t.contact.message}
              />
              <div className="pt-6">
                <button type="submit" disabled={sending} className="btn-solid disabled:opacity-60">
                  {sent ? t.contact.sent : sending ? t.contact.sending : t.contact.send}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
