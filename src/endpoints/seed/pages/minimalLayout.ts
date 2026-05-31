import type { Page } from '@/payload-types'

import { lexicalParagraph, lexicalRoot } from '../lexical'

/** Satisfies required `layout` field; not rendered on blog/404 routes (hero-only). */
export function minimalPlaceholderLayout(): Page['layout'] {
  return [
    {
      blockType: 'content',
      columns: [
        {
          size: 'full',
          richText: lexicalRoot([lexicalParagraph(' ')]),
        },
      ],
    },
  ]
}
