import type { Payload } from 'payload'
import type { Header, Page } from '@/payload-types'

import { LOCALES, type Locale } from '@/lib/i18n/config'

import { lexicalHeading, lexicalParagraph, lexicalRoot } from './lexical'
import { minimalPlaceholderLayout } from './pages/minimalLayout'
import { buildHomeSlideshowHero } from './slideshowSlides'
import { stripNestedIds } from './stripNestedIds'

type PageLocaleData = {
  title: string
  slug: string
  hero?: Page['hero']
}

type SeedPageIds = {
  home: number
  blog: number
}

type SeedLocalizedOptions = {
  pageIds: SeedPageIds
  /** Hero image for localized home slideshow slides. */
  homeHeroMediaId: number
}

const postTranslations: Record<
  string,
  Record<Locale, { title: string; description: string; slug: string }>
> = {
  'digital-horizons': {
    ru: {
      title: 'Цифровые горизонты: взгляд в будущее',
      description: 'Обзор технологических трендов и инноваций.',
      slug: 'digital-horizons',
    },
    ka: {
      title: 'ციფრული ჰორიზონტები: ხველის შეხედვა',
      description: 'ტექნოლოგიური ტrendebis მიმოხილვა.',
      slug: 'digital-horizons',
    },
    en: {
      title: 'Digital Horizons: A Glimpse into Tomorrow',
      description: 'Exploring technology trends and innovation.',
      slug: 'digital-horizons',
    },
  },
  'global-gaze': {
    ru: {
      title: 'Глобальный взгляд: за пределами заголовков',
      description: 'Истории со всего мира.',
      slug: 'global-gaze',
    },
    ka: {
      title: 'გლობალური შეხედვა: სათაურებს მიღმა',
      description: 'ისტორიები მსოფლიოს მასშტაბით.',
      slug: 'global-gaze',
    },
    en: {
      title: 'Global Gaze: Beyond the Headlines',
      description: 'Stories from around the world.',
      slug: 'global-gaze',
    },
  },
  'dollar-and-sense-the-financial-forecast': {
    ru: {
      title: 'Доллар и смысл: финансовый прогноз',
      description: 'Финансовые insights для инвесторов в недвижимость.',
      slug: 'dollar-and-sense-the-financial-forecast',
    },
    ka: {
      title: 'დოლარი და აზრი: ფინანსური პროგნოზი',
      description: 'ფინანსური რჩევები უძრავი ქონების ინვესტორებისთვის.',
      slug: 'dollar-and-sense-the-financial-forecast',
    },
    en: {
      title: 'Dollar and Sense: The Financial Forecast',
      description: 'Financial insights for property investors in Georgia.',
      slug: 'dollar-and-sense-the-financial-forecast',
    },
  },
}

const pageTranslations: Record<string, Record<Locale, PageLocaleData>> = {
  home: {
    ru: { title: 'GPI — Georgia Private Investment', slug: 'home' },
    ka: { title: 'GPI — საქართველოს კერძო ინვესტიციები', slug: 'home' },
    en: { title: 'GPI — Georgia Private Investment', slug: 'home' },
  },
  properties: {
    ru: {
      title: 'Каталог недвижимости',
      slug: 'properties',
      hero: {
        type: 'lowImpact',
        richText: lexicalRoot([
          lexicalHeading('Каталог недвижимости'),
          lexicalParagraph('Актуальные предложения GPI в Батуми и Тбилиси'),
        ]),
      },
    },
    ka: {
      title: 'უძრავი ქონების კატალოგი',
      slug: 'properties',
      hero: {
        type: 'lowImpact',
        richText: lexicalRoot([
          lexicalHeading('უძრავი ქონების კატალოგი'),
          lexicalParagraph('GPI-ის აქტუალური შეთავაზებები ბათუმსა და თბილისში'),
        ]),
      },
    },
    en: {
      title: 'Property catalog',
      slug: 'properties',
      hero: {
        type: 'lowImpact',
        richText: lexicalRoot([
          lexicalHeading('Property catalog'),
          lexicalParagraph('Current GPI listings in Batumi and Tbilisi'),
        ]),
      },
    },
  },
  blog: {
    ru: {
      title: 'Блог',
      slug: 'blog',
      hero: {
        type: 'lowImpact',
        richText: lexicalRoot([
          lexicalHeading('Блог GPI'),
          lexicalParagraph('Мы делимся только проверенной информацией'),
          lexicalParagraph('Откройте мир знаний о недвижимости ГРУЗИИ'),
          lexicalParagraph('Средняя скорость прочтения 1 блога от 3 до 5 мин'),
        ]),
      },
    },
    ka: {
      title: 'ბლოგი',
      slug: 'blog',
      hero: {
        type: 'lowImpact',
        richText: lexicalRoot([
          lexicalHeading('GPI ბლოგი'),
          lexicalParagraph('ჩვენ ვუზიარებთ მხოლოდ შემოწმებულ ინფორმაციას'),
          lexicalParagraph('გახსენით ცოდნის სამყარო უძრავი ქონების შესახებ საქართველოში'),
          lexicalParagraph('საშუალო კითხვის დრო: 3-5 წუთი'),
        ]),
      },
    },
    en: {
      title: 'Blog',
      slug: 'blog',
      hero: {
        type: 'lowImpact',
        richText: lexicalRoot([
          lexicalHeading('GPI Blog'),
          lexicalParagraph('We share only verified information'),
          lexicalParagraph('Discover the world of real estate knowledge in GEORGIA'),
          lexicalParagraph('Average reading time per post: 3 to 5 minutes'),
        ]),
      },
    },
  },
  '404': {
    ru: {
      title: 'Страница не найдена',
      slug: '404',
      hero: {
        type: 'lowImpact',
        richText: lexicalRoot([
          lexicalHeading('404'),
          lexicalParagraph('Страница не найдена'),
        ]),
      },
    },
    ka: {
      title: 'გვერდი ვერ მოიძებნა',
      slug: '404',
      hero: {
        type: 'lowImpact',
        richText: lexicalRoot([
          lexicalHeading('404'),
          lexicalParagraph('გვერდი ვერ მოიძებნა'),
        ]),
      },
    },
    en: {
      title: 'Page not found',
      slug: '404',
      hero: {
        type: 'lowImpact',
        richText: lexicalRoot([
          lexicalHeading('404'),
          lexicalParagraph('Page not found'),
        ]),
      },
    },
  },
}

const headerNavLabels: Record<Locale, { home: string; blog: string; catalog: string }> = {
  ru: { home: 'Главная', blog: 'Блог', catalog: 'Каталог' },
  ka: { home: 'მთავარი', blog: 'ბლოგი', catalog: 'კატალოგი' },
  en: { home: 'Home', blog: 'Blog', catalog: 'Catalog' },
}

const notFoundLinkLabels: Record<Locale, string> = {
  ru: 'На главную',
  ka: 'მთავარზე',
  en: 'Back to home',
}

type NavItemKey = 'home' | 'blog' | 'catalog'

const NAV_ITEM_ORDER: NavItemKey[] = ['home', 'blog', 'catalog']

type NavItemRow = NonNullable<Header['navItems']>[number]

function buildNavItem(locale: Locale, key: NavItemKey, pageIds: SeedPageIds): NavItemRow {
  if (key === 'catalog') {
    return {
      link: {
        type: 'custom' as const,
        label: headerNavLabels[locale].catalog,
        url: `/${locale}/properties`,
      },
    }
  }

  return {
    link: {
      type: 'reference' as const,
      label: headerNavLabels[locale][key],
      reference: { relationTo: 'pages' as const, value: pageIds[key] },
    },
  }
}

function buildNavItems(locale: Locale, pageIds: SeedPageIds): NavItemRow[] {
  return NAV_ITEM_ORDER.map((key) => buildNavItem(locale, key, pageIds))
}

function buildNavItemsWithIds(
  existingItems: NonNullable<Header['navItems']>,
  locale: Locale,
  pageIds: SeedPageIds,
): NavItemRow[] {
  return existingItems.map((item, index) => {
    const key = NAV_ITEM_ORDER[index]
    if (!key || !item.id) return item

    if (key === 'catalog') {
      return {
        id: item.id,
        link: {
          type: 'custom' as const,
          label: headerNavLabels[locale].catalog,
          url: `/${locale}/properties`,
          newTab: item.link?.newTab ?? null,
        },
      }
    }

    return {
      id: item.id,
      link: {
        type: 'reference' as const,
        label: headerNavLabels[locale][key],
        reference: { relationTo: 'pages' as const, value: pageIds[key] },
        newTab: item.link?.newTab ?? null,
      },
    }
  })
}

/**
 * Localized link labels live on shared array rows — create rows once (ru), then set
 * labels per locale using the same row ids.
 */
async function seedGlobalNavItems(
  payload: Payload,
  slug: 'header' | 'footer',
  pageIds: SeedPageIds,
): Promise<void> {
  await payload.updateGlobal({
    slug,
    locale: 'ru',
    data: { navItems: buildNavItems('ru', pageIds) },
    context: { disableRevalidate: true },
  })

  const base = await payload.findGlobal({
    slug,
    locale: 'ru',
    depth: 0,
  })

  const rows = base.navItems
  if (!rows?.length) {
    payload.logger.warn(`— ${slug}: nav items were not created`)
    return
  }

  for (const locale of LOCALES) {
    await payload.updateGlobal({
      slug,
      locale,
      data: { navItems: buildNavItemsWithIds(rows, locale, pageIds) },
      context: { disableRevalidate: true },
    })
  }
}

export async function seedLocalizedContent(
  payload: Payload,
  { pageIds, homeHeroMediaId }: SeedLocalizedOptions,
): Promise<void> {
  payload.logger.info('— Seeding localized content (ru/ka/en)...')

  const posts = await payload.find({ collection: 'posts', limit: 100, pagination: false })

  for (const post of posts.docs) {
    if (!post.slug || !postTranslations[post.slug]) continue

    for (const locale of LOCALES) {
      const data = postTranslations[post.slug][locale]
      await payload.update({
        collection: 'posts',
        id: post.id,
        locale,
        data,
        context: { disableRevalidate: true },
      })
    }
  }

  const pages = await payload.find({
    collection: 'pages',
    locale: 'ru',
    limit: 100,
    pagination: false,
    select: { slug: true },
  })

  for (const page of pages.docs) {
    if (!page.slug) continue
    const translations = pageTranslations[page.slug]
    if (!translations) continue

    for (const locale of LOCALES) {
      const { title, slug, hero } = translations[locale]
      let heroData: Page['hero'] | undefined = hero

      if (page.slug === 'home') {
        heroData = buildHomeSlideshowHero(locale, homeHeroMediaId)
      } else if (page.slug === '404' && hero) {
        heroData = {
          type: 'lowImpact',
          richText: hero.richText,
          links: [
            {
              link: {
                type: 'reference' as const,
                label: notFoundLinkLabels[locale],
                reference: { relationTo: 'pages' as const, value: pageIds.home },
                appearance: 'default' as const,
              },
            },
          ],
        }
      }

      const pageData: Record<string, unknown> = {
        title,
        slug,
        generateSlug: false,
      }

      if (heroData) {
        pageData.hero = stripNestedIds(heroData)
      }

      // Localized layout blocks must not reuse row ids from the default locale
      if (page.slug === 'blog' || page.slug === '404' || page.slug === 'properties') {
        pageData.layout = stripNestedIds(minimalPlaceholderLayout())
      }

      await payload.update({
        collection: 'pages',
        id: page.id,
        locale,
        data: pageData,
        context: { disableRevalidate: true },
      })
    }
  }

  await seedGlobalNavItems(payload, 'header', pageIds)
  await seedGlobalNavItems(payload, 'footer', pageIds)

  payload.logger.info('— Localized seed complete')
}
