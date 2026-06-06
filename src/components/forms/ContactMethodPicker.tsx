'use client'

import React from 'react'

import { socialIconMap } from '@/components/ui/icons'
import { CONTACT_METHOD_I18N_KEYS, CONTACT_METHOD_ORDER } from '@/lib/forms/contactMethods'
import type { ContactMethod } from '@/lib/forms/types'
import type { Messages } from '@/lib/i18n/getMessages'
import { cn } from '@/utilities/ui'

type Props = {
  value: ContactMethod
  onChange: (method: ContactMethod) => void
  labels: Messages['forms']
}

export function ContactMethodPicker({ value, onChange, labels }: Props) {
  return (
    <div role="radiogroup" aria-label="Contact method" className="flex flex-wrap justify-center gap-3">
      {CONTACT_METHOD_ORDER.map((method) => {
        const Icon = socialIconMap[method]
        const labelKey = CONTACT_METHOD_I18N_KEYS[method] as keyof Messages['forms']
        const label = labels[labelKey]
        const selected = value === method

        return (
          <button
            key={method}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            onClick={() => onChange(method)}
            className={cn(
              'inline-flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs text-white transition-colors',
              selected ? 'ring-2 ring-gpi-brand ring-offset-2 ring-offset-[#414141]' : 'opacity-80 hover:opacity-100',
            )}
          >
            <Icon className="h-8 w-8" />
            <span className="sr-only sm:not-sr-only">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
