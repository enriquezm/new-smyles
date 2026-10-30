<script setup lang="ts">
type Size = 'sm' | 'md'
type Tone = 'outline' | 'filled' | 'dark'

withDefaults(defineProps<{ size?: Size, tone?: Tone }>(), { size: 'sm', tone: 'outline' })

const sizes: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-[13px]',
  md: 'h-8 px-3 text-sm',
}
const tones: Record<Tone, string> = {
  outline: 'border-border-strong text-ink-2',
  filled: 'border-border-strong bg-surface text-ink',
  dark: 'border-contact-border text-contact-text',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-chip border"
    :class="[sizes[size], tones[tone]]"
  >
    <slot />
  </span>
</template>
