<script setup lang="ts">
import type { VNode } from 'vue'

// Inline `code` in markdown posts. A bare hex value like `#8C7DFF` renders as a
// swatch: its own color as the background, with black or white text, whichever
// contrasts more (pure black/white always clears 4.5:1).
const slots = useSlots()

const HEX = /^#[0-9a-f]{6}$/i

function slotText(nodes: VNode[]): string {
  return nodes.map(n => (typeof n.children === 'string' ? n.children : '')).join('').trim()
}

function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function swatch(): { background: string, light: boolean } | null {
  const text = slotText(slots.default?.() ?? [])
  if (!HEX.test(text)) return null
  const l = luminance(text)
  // Contrast with white is 1.05 / (l + 0.05); with black, (l + 0.05) / 0.05.
  return { background: text, light: 1.05 / (l + 0.05) > (l + 0.05) / 0.05 }
}
</script>

<template>
  <code
    v-if="swatch()"
    class="ring-1 ring-swatch-edge ring-inset"
    :class="swatch()?.light ? 'text-swatch-on-dark' : 'text-swatch-on-light'"
    :style="{ background: swatch()?.background }"
  ><slot /></code>
  <code v-else><slot /></code>
</template>
