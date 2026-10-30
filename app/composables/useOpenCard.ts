import type { ComputedRef, InjectionKey } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import type { CardId } from '~/data/site'

export interface OpenCardState {
  openId: ComputedRef<CardId | null>
  toggle: (id: CardId) => void
  close: () => void
}

const openCardKey: InjectionKey<OpenCardState> = Symbol('open-card')

/** Owns which card is open (one at a time) and closes it on Escape. Call once, in CardGrid. */
export function useOpenCard(): OpenCardState {
  const openId = ref<CardId | null>(null)

  const toggle = (id: CardId) => {
    openId.value = openId.value === id ? null : id
  }
  const close = () => {
    openId.value = null
  }

  onKeyStroke('Escape', (event) => {
    if (openId.value === null) return
    event.preventDefault()
    close()
  })

  const state: OpenCardState = { openId: computed(() => openId.value), toggle, close }
  provide(openCardKey, state)
  return state
}

/** Read the open-card state provided by CardGrid. */
export function injectOpenCard(): OpenCardState {
  const state = inject(openCardKey)
  if (!state) throw new Error('injectOpenCard() must be used inside CardGrid')
  return state
}
