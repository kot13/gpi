import { getCountries, getCountryCallingCode } from 'libphonenumber-js/min'
import type { CountryCode } from 'libphonenumber-js'

export type CountryOption = {
  code: CountryCode
  dialCode: string
  flag: string
}

export const DEFAULT_COUNTRY_CODE: CountryCode = 'GE'

export function countryFlagEmoji(iso: string): string {
  const code = iso.toUpperCase()
  if (code.length !== 2) return ''
  return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 - 65 + char.charCodeAt(0)))
}

function buildCountry(code: CountryCode): CountryOption {
  return {
    code,
    dialCode: `+${getCountryCallingCode(code)}`,
    flag: countryFlagEmoji(code),
  }
}

export const COUNTRIES: CountryOption[] = getCountries().map(buildCountry)

const countryByCode = new Map(COUNTRIES.map((country) => [country.code, country]))

export function getCountryByCode(code: string): CountryOption | undefined {
  return countryByCode.get(code.toUpperCase() as CountryCode)
}

export function getDefaultCountry(): CountryOption {
  return getCountryByCode(DEFAULT_COUNTRY_CODE) ?? COUNTRIES[0]!
}
