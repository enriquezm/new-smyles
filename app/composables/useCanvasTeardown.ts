import type { ShallowRef } from 'vue'

/**
 * TresJS forces the WebGL context lost when its canvas unmounts. If the
 * element stays on screen any longer (a leave transition, a parent animating
 * out), Chrome paints the dead canvas as a white box with a broken-image icon.
 * Hiding the wrapper before teardown means that frame is never seen.
 */
export function useCanvasTeardown(root: Readonly<ShallowRef<HTMLElement | null>>) {
  onBeforeUnmount(() => {
    if (root.value) root.value.style.visibility = 'hidden'
  })
}
