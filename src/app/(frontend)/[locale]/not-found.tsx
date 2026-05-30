import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: '404 | GPI',
  robots: { index: false, follow: false },
}

export default function LocaleNotFound() {
  return (
    <div className="container py-28 text-center">
      <h1 className="text-5xl font-bold text-white mb-4">404</h1>
      <p className="text-gpi-muted mb-8">Страница не найдена</p>
      <Link
        href="/ru"
        className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-md bg-gpi-accent text-white hover:opacity-90"
      >
        На главную
      </Link>
    </div>
  )
}
