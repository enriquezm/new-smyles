import { createSharedComposable, tryOnMounted, tryOnScopeDispose } from '@vueuse/core'
import { basedIn } from '~/data/site'

/**
 * Current time in Las Vegas ("9:41 AM"), updated on each minute boundary.
 * Renders "--:--" until mounted so the static HTML never holds a stale time.
 */
export const useLocalTime = createSharedComposable(() => {
  const time = ref('--:--')
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: basedIn.timeZone,
  })
  let timer: ReturnType<typeof setTimeout> | undefined

  const tick = () => {
    time.value = formatter.format(new Date())
    timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
  }

  tryOnMounted(tick)
  tryOnScopeDispose(() => clearTimeout(timer))

  return time
})
