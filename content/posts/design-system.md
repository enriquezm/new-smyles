---
type: notes
title: The design system behind this site
description: Every token this site runs on, how three themes share them, and the rules that keep it all accessible.
date: 2026-11-08
tags: [Design system, Tailwind CSS, Theming, Accessibility]
---

I design systems at work, so I wanted this site to run on one too. Nothing big: a single file of tokens, a few rules about how components use them, and three themes that change the look without touching a component.

This post lists every token the site uses and explains how the themes work. If you want to follow along in code, it all lives in [`main.css`](https://github.com/enriquezm/new-smyles/blob/main/app/assets/css/main.css).

## How it's put together

There are three layers, and each one only talks to the one below it.

1. **Tokens.** Every color, radius, shadow, font and breakpoint is a CSS variable in a Tailwind v4 `@theme` block. Tailwind turns each one into utilities, so `--color-surface` becomes `bg-surface` and `--radius-card` becomes `rounded-card`.
2. **Components.** Vue components only use those utilities. There are no raw hex values in a component, ever. If a component needs a color that doesn't exist yet, it gets a token first.
3. **Themes.** A theme is just a block of overrides on `<html data-theme="…">`. It reassigns token values and nothing else, so the components never know which theme they're in.

That last part is what makes adding a theme cheap. Dark mode is about 40 lines of variables. Retro is bigger, but most of that is bevels (more on that below).

## Color

### The palette

The whole site leans on three colors.

| Color | Hex | Where it shows up |
|---|---|---|
| Periwinkle | `#8C7DFF` | The accent: logo square, current-role dot, map pin, GitHub heatmap, "Email me" button, the "Exploring" chip |
| Lime | `#CFFF5E` | "Finished" status chip |
| Purple | `#B87EED` | "Concept" status chip and the concept note on posts |

All three are bright, so text on top of them is always dark ink (`#1A1A18`). That pairing passes WCAG AA on every one: 5.4:1 on periwinkle, 6:1 on purple and 15:1 on lime.

The tricky part was putting periwinkle *as text* on the light background, like my name in the headline. Straight `#8C7DFF` on the light page only gets 2.8:1, which fails even for large text. So there's a separate `accent-text` token that nudges it a hair darker in light mode (`#8373FF`, 3.05:1) and uses the real swatch in dark mode, where it has plenty of room. You can't really see the difference, but the contrast checker can.

### Accent tokens

| Token | Light | Dark | Retro |
|---|---|---|---|
| `accent` | `#8C7DFF` | `#8C7DFF` | `#000080` |
| `on-accent` | `#1A1A18` | `#1A1A18` | `#FFFFFF` |
| `accent-text` | `#8373FF` | `#8C7DFF` | `#000080` |
| `accent-soft` | accent at 20% | | |
| `accent-tint` | accent at 18% | | |
| `heat-1` → `heat-4` | accent at 30%, 55%, 80%, 100% | | |

The tints are built with `color-mix()` instead of hard-coded values, so they follow the accent automatically. When I swapped the accent from pink to periwinkle, the heatmap, the map halo and the "In progress" chip all changed with it for free.

### Neutrals

Most of the site is warm grays. They have a slight yellow lean, which keeps the light theme from feeling clinical.

| Token | Light | Dark | Retro | Use |
|---|---|---|---|---|
| `bg` | `#EDEDEA` | `#121211` | `#008080` | Page background |
| `surface` | `#F9F9F7` | `#1B1B19` | `#C0C0C0` | Cards, pills |
| `surface-sunken` | `#F0F0EC` | `#232320` | `#FFFFFF` | Inset tiles, code |
| `chip` | `#EAEAE6` | `#2A2A27` | `#C0C0C0` | Card label pills |
| `border` | `#E3E3DF` | `#2A2A27` | `#808080` | Card border |
| `border-open` | `#CFCFC9` | `#4A4A45` | `#000000` | Border of an open card |
| `border-strong` | `#DCDCD7` | `#3A3A36` | `#808080` | Chips, dividers |
| `rule` | `#E6E6E2` | `#2E2E2B` | `#808080` | Hairlines, empty heatmap cells |
| `ink` | `#1A1A18` | `#F2F2EE` | `#000000` | Primary text |
| `ink-2` | `#3A3A36` | `#DADAD4` | `#000000` | Strong secondary text |
| `ink-3` | `#55554F` | `#B2B2AB` | `#222222` | Body secondary text |
| `ink-4` | `#63635E` | `#A0A099` | `#333333` | Meta text |
| `ink-5` | `#6E6E68` | `#96968F` | `#404040` | Quietest text that still passes AA |
| `ink-muted-lg` | `#85857F` | `#85857F` | `#505050` | Icons and large text only |

The ink scale is the part I'm proudest of. Five steps sounds like a lot, but each one is checked against every surface it sits on. `ink-5` is the lightest gray that still passes 4.5:1 on a card. Anything lighter only clears the 3:1 bar for icons and large text, which is why `ink-muted-lg` has "lg" in the name. The name is the rule.

### Status

| Token | Light | Dark | Retro | Use |
|---|---|---|---|---|
| `success` | `#2F9E44` | `#3FB950` | `#008000` | "Available for work" dot |
| `info-bg` / `info-fg` | `#8C7DFF` / `#1A1A18` | same | `#FFFFE1` / `#000000` | "Exploring" chip |
| `success-bg` / `success-fg` | `#CFFF5E` / `#1A1A18` | same | `#CCFF99` / `#000000` | "Finished" chip |
| `idea-bg` / `idea-fg` | `#B87EED` / `#1A1A18` | same | `#E0C0FF` / `#000000` | "Concept" chip |

### Component colors

A few cards have their own small palettes. They're still tokens, just scoped by name to the thing they paint.

| Group | Tokens |
|---|---|
| Contact card (always dark) | `contact-bg` `#1A1A18`, `contact-tile` `#252522`, `contact-pill` `#2C2C29`, `contact-border` `#3D3D39`, `contact-text` `#F4F4F0`, `contact-muted` `#B4B4AE`, `contact-label` `#CFCFC9`, `contact-glyph` `#8F8F89` |
| Code preview | `code-text` `#CFCFC9`, `code-punct` `#8F8F89`, `code-string` `#9FD39B`, `code-toggle-off` `#B4B4AE` |
| Map | `surface-map` `#F3F3F0`, `map-grid` `#DEDED9`, `map-road` `#D2D2CC`, `map-road-2` `#D8D8D2` |
| Timeline and mockups | `timeline` `#D5D5D0` (the Experience line), `wave` `#BDBDB7` (placeholder bars in the work preview) |
| GitHub languages | `lang-vue` `#41B883`, `lang-typescript` `#3178C6`, `lang-javascript` `#F1E05A`, `lang-php` `#4F5D95` |

Those are the light values. Dark and retro override most of them too, except the language colors, which match GitHub's in every theme.

## Type

| Token | Value |
|---|---|
| `font-sans` | Geist |
| `font-mono` | Geist Mono |
| `tracking-headline` | -0.028em |
| `tracking-title` | -0.02em |
| `leading-headline` | 1.08 |
| `text-label` | 11.5px |
| `text-meta` | 12px |

Geist does almost everything. Geist Mono is for small labels: card pills, dates, the "+N more" note. Both are self-hosted, so the page never jumps when the fonts arrive. Headlines get tighter letter spacing because Geist reads a little loose at large sizes.

## Shape and depth

| Token | Value | Use |
|---|---|---|
| `radius-mini` | 6px | Inline code, tiny bits |
| `radius-chip` | 8px | Chips |
| `radius-tile` | 12px | Tiles inside a card |
| `radius-card` | 18px | Cards |
| `radius-pill` | 9999px | Pills and buttons |
| `shadow-card` | `0 1px 2px` at 4% | Resting card |
| `shadow-card-hover` | that, plus `0 14px 36px` at 12% | Hovered or open card |
| `shadow-float` | `0 1px 2px` at 6% | Small floating labels |

The radii step down as things nest: a 12px tile sits inside an 18px card, so the corners look parallel instead of pinched. Shadows stay subtle on purpose. The hover lift should feel like a card rising a few millimeters, not floating off the page. In dark mode the shadows get much stronger (40–55% black), because a faint shadow disappears on a dark background.

## Layout

| Token | Value |
|---|---|
| `breakpoint-sm` | 640px |
| `breakpoint-lg` | 1100px |
| `breakpoint-2xl` | 1700px |
| `container-page` | 1376px |
| `container-page-wide` | 1840px |
| `container-hero` | 440px |
| `container-headline` | 1000px |
| `container-intro` | 640px |
| `container-post` | 760px |

I replaced Tailwind's default breakpoints with three of my own, which gives four layouts: phone, tablet, desktop and wide. The odd one is 1100px. That's where the card grid jumps from two columns to four, and 1100 is the narrowest width where four columns still have room to breathe, so I put the breakpoint there instead of at a round number. On wide screens the intro becomes a sticky 440px column on the left and the cards scroll past it.

All layout is plain CSS. Nothing waits for JavaScript to decide what the page looks like, so there's no jump when it loads.

## The three themes

The theme switcher in the header has light, dark and retro. A tiny script in the `<head>` sets the theme before the first paint, using your saved choice or your system's light/dark setting. That's why the page never flashes white before going dark.

### Light

The default, and the one the tokens above are written for. Warm off-white page, near-white cards, dark ink.

### Dark

Same layout, flipped values. A few things I learned getting it right:

- **Cards get lighter, not darker.** The page is the darkest layer (`#121211`) and cards sit a step above it (`#1B1B19`), the way objects closer to a light source look brighter.
- **Text isn't pure white.** `#F2F2EE` is easier on the eyes and keeps the warm lean of the light theme.
- **The always-dark contact card goes darker still** (`#0A0A09`), so it stays the darkest thing on the page in both themes.

### Retro

This one is just for fun: Windows 95. Teal desktop, silver windows, navy title bars, and the contact card turns into an MS-DOS prompt.

It's the best test of the system, because it changes things the other two don't touch:

- **Fonts** become MS Sans Serif and Courier New, and every medium or semibold weight turns into plain bold.
- **Every radius goes to 0** and every shadow goes to `none`.
- **Bevels.** Windows 95 drew depth with a white edge on the top-left and a gray edge on the bottom-right. Those are new tokens (`retro-raised`, `retro-sunken`) applied through `data-retro` hooks on the cards, buttons and fields.
- **Title bars.** Each card's label row becomes a navy-to-blue gradient title bar, and the expand button becomes a tiny 18×16 window button.

That tiny button is the one place retro fought the accessibility rules. Real Win95 buttons are far too small to tap. So the button stays visually tiny, and an invisible `::after` layer around it keeps the actual tap target at 44px.

## The rules

The tokens only work because of a few rules every component follows:

- **No raw values.** Every color, radius and shadow comes from a token.
- **WCAG AA contrast** for every text pair, in all three themes. Each new token gets checked against every surface it can sit on.
- **44px minimum** for anything you can tap or click.
- **Motion respects your settings.** Cards open with a layout animation that turns off when your device asks for reduced motion.
- **Content lives in one data file**, not in components, so changing words never means touching markup.

## What's next

<!-- PLACEHOLDER: what you're planning for the system. Ideas below, keep or cut. -->

- Pull the tokens out into their own package so I can reuse them on other projects.
- Generate this post's tables from the CSS so the docs can't drift from the code.
- Add a fourth theme. I haven't picked one yet.
