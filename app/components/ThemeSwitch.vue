<script setup lang="ts">
import type { Component } from 'vue'
import { themes } from '~/data/site'
import type { ThemeId } from '~/data/site'
import IconMoon from '~/components/icons/IconMoon.vue'
import IconSun from '~/components/icons/IconSun.vue'
import IconWindow from '~/components/icons/IconWindow.vue'

const { theme, setTheme } = useTheme()

const icons: Record<ThemeId, Component> = { light: IconSun, dark: IconMoon, retro: IconWindow }

const current = computed(() => themes.find(t => t.id === theme.value) ?? themes[0]!)
const next = computed(() => themes[(themes.indexOf(current.value) + 1) % themes.length]!)

const radios = useTemplateRef<HTMLButtonElement[]>('radios')

// Radio group keyboard pattern: arrows move the selection and focus.
function onKeydown(event: KeyboardEvent, index: number) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
  if (!step) return
  event.preventDefault()
  const target = (index + step + themes.length) % themes.length
  setTheme(themes[target]!.id)
  radios.value?.[target]?.focus()
}
</script>

<template>
  <!-- Mobile: one button that cycles through the themes. -->
  <button
    type="button"
    data-retro="button"
    :aria-label="`Theme: ${current.label}. Switch to ${next.label}`"
    class="inline-flex size-11 cursor-pointer items-center justify-center rounded-pill border border-border-strong text-ink sm:hidden"
    @click="setTheme(next.id)"
  >
    <component :is="icons[current.id]" />
  </button>

  <!-- Tablet and up: a segmented radio group. -->
  <div
    role="radiogroup"
    aria-label="Theme"
    data-retro="group"
    class="hidden items-center rounded-pill border border-border-strong sm:flex"
  >
    <button
      v-for="(t, i) in themes"
      :key="t.id"
      ref="radios"
      type="button"
      role="radio"
      data-retro="button"
      :aria-checked="theme === t.id"
      :aria-label="t.label"
      :title="t.label"
      :tabindex="theme === t.id ? 0 : -1"
      class="inline-flex size-11 cursor-pointer items-center justify-center rounded-pill"
      :class="theme === t.id ? 'bg-ink text-surface' : 'text-ink-3 hover:text-ink'"
      @click="setTheme(t.id)"
      @keydown="onKeydown($event, i)"
    >
      <component :is="icons[t.id]" />
    </button>
  </div>
</template>
