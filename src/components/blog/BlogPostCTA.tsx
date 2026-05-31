import Link from 'next/link'
import React from 'react'

import { socialIconMap } from '@/components/ui/icons'
import type { SocialPlatform } from '@/components/ui/icons/types'
import { getMessages } from '@/lib/i18n/getMessages'
import type { Locale } from '@/lib/i18n/config'
import { cn } from '@/utilities/ui'

type SocialLink = {
  platform: SocialPlatform
  url: string
  order?: number | null
}

type Props = {
  locale: Locale
  socialLinks?: SocialLink[] | null
  className?: string
}

const ctaPlatforms: SocialPlatform[] = ['whatsapp', 'telegram']

export function BlogPostCTA({ locale, socialLinks, className }: Props) {
  const t = getMessages(locale)
  const links = (socialLinks ?? [])
    .filter((l) => ctaPlatforms.includes(l.platform))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const labelFor = (platform: SocialPlatform) => {
    if (platform === 'whatsapp') return t.blogCtaWhatsApp
    if (platform === 'telegram') return t.blogCtaTelegram
    return platform
  }

  return (
    <div
      className={cn(
        'mt-12 pt-8 border-t border-gpi-border flex flex-col sm:flex-row flex-wrap gap-3',
        className,
      )}
    >
      {links.map((link, i) => {
        const Icon = socialIconMap[link.platform]
        return (
          <Link
            key={`${link.platform}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full border border-gpi-brand text-gpi-brand hover:bg-gpi-brand hover:text-white transition-colors font-medium"
          >
            <Icon className="w-5 h-5" />
            {labelFor(link.platform)}
          </Link>
        )
      })}
      <Link
        href={`/${locale}/contacts`}
        className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-gpi-brand text-white hover:opacity-90 transition-opacity font-medium"
      >
        {t.blogCtaApply}
      </Link>
    </div>
  )
}
