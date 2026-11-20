<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { basedIn, cards } from '~/data/site'
import type { CardId } from '~/data/site'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const time = useLocalTime()

// Only load and build the globe once the card is close to the screen; on
// phones it starts well below the fold, and building it costs a few ms.
const backdrop = useTemplateRef<HTMLElement>('backdrop')
const near = ref(false)
const { stop: stopWatching } = useIntersectionObserver(backdrop, ([entry]) => {
  if (!entry?.isIntersecting) return
  near.value = true
  stopWatching()
}, { rootMargin: '300px' })
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
      <div
        ref="backdrop"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-0"
      >
        <ClientOnly v-if="near">
          <LazyLocationGlobe
            :lat="basedIn.coordinates.lat"
            :lon="basedIn.coordinates.lon"
            :focused="open"
          />
        </ClientOnly>
      </div>
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
