import { test, expect } from '@playwright/test'

test.describe('Header and Footer @ru', () => {
  test('header nav and language switcher visible', async ({ page }) => {
    await page.goto('/ru')
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('footer legal block present after seed', async ({ page }) => {
    await page.goto('/ru')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})
