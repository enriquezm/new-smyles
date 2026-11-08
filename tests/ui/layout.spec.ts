import { readdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

// Layout checks that run at every breakpoint (see playwright.config.ts projects).
// They assert rules from DESIGN_SPEC.md rather than comparing pixels, so design
// changes don't need new baselines. Screenshots are attached to the HTML report
// for a human look.

const themes = ['light', 'dark', 'retro'] as const
type Theme = typeof themes[number]

const posts = readdirSync('content/posts')
  .filter(file => file.endsWith('.md'))
  .map(file => `/posts/${file.slice(0, -3)}`)

/** Saves the theme before any page script runs, the same way the theme switcher does. */
async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t)
    }
    catch {
      // Storage blocked: the page falls back to the system theme.
    }
  }, theme)
}

async function open(page: Page, path: string, theme: Theme = 'light') {
  await setTheme(page, theme)
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
}

/** How many px the page is wider than the viewport (0 means no sideways scroll). */
function sidewaysOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
}

async function attachScreenshot(page: Page, name: string) {
  await test.info().attach(name, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
}

for (const theme of themes) {
  test(`home: no sideways scroll (${theme})`, async ({ page }) => {
    await open(page, '/', theme)
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0)
    await attachScreenshot(page, `home-${theme}`)
  })

  for (const post of posts) {
    test(`${post}: no sideways scroll (${theme})`, async ({ page }) => {
      await open(page, post, theme)
      expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0)
    })
  }
}

test('currently working on: names never run into their status chip', async ({ page }) => {
  await open(page, '/')
  const rows = page.locator('[data-project-row]')
  await expect(rows.first()).toBeVisible()

  async function checkRows() {
    for (const row of await rows.all()) {
      const [rowBox, nameBox, chipBox] = await Promise.all([
        row.boundingBox(),
        row.locator('[data-project-name]').boundingBox(),
        row.locator('[data-status-chip]').boundingBox(),
      ])
      if (!rowBox || !nameBox || !chipBox) throw new Error('Project row is not laid out')
      expect(nameBox.x + nameBox.width, 'name ends before the chip').toBeLessThanOrEqual(chipBox.x)
      expect(chipBox.x + chipBox.width, 'chip stays inside the row').toBeLessThanOrEqual(rowBox.x + rowBox.width + 0.5)
    }
  }

  await checkRows()

  // Stress test: a title too long for even the widest row must truncate, not overlap.
  await page.locator('[data-project-name]').first().evaluate((el) => {
    el.textContent = 'An extremely long project title that keeps going well past any reasonable width '.repeat(4)
  })
  await checkRows()
  await attachScreenshot(page, 'projects-long-title')
})

test('tap targets are at least 44px', async ({ page }) => {
  await open(page, '/')
  // WCAG exempts links inside running text, so only block-level targets are checked.
  const tooSmall = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('a, button')]
      .filter((el) => {
        const box = el.getBoundingClientRect()
        const style = getComputedStyle(el)
        return box.width > 0 && style.display !== 'inline' && style.visibility !== 'hidden'
          && (box.height < 44 || box.width < 44)
      })
      .map(el => `${el.tagName.toLowerCase()} "${el.getAttribute('aria-label') ?? el.textContent?.trim()}" ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`),
  )
  expect(tooSmall).toEqual([])
})

test('a card opens full width, focuses close, and Escape closes it', async ({ page }) => {
  await open(page, '/')
  const expand = page.getByRole('button', { name: /^Expand / }).first()
  const title = (await expand.getAttribute('aria-label'))!.replace(/^Expand /, '')
  await expand.click()

  const close = page.getByRole('button', { name: `Collapse ${title}` })
  await expect(close).toBeFocused()

  const card = page.locator('article[data-card]').filter({ has: close })
  const [cardBox, gridBox] = await Promise.all([card.boundingBox(), page.locator('#work').boundingBox()])
  if (!cardBox || !gridBox) throw new Error('Card grid is not laid out')
  expect(Math.abs(cardBox.width - gridBox.width), 'open card spans every column').toBeLessThanOrEqual(1)
  expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0)
  await attachScreenshot(page, 'card-open')

  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: `Expand ${title}` })).toBeFocused()
})
