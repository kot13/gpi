export const CONTACT_FIELD_HEIGHT = 'h-12 min-h-12'

export const contactTextInputClassName = (invalid?: boolean) =>
  [
    'w-full rounded-full bg-white px-4 text-base text-gpi-text outline-none placeholder:text-gpi-muted',
    CONTACT_FIELD_HEIGHT,
    invalid ? 'ring-2 ring-red-500' : '',
  ]
    .filter(Boolean)
    .join(' ')

export const contactPhoneShellClassName = (invalid?: boolean) =>
  [
    'flex items-center gap-2 rounded-full bg-white px-3 text-base text-gpi-text',
    CONTACT_FIELD_HEIGHT,
    invalid ? 'ring-2 ring-red-500' : '',
  ]
    .filter(Boolean)
    .join(' ')
