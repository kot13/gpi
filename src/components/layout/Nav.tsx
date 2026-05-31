'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import type { Footer as FooterType, Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import type { Locale } from '@/lib/i18n/config'
import { getLocaleFromPathname, resolveLinkHref, stripLocaleFromPath } from '@/lib/i18n/resolveLinkHref'
import { cn } from '@/utilities/ui'

type NavItem = {
  link: NonNullable<HeaderType['navItems']>[number]['link']
}

type Props = {
  items?: NavItem[] | null
  className?: string
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
  locale?: Locale
}

function isLinkActive(pathname: string, href: string): boolean {
  if (!href || href === '#') return false
  const current = stripLocaleFromPath(pathname)
  try {
    const path = href.startsWith('http') ? new URL(href).pathname : href
    const normalized = stripLocaleFromPath(path)
    if (normalized === current) return true
    if (normalized !== '/' && current.startsWith(normalized)) return true
  } catch {
    return stripLocaleFromPath(pathname) === href
  }
  return false
}

export function Nav({ items, className, variant = 'desktop', onNavigate, locale: localeProp }: Props) {
  const pathname = usePathname()
  const locale = localeProp ?? getLocaleFromPathname(pathname)

  if (!items?.length) return null

  const isMobile = variant === 'mobile'

  return (
    <nav className={className}>
      <ul className={cn('flex gap-2', isMobile ? 'flex-col' : 'flex-row items-center gap-6')}>
        {items.map(({ link }, i) => {
          const href = resolveLinkHref(link, locale) ?? ''
          const active = isLinkActive(pathname, href)

          return (
            <li key={i} onClick={onNavigate}>
              <CMSLink
                {...link}
                locale={locale}
                appearance="link"
                className={cn(
                  'min-h-[44px] inline-flex items-center text-base transition-colors',
                  active
                    ? 'text-gpi-brand font-bold'
                    : 'text-gpi-text hover:text-gpi-brand font-normal',
                  isMobile && 'text-lg py-2',
                )}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export type FooterNavProps = {
  items?: NonNullable<FooterType['navItems']> | null
  className?: string
  locale?: Locale
}

export function FooterNav({ items, className, locale: localeProp }: FooterNavProps) {
  const pathname = usePathname()
  const locale = localeProp ?? getLocaleFromPathname(pathname)

  if (!items?.length) return null

  return (
    <nav className={className}>
      <ul className="flex flex-col md:flex-row gap-4 md:gap-6">
        {items.map(({ link }, i) => (
          <li key={i}>
            <CMSLink
              {...link}
              locale={locale}
              className="text-gpi-muted hover:text-gpi-brand min-h-[44px] inline-flex items-center text-sm transition-colors"
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
