// All site content lives here. Fields marked `// PLACEHOLDER` are sample
// content from the design mock and must be replaced before launch.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CardId
  = | 'experience'
    | 'featured'
    | 'toolkit'
    | 'location'
    | 'github'
    | 'projects'
    | 'contact'
    | 'glance'
    | 'guestbook'
    | 'lookingFor'
    | 'kindWords'
    | 'siteStats'

export interface Link {
  label: string
  href: string
}

export interface SiteMeta {
  name: string
  title: string
  description: string
  url: string
  locale: string
  /** Absolute URL of a 1200×630 social preview image; omitted from meta while null. */
  ogImage: string | null
  ogImageAlt: string
  themeColor: string
}

export type ThemeId = 'light' | 'dark' | 'retro'

export interface Theme {
  id: ThemeId
  label: string
}

export interface Hero {
  headline: string
  /** Word in `headline` rendered as a link; must appear in it verbatim. */
  headlineLink: Link
  intro: string
  avatarAlt: string
  avatarMonogram: string
  avatarSrc: string | null
  status: string
}

export interface CardMeta {
  /** Visible label in the card's pill. */
  label: string
  /** Used for the "Expand …" / "Collapse …" accessible names. */
  title: string
}

export interface Role {
  title: string
  org: string
  years: string
  current: boolean
  impact: string
}

export interface Education {
  degree: string
  school: string
  year: string
}

export interface Metric {
  value: string
  label: string
}

export interface CaseStudySection {
  label: 'Problem' | 'Approach' | 'Outcome'
  text: string
}

export interface CodePreviewProp {
  name: string
  value: string
}

export interface FeaturedProject {
  title: string
  meta: string
  metrics: Metric[]
  caseStudy: CaseStudySection[]
  tags: string[]
  codePreview: { component: string, props: CodePreviewProp[] }
  caseStudyLink: Link
  docsLink: Link
}

export interface ToolkitGroup {
  name: string
  items: string[]
}

export interface Toolkit {
  tagline: string
  headline: string
  note: string
  highlights: string[]
  groups: ToolkitGroup[]
}

export interface Location {
  city: string
  region: string
  timeZone: string
  timeZoneAbbr: string
  availability: string
}

export interface Repo {
  name: string
  /** GitHub's primary language for the repo; null when it has none. */
  language: string | null
  stars: number
  href: string
}

export interface GithubStat {
  label: string
  value: string
}

/** 0 = no contributions … 4 = most. */
export type HeatLevel = 0 | 1 | 2 | 3 | 4

/** One column of the heatmap: seven days, Sunday first. */
export type ContributionWeek = [HeatLevel, HeatLevel, HeatLevel, HeatLevel, HeatLevel, HeatLevel, HeatLevel]

export interface Github {
  username: string
  contributions: number
  contributionsCaption: string
  /** Shown in the open card: why the public repos are only part of the story. */
  privateNote: string
  weeks: ContributionWeek[]
  stats: GithubStat[]
  repos: Repo[]
  /**
   * Repo names always listed first in the card, before pinned or top-starred
   * repos.
   */
  featuredRepos: string[]
  profile: Link
}

/** The parts of the GitHub card that /github.json fills in from the API. */
export type GithubLive = Pick<Github, 'contributions' | 'weeks' | 'stats' | 'repos'>

export type ProjectStatusTone = 'accent' | 'idea' | 'info' | 'neutral' | 'success'

export interface Project {
  name: string
  /**
   * GitHub `owner/name`. Projects with a repo are listed by their latest commit
   * on the default branch (newest first, fetched at build time); the rest
   * follow in the order written here.
   */
  repo?: string
  status: string
  statusTone: ProjectStatusTone
  /** One short line, shown under the name in the collapsed card. */
  summary: string
  /** Longer text for the open card. */
  description: string
  tags: string[]
  href: string
}

/** /projects.json: repo (`owner/name`) → ISO date of its latest default-branch commit. */
export type ProjectActivity = Record<string, string>

/**
 * Kinds of markdown post in content/posts/. Every post shares PostLayout; the
 * type sets its badge, its status chip in the "Currently working on" card and
 * the note shown above the body. Add a key here to add a type.
 */
export type PostType = 'concept'

export interface PostTypeMeta {
  /** Badge above the post title, e.g. "Concept". */
  label: string
  status: string
  statusTone: ProjectStatusTone
  /** Link text in the open "Currently working on" card. */
  linkLabel: string
  /** Short note shown above the post body. */
  note: string
}

export interface PostPage {
  backLabel: string
  publishedLabel: string
  updatedLabel: string
}

export interface ContactLink extends Link {
  kind: 'email' | 'linkedin' | 'github' | 'resume'
  /** Shown in the expanded card's "Reach me" tile; omitted when empty. */
  display: string
}

export interface Strength {
  title: string
  text: string
}

export interface Glance {
  /** First year of web work; the card shows the years since as a live stat. */
  careerStartYear: number
  yearsLabel: string
  stats: Metric[]
  headline: string
  strengths: Strength[]
}

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface Guestbook {
  headline: string
  intro: string
  /**
   * Guestbook API base URL. While null the list shows `seed` and the form is
   * disabled. The API must answer:
   *   GET  <endpoint>  → GuestbookEntry[]
   *   POST <endpoint>  { name, message } → GuestbookEntry
   */
  endpoint: string | null
  closedNote: string
  maxNameLength: number
  maxMessageLength: number
  seed: GuestbookEntry[]
}

export interface Fact {
  label: string
  value: string
}

export interface LookingFor {
  headline: string
  /** Shown on the collapsed card. */
  facts: Fact[]
  /** Added when the card is open. */
  details: Fact[]
}

export interface Recommendation {
  quote: string
  name: string
  role: string
  /** The recommender's LinkedIn profile. */
  href: string
}

export interface KindWords {
  headline: string
  items: Recommendation[]
  source: Link
}

export interface SiteStats {
  /** ISO date (YYYY-MM-DD) the numbers were measured. */
  measuredOn: string
  method: string
  stats: Metric[]
  headline: string
  builtWith: Strength[]
  source: Link
}

export interface Footer {
  name: string
  place: string
}

export interface Contact {
  headline: string
  links: ContactLink[]
  openTo: string[]
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export const site: SiteMeta = {
  name: 'Myles Enriquez',
  title: 'Myles Enriquez — Design Engineer',
  description:
    'Design engineer at Slickdeals working between Figma and production: Vue and Nuxt interfaces, design systems and the tooling that keeps design and code in sync.',
  url: 'https://mylesenriquez.dev', // PLACEHOLDER
  locale: 'en_US',
  ogImage: null, // PLACEHOLDER
  ogImageAlt: 'Myles Enriquez — Design Engineer',
  // Matches --color-bg; browser chrome can't read CSS variables.
  themeColor: '#EDEDEA',
}

export const resumeHref = '/resume.pdf'

export const navCta: Link = { label: 'Get in touch', href: 'mailto:enri.myles@gmail.com' }

/**
 * A plain-text prompt visitors can paste into an AI assistant to ask about
 * Myles. Built from the content in this file at build time
 * (server/routes/about-myles.txt.ts), so it never drifts from the site.
 */
export const aiPrompt = {
  link: { label: 'Ask an AI about me', href: '/about-myles.txt' } satisfies Link,
  questions: [
    'What has Myles built at Slickdeals, and what was the impact?',
    'Would Myles be a good fit for a Design Engineer or Software Engineer role on our team?',
    'How much experience does Myles have with Vue, Nuxt and TypeScript?',
    'How does Myles work with designers?',
    'Is Myles open to remote work, and when could Myles start?',
  ],
}

export const themes: Theme[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'retro', label: 'Retro' },
]

export const hero: Hero = {
  headline: 'Hi, I\'m Myles Enriquez — a design engineer building at Slickdeals.',
  headlineLink: { label: 'Slickdeals', href: 'https://slickdeals.net' },
  intro:
    'I work in the space between Figma and production — crafting TypeScript interfaces, design systems, and the tooling that keeps design and code in sync. AI agents and workflows are part of how I build every day, from first prototype to shipped code. Vue and Nuxt are my primary stack, and I\'m comfortable in any component-based framework.',
  avatarAlt: 'Portrait of Myles Enriquez in glitchy, thermal-camera colors',
  avatarMonogram: 'ME',
  avatarSrc: '/avatar.jpg',
  status: 'Available for work',
}

export const cards: Record<CardId, CardMeta> = {
  experience: { label: 'Experience', title: 'Experience' },
  featured: { label: 'Featured work', title: 'Featured work' },
  toolkit: { label: 'Toolkit', title: 'Toolkit' },
  location: { label: 'Based in', title: 'Location' },
  github: { label: 'GitHub', title: 'GitHub activity' },
  projects: { label: 'Currently working on', title: 'Currently working on' },
  contact: { label: 'Say hello', title: 'Say hello' },
  glance: { label: 'At a glance', title: 'At a glance' },
  guestbook: { label: 'Guestbook', title: 'Guestbook' },
  lookingFor: { label: 'What I\'m looking for', title: 'What I\'m looking for' },
  kindWords: { label: 'Kind words', title: 'Kind words' },
  siteStats: { label: 'This site', title: 'This site, by the numbers' },
}

export const experienceHeadline
  = 'Seven years shipping interfaces at Slickdeals, from frontend engineer to senior full stack.'

export const roles: Role[] = [
  {
    title: 'Senior Full Stack Engineer',
    org: 'Slickdeals',
    years: '2024 — now',
    current: true,
    impact: 'Added a semantic color layer to our design tokens and built new Vue and Nuxt UI for search, the homefeed and CMS modular pages. Ran the A/B tests behind the standardized deal card.',
  },
  {
    title: 'Frontend Engineer',
    org: 'Slickdeals',
    years: '2019 — 2024',
    current: false,
    impact: 'Core contributor to Blueprint, the Slickdeals design system: built its pattern library, from deal cards to page headers, then Vue components with Storybook stories for vuerango.',
  },
  {
    title: 'Web Specialist',
    org: 'UNLV',
    years: '2017 — 2019',
    current: false,
    impact: 'Rebuilt department sites on an accessible, WCAG-compliant template used by 20+ colleges and offices.', // PLACEHOLDER
  },
]

export const education: Education = {
  degree: 'B.A. Computer & Information Sciences',
  school: 'University of Hawaiʻi at Mānoa',
  year: '2015',
}

// PLACEHOLDER: the whole featured case study, its metrics and links.
export const featured: FeaturedProject = {
  title: 'Deal page component system',
  meta: 'Slickdeals · 2025 · Lead engineer',
  metrics: [
    { value: '−32%', label: 'LCP on deal pages' },
    { value: '48', label: 'shared components' },
    { value: '6', label: 'teams adopting' },
  ],
  caseStudy: [
    {
      label: 'Problem',
      text: 'Deal pages had drifted into a dozen one-off card variants. Every design tweak meant touching several codebases, and page speed was suffering.',
    },
    {
      label: 'Approach',
      text: 'Audited every variant in Figma, defined tokens and a single typed DealCard API, then shipped it in Vue with Storybook docs and visual regression tests.',
    },
    {
      label: 'Outcome',
      text: 'One source of truth for design and code. Faster pages, quicker design iterations, and new card layouts shipped in days instead of sprints.',
    },
  ],
  tags: ['Vue 3', 'TypeScript', 'Design tokens', 'Storybook', 'Playwright'],
  codePreview: {
    component: 'DealCard',
    props: [
      { name: ':deal', value: 'deal' },
      { name: 'variant', value: 'compact' },
      { name: '@save', value: 'track' },
    ],
  },
  caseStudyLink: { label: 'Read the case study', href: '#' }, // PLACEHOLDER
  docsLink: { label: 'Component docs', href: '#' }, // PLACEHOLDER
}

export const toolkit: Toolkit = {
  tagline: 'From Figma file to production code.',
  headline: 'The tools I reach for, from first sketch to shipped component.',
  note: 'Vue and Nuxt are my primary stack, and I\'m comfortable working in any component-based framework.',
  highlights: ['Vue', 'Nuxt', 'TypeScript', 'Node.js', 'Figma', 'Storybook'],
  // PLACEHOLDER: items beyond Vue / TypeScript.
  groups: [
    { name: 'Design', items: ['Figma', 'Design tokens', 'Storybook', 'Prototyping'] },
    { name: 'Frontend', items: ['Vue', 'TypeScript', 'Nuxt', 'Tailwind'] },
    { name: 'Backend & data', items: ['Node.js', 'PHP', 'GraphQL', 'PostgreSQL', 'Redis', 'AWS'] },
    { name: 'Tooling', items: ['Vite', 'Playwright', 'GitHub Actions', 'MCP servers'] },
  ],
}

export const basedIn: Location = {
  city: 'Las Vegas',
  region: 'NV',
  timeZone: 'America/Los_Angeles',
  timeZoneAbbr: 'PT',
  availability:
    'Nevada, on Pacific Time. Looking for remote roles and comfortable overlapping with teams across US time zones.', // PLACEHOLDER
}

/**
 * Deterministic sample heatmap, ported from the mock so server and client
 * render the same thing. Weekends are damped.
 */
function sampleWeeks(count: number): ContributionWeek[] {
  const weeks: ContributionWeek[] = []
  for (let w = 0; w < count; w++) {
    const days: HeatLevel[] = []
    for (let d = 0; d < 7; d++) {
      const v = Math.abs(Math.sin(w * 12.9898 + d * 78.233) * 43758.5453) % 1
      let level = v < 0.18 ? 0 : v < 0.45 ? 1 : v < 0.7 ? 2 : v < 0.9 ? 3 : 4
      if ((d === 0 || d === 6) && level > 1) level -= 2
      days.push(level as HeatLevel)
    }
    weeks.push(days as ContributionWeek)
  }
  return weeks
}

export const githubStatLabels = {
  activeDays: 'Active days',
  streak: 'Longest streak',
  bestDay: 'Most in one day',
}

/**
 * Real numbers come from server/routes/github.json.ts at build time (needs
 * NUXT_GITHUB_TOKEN). The placeholder values below only show if that fails.
 */
export const github: Github = {
  username: 'enriquezm',
  contributions: 1284, // PLACEHOLDER (fallback)
  contributionsCaption: 'contributions in the last year',
  privateNote: 'Most of my work happens in private repos at Slickdeals, so it counts toward the activity above but the code isn\'t public. The repos below are side projects.',
  weeks: sampleWeeks(52), // PLACEHOLDER (fallback)
  // PLACEHOLDER (fallback)
  stats: [
    { label: githubStatLabels.activeDays, value: '190' },
    { label: githubStatLabels.streak, value: '11 days' },
    { label: githubStatLabels.bestDay, value: '42' },
  ],
  featuredRepos: ['site-text-bot'],
  // Fallback when the API is unavailable. Live data replaces language and stars.
  repos: [
    {
      name: 'site-text-bot',
      language: 'TypeScript',
      stars: 0,
      href: 'https://github.com/enriquezm/site-text-bot',
    },
  ],
  profile: { label: 'GitHub', href: 'https://github.com/enriquezm' },
}

export const projects: Project[] = [
  {
    name: 'Site Text Bot',
    repo: 'enriquezm/site-text-bot',
    status: 'In progress',
    statusTone: 'accent',
    summary: 'Edit and deploy this site by text message.',
    description: 'Text a change to a phone number and Claude Code edits this site, texts back a preview link, and deploys when you reply "ship it".',
    tags: ['TypeScript', 'Claude Agent SDK', 'Twilio'],
    href: 'https://github.com/enriquezm/site-text-bot',
  },
  {
    name: 'Dungeon Map Builder',
    repo: 'enriquezm/dungeon-map-builder',
    status: 'Finished',
    statusTone: 'success',
    summary: 'Grid-based floor plans for Roblox dungeons.',
    description: 'A browser tool for laying out rooms and hallways on a grid, used to plan Roblox dungeon levels before building them in 3D.',
    tags: ['TypeScript', 'HTML Canvas', 'Vite'],
    href: 'https://github.com/enriquezm/dungeon-map-builder',
  },
]

/** Link text for projects in the open "Currently working on" card. */
export const projectLinkLabel = 'View on GitHub'

/** Rows shown in the collapsed "Currently working on" card. */
export const projectsCollapsedLimit = 3

/** Note under the collapsed card's rows when some items are hidden. */
export const projectsMoreNote = (count: number) =>
  `+${count} more. Open the card to see ${count === 1 ? 'it' : 'them all'}.`

export const postTypes: Record<PostType, PostTypeMeta> = {
  concept: {
    label: 'Concept',
    status: 'Concept',
    statusTone: 'idea',
    linkLabel: 'Read the concept',
    note: 'This is a concept: an idea I\'m still playing with. Nothing is built yet, so all of it may change.',
  },
}

export const postPage: PostPage = {
  backLabel: 'Back to home',
  publishedLabel: 'Posted',
  updatedLabel: 'Updated',
}

export const contact: Contact = {
  headline: 'Need design and code in the same head? Let\'s talk.',
  links: [
    { kind: 'email', label: 'Email me', href: 'mailto:enri.myles@gmail.com', display: 'enri.myles@gmail.com' },
    { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/mylesenriquez', display: 'linkedin.com/in/mylesenriquez' }, // PLACEHOLDER
    { kind: 'github', label: 'GitHub', href: 'https://github.com/enriquezm', display: 'github.com/enriquezm' },
    { kind: 'resume', label: 'Resume', href: resumeHref, display: '' },
  ],
  openTo: ['Design engineering', 'Design systems', 'Frontend platform', 'Prototyping & tooling'],
}

export const glance: Glance = {
  careerStartYear: 2019, // Slickdeals start; shows 7+ in 2026 and counts up each year
  yearsLabel: 'years building for the web',
  stats: [
    { value: 'Millions', label: 'of shoppers use what I ship at Slickdeals' },
    { value: 'Vue + TypeScript', label: 'shipped to production every day' }, // PLACEHOLDER
  ],
  headline: 'What you get when you hire me.',
  // PLACEHOLDER: reword in your own voice.
  strengths: [
    {
      title: 'Design and code in one head',
      text: 'I move between Figma and the codebase, so designs ship the way they were meant to without a long handoff.',
    },
    {
      title: 'Performance at scale',
      text: 'Pages I build serve millions of Slickdeals shoppers, so speed and resilience are part of the job, not an afterthought.',
    },
    {
      title: 'Accessible by default',
      text: 'Accessibility is part of my definition of done, from semantic markup and keyboard support to color contrast.',
    },
  ],
}

export const guestbook: Guestbook = {
  headline: 'Sign the guestbook.',
  intro: 'Say hi, leave a tip, or tell me what brought you here. Every message shows up for everyone who visits.',
  endpoint: null, // PLACEHOLDER: set once the guestbook API exists.
  closedNote: 'Signing opens soon. Check back to leave a note.',
  maxNameLength: 40,
  maxMessageLength: 280,
  seed: [
    {
      id: 'welcome',
      name: 'Myles',
      message: 'Welcome! Thanks for stopping by. Leave a hello, a tip, or your favorite spot in Vegas.', // PLACEHOLDER
      createdAt: '2026-10-30T12:00:00-07:00',
    },
  ],
}

// PLACEHOLDER: confirm every value; these are starting points.
export const lookingFor: LookingFor = {
  headline: 'The role I\'m after.',
  facts: [
    { label: 'Role', value: 'Design Engineer or Software Engineer' },
    { label: 'Setup', value: 'Remote' },
    { label: 'Start', value: 'Available now' },
  ],
  details: [
    { label: 'Team', value: 'Product teams where designers and engineers work side by side' },
    { label: 'Work', value: 'Consumer web apps, design systems and frontend platform' },
    { label: 'Time zone', value: 'Pacific Time; happy to overlap with any US time zone' },
  ],
}

// PLACEHOLDER: replace with real recommendations (with permission), e.g.
// from LinkedIn. Never ship invented quotes.
export const kindWords: KindWords = {
  headline: 'What people I\'ve worked with say.',
  items: [
    {
      quote: 'Placeholder: paste a recommendation from a manager here. Two or three sentences about the impact Myles had read best.',
      name: 'Manager name',
      role: 'Engineering Manager, Slickdeals',
      href: '#',
    },
    {
      quote: 'Placeholder: paste a recommendation from a designer here, ideally about turning designs into polished, working UI.',
      name: 'Designer name',
      role: 'Product Designer, Slickdeals',
      href: '#',
    },
    {
      quote: 'Placeholder: paste a recommendation from a fellow engineer here, about code quality, reviews or mentoring.',
      name: 'Engineer name',
      role: 'Senior Engineer, Slickdeals',
      href: '#',
    },
  ],
  source: { label: 'More on LinkedIn', href: 'https://linkedin.com/in/mylesenriquez' }, // PLACEHOLDER
}

// Re-measure after big changes and once deployed (numbers here are from a
// local production build: median of 5 runs, Lighthouse-like mobile throttling).
export const siteStats: SiteStats = {
  measuredOn: '2026-10-30',
  method: 'Measured on the production build in Chrome at phone size, with network and CPU throttled to a slow 4G phone.',
  stats: [
    { value: '1.2 s', label: 'largest paint on slow 4G' },
    { value: '0', label: 'layout shift (CLS)' },
    { value: '203 KB', label: 'page weight, gzipped' },
    { value: 'AA', label: 'contrast in all 3 themes' },
  ],
  headline: 'Built with the same care I bring to work.',
  builtWith: [
    {
      title: 'Static and fast',
      text: 'Nuxt 4 pre-renders every page, and the Geist fonts are self-hosted so nothing shifts as they load.',
    },
    {
      title: 'One set of tokens',
      text: 'Every color, radius and shadow is a Tailwind v4 token. Light, dark and retro just swap the values.',
    },
    {
      title: 'Motion with restraint',
      text: 'Cards open with a FLIP layout animation that switches off when you ask your device for reduced motion.',
    },
    {
      title: 'Accessible by default',
      text: 'Real buttons and links, 44px targets, full keyboard support and AA contrast in every theme.',
    },
  ],
  source: { label: 'View the source', href: 'https://github.com/enriquezm/new-smyles' },
}

export const footer: Footer = {
  name: 'Myles Enriquez',
  place: 'Las Vegas, NV',
}
