<script setup lang="ts">
import { introAudio } from '~/data/site'

const { playing, progress, remaining, toggle } = useIntroPlayer(introAudio)

// The waveform shows 34 / 48 / 64 / 56 bars at mobile / tablet / desktop / wide.
const BAR_COUNT = 64
const bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
  height: Math.round(4 + Math.abs(Math.sin(i * 1.31) * Math.cos(i * 0.47 + 1)) * 22),
  visibility: [
    i < 34 ? 'block' : 'hidden',
    i < 48 ? 'sm:block' : 'sm:hidden',
    'lg:block',
    i < 56 ? '2xl:block' : '2xl:hidden',
  ],
}))

const fillClip = computed(() => `inset(0 ${(1 - progress.value) * 100}% 0 0)`)
</script>

<template>
  <div
    data-retro="field"
    class="flex h-14 w-full items-center gap-3 rounded-pill border border-border bg-surface pr-[18px] pl-1.5 sm:w-auto"
  >
    <button
      type="button"
      data-retro="button"
      :aria-label="playing ? introAudio.pauseLabel : introAudio.playLabel"
      class="inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-pill text-accent"
      @click="toggle"
    >
      <IconPause v-if="playing" />
      <IconPlay v-else />
    </button>

    <div
      aria-hidden="true"
      class="flex h-7 min-w-0 flex-1 items-center overflow-hidden"
    >
      <!-- Gray bars with an ink copy on top, clipped to the played fraction. -->
      <div class="relative flex items-center gap-0.5">
        <span
          v-for="(bar, i) in bars"
          :key="i"
          class="w-0.5 flex-none rounded-[2px] bg-wave"
          :class="bar.visibility"
          :style="{ height: `${bar.height}px` }"
        />
        <div
          class="absolute inset-0 flex items-center gap-0.5"
          :style="{ clipPath: fillClip }"
        >
          <span
            v-for="(bar, i) in bars"
            :key="i"
            class="w-0.5 flex-none rounded-[2px] bg-ink"
            :class="bar.visibility"
            :style="{ height: `${bar.height}px` }"
          />
        </div>
      </div>
    </div>

    <span class="flex-none font-mono text-[13px] text-ink-4">{{ remaining }}</span>
  </div>
</template>
