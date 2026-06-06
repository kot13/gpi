import {
  siFacebook,
  siMessenger,
  siTelegram,
  siViber,
  siVk,
  siWhatsapp,
  siYoutube,
} from 'simple-icons'
import { Linkedin, Phone } from 'lucide-react'
import React from 'react'

import { createBrandIcon } from '@/components/ui/icons/SocialBrandIcon'
import type { SocialPlatform } from '@/components/ui/icons/types'

export type { SocialPlatform }

export function PhoneIcon({ className }: { className?: string }) {
  return <Phone className={className} aria-hidden />
}

export const WhatsAppIcon = createBrandIcon(siWhatsapp, 'WhatsAppIcon')
export const TelegramIcon = createBrandIcon(siTelegram, 'TelegramIcon')
export const VKIcon = createBrandIcon(siVk, 'VKIcon')
export const ViberIcon = createBrandIcon(siViber, 'ViberIcon')
export const MessengerIcon = createBrandIcon(siMessenger, 'MessengerIcon')
export const YoutubeIcon = createBrandIcon(siYoutube, 'YoutubeIcon')
export const FacebookIcon = createBrandIcon(siFacebook, 'FacebookIcon')

export function LinkedinIcon({ className }: { className?: string }) {
  return <Linkedin className={className} aria-hidden />
}

export const socialIconMap: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  phone: PhoneIcon,
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  vk: VKIcon,
  viber: ViberIcon,
  messenger: MessengerIcon,
  youtube: YoutubeIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
}
