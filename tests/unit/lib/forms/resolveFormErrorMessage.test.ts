import { describe, expect, it } from 'vitest'

import { resolveFormErrorMessage } from '@/lib/forms/resolveFormErrorMessage'
import { getMessages } from '@/lib/i18n/getMessages'

describe('resolveFormErrorMessage', () => {
  const messages = getMessages('ru').forms

  it('resolves short error keys', () => {
    expect(resolveFormErrorMessage(messages, 'errorNameRequired')).toBe('Укажите имя')
  })

  it('resolves legacy keys with forms. prefix', () => {
    expect(resolveFormErrorMessage(messages, 'forms.errorNameRequired')).toBe('Укажите имя')
  })

  it('falls back when key is unknown', () => {
    expect(resolveFormErrorMessage(messages, 'unknownKey')).toBe(messages.errorSubmitFailed)
  })
})
