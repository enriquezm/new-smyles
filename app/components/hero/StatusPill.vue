<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <p
    data-retro="field"
    class="inline-flex h-14 items-center gap-2.5 rounded-pill border border-border-strong px-5 text-[15px] text-ink-2"
  >
    <span
      aria-hidden="true"
      class="size-2 rounded-full bg-success ring-4 ring-success-halo"
    />{{ label }}
  </p>
</template>
