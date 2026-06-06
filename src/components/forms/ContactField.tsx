'use client'

import React from 'react'

import { contactTextInputClassName } from '@/components/forms/contactFieldStyles'
import { PhoneContactInput } from '@/components/forms/PhoneContactInput'
import type { CountryOption } from '@/lib/forms/countries'
import type { ContactMethod } from '@/lib/forms/types'
import type { Messages } from '@/lib/i18n/getMessages'

type Props = {
  method: ContactMethod
  countryCode: string
  dialCode: string
  value: string
  onCountryChange: (country: CountryOption) => void
  onValueChange: (value: string) => void
  labels: Messages['forms']
  invalid?: boolean
  id?: string
}

export function ContactField({
  method,
  countryCode,
  dialCode,
  value,
  onCountryChange,
  onValueChange,
  labels,
  invalid,
  id,
}: Props) {
  if (method === 'phone' || method === 'whatsapp' || method === 'viber') {
    return (
      <PhoneContactInput
        id={id}
        countryCode={countryCode}
        dialCode={dialCode}
        value={value}
        onCountryChange={onCountryChange}
        onValueChange={onValueChange}
        placeholder={labels.phonePlaceholder}
        selectCountryLabel={labels.selectCountry}
        invalid={invalid}
      />
    )
  }

  const placeholder =
    method === 'telegram'
      ? labels.telegramPlaceholder
      : method === 'vk'
        ? labels.vkPlaceholder
        : method === 'messenger'
          ? labels.messengerPlaceholder
          : labels.textPlaceholder

  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder={placeholder}
      className={contactTextInputClassName(invalid)}
    />
  )
}
