<script setup lang="ts">
import { useLoop, useTres } from '@tresjs/core'
import { PerspectiveCamera } from 'three'

/** Rendered inside <TresCanvas>: a fish lying on its side on the floor, flopping now and then. */
const props = defineProps<{
  /** Which way its nose points: 1 right, -1 left. */
  facing: 1 | -1
}>()

const fish = buildLowPolyFish()
useThemeRepaint(() => fish.paint({
  body: readColorToken('fish-body'),
  fin: readColorToken('fish-fin'),
  eye: readColorToken('fish-eye'),
}))

// On its side, flat face up and tipped toward the viewer so it reads as a fish.
const lying = -0.8
fish.root.scale.setScalar(1.25)
fish.root.rotation.set(lying, props.facing === 1 ? 0 : Math.PI, 0)
fish.root.position.y = 0.08

const { camera } = useTres()
watch(camera, (cam) => {
  if (!(cam instanceof PerspectiveCamera)) return
  cam.fov = STAGE_CAMERA.fov
  cam.position.set(...STAGE_CAMERA.position)
  cam.lookAt(...STAGE_CAMERA.target)
  cam.updateProjectionMatrix()
}, { immediate: true })

const FLOP_SECONDS = 0.5
/** When the current or next flop starts, in performance.now() ms (wall clock, so it keeps time while the loop is stopped). */
let flopAt = performance.now() + 1500 + Math.random() * 2000
let flopTimer: ReturnType<typeof setTimeout> | undefined
let restFrames = 0

const { onBeforeRender, start, stop } = useLoop()
const { sizes } = useTres()

/** The fish lies still between flops, so only draw while it moves (plus a few frames to land). */
function wakeAt(at: number) {
  clearTimeout(flopTimer)
  flopTimer = setTimeout(() => {
    restFrames = 0
    start()
  }, Math.max(0, at - performance.now()))
}

onBeforeRender(() => {
  // Every few seconds: a quick tail flick and a little hop.
  const since = (performance.now() - flopAt) / 1000
  const flop = since > 0 && since < FLOP_SECONDS ? Math.sin((since / FLOP_SECONDS) * Math.PI) : 0
  fish.tail.rotation.y = Math.sin(since * 30) * 0.6 * flop
  fish.root.position.y = 0.08 + flop * 0.07
  fish.root.rotation.x = lying + flop * 0.12
  if (flop > 0) return
  // At rest: draw the still pose a couple of times, then sleep until the next flop.
  if (++restFrames > 2) {
    if (since >= FLOP_SECONDS) flopAt = performance.now() + 2500 + Math.random() * 3500
    stop()
    wakeAt(flopAt)
  }
})

// A resize clears the canvas, so redraw the resting fish.
watch([sizes.width, sizes.height], () => {
  restFrames = 0
  start()
})

onBeforeUnmount(() => {
  clearTimeout(flopTimer)
  fish.dispose()
})
</script>

<template>
  <TresPerspectiveCamera />
  <TresAmbientLight :intensity="1.9" />
  <TresDirectionalLight
    :position="[2, 4, 5]"
    :intensity="1.7"
  />
  <primitive :object="fish.root" />
</template>
