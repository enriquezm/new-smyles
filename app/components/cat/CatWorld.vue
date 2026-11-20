<script setup lang="ts">
import { catCopy } from '~/data/site'

/**
 * The cat and its fish, over the whole page. Mounted once in app.vue.
 * Both live in a clipped, click-through layer, so a cat half off the edge never
 * makes the page scroll sideways and never blocks the page except where it is.
 */
const { visit, fish, hurry, callCat, takeFish, leave } = useCatWorld()
const announcement = ref('')

function announce(text: string) {
  announcement.value = ''
  nextTick(() => (announcement.value = text))
}

function onCall() {
  callCat()
  announce(catCopy.fetchAnnouncement)
}

const called = computed(() => hurry.value || visit.value?.kind === 'fetch')
</script>

<template>
  <div>
    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ announcement }}
    </p>
    <div
      v-if="fish || visit"
      class="pointer-events-none fixed inset-0 z-40 overflow-hidden [--stage-h:88px] sm:[--stage-h:110px]"
    >
      <!-- Fades in; no leave transition, because by then it is already in the cat's mouth. -->
      <Transition
        enter-from-class="opacity-0 translate-y-1"
        enter-active-class="transition duration-500"
      >
        <FloorFish
          v-if="fish"
          :key="fish.id"
          :fish="fish"
          :called="called"
          @call="onCall"
        />
      </Transition>
      <CatVisitor
        v-if="visit"
        :key="visit.id"
        :visit="visit"
        :fish="fish"
        :hurry="hurry"
        @grab="takeFish"
        @leave="leave"
        @purr="announce(catCopy.purrAnnouncement)"
      />
    </div>
  </div>
</template>
