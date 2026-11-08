<script setup lang="ts">
import type { ProjectStatusTone } from '~/data/site'

defineProps<{ tone: ProjectStatusTone }>()

const tones: Record<ProjectStatusTone, string> = {
  accent: 'bg-accent-tint text-ink',
  idea: 'bg-idea-bg text-idea-fg',
  info: 'bg-info-bg text-info-fg',
  neutral: 'bg-chip text-ink-3',
  success: 'bg-success-bg text-success-fg',
}
</script>

<template>
  <span
    data-status-chip
    class="flex-none rounded-pill px-[9px] py-1 font-mono text-label whitespace-nowrap"
    :class="tones[tone]"
  >
    <slot />
  </span>
</template>
