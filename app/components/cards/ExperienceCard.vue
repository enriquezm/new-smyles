<script setup lang="ts">
import { cards, education, experienceHeadline, resumeHref, roles } from '~/data/site'
import type { CardId } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()
</script>

<template>
  <ExpandableCard
    id="experience"
    :title="cards.experience.title"
    :span="{ base: 2, sm: 1, lg: 1 }"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconBriefcase />{{ cards.experience.label }}
    </template>

    <template #collapsed>
      <ol class="relative flex flex-col gap-3.5 pl-[18px]">
        <li
          aria-hidden="true"
          class="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-timeline"
        />
        <li
          v-for="role in roles"
          :key="role.title"
          class="relative"
        >
          <span
            aria-hidden="true"
            class="absolute top-[5px] -left-[18px] size-[7px] rounded-full"
            :class="role.current ? 'bg-accent' : 'bg-ink'"
          />
          <p class="text-[14.5px] leading-[1.3] font-medium">
            {{ role.title }}
          </p>
          <p class="mt-0.5 text-[13px] text-ink-4">
            {{ role.org }} · {{ role.years }}
          </p>
        </li>
      </ol>
    </template>

    <template #expanded>
      <div class="flex flex-col gap-6 pt-1">
        <CardHeadline>{{ experienceHeadline }}</CardHeadline>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CardTile
            v-for="role in roles"
            :key="role.title"
            class="gap-1.5"
          >
            <p class="font-mono text-meta text-ink-4">
              {{ role.years }}
            </p>
            <h4 class="text-[17px] leading-[1.25] font-medium">
              {{ role.title }}
            </h4>
            <p class="text-sm text-ink-3">
              {{ role.org }}
            </p>
            <p class="mt-2 text-sm leading-normal text-ink-3">
              {{ role.impact }}
            </p>
          </CardTile>
          <CardTile
            tone="dashed"
            class="gap-1.5"
          >
            <p class="font-mono text-meta text-ink-4">
              Education
            </p>
            <h4 class="text-[17px] leading-[1.25] font-medium">
              {{ education.degree }}
            </h4>
            <p class="text-sm text-ink-3">
              {{ education.school }} · {{ education.year }}
            </p>
          </CardTile>
        </div>
        <PillLink
          :href="resumeHref"
          arrow
          class="self-start"
        >
          Download resume
        </PillLink>
      </div>
    </template>
  </ExpandableCard>
</template>
