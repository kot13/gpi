'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { Locale } from '@/lib/i18n/config'
import { getLocaleFromPathname, resolveLinkHref, type CMSLinkFields } from '@/lib/i18n/resolveLinkHref'

type CMSLinkType = CMSLinkFields & {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  size?: ButtonProps['size'] | null
  locale?: Locale
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    appearance = 'inline',
    children,
    className,
    label,
    locale: localeProp,
    newTab,
    size: sizeFromProps,
    ...linkFields
  } = props

  const pathname = usePathname()
  const locale = localeProp ?? getLocaleFromPathname(pathname)
  const href = resolveLinkHref(linkFields, locale)

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
