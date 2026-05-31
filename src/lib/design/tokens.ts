/** GPI design tokens — mirrors contracts/design-tokens.md */
export const GPI_TOKENS = {
  colors: {
    brand: '#7E2226',
    text: '#414141',
    bg: '#FFFFFF',
    bgSecondary: '#F5F5F5',
    muted: '#999999',
    border: '#E5E5E5',
  },
  fonts: {
    body: 'var(--font-gpi-body)',
    heading: 'var(--font-gpi-heading)',
  },
  layout: {
    headerHeight: '70px',
    containerMax: '1160px',
    radiusCard: '16px',
  },
  breakpoints: {
    burgerMax: 980,
  },
} as const

export const GPI_CSS_VARS = [
  '--color-gpi-brand',
  '--color-gpi-text',
  '--color-gpi-bg',
  '--color-gpi-bg-secondary',
  '--color-gpi-muted',
  '--color-gpi-border',
  '--font-gpi-body',
  '--font-gpi-heading',
] as const
