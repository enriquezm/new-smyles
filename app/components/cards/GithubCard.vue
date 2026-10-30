<script setup lang="ts">
import { cards, github } from '~/data/site'
import type { CardId, Language } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const contributions = github.contributions.toLocaleString('en-US')
const languageDot: Record<Language, string> = {
  Vue: 'bg-lang-vue',
  TypeScript: 'bg-lang-typescript',
}
</script>

<template>
  <ExpandableCard
    id="github"
    :title="cards.github.title"
    :span="{ base: 1, sm: 1, lg: 1 }"
    body-class="gap-3.5 p-5"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconBranch />{{ cards.github.label }}
    </template>

    <div>
      <p class="text-[28px] leading-[1.05] font-medium tracking-[-0.025em]">
        {{ contributions }}
      </p>
      <p class="mt-1 text-[13px] text-ink-4">
        {{ github.contributionsCaption }}
      </p>
    </div>

    <template #collapsed>
      <GithubHeatmap
        :weeks="github.weeks"
        compact
        class="mt-auto"
      />
    </template>

    <template #expanded>
      <div class="flex flex-col gap-5">
        <div
          tabindex="0"
          role="region"
          aria-label="Contribution heatmap (scrolls sideways)"
          class="overflow-x-auto pb-1"
        >
          <GithubHeatmap :weeks="github.weeks" />
        </div>

        <dl class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <CardTile
            v-for="stat in github.stats"
            :key="stat.label"
          >
            <dt class="font-mono text-meta text-ink-4">
              {{ stat.label }}
            </dt>
            <dd class="mt-1.5 text-[22px] font-medium tracking-title">
              {{ stat.value }}
            </dd>
          </CardTile>
        </dl>

        <div class="flex flex-col">
          <h4 class="pb-2 font-mono text-meta font-normal text-ink-4">
            Pinned repositories
          </h4>
          <ul>
            <li
              v-for="repo in github.repos"
              :key="repo.name"
            >
              <a
                :href="repo.href"
                class="flex min-h-[52px] flex-wrap items-center gap-3.5 border-t border-rule py-2 text-ink"
              >
                <span class="font-mono text-sm font-medium">{{ repo.name }}</span>
                <span class="min-w-0 flex-[1_1_200px] text-sm text-ink-3">{{ repo.description }}</span>
                <span class="inline-flex items-center gap-1.5 text-[13px] text-ink-3">
                  <span
                    aria-hidden="true"
                    class="size-2 rounded-full"
                    :class="languageDot[repo.language]"
                  />{{ repo.language }}
                </span>
                <span class="font-mono text-meta text-ink-4">
                  <span aria-hidden="true">★</span> {{ repo.stars }}<span class="sr-only"> stars</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </ExpandableCard>
</template>
