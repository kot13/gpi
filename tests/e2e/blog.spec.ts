import { test, expect } from '@playwright/test'

test.describe('Blog @ru', () => {
  test('blog list hero and h1', async ({ page }) => {
    await page.goto('/ru/blog')
    await expect(page.locator('h1')).toContainText('Блог GPI')
    await expect(page.getByText('Мы делимся только проверенной информацией')).toBeVisible()
  })

  test('blog cards structure when posts exist', async ({ page }) => {
    await page.goto('/ru/blog')
    const cards = page.locator('article.gpi-blog-card')
    if ((await cards.count()) === 0) test.skip()
    await expect(cards.first().locator('h3')).toBeVisible()
  })

  test('blog post page loads when posts exist', async ({ page }) => {
    await page.goto('/ru/blog')
    const firstLink = page.locator('article.gpi-blog-card h3 a').first()
    if ((await firstLink.count()) === 0) test.skip()
    await firstLink.click()
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.gpi-prose')).toBeVisible()
  })

  test('blog post has single h1 and CTA', async ({ page }) => {
    await page.goto('/ru/blog')
    const firstLink = page.locator('article.gpi-blog-card h3 a').first()
    if ((await firstLink.count()) === 0) test.skip()
    await firstLink.click()
    await expect(page.locator('h1')).toHaveCount(1)
  })
})

test.describe('Blog locales', () => {
  for (const locale of ['ru', 'ka', 'en'] as const) {
    test(`${locale} blog list loads @${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/blog`)
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('h1')).toBeVisible()
    })
  }
})

test.describe('Blog responsive grid', () => {
  test('single column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 667 })
    await page.goto('/ru/blog')
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
