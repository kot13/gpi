import type { RequiredDataFromCollectionSlug } from 'payload'

import { lexicalHeading, lexicalParagraph, lexicalRoot } from '../lexical'
import { minimalPlaceholderLayout } from './minimalLayout'

export const blogPage = (): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'blog',
  title: 'Блог',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: lexicalRoot([
      lexicalHeading('Блог GPI'),
      lexicalParagraph('Мы делимся только проверенной информацией'),
      lexicalParagraph('Откройте мир знаний о недвижимости ГРУЗИИ'),
      lexicalParagraph('Средняя скорость прочтения 1 блога от 3 до 5 мин'),
    ]),
  },
  layout: minimalPlaceholderLayout(),
})
