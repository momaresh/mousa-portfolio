'use client'

import { useLocale } from '@/lib/i18n/locale-provider'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string
  title: string
  align?: 'start' | 'center'
  className?: string
}) {
  const { dir } = useLocale()

  return (
    <div className={cn('mb-12 md:mb-16', className)} dir={dir}>
      <p className="section-label mb-3">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-tight text-ink md:text-5xl text-balance">
        {title}
      </h2>
    </div>
  )
}
