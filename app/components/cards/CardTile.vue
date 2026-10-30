<script setup lang="ts">
type Tone = 'sunken' | 'dashed' | 'dark'

withDefaults(defineProps<{ tone?: Tone }>(), { tone: 'sunken' })

const tones: Record<Tone, string> = {
  sunken: 'bg-surface-sunken',
  dashed: 'border border-dashed border-border-open',
  dark: 'bg-contact-tile',
}
</script>

<template>
  <div
    :data-retro="tone === 'sunken' ? 'field' : undefined"
    class="flex flex-col rounded-tile p-[18px]"
    :class="tones[tone]"
  >
    <slot />
  </div>
</template>
