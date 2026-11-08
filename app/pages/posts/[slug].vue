<script setup lang="ts">
import { postPage, site } from '~/data/site'

const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.path}`, () =>
  queryCollection('posts').path(route.path).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const title = `${post.value.title} — ${site.name}`
const url = `${site.url}${post.value.path}`

useSeoMeta({
  title,
  description: post.value.description,
  ogType: 'article',
  ogTitle: title,
  ogDescription: post.value.description,
  ogUrl: url,
  twitterTitle: title,
  twitterDescription: post.value.description,
})

useHead({ link: [{ key: 'canonical', rel: 'canonical', href: url }] })
</script>

<template>
  <div class="mx-auto w-full px-5 sm:px-10 lg:max-w-page lg:px-16 2xl:max-w-page-wide 2xl:px-20">
    <SiteHeader />
    <main class="flex flex-col gap-4 pt-6 sm:pt-10 lg:pt-16">
      <div class="mx-auto w-full max-w-post">
        <NuxtLink
          to="/"
          data-retro="on-desktop"
          class="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-3 hover:text-ink"
        >
          <IconChevronLeft :size="14" />{{ postPage.backLabel }}
        </NuxtLink>
      </div>
      <PostLayout
        v-if="post"
        :type="post.type"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :updated="post.updated"
        :tags="post.tags ?? []"
      >
        <ContentRenderer :value="post" />
      </PostLayout>
    </main>
    <SiteFooter />
  </div>
</template>
