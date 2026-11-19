/**
 * The cat and the floor fish are drawn in separate canvases with the same
 * camera and the same height, so one 3D unit is the same number of pixels in
 * both and their floors line up. These numbers tie the 3D scene to the page.
 */
export const STAGE_CAMERA = {
  fov: 30,
  position: [0, 0.75, 4.2] as const,
  target: [0, 0.5, 0] as const,
}

/** Where the floor (y = 0, z = 0) lands in a stage canvas, as a fraction of its height from the top. */
export const FEET_Y = 0.72

/** Where the cat's mouth sits across its canvas, as a fraction of its width from its tail end. */
export const MOUTH_X = 0.79

/** The floor line the fish lies on and fetching cats walk along: px above the viewport bottom. */
export const FLOOR_PX = 18
