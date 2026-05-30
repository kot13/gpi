import { test, expect } from '@playwright/test'

test.describe('Blog @ru', () => {
  test('blog list loads', async ({ page }) => {
    await page.goto('/ru/blog')
    await expect(page.locator('h1')).toContainText('Блог')
  })

  test('blog post page loads when posts exist', async ({ page }) => {
    await page.goto('/ru/blog')
    const firstLink = page.locator('article h3 a').first()
    if ((await firstLink.count()) === 0) test.skip()
    await firstLink.click()
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('Blog locales', () => {
  for (const locale of ['ru', 'ka', 'en'] as const) {
    test(`${locale} blog list loads @${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/blog`)
      await expect(page.locator('header')).toBeVisible()
    })
  }
})
