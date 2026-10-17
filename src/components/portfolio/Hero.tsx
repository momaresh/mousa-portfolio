'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/locale-provider'
import { localize } from '@/lib/i18n/localize'
import type { Profile } from '@/lib/portfolio/types'

export function Hero({ profile }: { profile: Profile | null }) {
  const { t, locale } = useLocale()
  const name = localize(locale, profile?.name || 'Mousa Marsh', profile?.nameAr)
  const title = localize(
    locale,
    profile?.title || 'Accountant & Financial Operations',
    profile?.titleAr,
  )
  const subtitle = localize(
    locale,
    profile?.subtitle ||
      'Accounting, financial reporting, and branch operations with ERP systems experience.',
    profile?.subtitleAr,
  )
  const avatarSrc = profile?.avatarUrl || '/images/avatar.jpg'

  return (
    <section id="home" className="section min-h-[100svh] pt-28 md:pt-36">
      <div className="container-site flex min-h-[70svh] flex-col justify-center">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="section-label"
            >
              {profile?.available === false ? t.hero.unavailable : t.hero.available}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display mt-6 max-w-4xl text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.08] tracking-[-0.02em] text-ink"
            >
              {name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="mt-8 max-w-2xl"
            >
              <p className="text-lg text-ink-soft md:text-xl">{title}</p>
              <p className="mt-4 text-base leading-relaxed text-muted md:text-[17px]">{subtitle}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <a href="#experience" className="btn-solid">
                {t.hero.ctaProjects}
              </a>
              <a href="#contact" className="btn-line">
                {t.hero.ctaContact}
              </a>
              <Link href="/cv" target="_blank" className="text-sm text-muted link-underline">
                {t.hero.ctaCv}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[260px] overflow-hidden bg-bg-soft sm:max-w-[300px] lg:ms-auto lg:max-w-[380px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt={name}
                className="h-full w-full object-cover object-[center_20%]"
                width={640}
                height={800}
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
