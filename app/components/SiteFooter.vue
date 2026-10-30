<script setup lang="ts">
import { footer } from '~/data/site'

const time = useLocalTime()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-6 flex flex-col justify-between gap-2 border-t border-border-strong pt-12 pb-10 font-mono text-meta text-ink-4 sm:flex-row">
    <span>© {{ year }} {{ footer.name }}</span>
    <span>{{ footer.place }} · <time>{{ time }}</time></span>
  </footer>
</template>
