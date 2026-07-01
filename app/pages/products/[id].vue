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

useHead({
  title: () => (product.value ? `${pick(product.value.name)} - ${t('brand')}` : t('brand')),
})
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
