import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { DEFAULT_LOCALE, getLocalizedPath, type Locale } from '@/lib/i18n/config'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

function createJsxConverters(locale: Locale): JSXConvertersFunction<NodeTypes> {
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }: { linkNode: SerializedLinkNode }) => {
        const doc = linkNode.fields.doc
        if (!doc) return '#'
        const { value, relationTo } = doc
        if (typeof value !== 'object' || !value || !('slug' in value) || !value.slug) return '#'
        const slug = value.slug as string
        if (relationTo === 'posts') return getLocalizedPath(locale, `/blog/${slug}`)
        if (slug === 'home') return getLocalizedPath(locale, '')
        return getLocalizedPath(locale, `/${slug}`)
      },
    }),
    blocks: {
      banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-start-1 col-span-3"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
      cta: ({ node }) => <CallToActionBlock {...node.fields} locale={locale} />,
    },
  })
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  locale?: Locale
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, locale = DEFAULT_LOCALE, ...rest } =
    props
  return (
    <ConvertRichText
      converters={createJsxConverters(locale)}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'gpi-prose': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
