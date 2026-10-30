<script setup lang="ts">
import { navCta, site } from '~/data/site'
</script>

<template>
  <header class="flex items-center justify-between gap-4 pt-4 sm:pt-6 lg:pt-7 2xl:pt-8">
    <a
      href="/"
      data-retro="on-desktop"
      class="inline-flex min-h-11 items-center gap-2.5 text-[15px] font-medium text-ink"
    >
      <span
        aria-hidden="true"
        class="size-2.5 rounded-[3px] bg-accent"
      />{{ site.name }}
    </a>
    <div class="flex items-center gap-2">
      <ThemeSwitch />
      <a
        :href="navCta.href"
        data-retro="button"
        class="inline-flex min-h-11 items-center rounded-pill bg-ink px-[18px] text-sm font-medium text-surface"
      >{{ navCta.label }}</a>
    </div>
  </header>
</template>
