import type { RequiredDataFromCollectionSlug } from 'payload'

import { lexicalHeading, lexicalParagraph, lexicalRoot } from '../lexical'
import { minimalPlaceholderLayout } from './minimalLayout'

export const propertiesPage = (): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'properties',
  title: 'Каталог недвижимости',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: lexicalRoot([
      lexicalHeading('Каталог недвижимости'),
      lexicalParagraph('Актуальные предложения GPI в Батуми и Тбилиси'),
    ]),
  },
  layout: minimalPlaceholderLayout(),
})
