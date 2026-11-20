import { readdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

// Layout checks that run at every breakpoint (see playwright.config.ts projects).
// They assert rules from DESIGN_SPEC.md rather than comparing pixels, so design
// changes don't need new baselines. Screenshots are attached to the HTML report
// for a human look.

const themes = ['light', 'dark', 'retro', 'pop'] as const
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

test('location globe renders inside its card and never blocks the expand button', async ({ page }) => {
  await open(page, '/')
  const expand = page.getByRole('button', { name: 'Expand Location' })
  const card = page.locator('article[data-card]').filter({ has: expand })
  const canvas = card.locator('canvas')
  await card.scrollIntoViewIfNeeded()
  await expect(canvas).toBeVisible()

  const [cardBox, canvasBox] = await Promise.all([card.boundingBox(), canvas.boundingBox()])
  if (!cardBox || !canvasBox) throw new Error('Location card is not laid out')
  expect(canvasBox.width, 'canvas fits the card').toBeLessThanOrEqual(cardBox.width + 0.5)
  expect(canvasBox.height, 'canvas fits the card').toBeLessThanOrEqual(cardBox.height + 0.5)

  // A click on the globe itself must reach the card's overlay button.
  await page.mouse.click(canvasBox.x + canvasBox.width * 0.75, canvasBox.y + canvasBox.height * 0.4)
  await expect(page.getByRole('button', { name: 'Collapse Location' })).toBeFocused()
  await attachScreenshot(page, 'location-open')
})

test('hero avatar keeps its accessible photo and the low-poly canvas stays inside the tile', async ({ page }) => {
  await open(page, '/')
  const photo = page.locator('section[aria-label="Intro"] img').first()
  await expect(photo).toHaveAttribute('alt', /.+/)
  const tile = photo.locator('..')
  const canvas = tile.locator('canvas')
  await expect(canvas).toBeVisible()

  const [tileBox, canvasBox] = await Promise.all([tile.boundingBox(), canvas.boundingBox()])
  if (!tileBox || !canvasBox) throw new Error('Hero avatar is not laid out')
  expect(Math.abs(canvasBox.width - tileBox.width), 'canvas matches the tile').toBeLessThanOrEqual(1)
  expect(Math.abs(canvasBox.height - tileBox.height), 'canvas matches the tile').toBeLessThanOrEqual(1)
})

test('github skyline fits the open card without sideways scroll', async ({ page }) => {
  await open(page, '/')
  await page.getByRole('button', { name: /^Expand GitHub/ }).click()
  const skyline = page.getByRole('group', { name: /^Contribution skyline/ })
  const canvas = skyline.locator('canvas')
  await expect(canvas).toBeVisible()

  const [skylineBox, canvasBox] = await Promise.all([skyline.boundingBox(), canvas.boundingBox()])
  if (!skylineBox || !canvasBox) throw new Error('Skyline is not laid out')
  expect(Math.abs(canvasBox.width - skylineBox.width), 'canvas fills the skyline box').toBeLessThanOrEqual(1)
  expect(Math.abs(canvasBox.height - skylineBox.height), 'canvas fills the skyline box').toBeLessThanOrEqual(1)
  expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0)
  await attachScreenshot(page, 'github-skyline')
})

test('github skyline rotates by drag and keyboard, and resets', async ({ page }) => {
  await open(page, '/')
  await page.getByRole('button', { name: /^Expand GitHub/ }).click()
  const view = page.getByRole('img', { name: /^3D contribution skyline/ })
  await expect(view).toBeVisible()
  const reset = page.getByRole('button', { name: 'Reset view' })
  const collapse = page.getByRole('button', { name: /^Collapse GitHub/ })

  // Mouse drag rotates, shows Reset, and doesn't close the card.
  const box = await view.boundingBox()
  if (!box) throw new Error('Skyline is not laid out')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 - 120, box.y + box.height / 2 + 40, { steps: 6 })
  await page.mouse.up()
  await expect(reset).toBeVisible()
  await expect(collapse).toBeVisible()
  const resetBox = await reset.boundingBox()
  expect(resetBox?.height ?? 0, 'Reset is a 44px target').toBeGreaterThanOrEqual(44)
  await reset.click()
  await expect(reset).toBeHidden()

  // Arrow keys rotate; the first Escape resets the view, the next closes the card.
  await view.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(reset).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(reset).toBeHidden()
  await expect(collapse).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: /^Expand GitHub/ })).toBeVisible()
})

test.describe('wandering cat', () => {
  // The suite runs with reduced motion, which keeps the cat away; let it visit here.
  test.use({ reducedMotion: 'no-preference' })

  test('walks in, purrs when petted, walks off, and never scrolls the page sideways', async ({ page }) => {
    await open(page, '/?cat')
    const cat = page.getByRole('button', { name: /Pet the cat/ })
    await expect(cat).toBeVisible({ timeout: 5000 })
    const box = await cat.boundingBox()
    expect(box?.width ?? 0, 'cat is a 44px target').toBeGreaterThanOrEqual(44)
    expect(box?.height ?? 0, 'cat is a 44px target').toBeGreaterThanOrEqual(44)
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0)

    await cat.click()
    await expect(page.locator('[aria-live="polite"]').filter({ hasText: /purrs/ })).toBeAttached()
    await expect(page.locator('[data-cat] .animate-purr-float').first()).toBeAttached()
    await attachScreenshot(page, 'cat-purring')

    await expect(cat).toBeHidden({ timeout: 15000 })
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0)
  })
})

test.describe('cat and fish', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('clicking the fish brings the cat, which carries it off and still purrs when petted', async ({ page }) => {
    await open(page, '/?cat')
    // Every frame, count canvases whose WebGL context is gone but are still on screen:
    // Chrome paints those as a white box (the flash this guards against).
    await page.evaluate(() => {
      const w = window as Window & { deadCanvasFrames?: number }
      w.deadCanvasFrames = 0
      const tick = () => {
        for (const c of document.querySelectorAll('canvas')) {
          const gl = c.getContext('webgl2') ?? c.getContext('webgl')
          if (gl?.isContextLost() && c.checkVisibility({ visibilityProperty: true })) w.deadCanvasFrames! += 1
        }
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    const fish = page.getByRole('button', { name: /fish on the floor/ })
    await expect(fish).toBeVisible({ timeout: 5000 })
    const fishBox = await fish.boundingBox()
    expect(fishBox?.height ?? 0, 'fish is a 44px target').toBeGreaterThanOrEqual(44)
    await fish.click()
    await expect(page.locator('[aria-live="polite"]').filter({ hasText: /coming for the fish/ })).toBeAttached()

    // It may first finish a wander; either way it comes for the fish and picks it up.
    await expect(page.locator('[data-fish]')).toHaveCount(0, { timeout: 20000 })
    const cat = page.getByRole('button', { name: /Pet the cat/ })
    await expect(cat).toBeVisible()
    await cat.click()
    await expect(page.locator('[data-cat] .animate-purr-float').first()).toBeAttached()
    await attachScreenshot(page, 'cat-carrying-fish')

    await expect(page.locator('[data-cat]')).toHaveCount(0, { timeout: 20000 })
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0)
    expect(
      await page.evaluate(() => (window as Window & { deadCanvasFrames?: number }).deadCanvasFrames),
      'no frame shows a torn-down canvas',
    ).toBe(0)
  })
})

test('the cat and fish stay away with reduced motion', async ({ page }) => {
  await open(page, '/?cat')
  await page.waitForTimeout(1500)
  await expect(page.locator('[data-cat]')).toHaveCount(0)
  await expect(page.locator('[data-fish]')).toHaveCount(0)
})
