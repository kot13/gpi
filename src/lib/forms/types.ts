export const CONTACT_METHODS = [
  'phone',
  'telegram',
  'whatsapp',
  'vk',
  'viber',
  'messenger',
] as const

export type ContactMethod = (typeof CONTACT_METHODS)[number]

export const PHONE_CONTACT_METHODS = ['phone', 'whatsapp', 'viber'] as const satisfies readonly ContactMethod[]

export type PhoneContactMethod = (typeof PHONE_CONTACT_METHODS)[number]

export function isPhoneContactMethod(method: ContactMethod): method is PhoneContactMethod {
  return (PHONE_CONTACT_METHODS as readonly string[]).includes(method)
}

export type ContactFormValues = {
  name: string
  contactMethod: ContactMethod
  countryCode: string
  dialCode: string
  contactValue: string
  honeypot: string
}

export type ContactValidationResult = {
  valid: boolean
  errorKey?: string
}
