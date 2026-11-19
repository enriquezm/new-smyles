import { BufferAttribute, Color, IcosahedronGeometry, Vector3 } from 'three'

/** [lon, lat] in degrees. */
type Ring = readonly (readonly [number, number])[]

/**
 * Deliberately coarse continent outlines. The globe is low-poly, so a few
 * dozen points per landmass is plenty: each face is land or sea by its centre.
 */
const land: readonly Ring[] = [
  // North America
  [[-168, 66], [-162, 70], [-140, 70], [-125, 70], [-95, 72], [-80, 73], [-62, 60], [-56, 52], [-66, 45], [-70, 42], [-76, 35], [-81, 31], [-80, 25], [-82, 27], [-84, 30], [-90, 29], [-97, 27], [-97, 22], [-92, 18], [-87, 21], [-88, 15], [-83, 9], [-78, 8], [-80, 7], [-85, 10], [-92, 14], [-105, 20], [-110, 24], [-112, 30], [-117, 32], [-124, 40], [-124, 48], [-130, 55], [-140, 60], [-152, 58], [-165, 54], [-160, 58], [-166, 62]],
  // Greenland
  [[-55, 60], [-44, 60], [-20, 70], [-18, 80], [-35, 83], [-60, 82], [-72, 78], [-58, 70]],
  // Iceland
  [[-24, 64], [-14, 64], [-14, 66.5], [-22, 66.5]],
  // South America
  [[-78, 8], [-72, 12], [-62, 11], [-52, 5], [-35, -5], [-39, -14], [-41, -22], [-48, -26], [-58, -35], [-65, -41], [-68, -50], [-70, -55], [-75, -50], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -5], [-80, 0], [-77, 4]],
  // Africa
  [[-17, 21], [-10, 30], [-6, 36], [10, 37], [20, 32], [32, 31], [35, 28], [43, 12], [51, 12], [40, -2], [40, -15], [35, -24], [32, -29], [20, -35], [17, -29], [12, -17], [13, -6], [9, -1], [9, 4], [-5, 5], [-13, 8], [-17, 14]],
  // Madagascar
  [[44, -25], [47, -25.5], [50, -15], [48, -12]],
  // Eurasia
  [[-10, 36], [-9, 43], [-1, 44], [-4, 48], [5, 53], [8, 57], [5, 62], [15, 69], [28, 71], [40, 67], [60, 70], [80, 73], [105, 78], [140, 72], [180, 68], [180, 65], [160, 60], [142, 52], [140, 45], [130, 42], [126, 38], [121, 31], [121, 25], [110, 20], [108, 11], [104, 9], [100, 13], [98, 8], [100, 3], [103, 1], [97, 17], [92, 22], [88, 22], [80, 15], [77, 8], [73, 18], [67, 25], [58, 25], [56, 27], [48, 30], [55, 22], [59, 22], [52, 13], [43, 13], [35, 28], [34, 32], [36, 36], [28, 37], [26, 40], [23, 37], [20, 40], [13, 45], [19, 40], [16, 38], [9, 44], [3, 43], [-1, 37]],
  // Great Britain and Ireland
  [[-5, 50], [1, 51], [-2, 57], [-5, 58.5], [-6, 55]],
  [[-10, 52], [-6, 52], [-6, 55], [-10, 54]],
  // Japan
  [[130, 31], [140, 35], [142, 40], [145, 44], [141, 45.5], [139, 38], [133, 34]],
  // Borneo, Sumatra, New Guinea
  [[109, 1], [117, 7], [119, 1], [116, -4], [110, -3]],
  [[95, 5.5], [106, -6], [102, -4]],
  [[131, -1], [141, -3], [150, -10], [141, -9]],
  // Australia
  [[114, -22], [122, -17], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [141, -38], [132, -31], [115, -34]],
  // New Zealand
  [[172, -34.5], [178.5, -38], [171, -46], [166.5, -46]],
]

function inRing(lon: number, lat: number, ring: Ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!
    const [xj, yj] = ring[j]!
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** Each outline's lon/lat bounding box, so most rings are ruled out with four comparisons. */
const boxes = land.map((ring) => {
  const lons = ring.map(([lon]) => lon)
  const lats = ring.map(([, lat]) => lat)
  return { ring, minLon: Math.min(...lons), maxLon: Math.max(...lons), minLat: Math.min(...lats), maxLat: Math.max(...lats) }
})

function isLand(lon: number, lat: number) {
  if (lat < -66) return true
  for (const b of boxes) {
    if (lon < b.minLon || lon > b.maxLon || lat < b.minLat || lat > b.maxLat) continue
    if (inRing(lon, lat, b.ring)) return true
  }
  return false
}

const DEG = Math.PI / 180

/**
 * Lat/lon in degrees to a unit vector. Longitude 0 faces +z and east is +x,
 * so a camera on +z sees the map the right way round.
 */
export function latLonToVector(lat: number, lon: number, radius = 1) {
  const c = Math.cos(lat * DEG)
  return new Vector3(c * Math.sin(lon * DEG), Math.sin(lat * DEG), c * Math.cos(lon * DEG)).multiplyScalar(radius)
}

function vectorToLatLon(v: Vector3) {
  const n = v.clone().normalize()
  return { lat: Math.asin(n.y) / DEG, lon: Math.atan2(n.x, n.z) / DEG }
}

/** Stable pseudo-random value in [0, 1) for a point, so shared vertices move together. */
function hash(v: Vector3) {
  const s = Math.sin(v.x * 127.1 + v.y * 311.7 + v.z * 74.7) * 43758.5453
  return s - Math.floor(s)
}

export interface GlobeColors {
  ocean: string
  land: string
}

/**
 * A faceted globe: an icosphere whose land vertices are lifted and jittered,
 * with one flat colour per face. Re-colour it with `paintGlobe`.
 */
export function buildGlobeGeometry(detail = 14) {
  // Polyhedron geometry is non-indexed: every face owns its three vertices.
  const geometry = new IcosahedronGeometry(1, detail)
  const position = geometry.getAttribute('position') as BufferAttribute
  const v = new Vector3()
  const centre = new Vector3()

  // Lift land a little, with a stable jitter per shared vertex for the low-poly relief.
  // Each corner is shared by up to six faces, so work out each position once.
  const radii = new Map<string, number>()
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i)
    const key = `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`
    let r = radii.get(key)
    if (r === undefined) {
      const { lat, lon } = vectorToLatLon(v)
      r = isLand(lon, lat) ? 1.018 + hash(v) * 0.03 : 1 + hash(v) * 0.006
      radii.set(key, r)
    }
    v.normalize().multiplyScalar(r)
    position.setXYZ(i, v.x, v.y, v.z)
  }

  const landFace = new Uint8Array(position.count / 3)
  const shade = new Float32Array(position.count / 3)
  for (let f = 0; f < landFace.length; f++) {
    centre.set(0, 0, 0)
    for (let k = 0; k < 3; k++) centre.add(v.fromBufferAttribute(position, f * 3 + k))
    const { lat, lon } = vectorToLatLon(centre)
    landFace[f] = isLand(lon, lat) ? 1 : 0
    shade[f] = hash(centre)
  }

  geometry.setAttribute('color', new BufferAttribute(new Float32Array(position.count * 3), 3))
  geometry.computeVertexNormals()
  geometry.userData = { landFace, shade }
  return geometry
}

/** Writes per-face colours from the theme, with slight per-face variation. */
export function paintGlobe(geometry: IcosahedronGeometry, colors: GlobeColors) {
  const { landFace, shade } = geometry.userData as { landFace: Uint8Array, shade: Float32Array }
  const color = geometry.getAttribute('color') as BufferAttribute
  const ocean = new Color(colors.ocean)
  const ground = new Color(colors.land)
  const c = new Color()
  for (let f = 0; f < landFace.length; f++) {
    c.copy(landFace[f] ? ground : ocean).multiplyScalar(0.94 + shade[f]! * 0.06)
    for (let k = 0; k < 3; k++) color.setXYZ(f * 3 + k, c.r, c.g, c.b)
  }
  color.needsUpdate = true
}
