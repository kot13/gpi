import type { Locale } from '@/lib/i18n/config'

import en from './messages/en.json'
import ka from './messages/ka.json'
import ru from './messages/ru.json'

const messages = { ru, ka, en } as const

export type Messages = typeof ru

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
