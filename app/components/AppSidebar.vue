<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

const open = ref(false)
// close the mobile menu whenever the route changes
watch(() => route.fullPath, () => { open.value = false })

const langs = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'jp', label: '日本語' },
] as const
// the original site shows only the *other* languages as plain text links
const otherLangs = computed(() => langs.filter((l) => l.code !== locale.value))

const social = [
  { id: 'fb', label: 'FB', href: 'https://www.facebook.com/pages/美麗寶島-台灣/1474148186238318' },
  { id: 'ig', label: 'IG', href: 'https://instagram.com/meilibaodao_taiwan/' },
  { id: 'email', label: 'EMAIL', href: 'mailto:ilovetaiwantaiwan@gmail.com' },
]
</script>

<template>
  <aside class="sidebar" :class="{ 'is-open': open }">
    <div class="sidebar__bar">
      <NuxtLink class="sidebar__logo" :to="localePath('/')" aria-label="美麗寶島台灣">
        <img src="/images/logo.jpg" alt="美麗寶島台灣 TAIWAN TAIWAN" />
      </NuxtLink>

      <button
        class="sidebar__toggle"
        :aria-expanded="open"
        aria-label="menu"
        @click="open = !open"
      >
        <span />
      </button>
    </div>

    <div class="sidebar__menu">
      <nav class="sidebar__nav">
        <NuxtLink :to="localePath('/about')">{{ t('nav.about') }}</NuxtLink>
        <NuxtLink :to="localePath('/products')">{{ t('nav.products') }}</NuxtLink>
        <NuxtLink :to="localePath('/retailers')">{{ t('nav.retailers') }}</NuxtLink>
      </nav>

      <div class="sidebar__footer">
        <a
          class="webshop"
          href="https://pinkoi.com/store/taiwantaiwan"
          target="_blank"
          rel="noopener"
          :aria-label="t('webshop')"
        >
          <img src="/images/btn_webshop.jpg" alt="ONLINE SHOPPING" />
        </a>

        <div class="lang">
          <NuxtLink
            v-for="l in otherLangs"
            :key="l.code"
            :to="switchLocalePath(l.code)"
          >{{ l.label }}</NuxtLink>
        </div>

        <div class="sidebar__hr" />

        <div class="social">
          <a
            v-for="s in social"
            :key="s.id"
            class="sns"
            :class="`sns--${s.id}`"
            :href="s.href"
            target="_blank"
            rel="noopener"
            :aria-label="s.label"
          >{{ s.label }}</a>
        </div>

        <div class="sidebar__hr" />

        <div class="copy">
          {{ t('copyright') }}<br />
          {{ t('tel') }}
        </div>
      </div>
    </div>
  </aside>
</template>
