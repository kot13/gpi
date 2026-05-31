import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  locale?: string
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, locale = 'ru' } = props

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <Card
                className="h-full"
                doc={result}
                key={result.slug ?? index}
                relationTo="posts"
                locale={locale}
                showCategories
              />
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
