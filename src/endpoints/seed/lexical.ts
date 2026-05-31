const LEXICAL_VERSION = 1 as const

type LexicalTextNode = {
  type: 'text'
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  version: 1
}

type LexicalElementNode = {
  type: string
  children: unknown[]
  direction: 'ltr'
  format: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify'
  indent: number
  version: 1
  tag?: string
  fields?: Record<string, unknown>
}

function textNode(text: string): LexicalTextNode {
  return {
    type: 'text',
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    version: LEXICAL_VERSION,
  }
}

export function lexicalRoot(children: LexicalElementNode[]) {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: LEXICAL_VERSION,
    },
  }
}

export function lexicalHeading(text: string, tag: 'h1' | 'h2' | 'h3' = 'h1') {
  return {
    type: 'heading',
    children: [textNode(text)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    tag,
    version: LEXICAL_VERSION,
  }
}

export function lexicalParagraph(text: string) {
  return {
    type: 'paragraph',
    children: [textNode(text)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: LEXICAL_VERSION,
  }
}
