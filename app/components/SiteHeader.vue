<script setup lang="ts">
import { nav, navCta, site } from '~/data/site'
</script>

<template>
  <header class="flex items-center justify-between gap-4 pt-4 sm:pt-6 lg:pt-7 2xl:pt-8">
    <a
      href="/"
      class="inline-flex min-h-11 items-center gap-2.5 text-[15px] font-medium text-ink"
    >
      <span
        aria-hidden="true"
        class="size-2.5 rounded-[3px] bg-accent"
      />{{ site.name }}
    </a>
    <nav
      aria-label="Primary"
      class="flex items-center gap-1"
    >
      <a
        v-for="link in nav"
        :key="link.label"
        :href="link.href"
        class="hidden min-h-11 items-center px-3 text-sm text-ink-3 sm:inline-flex"
      >{{ link.label }}</a>
      <a
        :href="navCta.href"
        class="ml-2 inline-flex min-h-11 items-center rounded-full bg-ink px-[18px] text-sm font-medium text-surface"
      >{{ navCta.label }}</a>
    </nav>
  </header>
</template>
