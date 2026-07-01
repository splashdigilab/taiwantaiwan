<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => t('meta.home') })
useSeoMeta({
  description: () => t('meta.desc.home'),
  ogTitle: () => t('meta.home'),
  ogDescription: () => t('meta.desc.home'),
})
</script>

<template>
  <AppSlideshow show-caption />
</template>
