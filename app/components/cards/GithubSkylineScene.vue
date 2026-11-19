<script setup lang="ts">
import { useLoop, useTres } from '@tresjs/core'
import { useMutationObserver } from '@vueuse/core'
import {
  BoxGeometry,
  Color,
  InstancedMesh,
  MeshLambertMaterial,
  Object3D,
  OrthographicCamera,
  Vector3,
} from 'three'
import type { ContributionWeek } from '~/data/site'

/** Rendered inside <TresCanvas>: one bar per day, weeks along x, weekdays along z. */
const props = defineProps<{ weeks: ContributionWeek[], still: boolean, visible: boolean }>()
const emit = defineEmits<{ ready: [] }>()

const DEG = Math.PI / 180
const GAP = 0.18
const BASE = 0.12
const STEP = 0.8
/** Fraction of `accent` mixed into the surface colour per level, matching the 2D heatmap. */
const MIX = [0, 0.3, 0.55, 0.8, 1] as const
const RISE = 1.6
/** Final camera angles: a classic isometric-ish skyline view. */
const ELEVATION = 26
const AZIMUTH = -16

const days = props.weeks.length * 7
const box = new BoxGeometry(1 - GAP, 1, 1 - GAP)
box.translate(0, 0.5, 0) // grow up from the ground
const material = new MeshLambertMaterial({ flatShading: true })
const bars = new InstancedMesh(box, material, days)
const width = props.weeks.length
const depth = 7
const maxHeight = BASE + STEP * 4

function readColors() {
  const css = getComputedStyle(document.documentElement)
  const token = (name: string) => new Color(css.getPropertyValue(`--color-${name}`).trim())
  const rule = token('rule')
  const surface = token('surface')
  const accent = token('accent')
  const c = new Color()
  props.weeks.forEach((week, w) => week.forEach((level, d) => {
    c.copy(level === 0 ? rule : surface).lerp(accent, MIX[level])
    bars.setColorAt(w * 7 + d, c)
  }))
  if (bars.instanceColor) bars.instanceColor.needsUpdate = true
}
readColors()
useMutationObserver(() => document.documentElement, readColors, { attributes: true, attributeFilter: ['data-theme'] })

const dummy = new Object3D()
/** Lays the bars out at `t` (0 flat → 1 full height); later weeks rise a little later. */
function layout(t: number) {
  props.weeks.forEach((week, w) => week.forEach((level, d) => {
    const delay = (w / width) * 0.45
    const p = Math.min(1, Math.max(0, (t - delay) / 0.55))
    const e = 1 - (1 - p) ** 3
    dummy.position.set(w - width / 2 + 0.5, 0, d - depth / 2 + 0.5)
    dummy.scale.set(1, BASE + STEP * level * e, 1)
    dummy.updateMatrix()
    bars.setMatrixAt(w * 7 + d, dummy.matrix)
  }))
  bars.instanceMatrix.needsUpdate = true
}

const { camera, sizes } = useTres()
const corners = [-1, 1].flatMap(x => [0, 1].flatMap(y => [-1, 1].map(z =>
  new Vector3((x * width) / 2, y * maxHeight, (z * depth) / 2))))
const right = new Vector3()
const up = new Vector3()

/** Points the camera from the given angles and zooms so the whole skyline fits with a margin. */
function aim(elevation: number, azimuth: number) {
  const cam = camera.value
  if (!(cam instanceof OrthographicCamera)) return
  const el = elevation * DEG
  const az = azimuth * DEG
  cam.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(60)
  cam.position.y += maxHeight / 2
  cam.lookAt(0, maxHeight / 2, 0)
  cam.updateMatrixWorld()
  right.setFromMatrixColumn(cam.matrixWorld, 0)
  up.setFromMatrixColumn(cam.matrixWorld, 1)
  let halfW = 0
  let halfH = 0
  const centre = new Vector3(0, maxHeight / 2, 0)
  for (const corner of corners) {
    const v = corner.clone().sub(centre)
    halfW = Math.max(halfW, Math.abs(v.dot(right)))
    halfH = Math.max(halfH, Math.abs(v.dot(up)))
  }
  const aspect = sizes.width.value / Math.max(sizes.height.value, 1)
  const pad = 1.06
  const h = Math.max(halfH, halfW / aspect) * pad
  cam.left = -h * aspect
  cam.right = h * aspect
  cam.top = h
  cam.bottom = -h
  cam.near = 0.1
  cam.far = 200
  cam.updateProjectionMatrix()
}

function damp(from: number, to: number, rate: number, dt: number) {
  return from + (to - from) * (1 - Math.exp(-rate * dt))
}

let t = props.still ? RISE : 0
let elevation = props.still ? ELEVATION : 89
let azimuth = props.still ? AZIMUTH : 0
let elapsed = 0
let announced = false
layout(t / RISE)

const { onBeforeRender, start, stop } = useLoop()
onBeforeRender(({ delta }) => {
  const dt = Math.min(delta, 0.1)
  elapsed += dt
  if (!props.still) {
    // Start top-down, so it reads as the 2D heatmap, then tilt as the bars rise.
    if (t < RISE) {
      t = Math.min(RISE, t + dt)
      layout(t / RISE)
    }
    elevation = damp(elevation, ELEVATION, 2.4, dt)
    azimuth = damp(azimuth, AZIMUTH, 2.4, dt)
  }
  // A slow sway once it has settled, so it reads as 3D even when idle.
  const sway = props.still ? 0 : Math.sin(elapsed * 0.35) * 6 * Math.min(1, elapsed / RISE)
  aim(elevation, azimuth + sway)
  if (!announced) {
    announced = true
    emit('ready')
  }
})

watch(() => props.visible, v => (v ? start() : stop()), { immediate: true })

onBeforeUnmount(() => {
  box.dispose()
  material.dispose()
  bars.dispose()
})
</script>

<template>
  <TresOrthographicCamera />
  <TresAmbientLight :intensity="2" />
  <TresDirectionalLight
    :position="[-4, 10, 6]"
    :intensity="2"
  />
  <primitive :object="bars" />
</template>
