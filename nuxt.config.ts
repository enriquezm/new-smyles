import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/fonts', 'motion-v/nuxt'],

  components: [{ path: '~/components', pathPrefix: false }],
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Server-only, set with NUXT_GITHUB_TOKEN in .env or the host's env vars.
    // Used when building /github.json and /projects.json and never sent to the browser.
    githubToken: '',
  },
  compatibilityDate: '2026-10-01',

  nitro: {
    prerender: {
      // Plain-text "ask an AI about me" prompt, built from app/data/site.ts,
      // the GitHub card's data and the projects' latest commit dates, fetched
      // from the GitHub API at build time.
      routes: ['/about-myles.txt', '/github.json', '/projects.json'],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
    },
    families: [
      { name: 'Geist', provider: 'google', weights: [400, 500, 600], global: true },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500], global: true },
    ],
  },
})
