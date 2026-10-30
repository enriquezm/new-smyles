import { github } from '~/data/site'
import type { Github, GithubLive } from '~/data/site'

/**
 * GitHub card data: the live numbers from /github.json (fetched from the
 * GitHub API at build time), falling back to the placeholders in site.ts.
 */
export async function useGithub() {
  const { data } = await useFetch<GithubLive | null>('/github.json', {
    key: 'github',
    default: () => null,
  })
  return computed<Github>(() => ({ ...github, ...data.value }))
}
