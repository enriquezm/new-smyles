<script setup lang="ts">
import type { CardVariant } from '~/types/card'

defineProps<{ id: string, variant: CardVariant }>()

const variants: Record<CardVariant, string> = {
  light: 'bg-chip text-ink-3',
  map: 'bg-surface text-ink-3',
  dark: 'bg-contact-pill text-contact-label',
}
</script>

<template>
  <h2
    :id="id"
    class="inline-flex h-[26px] items-center gap-1.5 rounded-pill px-2.5 font-mono text-label font-normal"
    :class="variants[variant]"
  >
    <slot />
  </h2>
</template>
