'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { BurgerButton } from '@/components/layout/BurgerButton'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { MobileNav } from '@/components/layout/MobileNav'
import { SocialLinks } from '@/components/ui/SocialLinks'
import type { Locale } from '@/lib/i18n/config'
import { getLocalizedPath } from '@/lib/i18n/config'

import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  locale: Locale
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header className="gpi-header sticky top-0 z-50 h-[var(--header-height)] border-b border-gpi-border bg-white/90 backdrop-blur-sm">
        <div className="container h-full flex items-center justify-between gap-4">
          <Link href={getLocalizedPath(locale, '')} className="shrink-0">
            <Logo loading="eager" priority="high" className="h-[34px] w-auto" />
          </Link>

          <div className="hidden min-[981px]:flex flex-1 items-center justify-center">
            <HeaderNav data={data} locale={locale} />
          </div>

          <div className="hidden min-[981px]:flex items-center gap-4 shrink-0">
            <SocialLinks links={data.socialLinks as Parameters<typeof SocialLinks>[0]['links']} />
            <LanguageSwitcher />
          </div>

          <div className="min-[981px]:hidden">
            <BurgerButton isOpen={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={data.navItems}
        socialLinks={data.socialLinks}
        locale={locale}
      />
    </>
  )
}
