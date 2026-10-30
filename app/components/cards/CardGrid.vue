<script setup lang="ts">
import type { CardId } from '~/data/site'

const { openId, toggle } = useOpenCard()
const isOpen = (id: CardId) => openId.value === id
</script>

<template>
  <section
    id="work"
    aria-label="About me"
    class="grid min-w-0 flex-1 grid-flow-dense grid-cols-2 content-start gap-3 sm:gap-4 lg:grid-cols-4 2xl:gap-5"
  >
    <LayoutGroup>
      <ExperienceCard
        :open="isOpen('experience')"
        @toggle="toggle"
      />
      <FeaturedWorkCard
        :open="isOpen('featured')"
        @toggle="toggle"
      />
      <ToolkitCard
        :open="isOpen('toolkit')"
        @toggle="toggle"
      />
      <LocationCard
        :open="isOpen('location')"
        @toggle="toggle"
      />
      <GithubCard
        :open="isOpen('github')"
        @toggle="toggle"
      />
      <ProcessCard
        :open="isOpen('process')"
        @toggle="toggle"
      />
      <ProjectsCard
        :open="isOpen('projects')"
        @toggle="toggle"
      />
      <ContactCard
        :open="isOpen('contact')"
        @toggle="toggle"
      />
    </LayoutGroup>
  </section>
</template>
