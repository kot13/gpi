import React from 'react'

import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import type { PropertyListItem } from '@/lib/properties/types'

type Props = {
  property: Pick<PropertyListItem, 'telegramUrl' | 'crmUrl'>
  locale: Locale
}

export function PropertyContactLinks({ property, locale }: Props) {
  const p = getMessages(locale).properties
  const links = [
    property.telegramUrl
      ? { href: property.telegramUrl, label: p?.contactTelegram ?? 'Telegram' }
      : null,
    property.crmUrl ? { href: property.crmUrl, label: p?.contactCrm ?? 'CRM' } : null,
  ].filter(Boolean) as Array<{ href: string; label: string }>

  if (!links.length) return null

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-11 px-5 rounded-md bg-gpi-brand text-white font-medium hover:opacity-90 transition-opacity"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
