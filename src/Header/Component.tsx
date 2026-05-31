import { HeaderClient } from './Component.client'
import type { Locale } from '@/lib/i18n/config'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

type Props = {
  locale: Locale
}

export async function Header({ locale }: Props) {
  const headerData = await getCachedGlobal('header', 1, locale)()

  return <HeaderClient data={headerData} locale={locale} />
}
