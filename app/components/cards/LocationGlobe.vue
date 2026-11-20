<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping } from 'three'
import { useElementVisibility, usePreferredReducedMotion } from '@vueuse/core'

/** The WebGL globe. Loaded lazily and client-only from LocationCard. */
defineProps<{ lat: number, lon: number, focused: boolean }>()

const root = useTemplateRef<HTMLElement>('root')
useCanvasTeardown(root)
const visible = useElementVisibility(root)
const motion = usePreferredReducedMotion()
</script>

<template>
  <!-- Tres styles its canvas with pointer-events: auto; the card's overlay button must get the clicks. -->
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
      :fps-limit="30"
    >
      <!-- A slow spin looks the same at 30fps and costs half as much. -->
      <LocationGlobeScene
        :lat="lat"
        :lon="lon"
        :focused="focused"
        :still="motion === 'reduce'"
        :visible="visible"
      />
    </TresCanvas>
  </div>
</template>
