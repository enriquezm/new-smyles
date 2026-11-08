import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { postTypes } from './app/data/site'
import type { PostType } from './app/data/site'

const postTypeIds = Object.keys(postTypes) as [PostType, ...PostType[]]

export default defineContentConfig({
  collections: {
    // Markdown posts in content/posts/, served at /posts/<file name>.
    // `title` and `description` come from the built-in page schema; the
    // description doubles as the one-line summary in the "Currently working on" card.
    posts: defineCollection({
      type: 'page',
      source: 'posts/*.md',
      schema: z.object({
        type: z.enum(postTypeIds),
        /** ISO date the post was first published. */
        date: z.string(),
        /** ISO date of the last meaningful edit; orders the card list when set. */
        updated: z.string().optional(),
        tags: z.array(z.string()).default([]),
      }),
    }),
  },
})
