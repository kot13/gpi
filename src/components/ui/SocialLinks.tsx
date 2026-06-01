import Link from 'next/link'
import { socialIconMap } from '@/components/ui/icons'
import type { SocialPlatform } from '@/components/ui/icons/types'

type SocialLink = {
  platform: SocialPlatform
  url: string
}

const platformLabels: Record<SocialPlatform, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  vk: 'VK',
  viber: 'Viber',
  messenger: 'Messenger',
  youtube: 'YouTube',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
}

export function SocialLinks({ links }: { links?: SocialLink[] | null }) {
  if (!links?.length) return null

  return (
    <div className="flex items-center gap-1">
      {links.map((link, i) => {
        const Icon = socialIconMap[link.platform]
        return (
          <Link
            key={`${link.platform}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platformLabels[link.platform]}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-gpi-muted hover:text-gpi-brand transition-colors"
          >
            <Icon className="w-10 h-10" />
          </Link>
        )
      })}
    </div>
  )
}
