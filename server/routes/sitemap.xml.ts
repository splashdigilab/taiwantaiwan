// Multilingual XML sitemap with hreflang alternates.
// Generated on the fly from the same data the site renders, so it never
// drifts from the actual product catalogue.

const LOCALES = [
  { code: 'zh', prefix: '', hreflang: 'zh-TW' },
  { code: 'en', prefix: '/en', hreflang: 'en-US' },
  { code: 'jp', prefix: '/jp', hreflang: 'ja-JP' },
]

export default defineEventHandler((event) => {
  const { public: { siteUrl } } = useRuntimeConfig(event)
  const base = siteUrl.replace(/\/$/, '')

  // Locale-agnostic route paths (empty string = home).
  const paths = ['', '/about', '/products', '/retailers']
  for (const p of getProducts()) paths.push(`/products/${p.id}`)

  const urls = paths.map((path) => {
    // hreflang alternates shared by every locale variant of this path.
    const alternates = LOCALES.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${base}${l.prefix}${path}" />`,
    )
    alternates.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${path}" />`,
    )

    return LOCALES.map(
      (l) => `  <url>
    <loc>${base}${l.prefix}${path}</loc>
${alternates.join('\n')}
  </url>`,
    ).join('\n')
  })

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})
