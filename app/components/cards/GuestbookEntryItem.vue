<script setup lang="ts">
import { basedIn } from '~/data/site'
import type { GuestbookEntry } from '~/data/site'

const props = defineProps<{ entry: GuestbookEntry, clamp?: boolean }>()

const date = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: basedIn.timeZone,
}).format(new Date(props.entry.createdAt))
</script>

<template>
  <figure class="flex h-full flex-col gap-2">
    <blockquote
      class="text-[15px] leading-normal break-words text-ink-2"
      :class="{ 'line-clamp-4': clamp }"
    >
      {{ entry.message }}
    </blockquote>
    <figcaption class="mt-auto font-mono text-meta text-ink-4">
      {{ entry.name }} · <time :datetime="entry.createdAt">{{ date }}</time>
    </figcaption>
  </figure>
</template>
