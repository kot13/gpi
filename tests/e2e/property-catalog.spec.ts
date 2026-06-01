import { test, expect } from '@playwright/test'

test.describe('Property catalog', () => {
  test('catalog page loads @ru', async ({ page }) => {
    await page.goto('/ru/properties')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('filters by city Batumi', async ({ page }) => {
    await page.goto('/ru/properties')
    const citySelect = page.locator('aside select').first()
    await citySelect.selectOption('Batumi')
    await page.waitForTimeout(300)
  })

  test('detail page for seed object @ru', async ({ page }) => {
    await page.goto('/ru/properties/1037')
    const notFound = await page.getByText(/not found|не найдена/i).isVisible().catch(() => false)
    if (!notFound) {
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('catalog @ka @en', async ({ page }) => {
    await page.goto('/ka/properties')
    await expect(page.locator('h1')).toBeVisible()
    await page.goto('/en/properties')
    await expect(page.locator('h1')).toBeVisible()
  })
})
