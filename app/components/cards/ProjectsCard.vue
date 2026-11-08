<script setup lang="ts">
import { cards } from '~/data/site'
import type { CardId } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const projects = await useProjects()
// The collapsed card fits two rows with summaries; the open card lists every project.
const latest = computed(() => projects.value.slice(0, 2))
</script>

<template>
  <ExpandableCard
    id="projects"
    :title="cards.projects.title"
    :span="{ base: 2, sm: 2, lg: 4 }"
    body-class="gap-3.5"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconCode />{{ cards.projects.label }}
    </template>

    <template #collapsed>
      <ul class="mt-auto flex flex-col">
        <li
          v-for="project in latest"
          :key="project.name"
          class="flex items-center justify-between gap-3 border-t border-rule py-3"
        >
          <div class="flex min-w-0 items-baseline gap-3">
            <span class="font-mono text-meta text-ink-5">{{ project.num }}</span>
            <div class="flex min-w-0 flex-col gap-0.5">
              <span class="truncate text-base font-medium">{{ project.name }}</span>
              <span class="text-sm leading-snug text-ink-3">{{ project.summary }}</span>
            </div>
          </div>
          <StatusChip :tone="project.statusTone">
            {{ project.status }}
          </StatusChip>
        </li>
      </ul>
    </template>

    <template #expanded>
      <ul class="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="project in projects"
          :key="project.name"
        >
          <CardTile class="h-full gap-2.5">
            <div class="flex items-center justify-between gap-2.5">
              <span class="font-mono text-meta text-ink-4">{{ project.num }}</span>
              <StatusChip :tone="project.statusTone">
                {{ project.status }}
              </StatusChip>
            </div>
            <h4 class="text-lg font-medium tracking-[-0.01em]">
              {{ project.name }}
            </h4>
            <p class="flex-1 text-sm leading-normal text-ink-3">
              {{ project.description }}
            </p>
            <p class="font-mono text-meta text-ink-4">
              {{ project.tags.join(' · ') }}
            </p>
            <NuxtLink
              :to="project.href"
              class="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-medium text-ink underline underline-offset-[3px]"
            >
              {{ project.linkLabel }}<IconArrowUpRight v-if="project.href.startsWith('http')" /><IconChevronRight
                v-else
                :size="13"
              />
            </NuxtLink>
          </CardTile>
        </li>
      </ul>
    </template>
  </ExpandableCard>
</template>
