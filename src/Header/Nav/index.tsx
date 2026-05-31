'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { Nav } from '@/components/layout/Nav'
import type { Locale } from '@/lib/i18n/config'

export const HeaderNav: React.FC<{ data: HeaderType; locale: Locale }> = ({ data, locale }) => {
  return <Nav items={data?.navItems} className="flex gap-3 items-center" locale={locale} />
}
