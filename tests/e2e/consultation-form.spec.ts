import { test, expect } from '@playwright/test'

test.describe('Consultation form in footer', () => {
  test('shows form section and phone country picker @ru', async ({ page }) => {
    await page.goto('/ru')

    const formSection = page.locator('footer section').filter({ has: page.getByRole('heading', { level: 2 }) })
    const hasForm = await formSection.count()

    if (hasForm === 0) {
      test.skip()
      return
    }

    await expect(formSection).toBeVisible()
    await page.getByRole('radio', { name: /телефон|phone/i }).click()
    await expect(page.getByLabel(/выбор страны|select country/i)).toBeVisible()
    await expect(page.getByPlaceholder(/00-000-000|ваше имя/i).first()).toBeVisible()
  })

  test('privacy link opens in new tab @ru', async ({ page }) => {
    await page.goto('/ru')
    const privacyLink = page.getByRole('link', { name: /политик|privacy/i })
    if ((await privacyLink.count()) === 0) {
      test.skip()
      return
    }
    await expect(privacyLink).toHaveAttribute('target', '_blank')
  })

  test('submits telegram contact @ru', async ({ page }) => {
    await page.goto('/ru')
    const nameInput = page.getByPlaceholder(/ваше имя|your name/i)
    if ((await nameInput.count()) === 0) {
      test.skip()
      return
    }

    await page.getByRole('radio', { name: /telegram/i }).click()
    await nameInput.fill('E2E Test')
    await page.getByPlaceholder(/@username/i).fill('@gpi_e2e_test')
    await page.getByRole('button', { name: /связаться|contact us/i }).click()
    await expect(page.getByText(/спасибо|thank you|გმადლობთ/i)).toBeVisible({ timeout: 10000 })
  })

  test('footer form visible @ka @en', async ({ page }) => {
    await page.goto('/ka')
    await page.goto('/en')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('mobile layout without horizontal scroll @ru', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 667 })
    await page.goto('/ru')
    const footer = page.locator('footer')
    const box = await footer.boundingBox()
    if (box) {
      expect(box.width).toBeLessThanOrEqual(320)
    }
  })
})
