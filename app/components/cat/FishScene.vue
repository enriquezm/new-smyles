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

let time = 0
let nextFlop = 1.5 + Math.random() * 2

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  time += Math.min(delta, 0.1)
  // Every few seconds: a quick tail flick and a little hop.
  const since = time - nextFlop
  const flop = since > 0 && since < 0.5 ? Math.sin((since / 0.5) * Math.PI) : 0
  if (since >= 0.5) nextFlop = time + 2.5 + Math.random() * 3.5
  fish.tail.rotation.y = Math.sin(since * 30) * 0.6 * flop
  fish.root.position.y = 0.08 + flop * 0.07
  fish.root.rotation.x = lying + flop * 0.12
})

onBeforeUnmount(() => fish.dispose())
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
