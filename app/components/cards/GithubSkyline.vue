<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { useElementVisibility, useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'
import { NoToneMapping } from 'three'
import type { ContributionWeek } from '~/data/site'

/** The WebGL contribution skyline. Loaded lazily and client-only from GithubCard. */
const props = defineProps<{ weeks: ContributionWeek[] }>()
const emit = defineEmits<{ ready: [] }>()

const root = useTemplateRef<HTMLElement>('root')
const visible = useElementVisibility(root)
const motion = usePreferredReducedMotion()
// A full year is too thin to read on a phone; show the last half-year there.
// Client-only, so this can't cause a hydration mismatch.
const fullYear = useMediaQuery('(min-width: 640px)')
const shownWeeks = computed(() => (fullYear.value ? props.weeks : props.weeks.slice(-26)))
</script>

<template>
  <!-- Tres styles its canvas with pointer-events: auto; the skyline is decorative. -->
  <div
    ref="root"
    class="size-full [&_canvas]:pointer-events-none!"
  >
    <TresCanvas
      alpha
      :clear-alpha="0"
      :dpr="[1, 2]"
      antialias
      :tone-mapping="NoToneMapping"
      power-preference="low-power"
    >
      <GithubSkylineScene
        :key="shownWeeks.length"
        :weeks="shownWeeks"
        :still="motion === 'reduce'"
        :visible="visible"
        @ready="emit('ready')"
      />
    </TresCanvas>
  </div>
</template>
