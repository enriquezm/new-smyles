import { tryOnScopeDispose, useIntervalFn } from '@vueuse/core'
import type { IntroAudio } from '~/data/site'

const TICK_MS = 250

function formatSeconds(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

/**
 * Play/pause state for the hero intro. Plays `config.src` when set; until then
 * it runs a silent timer for `config.durationSeconds` so the UI still works.
 */
export function useIntroPlayer(config: IntroAudio) {
  const playing = ref(false)
  const progress = ref(0)
  let audio: HTMLAudioElement | null = null

  const timer = useIntervalFn(() => {
    progress.value += TICK_MS / 1000 / config.durationSeconds
    if (progress.value >= 1) reset()
  }, TICK_MS, { immediate: false })

  function reset() {
    playing.value = false
    progress.value = 0
    timer.pause()
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  function getAudio(): HTMLAudioElement | null {
    if (!config.src) return null
    if (!audio) {
      const el = new Audio(config.src)
      el.addEventListener('timeupdate', () => {
        if (el.duration) progress.value = el.currentTime / el.duration
      })
      el.addEventListener('ended', reset)
      audio = el
    }
    return audio
  }

  function toggle() {
    const el = getAudio()
    if (playing.value) {
      playing.value = false
      if (el) el.pause()
      else timer.pause()
      return
    }
    playing.value = true
    if (el) {
      el.play().catch(() => {
        playing.value = false
      })
    }
    else {
      timer.resume()
    }
  }

  const remaining = computed(() =>
    formatSeconds(config.durationSeconds * (1 - progress.value)),
  )

  tryOnScopeDispose(() => {
    audio?.pause()
    audio = null
  })

  return { playing: readonly(playing), progress: readonly(progress), remaining, toggle }
}
