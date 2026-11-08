<script setup lang="ts">
import { postPage, postTypes } from '~/data/site'
import type { PostType } from '~/data/site'

/** Shared template for every markdown post; the type sets the badge and note. */
const props = defineProps<{
  type: PostType
  title: string
  description: string
  date: string
  updated?: string
  tags: string[]
}>()

const meta = computed(() => postTypes[props.type])

// Frontmatter dates are calendar days, so format in UTC to keep server and client in step.
const format = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })
const formatDate = (iso: string) => format.format(new Date(iso))
</script>

<template>
  <article
    data-retro="window"
    class="mx-auto flex w-full max-w-post flex-col gap-6 rounded-card border border-border bg-surface p-5 shadow-card sm:gap-8 sm:p-10"
  >
    <header class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <StatusChip :tone="meta.statusTone">
          {{ meta.label }}
        </StatusChip>
        <p class="font-mono text-meta text-ink-4">
          {{ postPage.publishedLabel }} <time :datetime="date">{{ formatDate(date) }}</time>
          <template v-if="updated">
            · {{ postPage.updatedLabel }} <time :datetime="updated">{{ formatDate(updated) }}</time>
          </template>
        </p>
      </div>
      <h1 class="text-[32px] leading-headline font-medium tracking-headline text-balance sm:text-[44px]">
        {{ title }}
      </h1>
      <p class="text-lg leading-normal text-ink-3">
        {{ description }}
      </p>
      <ul
        v-if="tags.length"
        class="flex flex-wrap gap-2"
      >
        <li
          v-for="tag in tags"
          :key="tag"
        >
          <Chip>{{ tag }}</Chip>
        </li>
      </ul>
    </header>

    <p class="rounded-tile bg-info-bg px-4 py-3 text-sm leading-normal text-info-fg">
      {{ meta.note }}
    </p>

    <div class="post-body">
      <slot />
    </div>
  </article>
</template>
