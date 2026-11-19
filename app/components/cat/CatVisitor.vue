<script setup lang="ts">
import { useRafFn } from '@vueuse/core'
import { catCopy } from '~/data/site'
import type { CatVisit, FloorFish } from '~/composables/useCatWorld'

/**
 * One visit by the low-poly cat. A wander walks in from the edge, stops to
 * look at you, then turns and walks off. A fetch walks along the floor to the
 * fish, picks it up in its mouth and carries it off. Clicking the cat makes it
 * purr at any point, fish or no fish, then it carries on.
 */
const props = defineProps<{
  visit: CatVisit
  /** The fish to fetch; only used on a fetch visit. */
  fish: FloorFish | null
  /** Leave as soon as possible (the fish was clicked while wandering). */
  hurry: boolean
}>()
const emit = defineEmits<{ leave: [], grab: [], purr: [] }>()

type Phase = 'enter' | 'pause' | 'pickup' | 'turn' | 'exit' | 'purr'

/** Walking speed in px/s, how far a wander comes in, and how long things take (s). */
const SPEED = 72
const WANDER_INSET = 12
const PURR_SECONDS = 2.8
const PICKUP_SECONDS = 1.1
const GRAB_AT = 0.45

const root = useTemplateRef<HTMLElement>('root')
const phase = ref<Phase>('enter')
const x = ref(-200)
/** Facing back toward its own edge, on the way out. */
const facingOut = ref(false)
const carrying = ref(false)
const pickupTime = ref(0)
let width = 150
let stopAt = WANDER_INSET
let timer = 0
let paused: { phase: Phase, timer: number } = { phase: 'enter', timer: 0 }
let bubbleClock = 0

const facing = computed<1 | -1>(() => {
  const inward = props.visit.side === 'left' ? 1 : -1
  return (facingOut.value ? -inward : inward) as 1 | -1
})

interface Bubble { id: number, kind: 'text' | 'heart', left: number, drift: number }
const bubbles = ref<Bubble[]>([])
let bubbleId = 0

function startTurn() {
  phase.value = 'turn'
  facingOut.value = true
  timer = 0.5
}

/** After a purr, pick up where it left off (or head off, if it's been asked to). */
function carryOn(next: { phase: Phase, timer: number }) {
  if (props.hurry && props.visit.kind === 'wander' && !facingOut.value) return startTurn()
  phase.value = next.phase
  timer = next.timer
}

const { resume } = useRafFn(({ delta }) => {
  const dt = Math.min(delta / 1000, 0.1)
  switch (phase.value) {
    case 'enter':
      x.value = Math.min(stopAt, x.value + SPEED * dt)
      if (x.value >= stopAt) {
        if (props.visit.kind === 'fetch') {
          phase.value = 'pickup'
          pickupTime.value = 0
        }
        else {
          phase.value = 'pause'
          timer = 1.8 + Math.random() * 1.6
        }
      }
      break
    case 'pause':
      if ((timer -= dt) <= 0) startTurn()
      break
    case 'pickup':
      pickupTime.value += dt
      if (!carrying.value && pickupTime.value >= GRAB_AT) {
        carrying.value = true
        emit('grab')
      }
      if (pickupTime.value >= PICKUP_SECONDS) startTurn()
      break
    case 'turn':
      if ((timer -= dt) <= 0) phase.value = 'exit'
      break
    case 'exit':
      x.value -= SPEED * dt
      if (x.value <= -width - 8) emit('leave')
      break
    case 'purr':
      if ((bubbleClock -= dt) <= 0) {
        bubbleClock = 0.35
        spawnBubble()
      }
      if ((timer -= dt) <= 0) carryOn(paused)
      break
  }
}, { immediate: false })

onMounted(() => {
  width = root.value?.offsetWidth ?? 150
  x.value = -width
  if (props.visit.kind === 'fetch' && props.fish) {
    // Walk until the mouth is over the middle of the fish (its box is 0.56 of the cat's width).
    stopAt = props.fish.inset + (width * 0.56) / 2 - width * MOUTH_X
  }
  resume()
})

watch(() => props.hurry, (h) => {
  if (h && (phase.value === 'enter' || phase.value === 'pause')) startTurn()
})

function spawnBubble() {
  bubbles.value.push({
    id: ++bubbleId,
    kind: bubbleId % 3 === 0 ? 'heart' : 'text',
    left: 30 + Math.random() * 40,
    drift: (Math.random() - 0.5) * 30,
  })
}

function pet() {
  if (phase.value !== 'purr') {
    paused = { phase: phase.value, timer }
    emit('purr')
  }
  phase.value = 'purr'
  timer = PURR_SECONDS
  bubbleClock = 0
}

function dropBubble(id: number) {
  bubbles.value = bubbles.value.filter(b => b.id !== id)
}

const position = computed(() => ({
  ...(props.visit.kind === 'fetch'
    ? { bottom: `calc(${FLOOR_PX}px - ${1 - FEET_Y} * var(--stage-h))` }
    : { top: `${props.visit.top * 100}%` }),
  [props.visit.side]: '0px',
  transform: `translateX(${props.visit.side === 'left' ? x.value : -x.value}px)`,
}))
</script>

<template>
  <div
    ref="root"
    data-cat
    class="absolute h-(--stage-h) w-[calc(var(--stage-h)*1.3636)]"
    :style="position"
  >
    <button
      type="button"
      :aria-label="catCopy.label"
      class="pointer-events-auto absolute inset-0 cursor-pointer rounded-card"
      @click="pet"
    >
      <ClientOnly>
        <LazyCatCanvas
          :walking="phase === 'enter' || phase === 'exit'"
          :facing="facing"
          :looking="phase === 'pause'"
          :reaching="phase === 'pickup' && pickupTime < GRAB_AT + 0.2"
          :carrying="carrying"
          :purring="phase === 'purr'"
        />
      </ClientOnly>
    </button>

    <span
      v-for="bubble in bubbles"
      :key="bubble.id"
      aria-hidden="true"
      class="pointer-events-none absolute top-0 animate-purr-float font-mono text-[13px] font-medium"
      :class="bubble.kind === 'heart' ? 'text-accent' : 'text-ink-2'"
      :style="{ 'left': `${bubble.left}%`, '--purr-drift': `${bubble.drift}px` }"
      @animationend="dropBubble(bubble.id)"
    >
      <IconHeart
        v-if="bubble.kind === 'heart'"
        :size="15"
      />
      <template v-else>{{ catCopy.purr }}</template>
    </span>
  </div>
</template>
