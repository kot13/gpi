import { test, expect } from '@playwright/test'

test.describe('Pages @ru', () => {
  test('redirects root to /ru', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/ru/)
  })

  test('home page loads', async ({ page }) => {
    await page.goto('/ru')
    await expect(page.locator('header')).toBeVisible()
  })
})

test.describe('Responsive @ru', () => {
  test('no horizontal scroll on home', async ({ page }) => {
    await page.goto('/ru')
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
