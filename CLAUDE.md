# Build: Myles Enriquez personal site

You are building my personal website from a finished design. Read `DESIGN_SPEC.md` first, then `design/Main.dc.html`, which holds the exact markup, inline styles and content. Match the design closely. Don't redesign it.

## Stack
- **Nuxt 4** (the `app/` directory structure) + **Vue 3** with `<script setup lang="ts">` single-file components
- **TypeScript** in strict mode. Run `nuxi typecheck` (vue-tsc) and keep it passing.
- **Tailwind CSS v4** via `@tailwindcss/vite`. Design tokens and custom breakpoints go in an `@theme` block in `app/assets/css/main.css`.
- **`@nuxt/fonts`** for Geist and Geist Mono (self-hosted, no layout shift)
- **`motion-v`** (Motion for Vue) for the card expand/collapse layout animation
- **`@vueuse/core`** for breakpoints, Escape key handling and reduced-motion detection
- **`@nuxt/eslint`** for linting
- Output: a static site via `nuxi generate`, deployable to Vercel or Netlify

## How to work
1. **Plan first.** Before writing code, propose the component tree, file layout and how the tokens map to `@theme`. Wait for my OK.
2. **Scaffold.** Create the Nuxt 4 app with the modules above, `nuxt.config.ts`, strict TS, ESLint and Tailwind. Confirm `npm run dev` starts cleanly.
3. **Tokens.** Put every color, radius, shadow and font from the spec's token tables into `@theme` (e.g. `--color-surface`, `--radius-card`, `--shadow-card-hover`). Use no raw hex values in components. Configure the breakpoints: `--breakpoint-sm: 640px`, `--breakpoint-lg: 1100px`, `--breakpoint-2xl: 1700px`.
4. **Content.** Create `app/data/site.ts` with typed interfaces (`Role`, `Project`, `Repo`, `Step`, `Metric`, …) and exported data for every card. Mark each placeholder field with a `// PLACEHOLDER` comment so I can find them all.
5. **Components** (`app/components/`, auto-imported):
   - `SiteHeader.vue`
   - `hero/HeroIntro.vue`, `hero/IntroPlayer.vue`, `hero/StatusPill.vue`
   - `cards/CardGrid.vue`, which owns the open-card state (`openId: Ref<CardId | null>`)
   - `cards/ExpandableCard.vue`, a shared shell with `#collapsed` / `#expanded` / `#label` slots, props `id`, `title`, `span` (per breakpoint) and `variant` (`light | dark`), emitting `toggle`. It handles the a11y overlay button, the close button, hover lift and the layout animation.
   - One component per card: `ExperienceCard`, `FeaturedWorkCard`, `ToolkitCard`, `LocationCard`, `GithubCard`, `ProcessCard`, `ProjectsCard`, `ContactCard`
   - `SiteFooter.vue`
   - Shared logic in `app/composables/`: `useOpenCard`, `useLocalTime` (America/Los_Angeles, updates each minute) and `useIntroPlayer`.
6. **Responsive.** Implement the four breakpoints from the spec with Tailwind's responsive prefixes. Use CSS rather than JS for layout, so there's no hydration flash. On wide screens the hero becomes a sticky 440px left column.
7. **Interaction.** One card open at a time; the open card spans every column (`col-span-full`). Animate it with `motion-v`'s `layout`, scroll it into view, close it on Escape, move focus to the close button on open and back to the card on close, and honor `prefers-reduced-motion`. Nested controls (UI/Code toggle, step tabs, intro play, links) must not toggle the card (`@click.stop` where needed).
8. **SEO and meta.** Use `useSeoMeta` for the title, description and Open Graph tags; add a favicon and `lang="en"`.
9. **Verify.** Run `npm run build`, `npx nuxi typecheck` and `npm run lint` and fix everything. Then check each breakpoint (390, 834, 1440, 1920) with Playwright screenshots, including one card open on desktop and on mobile. Compare them against the design files and list any differences you couldn't resolve.

## Rules
- Use the Composition API only. No Options API, no `any`, and type props and emits with `defineProps<…>()` / `defineEmits<…>()`.
- Use semantic HTML and real `<button>` / `<a>` / `<NuxtLink>` elements. Interactive targets are at least 44px. Keep WCAG AA contrast.
- No new dependencies beyond the stack above without asking me.
- Keep components small. Content lives in `app/data/site.ts`, never hard-coded in components.
- Commit after each numbered step with a clear message.
