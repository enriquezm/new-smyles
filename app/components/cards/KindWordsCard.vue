<script setup lang="ts">
import { cards, kindWords } from '~/data/site'
import type { CardId, Recommendation } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const { items } = kindWords
const index = ref(0)
const current = computed<Recommendation>(() => items[index.value] ?? items[0]!)

function step(by: number) {
  index.value = (index.value + by + items.length) % items.length
}
</script>

<template>
  <ExpandableCard
    id="kindWords"
    :title="cards.kindWords.title"
    :span="{ base: 2, sm: 2, lg: 2 }"
    :mobile-height="280"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconQuote />{{ cards.kindWords.label }}
    </template>

    <template #collapsed>
      <div class="mt-auto flex flex-col gap-3">
        <figure
          aria-live="polite"
          class="flex flex-col gap-2"
        >
          <blockquote class="line-clamp-4 text-base leading-[1.45] font-medium tracking-[-0.01em] text-ink sm:line-clamp-3 sm:text-[17px]">
            “{{ current.quote }}”
          </blockquote>
          <figcaption class="text-[13px] text-ink-4">
            {{ current.name }} · {{ current.role }}
          </figcaption>
        </figure>
        <div class="flex items-center gap-2">
          <button
            type="button"
            data-retro="button"
            aria-label="Previous recommendation"
            class="pointer-events-auto inline-flex size-11 cursor-pointer items-center justify-center rounded-pill border border-border-strong text-ink"
            @click.stop="step(-1)"
          >
            <IconChevronLeft />
          </button>
          <button
            type="button"
            data-retro="button"
            aria-label="Next recommendation"
            class="pointer-events-auto inline-flex size-11 cursor-pointer items-center justify-center rounded-pill border border-border-strong text-ink"
            @click.stop="step(1)"
          >
            <IconChevronRight />
          </button>
          <span class="ml-1 font-mono text-meta text-ink-4">
            {{ index + 1 }} / {{ items.length }}
          </span>
        </div>
      </div>
    </template>

    <template #expanded>
      <div class="flex flex-col gap-6 pt-1">
        <CardHeadline>{{ kindWords.headline }}</CardHeadline>
        <ul class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <li
            v-for="item in items"
            :key="item.name"
          >
            <CardTile class="h-full">
              <figure class="flex h-full flex-col gap-3">
                <blockquote class="text-[15px] leading-normal text-ink-2">
                  “{{ item.quote }}”
                </blockquote>
                <figcaption class="mt-auto flex flex-col gap-0.5">
                  <a
                    :href="item.href"
                    class="inline-flex min-h-11 items-center self-start text-sm font-medium text-ink underline underline-offset-[3px]"
                  >{{ item.name }}</a>
                  <span class="text-[13px] text-ink-4">{{ item.role }}</span>
                </figcaption>
              </figure>
            </CardTile>
          </li>
        </ul>
        <PillLink
          :href="kindWords.source.href"
          variant="outline"
          arrow
          class="self-start"
        >
          {{ kindWords.source.label }}
        </PillLink>
      </div>
    </template>
  </ExpandableCard>
</template>
