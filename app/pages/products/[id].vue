<script setup lang="ts">
import type { Localized } from '~/composables/useLocalized'

interface Color { key: string; code: string; images: number }
interface Product {
  id: string
  order: number
  code: string
  price: number
  dimensions: Localized
  name: Localized
  description: Localized<string[]>
  colors: Color[]
}

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { pick, price } = useLocalized()
const localePath = useLocalePath()

const id = computed(() => route.params.id as string)
const { data: product } = await useFetch<Product>(() => `/api/products/${id.value}`)

// selected colour is held in the URL (?color=) so the view is shareable
const selectedColor = computed<string>({
  get() {
    const q = route.query.color as string
    const ok = product.value?.colors.some((c) => c.key === q)
    return ok ? q : (product.value?.colors[0]?.key ?? 'r')
  },
  set(v) {
    router.replace({ query: { ...route.query, color: v } })
  },
})
const currentColor = computed(() => product.value?.colors.find((c) => c.key === selectedColor.value))

const { public: { siteUrl } } = useRuntimeConfig()

// Absolute thumbnail (black variant) used for social sharing previews.
const ogImage = computed(() => {
  if (!product.value) return `${siteUrl}/images/logo.jpg`
  const n = product.value.id.replace('pro', '')
  return `${siteUrl}/images/${product.value.id}/k/k${n}_s1.jpg`
})

// Description string built from the product's feature list + dimensions.
const metaDescription = computed(() => {
  if (!product.value) return t('meta.desc.products')
  const lines = pick(product.value.description) ?? []
  return [lines.join('、'), pick(product.value.dimensions)].filter(Boolean).join(' | ')
})

useHead({
  title: () => (product.value ? `${pick(product.value.name)} - ${t('brand')}` : t('brand')),
})

useSeoMeta({
  description: () => metaDescription.value,
  ogTitle: () => (product.value ? `${pick(product.value.name)} - ${t('brand')}` : t('brand')),
  ogDescription: () => metaDescription.value,
  ogType: 'product',
  ogImage: () => ogImage.value,
})

// Product structured data (JSON-LD) for rich results.
useHead(() => ({
  script: product.value
    ? [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: pick(product.value.name),
            image: ogImage.value,
            description: metaDescription.value,
            sku: product.value.code,
            brand: { '@type': 'Brand', name: t('brand') },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'TWD',
              price: product.value.price,
              availability: 'https://schema.org/InStock',
              url: `${siteUrl}${route.path}`,
            },
          }),
        },
      ]
    : [],
}))
</script>

<template>
  <div v-if="product" class="product-detail">
    <ProductGallery
      :product-id="product.id"
      :color="selectedColor"
      :count="currentColor?.images ?? 0"
    />

    <div class="product-info">
      <h2>{{ pick(product.name) }}</h2>
      <p class="product-info__price">{{ price(product.price) }}</p>
      <hr class="hr-line" />
      <p class="product-info__spec">{{ pick(product.dimensions) }}</p>
      <ul class="product-info__desc">
        <li v-for="(line, i) in pick(product.description)" :key="i">{{ line }}</li>
      </ul>
      <p class="product-info__code">{{ currentColor?.code }}</p>
      <hr class="hr-line" />
      <p>{{ t('product.chooseColor') }}</p>
      <div class="swatches">
        <button
          v-for="c in product.colors"
          :key="c.key"
          type="button"
          class="swatch"
          :class="[`swatch--${c.key}`, { 'is-active': c.key === selectedColor }]"
          :title="t(`colors.${c.key}`)"
          :aria-label="t(`colors.${c.key}`)"
          @click="selectedColor = c.key"
        />
      </div>
      <img class="product-info__sign" src="/images/signature.png" alt="Akibo Lee" />
    </div>

    <NuxtLink class="detail-close" :to="localePath('/products')" :aria-label="t('product.back')">×</NuxtLink>
  </div>
</template>
