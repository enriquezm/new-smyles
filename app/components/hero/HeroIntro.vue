<script setup lang="ts">
import { aiPrompt, hero } from '~/data/site'
</script>

<template>
  <section
    aria-label="Intro"
    data-retro="window"
    class="flex flex-none flex-col gap-5 self-start sm:gap-6 lg:gap-7 2xl:sticky 2xl:top-10 2xl:w-hero"
  >
    <img
      v-if="hero.avatarSrc"
      :src="hero.avatarSrc"
      :alt="hero.avatarAlt"
      class="size-20 rounded-card object-cover sm:size-[104px] lg:size-32 2xl:size-[120px]"
    >
    <div
      v-else
      role="img"
      :aria-label="`${hero.avatarAlt} (placeholder)`"
      class="flex size-20 items-end rounded-card bg-accent p-3 text-2xl leading-none font-semibold tracking-[-0.04em] text-on-accent sm:size-[104px] sm:text-[30px] lg:size-32 lg:text-4xl 2xl:size-[120px] 2xl:text-[34px]"
    >
      {{ hero.avatarMonogram }}
    </div>

    <h1 class="text-[30px] leading-headline font-medium tracking-headline text-balance sm:text-[44px] lg:max-w-headline lg:text-[56px] 2xl:max-w-none 2xl:text-[44px]">
      {{ hero.headline }}
    </h1>

    <p class="max-w-intro text-base leading-normal text-ink-3 sm:text-lg lg:text-xl 2xl:text-lg">
      {{ hero.intro }}
    </p>

    <div class="flex flex-wrap items-center gap-3">
      <StatusPill :label="hero.status" />
      <PromptLink :link="aiPrompt.link" />
    </div>
  </section>
</template>
