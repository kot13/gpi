import { revalidatePath, revalidateTag } from 'next/cache'

import { LOCALES, type Locale } from '@/lib/i18n/config'

export function localePagePath(slug: string, locale: Locale): string {
  return slug === 'home' ? `/${locale}` : `/${locale}/${slug}`
}

export function localeBlogPostPath(slug: string, locale: Locale): string {
  return `/${locale}/blog/${slug}`
}

export function localeBlogCategoryPath(slug: string, locale: Locale): string {
  return `/${locale}/blog/category/${slug}`
}

export function revalidateAllLocalePagePaths(slug: string): void {
  for (const locale of LOCALES) {
    revalidatePath(localePagePath(slug, locale))
  }
  revalidateTag('pages-sitemap')
}

export function revalidateAllLocaleBlogPostPaths(slug: string): void {
  for (const locale of LOCALES) {
    revalidatePath(localeBlogPostPath(slug, locale))
  }
  revalidatePath('/ru/blog')
  revalidatePath('/ka/blog')
  revalidatePath('/en/blog')
  revalidateTag('posts-sitemap')
}

export function revalidateGlobalLayout(): void {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`, 'layout')
  }
  for (const locale of LOCALES) {
    revalidateTag(`global_header_${locale}`)
    revalidateTag(`global_footer_${locale}`)
  }
  revalidateTag('global_header')
  revalidateTag('global_footer')
}
