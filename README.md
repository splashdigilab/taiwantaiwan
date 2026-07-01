# 美麗寶島台灣 TAIWAN TAIWAN

藝術家 李明道 Akibo Lee 的「美麗寶島台灣」品牌官網，以 **Nuxt 4** 重新打造的現代化網站架構。
原始靜態網站（`public_html`）已重構為元件化、資料驅動、支援多國語系的單頁應用程式（SSR / 可靜態輸出）。

線上原站：<https://www.taiwantaiwan.net/index.html>

---

## 技術架構

| 項目 | 採用 |
| --- | --- |
| 框架 | Nuxt 4（Vue 3、Nitro server） |
| 多國語系 | `@nuxtjs/i18n`（中文 `zh` / English `en` / 日本語 `jp`） |
| 樣式 | **SCSS**，全部集中在 [`/scss`](./scss) 資料夾 |
| 資料層 | JSON 檔 + Nitro Server API（方便日後改接真正後端） |
| 圖片 | 全數歸檔於 [`/public/images`](./public/images) |

---

## 目錄結構

```
taiwantaiwan/
├─ app/
│  ├─ app.vue                 # 進入點：<NuxtLayout> + <NuxtPage>
│  ├─ layouts/default.vue     # 固定左側選單 + 主內容
│  ├─ components/
│  │  ├─ AppSidebar.vue       # logo / 導覽 / 語言切換 / 社群（含手機漢堡選單）
│  │  ├─ AppSlideshow.vue     # 首頁與品牌故事的全螢幕背景輪播
│  │  └─ ProductGallery.vue   # 製品圖庫 + 燈箱（取代舊版 fancybox）
│  ├─ composables/
│  │  └─ useLocalized.ts      # 依目前語系取值 pick() 與價格格式 price()
│  └─ pages/
│     ├─ index.vue            # 首頁（人物背景輪播）
│     ├─ about.vue            # 品牌故事
│     ├─ retailers.vue        # 零售商
│     └─ products/
│        ├─ index.vue         # 製品總覽（5 欄格狀）
│        └─ [id].vue          # 製品詳情（圖庫 + 顏色切換 + 燈箱）
├─ server/
│  ├─ data/                   # ← 內容資料來源（JSON）
│  │  ├─ products.json        # 10 件製品（多語名稱/規格/說明/顏色/型號）
│  │  ├─ home.json            # 首頁輪播人物與背景
│  │  ├─ about.json           # 品牌故事文案
│  │  └─ retailers.json       # 18 間零售商
│  ├─ utils/db.ts             # ★ 資料存取層（唯一的「換後端」切換點）
│  └─ api/                    # REST API：/api/products、/api/home … 等
├─ i18n/locales/              # 介面字串 zh.json / en.json / jp.json
├─ scss/                      # 全站樣式（_variables、_base、_layout、_home …）
└─ public/images/             # 製品照、背景、logo、簽名等圖檔
```

---

## 資料層 — 為日後接後端而設計

頁面不直接讀 JSON，而是透過 Nitro API 取得資料：

```
前端頁面  →  useFetch('/api/products')  →  server/api/*  →  server/utils/db.ts  →  server/data/*.json
```

**要改接真正的後端（資料庫 / 外部 API）時，只需改寫 [`server/utils/db.ts`](./server/utils/db.ts) 內各函式的實作**，
API 路由與前端頁面完全不用動，回傳的資料格式維持一致即可。

### 內容多語格式

文字欄位皆為 `{ zh, en, jp }` 物件，前端以 `useLocalized()` 的 `pick()` 依目前語系取值：

```jsonc
// server/data/products.json（節錄）
{
  "id": "pro1",
  "code": "0309001",
  "price": 1680,
  "dimensions": { "zh": "34X26X9.5cm", "en": "34X26X9.5cm", "jp": "34X26X9.5cm" },
  "name": { "zh": "美麗寶島台灣LOGO書包", "en": "Beautiful Formosa Taiwan LOGO Bag", "jp": "美麗宝島台湾ロゴカバン" },
  "description": { "zh": ["棉質帆布傳統書包", "…"], "en": ["…"], "jp": ["…"] },
  "colors": [
    { "key": "r", "code": "0309001R", "images": 7 },
    { "key": "g", "code": "0309001G", "images": 7 }
  ]
}
```

### 製品圖片命名規則

```
public/images/pro{N}/{color}/{color}{N}_{size}{index}.jpg
  size: s=縮圖 / m=主圖 / l=燈箱大圖     color: r 紅 / g 綠 / b 藍 / k 黑
例：public/images/pro1/r/r1_m1.jpg
```

---

## 常用指令

```bash
npm install        # 安裝相依套件
npm run dev        # 開發伺服器 http://localhost:3000
npm run build      # production 建置（Node 伺服器：node .output/server/index.mjs）
npm run preview    # 本機預覽 production 建置
npm run generate   # 輸出純靜態網站（.output/public，可直接丟靜態主機）
```

---

## 新增 / 修改內容

- **改製品**：編輯 `server/data/products.json`，把對應圖片放進 `public/images/proN/`。
- **改零售商 / 品牌故事 / 首頁輪播**：分別編輯 `server/data/` 內對應 JSON。
- **改介面字串（選單、按鈕等）**：編輯 `i18n/locales/*.json`。
- **改樣式**：編輯 `scss/` 內的對應 partial。

> 備註：`public/images` 約 130MB，若要納入 git 版控建議搭配 [Git LFS](https://git-lfs.com/)。
