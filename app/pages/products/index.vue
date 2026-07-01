<script setup lang="ts">
import type { Localized } from '~/composables/useLocalized'

interface Color { key: string; code: string; images: number }
interface Product {
  id: string
  order: number
  name: Localized
  listName: Localized
  colors: Color[]
}

const { t } = useI18n()
const { pick } = useLocalized()
const localePath = useLocalePath()
const { data: products } = await useFetch<Product[]>('/api/products')
useHead({ title: () => t('meta.products') })
useSeoMeta({
  description: () => t('meta.desc.products'),
  ogTitle: () => t('meta.products'),
  ogDescription: () => t('meta.desc.products'),
})

// Grid thumbnails use the black (k) variant, matching the original site.
function thumb(p: Product, hover = false) {
  const n = p.id.replace('pro', '')
  return `/images/${p.id}/k/k${n}_s1${hover ? '_o' : ''}.jpg`
}
</script>

<template>
  <div class="product-grid">
    <NuxtLink
      v-for="p in products"
      :key="p.id"
      class="product-card"
      :to="localePath(`/products/${p.id}`)"
    >
      <div class="product-card__thumb">
        <img :src="thumb(p)" :alt="pick(p.listName)" loading="lazy" />
        <img class="is-hover" :src="thumb(p, true)" :alt="pick(p.listName)" loading="lazy" />
      </div>
      <div class="product-card__name">{{ pick(p.listName) }}</div>
    </NuxtLink>
  </div>
</template>
