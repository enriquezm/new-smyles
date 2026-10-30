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
  compatibilityDate: '2026-10-01',

  nitro: {
    prerender: {
      // Plain-text "ask an AI about me" prompt, built from app/data/site.ts.
      routes: ['/about-myles.txt'],
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
