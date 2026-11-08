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
    <!--
      Ordered by impact for recruiters, reading from the top left:
        1. Results and track record  (At a glance, Experience, Toolkit)
        2. Fit                       (What I'm looking for)
        3. Proof of craft            (This site, GitHub, Currently working on)
        4. Personal and contact      (Location, Say hello)
      Desktop rows: [glance 2][experience 1][toolkit 1]
                    [looking for 2][this site 1][github 1]
                    [currently working on 4]
                    [location 2][say hello 2]

      FeaturedWorkCard, KindWordsCard and GuestbookCard are kept in the
      codebase but not rendered for now. To bring one back, add it here, e.g.
      <FeaturedWorkCard :open="isOpen('featured')" @toggle="toggle" />
      GuestbookCard goes last; it spans the full row on desktop.
    -->
    <LayoutGroup>
      <GlanceCard
        :open="isOpen('glance')"
        @toggle="toggle"
      />
      <ExperienceCard
        :open="isOpen('experience')"
        @toggle="toggle"
      />
      <ToolkitCard
        :open="isOpen('toolkit')"
        @toggle="toggle"
      />
      <LookingForCard
        :open="isOpen('lookingFor')"
        @toggle="toggle"
      />
      <SiteStatsCard
        :open="isOpen('siteStats')"
        @toggle="toggle"
      />
      <GithubCard
        :open="isOpen('github')"
        @toggle="toggle"
      />
      <ProjectsCard
        :open="isOpen('projects')"
        @toggle="toggle"
      />
      <LocationCard
        :open="isOpen('location')"
        @toggle="toggle"
      />
      <ContactCard
        :open="isOpen('contact')"
        @toggle="toggle"
      />
    </LayoutGroup>
  </section>
</template>
