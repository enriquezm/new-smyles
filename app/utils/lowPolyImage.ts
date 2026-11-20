import { BufferAttribute, BufferGeometry, Color, SRGBColorSpace } from 'three'

/** Loads an image and returns its pixels at a small size, for sampling facet colours. */
export async function sampleImage(src: string, size: number) {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  await img.decode()
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('2D canvas unavailable')
  ctx.drawImage(img, 0, 0, size, size)
  return ctx.getImageData(0, 0, size, size)
}

/** Stable pseudo-random value in [0, 1) for a grid point. */
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

export interface LowPolyImage {
  geometry: BufferGeometry
  /** Resting vertex positions; the intro animates from these. */
  rest: Float32Array
  /** Per-face centroid (x, y, z), for the assemble animation. */
  centroids: Float32Array
  /** Per-face start delay in [0, 1]. */
  delays: Float32Array
}

/**
 * Turns an image into a unit-square relief of flat triangles: a jittered grid,
 * each face one colour sampled from the image, brighter areas raised slightly.
 */
export function buildLowPolyImage(pixels: ImageData, cells = 14, depth = 0.08): LowPolyImage {
  const { width, height, data } = pixels
  const n = cells + 1

  function sample(u: number, v: number) {
    const x = Math.min(width - 1, Math.max(0, Math.round(u * (width - 1))))
    const y = Math.min(height - 1, Math.max(0, Math.round(v * (height - 1))))
    const i = (y * width + x) * 4
    return [data[i]! / 255, data[i + 1]! / 255, data[i + 2]! / 255] as const
  }

  // Grid points in uv space (0..1, v down). Interior points are jittered; edges stay straight.
  const uv = new Float32Array(n * n * 2)
  const z = new Float32Array(n * n)
  for (let gy = 0; gy < n; gy++) {
    for (let gx = 0; gx < n; gx++) {
      const edgeX = gx === 0 || gx === cells
      const edgeY = gy === 0 || gy === cells
      const u = (gx + (edgeX ? 0 : (hash(gx, gy) - 0.5) * 0.7)) / cells
      const v = (gy + (edgeY ? 0 : (hash(gy + 31, gx + 17) - 0.5) * 0.7)) / cells
      const k = gy * n + gx
      uv[k * 2] = u
      uv[k * 2 + 1] = v
      const [r, g, b] = sample(u, v)
      z[k] = (0.2126 * r + 0.7152 * g + 0.0722 * b) * depth + hash(gx + 7, gy + 3) * depth * 0.3
    }
  }

  const faces = cells * cells * 2
  const position = new Float32Array(faces * 9)
  const color = new Float32Array(faces * 9)
  const centroids = new Float32Array(faces * 3)
  const delays = new Float32Array(faces)

  const linear = new Color()
  let f = 0
  function face(a: number, b: number, c: number) {
    let cu = 0
    let cv = 0
    let cz = 0
    for (const [slot, k] of [a, b, c].entries()) {
      const u = uv[k * 2]!
      const v = uv[k * 2 + 1]!
      // Unit square centred on the origin, y up.
      position.set([u - 0.5, 0.5 - v, z[k]!], f * 9 + slot * 3)
      cu += u / 3
      cv += v / 3
      cz += z[k]! / 3
    }
    // Image pixels are sRGB; vertex colours must be linear.
    const [red, green, blue] = sample(cu, cv)
    linear.setRGB(red, green, blue, SRGBColorSpace)
    for (let slot = 0; slot < 3; slot++) color.set([linear.r, linear.g, linear.b], f * 9 + slot * 3)
    centroids.set([cu - 0.5, 0.5 - cv, cz], f * 3)
    // Assemble from the centre outwards, with a little scatter.
    delays[f] = Math.min(1, Math.hypot(cu - 0.5, cv - 0.5) * 1.2 + hash(f, 99) * 0.25)
    f++
  }

  for (let gy = 0; gy < cells; gy++) {
    for (let gx = 0; gx < cells; gx++) {
      const tl = gy * n + gx
      const tr = tl + 1
      const bl = tl + n
      const br = bl + 1
      // Alternate the diagonal so the facets don't all lean one way.
      if ((gx + gy) % 2 === 0) {
        face(tl, bl, tr)
        face(tr, bl, br)
      }
      else {
        face(tl, bl, br)
        face(tl, br, tr)
      }
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(position.slice(), 3))
  geometry.setAttribute('color', new BufferAttribute(color, 3))
  geometry.computeVertexNormals()
  return { geometry, rest: position, centroids, delays }
}

/**
 * Writes the intro frame at time `t` (seconds) into the geometry: each face
 * grows from its centroid and drops in from in front. Returns true once settled.
 */
export function assembleLowPolyImage(image: LowPolyImage, t: number, duration = 1.1) {
  const attr = image.geometry.getAttribute('position') as BufferAttribute
  const out = attr.array as Float32Array
  const { rest, centroids, delays } = image
  const span = duration * 0.55
  let settled = true
  for (let f = 0; f < delays.length; f++) {
    const p = Math.min(1, Math.max(0, (t - delays[f]! * (duration - span)) / span))
    if (p < 1) settled = false
    const e = 1 - (1 - p) ** 3 // ease-out cubic
    const cx = centroids[f * 3]!
    const cy = centroids[f * 3 + 1]!
    const cz = centroids[f * 3 + 2]!
    const lift = (1 - e) * 0.6
    for (let k = 0; k < 9; k += 3) {
      const i = f * 9 + k
      out[i] = cx + (rest[i]! - cx) * e
      out[i + 1] = cy + (rest[i + 1]! - cy) * e
      out[i + 2] = cz + (rest[i + 2]! - cz) * e + lift
    }
  }
  attr.needsUpdate = true
  return settled
}
