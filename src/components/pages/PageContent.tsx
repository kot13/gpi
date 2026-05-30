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
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">{title}</h1>
      <div className="prose prose-invert max-w-none gpi-prose">
        <PageRichText data={content} enableGutter={false} />
      </div>
    </article>
  )
}
