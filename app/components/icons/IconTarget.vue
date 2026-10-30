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
    <circle
      cx="8"
      cy="8"
      r="6"
    />
    <circle
      cx="8"
      cy="8"
      r="3"
    />
    <circle
      cx="8"
      cy="8"
      r=".5"
    />
  </svg>
</template>
