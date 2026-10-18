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
- **數字計數器**：原始碼裡常是 0（捲到才跑動畫），要在瀏覽器裡**捲到那段、等動畫跑完**再讀（例：95%）；讀不到才問使用者，不要寫 0 也不要自己編。
- **延遲載入的圖**（Framer 作品封面常這樣）：網頁抓取工具看不到，要在瀏覽器裡捲過整頁讓圖載入後再讀 `img`。
- **Framer 預設佔位圖**：原站常留著範本的佔位圖（Framer 範例照片）。擷取後主動列給使用者看，問要不要換，不要默默搬過來。
- **嵌在網頁裡的 Logo**（inline SVG、CSS 背景、canvas）常抓不下來，直接跟使用者要原始檔。
- **favicon** 選 `link[rel=apple-touch-icon]`（180px）那張，不要用 32／64px 的小圖。

### Menu 與載入畫面（一定要看，不要只看內容）
用新的無痕視窗打開原站（沒有快取、沒有 sessionStorage），**前 2 秒每 0.3 秒截一張圖**，再往下捲兩屏，記下：

| 看什麼 | 怎麼判斷 | 對到 HypeLink |
|---|---|---|
| Menu 是否固定 | 往下捲後 Menu 還在畫面頂端？用 `getComputedStyle(header).position` 看是 `fixed`／`sticky` 還是會捲走 | `menu.fixed: true／false` |
| 首屏是否透明疊在大圖上 | 頂端時 Menu 沒有底色、捲動後才出現底色 | `menu.overlay: true`＋`overlayText: light／dark` |
| 往下捲會不會收起 | 往下捲消失、往上捲出現 | `menu.hideOnScroll: true` |
| 桌機是不是只有漢堡鈕 | 桌機寬度也看不到連結列 | `menu.alwaysMobile: true`＋`burgerStyle: "lines"`＋`mobileMenu.preset: "stage"`（全螢幕大字選單） |
| 連結 hover | 文字上下翻轉、右上小編號 | `menu.linkHover: "roll"`、`menu.linkNumbers: true` |
| 有沒有進站載入畫面 | 第一張截圖是不是蓋滿畫面的色幕／字標／數字 | 見下一列 |
| 載入畫面長怎樣 | 色幕顏色、上面的字（品牌名／標語）、有沒有 0→100 計數、怎麼離場（往上掀／左右對開／淡出／圓形收合）、大約幾秒 | 整站一次：`site.update { theme:{ motion:{ enter:"wordmark", wordmarkText, wordmarkBg } } }`（黑幕巨字逐字升起後上掀）；單頁：`theme.intro.style` = `curtain`（色幕上掀）／`counter`（計數）／`wordmark`（字從模糊浮現）／`lift`（巨字升起後帶弧上掀）／`split`（上下對開）／`stairs`（直欄依序收）／`iris`（圓形收合）／`type`（打字）／`logo`（字首圓標）。只是轉圈等待的話用 `theme.loading { style: spinner／logo／text／dots }` |

原站沒有載入畫面就不要加；有的話顏色、文字、節奏照原站。這些都要寫進回報，讓使用者確認。

### Framer 站的特性
- 作品內頁的正文都在「More Works」區之前結束，用它當擷取截止點，避免把其他作品的卡片當正文。
- 圖片網址帶很多 query（`?scale-down-to=…`），**拿掉 query 再去重**，同一張圖只搬一次。

### 圖片
- 一律 `assets.upload { url, transform: { maxWidth: 1600, format: "webp" } }` 轉存到 HypeLink，不要直接引用原站網址（原站下架就破圖）。通常能壓到原本的一成左右。
- 去重後再上傳；上傳回來的網址才填進區塊或作品。
- **SVG（圖示、Logo、插畫）**：直接上傳、**不要帶 transform**，保持向量（2026-10-19 起上傳的 SVG 網址會帶 `.svg`，官網會略過圖片壓縮、不會破圖）。之前上傳、網址沒有 `.svg` 的 SVG 在官網會破圖，要重新上傳。不要轉 PNG：轉檔照 SVG 原尺寸輸出（常只有 200–300px）而且不能放大，會糊。

### 影片
- `assets.upload` 只收圖片，影片不能轉存。**不要長期連原站的影片網址**（原站關掉就失效）：先請使用者提供可長期使用的網址（YouTube、Vimeo、自己的空間），或請他在後台區塊裡自己上傳；暫時沿用原站網址時，要在回報裡列為待辦。

---

## 2. 套範本的陷阱

- `site.apply_template { mode: "replace" }` **不會刪掉舊的 content 頁**。slug 撞名時新頁會變成 `contact-2`；名稱不同但功能重複的也會兩組並存（例：原本的 `works` 作品內容頁＋範本的 `projects`）。
- **合併重複頁的規則**：
  1. 套用前先 `site.pages.list`，記下現有的內容頁（作品、專欄、聯絡…）。
  2. 同一種功能只留一頁：**保留接後台資料的 content 頁**（作品專案、專欄、聯絡），範本帶來的同功能 builder 頁把有用的區塊搬過去後停用（`enabled:false`）。
  3. 網址照原站：保留下來那頁的 slug 改成原站用的（例：原站是 `/works` 就用 `works`）；被停用的那頁先改成別的 slug（例：`old-contact`），讓出網址。
  4. 套完再 `site.pages.list` 一次：不能有 `-2` 結尾的 slug、Menu 裡不能有兩個同名項目、站內連結（`/site/<slug>`）都指到留下的那頁。
- 範本的預設值不一定符合需求，套完先逐項確認：
  - `theme.layout.containerWidth`：範本常是 `wide`，原站是滿版的要改 `full`。
  - `menu.fixed`：要不要固定在頂端。
  - Hero 區塊的 `sx.scrollFx: "recede"`（往下捲會縮小後退），不是每個站都要。
  - `sx` 的可用值（`scrollFx`／`imgHover`／`loop`／`shadow`／`blend` 與數值範圍）在 `site.blocks.catalog` 的 `enums.page["section.sx.*"]`，**查了再寫，不要猜**。

---

## 3. 用到的區塊

- **作品數量**：`windowWorks` 手填最多 24 件、讀作品專案最多 24 件；`hlContent` 最多 48 件。作品超過 48 件，就用「作品專案」內容頁（有分頁或載入更多）放全部，首頁只放 6–12 件精選。作品詳細頁網址是 `/site/<作品頁 slug>/<作品 slug>`（作品頁 slug 是 `projects` 時就是 `/site/projects/<slug>`）。
- **Logo 列欄位**：官網 `logoStrip` 的項目是 `{ name, imageUrl }`（`imageUrl` 放 Logo 圖，沒有圖才顯示 `name` 文字）；品牌頁模組 `logo-wall` 的 `logos` 是 `[{ imageUrl, name, url }]`（`url` 選填，點 Logo 開的網址）。

- 作品列表：`hlContent { source:"projects", filterTabs:true }`（上方分類切換標籤，點了在區塊內即時篩選），或保留工作室風格用 `windowWorks { source:"projects", filterChips:true }`。
- 文章列表：`hlContent { source:"articles", category:"<slug,slug>", filterTabs:true }`；點文章會進官網內的滿版詳細頁 `/site/<專欄頁>/<文章>`。
- 合作夥伴 Logo 列（`logoStrip`）：名稱要問使用者真實客戶名，**不要留「合作夥伴 1」這種佔位字**。

---

## 4. MCP 寫入注意

- `site.pages.update` 的 `sections` 是**整組取代**：只改一個區塊也要先 `site.pages.get` 取回全部、改那一個、整組寫回。一頁區塊很多時，改完用回傳結果比對區塊數有沒有少。
- `projects.create` 目前不能指定 slug，網址由標題自動產生（中文標題會變成 `project-xxxx`、`vr`、`2020` 這類），和原站網址對不上。先告訴使用者，請他在後台改成原站的網址。
- `projects.list` 作品多時回傳會超過上限：分批讀（用分類或狀態篩選），不要一次全取。

## 4.5 品牌頁（/@id 首頁）一起搬時

- 內容一律放進**系統預設的「連結」分頁**（每個品牌都有一個；先 `folders.list` 找它的 id，不同品牌 id 不同）。不要新開分頁——新開會多出一個空的「連結」分頁排在前面。`folders.list` 被權限擋住讀不到時，停下來請使用者在後台確認，不要自己猜 id。
- 品牌頁改完，公開頁有幾分鐘快取，看不到變化先等一下再看。

## 4.6 法律頁（隱私權政策、服務條款）

沒有現成範本，固定這樣做：
1. 問使用者有沒有原站的條款全文；有就照搬，沒有就用 `richtext` 區塊寫一份基本版，並在回報裡標「AI 撰寫，需法務確認」。
2. 各開一頁：`privacy`（隱私權政策）、`terms`（服務條款），`showInMenu:false`。
3. 頁尾連結欄加這兩頁（`/site/privacy`、`/site/terms`）；表單旁的同意文字也連過去。
4. 每頁開頭寫「最後更新日期」，`seo.description` 一句話說明這頁是什麼。
- 寫中文內容**直接用中文字元**，不要用 `\uXXXX` 跳脫——跳脫打錯一碼就會變成錯字（例：「狀牛盾」「嗜應」「痊加」）。寫完從 API 回傳的內容抽查確認。

---

## 5. 回報給使用者

- 原文照搬的部分不用特別說明；**AI 補寫的內容要逐條標出來**請使用者確認：FAQ 答案、作品擴充描述、問不到的數字、自己寫的 SEO 描述。
- 列出沒搬到的東西（讀不到的頁、破圖、需要使用者提供的資料），不要默默略過。
- 給草稿預覽連結。**發布預設請使用者自己按**（後台「品牌官網」右上角「更新發布」）：`site.publish` 常被權限檢查擋下，不要反覆重試；使用者明確要你發布、而且工具可用時才呼叫。
- 回報裡另外列出：Menu 是否固定／透明、有沒有載入畫面與它的樣式（見 §1），以及你在 HypeLink 怎麼設定的。
