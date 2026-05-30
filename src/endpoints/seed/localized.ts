import type { Payload } from 'payload'

import { LOCALES, type Locale } from '@/lib/i18n/config'

type LocalizedCategory = {
  id: string | number
  ru: { title: string; slug: string; description?: string }
  ka: { title: string; slug: string; description?: string }
  en: { title: string; slug: string; description?: string }
}

// Reserved for when categories.title is localized (requires `npm run db:push`)
const _categoryTranslations: Record<string, Omit<LocalizedCategory, 'id'>> = {
  Technology: {
    ru: { title: 'Технологии', slug: 'technology', description: 'Новости технологий' },
    ka: { title: 'ტექნოლოგიები', slug: 'technology', description: 'ტექნოლოგიების სიახლეები' },
    en: { title: 'Technology', slug: 'technology', description: 'Technology news' },
  },
  News: {
    ru: { title: 'Новости', slug: 'news', description: 'Актуальные новости' },
    ka: { title: 'სიახლეები', slug: 'news', description: 'აქტუალური სიახლეები' },
    en: { title: 'News', slug: 'news', description: 'Latest news' },
  },
  Finance: {
    ru: { title: 'Финансы', slug: 'finance', description: 'Финансы и инвестиции' },
    ka: { title: 'ფინანსები', slug: 'finance', description: 'ფინანსები და ინვესტიციები' },
    en: { title: 'Finance', slug: 'finance', description: 'Finance and investment' },
  },
  Design: {
    ru: { title: 'Дизайн', slug: 'design', description: 'Дизайн и архитектура' },
    ka: { title: 'დიზაინი', slug: 'design', description: 'დიზაინი და არქიტექტურა' },
    en: { title: 'Design', slug: 'design', description: 'Design and architecture' },
  },
  Software: {
    ru: { title: 'Софт', slug: 'software', description: 'Программное обеспечение' },
    ka: { title: 'პროგრამები', slug: 'software', description: 'პროგრამული უზრუნველყოფა' },
    en: { title: 'Software', slug: 'software', description: 'Software industry' },
  },
  Engineering: {
    ru: { title: 'Инженерия', slug: 'engineering', description: 'Инженерные решения' },
    ka: { title: 'ინჟინერია', slug: 'engineering', description: 'საინჟინრო გადაწყვეტილებები' },
    en: { title: 'Engineering', slug: 'engineering', description: 'Engineering solutions' },
  },
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

const homeTranslations: Record<Locale, { title: string }> = {
  ru: { title: 'GPI — Georgia Private Investment' },
  ka: { title: 'GPI — Georgia Private Investment' },
  en: { title: 'GPI — Georgia Private Investment' },
}

const headerNavTranslations: Record<Locale, Array<{ label: string; url: string }>> = {
  ru: [
    { label: 'Каталог', url: 'https://gpi-realty.ge/' },
    { label: 'Блог', url: '/ru/blog' },
    { label: 'Контакты', url: '/ru/contacts' },
  ],
  ka: [
    { label: 'კატალოგი', url: 'https://gpi-realty.ge/' },
    { label: 'ბლოგი', url: '/ka/blog' },
    { label: 'კონტაქტი', url: '/ka/contacts' },
  ],
  en: [
    { label: 'Catalog', url: 'https://gpi-realty.ge/' },
    { label: 'Blog', url: '/en/blog' },
    { label: 'Contacts', url: '/en/contacts' },
  ],
}

export async function seedLocalizedContent(payload: Payload): Promise<void> {
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

  const homePage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  if (homePage.docs[0]) {
    for (const locale of LOCALES) {
      await payload.update({
        collection: 'pages',
        id: homePage.docs[0].id,
        locale,
        data: homeTranslations[locale],
        context: { disableRevalidate: true },
      })
    }
  }

  for (const locale of LOCALES) {
    await payload.updateGlobal({
      slug: 'header',
      locale,
      data: {
        navItems: headerNavTranslations[locale].map((item) => ({
          link: { type: 'custom' as const, label: item.label, url: item.url },
        })),
      },
      context: { disableRevalidate: true },
    })
  }

  payload.logger.info('— Localized seed complete')
}
