<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 13 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M3 9.5h3v3.5H3V9.5c0-2.5 1-4 3-5M10 9.5h3v3.5h-3V9.5c0-2.5 1-4 3-5" />
  </svg>
</template>
