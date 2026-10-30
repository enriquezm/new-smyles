import { createSharedComposable, tryOnMounted } from '@vueuse/core'
import { themes } from '~/data/site'
import type { ThemeId } from '~/data/site'

const STORAGE_KEY = 'theme'

/**
 * Runs in <head> before first paint: applies the saved theme, or the system
 * light/dark preference when nothing is saved, so the static HTML never flashes.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(${JSON.stringify(themes.map(t => t.id))}.indexOf(t)<0)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}})()`

function isThemeId(value: unknown): value is ThemeId {
  return themes.some(t => t.id === value)
}

/** The active theme, kept on <html data-theme> and in localStorage. */
export const useTheme = createSharedComposable(() => {
  // Static HTML renders as light; the real value is read after hydration.
  const theme = ref<ThemeId>('light')

  tryOnMounted(() => {
    const current = document.documentElement.dataset.theme
    if (isThemeId(current)) theme.value = current
  })

  function setTheme(next: ThemeId) {
    theme.value = next
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    }
    catch {
      // Storage can be blocked (private mode); the theme still applies for this visit.
    }
  }

  return { theme: readonly(theme), setTheme }
})
