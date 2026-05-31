import { test, expect } from '@playwright/test'

test.describe('Home slideshow', () => {
  test('shows slideshow hero with timeline on /ru after seed', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/ru')

    const carousel = page.locator('section.gpi-slideshow')
    await expect(carousel).toBeVisible({ timeout: 15000 })

    const tabs = carousel.getByRole('tab')
    await expect(tabs.first()).toBeVisible()
    const tabCount = await tabs.count()
    expect(tabCount).toBeGreaterThanOrEqual(2)

    await expect(carousel.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })

  test('navigates to next slide with arrow', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/ru')

    const carousel = page.locator('section.gpi-slideshow')
    await expect(carousel).toBeVisible({ timeout: 15000 })

    const firstTitle = await carousel.getByRole('heading', { level: 1 }).first().textContent()
    await carousel.getByLabel('Следующий слайд').click()
    await expect(carousel.getByRole('heading', { level: 1 }).first()).not.toHaveText(
      firstTitle ?? '',
    )
  })

  test('timeline tab switches slide', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/ru')

    const carousel = page.locator('section.gpi-slideshow')
    await expect(carousel).toBeVisible({ timeout: 15000 })

    const secondTab = carousel.getByRole('tab', { name: 'Слайд 2' })
    await secondTab.click()
    await expect(secondTab).toHaveAttribute('aria-selected', 'true')
  })

  test('keyboard focuses timeline and arrows', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/ru')

    const carousel = page.locator('section.gpi-slideshow')
    await expect(carousel).toBeVisible({ timeout: 15000 })

    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  test('respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/ru')

    const carousel = page.locator('section.gpi-slideshow')
    await expect(carousel).toBeVisible({ timeout: 15000 })
    await expect(carousel).not.toHaveClass(/gpi-slideshow--motion/)
  })

  test('localized slideshow on /ka and /en', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    await page.goto('/ka')
    await expect(page.locator('section.gpi-slideshow')).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(
      /გამოწერა|Pontus|Krtsanisi/i,
    )

    await page.goto('/en')
    await expect(page.locator('section.gpi-slideshow')).toBeVisible({ timeout: 15000 })
    await expect(page.getByLabel('Next slide')).toBeVisible()
  })

  test('mobile layout without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 667 })
    await page.goto('/ru')

    await expect(page.locator('section.gpi-slideshow')).toBeVisible({ timeout: 15000 })

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
