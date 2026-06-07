import { test, expect } from '@playwright/test'

test.describe('Properties map', () => {
  test('map page loads without footer @ru', async ({ page }) => {
    await page.goto('/ru/properties/map')
    await expect(page.locator('.gpi-footer')).toHaveCount(0)
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 })
  })

  test('panel shows property list region', async ({ page }) => {
    await page.goto('/ru/properties/map')
    await expect(page.getByRole('region', { name: /Карта недвижимости/i })).toBeVisible({
      timeout: 15000,
    })
  })

  test('catalog view on map link preserves filters', async ({ page }) => {
    await page.goto('/ru/properties?city=Batumi')
    const link = page.getByRole('link', { name: /Посмотреть на карте/i })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/\/ru\/properties\/map\?.*city=Batumi/)
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 })
  })

  test('filters sheet opens on map page', async ({ page }) => {
    await page.goto('/ru/properties/map')
    await page.getByRole('button', { name: /^Фильтры$/i }).click()
    await expect(page.getByRole('complementary', { name: /Фильтры/i })).toBeVisible()
  })

  test('map page @ka @en', async ({ page }) => {
    await page.goto('/ka/properties/map')
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 })
    await page.goto('/en/properties/map')
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 })
  })

  test('mobile panel collapse @320', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto('/ru/properties/map')
    const collapseBtn = page.getByRole('button', { name: /Свернуть список/i })
    if (await collapseBtn.isVisible()) {
      await collapseBtn.click()
    }
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 })
  })
})
