<script setup lang="ts">
import { useLoop, useTres } from '@tresjs/core'
import { PerspectiveCamera } from 'three'

/** Rendered inside <TresCanvas>: the cat, animated in place. CatVisitor moves the canvas. */
const props = defineProps<{
  walking: boolean
  /** 1 faces right, -1 faces left. */
  facing: 1 | -1
  /** Standing still and looking out at the viewer. */
  looking: boolean
  /** Crouched, head down, to pick something up off the floor. */
  reaching: boolean
  /** Has the fish in its mouth. */
  carrying: boolean
  purring: boolean
}>()

const cat = buildLowPolyCat()
const fish = buildLowPolyFish()
// Held crosswise in the mouth, turned a little so it reads as a fish from the side.
fish.root.scale.setScalar(1.05)
fish.root.rotation.set(0.35, 1.15, -0.15)
fish.root.visible = props.carrying
cat.mouth.add(fish.root)

useThemeRepaint(() => {
  cat.paint({
    fur: readColorToken('cat-fur'),
    eye: readColorToken('cat-eye'),
    nose: readColorToken('cat-nose'),
    shadow: readColorToken('cat-shadow'),
  })
  fish.paint({ body: readColorToken('fish-body'), fin: readColorToken('fish-fin'), eye: readColorToken('fish-eye') })
})

const { camera } = useTres()
watch(camera, (cam) => {
  if (!(cam instanceof PerspectiveCamera)) return
  // A little above and in front, so the walk reads side-on but the cat still has depth.
  cam.fov = STAGE_CAMERA.fov
  cam.position.set(...STAGE_CAMERA.position)
  cam.lookAt(...STAGE_CAMERA.target)
  cam.updateProjectionMatrix()
}, { immediate: true })

function damp(from: number, to: number, rate: number, dt: number) {
  return from + (to - from) * (1 - Math.exp(-rate * dt))
}

let stride = 0
let walkWeight = 0
let reach = 0
let time = 0
let nextBlink = 2
// Facing left is -π, not π, so turning swings the face toward the camera (+z), not away.
cat.root.rotation.y = props.facing === 1 ? 0 : -Math.PI

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  const dt = Math.min(delta, 0.1)
  time += dt
  fish.root.visible = props.carrying

  // Turn around through the front, so it faces the viewer on the way.
  const yaw = props.facing === 1 ? 0 : -Math.PI
  cat.root.rotation.y = damp(cat.root.rotation.y, yaw, 7, dt)

  // Walk cycle: diagonal leg pairs swing together, the body bobs twice per stride.
  walkWeight = damp(walkWeight, props.walking ? 1 : 0, 8, dt)
  stride += dt * 9 * walkWeight
  const swing = Math.sin(stride) * 0.55 * walkWeight
  const [fl, fr, bl, br] = cat.legs
  fl!.rotation.z = swing
  br!.rotation.z = swing
  fr!.rotation.z = -swing
  bl!.rotation.z = -swing

  // Reaching: pitch forward and drop the head to the floor.
  reach = damp(reach, props.reaching ? 1 : 0, 9, dt)
  cat.body.rotation.z = -0.3 * reach
  cat.body.position.y = Math.abs(Math.cos(stride)) * 0.035 * walkWeight - 0.07 * reach

  // Head: bobs with the walk, turns to look out of the screen when stopped.
  // The head faces +x; toward the camera is -y rotation facing right, +y facing left.
  const look = (props.looking || props.purring) && !props.reaching ? -props.facing : 0
  cat.head.rotation.y = damp(cat.head.rotation.y, look * 0.85, 5, dt)
  const nod = props.reaching ? -0.75 : props.purring ? 0.18 : Math.sin(stride * 2) * 0.04
  cat.head.rotation.z = damp(cat.head.rotation.z, nod, props.reaching ? 9 : 5, dt)

  // Tail: a lazy S-curve, livelier while walking, slow and content while purring.
  const tailSpeed = props.purring ? 1.2 : 2.2 + walkWeight * 2
  cat.tail.forEach((joint, i) => {
    joint.rotation.z = (i === 0 ? 0.95 : -0.18) + Math.sin(time * tailSpeed - i * 0.7) * 0.12
    joint.rotation.x = Math.sin(time * tailSpeed * 0.7 - i * 0.6) * 0.15
  })

  // A carried fish wiggles a little as the cat walks.
  fish.tail.rotation.y = Math.sin(time * 7) * 0.35 * (0.3 + walkWeight)

  // Purr: eyes squeeze shut and the whole body hums, fish or no fish.
  const blink = time > nextBlink && time < nextBlink + 0.12
  if (time > nextBlink + 0.12) nextBlink = time + 2 + Math.random() * 3
  cat.eyes.scale.y = damp(cat.eyes.scale.y, props.purring ? 0.12 : blink ? 0.1 : 1, 18, dt)
  cat.body.position.x = props.purring ? Math.sin(time * 140) * 0.006 : 0
  cat.body.position.y += props.purring ? Math.sin(time * 95) * 0.004 : 0
})

onBeforeUnmount(() => {
  cat.dispose()
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
  <primitive :object="cat.root" />
</template>
