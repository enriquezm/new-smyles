import { useMutationObserver } from '@vueuse/core'

/** Reads a colour token (e.g. `cat-fur` for --color-cat-fur) from the active theme. */
export function readColorToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()
}

/** Runs `paint` now and again whenever the theme changes. Client-only (call inside a canvas scene). */
export function useThemeRepaint(paint: () => void) {
  paint()
  useMutationObserver(() => document.documentElement, paint, { attributes: true, attributeFilter: ['data-theme'] })
}
