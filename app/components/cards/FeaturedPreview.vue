<script setup lang="ts">
import { featured } from '~/data/site'

type Mode = 'ui' | 'code'

const modes: { id: Mode, label: string }[] = [
  { id: 'ui', label: 'UI' },
  { id: 'code', label: 'Code' },
]
const mode = ref<Mode>('ui')
const { component, props } = featured.codePreview
</script>

<template>
  <div class="relative flex h-[120px] w-[130px] flex-none flex-col overflow-hidden rounded-tile bg-ink sm:h-[160px] sm:w-[260px] lg:h-[170px] lg:w-[280px] 2xl:h-[188px] 2xl:w-[290px]">
    <div
      role="group"
      aria-label="Preview"
      class="flex flex-none gap-0.5 p-1.5"
    >
      <!-- The ::after extends the 26px pill to a 44px tap target. -->
      <button
        v-for="m in modes"
        :key="m.id"
        type="button"
        :aria-pressed="mode === m.id"
        class="pointer-events-auto relative h-[26px] cursor-pointer rounded-mini px-2.5 font-mono text-[11px] after:absolute after:inset-x-0 after:-inset-y-[9px]"
        :class="mode === m.id ? 'bg-surface text-ink' : 'bg-transparent text-code-toggle-off'"
        @click.stop="mode = m.id"
      >
        {{ m.label }}
      </button>
    </div>

    <div
      v-if="mode === 'ui'"
      aria-hidden="true"
      class="mx-2 mb-2 flex min-h-0 flex-1 gap-2.5 rounded-chip bg-surface p-2.5"
    >
      <div class="w-[34%] flex-none rounded-mini bg-accent-soft" />
      <div class="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        <div class="h-[7px] w-[90%] rounded bg-ink" />
        <div class="h-[7px] w-[65%] rounded bg-ink" />
        <div class="mt-0.5 h-1.5 w-[40%] rounded bg-wave" />
        <div class="mt-auto flex items-center gap-1.5">
          <div class="h-4 w-[44%] rounded-full bg-accent" />
          <div class="size-4 rounded-full border-[1.5px] border-wave" />
        </div>
      </div>
    </div>

    <div
      v-else
      aria-hidden="true"
      class="flex-1 overflow-hidden px-3 pt-1.5 pb-2.5 font-mono text-[9.5px] leading-[1.6] whitespace-nowrap text-code-text sm:text-xs 2xl:text-[12.5px]"
    >
      <div><span class="text-code-punct">&lt;</span><span class="text-contact-text">{{ component }}</span></div>
      <div
        v-for="prop in props"
        :key="prop.name"
        class="pl-[2ch]"
      >
        <span class="text-accent">{{ prop.name }}</span>=<span class="text-code-string">"{{ prop.value }}"</span>
      </div>
      <div class="text-code-punct">
        /&gt;
      </div>
    </div>
  </div>
</template>
