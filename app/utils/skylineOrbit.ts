export interface OrbitAngles {
  /** Degrees around the vertical axis; 0 looks along the weeks from the front. */
  azimuth: number
  /** Degrees above the ground; 90 is straight down. */
  elevation: number
}

/**
 * Shared, non-reactive camera goal for the skyline, set by the drag and
 * keyboard handlers and read by the scene every frame. `target: null` means
 * the default, animated view.
 */
export interface SkylineOrbit {
  target: OrbitAngles | null
}

export const SKYLINE_VIEW: OrbitAngles = { azimuth: -16, elevation: 26 }

const MIN_ELEVATION = 8
const MAX_ELEVATION = 88

export function clampElevation(elevation: number) {
  return Math.min(MAX_ELEVATION, Math.max(MIN_ELEVATION, elevation))
}

export function createSkylineOrbit(): SkylineOrbit {
  return { target: null }
}
