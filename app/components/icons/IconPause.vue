<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 18 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect
      x="3.5"
      y="2.5"
      width="3"
      height="11"
      rx="1"
    />
    <rect
      x="9.5"
      y="2.5"
      width="3"
      height="11"
      rx="1"
    />
  </svg>
</template>
