import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ContactMethodPicker } from '@/components/forms/ContactMethodPicker'
import { getMessages } from '@/lib/i18n/getMessages'

const labels = getMessages('ru').forms

describe('ContactMethodPicker', () => {
  it('calls onChange when another method is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<ContactMethodPicker value="phone" onChange={onChange} labels={labels} />)

    await user.click(screen.getByRole('radio', { name: labels.methodTelegram }))
    expect(onChange).toHaveBeenCalledWith('telegram')
  })
})
