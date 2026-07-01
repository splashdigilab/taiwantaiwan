<script setup lang="ts">
const { t } = useI18n()
const { public: { siteUrl } } = useRuntimeConfig()

// i18n-generated <html lang/dir>, hreflang alternates, canonical & og:url/locale.
const localeHead = useLocaleHead()
useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: localeHead.value.meta,
}))

// Site-wide SEO / Open Graph defaults (individual pages override title & description).
useSeoMeta({
  ogSiteName: () => t('brand'),
  ogType: 'website',
  ogImage: `${siteUrl}/images/logo.jpg`,
  ogImageAlt: () => t('brand'),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
