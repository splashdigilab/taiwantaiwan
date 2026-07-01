// Helpers for working with the multilingual content returned by the API.
export type Localized<T = string> = { zh: T; en: T; jp: T }

export function useLocalized() {
  const { locale } = useI18n()

  // Pick the field for the active locale (falls back to Chinese).
  function pick<T>(obj: Localized<T> | undefined | null): T | undefined {
    if (!obj) return undefined
    return (obj as any)[locale.value] ?? obj.zh
  }

  function price(n: number): string {
    const num = Number(n).toLocaleString('en-US')
    return locale.value === 'zh' ? `NT$ ${num}元` : `NT$ ${num}`
  }

  return { locale, pick, price }
}
