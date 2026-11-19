<script setup lang="ts">
import { useRafFn } from '@vueuse/core'
import { catCopy } from '~/data/site'

/**
 * A low-poly cat that now and then walks in from the side of the screen,
 * stops to look at you, then turns and walks off. Click or tap it to pet it:
 * it closes its eyes and purrs for a moment. Mounted once in app.vue.
 */
const { visit, leave } = useCatVisits()

type Phase = 'enter' | 'pause' | 'turn' | 'exit' | 'purr'

/** Walking speed in px/s and how far in from the edge it stops. */
const SPEED = 72
const INSET = 12
const PURR_SECONDS = 2.8

const cat = useTemplateRef<HTMLElement>('cat')
const phase = ref<Phase>('enter')
const x = ref(-200)
/** Facing back the way it came (toward its edge). */
const facingOut = ref(false)
let width = 150
let timer = 0
let bubbleClock = 0

const facing = computed<1 | -1>(() => {
  const inward = visit.value?.side === 'left' ? 1 : -1
  return (facingOut.value ? -inward : inward) as 1 | -1
})

interface Bubble { id: number, kind: 'text' | 'heart', left: number, drift: number }
const bubbles = ref<Bubble[]>([])
let bubbleId = 0
const announcement = ref('')

watch(visit, (v) => {
  if (!v) return
  width = cat.value?.offsetWidth ?? 150
  x.value = -width
  phase.value = 'enter'
  facingOut.value = false
  bubbles.value = []
}, { flush: 'post' })

const { pause, resume } = useRafFn(({ delta }) => {
  if (!visit.value) return
  const dt = Math.min(delta / 1000, 0.1)
  switch (phase.value) {
    case 'enter':
      x.value = Math.min(INSET, x.value + SPEED * dt)
      if (x.value >= INSET) {
        phase.value = 'pause'
        timer = 1.8 + Math.random() * 1.6
      }
      break
    case 'pause':
      if ((timer -= dt) <= 0) startTurn()
      break
    case 'turn':
      if ((timer -= dt) <= 0) phase.value = 'exit'
      break
    case 'exit':
      x.value -= SPEED * dt
      if (x.value <= -width - 8) leave()
      break
    case 'purr':
      if ((bubbleClock -= dt) <= 0) {
        bubbleClock = 0.35
        spawnBubble()
      }
      if ((timer -= dt) <= 0) {
        if (facingOut.value) phase.value = 'exit'
        else startTurn()
      }
      break
  }
}, { immediate: false })

watch(visit, v => (v ? resume() : pause()))

function startTurn() {
  phase.value = 'turn'
  facingOut.value = true
  timer = 0.5
}

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
    announcement.value = ''
    nextTick(() => (announcement.value = catCopy.purrAnnouncement))
  }
  phase.value = 'purr'
  timer = PURR_SECONDS
  bubbleClock = 0
}

function dropBubble(id: number) {
  bubbles.value = bubbles.value.filter(b => b.id !== id)
}

const position = computed(() => {
  const v = visit.value
  if (!v) return {}
  return {
    top: `${v.top * 100}%`,
    [v.side]: '0px',
    transform: `translateX(${v.side === 'left' ? x.value : -x.value}px)`,
  }
})
</script>

<template>
  <div>
    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ announcement }}
    </p>
    <!-- Clipped, so a cat half off the edge never makes the page scroll sideways. -->
    <div
      v-if="visit"
      :key="visit.id"
      class="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      <div
        ref="cat"
        data-cat
        class="absolute h-[88px] w-[120px] sm:h-[110px] sm:w-[150px]"
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
    </div>
  </div>
</template>
