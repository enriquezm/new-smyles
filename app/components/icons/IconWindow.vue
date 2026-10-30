<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 16 })
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
    <rect
      x="2"
      y="2.5"
      width="12"
      height="11"
      rx="1"
    />
    <path d="M2 5.5h12M4 4h.01M5.5 4h.01" />
  </svg>
</template>
