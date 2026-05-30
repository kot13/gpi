'use client'

import React from 'react'

import type { Header as HeaderType, Footer as FooterType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type NavItem = {
  link: NonNullable<HeaderType['navItems']>[number]['link']
}

type Props = {
  items?: NavItem[] | null
  className?: string
}

export function Nav({ items, className }: Props) {
  if (!items?.length) return null

  return (
    <nav className={className}>
      <ul className="flex flex-col md:flex-row gap-2 md:gap-6">
        {items.map(({ link }, i) => (
          <li key={i}>
            <CMSLink
              {...link}
              appearance="link"
              className="text-gpi-muted hover:text-gpi-accent min-h-[44px] inline-flex items-center"
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export type FooterNavProps = {
  items?: NonNullable<FooterType['navItems']> | null
  className?: string
}

export function FooterNav({ items, className }: FooterNavProps) {
  if (!items?.length) return null

  return (
    <nav className={className}>
      <ul className="flex flex-col md:flex-row gap-4 md:gap-6">
        {items.map(({ link }, i) => (
          <li key={i}>
            <CMSLink
              {...link}
              className="text-gpi-muted hover:text-gpi-accent min-h-[44px] inline-flex items-center"
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
