<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { useElementVisibility, useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'
import { NoToneMapping } from 'three'
import { skylineCopy } from '~/data/site'
import type { ContributionWeek } from '~/data/site'

/**
 * The WebGL contribution skyline, loaded lazily and client-only from GithubCard.
 * Drag (mouse, touch or pen) or use the arrow keys to rotate it.
 */
const props = defineProps<{ weeks: ContributionWeek[] }>()
const emit = defineEmits<{ ready: [] }>()

const root = useTemplateRef<HTMLElement>('root')
useCanvasTeardown(root)
const visible = useElementVisibility(root)
const motion = usePreferredReducedMotion()
// A full year is too thin to read on a phone; show the last half-year there.
// Client-only, so this can't cause a hydration mismatch.
const fullYear = useMediaQuery('(min-width: 640px)')
const shownWeeks = computed(() => (fullYear.value ? props.weeks : props.weeks.slice(-26)))

/** Shared with the scene, which reads it every frame, so it is deliberately not reactive. */
const orbit = createSkylineOrbit()
/** What the scene last showed, so a drag or key press continues from there. */
let shown: OrbitAngles = { ...SKYLINE_VIEW }
function onView(angles: OrbitAngles) {
  shown = angles
}
/** Someone has rotated it: swap the hint for the reset button. */
const steered = ref(false)

const DEG_PER_PX_X = 0.5
const DEG_PER_PX_Y = 0.35
/** Movement before a touch drag counts as a rotation rather than a scroll. */
const TOUCH_SLOP = 10
let drag: { id: number, x: number, y: number, from: OrbitAngles, locked: boolean } | null = null

function steer(next: OrbitAngles) {
  orbit.target = { azimuth: next.azimuth, elevation: clampElevation(next.elevation) }
  steered.value = true
}

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, from: { ...(orbit.target ?? shown) }, locked: e.pointerType !== 'touch' }
  root.value?.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!drag || e.pointerId !== drag.id) return
  const dx = e.clientX - drag.x
  const dy = e.clientY - drag.y
  if (!drag.locked) {
    // On touch, wait to see which way the swipe goes: mostly vertical is the
    // page scrolling (the browser takes over), mostly sideways is a rotation.
    if (Math.hypot(dx, dy) < TOUCH_SLOP) return
    if (Math.abs(dy) > Math.abs(dx)) {
      drag = null
      return
    }
    drag.locked = true
  }
  // Drag right to swing the near end right; drag down to look from higher up.
  steer({
    azimuth: drag.from.azimuth - dx * DEG_PER_PX_X,
    elevation: drag.from.elevation + dy * DEG_PER_PX_Y,
  })
}

function endDrag(e: PointerEvent) {
  if (drag?.id !== e.pointerId) return
  drag = null
  if (root.value?.hasPointerCapture(e.pointerId)) root.value.releasePointerCapture(e.pointerId)
}

const KEY_STEPS: Record<string, OrbitAngles> = {
  ArrowLeft: { azimuth: 10, elevation: 0 },
  ArrowRight: { azimuth: -10, elevation: 0 },
  ArrowUp: { azimuth: 0, elevation: 6 },
  ArrowDown: { azimuth: 0, elevation: -6 },
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Home' || e.key === 'Escape') {
    if (!steered.value) return // let Escape reach the card, which closes it
    e.preventDefault()
    e.stopPropagation()
    reset()
    return
  }
  const step = KEY_STEPS[e.key]
  if (!step) return
  e.preventDefault()
  const from = orbit.target ?? shown
  steer({ azimuth: from.azimuth + step.azimuth, elevation: from.elevation + step.elevation })
}

function reset() {
  orbit.target = null
  steered.value = false
}
</script>

<template>
  <!--
    touch-action: pan-y keeps vertical swipes scrolling the page on phones; a
    swipe that starts sideways rotates instead. Tres styles its canvas with
    pointer-events: auto, so it is switched off to let this element get them.
  -->
  <div
    ref="root"
    tabindex="0"
    role="img"
    :aria-label="skylineCopy.label"
    class="relative size-full cursor-grab touch-pan-y select-none active:cursor-grabbing [&_canvas]:pointer-events-none!"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
    @lostpointercapture="endDrag"
    @keydown="onKeydown"
    @dblclick="reset"
    @click.stop
  >
    <TresCanvas
      alpha
      :clear-alpha="0"
      :dpr="[1, 2]"
      antialias
      :tone-mapping="NoToneMapping"
      power-preference="low-power"
    >
      <GithubSkylineScene
        :key="shownWeeks.length"
        :weeks="shownWeeks"
        :orbit="orbit"
        :still="motion === 'reduce'"
        :visible="visible"
        @ready="emit('ready')"
        @view="onView"
      />
    </TresCanvas>

    <p
      v-if="!steered"
      aria-hidden="true"
      class="pointer-events-none absolute bottom-0 left-0 font-mono text-meta text-ink-4"
    >
      {{ skylineCopy.hint }}
    </p>
    <button
      v-else
      type="button"
      class="absolute top-0 right-0 inline-flex min-h-11 min-w-11 cursor-pointer items-center rounded-pill bg-chip px-4 font-mono text-meta text-ink"
      @pointerdown.stop
      @click.stop="reset"
    >
      {{ skylineCopy.reset }}
    </button>
  </div>
</template>
