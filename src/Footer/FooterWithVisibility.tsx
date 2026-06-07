'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export function FooterWithVisibility({ children }: Props) {
  const pathname = usePathname()

  if (pathname?.includes('/properties/map')) {
    return null
  }

  return <>{children}</>
}
