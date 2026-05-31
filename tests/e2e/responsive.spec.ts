import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 320, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
] as const

for (const vp of viewports) {
  test.describe(`Responsive ${vp.name} @ru`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test('no horizontal scroll on home', async ({ page }) => {
      await page.goto('/ru')
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })

    test('single h1 on home', async ({ page }) => {
      await page.goto('/ru')
      await expect(page.locator('main h1')).toHaveCount(1)
    })

    test('no horizontal scroll on blog', async ({ page }) => {
      await page.goto('/ru/blog')
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  })
}
