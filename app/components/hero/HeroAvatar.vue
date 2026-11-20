<script setup lang="ts">
import { hero } from '~/data/site'

/**
 * The hero portrait. The plain <img> renders on the server and stays the
 * accessible element. The low-poly relief assembles over it, then the photo
 * fades out beneath. Without a photo, the "ME" monogram shows.
 */
const sizeClass = 'size-20 rounded-card sm:size-[104px] lg:size-32 2xl:size-[120px]'
const lowPoly = ref(false)
</script>

<template>
  <div
    v-if="hero.avatarSrc"
    data-hero-avatar
    class="relative isolate flex-none overflow-hidden"
    :class="sizeClass"
  >
    <img
      :src="hero.avatarSrc"
      :alt="hero.avatarAlt"
      class="size-full object-cover transition-opacity duration-300"
      :class="lowPoly ? 'opacity-0' : 'opacity-100'"
    >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <ClientOnly>
        <LazyHeroAvatarCanvas
          :src="hero.avatarSrc"
          @ready="lowPoly = true"
          @failed="lowPoly = false"
        />
      </ClientOnly>
    </div>
  </div>
  <div
    v-else
    role="img"
    :aria-label="`${hero.avatarAlt} (placeholder)`"
    class="flex items-end bg-accent p-3 text-2xl leading-none font-semibold tracking-[-0.04em] text-on-accent sm:text-[30px] lg:text-4xl 2xl:text-[34px]"
    :class="sizeClass"
  >
    {{ hero.avatarMonogram }}
  </div>
</template>
