import {
  BufferAttribute,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SphereGeometry,
} from 'three'
import type { BufferGeometry } from 'three'

/** Seal-point Siamese: a pale coat with dark "points" on the face, ears, legs and tail. */
export interface CatPalette {
  /** Main coat (cream). */
  fur: string
  /** Darker fawn, shaded into the coat a face at a time. */
  shade: string
  /** Ears, face mask, legs, paws and tail. */
  point: string
  eye: string
  nose: string
  shadow: string
}

/** Which tone a part is painted with; `coat` and `head` blend fur and shade per face. */
type Coat = 'coat' | 'head' | 'point'

export interface LowPolyCat {
  root: Group
  /** Everything above the shadow; bobs and purrs. */
  body: Group
  head: Group
  eyes: Group
  /** Hip joints: front-left, front-right, back-left, back-right. */
  legs: Group[]
  /** Tail joints from the base out. */
  tail: Group[]
  paint: (palette: CatPalette) => void
  dispose: () => void
}

function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

/**
 * A low-poly cat facing +x, standing on y = 0, about 1.1 units tall and 1.3
 * long (plus tail). Built from a handful of faceted primitives so it needs no
 * model file; joints are groups so the scene can animate a walk cycle.
 */
export function buildLowPolyCat(): LowPolyCat {
  const furMaterial = new MeshLambertMaterial({ vertexColors: true, flatShading: true })
  const eyeMaterial = new MeshLambertMaterial({ flatShading: true })
  const noseMaterial = new MeshLambertMaterial({ flatShading: true })
  const shadowMaterial = new MeshBasicMaterial({ transparent: true, opacity: 0.14, depthWrite: false })
  const coats: { geometry: BufferGeometry, coat: Coat, seed: number }[] = []
  const geometries: BufferGeometry[] = []

  function fur(source: BufferGeometry, coat: Coat) {
    // Flat per-face colour needs every face to own its vertices.
    const geometry = source.index ? source.toNonIndexed() : source
    if (geometry !== source) source.dispose()
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(geometry.getAttribute('position').count * 3), 3))
    coats.push({ geometry, coat, seed: coats.length * 13.7 })
    geometries.push(geometry)
    return new Mesh(geometry, furMaterial)
  }

  function plain(geometry: BufferGeometry, material: MeshLambertMaterial | MeshBasicMaterial) {
    geometries.push(geometry)
    return new Mesh(geometry, material)
  }

  const root = new Group()
  const body = new Group()
  root.add(body)

  const shadow = plain(new CircleGeometry(0.5, 12), shadowMaterial)
  shadow.rotation.x = -Math.PI / 2
  shadow.scale.set(1.5, 0.55, 1)
  shadow.position.y = 0.005
  root.add(shadow)

  const torso = fur(new IcosahedronGeometry(0.5, 0), 'coat')
  torso.scale.set(1.25, 0.6, 0.62)
  torso.position.set(0, 0.6, 0)
  body.add(torso)

  // Head
  const head = new Group()
  head.position.set(0.62, 0.86, 0)
  body.add(head)
  const skull = fur(new IcosahedronGeometry(0.29, 1), 'head')
  skull.scale.set(1, 0.88, 1.05)
  head.add(skull)
  // The face mask.
  const muzzle = fur(new IcosahedronGeometry(0.13, 0), 'point')
  muzzle.scale.set(0.9, 0.7, 1.2)
  muzzle.position.set(0.21, -0.09, 0)
  head.add(muzzle)
  for (const side of [-1, 1]) {
    const ear = fur(new ConeGeometry(0.11, 0.24, 4), 'point')
    ear.position.set(-0.02, 0.27, side * 0.14)
    ear.rotation.set(side * -0.3, 0, -0.1)
    head.add(ear)
  }
  const nose = plain(new ConeGeometry(0.04, 0.05, 3), noseMaterial)
  nose.rotation.z = Math.PI
  nose.position.set(0.31, -0.03, 0)
  head.add(nose)
  const eyes = new Group()
  eyes.position.set(0.22, 0.05, 0)
  head.add(eyes)
  for (const side of [-1, 1]) {
    const eye = plain(new SphereGeometry(0.052, 6, 4), eyeMaterial)
    eye.position.z = side * 0.115
    eyes.add(eye)
  }

  // Legs: a hip joint per leg so they can swing; points all the way down.
  const legs: Group[] = []
  for (const [x, z] of [[0.36, 0.17], [0.36, -0.17], [-0.36, 0.17], [-0.36, -0.17]] as const) {
    const hip = new Group()
    hip.position.set(x, 0.48, z)
    const leg = fur(new CylinderGeometry(0.08, 0.06, 0.44, 5), 'point')
    leg.position.y = -0.22
    const paw = fur(new IcosahedronGeometry(0.075, 0), 'point')
    paw.scale.set(1.3, 0.6, 1)
    paw.position.set(0.03, -0.45, 0)
    hip.add(leg, paw)
    body.add(hip)
    legs.push(hip)
  }

  // Tail: a chain of joints, all point colour, curling up and back.
  const tail: Group[] = []
  let parent: Group = body
  for (let i = 0; i < 5; i++) {
    const joint = new Group()
    if (i === 0) joint.position.set(-0.6, 0.66, 0)
    else joint.position.y = 0.2
    const segment = fur(new CylinderGeometry(0.045 - i * 0.004, 0.055 - i * 0.004, 0.22, 5), 'point')
    segment.position.y = 0.1
    joint.add(segment)
    parent.add(joint)
    tail.push(joint)
    parent = joint
  }

  function paint(palette: CatPalette) {
    const furColor = new Color(palette.fur)
    const shade = new Color(palette.shade)
    const point = new Color(palette.point)
    const c = new Color()
    for (const { geometry, coat, seed } of coats) {
      const color = geometry.getAttribute('color') as BufferAttribute
      for (let f = 0; f < color.count / 3; f++) {
        // Siamese coats darken toward the face, so the head takes more shade than the body.
        if (coat === 'point') c.copy(point)
        else c.copy(furColor).lerp(shade, hash(seed + f) * (coat === 'head' ? 0.9 : 0.55))
        for (let k = 0; k < 3; k++) color.setXYZ(f * 3 + k, c.r, c.g, c.b)
      }
      color.needsUpdate = true
    }
    eyeMaterial.color.set(palette.eye)
    noseMaterial.color.set(palette.nose)
    shadowMaterial.color.set(palette.shadow)
  }

  function dispose() {
    for (const geometry of geometries) geometry.dispose()
    for (const material of [furMaterial, eyeMaterial, noseMaterial, shadowMaterial]) material.dispose()
  }

  return { root, body, head, eyes, legs, tail, paint, dispose }
}
