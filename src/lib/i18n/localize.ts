import type { Locale } from './dictionaries'

/** Prefer Arabic field when locale is ar and value exists; otherwise English. */
export function localize(
  locale: Locale,
  en: string | null | undefined,
  ar?: string | null | undefined,
): string {
  if (locale === 'ar' && ar && ar.trim()) {
    return ar
  }
  return en ?? ''
}
