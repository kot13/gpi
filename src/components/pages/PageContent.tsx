import React from 'react'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { PageRichText } from './RichText'
import { cn } from '@/utilities/ui'

type Props = {
  title: string
  content: DefaultTypedEditorState
  className?: string
}

export function PageContent({ title, content, className }: Props) {
  return (
    <article className={cn('container py-12 max-w-3xl mx-auto', className)}>
      <h1 className="text-3xl md:text-5xl font-bold text-gpi-text mb-8 font-gpi-heading leading-tight">
        {title}
      </h1>
      <div className="gpi-prose">
        <PageRichText data={content} enableGutter={false} />
      </div>
    </article>
  )
}
