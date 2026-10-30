<script setup lang="ts">
import type { Link } from '~/data/site'

defineProps<{ link: Link }>()
</script>

<template>
  <a
    :href="link.href"
    data-retro="button"
    class="inline-flex h-14 items-center gap-2.5 rounded-pill border border-border-strong px-5 text-[15px] text-ink-2 transition-colors hover:border-ink hover:text-ink"
  >
    <IconSparkle />{{ link.label }}<span class="sr-only"> (plain-text prompt file)</span>
  </a>
</template>
