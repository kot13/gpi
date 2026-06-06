'use client'

import React from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  message?: string
  variant?: 'success' | 'error'
}

export function FormStatusMessage({ message, variant = 'success' }: Props) {
  if (!message) return null

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'text-center text-sm',
        variant === 'success' ? 'text-emerald-200' : 'text-red-300',
      )}
    >
      {message}
    </p>
  )
}
