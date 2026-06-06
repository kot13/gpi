import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PhoneContactInput } from '@/components/forms/PhoneContactInput'
import { getDefaultCountry } from '@/lib/forms/countries'
import { getMessages } from '@/lib/i18n/getMessages'

const labels = getMessages('ru').forms
const defaultCountry = getDefaultCountry()

describe('PhoneContactInput', () => {
  it('shows country-specific placeholder', () => {
    render(
      <PhoneContactInput
        countryCode={defaultCountry.code}
        dialCode={defaultCountry.dialCode}
        value=""
        onCountryChange={vi.fn()}
        onValueChange={vi.fn()}
        placeholder={labels.phonePlaceholder}
        selectCountryLabel={labels.selectCountry}
      />,
    )

    expect(screen.getByPlaceholderText('000 00 00 00')).toBeInTheDocument()
  })

  it('formats phone value on input', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <PhoneContactInput
        countryCode={defaultCountry.code}
        dialCode={defaultCountry.dialCode}
        value=""
        onCountryChange={vi.fn()}
        onValueChange={onValueChange}
        placeholder={labels.phonePlaceholder}
        selectCountryLabel={labels.selectCountry}
      />,
    )

    await user.type(screen.getByPlaceholderText('000 00 00 00'), '555123456')
    expect(onValueChange).toHaveBeenLastCalledWith('555 12 34 56')
  })

  it('formats pasted digits on blur', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <PhoneContactInput
        countryCode={defaultCountry.code}
        dialCode={defaultCountry.dialCode}
        value="111111111"
        onCountryChange={vi.fn()}
        onValueChange={onValueChange}
        placeholder={labels.phonePlaceholder}
        selectCountryLabel={labels.selectCountry}
      />,
    )

    await user.click(screen.getByDisplayValue('111111111'))
    await user.tab()
    expect(onValueChange).toHaveBeenCalledWith('111 11 11 11')
  })
})
