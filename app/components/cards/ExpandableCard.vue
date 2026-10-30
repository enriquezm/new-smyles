<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { unrefElement, usePreferredReducedMotion } from '@vueuse/core'
import type { CardId } from '~/data/site'
import type { CardMobileHeight, CardSpan, CardVariant } from '~/types/card'

const props = withDefaults(defineProps<{
  id: CardId
  title: string
  span: CardSpan
  open: boolean
  variant?: CardVariant
  mobileHeight?: CardMobileHeight
  /** DOM id for in-page links (#toolkit, #contact). */
  anchor?: string
  /** Show the corner expand glyph while collapsed. */
  glyph?: boolean
  /** Padding and gap of the content column. */
  bodyClass?: string
}>(), {
  variant: 'light',
  mobileHeight: 240,
  anchor: undefined,
  glyph: true,
  bodyClass: 'gap-4 p-5',
})

const emit = defineEmits<{ toggle: [id: CardId] }>()

const { openId } = injectOpenCard()
const reducedMotion = usePreferredReducedMotion()
const prefersReduced = computed(() => reducedMotion.value === 'reduce')

const LAYOUT_DURATION = 0.4
const transition = computed(() =>
  prefersReduced.value
    ? { duration: 0 }
    : { type: 'spring' as const, bounce: 0, duration: LAYOUT_DURATION },
)

const root = useTemplateRef<ComponentPublicInstance>('root')
const expandButton = useTemplateRef<HTMLButtonElement>('expandButton')
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')
const labelId = computed(() => `card-${props.id}-label`)

const spanBase = { 1: 'col-span-1', 2: 'col-span-2' } as const
const spanSm = { 1: 'sm:col-span-1', 2: 'sm:col-span-2' } as const
const spanLg = { 1: 'lg:col-span-1', 2: 'lg:col-span-2' } as const
// Collapsed cards have a fixed height; open cards grow but never shrink below it.
const heightBase: Record<CardMobileHeight, string> = {
  240: 'h-[240px]',
  280: 'h-[280px]',
  290: 'h-[290px]',
}
const minHeightBase: Record<CardMobileHeight, string> = {
  240: 'min-h-[240px]',
  280: 'min-h-[280px]',
  290: 'min-h-[290px]',
}
const heightUp = 'sm:h-[250px] lg:h-[260px] 2xl:h-[280px]'
const minHeightUp = 'sm:min-h-[250px] lg:min-h-[260px] 2xl:min-h-[280px]'

const surfaces: Record<CardVariant, { base: string, border: string, glyph: string, close: string }> = {
  light: {
    base: 'bg-surface',
    border: 'border-border',
    glyph: 'text-ink-muted-lg group-hover:text-ink',
    close: 'bg-chip text-ink',
  },
  map: {
    base: 'bg-surface-map',
    border: 'border-border',
    glyph: 'text-ink-muted-lg group-hover:text-ink',
    close: 'bg-surface text-ink',
  },
  dark: {
    base: 'bg-contact-bg text-contact-text [&_:focus-visible]:outline-contact-text',
    border: 'border-contact-bg',
    glyph: 'text-contact-glyph group-hover:text-contact-text',
    close: 'bg-contact-pill text-contact-text',
  },
}

const surface = computed(() => surfaces[props.variant])

const cardClass = computed(() => {
  const s = surface.value
  const layout = props.open
    ? ['col-span-full h-auto', minHeightBase[props.mobileHeight], minHeightUp]
    : [spanBase[props.span.base], spanSm[props.span.sm], spanLg[props.span.lg], heightBase[props.mobileHeight], heightUp]
  const state = props.open
    ? [props.variant === 'dark' ? s.border : 'border-border-open', 'shadow-card-hover']
    : [s.border, 'shadow-card hover:shadow-card-hover motion-safe:hover:-translate-y-[3px]']
  return [s.base, ...layout, ...state]
})

function revealCard() {
  const el = unrefElement(root)
  if (!(el instanceof HTMLElement)) return
  const delay = prefersReduced.value ? 0 : LAYOUT_DURATION * 1000
  window.setTimeout(() => {
    const { top } = el.getBoundingClientRect()
    if (top < 0 || top > window.innerHeight * 0.5) {
      el.scrollIntoView({ block: 'start', behavior: prefersReduced.value ? 'auto' : 'smooth' })
    }
  }, delay)
}

watch(() => props.open, async (isOpen) => {
  await nextTick()
  if (isOpen) {
    closeButton.value?.focus({ preventScroll: true })
    revealCard()
  }
  else if (openId.value === null) {
    // Closed outright (× or Escape), not because another card opened.
    expandButton.value?.focus({ preventScroll: true })
  }
})
</script>

<template>
  <Motion
    :id="anchor"
    ref="root"
    as="article"
    layout
    :transition="transition"
    :aria-labelledby="labelId"
    class="group relative scroll-mt-6 overflow-hidden rounded-card border motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:ease-out"
    :class="cardClass"
  >
    <slot name="background" />

    <button
      v-if="!open"
      ref="expandButton"
      type="button"
      :aria-label="`Expand ${title}`"
      aria-expanded="false"
      class="absolute inset-0 z-[1] size-full cursor-pointer rounded-card focus-visible:-outline-offset-[3px]"
      @click="emit('toggle', id)"
    />

    <div
      class="relative z-[2] flex h-full flex-col"
      :class="[bodyClass, open ? '' : 'pointer-events-none']"
    >
      <div class="flex items-start justify-between gap-3">
        <CardLabel
          :id="labelId"
          :variant="variant"
        >
          <slot name="label" />
        </CardLabel>
        <button
          v-if="open"
          ref="closeButton"
          type="button"
          :aria-label="`Collapse ${title}`"
          aria-expanded="true"
          class="-mt-[9px] -mr-[9px] inline-flex size-11 cursor-pointer items-center justify-center rounded-full"
          :class="surface.close"
          @click="emit('toggle', id)"
        >
          <IconClose />
        </button>
        <span
          v-else-if="glyph"
          aria-hidden="true"
          class="inline-flex size-7 items-center justify-center rounded-full transition-colors"
          :class="surface.glyph"
        >
          <IconExpand />
        </span>
      </div>

      <slot />
      <slot
        v-if="open"
        name="expanded"
      />
      <slot
        v-else
        name="collapsed"
      />
    </div>
  </Motion>
</template>
