# Personal site — design spec

Source of truth: `design/Main.dc.html`. It is one responsive component whose layout switches on a `layout` value (`mobile | tablet | desktop | wide`). The other `design/*.dc.html` files only render Main at a fixed breakpoint, or with one card open:

| File | Shows |
|---|---|
| `Main.dc.html` | Desktop at 1440 (switches layout automatically when resized) |
| `Wide.dc.html` | 1920 |
| `Tablet.dc.html` | 834 |
| `Mobile.dc.html` | 390 |
| `DesktopExpanded.dc.html` | Desktop with the Experience card open |
| `MobileExpanded.dc.html` | Mobile with the Featured work card open |

All styling is inline in the markup. All list content (roles, projects, repos, steps, metrics) is in the `renderVals()` script at the bottom of `Main.dc.html`. `{{hole}}` values come from that script. `<sc-if>` / `<sc-for>` are conditionals and loops.

## Design tokens

**Color**
| Token | Value | Use |
|---|---|---|
| `bg` | `#EDEDEA` | Page background |
| `surface` | `#F9F9F7` | Cards, pills |
| `surface-sunken` | `#F0F0EC` | Tiles inside open cards |
| `chip` | `#EAEAE6` | Card label pills |
| `border` | `#E3E3DF` | Card border (open: `#CFCFC9`) |
| `border-strong` | `#DCDCD7` | Chips, dividers, footer rule |
| `ink` | `#1A1A18` | Primary text, dark buttons, Contact card background |
| `ink-2` | `#3A3A36` | Strong secondary text |
| `ink-3` | `#55554F` | Body secondary text |
| `ink-4` | `#63635E` | Meta / mono labels |
| `ink-5` | `#6E6E68` | Tertiary mono (numbers) |
| `ink-muted-lg` | `#85857F` | Large gray headline text only |
| `accent` | `#F0479E` (dark theme: `#F25AA8`) | Avatar, pin, chart fills, primary CTA on dark. Text on accent uses `ink`. Alternatives: `#2B59FF`, `#12A150` |
| `accent-soft` | accent at 20% alpha | Map halo, chart areas |
| `success` | `#2F9E44` | "Available for work" dot |
| Contact card (dark) | bg `#1A1A18`, tiles `#252522`, pill `#2C2C29`, border `#3D3D39`, text `#F4F4F0`, muted `#B4B4AE` | |

All text pairs meet WCAG AA contrast. Keep it that way.

**Type**: Geist (400/500/600) for UI, Geist Mono (400/500) for labels, metadata and numbers. Headline weight 500, letter-spacing −0.028em, line-height 1.08.

**Shape**: cards radius 18px; inner tiles 12px; chips 8px; pills and buttons fully round. Card padding 20px. Interactive targets are at least 44px.

**Shadow**: resting `0 1px 2px rgba(20,20,18,.04)`. Hover or open: `0 1px 2px rgba(20,20,18,.06), 0 14px 36px rgba(20,20,18,.12)`.

## Breakpoints

Choose the layout from the viewport width: `<640` mobile, `<1100` tablet, `<1700` desktop, otherwise wide.

| | mobile | tablet | desktop | wide |
|---|---|---|---|---|
| Container max / side padding | 100% / 20 | 100% / 40 | 1376 / 64 | 1840 / 80 |
| Grid columns / gap | 2 / 12 | 2 / 16 | 4 / 16 | 4 / 20 |
| Card row height | 240 | 250 | 260 | 280 |
| H1 size | 30 | 44 | 56 (max-w 1000) | 44 |
| Hero placement | above grid | above grid | above grid | **left column 440px, sticky**, grid to the right |
| Nav | "Get in touch" only | full | full | full |
| Tile grid inside open cards (4-up / 3-up) | 1 / 1 | 2 / 3 | 4 / 3 | 4 / 3 |

Grid uses `grid-auto-flow: dense`. Mobile overrides: Featured 280, Process 290, Contact 280.

## Page structure

1. **Header**: accent square and name on the left; Work / Toolkit / Résumé links and a dark "Get in touch" pill on the right.
2. **Hero**: avatar tile (photo placeholder, "ME" monogram), H1 with a gray trailing clause, a one-paragraph intro, then two pills:
   - **Intro player**: play/pause, a waveform that fills as it plays (32s), and a countdown.
   - **Status**: green dot and "Available for work".
3. **Card grid**: 8 cards (below).
4. **Footer**: mono row: © year and name · Las Vegas, NV · live local time.

## Cards

Column spans are listed as mobile / tablet / desktop / wide.

| # | Card | Span | Collapsed | Expanded |
|---|---|---|---|---|
| 1 | Experience | 2/1/1/1 | Vertical timeline of 3 roles (current role's dot in the accent color) | Headline, role tiles (years, title, company, impact line) plus an Education tile, "Download résumé" button |
| 2 | Featured work | 2/2/2/2 | Dark preview panel with a **UI / Code toggle** (mini deal card mock ↔ Vue snippet), title, meta, 3 metrics | Problem / Approach / Outcome tiles, tech tags, "Read the case study" and "Component docs" buttons |
| 3 | Toolkit | 2/1/1/1 | "From Figma file to production code." plus 6 chips | 4 groups: Design, Frontend, Backend & data, Tooling |
| 4 | Location | 1/1/1/1 | Stylized street-grid SVG, accent pin, label card "Las Vegas" plus live PT time | Same, with an availability / time-zone sentence |
| 5 | GitHub | 1/1/1/1 | "1,284 contributions in the last year" plus a heatmap of recent weeks (10/26/19/20) | Full 52-week heatmap (scrolls sideways), 3 stats, pinned repos |
| 6 | How I work | 2/2/2/2 | Selected step (number, title, description) plus a **step tab bar** | All 4 steps as tiles |
| 7 | Now building | 2/2/2/2 | 3 rows: number, name, status chip | Tiles with description, tags, "View on GitHub" |
| 8 | Contact (dark) | 2/2/2/2 | Headline plus Email (accent), LinkedIn, GitHub, Résumé buttons | Adds "Open to" chips and contact details |

## Interaction

- **Expand**: clicking anywhere on a collapsed card opens it. The card spans the full row (`grid-column: 1 / -1`), its height grows to fit, and the border and shadow strengthen. Only one card is open at a time. A 44px × button closes it. Build the click target as a real `<button>` (an `aria-label` like "Expand Experience", plus `aria-expanded`), never a click handler on a div.
- **Nested controls** (preview toggle, step tabs, intro play, contact links) work without opening the card and must not trigger it.
- **Hover**: collapsed cards lift 3px, the shadow deepens and the corner expand icon darkens.
- **Production improvements beyond the mock**: animate the open/close (FLIP layout animation), scroll the opened card into view, close on Escape, move focus to the close button on open and back to the card on close, respect `prefers-reduced-motion`.

## Content

The content is a mix of real and **placeholder sample** text. Keep it all in one typed content file (`app/data/site.ts`) so it can be edited without touching components.

- **Real**: name; Slickdeals roles and dates (Frontend Engineer 2019–2024, Senior Full Stack Engineer 2024–now); UNLV Web Specialist 2017–2019; B.A. Computer & Information Sciences, University of Hawaiʻi at Mānoa, 2015; freeCodeCamp Full Stack certification; Las Vegas; Vue / TypeScript; the Job Search CLI and Dream Collector projects.
- **Placeholder (replace before launch)**: role impact lines, the featured case study and its metrics, GitHub numbers, heatmap and repos, extra toolkit items, the remote-work line, the email and social handles, the intro audio, the avatar photo.
