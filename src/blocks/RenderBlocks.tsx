import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MapBlockComponent } from '@/blocks/MapBlock/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  mapBlock: MapBlockComponent,
  mediaBlock: MediaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale: Locale
}> = (props) => {
  const { blocks, locale } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType] as unknown as React.FC<
              Record<string, unknown> & { locale?: Locale; disableInnerContainer?: boolean }
            >

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block
                    {...block}
                    locale={locale}
                    {...(blockType === 'mediaBlock' ? { disableInnerContainer: true } : {})}
                  />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
