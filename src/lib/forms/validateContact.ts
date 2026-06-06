import { parsePhoneNumberFromString } from 'libphonenumber-js/min'
import type { CountryCode } from 'libphonenumber-js'

import { getCountryByCode } from '@/lib/forms/countries'
import type { ContactMethod, ContactValidationResult } from '@/lib/forms/types'
import { isPhoneContactMethod } from '@/lib/forms/types'

const NAME_MAX = 120
const CONTACT_MAX = 200

const TELEGRAM_USERNAME = /^@?[a-zA-Z0-9_]{5,32}$/
const VK_ID = /^[a-zA-Z0-9_.]{2,64}$/
const VK_URL = /^https?:\/\/(www\.)?vk\.com\/.+/i
const MESSENGER_URL = /^https?:\/\/(www\.)?(facebook\.com|m\.me)\/.+/i
const MESSENGER_ID = /^[a-zA-Z0-9.]{2,64}$/

export function validateName(name: string): ContactValidationResult {
  const trimmed = name.trim()
  if (!trimmed) return { valid: false, errorKey: 'errorNameRequired' }
  if (trimmed.length > NAME_MAX) return { valid: false, errorKey: 'errorNameTooLong' }
  return { valid: true }
}

export function validateContact(
  method: ContactMethod,
  contactValue: string,
  countryCode: string,
): ContactValidationResult {
  const value = contactValue.trim()
  if (!value) return { valid: false, errorKey: 'errorContactRequired' }
  if (value.length > CONTACT_MAX) return { valid: false, errorKey: 'errorContactTooLong' }

  if (isPhoneContactMethod(method)) {
    return validatePhoneContact(value, countryCode)
  }

  switch (method) {
    case 'telegram':
      return validateTelegram(value)
    case 'vk':
      return validateVk(value)
    case 'messenger':
      return validateMessenger(value)
    default:
      return { valid: false, errorKey: 'errorContactInvalid' }
  }
}

function validatePhoneContact(value: string, countryCode: string): ContactValidationResult {
  const country = getCountryByCode(countryCode)
  if (!country) return { valid: false, errorKey: 'errorContactInvalid' }

  const digits = value.replace(/\D/g, '')
  if (!digits) return { valid: false, errorKey: 'errorContactInvalid' }

  const parsed = parsePhoneNumberFromString(value, country.code as CountryCode)
    ?? parsePhoneNumberFromString(`${country.dialCode}${digits}`)

  if (!parsed?.isValid()) {
    return { valid: false, errorKey: 'errorPhoneInvalid' }
  }

  return { valid: true }
}

function validateTelegram(value: string): ContactValidationResult {
  if (value.startsWith('+')) {
    const parsed = parsePhoneNumberFromString(value)
    if (parsed?.isValid()) return { valid: true }
    return { valid: false, errorKey: 'errorPhoneInvalid' }
  }

  const normalized = value.startsWith('@') ? value : `@${value}`
  if (TELEGRAM_USERNAME.test(normalized)) return { valid: true }
  return { valid: false, errorKey: 'errorTelegramInvalid' }
}

function validateVk(value: string): ContactValidationResult {
  if (VK_URL.test(value) || VK_ID.test(value)) return { valid: true }
  return { valid: false, errorKey: 'errorVkInvalid' }
}

function validateMessenger(value: string): ContactValidationResult {
  if (MESSENGER_URL.test(value) || MESSENGER_ID.test(value)) return { valid: true }
  return { valid: false, errorKey: 'errorMessengerInvalid' }
}

export function formatContactDisplay(
  method: ContactMethod,
  contactValue: string,
  countryCode: string,
  dialCode: string,
): string {
  const value = contactValue.trim()

  if (isPhoneContactMethod(method)) {
    const country = getCountryByCode(countryCode)
    const parsed =
      parsePhoneNumberFromString(value, (country?.code ?? countryCode) as CountryCode)
      ?? parsePhoneNumberFromString(`${dialCode}${value.replace(/\D/g, '')}`)

    if (parsed?.isValid()) return parsed.formatInternational()
    return `${dialCode} ${value}`.trim()
  }

  if (method === 'telegram' && !value.startsWith('@') && !value.startsWith('+')) {
    return `@${value}`
  }

  return value
}
