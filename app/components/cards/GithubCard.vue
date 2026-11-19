<script setup lang="ts">
import { cards } from '~/data/site'
import type { CardId } from '~/data/site'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const github = await useGithub()
const contributions = computed(() => github.value.contributions.toLocaleString('en-US'))
const skylineReady = ref(false)
// The skyline unmounts with the expanded view; show the 2D heatmap again until it remounts.
watch(() => props.open, () => (skylineReady.value = false))
const languageDot: Record<string, string> = {
  Vue: 'bg-lang-vue',
  TypeScript: 'bg-lang-typescript',
  JavaScript: 'bg-lang-javascript',
  PHP: 'bg-lang-php',
}
</script>

<template>
  <ExpandableCard
    id="github"
    :title="cards.github.title"
    :span="{ base: 1, sm: 1, lg: 1 }"
    body-class="gap-3.5"
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
        <!--
          3D skyline of the full year. The 2D heatmap shows until WebGL is ready
          (and stays if it never is); the canvas then covers it.
        -->
        <div
          role="img"
          :aria-label="`Contribution skyline: ${contributions} ${github.contributionsCaption}, one bar per day`"
          class="relative h-[150px] sm:h-[240px] lg:h-[280px]"
        >
          <div
            aria-hidden="true"
            class="flex h-full items-center justify-center overflow-hidden transition-opacity duration-300"
            :class="skylineReady ? 'opacity-0' : 'opacity-100'"
          >
            <GithubHeatmap :weeks="github.weeks" />
          </div>
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0"
          >
            <ClientOnly>
              <LazyGithubSkyline
                :weeks="github.weeks"
                @ready="skylineReady = true"
              />
            </ClientOnly>
          </div>
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

        <p class="max-w-[520px] text-[15px] leading-normal text-ink-3">
          {{ github.privateNote }}
        </p>

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
                <span class="flex-1" />
                <span
                  v-if="repo.language"
                  class="inline-flex items-center gap-1.5 text-[13px] text-ink-3"
                >
                  <span
                    aria-hidden="true"
                    class="size-2 rounded-full"
                    :class="languageDot[repo.language] ?? 'bg-ink-5'"
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
