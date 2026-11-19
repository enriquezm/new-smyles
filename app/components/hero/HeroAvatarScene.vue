<script setup lang="ts">
import { useLoop, useTres } from '@tresjs/core'
import { Group, Mesh, MeshLambertMaterial, PerspectiveCamera } from 'three'

/** Rendered inside <TresCanvas>: the low-poly photo relief. */
const props = defineProps<{
  src: string
  /** Where the pointer is relative to the avatar, each axis roughly -1..1. */
  pointer: { x: number, y: number }
  still: boolean
  visible: boolean
}>()
/** `ready` fires once the facets have fully assembled over the photo. */
const emit = defineEmits<{ ready: [], failed: [] }>()

const FOV = 30
const DEG = Math.PI / 180
// Just far enough that a unit square fills the view.
const DISTANCE = 0.5 / Math.tan((FOV / 2) * DEG)
/** Oversized so tilting never shows the edge of the relief inside the rounded tile. */
const OVERSCAN = 1.24
const MAX_TILT = 0.22

const tilt = new Group()
tilt.scale.setScalar(OVERSCAN)
const material = new MeshLambertMaterial({ vertexColors: true, flatShading: true })
let image: LowPolyImage | null = null
let elapsed = 0
let assembled = false

sampleImage(props.src, 96)
  .then((pixels) => {
    image = buildLowPolyImage(pixels)
    tilt.add(new Mesh(image.geometry, material))
    if (props.still) {
      assembleLowPolyImage(image, Infinity)
      assembled = true
      emit('ready')
    }
    else {
      assembleLowPolyImage(image, 0)
    }
  })
  .catch(() => emit('failed'))

const { camera, sizes } = useTres()
watch(
  [camera, sizes.width, sizes.height],
  () => {
    const cam = camera.value
    if (!(cam instanceof PerspectiveCamera)) return
    cam.position.set(0, 0, DISTANCE)
    cam.lookAt(0, 0, 0)
    cam.fov = FOV
    cam.aspect = 1
    cam.updateProjectionMatrix()
  },
  { immediate: true },
)

function damp(from: number, to: number, rate: number, dt: number) {
  return from + (to - from) * (1 - Math.exp(-rate * dt))
}

const { onBeforeRender, start, stop } = useLoop()

onBeforeRender(({ delta }) => {
  if (!image || props.still) return
  const dt = Math.min(delta, 0.1)
  if (!assembled) {
    elapsed += dt
    assembled = assembleLowPolyImage(image, elapsed)
    // The photo underneath fades out only now, so the page never shows through the gaps.
    if (assembled) emit('ready')
  }
  // Lean toward the pointer, like the tile is looking at it.
  tilt.rotation.y = damp(tilt.rotation.y, props.pointer.x * MAX_TILT, 5, dt)
  tilt.rotation.x = damp(tilt.rotation.x, props.pointer.y * MAX_TILT, 5, dt)
})

watch(() => props.visible, v => (v ? start() : stop()), { immediate: true })

onBeforeUnmount(() => {
  image?.geometry.dispose()
  material.dispose()
})
</script>

<template>
  <TresPerspectiveCamera />
  <TresAmbientLight :intensity="2.6" />
  <TresDirectionalLight
    :position="[-1, 1.5, 2]"
    :intensity="1.2"
  />
  <primitive :object="tilt" />
</template>
