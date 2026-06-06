import type { SimpleIcon } from 'simple-icons'
import React from 'react'

type Props = {
  icon: SimpleIcon
  className?: string
}

export function SocialBrandIcon({ icon, className }: Props) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  )
}

export function createBrandIcon(icon: SimpleIcon, displayName: string) {
  function BrandIcon({ className }: { className?: string }) {
    return <SocialBrandIcon icon={icon} className={className} />
  }

  BrandIcon.displayName = displayName
  return BrandIcon
}
