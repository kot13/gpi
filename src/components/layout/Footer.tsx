import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

import { FooterNav } from '@/components/layout/Nav'

type Props = {
  data: FooterType
}

export function FooterLayout({ data }: Props) {
  return (
    <footer className="gpi-footer mt-auto border-t border-gpi-border bg-gpi-bg-secondary text-gpi-text">
      <div className="container py-10 gap-8 flex flex-col md:flex-row md:justify-between">
        <div className="flex flex-col gap-4 max-w-md">
          {data.companyName && <p className="font-semibold text-white">{data.companyName}</p>}
          {data.identificationNumber && (
            <p className="text-sm text-gpi-muted">ID: {data.identificationNumber}</p>
          )}
          {data.address && <p className="text-sm text-gpi-muted">{data.address}</p>}
          {data.copyrightText && <p className="text-sm text-gpi-muted">{data.copyrightText}</p>}
        </div>
        <FooterNav items={data.navItems} />
      </div>
    </footer>
  )
}
