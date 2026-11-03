import { github, githubStatLabels } from '../../app/data/site'
import type { H3Event } from 'h3'
import type { ContributionWeek, GithubLive, HeatLevel, Repo } from '../../app/data/site'

// Prerendered to /github.json by `nuxi generate` (see nitro.prerender in
// nuxt.config.ts), so the token is only used at build time and never ships.
// Returns null without a token or on any API error; the card then falls back
// to the placeholders in app/data/site.ts.

type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE'

interface ApiRepo {
  name: string
  description: string | null
  url: string
  stargazerCount: number
  primaryLanguage: { name: string } | null
}

interface ApiResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: {
            contributionDays: {
              weekday: number
              contributionCount: number
              contributionLevel: ContributionLevel
            }[]
          }[]
        }
      }
      pinnedItems: { nodes: ApiRepo[] }
      repositories: { nodes: ApiRepo[] }
    } | null
  }
  errors?: { message: string }[]
}

const REPO_FIELDS = 'name description url stargazerCount primaryLanguage { name }'

const query = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { weekday contributionCount contributionLevel } }
      }
    }
    pinnedItems(first: 3, types: REPOSITORY) { nodes { ... on Repository { ${REPO_FIELDS} } } }
    repositories(first: 3, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, orderBy: { field: STARGAZERS, direction: DESC }) {
      nodes { ${REPO_FIELDS} }
    }
  }
}`

const levels: Record<ContributionLevel, HeatLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const toRepo = (r: ApiRepo): Repo => ({
  name: r.name,
  description: r.description ?? '',
  language: r.primaryLanguage?.name ?? null,
  stars: r.stargazerCount,
  href: r.url,
})

// h3 turns a bare `null` into an empty 204, which fails prerendering, so send
// a JSON `null` body with a 200 instead. The client parses it back to null.
const noData = (event: H3Event): string => {
  setResponseHeader(event, 'Content-Type', 'application/json')
  return 'null'
}

export default defineEventHandler(async (event): Promise<GithubLive | string> => {
  const token = useRuntimeConfig(event).githubToken
  if (!token) {
    console.warn('[github.json] NUXT_GITHUB_TOKEN is not set; the GitHub card will show placeholder data.')
    return noData(event)
  }

  try {
    const res = await $fetch<ApiResponse>('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Authorization': `bearer ${token}`, 'User-Agent': github.username },
      body: { query, variables: { login: github.username } },
    })
    const user = res.data?.user
    if (!user) throw new Error(res.errors?.map(e => e.message).join('; ') ?? 'User not found')

    const calendar = user.contributionsCollection.contributionCalendar

    // GitHub's first and last weeks can be partial; pad missing days with 0.
    const weeks = calendar.weeks.slice(-52).map((week) => {
      const days: HeatLevel[] = [0, 0, 0, 0, 0, 0, 0]
      for (const day of week.contributionDays) days[day.weekday] = levels[day.contributionLevel]
      return days as ContributionWeek
    })

    // Private PR and review counts aren't broken out without the `repo` scope,
    // so the stats come from the calendar, which counts everything.
    const days = calendar.weeks.flatMap(w => w.contributionDays)
    let streak = 0
    let longest = 0
    for (const day of days) {
      streak = day.contributionCount > 0 ? streak + 1 : 0
      longest = Math.max(longest, streak)
    }
    const activeDays = days.filter(d => d.contributionCount > 0).length
    const bestDay = Math.max(0, ...days.map(d => d.contributionCount))

    const pinned = user.pinnedItems.nodes.filter(r => 'name' in r)
    const repos = (pinned.length ? pinned : user.repositories.nodes).map(toRepo)

    return {
      contributions: calendar.totalContributions,
      weeks,
      stats: [
        { label: githubStatLabels.activeDays, value: activeDays.toLocaleString('en-US') },
        { label: githubStatLabels.streak, value: `${longest} ${longest === 1 ? 'day' : 'days'}` },
        { label: githubStatLabels.bestDay, value: bestDay.toLocaleString('en-US') },
      ],
      repos,
    }
  }
  catch (error) {
    console.warn('[github.json] GitHub API request failed; using placeholder data.', error)
    return noData(event)
  }
})
