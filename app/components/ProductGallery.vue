<script setup lang="ts">
const props = defineProps<{
  productId: string // e.g. "pro1"
  color: string // e.g. "r"
  count: number // number of images for this colour
}>()

const num = computed(() => props.productId.replace('pro', ''))
const images = computed(() => Array.from({ length: props.count }, (_, i) => i + 1))

function img(size: 's' | 'm' | 'l', i: number) {
  return `/images/${props.productId}/${props.color}/${props.color}${num.value}_${size}${i}.jpg`
}

const active = ref(1)
// reset to first image when colour (or product) changes
watch(() => [props.color, props.productId], () => { active.value = 1 })

// ---- lightbox ----
const lbOpen = ref(false)
const lbIndex = ref(1)
function openLightbox(i: number) {
  lbIndex.value = i
  lbOpen.value = true
}
function close() { lbOpen.value = false }
function step(d: number) {
  lbIndex.value = ((lbIndex.value - 1 + d + props.count) % props.count) + 1
}
function onKey(e: KeyboardEvent) {
  if (!lbOpen.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowLeft') step(-1)
  else if (e.key === 'ArrowRight') step(1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="gallery">
    <div class="gallery__main" @click="openLightbox(active)">
      <img :src="img('m', active)" :alt="`${productId} ${color} ${active}`" />
    </div>

    <div class="gallery__thumbs">
      <button
        v-for="i in images"
        :key="i"
        class="gallery__thumb"
        :class="{ 'is-active': i === active }"
        type="button"
        @mouseenter="active = i"
        @click="active = i"
      >
        <img :src="img('s', i)" :alt="`thumbnail ${i}`" />
      </button>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lbOpen" class="lightbox" @click.self="close">
          <button class="lightbox__close" aria-label="close" @click="close">×</button>
          <button class="lightbox__btn lightbox__btn--prev" aria-label="previous" @click="step(-1)">‹</button>
          <img class="lightbox__img" :src="img('l', lbIndex)" :alt="`${productId} large ${lbIndex}`" />
          <button class="lightbox__btn lightbox__btn--next" aria-label="next" @click="step(1)">›</button>
          <div class="lightbox__count">{{ lbIndex }} / {{ count }}</div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
