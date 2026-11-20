import { useDocumentVisibility, usePreferredReducedMotion } from '@vueuse/core'

export type Side = 'left' | 'right'

export interface CatVisit {
  id: number
  /** `wander`: a random stroll past the edge. `fetch`: comes for the fish. */
  kind: 'wander' | 'fetch'
  side: Side
  /** Wander height from the top of the viewport, as a fraction of its height. */
  top: number
}

export interface FloorFish {
  id: number
  side: Side
  /** Gap between the screen edge and the fish's box, px. */
  inset: number
  /** Which way its nose points: 1 right, -1 left. */
  facing: 1 | -1
}

const random = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * State for the cat and the fish on the floor. The cat wanders past every
 * minute or two; clicking the fish always brings it (straight away, or right
 * after it finishes leaving). A new fish turns up a while after one is taken.
 * Nothing happens with reduced motion or while the tab is hidden.
 * Add `?cat` to the URL to make everything happen quickly.
 */
export function useCatWorld() {
  const visit = shallowRef<CatVisit | null>(null)
  const fish = shallowRef<FloorFish | null>(null)
  /** The fish was clicked while the cat was out wandering: it should leave now, then come back for it. */
  const hurry = ref(false)
  const motion = usePreferredReducedMotion()
  const visibility = useDocumentVisibility()
  const route = useRoute()
  const eager = computed(() => route.query.cat !== undefined)
  const enabled = computed(() => import.meta.client && motion.value !== 'reduce')
  let wanderTimer: ReturnType<typeof setTimeout> | undefined
  let fishTimer: ReturnType<typeof setTimeout> | undefined
  let ids = 0

  function scheduleWander(first: boolean) {
    clearTimeout(wanderTimer)
    if (!enabled.value) return
    const delay = eager.value ? (first ? 0.8 : random(6, 10)) : (first ? random(15, 35) : random(60, 150))
    wanderTimer = setTimeout(() => {
      // Nobody to see it, or already out: try again later.
      if (visibility.value !== 'visible' || visit.value) return scheduleWander(false)
      visit.value = { id: ++ids, kind: 'wander', side: Math.random() < 0.5 ? 'left' : 'right', top: random(0.2, 0.62) }
    }, delay * 1000)
  }

  function scheduleFish(first: boolean) {
    clearTimeout(fishTimer)
    if (!enabled.value) return
    const delay = eager.value ? (first ? 0.4 : 4) : (first ? random(4, 10) : random(25, 50))
    fishTimer = setTimeout(() => {
      fish.value = {
        id: ++ids,
        side: Math.random() < 0.5 ? 'left' : 'right',
        inset: Math.round(random(40, Math.min(170, window.innerWidth * 0.22))),
        facing: Math.random() < 0.5 ? 1 : -1,
      }
    }, delay * 1000)
  }

  function startFetch() {
    if (!fish.value) return
    visit.value = { id: ++ids, kind: 'fetch', side: fish.value.side, top: 0 }
  }

  /** The fish was clicked: the cat always comes for it. */
  function callCat() {
    if (!fish.value || visit.value?.kind === 'fetch') return
    clearTimeout(wanderTimer)
    if (visit.value) hurry.value = true
    else startFetch()
  }

  /** The cat has the fish in its mouth. */
  function takeFish() {
    fish.value = null
    scheduleFish(false)
  }

  /** The cat has walked off screen. */
  function leave() {
    visit.value = null
    if (hurry.value) {
      hurry.value = false
      setTimeout(startFetch, 350)
    }
    else {
      scheduleWander(false)
    }
  }

  function stopAll() {
    clearTimeout(wanderTimer)
    clearTimeout(fishTimer)
    visit.value = null
    fish.value = null
    hurry.value = false
  }

  onMounted(() => {
    scheduleWander(true)
    scheduleFish(true)
  })
  watch(enabled, (on) => {
    if (!on) return stopAll()
    scheduleWander(true)
    scheduleFish(true)
  })
  onBeforeUnmount(stopAll)

  return { visit: readonly(visit), fish: readonly(fish), hurry: readonly(hurry), callCat, takeFish, leave }
}
