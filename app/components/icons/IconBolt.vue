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
    <path d="M9 1.5L3.5 9H8l-1 5.5L12.5 7H8z" />
  </svg>
</template>
