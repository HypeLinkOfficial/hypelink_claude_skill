# 搬家：把客戶現有的網站搬進 HypeLink 官網

客戶說「把我現在的網站（Framer／Wix／WordPress／自架）搬過來」時用這份。
和「拆解參考網站」（`decompose-reference-site.md`）不同：這裡的內容**就是客戶自己的**，文字、圖片、作品、文章都要照原樣搬，只是換成 HypeLink 的區塊與資料。

---

## 0. 順序（不照這個順序會做兩次工）

1. **先建資料，再做頁面**：作品專案（`projects.create`）、專欄文章（`content.articles.create`／WordPress 匯入）、分類先建好。
2. 頁面上的「最新作品」「作品頁」「文章列表」**一開始就用 `hlContent`（或 `windowWorks { source:"projects" }`）讀資料**，不要先寫死作品卡、連回原站，事後再改。
3. 再套範本或拼頁面、填文案、換圖。
4. SEO、檢查、發布。

---

## 1. 讀原站內容

### 用什麼工具讀
| 工具 | 適合 | 不適合 |
|---|---|---|
| **內建瀏覽器（優先）** | 跑 JS 後從 DOM 擷取全文、圖片網址、外部連結、favicon | — |
| Chrome（Claude in Chrome） | 內建瀏覽器不能用時的備案 | 擴充可能離線 |
| WebFetch | 只看大綱、確認有哪些頁 | **不能拿來搬站**：只回摘要不給全文、會濾掉 `<link>`（抓不到 favicon）、抓不到 JS 才渲染的圖 |
| curl | — | 雲端容器常連不到外部網站 |

備案順序：**內建瀏覽器 → Chrome → 請使用者提供檔案**（匯出的 HTML、文字檔、圖片包）。三條都不通就直接跟使用者說，不要用 WebFetch 的摘要硬湊內容。

### 在瀏覽器裡怎麼擷取
- 用 JS 從 DOM 取：每段的標題／內文、`img` 的 `src`（含 `srcset` 最大張）、`a[href]` 外部連結、`link[rel~=icon]`（favicon）。
- **favicon**：`/favicon.ico` 常 404（Framer 尤其），一律從 DOM 的 `link[rel=icon]` 讀。
- **收合內容**（FAQ accordion、分頁 tab）：沒點開的答案不在 DOM 裡，要先逐一模擬點開再讀。做不到時，答案標為「AI 補寫」請使用者確認（見 §5）。
- **數字計數器**：原始碼裡常是 0（捲到才跑動畫），實際數字要問使用者，不要寫 0 也不要自己編。

### Framer 站的特性
- 作品內頁的正文都在「More Works」區之前結束，用它當擷取截止點，避免把其他作品的卡片當正文。
- 圖片網址帶很多 query（`?scale-down-to=…`），**拿掉 query 再去重**，同一張圖只搬一次。

### 圖片
- 一律 `assets.upload { url, transform: { maxWidth: 1600, format: "webp" } }` 轉存到 HypeLink，不要直接引用原站網址（原站下架就破圖）。通常能壓到原本的一成左右。
- 去重後再上傳；上傳回來的網址才填進區塊或作品。

---

## 2. 套範本的陷阱

- `site.apply_template { mode: "replace" }` **不會刪掉舊的 content 頁**。slug 撞名時新頁會變成 `contact-2`。先把舊頁停用（`enabled:false`）或改 slug，再套用；套完檢查 `site.pages.list` 有沒有 `-2` 結尾的 slug。
- 範本的預設值不一定符合需求，套完先逐項確認：
  - `theme.layout.containerWidth`：範本常是 `wide`，原站是滿版的要改 `full`。
  - `menu.fixed`：要不要固定在頂端。
  - Hero 區塊的 `sx.scrollFx: "recede"`（往下捲會縮小後退），不是每個站都要。
  - `sx` 的可用值（`scrollFx`／`imgHover`／`loop`／`shadow`／`blend` 與數值範圍）在 `site.blocks.catalog` 的 `enums.page["section.sx.*"]`，**查了再寫，不要猜**。

---

## 3. 用到的區塊

- 作品列表：`hlContent { source:"projects", filterTabs:true }`（上方分類切換標籤，點了在區塊內即時篩選），或保留工作室風格用 `windowWorks { source:"projects", filterChips:true }`。
- 文章列表：`hlContent { source:"articles", category:"<slug,slug>", filterTabs:true }`；點文章會進官網內的滿版詳細頁 `/site/<專欄頁>/<文章>`。
- 合作夥伴 Logo 列（`logoStrip`）：名稱要問使用者真實客戶名，**不要留「合作夥伴 1」這種佔位字**。

---

## 4. MCP 寫入注意

- `site.pages.update` 的 `sections` 是**整組取代**：只改一個區塊也要先 `site.pages.get` 取回全部、改那一個、整組寫回。一頁區塊很多時，改完用回傳結果比對區塊數有沒有少。
- `projects.create` 目前不能指定 slug，網址由標題自動產生（中文標題會變成 `project-xxxx` 這類）。需要漂亮網址時先告訴使用者，之後可在後台改。
- 寫中文內容**直接用中文字元**，不要用 `\uXXXX` 跳脫——跳脫打錯一碼就會變成錯字（例：「狀牛盾」「嗜應」「痊加」）。寫完從 API 回傳的內容抽查確認。

---

## 5. 回報給使用者

- 原文照搬的部分不用特別說明；**AI 補寫的內容要逐條標出來**請使用者確認：FAQ 答案、作品擴充描述、問不到的數字、自己寫的 SEO 描述。
- 列出沒搬到的東西（讀不到的頁、破圖、需要使用者提供的資料），不要默默略過。
- 給草稿預覽連結，確認後再 `site.publish`。
