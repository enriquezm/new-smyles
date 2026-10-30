import {
  aiPrompt,
  basedIn,
  contact,
  currently,
  education,
  glance,
  hero,
  lookingFor,
  roles,
  site,
  siteStats,
  toolkit,
  workProcess,
} from '../../app/data/site'

// Prerendered to /about-myles.txt by `nuxi generate` (see nitro.prerender in
// nuxt.config.ts). Kind words and the hidden cards are left out on purpose:
// they are placeholders or not on the page.

const list = (items: string[]) => items.map(item => `- ${item}`).join('\n')

function buildPrompt(): string {
  const years = new Date().getFullYear() - glance.careerStartYear
  const email = contact.links.find(link => link.kind === 'email')?.display ?? ''
  const first = site.name.split(' ')[0] ?? site.name
  const absolute = (href: string) => (href.startsWith('/') ? `${site.url}${href}` : href)

  const sections = [
    `# About ${site.name}: a prompt for AI assistants`,

    `How to use this: copy everything in this file into ChatGPT, Claude or another AI assistant, then ask your questions. Source: ${site.url}`,

    '---',

    `You are answering questions about ${site.name} for someone who is considering working with or hiring ${first}. Use only the facts in this document; lines written in the first person are ${first}'s own words. If something is not covered here, say that you don't know and suggest contacting ${first} directly${email ? ` at ${email}` : ''}. Keep answers short and specific, and quote titles, dates and numbers exactly as written.`,

    `## Summary\n${hero.headline} ${hero.headlineMuted}\n${hero.intro}\nStatus: ${hero.status}. Based in ${basedIn.city}, ${basedIn.region} (${basedIn.timeZoneAbbr}).`,

    `## At a glance\n${list([
      `${years}+ ${glance.yearsLabel}`,
      ...glance.stats.map(s => `${s.value} ${s.label}`),
    ])}`,

    `## Strengths\n${list(glance.strengths.map(s => `${s.title}: ${s.text}`))}`,

    `## Experience\n${list(roles.map(r => `${r.title}, ${r.org} (${r.years}). ${r.impact}`))}`,

    `## Education\n${list([`${education.degree}, ${education.school}, ${education.year}`, education.note])}`,

    `## Skills and tools\n${list(toolkit.groups.map(g => `${g.name}: ${g.items.join(', ')}`))}`,

    `## How ${first} works\n${workProcess.steps.map(s => `${s.num}. ${s.title}: ${s.description}`).join('\n')}`,

    `## What ${first} is looking for\n${list([...lookingFor.facts, ...lookingFor.details].map(f => `${f.label}: ${f.value}`))}`,

    `## Currently\n${list(currently.items.map(i => `${i.label}: ${i.title}. ${i.note}`))}`,

    `## This website\n${list(siteStats.stats.map(s => `${s.value} ${s.label}`))}\n${siteStats.method}`,

    `## Contact\n${list(contact.links.map(l => `${l.kind === 'email' ? 'Email' : l.label}: ${l.display || absolute(l.href)}`))}`,

    `## Questions you could ask\n${list(aiPrompt.questions)}`,
  ]

  // The leading byte-order mark makes browsers read the file as UTF-8 even when
  // a static host serves it without a charset (é, ʻ and dashes stay intact).
  return `\uFEFF${sections.join('\n\n')}\n`
}

export default defineEventHandler((event) => {
  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return buildPrompt()
})
