import type { ContactMethod } from '@/lib/forms/types'

export const CONTACT_METHOD_I18N_KEYS: Record<ContactMethod, string> = {
  phone: 'forms.methodPhone',
  telegram: 'forms.methodTelegram',
  whatsapp: 'forms.methodWhatsApp',
  vk: 'forms.methodVk',
  viber: 'forms.methodViber',
  messenger: 'forms.methodMessenger',
}

export const CONTACT_METHOD_ORDER: ContactMethod[] = [
  'phone',
  'telegram',
  'whatsapp',
  'vk',
  'viber',
  'messenger',
]
