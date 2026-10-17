'use client'

import { useLocale } from '@/lib/i18n/locale-provider'
import { localize } from '@/lib/i18n/localize'
import type { Stat } from '@/lib/portfolio/types'
import { cn } from '@/lib/utils'

export function StatsBar({ stats }: { stats: Stat[] }) {
  const { locale } = useLocale()
  if (!stats.length) return null

  return (
    <section className="border-y border-line">
      <div className="container-site grid grid-cols-2 gap-6 py-10 md:grid-cols-4 md:py-12">
        {stats.map((stat) => {
          const long = stat.value.length > 4
          return (
            <div key={stat.id}>
              <div
                className={cn(
                  'font-display leading-none text-ink',
                  long ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl',
                )}
              >
                {stat.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-muted">
                {localize(locale, stat.label, stat.labelAr)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
