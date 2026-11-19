<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 13 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 14s-5.5-3.4-5.5-7.4A3 3 0 0 1 8 4.7a3 3 0 0 1 5.5 1.9C13.5 10.6 8 14 8 14z" />
  </svg>
</template>
