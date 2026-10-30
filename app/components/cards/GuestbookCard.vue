<script setup lang="ts">
import { cards, guestbook } from '~/data/site'
import type { CardId } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const { entries, status, errorMessage, canSign, sign } = useGuestbook(guestbook)

const PREVIEW_SLOTS = 3
const preview = computed(() => entries.value.slice(0, PREVIEW_SLOTS))
const emptySlots = computed(() => PREVIEW_SLOTS - preview.value.length)
const countLabel = computed(() => `${entries.value.length} ${entries.value.length === 1 ? 'message' : 'messages'}`)

// Slot i of the collapsed preview: tablet shows one tile, desktop and up three.
function slotClass(i: number): string {
  return i === 0 ? 'hidden sm:flex' : 'hidden lg:flex'
}
</script>

<template>
  <ExpandableCard
    id="guestbook"
    anchor="guestbook"
    :title="cards.guestbook.title"
    :span="{ base: 2, sm: 2, lg: 4 }"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconBook />{{ cards.guestbook.label }}
    </template>

    <template #collapsed>
      <div class="mt-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col justify-end gap-2">
          <p class="text-[22px] leading-[1.15] font-medium tracking-title">
            {{ guestbook.headline }}
          </p>
          <p class="text-sm leading-normal text-ink-3">
            {{ guestbook.intro }}
          </p>
          <p class="font-mono text-meta text-ink-4">
            {{ countLabel }}
          </p>
        </div>
        <CardTile
          v-for="(entry, i) in preview"
          :key="entry.id"
          :class="slotClass(i)"
        >
          <GuestbookEntryItem
            :entry="entry"
            clamp
          />
        </CardTile>
        <CardTile
          v-for="n in emptySlots"
          :key="`empty-${n}`"
          tone="dashed"
          aria-hidden="true"
          class="items-center justify-center text-center font-mono text-meta text-ink-4"
          :class="slotClass(preview.length + n - 1)"
        >
          Your note could go here
        </CardTile>
      </div>
    </template>

    <template #expanded>
      <div class="grid grid-cols-1 gap-6 pt-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div class="flex flex-col gap-4">
          <CardHeadline>{{ guestbook.headline }}</CardHeadline>
          <p class="max-w-[520px] text-[15px] leading-normal text-ink-3">
            {{ guestbook.intro }}
          </p>
          <GuestbookForm
            :config="guestbook"
            :can-sign="canSign"
            :status="status"
            :error-message="errorMessage"
            :sign="sign"
          />
        </div>

        <div class="flex min-w-0 flex-col gap-3">
          <h4 class="font-mono text-meta font-normal text-ink-4">
            All messages ({{ entries.length }})
          </h4>
          <div
            tabindex="0"
            role="region"
            aria-label="Guestbook messages"
            class="max-h-[520px] overflow-y-auto"
          >
            <ol class="flex flex-col gap-3">
              <li
                v-for="entry in entries"
                :key="entry.id"
              >
                <CardTile>
                  <GuestbookEntryItem :entry="entry" />
                </CardTile>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </template>
  </ExpandableCard>
</template>
