<script setup lang="ts">
import { useLoop, useTres } from '@tresjs/core'
import { useMutationObserver } from '@vueuse/core'
import {
  Color,
  ConeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  RingGeometry,
  SphereGeometry,
  Vector3,
} from 'three'

/** Rendered inside <TresCanvas>, so it can use the render loop. */
const props = defineProps<{
  lat: number
  lon: number
  /** Card is open: turn to face the pin. */
  focused: boolean
  /** Prefers reduced motion: hold still, facing the pin. */
  still: boolean
  visible: boolean
}>()

const FOV = 35
const DISTANCE = 4
const DEG = Math.PI / 180
const RESTING_TILT = 0.35
const SPIN_SPEED = 0.12

// Outer group tilts (x), inner group spins (y): north stays up while it turns.
const tilt = new Group()
const spin = new Group()
tilt.add(spin)

const geometry = buildGlobeGeometry()
const globeMaterial = new MeshLambertMaterial({ vertexColors: true, flatShading: true })
spin.add(new Mesh(geometry, globeMaterial))

// Pin: a stalk pointing out of the surface, a head and a flat halo ring.
const pinMaterial = new MeshLambertMaterial({ flatShading: true })
const haloMaterial = new MeshBasicMaterial({ transparent: true, opacity: 0.35, depthWrite: false })
const pin = new Group()
const stalk = new Mesh(new ConeGeometry(0.035, 0.16, 6), pinMaterial)
stalk.rotation.x = Math.PI // point down into the globe
stalk.position.y = 0.1
const head = new Mesh(new SphereGeometry(0.055, 8, 6), pinMaterial)
head.position.y = 0.2
const halo = new Mesh(new RingGeometry(0.05, 0.14, 24), haloMaterial)
halo.rotation.x = -Math.PI / 2
halo.position.y = 0.035
pin.add(stalk, head, halo)
const pinUp = latLonToVector(props.lat, props.lon)
pin.position.copy(latLonToVector(props.lat, props.lon, 1.02))
pin.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), pinUp)
spin.add(pin)

// Facing the pin: spin.y = -lon brings it to the front, tilt.x = lat levels it.
const facingSpin = -props.lon * DEG
const facingTilt = props.lat * DEG
spin.rotation.y = facingSpin
tilt.rotation.x = props.still ? facingTilt : RESTING_TILT

function readColors() {
  const css = getComputedStyle(document.documentElement)
  const token = (name: string) => css.getPropertyValue(`--color-${name}`).trim()
  paintGlobe(geometry, { ocean: token('globe-ocean'), land: token('globe-land') })
  const accent = new Color(token('accent'))
  pinMaterial.color.copy(accent)
  haloMaterial.color.copy(accent)
}

readColors()
useMutationObserver(
  () => document.documentElement,
  readColors,
  { attributes: true, attributeFilter: ['data-theme'] },
)

const { camera, sizes } = useTres()

/**
 * Frame the globe: as large as the card's short side allows, and on wide cards
 * shifted toward the right edge. The shift is a lens shift (view offset), not a
 * move, so the camera still looks straight at the globe and it stays round.
 */
function frame() {
  const width = sizes.width.value
  const height = Math.max(sizes.height.value, 1)
  const aspect = width / height
  const halfH = Math.tan((FOV / 2) * DEG) * DISTANCE
  const radius = Math.min(halfH * 0.8, halfH * aspect * 0.9)
  tilt.scale.setScalar(radius)

  const cam = camera.value
  if (!(cam instanceof PerspectiveCamera)) return
  cam.position.set(0, 0, DISTANCE)
  cam.lookAt(0, 0, 0)
  cam.fov = FOV
  cam.aspect = aspect
  const radiusPx = (radius / halfH) * (height / 2)
  const centreX = aspect > 1.4 ? width - radiusPx * 1.3 : width / 2
  // Narrow cards stack the city label at the bottom, so lift the globe clear of it.
  const centreY = aspect < 1 ? Math.max(radiusPx + 8, height * 0.4) : height / 2
  cam.setViewOffset(width, height, width / 2 - centreX, height / 2 - centreY, width, height)
  cam.updateProjectionMatrix()
}

watch([sizes.width, sizes.height, camera], frame, { immediate: true })

/** Moves `from` toward `to`, frame-rate independent. */
function damp(from: number, to: number, rate: number, delta: number) {
  return from + (to - from) * (1 - Math.exp(-rate * delta))
}

const { onBeforeRender, start, stop } = useLoop()

onBeforeRender(({ delta, elapsed }) => {
  const dt = Math.min(delta, 0.1)
  if (props.still) {
    spin.rotation.y = facingSpin
    tilt.rotation.x = facingTilt
    halo.scale.setScalar(1)
    return
  }
  if (props.focused) {
    // Nearest full turn that faces the pin, so it never spins the long way round.
    const turns = Math.round((spin.rotation.y - facingSpin) / (Math.PI * 2))
    spin.rotation.y = damp(spin.rotation.y, facingSpin + turns * Math.PI * 2, 3, dt)
    tilt.rotation.x = damp(tilt.rotation.x, facingTilt, 3, dt)
  }
  else {
    spin.rotation.y += SPIN_SPEED * dt
    tilt.rotation.x = damp(tilt.rotation.x, RESTING_TILT, 2, dt)
  }
  const pulse = (elapsed % 2) / 2
  halo.scale.setScalar(0.8 + pulse * 0.7)
  haloMaterial.opacity = 0.4 * (1 - pulse)
})

// Only spend frames while the card is on screen.
watch(() => props.visible, v => (v ? start() : stop()), { immediate: true })

onBeforeUnmount(() => {
  geometry.dispose()
  globeMaterial.dispose()
  pinMaterial.dispose()
  haloMaterial.dispose()
  for (const part of [stalk, head, halo]) part.geometry.dispose()
})
</script>

<template>
  <TresPerspectiveCamera />
  <TresAmbientLight :intensity="1.7" />
  <TresDirectionalLight
    :position="[-3, 4, 5]"
    :intensity="1.5"
  />
  <primitive :object="tilt" />
</template>
