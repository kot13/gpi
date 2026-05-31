import { NextResponse } from 'next/server'

import { resolveLocaleAlternates } from '@/lib/i18n/localeAlternate'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pathname = searchParams.get('pathname') ?? '/'

  try {
    const alternates = await resolveLocaleAlternates(pathname)
    return NextResponse.json(alternates)
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
