import { projects } from '~/data/site'
import type { Project, ProjectActivity } from '~/data/site'

export interface NumberedProject extends Project {
  /** Display position, e.g. "01". */
  num: string
}

/**
 * Projects ordered by the latest commit on each repo's default branch, newest
 * first (dates come from /projects.json at build time). Projects without a
 * repo or a date keep their order from site.ts, after the dated ones.
 */
export async function useProjects() {
  const { data } = await useFetch<ProjectActivity>('/projects.json', {
    key: 'projects',
    default: () => ({}),
  })

  return computed<NumberedProject[]>(() => {
    const activity = data.value
    const time = (p: Project) => {
      const date = p.repo ? activity[p.repo] : undefined
      return date ? Date.parse(date) : Number.NEGATIVE_INFINITY
    }
    // Array.prototype.sort is stable, so ties (including undated) keep data order.
    return [...projects]
      .sort((a, b) => time(b) - time(a))
      .map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }))
  })
}
