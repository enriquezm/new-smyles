<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping } from 'three'

/** The cat's WebGL canvas. Loaded lazily, and only while a visit is happening. */
defineProps<{
  walking: boolean
  facing: 1 | -1
  looking: boolean
  reaching: boolean
  carrying: boolean
  purring: boolean
}>()

const root = useTemplateRef<HTMLElement>('root')
useCanvasTeardown(root)
</script>

<template>
  <!-- Tres styles its canvas with pointer-events: auto; the button around it takes the clicks. -->
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
      <CatScene
        :walking="walking"
        :facing="facing"
        :looking="looking"
        :reaching="reaching"
        :carrying="carrying"
        :purring="purring"
      />
    </TresCanvas>
  </div>
</template>
