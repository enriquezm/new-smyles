<script setup lang="ts">
import { cards, toolkit } from '~/data/site'
import type { CardId } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()
</script>

<template>
  <ExpandableCard
    id="toolkit"
    anchor="toolkit"
    :title="cards.toolkit.title"
    :span="{ base: 2, sm: 1, lg: 1 }"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconLayers />{{ cards.toolkit.label }}
    </template>

    <template #collapsed>
      <div class="mt-auto flex flex-col gap-3.5">
        <p class="text-[22px] leading-[1.15] font-medium tracking-title">
          {{ toolkit.tagline }}
        </p>
        <ul class="flex flex-wrap gap-1.5">
          <li
            v-for="item in toolkit.highlights"
            :key="item"
          >
            <Chip>{{ item }}</Chip>
          </li>
        </ul>
      </div>
    </template>

    <template #expanded>
      <div class="flex flex-col gap-6 pt-1">
        <CardHeadline>{{ toolkit.headline }}</CardHeadline>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CardTile
            v-for="group in toolkit.groups"
            :key="group.name"
            class="gap-3"
          >
            <h4 class="font-mono text-meta font-normal text-ink-4">
              {{ group.name }}
            </h4>
            <ul class="flex flex-wrap gap-1.5">
              <li
                v-for="item in group.items"
                :key="item"
              >
                <Chip
                  size="md"
                  tone="filled"
                >
                  {{ item }}
                </Chip>
              </li>
            </ul>
          </CardTile>
        </div>
      </div>
    </template>
  </ExpandableCard>
</template>
