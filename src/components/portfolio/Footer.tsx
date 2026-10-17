'use client'

import { useLocale } from '@/lib/i18n/locale-provider'
import type { Profile } from '@/lib/portfolio/types'

export function Footer({ profile }: { profile: Profile | null }) {
  const { t } = useLocale()

  return (
    <footer className="border-t border-line py-10">
      <div className="container-site flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile?.nameAr || profile?.name || 'Mousa Marsh'}
        </p>
        <div className="flex flex-wrap gap-5 text-sm text-muted">
          <a href="#experience" className="hover:text-ink">
            {t.nav.experience}
          </a>
          <a href="#education" className="hover:text-ink">
            {t.nav.education}
          </a>
          <a href="#contact" className="hover:text-ink">
            {t.nav.contact}
          </a>
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
