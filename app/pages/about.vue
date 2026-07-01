<script setup lang="ts">
import type { Localized } from '~/composables/useLocalized'

const { t } = useI18n()
const { pick } = useLocalized()
const { data } = await useFetch<{ story: Localized }>('/api/about')
useHead({ title: () => t('meta.about') })
useSeoMeta({
  description: () => t('meta.desc.about'),
  ogTitle: () => t('meta.about'),
  ogDescription: () => t('meta.desc.about'),
})
</script>

<template>
  <AppSlideshow>
    <div class="story">
      <p>{{ pick(data?.story) }}</p>
      <img class="story__sign" src="/images/signature.png" alt="Akibo Lee" />
    </div>
  </AppSlideshow>
</template>
