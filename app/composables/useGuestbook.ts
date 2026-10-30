import { tryOnMounted } from '@vueuse/core'
import type { Guestbook, GuestbookEntry } from '~/data/site'

export type GuestbookStatus = 'idle' | 'loading' | 'sending' | 'sent' | 'error'

export interface GuestbookDraft {
  name: string
  message: string
  /** Honeypot: hidden from people, so anything typed here is a bot. */
  website: string
}

const newestFirst = (a: GuestbookEntry, b: GuestbookEntry) =>
  Date.parse(b.createdAt) - Date.parse(a.createdAt)

/**
 * Guestbook entries and signing. With no `endpoint` it shows the seed
 * entries and `canSign` is false; once an API exists, set the endpoint and
 * entries load on mount and new ones post to it.
 */
export function useGuestbook(config: Guestbook) {
  const entries = ref<GuestbookEntry[]>([...config.seed].sort(newestFirst))
  const status = ref<GuestbookStatus>('idle')
  const errorMessage = ref<string | null>(null)
  const canSign = computed(() => config.endpoint !== null)

  async function load() {
    if (!config.endpoint) return
    status.value = 'loading'
    try {
      const list = await $fetch<GuestbookEntry[]>(config.endpoint)
      entries.value = [...list].sort(newestFirst)
      status.value = 'idle'
    }
    catch {
      status.value = 'error'
      errorMessage.value = 'Couldn\'t load messages. Try again later.'
    }
  }

  async function sign(draft: GuestbookDraft): Promise<boolean> {
    if (!config.endpoint) return false
    const name = draft.name.trim()
    const message = draft.message.trim()
    if (!name || !message) return false
    if (draft.website) {
      status.value = 'sent'
      return true
    }

    status.value = 'sending'
    errorMessage.value = null
    try {
      const entry = await $fetch<GuestbookEntry>(config.endpoint, {
        method: 'POST',
        body: { name, message },
      })
      entries.value = [entry, ...entries.value]
      status.value = 'sent'
      return true
    }
    catch {
      status.value = 'error'
      errorMessage.value = 'Your message didn\'t go through. Please try again.'
      return false
    }
  }

  tryOnMounted(load)

  return {
    entries: computed(() => entries.value),
    status: computed(() => status.value),
    errorMessage: computed(() => errorMessage.value),
    canSign,
    sign,
  }
}
