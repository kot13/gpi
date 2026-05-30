'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="gpi-header border-b border-gpi-border bg-gpi-bg sticky top-0 z-50"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href={`/${DEFAULT_LOCALE}`} className="shrink-0">
          <Logo loading="eager" priority="high" className="h-8 w-auto" />
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <HeaderNav data={data} />
          <div className="flex items-center gap-4">
            <SocialLinks links={data.socialLinks as Parameters<typeof SocialLinks>[0]['links']} />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
