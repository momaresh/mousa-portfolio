'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dictionaries, type Dictionary, type Locale } from './dictionaries'

type LocaleContextValue = {
  locale: Locale
  dir: 'ltr' | 'rtl'
  t: Dictionary
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const STORAGE_KEY = 'mousa-locale'

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'ar'
  }
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' || stored === 'ar' ? stored : 'ar'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Default Arabic for accountant portfolio; sync from storage after mount.
  const [locale, setLocaleState] = useState<Locale>('ar')

  useEffect(() => {
    const stored = readStoredLocale()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate preference from localStorage after SSR
    setLocaleState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'en' ? 'ar' : 'en'))
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      t: dictionaries[locale],
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
