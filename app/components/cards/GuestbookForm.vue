<script setup lang="ts">
import type { Guestbook } from '~/data/site'
import type { GuestbookDraft, GuestbookStatus } from '~/composables/useGuestbook'

const props = defineProps<{
  config: Guestbook
  canSign: boolean
  status: GuestbookStatus
  errorMessage: string | null
  sign: (draft: GuestbookDraft) => Promise<boolean>
}>()

const draft = reactive<GuestbookDraft>({ name: '', message: '', website: '' })
const remaining = computed(() => props.config.maxMessageLength - draft.message.length)
const sending = computed(() => props.status === 'sending')
const statusText = computed(() => {
  if (!props.canSign) return props.config.closedNote
  if (props.status === 'sending') return 'Signing…'
  if (props.status === 'sent') return 'Thanks! Your message is in the book.'
  if (props.status === 'error') return props.errorMessage ?? ''
  return ''
})

async function submit() {
  if (!(await props.sign({ ...draft }))) return
  draft.name = ''
  draft.message = ''
  draft.website = ''
}

const field = 'w-full rounded-chip border border-border-strong bg-surface px-3 text-[15px] text-ink placeholder:text-ink-4 disabled:cursor-not-allowed'
</script>

<template>
  <form
    class="flex flex-col gap-4"
    novalidate
    @submit.prevent="submit"
  >
    <fieldset
      class="flex flex-col gap-4"
      :disabled="!canSign || sending"
    >
      <legend class="sr-only">
        Sign the guestbook
      </legend>

      <div class="flex flex-col gap-1.5">
        <label
          for="guestbook-name"
          class="font-mono text-meta text-ink-4"
        >Name</label>
        <input
          id="guestbook-name"
          v-model="draft.name"
          data-retro="field"
          type="text"
          name="name"
          autocomplete="nickname"
          required
          :maxlength="config.maxNameLength"
          placeholder="Your name"
          class="min-h-11"
          :class="field"
        >
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-baseline justify-between gap-3">
          <label
            for="guestbook-message"
            class="font-mono text-meta text-ink-4"
          >Message</label>
          <span
            id="guestbook-message-count"
            class="font-mono text-meta text-ink-4"
          >{{ remaining }} left</span>
        </div>
        <textarea
          id="guestbook-message"
          v-model="draft.message"
          data-retro="field"
          name="message"
          required
          rows="4"
          :maxlength="config.maxMessageLength"
          aria-describedby="guestbook-message-count"
          placeholder="Say hello…"
          class="resize-y py-2.5 leading-normal"
          :class="field"
        />
      </div>

      <!-- Honeypot: visually hidden and skipped by keyboard and screen readers. -->
      <div
        class="absolute -left-[9999px] size-px overflow-hidden"
        aria-hidden="true"
      >
        <label for="guestbook-website">Website</label>
        <input
          id="guestbook-website"
          v-model="draft.website"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
        >
      </div>

      <button
        type="submit"
        data-retro="button"
        class="inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-pill bg-ink px-[18px] text-sm font-medium text-surface disabled:cursor-not-allowed disabled:opacity-60"
      >
        Sign the guestbook
      </button>
    </fieldset>

    <p
      role="status"
      class="min-h-5 text-sm text-ink-3"
    >
      {{ statusText }}
    </p>
  </form>
</template>
