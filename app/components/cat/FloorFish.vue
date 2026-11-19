<script setup lang="ts">
import { catCopy } from '~/data/site'
import type { FloorFish } from '~/composables/useCatWorld'

/** A fish lying on the floor near the bottom of the screen. Clicking it calls the cat. */
const props = defineProps<{ fish: FloorFish, called: boolean }>()
const emit = defineEmits<{ call: [] }>()

/** Same height as the cat's stage so 3D units match; the floor lands at FEET_Y. */
const position = computed(() => ({
  [props.fish.side]: `${props.fish.inset}px`,
  bottom: `calc(${FLOOR_PX}px - ${1 - FEET_Y} * var(--stage-h))`,
}))
</script>

<template>
  <div
    data-fish
    class="absolute h-(--stage-h) w-[calc(var(--stage-h)*0.76)]"
    :style="position"
  >
    <ClientOnly>
      <LazyFishCanvas :facing="fish.facing" />
    </ClientOnly>
    <!-- A 48px target around the fish itself, not the empty air above it. -->
    <button
      type="button"
      :aria-label="catCopy.fishLabel"
      :aria-disabled="called"
      class="pointer-events-auto absolute inset-x-0 h-12 cursor-pointer rounded-chip aria-disabled:cursor-default"
      :style="{ top: `calc(${FEET_Y * 100}% - 30px)` }"
      @click="!called && emit('call')"
    />
  </div>
</template>
