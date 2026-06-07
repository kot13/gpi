import type { Locale } from '@/lib/i18n/config'
import { getCachedFooterForm } from '@/lib/forms/queries'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { ConsultationFormSection } from '@/components/forms/ConsultationFormSection'
import { FooterNav } from '@/components/layout/Nav'

import { FooterWithVisibility } from './FooterWithVisibility'

type Props = {
  locale: Locale
}

export async function Footer({ locale }: Props) {
  const [footerData, footerForm] = await Promise.all([
    getCachedGlobal('footer', 1, locale)(),
    getCachedFooterForm(locale)(),
  ])
  const navItems = footerData?.navItems || []

  return (
    <FooterWithVisibility>
      <footer className="gpi-footer mt-auto border-t border-gpi-border bg-gpi-bg-secondary text-gpi-text">
      {footerForm?.formType === 'consultation' ? (
        <ConsultationFormSection form={footerForm} locale={locale} />
      ) : null}

      <div className="container py-10 flex flex-col gap-8 md:flex-row md:justify-between">
        <div className="flex flex-col gap-3 max-w-md text-sm">
          {footerData?.companyName && (
            <p className="font-semibold text-gpi-text">{footerData.companyName}</p>
          )}
          {footerData?.identificationNumber && (
            <p className="text-gpi-muted">ID: {footerData.identificationNumber}</p>
          )}
          {footerData?.address && <p className="text-gpi-muted">{footerData.address}</p>}
          {footerData?.copyrightText && (
            <p className="text-gpi-muted">{footerData.copyrightText}</p>
          )}
        </div>

        <FooterNav items={navItems} locale={locale} />
      </div>
    </footer>
    </FooterWithVisibility>
  )
}
