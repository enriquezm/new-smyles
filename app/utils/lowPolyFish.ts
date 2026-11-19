import {
  BufferGeometry,
  ConeGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshLambertMaterial,
  SphereGeometry,
} from 'three'

export interface FishPalette {
  body: string
  fin: string
  eye: string
}

export interface LowPolyFish {
  root: Group
  /** Tail joint; flick it by rotating around y. */
  tail: Group
  paint: (palette: FishPalette) => void
  dispose: () => void
}

/** A flat triangle in the x/y plane, double-sided by construction (two faces). */
function finGeometry(points: [number, number][]) {
  const geometry = new BufferGeometry()
  const [a, b, c] = points as [[number, number], [number, number], [number, number]]
  geometry.setAttribute('position', new Float32BufferAttribute([
    ...a, 0, ...b, 0, ...c, 0,
    ...a, 0, ...c, 0, ...b, 0,
  ], 3))
  geometry.computeVertexNormals()
  return geometry
}

/**
 * A low-poly fish about 0.7 units long, nose toward +x, flat sides facing ±z,
 * centred on the origin. Lay it on the floor by rotating it onto its side.
 */
export function buildLowPolyFish(): LowPolyFish {
  const bodyMaterial = new MeshLambertMaterial({ flatShading: true })
  const finMaterial = new MeshLambertMaterial({ flatShading: true })
  const eyeMaterial = new MeshLambertMaterial({ flatShading: true })
  const geometries: BufferGeometry[] = []
  function mesh(geometry: BufferGeometry, material: MeshLambertMaterial) {
    geometries.push(geometry)
    return new Mesh(geometry, material)
  }

  const root = new Group()
  const body = mesh(new IcosahedronGeometry(0.5, 0), bodyMaterial)
  body.scale.set(0.5, 0.26, 0.11)
  root.add(body)

  // Dorsal fin and tail: flat triangles, so they read as fins from any angle.
  const dorsal = mesh(finGeometry([[-0.1, 0.1], [0.08, 0.1], [-0.08, 0.2]]), finMaterial)
  root.add(dorsal)
  const tail = new Group()
  tail.position.x = -0.24
  tail.add(mesh(finGeometry([[0, 0], [-0.17, 0.13], [-0.17, -0.13]]), finMaterial))
  root.add(tail)

  const snout = mesh(new ConeGeometry(0.05, 0.08, 4), bodyMaterial)
  snout.rotation.z = -Math.PI / 2
  snout.position.x = 0.27
  root.add(snout)
  for (const side of [-1, 1]) {
    const eye = mesh(new SphereGeometry(0.025, 5, 4), eyeMaterial)
    eye.position.set(0.15, 0.03, side * 0.05)
    root.add(eye)
  }

  function paint(palette: FishPalette) {
    bodyMaterial.color.set(palette.body)
    finMaterial.color.set(palette.fin)
    eyeMaterial.color.set(palette.eye)
  }

  function dispose() {
    for (const geometry of geometries) geometry.dispose()
    for (const material of [bodyMaterial, finMaterial, eyeMaterial]) material.dispose()
  }

  return { root, tail, paint, dispose }
}
