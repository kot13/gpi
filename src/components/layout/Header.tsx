import Link from 'next/link'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Nav } from '@/components/layout/Nav'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'

type Props = {
  data: HeaderType
}

export function HeaderLayout({ data }: Props) {
  return (
    <header className="gpi-header border-b border-gpi-border bg-gpi-bg sticky top-0 z-50">
      <div className="container py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href={`/${DEFAULT_LOCALE}`} className="shrink-0">
          <Logo loading="eager" priority="high" className="h-8 w-auto" />
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <Nav items={data.navItems} />
          <div className="flex items-center gap-4">
            <SocialLinks links={data.socialLinks as Parameters<typeof SocialLinks>[0]['links']} />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
