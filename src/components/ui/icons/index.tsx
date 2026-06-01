import React from 'react'
import type { SocialPlatform } from '@/components/ui/icons/types'
import { Facebook, Linkedin, MessageCircle, Send, Youtube } from 'lucide-react'

export type { SocialPlatform }

export function WhatsAppIcon({ className }: { className?: string }) {
  return <MessageCircle className={className} aria-hidden />
}

export function TelegramIcon({ className }: { className?: string }) {
  return <Send className={className} aria-hidden />
}

export function VKIcon({ className }: { className?: string }) {
  return <span className={className} aria-hidden>V</span>
}

export function ViberIcon({ className }: { className?: string }) {
  return <MessageCircle className={className} aria-hidden />
}

export function MessengerIcon({ className }: { className?: string }) {
  return <MessageCircle className={className} aria-hidden />
}

export function YoutubeIcon({ className }: { className?: string }) {
  return <Youtube className={className} aria-hidden />
}

export function FacebookIcon({ className }: { className?: string }) {
  return <Facebook className={className} aria-hidden />
}

export function LinkedinIcon({ className }: { className?: string }) {
  return <Linkedin className={className} aria-hidden />
}

export const socialIconMap: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  vk: VKIcon,
  viber: ViberIcon,
  messenger: MessengerIcon,
  youtube: YoutubeIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
}
