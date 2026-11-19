import { useDocumentVisibility, usePreferredReducedMotion } from '@vueuse/core'

export interface CatVisit {
  id: number
  side: 'left' | 'right'
  /** Distance from the top of the viewport, as a fraction of its height. */
  top: number
}

const random = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * Schedules the low-poly cat's visits: one every minute or two, on a random
 * side and height. Never with reduced motion, and only while the tab is visible.
 * Add `?cat` to the URL to make it show up within a second, and often.
 */
export function useCatVisits() {
  const visit = shallowRef<CatVisit | null>(null)
  const motion = usePreferredReducedMotion()
  const visibility = useDocumentVisibility()
  const route = useRoute()
  const eager = computed(() => route.query.cat !== undefined)
  let timer: ReturnType<typeof setTimeout> | undefined
  let count = 0

  function schedule(first: boolean) {
    clearTimeout(timer)
    if (!import.meta.client || motion.value === 'reduce') return
    const delay = eager.value
      ? (first ? 0.8 : random(6, 10))
      : (first ? random(15, 35) : random(60, 150))
    timer = setTimeout(arrive, delay * 1000)
  }

  function arrive() {
    // Nobody to see it: try again later rather than queue up a visit.
    if (visibility.value !== 'visible' || motion.value === 'reduce') return schedule(false)
    visit.value = { id: ++count, side: Math.random() < 0.5 ? 'left' : 'right', top: random(0.2, 0.75) }
  }

  /** Called when the cat has walked off; books the next visit. */
  function leave() {
    visit.value = null
    schedule(false)
  }

  onMounted(() => schedule(true))
  watch(motion, (m) => {
    if (m === 'reduce') {
      clearTimeout(timer)
      visit.value = null
    }
    else if (!visit.value) {
      schedule(true)
    }
  })
  onBeforeUnmount(() => clearTimeout(timer))

  return { visit: readonly(visit), leave }
}
