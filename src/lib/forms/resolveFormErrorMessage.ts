import type { Messages } from '@/lib/i18n/getMessages'

type FormMessages = Messages['forms']

export function resolveFormErrorMessage(
  messages: FormMessages,
  errorKey: string | undefined,
): string {
  if (!errorKey) return messages.errorSubmitFailed

  const key = errorKey.startsWith('forms.') ? errorKey.slice('forms.'.length) : errorKey
  const message = messages[key as keyof FormMessages]

  return typeof message === 'string' ? message : messages.errorSubmitFailed
}
