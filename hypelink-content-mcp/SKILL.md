---
name: hypelink-content-mcp
description: 透過 HypeLink MCP server 經營品牌的寫作專欄（content）——文章 CRUD／發佈、分類（兩層）管理，以及 WordPress 文章批次匯入（圖片 re-host、分類自動建立、冪等更新）。當使用者要用 Claude 經 /mcp 寫文章、整理分類，或「把 WordPress 的文章搬到 HypeLink」時使用。
---

# Skill：HypeLink 寫作專欄 MCP 操作

透過 **HypeLink MCP server** 經營一個品牌的**寫作專欄（content）**：
文章建立／更新／發佈／刪除、分類管理，以及 **WordPress 文章匯入**。

## 何時使用

- 「幫我發一篇專欄：標題《…》，內容如下…」
- 「把這篇文章改成草稿／排進『旅行筆記』分類」
- 「建立分類：設計 › UI、設計 › UX」
- 「把我 WordPress 的文章全部匯入 HypeLink，圖片也搬過來」
- 「幫這篇產生 SEO 標題與 meta 描述」（SEO 欄位可直接寫入；AI 生成在後台編輯器扣 SP）

## 重要前提與邊界

- 操作對象是「已存在的品牌」底下的專欄；token 綁定該品牌（不需自帶 hypeId）。
- Server：`POST https://api.hypelink.app/mcp`，`Authorization: Bearer hl_pat_<token>`。
- Token 在 dashboard `/dashboard/brands/[hypeId]/settings/api-tokens` 產生；需含 **`content:read` / `content:write`** scope。
- 公開頁：專欄總覽 `/{hypeId}/articles`、單篇 `/{hypeId}/articles/{uuid}`（每個工具回傳 `publicPath`）。
- **付費／會員限定文章的定價與金流、AI 生成（扣 SP）、留言管理、邀稿協作者**仍在 dashboard 操作；MCP 只設定 `accessMode`。
- 所有工具都走 `inputSchema` **嚴格驗證**：多傳不存在的欄位會回 `VALIDATION_FAILED` 並列出可用欄位，依錯誤訊息修正即可。

## Scope

| Scope | 可做的事 |
|---|---|
| `content:read` | `content.articles.list / get`、`content.categories.list` |
| `content:write` | `content.articles.create / update / publish / delete / import_wordpress`、`content.categories.create / update / delete` |

寫入工具多支援 `dry_run: true`；`*.delete` 為兩階段確認（先拿 `confirmToken` 再帶回）。

## 工具表

### 文章（`content.articles.*`）

| Tool | Scope | 必填 / 說明 |
|---|---|---|
| `content.articles.list` | read | `{ status?: all\|draft\|published, categorySlug?, categoryUuid?, sourceId?, q?, limit? }` 回 uuid / title / slug / status / publishedAt / accessMode / tags / categories[] / sourceId / viewCount / likeCount / commentCount（不含 body） |
| `content.articles.get` | read | `{ uuid }` 完整內容（body HTML、SEO 欄位、分類、來源） |
| `content.articles.create` | write | `{ title, body?(HTML), subtitle?, summary?, coverUrl?, tags?[], slug?, seoTitle?, seoDescription?, focusKeyword?, publishedAt?(ISO，可過去日期), status?: draft\|published, accessMode?: public\|paid\|member, externalUrl?, sourceUrl?, sourceId?, categoryIds?\|categorySlugs?\|categoryNames? }`。帶 `sourceId` 時**冪等**：同 sourceId 已存在 → 改為更新並回 `action: "update"` |
| `content.articles.update` | write | `{ uuid, ...同上任一欄位 }` 部分更新；`null` 清空 |
| `content.articles.publish` | write | `{ uuid, status?: published\|draft, publishedAt? }` 發佈／下架 |
| `content.articles.delete` | write | `{ uuid, confirmToken? }` 軟刪除，兩階段確認 |
| `content.articles.import_wordpress` | write | `{ posts: WpPost[] (≤50), rehostImages?=true, updateExisting?=true, keepDraft?=false, baseUrl?, categoryParents?: {子分類名: 父分類名}, dateFrom?/dateTo?(YYYY-MM-DD 台灣時區), dry_run? }` 見下節 |

`slug` 規則：小寫英數連字號；未填由標題轉（中文標題轉不出來會是 null，公開網址仍用 uuid）；同品牌撞名自動加 `-2`。

### 分類（`content.categories.*`）

| Tool | Scope | 必填 / 說明 |
|---|---|---|
| `content.categories.list` | read | 回 id / uuid / name / slug / parentUuid / icon / thumbnailUrl / count（文章數，含草稿）；父在前、子依序接在父後 |
| `content.categories.create` | write | `{ name, slug?, parentSlug?\|parentUuid?, icon?(emoji 或 lucide:Star), thumbnailUrl?, description? }`；最多兩層；中文名稱請自行帶英數 slug |
| `content.categories.update` | write | `{ uuid, name?, slug?, parentSlug?\|parentUuid?(null＝改頂層), icon?, thumbnailUrl?, description?, sortOrder? }` |
| `content.categories.delete` | write | `{ uuid, confirmToken? }` 文章不刪、子分類升為頂層 |

文章歸類：`content.articles.create/update` 帶 `categoryNames`（名稱）或 `categorySlugs`（不存在**自動建立**）或 `categoryIds`，整組取代。

## WordPress 匯入工作流程

目標：把 WordPress 的文章**順利匯入**且**可重複執行**（冪等）。

### 1. 取得文章資料（二選一）

**A. WP REST API**（站台開放 REST 時最省事）

```
GET https://<wp-site>/wp-json/wp/v2/posts?_embed&per_page=100&page=1&status=publish
```

- 逐頁抓到 `X-WP-TotalPages`；每篇轉成下面的 `WpPost`：
  - `wpId` ← `id`、`title` ← `title.rendered`（去 HTML entity）、`slug` ← `slug`
  - `html` ← `content.rendered`、`excerpt` ← `excerpt.rendered`（去標籤）
  - `date` ← `date_gmt`（ISO）、`status` ← `status`（`publish` → 已發佈）
  - `categories` ← `_embedded["wp:term"][0][].name`、`tags` ← `_embedded["wp:term"][1][].name`
  - 分類階層另抓 `GET /wp-json/wp/v2/categories?per_page=100`（`id / name / parent`），組成 `categoryParents: { 子名: 父名 }`（parent=0 的略過）
  - `featuredImageUrl` ← `_embedded["wp:featuredmedia"][0].source_url`
  - `author` ← `_embedded.author[0].name`、`sourceUrl` ← `link`

**B. WXR 匯出檔（WordPress 後台 › 工具 › 匯出 › 文章）**

- 直接在 dashboard「寫作專欄 › WordPress 匯入」上傳 .xml 最快（同一套匯入核心、含預覽）。
- 若要在 MCP 端處理：解析 `<item>` 中 `wp:post_type=post` 的項目——`title`、`wp:post_name`(slug)、`content:encoded`(html)、`excerpt:encoded`、`wp:post_date_gmt`、`wp:status`、`<category domain="category">` / `domain="post_tag"`、`wp:post_id`、`link`；精選圖片由 `wp:postmeta _thumbnail_id` 對應 `post_type=attachment` 的 `wp:attachment_url`（找不到就取內文第一張圖）。分類階層在 **channel 層**的 `<wp:category>`：`wp:cat_name`（名）、`wp:category_nicename`（slug）、`wp:category_parent`（父的 nicename，空＝頂層）——轉成 `categoryParents: { 子名: 父名 }` 一併帶入。

### 2. 分批呼叫 `content.articles.import_wordpress`

```json
{
  "dry_run": true,
  "rehostImages": true,
  "baseUrl": "https://old-site.example.com",
  "categoryParents": { "日本": "旅行" },
  "posts": [
    {
      "wpId": 123,
      "title": "我的第一篇",
      "slug": "my-first-post",
      "html": "<!-- wp:paragraph --><p>內文…</p><!-- /wp:paragraph -->",
      "excerpt": "摘要",
      "date": "2023-05-01T08:00:00Z",
      "categories": ["旅行", "日本"],
      "tags": ["東京"],
      "featuredImageUrl": "https://old-site.example.com/wp-content/uploads/cover.jpg",
      "status": "publish",
      "sourceUrl": "https://old-site.example.com/my-first-post/"
    }
  ]
}
```

- **每批 ≤ 50 篇**；先 `dry_run: true` 看 `inserted / updated / skipped / newCategories / imagesToRehost`，再正式跑。
- **冪等**：以 `wpId`（存成 `sourceId`）比對；重跑同一批只會 `updated`，不會重建。`updateExisting: false` 則略過已存在者。
- **圖片 re-host**：`rehostImages: true` 會把內文 `<img src>` 與精選圖片下載到 HypeLink（R2）並改寫 src；失敗的保留原網址並計入 `imagesFailed`。外站圖片若擋 UA / 私網位址會失敗。
- **自動轉換**：移除 `<!-- wp:* -->` 區塊註解；`[caption]` → `<figure><figcaption>`；`[gallery]` 移除；`[embed]` 與單獨一行的 YouTube / Vimeo 網址 → `<iframe>`；其餘 shortcode 移除；`wp-block-*` class 清掉；相對 `src/href` 依 `baseUrl` 補成絕對。
- **分類**：名稱不存在自動建立。帶 `categoryParents`（子名→父名）會**連父層一起建立兩層階層**（WP 超過兩層攤平到最頂層祖先之下；既有同名分類不搬動）；不帶則建成頂層平面分類。dry_run 的 `newCategories` 含會新建的父分類。
- **期間篩選**：`dateFrom` / `dateTo`（YYYY-MM-DD，台灣時區日界）只匯入該期間發布的文章；沒有日期的排除，篩掉的篇數回在 `excludedByDate`。
- **發布時間**：`date` 直接寫入 `publishedAt`，保留原發布日；`keepDraft: true` 則全部匯成草稿。

### 3. 驗證

- `content.articles.list { sourceId: "<wpId>" }` 確認該篇存在、`slug` 與 `categories` 正確。
- `content.articles.get { uuid }` 檢查 body 裡沒有 `<!-- wp:`、圖片 src 已是 HypeLink 網址。
- 開 `publicPath` 看公開頁；分類標籤會出現在單篇頁與總覽頁的篩選 chips。

## 推薦工作流程

1. `content.categories.list` → 看現有分類；需要階層先建父分類。
2. 新文章：`content.articles.create { ..., status: "draft" }` → 使用者確認 → `content.articles.publish`。
3. 大量搬家：WP REST 或 WXR → 轉 `WpPost[]` → `import_wordpress` 分批（先 dry_run）→ 驗證 → 需要再跑一次（冪等）。

## 安全規則（務必遵守）

- 刪除文章／分類前先把 `willDelete` 摘要講給使用者聽，再帶 `confirmToken` 執行。
- 不要替使用者決定付費／會員限定的價格；`accessMode` 改成 `paid`/`member` 後請提醒到 dashboard 設定價格或等級。
- 匯入前先 `dry_run` 並回報「將新增／更新幾篇、會建立哪些分類、要下載幾張圖」。

## 常見錯誤碼

| code | 原因 | 處理 |
|---|---|---|
| `VALIDATION_FAILED` | 欄位名錯、型別錯、超過上限（例：posts > 50） | 依訊息修正 |
| `SCOPE_DENIED` | token 缺 `content:*` | 重新產生 token 勾選 scope |
| `NOT_FOUND` | uuid 不存在或不屬此品牌 | 先 `list` 取正確 uuid |
| `CONFIRM_REQUIRED` / `CONFIRM_INVALID` | 刪除未帶或帶錯 `confirmToken` | 先呼叫一次拿 token，10 分鐘內再呼叫 |

## 與 dashboard 的關係

- dashboard「寫作專欄」：文章列表（表格，可依分類篩選）、編輯器（分類多選、AIOSEO 評分與 AI 生成）、**分類設定**、**設定**（留言開關）、**WordPress 匯入**（上傳 WXR）。
- MCP 與 dashboard 共用同一套匯入核心與資料表；兩邊匯入同一份 WordPress 資料不會重複建立。
