<script setup lang="ts">
import { site } from '~/data/site'

const ogImage = site.ogImage ?? undefined

useSeoMeta({
  title: site.title,
  description: site.description,
  themeColor: site.themeColor,
  ogType: 'website',
  ogSiteName: site.name,
  ogTitle: site.title,
  ogDescription: site.description,
  ogUrl: site.url,
  ogLocale: site.locale,
  ogImage,
  ogImageAlt: ogImage ? site.ogImageAlt : undefined,
  twitterCard: ogImage ? 'summary_large_image' : 'summary',
  twitterTitle: site.title,
  twitterDescription: site.description,
  twitterImage: ogImage,
})

useHead({
  link: [{ rel: 'canonical', href: site.url }],
  script: [{ key: 'theme-init', innerHTML: themeInitScript, tagPosition: 'head' }],
})
</script>

<template>
  <NuxtPage />
</template>
