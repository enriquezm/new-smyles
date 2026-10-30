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
    | 'process'
    | 'projects'
    | 'contact'

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
}

export interface Hero {
  headline: string
  headlineMuted: string
  intro: string
  avatarAlt: string
  avatarMonogram: string
  avatarSrc: string | null
  status: string
}

export interface IntroAudio {
  src: string | null
  durationSeconds: number
  playLabel: string
  pauseLabel: string
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
  note: string
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

export type Language = 'Vue' | 'TypeScript'

export interface Repo {
  name: string
  description: string
  language: Language
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
  contributions: number
  contributionsCaption: string
  weeks: ContributionWeek[]
  stats: GithubStat[]
  repos: Repo[]
  profile: Link
}

export interface Step {
  num: string
  title: string
  description: string
}

export interface Process {
  headline: string
  steps: Step[]
}

export type ProjectStatusTone = 'accent' | 'info' | 'neutral'

export interface Project {
  num: string
  name: string
  status: string
  statusTone: ProjectStatusTone
  description: string
  tags: string[]
  href: string
}

export interface ContactLink extends Link {
  kind: 'email' | 'linkedin' | 'github' | 'resume'
  /** Shown in the expanded card's "Reach me" tile; omitted when empty. */
  display: string
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
    'Design engineer at Slickdeals working between Figma and production: React, Vue and TypeScript interfaces, design systems and the tooling that keeps design and code in sync.',
  url: 'https://mylesenriquez.dev', // PLACEHOLDER
  locale: 'en_US',
}

export const resumeHref = '/resume.pdf' // PLACEHOLDER

export const nav: Link[] = [
  { label: 'Work', href: '#work' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'Résumé', href: resumeHref },
]

export const navCta: Link = { label: 'Get in touch', href: '#contact' }

export const hero: Hero = {
  headline: 'Hi, I\'m Myles Enriquez — a design engineer building at Slickdeals.',
  headlineMuted: 'Previously at UNLV.',
  intro:
    'I work in the space between Figma and production — crafting React, Vue and TypeScript interfaces, design systems, and the tooling that keeps design and code in sync.',
  avatarAlt: 'Photo of Myles Enriquez',
  avatarMonogram: 'ME',
  avatarSrc: null, // PLACEHOLDER
  status: 'Available for work',
}

export const introAudio: IntroAudio = {
  src: null, // PLACEHOLDER
  durationSeconds: 32, // PLACEHOLDER
  playLabel: 'Play my 30-second intro',
  pauseLabel: 'Pause intro',
}

export const cards: Record<CardId, CardMeta> = {
  experience: { label: 'Experience', title: 'Experience' },
  featured: { label: 'Featured work', title: 'Featured work' },
  toolkit: { label: 'Toolkit', title: 'Toolkit' },
  location: { label: 'Based in', title: 'Location' },
  github: { label: 'GitHub', title: 'GitHub activity' },
  process: { label: 'How I work', title: 'How I work' },
  projects: { label: 'Now building', title: 'Now building' },
  contact: { label: 'Say hello', title: 'Say hello' },
}

export const experienceHeadline
  = 'Seven years shipping interfaces at Slickdeals, from frontend engineer to senior full stack.'

export const roles: Role[] = [
  {
    title: 'Senior Full Stack Engineer',
    org: 'Slickdeals',
    years: '2024 — now',
    current: true,
    impact: 'Lead the deal page component system across Vue and Node services; cut LCP 32% and mentor three engineers.', // PLACEHOLDER
  },
  {
    title: 'Frontend Engineer',
    org: 'Slickdeals',
    years: '2019 — 2024',
    current: false,
    impact: 'Built 40+ reusable UI components, shipped the redesigned deal feed and moved key pages to TypeScript.', // PLACEHOLDER
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
  note: 'freeCodeCamp Full Stack certification',
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
  highlights: ['React', 'Vue', 'TypeScript', 'Node.js', 'Figma', 'Storybook'],
  // PLACEHOLDER: items beyond React / Vue / TypeScript.
  groups: [
    { name: 'Design', items: ['Figma', 'Design tokens', 'Storybook', 'Prototyping'] },
    { name: 'Frontend', items: ['React', 'Vue', 'TypeScript', 'Next.js', 'Nuxt', 'Tailwind'] },
    { name: 'Backend & data', items: ['Node.js', 'GraphQL', 'PostgreSQL', 'Redis'] },
    { name: 'Tooling', items: ['Vite', 'Playwright', 'GitHub Actions', 'MCP servers'] },
  ],
}

export const basedIn: Location = {
  city: 'Las Vegas',
  region: 'NV',
  timeZone: 'America/Los_Angeles',
  timeZoneAbbr: 'PT',
  availability:
    'Nevada, on Pacific Time. Open to remote roles and comfortable overlapping with teams across US time zones.', // PLACEHOLDER
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

export const github: Github = {
  contributions: 1284, // PLACEHOLDER
  contributionsCaption: 'contributions in the last year',
  weeks: sampleWeeks(52), // PLACEHOLDER
  // PLACEHOLDER
  stats: [
    { label: 'Pull requests merged', value: '312' },
    { label: 'Code reviews', value: '540' },
    { label: 'Longest streak', value: '41 days' },
  ],
  // PLACEHOLDER
  repos: [
    {
      name: 'deal-card-kit',
      description: 'Typed Vue component kit with tokens and Storybook docs',
      language: 'Vue',
      stars: 128,
      href: '#',
    },
    {
      name: 'figma-tokens-sync',
      description: 'Syncs Figma variables to CSS and TypeScript tokens',
      language: 'TypeScript',
      stars: 86,
      href: '#',
    },
    {
      name: 'job-cli',
      description: 'Find roles and tailor resumes from the terminal',
      language: 'TypeScript',
      stars: 23,
      href: '#',
    },
  ],
  profile: { label: 'GitHub', href: '#' }, // PLACEHOLDER
}

export const workProcess: Process = {
  headline: 'Four steps, one person holding both the design and the code.',
  steps: [
    {
      num: '01',
      title: 'Discovery',
      description: 'A 30-minute call to understand the problem, the people using it and what "done" looks like.',
    },
    {
      num: '02',
      title: 'Design in Figma',
      description: 'Explore flows and components in Figma, pressure-tested against real constraints from day one.',
    },
    {
      num: '03',
      title: 'Prototype in code',
      description: 'Interactive React or Vue prototypes so we can feel the details, not just look at them.',
    },
    {
      num: '04',
      title: 'Ship & systematize',
      description: 'Harden it into production code, plus the components and tokens the team keeps building on.',
    },
  ],
}

export const projects: Project[] = [
  {
    num: '01',
    name: 'Job Search CLI',
    status: 'In progress',
    statusTone: 'accent',
    description: 'A terminal tool that finds roles, tailors a resume from a YAML experience file plus the posting, and helps apply.',
    tags: ['TypeScript', 'Zod', 'Node.js'],
    href: '#', // PLACEHOLDER
  },
  {
    num: '02',
    name: 'Figma → code MCP server',
    status: 'Exploring',
    statusTone: 'info',
    description: 'An MCP server that reads Figma components and variables and generates typed, token-aware React and Vue components.', // PLACEHOLDER
    tags: ['TypeScript', 'Figma API', 'MCP'], // PLACEHOLDER
    href: '#', // PLACEHOLDER
  },
  {
    num: '03',
    name: 'Dream Collector',
    status: 'Concept',
    statusTone: 'neutral',
    description: 'A Roblox game about stepping into dreams and collecting what you find there.',
    tags: ['Luau', 'Roblox Studio'],
    href: '#', // PLACEHOLDER
  },
]

export const contact: Contact = {
  headline: 'Need design and code in the same head? Let\'s talk.',
  links: [
    { kind: 'email', label: 'Email me', href: 'mailto:hello@mylesenriquez.dev', display: 'hello@mylesenriquez.dev' }, // PLACEHOLDER
    { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/mylesenriquez', display: 'linkedin.com/in/mylesenriquez' }, // PLACEHOLDER
    { kind: 'github', label: 'GitHub', href: 'https://github.com/mylesenriquez', display: 'github.com/mylesenriquez' }, // PLACEHOLDER
    { kind: 'resume', label: 'Résumé', href: resumeHref, display: '' },
  ],
  openTo: ['Design engineering', 'Design systems', 'Frontend platform', 'Prototyping & tooling'],
}

export const footer: Footer = {
  name: 'Myles Enriquez',
  place: 'Las Vegas, NV',
}
