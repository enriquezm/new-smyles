<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { useElementBounding, useElementVisibility, useMouse, usePreferredReducedMotion } from '@vueuse/core'
import { NoToneMapping } from 'three'

/** The WebGL avatar. Loaded lazily and client-only from HeroAvatar. */
defineProps<{ src: string }>()
const emit = defineEmits<{ ready: [], failed: [] }>()

const root = useTemplateRef<HTMLElement>('root')
useCanvasTeardown(root)
const visible = useElementVisibility(root)
const motion = usePreferredReducedMotion()
const { x: mouseX, y: mouseY, sourceType } = useMouse({ type: 'client', touch: false })
const box = useElementBounding(root)

/** Pointer relative to the avatar centre, scaled by the viewport so it stays gentle far away. */
const pointer = computed(() => {
  if (sourceType.value !== 'mouse' || !import.meta.client) return { x: 0, y: 0 }
  const cx = box.left.value + box.width.value / 2
  const cy = box.top.value + box.height.value / 2
  const clamp = (n: number) => Math.max(-1, Math.min(1, n))
  return {
    x: clamp((mouseX.value - cx) / (window.innerWidth / 2)),
    y: clamp((mouseY.value - cy) / (window.innerHeight / 2)),
  }
})
</script>

<template>
  <!-- Tres styles its canvas with pointer-events: auto; the avatar is decorative. -->
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
      <HeroAvatarScene
        :src="src"
        :pointer="pointer"
        :still="motion === 'reduce'"
        :visible="visible"
        @ready="emit('ready')"
        @failed="emit('failed')"
      />
    </TresCanvas>
  </div>
</template>
