<script setup lang="ts">
import { cards, lookingFor } from '~/data/site'
import type { CardId } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()
</script>

<template>
  <ExpandableCard
    id="lookingFor"
    :title="cards.lookingFor.title"
    :span="{ base: 2, sm: 2, lg: 2 }"
    body-class="gap-3.5"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconTarget />{{ cards.lookingFor.label }}
    </template>

    <template #collapsed>
      <dl class="mt-auto flex flex-col">
        <div
          v-for="fact in lookingFor.facts"
          :key="fact.label"
          class="flex items-baseline gap-3 border-t border-rule py-3"
        >
          <dt class="w-16 flex-none font-mono text-meta text-ink-4">
            {{ fact.label }}
          </dt>
          <dd class="min-w-0 text-base font-medium">
            {{ fact.value }}
          </dd>
        </div>
      </dl>
    </template>

    <template #expanded>
      <div class="flex flex-col gap-6 pt-1">
        <CardHeadline>{{ lookingFor.headline }}</CardHeadline>
        <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CardTile
            v-for="fact in [...lookingFor.facts, ...lookingFor.details]"
            :key="fact.label"
            class="gap-1.5"
          >
            <dt class="font-mono text-meta text-ink-4">
              {{ fact.label }}
            </dt>
            <dd class="text-base leading-snug font-medium">
              {{ fact.value }}
            </dd>
          </CardTile>
        </dl>
      </div>
    </template>
  </ExpandableCard>
</template>
