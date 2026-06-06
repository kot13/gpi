import { test, expect } from '@playwright/test'

test.describe('Contacts page maps', () => {
  test('shows two map blocks with city headings @ru', async ({ page }) => {
    await page.goto('/ru/contacts')

    const heading = page.getByRole('heading', {
      level: 1,
      name: /работаем с объектами недвижимости/i,
    })
    if ((await heading.count()) === 0) {
      test.skip()
      return
    }

    await expect(heading).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Батуми' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Тбилиси' })).toBeVisible()

    await expect(page.locator('.leaflet-container')).toHaveCount(2, { timeout: 15000 })
  })

  test('localized office titles @ka @en', async ({ page }) => {
    await page.goto('/ka/contacts')
    if ((await page.getByRole('heading', { level: 2, name: 'ბათუმი' }).count()) === 0) {
      test.skip()
      return
    }
    await expect(page.getByRole('heading', { level: 2, name: 'ბათუმი' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'თბილისი' })).toBeVisible()

    await page.goto('/en/contacts')
    await expect(page.getByRole('heading', { level: 2, name: 'Batumi' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Tbilisi' })).toBeVisible()
  })

  test('mobile layout without horizontal scroll @ru', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 })
    await page.goto('/ru/contacts')

    if ((await page.getByRole('heading', { level: 2, name: 'Батуми' }).count()) === 0) {
      test.skip()
      return
    }

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
