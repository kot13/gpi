import { AsYouType, getExampleNumber } from 'libphonenumber-js/min'
import examples from 'libphonenumber-js/mobile/examples'
import type { CountryCode } from 'libphonenumber-js'

function toCountryCode(countryCode: string): CountryCode {
  return countryCode.toUpperCase() as CountryCode
}

function getNationalFormatTemplate(countryCode: CountryCode): string | null {
  const example = getExampleNumber(countryCode, examples)
  if (!example) return null

  return new AsYouType(countryCode).input(example.nationalNumber)
}

function applyNationalFormatTemplate(digits: string, template: string): string {
  let result = ''
  let digitIndex = 0

  for (const char of template) {
    if (/\d/.test(char)) {
      if (digitIndex >= digits.length) break
      result += digits[digitIndex++]
      continue
    }

    if (digitIndex > 0 && digitIndex < digits.length) {
      result += char
    }
  }

  if (digitIndex < digits.length) {
    result += digits.slice(digitIndex)
  }

  return result
}

export function formatPhoneInput(value: string, countryCode: string): string {
  const country = toCountryCode(countryCode)
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''

  const template = getNationalFormatTemplate(country)
  const maxDigits = template?.replace(/\D/g, '').length
  const normalizedDigits = maxDigits ? digits.slice(0, maxDigits) : digits

  const asYouType = new AsYouType(country).input(normalizedDigits)
  const asYouTypeDigits = asYouType.replace(/\D/g, '')

  if (asYouTypeDigits === normalizedDigits && /\D/.test(asYouType)) {
    return asYouType
  }

  if (template) {
    return applyNationalFormatTemplate(normalizedDigits, template)
  }

  return normalizedDigits
}

export function getPhoneInputPlaceholder(countryCode: string, fallback = '00-000-000'): string {
  const country = toCountryCode(countryCode)
  const template = getNationalFormatTemplate(country)
  if (!template) return fallback

  return template.replace(/\d/g, '0')
}
