import type { RequiredDataFromCollectionSlug } from 'payload'

import { lexicalHeading, lexicalParagraph, lexicalRoot } from '../lexical'
import { minimalPlaceholderLayout } from './minimalLayout'

export const privacyPolicyPage = (): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'privacy-policy',
  title: 'Политика конфиденциальности',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: lexicalRoot([
      lexicalHeading('Политика конфиденциальности'),
      lexicalParagraph('Политика конфиденциальности GPI.'),
    ]),
  },
  layout: minimalPlaceholderLayout(),
})
