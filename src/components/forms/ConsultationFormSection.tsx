import React from 'react'

import { ConsultationForm } from '@/components/forms/ConsultationForm'
import { resolvePrivacyHref, resolvePrivacyLabel } from '@/lib/forms/resolvePrivacyHref'
import type { Locale } from '@/lib/i18n/config'
import type { Form } from '@/payload-types'

type Props = {
  form: Form
  locale: Locale
}

export function ConsultationFormSection({ form, locale }: Props) {
  const privacyHref = resolvePrivacyHref(form, locale)
  const privacyLabel = resolvePrivacyLabel(form)

  return (
    <section className="bg-[#414141] px-4 py-10 text-white">
      <div className="container mx-auto flex flex-col items-center gap-6">
        <h2 className="max-w-3xl text-center text-base font-bold uppercase tracking-wide md:text-lg">
          {form.title}
        </h2>
        <ConsultationForm
          form={form}
          locale={locale}
          privacyHref={privacyHref}
          privacyLabel={privacyLabel}
        />
      </div>
    </section>
  )
}
