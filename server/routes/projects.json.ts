import { projects } from '../../app/data/site'
import type { H3Event } from 'h3'
import type { ProjectActivity } from '../../app/data/site'

// Prerendered to /projects.json by `nuxi generate` (see nitro.prerender in
// nuxt.config.ts). Maps each project's repo to the date of the latest commit
// on its default branch. The token is optional: the repos are public, and
// without one GitHub allows 60 unauthenticated requests an hour. A repo that
// fails to load is left out, and its project falls back to data order.

interface ApiCommit {
  commit: { committer: { date: string } | null }
}

async function latestCommit(repo: string, token: string): Promise<string | null> {
  try {
    const commits = await $fetch<ApiCommit[]>(`https://api.github.com/repos/${repo}/commits`, {
      query: { per_page: 1 },
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'new-smyles-build',
        ...(token ? { Authorization: `bearer ${token}` } : {}),
      },
    })
    return commits[0]?.commit.committer?.date ?? null
  }
  catch (error) {
    console.warn(`[projects.json] Could not load commits for ${repo}; it keeps its data order.`, error)
    return null
  }
}

export default defineEventHandler(async (event: H3Event): Promise<ProjectActivity> => {
  const token = useRuntimeConfig(event).githubToken
  const repos = projects.flatMap(p => (p.repo ? [p.repo] : []))
  const dates = await Promise.all(repos.map(repo => latestCommit(repo, token)))

  const activity: ProjectActivity = {}
  repos.forEach((repo, i) => {
    const date = dates[i]
    if (date) activity[repo] = date
  })
  return activity
})
