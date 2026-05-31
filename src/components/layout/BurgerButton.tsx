'use client'

import React from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function BurgerButton({ isOpen, onClick, className }: Props) {
  return (
    <button
      type="button"
      className={cn(
        'relative min-h-[44px] min-w-[44px] inline-flex items-center justify-center',
        className,
      )}
      aria-expanded={isOpen}
      aria-controls="mobile-nav"
      aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
      onClick={onClick}
    >
      <span className="sr-only">{isOpen ? 'Закрыть меню' : 'Открыть меню'}</span>
      <span className="flex flex-col justify-center gap-1.5 w-6 h-5" aria-hidden>
        <span
          className={cn(
            'block h-0.5 w-full bg-gpi-text transition-transform duration-200',
            isOpen && 'translate-y-2 rotate-45',
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-full bg-gpi-text transition-opacity duration-200',
            isOpen && 'opacity-0',
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-full bg-gpi-text transition-transform duration-200',
            isOpen && '-translate-y-2 -rotate-45',
          )}
        />
      </span>
    </button>
  )
}
