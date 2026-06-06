'use client'

import * as Select from '@radix-ui/react-select'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { useId } from 'react'

import { contactPhoneShellClassName } from '@/components/forms/contactFieldStyles'
import { COUNTRIES, getCountryByCode, getDefaultCountry, type CountryOption } from '@/lib/forms/countries'
import { formatPhoneInput, getPhoneInputPlaceholder } from '@/lib/forms/formatPhoneInput'
import type { Messages } from '@/lib/i18n/getMessages'
type Props = {
  countryCode: string
  dialCode: string
  value: string
  onCountryChange: (country: CountryOption) => void
  onValueChange: (value: string) => void
  onBlur?: () => void
  placeholder: string
  selectCountryLabel: string
  invalid?: boolean
  id?: string
}

export function PhoneContactInput({
  countryCode,
  dialCode,
  value,
  onCountryChange,
  onValueChange,
  onBlur,
  placeholder,
  selectCountryLabel,
  invalid,
  id,
}: Props) {
  const selectId = useId()
  const selected = getCountryByCode(countryCode) ?? getDefaultCountry()
  const inputPlaceholder = getPhoneInputPlaceholder(selected.code, placeholder)

  const handleCountryChange = (code: string) => {
    const country = getCountryByCode(code)
    if (!country) return

    onCountryChange(country)

    if (value) {
      onValueChange(formatPhoneInput(value, country.code))
    }
  }

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(formatPhoneInput(event.target.value, selected.code))
  }

  const handleBlur = () => {
    const formatted = formatPhoneInput(value, selected.code)
    if (formatted !== value) {
      onValueChange(formatted)
    }
    onBlur?.()
  }

  return (
    <div className={contactPhoneShellClassName(invalid)}>
      <Select.Root
        value={selected.code}
        onValueChange={handleCountryChange}
      >
        <Select.Trigger
          id={selectId}
          aria-label={selectCountryLabel}
          className="inline-flex h-full min-w-[44px] shrink-0 items-center gap-1 rounded-full px-2 outline-none focus-visible:ring-2 focus-visible:ring-gpi-brand"
        >
          <span aria-hidden>{selected.flag}</span>
          <span className="text-sm font-medium">{dialCode || selected.dialCode}</span>
          <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            collisionPadding={8}
            className="z-50 max-h-64 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-gpi-border bg-white text-gpi-text shadow-lg"
          >
            <Select.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
              <ChevronUp className="h-4 w-4" aria-hidden />
            </Select.ScrollUpButton>
            <Select.Viewport className="max-h-56 overflow-y-auto p-1">
              {COUNTRIES.map((country) => (
                <Select.Item
                  key={country.code}
                  value={country.code}
                  className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-gpi-bg-secondary"
                >
                  <Select.ItemText>
                    <span className="mr-2">{country.flag}</span>
                    {country.dialCode} ({country.code})
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
              <ChevronDown className="h-4 w-4" aria-hidden />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value}
        onChange={handleValueChange}
        onBlur={handleBlur}
        placeholder={inputPlaceholder}
        className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-gpi-muted"
      />
    </div>
  )
}

export type PhoneContactInputLabels = Pick<Messages['forms'], 'phonePlaceholder' | 'selectCountry'>
