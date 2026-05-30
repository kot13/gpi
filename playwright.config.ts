import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const LOCALES = ['ru', 'ka', 'en'] as const
const VIEWPORTS = [
  { name: 'mobile', width: 320, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
] as const

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    ...LOCALES.flatMap((locale) =>
      VIEWPORTS.map((vp) => ({
        name: `${locale}-${vp.name}`,
        use: {
          ...devices['Desktop Chrome'],
          viewport: { width: vp.width, height: vp.height },
        },
        grep: new RegExp(`@${locale}`),
      })),
    ),
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:3000',
  },
})
