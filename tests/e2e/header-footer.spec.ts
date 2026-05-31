import { test, expect } from '@playwright/test'

test.describe('Header and Footer @ru', () => {
  test('header and footer visible on home', async ({ page }) => {
    await page.goto('/ru')
    await expect(page.locator('header.gpi-header')).toBeVisible()
    await expect(page.locator('footer.gpi-footer')).toBeVisible()
  })

  test('desktop nav visible at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/ru')
    await expect(page.locator('header nav ul')).toBeVisible()
    await expect(page.getByLabel('Открыть меню')).toBeHidden()
  })

  test('burger menu at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/ru')
    const burger = page.getByLabel('Открыть меню')
    await expect(burger).toBeVisible()
    await burger.click()
    await expect(page.getByRole('dialog', { name: 'Навигация' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Навигация' })).toBeHidden()
  })

  test('footer legal block present after seed', async ({ page }) => {
    await page.goto('/ru')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('language switcher shows RU KA EN', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/ru')
    await expect(page.getByRole('link', { name: 'RU' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'KA' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'EN' })).toBeVisible()
  })
})

test.describe('Header locales', () => {
  for (const locale of ['ru', 'ka', 'en'] as const) {
    test(`header visible @${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`)
      await expect(page.locator('header')).toBeVisible()
    })
  }
})
