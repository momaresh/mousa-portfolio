'use client'

import { LocaleProvider } from '@/lib/i18n/locale-provider'
import { ThemeProvider } from '@/lib/theme/theme-provider'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  )
}
