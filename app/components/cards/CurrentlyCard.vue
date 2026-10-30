<script setup lang="ts">
import { basedIn, cards, currently } from '~/data/site'
import type { CardId } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const updatedLabel = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: basedIn.timeZone,
}).format(new Date(`${currently.updated}T12:00:00Z`))
</script>

<template>
  <ExpandableCard
    id="currently"
    :title="cards.currently.title"
    :span="{ base: 2, sm: 2, lg: 2 }"
    :mobile-height="290"
    body-class="gap-3.5"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconClock />{{ cards.currently.label }}
    </template>

    <template #collapsed>
      <dl class="mt-auto flex flex-col">
        <div
          v-for="item in currently.items"
          :key="item.label"
          class="flex items-baseline gap-3 border-t border-rule py-2.5"
        >
          <dt class="w-20 flex-none font-mono text-meta text-ink-4">
            {{ item.label }}
          </dt>
          <dd class="min-w-0 truncate text-[15px] font-medium">
            {{ item.title }}
          </dd>
        </div>
      </dl>
    </template>

    <template #expanded>
      <div class="flex flex-col gap-6 pt-1">
        <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <CardHeadline>{{ currently.headline }}</CardHeadline>
          <p class="font-mono text-meta text-ink-4">
            Updated <time :datetime="currently.updated">{{ updatedLabel }}</time>
          </p>
        </div>
        <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CardTile
            v-for="item in currently.items"
            :key="item.label"
            class="gap-2"
          >
            <dt class="font-mono text-meta text-ink-4">
              {{ item.label }}
            </dt>
            <dd class="flex flex-col gap-2">
              <span class="text-lg font-medium tracking-[-0.01em]">{{ item.title }}</span>
              <span class="text-sm leading-normal text-ink-3">{{ item.note }}</span>
            </dd>
          </CardTile>
        </dl>
      </div>
    </template>
  </ExpandableCard>
</template>
