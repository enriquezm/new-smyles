<script setup lang="ts">
type Variant = 'dark' | 'outline' | 'accent' | 'dark-outline'

withDefaults(defineProps<{ href: string, variant?: Variant, arrow?: boolean }>(), {
  variant: 'dark',
  arrow: false,
})

const variants: Record<Variant, string> = {
  'dark': 'bg-ink px-[18px] font-medium text-surface',
  'outline': 'border border-border-open px-[18px] text-ink',
  'accent': 'bg-accent px-[18px] font-medium text-ink',
  'dark-outline': 'border border-contact-border px-4 text-contact-text',
}
</script>

<template>
  <a
    :href="href"
    class="inline-flex min-h-11 items-center gap-2 rounded-full text-sm"
    :class="variants[variant]"
  >
    <slot />
    <IconArrowUpRight v-if="arrow" />
  </a>
</template>
