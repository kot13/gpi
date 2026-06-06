'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ContactField } from '@/components/forms/ContactField'
import { ContactMethodPicker } from '@/components/forms/ContactMethodPicker'
import { FormPrivacyLink } from '@/components/forms/FormPrivacyLink'
import { FormStatusMessage } from '@/components/forms/FormStatusMessage'
import { getDefaultCountry } from '@/lib/forms/countries'
import type { ContactFormValues, ContactMethod } from '@/lib/forms/types'
import { isPhoneContactMethod } from '@/lib/forms/types'
import { resolveFormErrorMessage } from '@/lib/forms/resolveFormErrorMessage'
import { validateContact, validateName } from '@/lib/forms/validateContact'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import type { Form } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = {
  form: Form
  locale: Locale
  privacyHref: string | null
  privacyLabel: string
}

export function ConsultationForm({ form, locale, privacyHref, privacyLabel }: Props) {
  const t = getMessages(locale).forms
  const defaultCountry = getDefaultCountry()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      contactMethod: 'phone',
      countryCode: defaultCountry.code,
      dialCode: defaultCountry.dialCode,
      contactValue: '',
      honeypot: '',
    },
  })

  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactMethod = watch('contactMethod')
  const countryCode = watch('countryCode')
  const dialCode = watch('dialCode')
  const contactValue = watch('contactValue')

  const setContactMethod = (method: ContactMethod) => {
    setValue('contactMethod', method)
    setValue('contactValue', '')
    setStatus(null)
  }

  const onSubmit = handleSubmit(async (values) => {
    setStatus(null)

    const nameResult = validateName(values.name)
    if (!nameResult.valid) {
      setStatus({ type: 'error', message: resolveFormErrorMessage(t, nameResult.errorKey) })
      return
    }

    const contactResult = validateContact(
      values.contactMethod,
      values.contactValue,
      values.countryCode,
    )
    if (!contactResult.valid) {
      setStatus({ type: 'error', message: resolveFormErrorMessage(t, contactResult.errorKey) })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: form.id,
          name: values.name.trim(),
          contactMethod: values.contactMethod,
          countryCode: isPhoneContactMethod(values.contactMethod) ? values.countryCode : undefined,
          dialCode: isPhoneContactMethod(values.contactMethod) ? values.dialCode : undefined,
          contactValue: values.contactValue.trim(),
          locale,
          honeypot: values.honeypot,
        }),
      })

      if (!response.ok) {
        throw new Error('submit failed')
      }

      setStatus({ type: 'success', message: form.successMessage || '' })
      reset({
        name: '',
        contactMethod: values.contactMethod,
        countryCode: defaultCountry.code,
        dialCode: defaultCountry.dialCode,
        contactValue: '',
        honeypot: '',
      })
    } catch {
      setStatus({ type: 'error', message: t.errorSubmitFailed })
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-4" noValidate>
      <input
        type="text"
        name="honeypot"
        value={watch('honeypot')}
        onChange={(event) => setValue('honeypot', event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <input
        type="text"
        {...register('name')}
        placeholder={t.namePlaceholder}
        aria-invalid={Boolean(errors.name)}
        className={cn(
          'w-full rounded-full bg-white px-4 py-3 min-h-[44px] text-gpi-text outline-none placeholder:text-gpi-muted',
          errors.name && 'ring-2 ring-red-500',
        )}
      />

      <ContactMethodPicker value={contactMethod} onChange={setContactMethod} labels={t} />

      <ContactField
        method={contactMethod}
        countryCode={countryCode}
        dialCode={dialCode}
        value={contactValue}
        onCountryChange={(country) => {
          setValue('countryCode', country.code)
          setValue('dialCode', country.dialCode)
        }}
        onValueChange={(value) => setValue('contactValue', value)}
        labels={t}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="relative z-10 w-full cursor-pointer rounded-full bg-gpi-brand px-6 py-3 min-h-[44px] text-base font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t.submitting : form.submitButtonLabel}
      </button>

      <FormStatusMessage
        message={status?.message}
        variant={status?.type === 'error' ? 'error' : 'success'}
      />

      {privacyHref ? <FormPrivacyLink href={privacyHref} label={privacyLabel} /> : null}
    </form>
  )
}
