import React from 'react'

import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { cn } from '@/utilities/ui'

type Props = {
  data: DefaultTypedEditorState
  className?: string
  enableGutter?: boolean
}

/** Lexical renderer for CMS pages — headings start at h2 to avoid duplicate h1 with page title */
export function PageRichText({ data, className, enableGutter = true }: Props) {
  return (
    <RichText
      className={cn('[&_h1]:text-2xl [&_h1]:font-bold gpi-prose', className)}
      data={data}
      enableGutter={enableGutter}
      enableProse={false}
    />
  )
}
