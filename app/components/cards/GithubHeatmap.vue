<script setup lang="ts">
import type { ContributionWeek, HeatLevel } from '~/data/site'

const props = defineProps<{
  weeks: ContributionWeek[]
  /** Small cells, last 26 weeks, trimmed per breakpoint (10 / 26 / 19 / 20). */
  compact?: boolean
}>()

const levelClass: Record<HeatLevel, string> = {
  0: 'bg-heat-0',
  1: 'bg-heat-1',
  2: 'bg-heat-2',
  3: 'bg-heat-3',
  4: 'bg-heat-4',
}

const COMPACT_WEEKS = 26
const shownWeeks = computed(() => props.compact ? props.weeks.slice(-COMPACT_WEEKS) : props.weeks)

// Index i of the 26 compact weeks: mobile shows the last 10, tablet all 26,
// desktop the last 19, wide the last 20.
function weekClass(i: number): string[] {
  if (!props.compact) return ['flex']
  return [
    i >= 16 ? 'flex' : 'hidden',
    'sm:flex',
    i >= 7 ? 'lg:flex' : 'lg:hidden',
    i >= 6 ? '2xl:flex' : '2xl:hidden',
  ]
}
</script>

<template>
  <div
    role="img"
    :aria-label="compact ? 'Contribution heatmap for recent weeks' : 'Contribution heatmap for the last 52 weeks'"
    class="flex w-max gap-[3px]"
  >
    <div
      v-for="(week, i) in shownWeeks"
      :key="i"
      class="flex-col gap-[3px]"
      :class="weekClass(i)"
    >
      <span
        v-for="(level, d) in week"
        :key="d"
        class="block"
        :class="[compact ? 'size-[9px] rounded-[2px]' : 'size-3 rounded-[3px]', levelClass[level]]"
      />
    </div>
  </div>
</template>
