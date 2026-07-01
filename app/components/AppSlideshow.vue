<script setup lang="ts">
import type { Localized } from '~/composables/useLocalized'

interface Person { id: string; title: Localized; name: Localized }
interface Slide { image: string; personId: string }

withDefaults(defineProps<{ showCaption?: boolean }>(), { showCaption: false })

const { pick } = useLocalized()
const { data } = await useFetch<{ people: Person[]; slides: Slide[] }>('/api/home')

const slides = computed(() => data.value?.slides ?? [])
const peopleById = computed<Record<string, Person>>(() =>
  Object.fromEntries((data.value?.people ?? []).map((p) => [p.id, p])),
)

const index = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    if (slides.value.length) index.value = (index.value + 1) % slides.value.length
  }, 4500)
})
onBeforeUnmount(() => clearInterval(timer))

const currentPerson = computed(() => {
  const s = slides.value[index.value]
  return s ? peopleById.value[s.personId] : null
})
</script>

<template>
  <div class="slideshow">
    <div
      v-for="(s, i) in slides"
      :key="s.image"
      class="slideshow__slide"
      :class="{ 'is-active': i === index }"
      :style="{ backgroundImage: `url(/images/${s.image})` }"
    />

    <div v-if="showCaption && currentPerson" class="caption">
      <span class="caption__title">{{ pick(currentPerson.title) }}</span>
      {{ pick(currentPerson.name) }}
    </div>

    <slot />
  </div>
</template>
