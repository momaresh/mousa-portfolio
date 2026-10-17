'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Languages, Menu, Moon, Sun, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n/locale-provider'
import { useTheme } from '@/lib/theme/theme-provider'
import { cn } from '@/lib/utils'

const sectionIds = ['home', 'about', 'experience', 'education', 'skills', 'contact'] as const

export function Navbar() {
  const { t, locale, toggleLocale } = useLocale()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  const items = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'experience', label: t.nav.experience },
    { id: 'education', label: t.nav.education },
    { id: 'skills', label: t.nav.skills },
    { id: 'contact', label: t.nav.contact },
  ]

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 6)
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50', scrolled && 'nav-shell')}>
      <nav className="container-site flex h-14 items-center justify-between md:h-16">
        <a href="#home" className="text-sm font-semibold tracking-tight text-ink">
          {t.brand}
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                'text-[13px] transition-colors',
                active === item.id ? 'text-ink' : 'text-muted hover:text-ink',
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center text-muted hover:text-ink"
            aria-label={t.theme.toggle}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            onClick={toggleLocale}
            className="flex h-9 items-center gap-1 px-2 text-[13px] text-muted hover:text-ink"
            aria-label="Toggle language"
          >
            <Languages size={14} />
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          <Link
            href="/cv"
            target="_blank"
            className="ms-1 hidden text-[13px] font-medium link-underline sm:inline"
          >
            {t.nav.cv}
          </Link>
          <button
            type="button"
            className="ms-1 flex h-9 w-9 items-center justify-center text-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="block px-5 py-3.5 text-sm text-ink-soft"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/cv"
            target="_blank"
            onClick={() => setOpen(false)}
            className="block border-t border-line px-5 py-3.5 text-sm"
          >
            {t.nav.cv}
          </Link>
        </div>
      )}
    </header>
  )
}
