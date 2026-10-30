<script setup lang="ts">
import { cards, contact } from '~/data/site'
import type { CardId } from '~/data/site'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ toggle: [id: CardId] }>()

const reachMe = contact.links.filter(link => link.display)
</script>

<template>
  <ExpandableCard
    id="contact"
    anchor="contact"
    :title="cards.contact.title"
    :span="{ base: 2, sm: 2, lg: 4 }"
    :mobile-height="280"
    variant="dark"
    :open="open"
    @toggle="emit('toggle', $event)"
  >
    <template #label>
      <IconMail />{{ cards.contact.label }}
    </template>

    <p class="max-w-[460px] text-[26px] leading-[1.15] font-medium tracking-title">
      {{ contact.headline }}
    </p>
    <ul class="mt-auto flex flex-wrap gap-2">
      <li
        v-for="link in contact.links"
        :key="link.kind"
      >
        <PillLink
          :href="link.href"
          :variant="link.kind === 'email' ? 'accent' : 'dark-outline'"
          :arrow="link.kind === 'email'"
          class="pointer-events-auto"
        >
          {{ link.label }}
        </PillLink>
      </li>
    </ul>

    <template #expanded>
      <div class="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
        <CardTile
          tone="dark"
          class="gap-3"
        >
          <h4 class="font-mono text-meta font-normal text-contact-muted">
            Open to
          </h4>
          <ul class="flex flex-wrap gap-1.5">
            <li
              v-for="item in contact.openTo"
              :key="item"
            >
              <Chip
                size="md"
                tone="dark"
              >
                {{ item }}
              </Chip>
            </li>
          </ul>
        </CardTile>
        <CardTile
          tone="dark"
          class="gap-2.5 font-mono text-[13px]"
        >
          <h4 class="text-meta font-normal text-contact-muted">
            Reach me
          </h4>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="link in reachMe"
              :key="link.kind"
            >
              {{ link.display }}
            </li>
          </ul>
        </CardTile>
      </div>
    </template>
  </ExpandableCard>
</template>
