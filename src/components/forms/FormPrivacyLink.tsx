import Link from 'next/link'
import React from 'react'

type Props = {
  href: string
  label: string
}

export function FormPrivacyLink({ href, label }: Props) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-pink-200/80 underline-offset-2 hover:underline"
    >
      {label}
    </Link>
  )
}
