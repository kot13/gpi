import { getLocalizedPath, type Locale } from '@/lib/i18n/config'
import type { Form, Page } from '@/payload-types'

export function resolvePrivacyHref(form: Form, locale: Locale): string | null {
  const privacyPage = form.privacyPage

  if (!privacyPage || typeof privacyPage !== 'object') {
    return null
  }

  const page = privacyPage as Page
  if (!page.slug) return null

  if (page.slug === 'home') {
    return getLocalizedPath(locale, '')
  }

  return getLocalizedPath(locale, `/${page.slug}`)
}

export function resolvePrivacyLabel(form: Form): string {
  return form.privacyLinkLabel?.trim() || 'Политика конфиденциальности'
}
