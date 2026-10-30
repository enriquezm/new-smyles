<script setup lang="ts">
import { cards, featured } from '~/data/site'
import type { CardId } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()
</script>

<template>
  <ExpandableCard
    id="featured"
    :title="cards.featured.title"
    :span="{ base: 2, sm: 2, lg: 2 }"
    :mobile-height="280"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconStar />{{ cards.featured.label }}
    </template>

    <div class="flex flex-none items-stretch gap-5">
      <FeaturedPreview />
      <div class="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <h3 class="text-xl leading-[1.2] font-medium tracking-[-0.015em]">
            {{ featured.title }}
          </h3>
          <p class="mt-1 text-sm text-ink-4">
            {{ featured.meta }}
          </p>
        </div>
        <dl class="flex flex-wrap gap-x-5 gap-y-2">
          <div
            v-for="metric in featured.metrics"
            :key="metric.label"
            class="flex flex-col-reverse gap-0.5"
          >
            <dt class="font-mono text-label text-ink-4">
              {{ metric.label }}
            </dt>
            <dd class="text-xl font-medium tracking-title">
              {{ metric.value }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <template #expanded>
      <div class="flex flex-col gap-5 pt-1">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <CardTile
            v-for="section in featured.caseStudy"
            :key="section.label"
            class="gap-2"
          >
            <h4 class="font-mono text-meta font-normal text-ink-4">
              {{ section.label }}
            </h4>
            <p class="text-[15px] leading-normal text-ink-2">
              {{ section.text }}
            </p>
          </CardTile>
        </div>
        <ul class="flex flex-wrap items-center gap-2">
          <li
            v-for="tag in featured.tags"
            :key="tag"
          >
            <Chip>{{ tag }}</Chip>
          </li>
        </ul>
        <div class="flex flex-wrap gap-2">
          <PillLink
            :href="featured.caseStudyLink.href"
            arrow
          >
            {{ featured.caseStudyLink.label }}
          </PillLink>
          <PillLink
            :href="featured.docsLink.href"
            variant="outline"
          >
            {{ featured.docsLink.label }}
          </PillLink>
        </div>
      </div>
    </template>
  </ExpandableCard>
</template>
