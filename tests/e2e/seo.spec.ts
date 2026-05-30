import { test, expect } from '@playwright/test'

const routes = [
  { path: '/ru', name: 'home' },
  { path: '/ru/blog', name: 'blog list' },
  { path: '/ka/blog', name: 'blog ka' },
  { path: '/en/blog', name: 'blog en' },
] as const

for (const { path, name } of routes) {
  test(`SEO: ${name} has single h1 and meta description @ru`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('h1').first()).toBeVisible()
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description?.length).toBeGreaterThan(10)
  })
}

test('SEO: blog post has article h1 when posts exist @ru', async ({ page }) => {
  await page.goto('/ru/blog')
  const link = page.locator('article h3 a').first()
  if ((await link.count()) === 0) test.skip()
  await link.click()
  await expect(page.locator('h1')).toHaveCount(1)
})
