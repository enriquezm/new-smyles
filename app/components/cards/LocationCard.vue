<script setup lang="ts">
import { basedIn, cards } from '~/data/site'
import type { CardId } from '~/data/site'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const time = useLocalTime()
const bodyClass = computed(() =>
  props.open ? 'min-h-[360px] justify-between gap-4' : 'justify-between gap-4',
)
</script>

<template>
  <ExpandableCard
    id="location"
    :title="cards.location.title"
    :span="{ base: 1, sm: 2, lg: 2 }"
    variant="map"
    :glyph="false"
    :pad="16"
    :body-class="bodyClass"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #background>
      <LocationMap />
    </template>

    <template #label>
      <IconPin />{{ cards.location.label }}
    </template>

    <div
      data-retro="panel"
      class="flex max-w-[360px] flex-col gap-1 self-start rounded-tile bg-surface px-3.5 py-3 shadow-float"
    >
      <p class="text-2xl leading-[1.1] font-medium tracking-title">
        {{ basedIn.city }}
      </p>
      <p class="font-mono text-meta text-ink-4">
        <time>{{ time }}</time> {{ basedIn.timeZoneAbbr }}
      </p>
      <p
        v-if="open"
        class="mt-2 text-sm leading-normal text-ink-3"
      >
        {{ basedIn.availability }}
      </p>
    </div>
  </ExpandableCard>
</template>
