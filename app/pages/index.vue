<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => t('meta.home') })
</script>

<template>
  <AppSlideshow show-caption />
</template>
