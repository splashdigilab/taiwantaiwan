<script setup lang="ts">
import type { Localized } from '~/composables/useLocalized'

interface Retailer {
  id: number
  name: Localized
  address: Localized
  phone: Localized
  note: Localized
}

const { t } = useI18n()
const { pick } = useLocalized()
const { data } = await useFetch<Retailer[]>('/api/retailers')
useHead({ title: () => t('meta.retailers') })

// split into two grouped columns, like the original (first half / second half)
const half = computed(() => Math.ceil((data.value?.length ?? 0) / 2))
const columns = computed(() => [
  data.value?.slice(0, half.value) ?? [],
  data.value?.slice(half.value) ?? [],
])
</script>

<template>
  <section class="retailers">
    <div class="retailers__panel">
      <div v-for="(col, ci) in columns" :key="ci" class="retailers__col">
        <div v-for="r in col" :key="r.id" class="retailer">
          <div class="retailer__name">{{ pick(r.name) }}</div>
          <p class="retailer__addr">{{ pick(r.address) }} {{ pick(r.phone) }}</p>
          <p v-if="pick(r.note)" class="retailer__note">{{ pick(r.note) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
