// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n'],

  // Global SCSS (architecture lives in /scss)
  css: ['~~/scss/main.scss'],

  app: {
    head: {
      htmlAttrs: { lang: 'zh-Hant' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'keywords', content: '美麗寶島台灣,Akibo,taiwan' },
      ],
      link: [{ rel: 'shortcut icon', href: '/images/favicon.ico' }],
    },
  },

  i18n: {
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'zh', language: 'zh-TW', name: '中文', file: 'zh.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'jp', language: 'ja-JP', name: '日本語', file: 'jp.json' },
    ],
  },
})
