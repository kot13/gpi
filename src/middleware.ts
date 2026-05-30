import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, isValidLocale } from '@/lib/i18n/config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]

  if (!first || !isValidLocale(first)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!admin|api|_next|next|favicon.ico|images|media).*)'],
}
