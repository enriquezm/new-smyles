<script setup lang="ts">
import { basedIn, cards, siteStats } from '~/data/site'
import type { CardId } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const measuredLabel = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: basedIn.timeZone,
}).format(new Date(`${siteStats.measuredOn}T12:00:00Z`))
</script>

<template>
  <ExpandableCard
    id="siteStats"
    :title="cards.siteStats.title"
    :span="{ base: 2, sm: 1, lg: 1 }"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconBolt />{{ cards.siteStats.label }}
    </template>

    <dl
      class="grid grid-cols-2 gap-x-4 gap-y-3"
      :class="open ? 'sm:grid-cols-4' : 'mt-auto'"
    >
      <div
        v-for="stat in siteStats.stats"
        :key="stat.label"
        class="flex flex-col-reverse justify-end gap-0.5"
      >
        <dt class="text-[13px] leading-snug text-ink-4">
          {{ stat.label }}
        </dt>
        <dd class="text-[22px] leading-[1.1] font-medium tracking-title">
          {{ stat.value }}
        </dd>
      </div>
    </dl>

    <template #expanded>
      <div class="flex flex-col gap-6 pt-2">
        <p class="max-w-[640px] text-sm leading-normal text-ink-3">
          {{ siteStats.method }} Last measured <time :datetime="siteStats.measuredOn">{{ measuredLabel }}</time>.
        </p>
        <CardHeadline>{{ siteStats.headline }}</CardHeadline>
        <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="item in siteStats.builtWith"
            :key="item.title"
          >
            <CardTile class="h-full gap-2">
              <h4 class="text-lg font-medium tracking-[-0.01em]">
                {{ item.title }}
              </h4>
              <p class="text-sm leading-normal text-ink-3">
                {{ item.text }}
              </p>
            </CardTile>
          </li>
        </ul>
        <PillLink
          :href="siteStats.source.href"
          variant="outline"
          arrow
          class="self-start"
        >
          {{ siteStats.source.label }}
        </PillLink>
      </div>
    </template>
  </ExpandableCard>
</template>
