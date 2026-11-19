<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping } from 'three'

/** The floor fish's WebGL canvas. Loaded lazily, only while a fish is out. */
defineProps<{ facing: 1 | -1 }>()
</script>

<template>
  <!-- Tres styles its canvas with pointer-events: auto; the fish button takes the clicks. -->
  <div class="size-full [&_canvas]:pointer-events-none!">
    <TresCanvas
      alpha
      :clear-alpha="0"
      :dpr="[1, 2]"
      antialias
      :tone-mapping="NoToneMapping"
      power-preference="low-power"
    >
      <FishScene :facing="facing" />
    </TresCanvas>
  </div>
</template>
