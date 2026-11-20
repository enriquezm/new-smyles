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
const props = defineProps<{
  weeks: ContributionWeek[]
  still: boolean
  visible: boolean
  /** Camera angles shared with the drag handlers in GithubSkyline. */
  orbit: SkylineOrbit
}>()
/** `view` reports the angles actually shown each frame, so a drag starts from there. */
const emit = defineEmits<{ ready: [], view: [angles: OrbitAngles] }>()

const DEG = Math.PI / 180
const GAP = 0.18
const BASE = 0.12
const STEP = 0.8
/** Fraction of `accent` mixed into the surface colour per level, matching the 2D heatmap. */
const MIX = [0, 0.3, 0.55, 0.8, 1] as const
const RISE = 1.6
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
  // Same as the 2D heatmap's empty cells (white in pop, where `rule` is black).
  const empty = token('heat-0')
  const surface = token('surface')
  const accent = token('accent')
  const c = new Color()
  props.weeks.forEach((week, w) => week.forEach((level, d) => {
    c.copy(level === 0 ? empty : surface).lerp(accent, MIX[level])
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
const centre = new Vector3(0, maxHeight / 2, 0)

/** Puts the camera on a sphere around the skyline at the given angles, looking at its centre. */
function place(cam: OrthographicCamera, elevation: number, azimuth: number) {
  const el = elevation * DEG
  const az = azimuth * DEG
  cam.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(60)
  cam.position.y += maxHeight / 2
  cam.lookAt(0, maxHeight / 2, 0)
  cam.updateMatrixWorld()
}

/** Half the view height that fits the whole skyline, with a margin, from where the camera is now. */
function fitHalfHeight(cam: OrthographicCamera, aspect: number) {
  right.setFromMatrixColumn(cam.matrixWorld, 0)
  up.setFromMatrixColumn(cam.matrixWorld, 1)
  let halfW = 0
  let halfH = 0
  for (const corner of corners) {
    const v = corner.clone().sub(centre)
    halfW = Math.max(halfW, Math.abs(v.dot(right)))
    halfH = Math.max(halfH, Math.abs(v.dot(up)))
  }
  return Math.max(halfH, halfW / aspect) * 1.06
}

/**
 * Points the camera from the given angles. The zoom is always the one that
 * frames the default view, so rotating feels like turning a real object
 * (no zoom pumping); end-on angles simply crop the overhang.
 */
function aim(elevation: number, azimuth: number) {
  const cam = camera.value
  if (!(cam instanceof OrthographicCamera)) return
  const aspect = sizes.width.value / Math.max(sizes.height.value, 1)
  place(cam, SKYLINE_VIEW.elevation, SKYLINE_VIEW.azimuth)
  const h = fitHalfHeight(cam, aspect)
  place(cam, elevation, azimuth)
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
let elevation = props.still ? SKYLINE_VIEW.elevation : 89
let azimuth = props.still ? SKYLINE_VIEW.azimuth : 0
let swayWeight = 1
let elapsed = 0
let announced = false
layout(t / RISE)

const { onBeforeRender, start, stop } = useLoop()
onBeforeRender(({ delta }) => {
  const dt = Math.min(delta, 0.1)
  elapsed += dt
  if (!props.still && t < RISE) {
    t = Math.min(RISE, t + dt)
    layout(t / RISE)
  }

  // Someone is steering: follow them closely. Otherwise settle on the default
  // view, the nearest full turn of it so a reset never unwinds several spins.
  const { target } = props.orbit
  const goal = target ?? {
    elevation: SKYLINE_VIEW.elevation,
    azimuth: SKYLINE_VIEW.azimuth + 360 * Math.round((azimuth - SKYLINE_VIEW.azimuth) / 360),
  }
  if (props.still) {
    elevation = goal.elevation
    azimuth = goal.azimuth
  }
  else {
    // Opens top-down, so it reads as the 2D heatmap, then tilts as the bars rise.
    const rate = target ? 12 : 2.4
    elevation = damp(elevation, goal.elevation, rate, dt)
    azimuth = damp(azimuth, goal.azimuth, rate, dt)
  }

  // A slow sway while idle, so it reads as 3D; it fades out while steered.
  swayWeight = damp(swayWeight, target || props.still ? 0 : 1, 3, dt)
  const sway = Math.sin(elapsed * 0.35) * 6 * Math.min(1, elapsed / RISE) * swayWeight
  aim(elevation, azimuth + sway)
  emit('view', { azimuth: azimuth + sway, elevation })

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
