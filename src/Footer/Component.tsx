import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []

  return (
    <footer className="gpi-footer mt-auto border-t border-gpi-border bg-gpi-bg-secondary text-gpi-text">
      <div className="container py-10 gap-8 flex flex-col md:flex-row md:justify-between">
        <div className="flex flex-col gap-4 max-w-md">
          {footerData?.companyName && (
            <p className="font-semibold text-white">{footerData.companyName}</p>
          )}
          {footerData?.identificationNumber && (
            <p className="text-sm text-gpi-muted">ID: {footerData.identificationNumber}</p>
          )}
          {footerData?.address && <p className="text-sm text-gpi-muted">{footerData.address}</p>}
          {footerData?.copyrightText && (
            <p className="text-sm text-gpi-muted">{footerData.copyrightText}</p>
          )}
        </div>

        <nav className="flex flex-col md:flex-row gap-4 md:gap-6">
          {navItems.map(({ link }, i) => (
            <CMSLink className="text-gpi-muted hover:text-gpi-accent min-h-[44px] inline-flex items-center" key={i} {...link} />
          ))}
        </nav>
      </div>
    </footer>
  )
}
