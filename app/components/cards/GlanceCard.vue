<script setup lang="ts">
import { cards, glance } from '~/data/site'
import type { CardId, Metric } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const stats: Metric[] = [
  { value: `${new Date().getFullYear() - glance.careerStartYear}+`, label: glance.yearsLabel },
  ...glance.stats,
]
</script>

<template>
  <ExpandableCard
    id="glance"
    :title="cards.glance.title"
    :span="{ base: 2, sm: 2, lg: 2 }"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconGauge />{{ cards.glance.label }}
    </template>

    <dl class="mt-auto grid grid-cols-3 gap-3 sm:gap-5">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex flex-col-reverse justify-end gap-1"
      >
        <dt class="text-[13px] leading-snug text-ink-4">
          {{ stat.label }}
        </dt>
        <dd class="text-xl leading-[1.1] font-medium tracking-title sm:text-[28px]">
          {{ stat.value }}
        </dd>
      </div>
    </dl>

    <template #expanded>
      <div class="flex flex-col gap-6 pt-3">
        <CardHeadline>{{ glance.headline }}</CardHeadline>
        <ul class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <li
            v-for="strength in glance.strengths"
            :key="strength.title"
          >
            <CardTile class="h-full gap-2">
              <h4 class="text-lg font-medium tracking-[-0.01em]">
                {{ strength.title }}
              </h4>
              <p class="text-sm leading-normal text-ink-3">
                {{ strength.text }}
              </p>
            </CardTile>
          </li>
        </ul>
      </div>
    </template>
  </ExpandableCard>
</template>
