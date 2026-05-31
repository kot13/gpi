import type { RequiredDataFromCollectionSlug } from 'payload'

import { lexicalHeading, lexicalRoot } from './lexical'

// Fallback when home is not in the database (no media ids available)
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  title: 'GPI — Georgia Private Investment',
  hero: {
    type: 'lowImpact',
    richText: lexicalRoot([lexicalHeading('GPI — Georgia Private Investment')]),
  },
  layout: [],
}
