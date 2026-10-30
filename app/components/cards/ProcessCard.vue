<script setup lang="ts">
import { cards, workProcess } from '~/data/site'
import type { CardId, Step } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const { steps } = workProcess
const activeIndex = ref(0)
const activeStep = computed<Step>(() => steps[activeIndex.value] ?? steps[0]!)
</script>

<template>
  <ExpandableCard
    id="process"
    :title="cards.process.title"
    :span="{ base: 2, sm: 2, lg: 2 }"
    :mobile-height="290"
    body-class="gap-3.5 p-5"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconList />{{ cards.process.label }}
    </template>

    <template #collapsed>
      <div class="mt-auto flex flex-col gap-3">
        <div class="flex items-baseline gap-3">
          <span class="font-mono text-sm text-ink-5">{{ activeStep.num }}</span>
          <h3 class="text-[28px] leading-[1.1] font-medium tracking-title">
            {{ activeStep.title }}
          </h3>
        </div>
        <p class="max-w-[560px] text-[15px] leading-normal text-ink-3">
          {{ activeStep.description }}
        </p>
        <div
          role="group"
          aria-label="Steps"
          class="mt-1 flex gap-1 rounded-full bg-track p-1"
        >
          <button
            v-for="(step, i) in steps"
            :key="step.num"
            type="button"
            :aria-pressed="i === activeIndex"
            :aria-label="`Step ${step.num}: ${step.title}`"
            class="pointer-events-auto h-11 flex-1 cursor-pointer rounded-full text-[13px] font-medium"
            :class="i === activeIndex ? 'bg-ink text-surface' : 'bg-transparent text-ink-3'"
            @click.stop="activeIndex = i"
          >
            <span class="sm:hidden">{{ step.num }}</span>
            <span class="hidden sm:inline">Step {{ step.num }}</span>
          </button>
        </div>
      </div>
    </template>

    <template #expanded>
      <div class="flex flex-col gap-6 pt-1">
        <CardHeadline>{{ workProcess.headline }}</CardHeadline>
        <ol class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="step in steps"
            :key="step.num"
          >
            <CardTile class="h-full gap-2">
              <p class="font-mono text-meta text-ink-4">
                Step {{ step.num }}
              </p>
              <h4 class="text-lg font-medium tracking-[-0.01em]">
                {{ step.title }}
              </h4>
              <p class="text-sm leading-normal text-ink-3">
                {{ step.description }}
              </p>
            </CardTile>
          </li>
        </ol>
      </div>
    </template>
  </ExpandableCard>
</template>
