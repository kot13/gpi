'use client'

import React, { useEffect, useRef } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Nav } from '@/components/layout/Nav'
import { SocialLinks } from '@/components/ui/SocialLinks'
import type { Locale } from '@/lib/i18n/config'
import { cn } from '@/utilities/ui'

type Props = {
  isOpen: boolean
  onClose: () => void
  navItems?: HeaderType['navItems']
  socialLinks?: HeaderType['socialLinks']
  locale: Locale
}

export function MobileNav({ isOpen, onClose, navItems, socialLinks, locale }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] min-[981px]:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Закрыть меню"
        onClick={onClose}
      />
      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Навигация"
        className={cn(
          'absolute top-[70px] left-0 right-0 bottom-0 bg-gpi-bg overflow-y-auto',
          'flex flex-col gap-8 p-6',
        )}
      >
        <Nav
          items={navItems}
          className="w-full"
          variant="mobile"
          onNavigate={onClose}
          locale={locale}
        />
        <div className="flex flex-col gap-4 pt-4 border-t border-gpi-border">
          <LanguageSwitcher />
          <SocialLinks links={socialLinks as Parameters<typeof SocialLinks>[0]['links']} />
        </div>
      </div>
    </div>
  )
}
