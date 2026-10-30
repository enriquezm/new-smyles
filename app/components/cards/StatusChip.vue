<script setup lang="ts">
import type { ProjectStatusTone } from '~/data/site'

defineProps<{ tone: ProjectStatusTone }>()

const tones: Record<ProjectStatusTone, string> = {
  accent: 'bg-accent-tint text-ink',
  info: 'bg-info-bg text-info-fg',
  neutral: 'bg-chip text-ink-3',
}
</script>

<template>
  <span
    class="flex-none rounded-full px-[9px] py-1 font-mono text-label whitespace-nowrap"
    :class="tones[tone]"
  >
    <slot />
  </span>
</template>
