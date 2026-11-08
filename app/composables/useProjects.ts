import { postTypes, projectLinkLabel, projects } from '~/data/site'
import type { Project, ProjectActivity, ProjectStatusTone } from '~/data/site'

/** One row in the "Currently working on" card: a GitHub project or a post. */
export interface WorkItem {
  name: string
  status: string
  statusTone: ProjectStatusTone
  summary: string
  description: string
  tags: string[]
  /** External URL for projects, site path for posts. */
  href: string
  linkLabel: string
  /** Display position, e.g. "01". */
  num: string
}

type Dated = Omit<WorkItem, 'num'> & { time: number }

const UNDATED = Number.NEGATIVE_INFINITY

/**
 * GitHub projects and markdown posts, newest first. Projects are dated by the
 * latest commit on their default branch (from /projects.json at build time),
 * posts by their `updated` or `date` frontmatter. Undated items keep their
 * order from site.ts, after the dated ones.
 */
export async function useProjects() {
  const [{ data: activity }, { data: posts }] = await Promise.all([
    useFetch<ProjectActivity>('/projects.json', { key: 'projects', default: () => ({}) }),
    useAsyncData('work-posts', () => queryCollection('posts').all(), { default: () => [] }),
  ])

  return computed<WorkItem[]>(() => {
    const fromProjects = projects.map((p: Project): Dated => {
      const date = p.repo ? activity.value[p.repo] : undefined
      return {
        name: p.name,
        status: p.status,
        statusTone: p.statusTone,
        summary: p.summary,
        description: p.description,
        tags: p.tags,
        href: p.href,
        linkLabel: projectLinkLabel,
        time: date ? Date.parse(date) : UNDATED,
      }
    })

    const fromPosts = posts.value.map((post): Dated => {
      const type = postTypes[post.type]
      return {
        name: post.title,
        status: type.status,
        statusTone: type.statusTone,
        summary: post.description,
        description: post.description,
        tags: post.tags ?? [],
        href: post.path,
        linkLabel: type.linkLabel,
        time: Date.parse(post.updated ?? post.date),
      }
    })

    // Array.prototype.sort is stable, so ties (including undated) keep data order.
    return [...fromProjects, ...fromPosts]
      .sort((a, b) => b.time - a.time)
      .map(({ time: _time, ...item }, i) => ({ ...item, num: String(i + 1).padStart(2, '0') }))
  })
}
