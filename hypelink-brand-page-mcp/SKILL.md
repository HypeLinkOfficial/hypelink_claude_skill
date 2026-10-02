---
name: hypelink-brand-page-mcp
description: 透過 HypeLink MCP server 製作 / 編輯品牌頁（首頁資訊：profile、folders、links、page modules、socials，設計主題 design/theme，以及 Webhook 出站事件管理 webhooks — Max 方案）。當使用者要用 Claude 經 /mcp 操作某個既有品牌的公開頁內容、外觀或 Webhook 時使用。
---

# Skill：HypeLink 品牌頁 MCP 操作

透過 **HypeLink MCP server** 製作與維護一個品牌的**公開頁內容與外觀**：
首頁資訊（profile / folders / links / page modules / socials）＋ 設計主題（design / theme）＋ **品牌官網（site：頁面、範本、頁尾、發佈）**。

## 何時使用

- 「幫我把 IG / 官網連結加進品牌頁」
- 「新增一個『關於我們』分頁放在第一個位置，並放一段公司簡介」
- 「把首頁 bio 改成更專業的口吻」
- 「找出所有 dead link 並刪除」
- 「把品牌頁套成深色主題 / 換主題色」
- 「依『公司品牌』樣板把空品牌頁一次填好」
- 「幫我的官網套一個深色的作品集範本，然後把文案改成我的」
- 「官網多一頁『定價』，用 Lumina 範本的定價頁」
- 「頁尾換成跑馬燈版型，放巡演日期」

## 重要前提與邊界

- **MCP 操作的是「已存在的品牌」**。建立品牌實體本身（hypelink shell）走 dashboard / onboarding，**MCP 沒有 `hypelinks.create`**。先確認品牌已存在、且使用者已產生 token。
- **一個 token 綁定一個 brand**：server 由 token 解析 `hypeId`，呼叫工具時**不需**自己帶 hypeId。
- Server 端點：`POST https://api.hypelink.app/mcp`，`Authorization: Bearer hl_pat_<token>`（HTTP transport，MCP 2025-03-26）。
- Token 在 dashboard `/dashboard/brands/[hypeId]/settings/api-tokens` 產生；scope 不足會回 `SCOPE_DENIED`。

## Scope

- `homeinfo:read` → 可讀（profile / folders / links / modules / socials / design / themes / webhooks）
- `homeinfo:write` → 才能寫（含 webhooks；Webhook 建立 / 啟用 / test 另需 **Max 方案**）
- 寫入類工具大多支援 `dry_run: true`（回傳 changes 不執行）；`*.delete` 走兩階段 `confirmToken`。

## 可用工具

### 開場（先讀）
| Tool | Scope | 說明 |
|---|---|---|
| `homeinfo.get_overview` | read | **對話開場第一支**：一次取回 profile + folders + module 計數 + socials 計數 |
| `homeinfo.pulse_todos` | read | 待處理清單：過期倒數／限時、空的系統模組、沒看的留言／提問、超過 2 天沒跟進的留單、太久沒更新；每項附 `link` |
| `homeinfo.module_activity` | read | 互動模組（留言板／Q&A／投票／快速 Pitch／洽詢／社交）自上次查看的新動態與最新 5 筆；`{ markSeen: "<實例id>" \| "all" }` 標已讀 |
| `homeinfo.weekly_report` | read | 每週成效：不帶參數＝本週預覽；`{ week: "YYYY-MM-DD" }`＝已寄出那週；`{ list: true }`＝歷史列表 |

> 使用者問「我的品牌頁最近怎樣」「有什麼要處理」「這週成效」時，先打 `pulse_todos` 與 `weekly_report`，把行動整理成待辦給他，並附 dashboard 連結。

### Profile（品牌基本資料）
| Tool | Scope | 說明 |
|---|---|---|
| `profile.get` | read | 完整 profile |
| `profile.update` | write | `name / description / mail / isPublic / publicEnabled / stickyNote / prefer3dFirst / seoTitle / seoDescription / socialOgImageUrl / hideFooterBranding` 等任意子集 |
| `profile.set_image` | write | 設定 avatar / socialOgImage / brandLogo / footerLogo / favicon（瀏覽器分頁圖示，正方形 PNG/SVG；未設定時公開頁退回大頭貼）：`{ target, url }`（公開圖片 URL，後端 re-host）或 `{ target, assetId }`（`assets.upload` 取得） |
| `profile.discovery_tags` | read | 品牌探索可用的內建標籤清單（slug / label / group） |
| `profile.set_discovery` | write | 品牌探索設定：`{ enabled?, tags? }`，tags 最多 10 個，內建 slug（creator / food / travel…）或自訂 `#關鍵字`；省略 tags 保留既有 |

### Projects（作品專案，品牌內容 → 作品專案；公開頁 `/@id/projects`）
| Tool | Scope | 說明 |
|---|---|---|
| `projects.list` | read | 含草稿；可 `status` / `categoryUuid`（`"none"`＝未分類）過濾。回 uuid / slug / status / coverUrl / tags / category{uuid,name,slug} / blockCount（不含全文） |
| `projects.get` | read | `{ uuid }` 完整內容（description、blocks） |
| `projects.create` | write | `{ title, summary?, description?, coverUrl? | coverAssetId?, status?: draft|published, projectDate?, client?, team?: [{role,name}], tags?, category? | categoryUuid?, blocks?, sortOrder? }`；預設 draft，slug 由標題自動產生 |
| `projects.update` | write | 部分更新；`blocks` 為整組取代；改 title 會重算 slug；`category: null` 或 `categoryUuid: null` 取消分類 |
| `projects.set_category` | write | **批次指派分類**：`{ uuids:[…≤200], categoryUuids | categories | categoryUuid | category, mode?: set|add|remove }`（set＝整組取代、add 加入、remove 拿掉；清除全部＝`set`＋`categoryUuids: []`）。整批分類用這支，不要打 N 次 update |
| `projects.reorder` | write | `{ orderedUuids }`，未列入的排後面 |
| `projects.delete` | write | 硬刪除，兩階段確認 |
| `projects.categories.list` | read | 分類清單（品牌自訂、依排序）：uuid / name / slug / count |
| `projects.categories.create` | write | `{ name }`（同品牌唯一，最多 30 個）；slug 自動產生 |
| `projects.categories.update` | write | `{ uuid, name }` 改名（slug 重算） |
| `projects.categories.delete` | write | 刪分類，所屬專案變未分類；兩階段確認 |
| `projects.categories.reorder` | write | `{ orderedUuids }` |

> `blocks` 依序渲染：`{ type:'image', url | assetId, caption? }`、`{ type:'video', embedUrl }`（YouTube / Vimeo）、`{ type:'audio', url }`、`{ type:'text', text }`。
> **分類（category）是獨立欄位，不是 tags，且一件作品可屬於多個分類**：`projects.create / update` 收 `categoryUuids: string[]` 或 `categories: string[]`（名稱，不存在自動建立；第一個是主分類），舊的單一 `categoryUuid` / `category` 仍可用；回傳 `categories[]`（`category` 為主分類）。多筆一次用 `projects.set_category`。若 client 的工具清單裡看不到這些參數，是連接器快取了舊的 tools/list，請在 claude.ai 連接器設定移除後重新加入（或重新整理工具）。
> **分類 vs 標籤**：`category` 是品牌事先定義的固定清單（一件作品一個分類），公開頁 `/@id/projects` 上方有分類篩選列（`?category=slug`）；`tags` 是自由關鍵字，只顯示在卡片上。幫使用者整理作品集時先建分類（`projects.categories.create`）再指派，或在 `projects.create` 直接給 `category` 名稱自動建立。
> 展示：分頁放 `modules.add { slug:'projects-list' }`（作品專案（自動同步））即可自動列出已發布作品；`data.category` 填分類 slug 可只列該分類。不要再用手動的 portfolio-gallery / album-wall 重複貼同一批圖。
> 批次匯入作品的流程：每件先 `assets.upload` 取 assetId（封面與內容圖），再 `projects.create` 帶 `coverAssetId` 與 `blocks[].assetId`，最後 `projects.reorder` 排序。

### Assets（圖片上傳）
| Tool | Scope | 說明 |
|---|---|---|
| `assets.upload` | write | 把圖片上傳到品牌 R2，回 `{ assetId, url }`。來源二選一：`data`（base64，可含 `data:image/png;base64,` 前綴，≤ 8MB）或 `url`（公開網址，≤ 10MB）。支援 png / jpeg / gif / webp / svg / avif，後端以檔頭驗證。拿到的 `assetId` 給 `links.set_image` / `links.set_background` / `profile.set_image`；`url` 可放進 `design.put`、`modules.*` 任何吃圖片網址的欄位 |

| `assets.inspect` | read | `{ assetId }`：從 R2 讀回檔案，回 `mimeType / bytes / sha256 / width / height / complete`；`complete:false` 表示被截斷 |

> 使用者直接在對話貼圖片時：把圖片轉 base64 丟給 `assets.upload` 即可，不需要先找公開網址。
> **base64 傳輸完整性**：自己產生的圖先算 `sha256` 與 bytes，上傳時帶 `expectedSha256` / `expectedBytes`，後端不符會拒絕儲存（也會擋掉缺結尾標記的截斷檔）。回傳的 `sha256 / width / height / complete` 可直接比對，**不需要**把檔案下載回來驗證；已上傳的舊 asset 用 `assets.inspect` 回頭檢查。大圖（>1MB）建議先縮到 1600px 內或改用公開 URL 路徑，base64 字串越長越容易在複製時斷掉。

### Folders（分頁 / 分類）
| Tool | Scope | 主要參數 |
|---|---|---|
| `folders.list` | read | — |
| `folders.create` | write | `{ name, iconKey?, description?, accessMode?, password?, memberTierIds?, acknowledgeAccessChange? }` |
| `folders.update` | write | 部分更新 |
| `folders.reorder` | write | `{ orderedIds }` |
| `folders.delete` | write | 預設 `dry_run=true`；實刪需兩階段 |

> **存取門檻變更**（`accessMode !== 'public'`，例如鎖密碼 / 會員限定）一定要使用者**明確同意**才帶 `acknowledgeAccessChange: true`，避免不小心把公開分頁鎖起來。
> **至少保留一個分頁** —— 後端會擋下刪除最後一個分頁（避免空殼）。

### Links（連結卡）
| Tool | Scope | 說明 |
|---|---|---|
| `links.list` | read | 支援 `?folderId` 過濾 |
| `links.create` | write | 連結卡欄位：name / url / description / size / type / redirectType，加上樣式 `backgroundType`（color｜gradient｜image）/ `backgroundColor` / `backgroundGradient`（完整 CSS gradient 字串）/ `backgroundAssetId` / `imageAssetId` / `buttonSize`（small｜medium｜large）/ `textPosition`（九宮格）/ `textStyle`（showTitle、showDescription、titleSize、titleColor、descriptionSize、descriptionColor）。只給 `backgroundGradient` 沒給 `backgroundType` 會自動補成 gradient |
| `links.update` | write | 部分更新（同上所有欄位） |
| `links.set_background` | write | 一次設定卡片背景：`{ id, type:'color', color }`、`{ id, type:'gradient', gradient }`、`{ id, type:'image', url | assetId }`；可順帶 `textPosition` / `buttonSize` / `textStyle` |
| `links.set_image` | write | 設定連結卡封面：`{ id, url }`（公開 URL）或 `{ id, assetId }`；`clear:true` 清除 |
| `links.reorder` | write | `{ orderedIds }` |
| `links.delete` | write | 兩階段 |

> `textPosition` 九宮格：`top-left / top-center / top-right / center-left / center / center-right / bottom-left / bottom-center / bottom-right`（預設 `bottom-left`）。
> 漸層配方（直接抄）：一對一諮詢 `linear-gradient(135deg,#89CFF0 0%,#2563EB 100%)`、IG `linear-gradient(135deg,#F58529 0%,#DD2A7B 50%,#8134AF 100%)`、主持邀約 `linear-gradient(135deg,#F59E0B 0%,#7C2D12 100%)`；更多見 hypelink-rich-brand-page。
> 回傳的 `image` / `backgroundAsset` 已是完整 URL 字串。

### Page Modules（首頁內容模組）
| Tool | Scope | 說明 |
|---|---|---|
| `modules.catalog` | read | 內建模組目錄：所有可用 `moduleId`、分類（含 `game` 小遊戲）與每個模組的 `data` 欄位 schema；可 `category` / `q` 過濾，`withSchema:false` 省 token |
| `modules.list` | read | — |
| `modules.add` | write | `{ folderId, moduleId, data }`；**`data` schema 隨 `moduleId` 動態變化**，先 `modules.catalog` 查 |
| `modules.update` | write | — |
| `modules.reorder` | write | — |
| `modules.delete` | write | — |

> 常見 `moduleId`：`richtext`（`{ content }`）、`text-btn`（`{ text, url, style }`）、`bio`、`inquiry-form`、`video`、`logo-wall`…。
> **不確定某模組的 `data` 形狀時，先 `modules.catalog { q }` 查權威 schema，或 `modules.list` 看既有模組的 data，不要憑記憶猜。**
> 各模組的中文名稱、後台說明與「什麼情境該用哪個」見 `hypelink-rich-brand-page` 的「展示模組總覽」一節（依後台分類：展示內容／蒐集互動／販售轉換／個人檔案／媒體嵌入／小遊戲／社交互動／HypeLink 系統模組／其他擴充）。
> 小遊戲（`tetris` / `snake` / `basketball` / `gameboy`）自帶排行榜（訪客留暱稱即可上榜、每人取最高分），適合放在「互動」分頁當停留時間的鉤子。

### Socials（社群列）
| Tool | Scope | 說明 |
|---|---|---|
| `socials.list` | read | — |
| `socials.set` | write | 新增一筆（依 `type` + `data`）。type：0 Instagram、1 Facebook、2 YouTube、3 LINE、4 官網、5 TikTok、6 X、7 LinkedIn、8 Threads、9 Pinterest、10 Spotify、11 Podcast、12 GitHub、13 Behance、14 Dribbble、15 一般連結、16 自訂（customLabel/customIcon）、17 WhatsApp、18 WeChat；**功能性按鈕**：20 打電話（data=電話）、21 寄 Email（data=email）、22 傳簡訊（data=手機）、23 加入聯絡人（data=電話，公開頁下載 vCard）、24 加入 LINE 好友（data=LINE ID 含 @） |
| `socials.update` | write | 編輯既有 `id` |
| `socials.reorder` | write | — |
| `socials.delete` | write | 兩階段確認 |

### 設計 / 主題（外觀）
| Tool | Scope | 說明 |
|---|---|---|
| `design.get` | read | 取得目前 `designSettings` |
| `design.put` | write | **整包替換** `designSettings`（`{ settings }`）—— 風險高，務必先 `design.get` 再做最小變更 |
| `design.set_colors` | write | 只改顏色、其他設定不動：`{ brandColor?, titleColor?, handleColor?, bioColor? }`；`brandColor` 為 `#RRGGBB`，三個文字顏色可填 `#RRGGBB`（自訂）、`"brand"`（跟隨品牌色）或 `"auto"`（清除覆寫） |
| `design.set_theme` | write | 套用內建主題（`{ themeId }`，例如 `builtin-original` / `builtin-dark` / `builtin-notion`…）；**換主題會保留品牌色與文字顏色覆寫** |
| `themes.list` | read | 列出可用內建主題 |

> 品牌色單一來源：`accentColor`（後端同時鏡射到 `brandColors[0]`），全站按鈕／分頁／模組主色／底部 dock／所有子頁都用它。要改顏色一律用 `design.set_colors`，不要為了一個顏色 `design.put` 整包。hypeID 的顏色就是 `handleColor`（使用者常問「hypeID 顏色在哪改」）。

### 品牌官網（Brand Site，`/@id/site`；scope 仍為 `homeinfo:*`）
官網是「頁面系統」：每頁是 **builder**（頁面編輯器頁，區塊陣列）／**content**（接後台資料：作品專案、商店、專欄、最新消息、課程、3D 展、關於、聯絡、會員中心）／**html**／**link**。所有寫入都是**存草稿**，要 `site.publish` 公開頁才會變。

| Tool | Scope | 說明 |
|---|---|---|
| `site.get` | read | **官網開場第一支**：enabled／publishedAt／hasUnpublishedChanges／theme／footer／seo＋頁面摘要 |
| `site.update` | write | 整站設定 merge：`{ enabled?, theme?, footer?, seo?, contact?, about?, home? }`。footer 可帶 `layout`（11 種：columns／mega／cta／minimal／newsletter／stacked／ticker／contact／index／panel／photo）與版型欄位 `headline／giantWord／marquee／hours／newsletter／showClock` |
| `site.pages.list` | read | 頁面清單（＝Menu 順序）：id／slug／title／kind／sectionTypes／contentSource |
| `site.pages.get` | read | `{ id | slug }` 單頁完整內容（builder 的 sections／theme） |
| `site.pages.create` | write | `{ title, kind?, slug?, sections?, theme?, content?, link?, html?, showInMenu?, visibility?, position? }` |
| `site.pages.update` | write | 部分更新；`sections` 整組取代；`content.style` 固定內容區樣式（null＝跟隨範本）；`kind:"builder"` 把內容頁轉成頁面編輯器頁；`password`（null 移除） |
| `site.pages.delete` | write | 兩階段 confirmToken；首頁不可刪 |
| `site.pages.reorder` | write | `{ orderedIds | orderedSlugs }` |
| `site.templates.list` | read | 官網範本庫（72 個）：`category`／`q` 過濾；回每頁 slug 與區塊型別 |
| `site.apply_template` | write | `{ key, mode?: replace|append, applyTheme?: true }`——跟 dashboard「使用官網範本」一樣：replace 取代所有 builder 頁（首頁保留 id／slug）、內容頁不動；applyTheme 連主色／字體／背景／Menu／內容頁設計／頁尾版型一起換 |
| `site.apply_page_template` | write | `{ key, templateSlug, id | slug }` 把範本某一頁套到目前某一頁（只換區塊與頁面主題） |
| `site.blocks.catalog` | read | 86 種區塊的 type／label／`blank`（含所有欄位的空白預設）；附 hlContent 的 sources／layouts、footerLayouts。要自己組 sections 時先拿這個 |
| `site.publish` | write | 發佈草稿到公開頁 |
| `site.versions.list` / `site.versions.restore` | read / write | 版本紀錄與還原成草稿 |

> **建議流程**：`site.get` → `site.templates.list { category }` → `site.apply_template { key, dry_run:true }` 給使用者看會變成哪些頁 → 正式套用 → 用 `site.pages.update` 改文案（取 `site.pages.get` 的 sections，改字後整組寫回）→ `site.publish`。
> 要把品牌頁某分頁的模組放進官網：區塊 `{ type:"brandModules", folderId:<分頁 id 或 null＝全部>, layout:"bento"|"grid"|"two"|"stack"|"masonry", moduleIds?:[] }`，內容直接同步品牌頁（`folders.list` 取分頁 id）。
> 要自己拼頁面：`site.blocks.catalog { q:"hero" }` 拿 blank，改內容後放進 `sections`。圖片先 `assets.upload`。區塊可帶 `bg: { color?, imageUrl?, overlay?, textLight? }`。
> 範本的圖片是 HypeLink 自有素材（R2 `library/site-templates/…`），可直接保留；要換成品牌自己的照片就改區塊裡的 `imageUrl`／`bg.imageUrl`。

#### 官網範本目錄（`site.templates.list` 的 72 個；選範本先看「特色與用途」再對品牌的產業與深淺偏好）

選法：先問使用者產業／想要深色或淺色／有沒有要賣東西或收名單，再從下表挑 1–2 個用 `site.apply_template { key, dry_run:true }` 給他看會變成哪些頁。每個範本都自帶：主色、字體、全站背景（部分是 3D／粒子場景）、內容頁設計（作品／商店等列表長相）與頁尾版型。

| key | 名稱 | 分類／深淺 | 特色與用途 | tags |
|---|---|---|---|---|
| `studio-noir` | Noir 設計工作室 | 工作室 / 代理商／深色 | 黑底、一個燒橙強調色、超大標題與跑馬燈。適合設計／品牌工作室、影像團隊。 | 深色、編輯式、作品集、工作室 |
| `saas-launch` | Launch 軟體產品 | 軟體 / SaaS／深色 | 3D 場景 Hero、Bento 功能格、方案價格與 FAQ。適合 SaaS、App、工具型產品。 | 深色、科技、3D、定價 |
| `relay-automation` | Relay 自動化平台 | 軟體 / SaaS／深色 | 黑底、螢光青檸與一條貫穿全站的 3D 粒子流（會跟著捲動流動）。工作流程產品、開發者工具、SaaS。 | 深色、青檸、粒子流、SaaS、GetLayers |
| `gl-aerra` | Aerra 山屋房產 | 專業服務／淺色 | 單棟高端住宅銷售頁：藍調時刻滿版照、去背房屋 hero、數字、地點、六種買家、預約看房表單。 | 淺色、房地產、極簡、滿版照片 |
| `gl-ai-studio` | Superconscious AI 工作室 | 工作室 / 代理商／深色 | 黑底紫極光的 showreel 型著陸頁：3D 輪播、粒子場景、作品影片軌、人像圖牆、鉻星 CTA。 | 深色、紫色、AI、showreel、3D |
| `gl-altitude` | Altitude 山屋旅宿 | 餐飲 / 空間／深色 | 星空滿版 hero＋名單表單的旅宿策展站：襯線大標、毛玻璃數據條、精選住宿卡。 | 深色、襯線、旅宿、星空 |
| `gl-artefakt` | Artefakt 機能服飾 | 品牌商店／深色 | 黑底像素格＋虹彩外套的 techwear 電商頁：規格清單、四款商品、五層材質、FAQ、電子報。 | 深色、電商、科技、全大寫 |
| `gl-clarix` | Iris 生成藝術 | 軟體 / SaaS／淺色 | 白底極細字＋彩虹漸層線的 AI 創作平台：鉻黑 3D 物件 hero、大字流、玻璃統計卡、訂閱頁尾。 | 淺色、AI、極簡、全息 |
| `gl-codescan` | Codescan 復古訊號工作室 | 工作室 / 代理商／深色 | CRT 電視牆與霧氣的深色創意工作室站：薄荷色空心大標、案例電視輪播、可拖曳團隊卡、關於三卡。 | 深色、復古、CRT、工作室 |
| `gl-creative-director` | Creative Director 個人作品集 | 個人品牌／深色 | 黑底熔岩橘紅的藝術總監個人站：影片 hero、亂碼解碼大標、玻璃卡作品、服務清單、聯絡面板。 | 深色、橘紅、作品集、玻璃 |
| `gl-dantora` | Dantora 整合診所 | 身心 / 健康／淺色 | 薄荷綠的整合式診所站：DNA 場景 hero、五大服務滑軌、視差 banner＋數字、醫師卡、回電表單。 | 淺色、醫療、薄荷綠、圓角 |
| `gl-flora` | Stemline 隱私協議 | 軟體 / SaaS／深色 | 夜藍色蒲公英粒子的敘事式協議站：逐句飛入的故事、數據帶、接入節點 CTA。 | 深色、Web3、詩意、粒子 |
| `gl-forma` | Forma 單屏詢價 | 工作室 / 代理商／淺色 | 淺灰紫的 bento 式單屏：雙行大標、詢價表單、紫色山谷主圖、三張底卡（數據／文案／作品 CTA）。 | 淺色、紫色、極簡、bento |
| `gl-halden` | Halden 北歐家具 | 品牌商店／淺色 | 奶油底、紅色巨字的編輯風家具型錄：宣言、九個分類、商品卡、實景房間、一年四封信。 | 淺色、家具、編輯式、紅色 |
| `gl-house` | Keld 建築工作室 | 專業服務／深色 | 霧中海岸木屋的電影式建築站：三段巨字、Echo 專案、三個數字、showreel、客戶故事、木屋照頁尾。 | 深色、建築、電影感、霧 |
| `gl-longplay` | long.play 錄影帶數位化 | 專業服務／深色 | 晚霞草原上的復古電視 hero：手寫體標題、格式清單、流程、價格、隱私承諾。 | 深色、懷舊、服務、手寫 |
| `gl-lumea` | Lumea 創意工作室 | 工作室 / 代理商／深色 | 深色 void 裡的漂浮岩島與體積光：襯線大標、玻璃導覽、作品三欄、提案輸入 CTA。 | 深色、襯線、體積光、工作室 |
| `gl-new-era` | New Era 數據平台 | 軟體 / SaaS／深色 | 深空粒子的 SaaS 敘事：球體 hero、三張玻璃數據卡、成長宣言、生態系 CTA。 | 深色、粒子、SaaS、玻璃 |
| `gl-ridgeline` | Ridgeline 屋頂工程 | 專業服務／淺色 | 真實工地攝影的在地承包商站：狀態列、宣言＋數字、四項服務、四步驟、近期作品、預約勘查表單。 | 淺色、工程、在地服務、表單 |
| `gl-stride` | Stride 金融科技 | 軟體 / SaaS／淺色 | 藍色電漿 hero 與鉻金屬的 fintech 站：logo 跑馬燈、宣言、bento 數據、四欄揭圖、3D 作品堆疊、產品卡、表單。 | 淺色、藍色、fintech、3D |
| `gl-vesper` | Vesper 互動引擎 | 軟體 / SaaS／深色 | 深紫粒子的 HUD 式產品發表頁：粒子球 hero、四欄數據、四角標題、白色說明卡、FAQ、聯絡藥丸。 | 深色、紫色、HUD、粒子 |
| `gl-wanderlust` | Wanderlust 精品旅遊 | 餐飲 / 空間／深色 | 北歐荒野的電影感旅遊站：空拍 hero、拍立得目的地牆、哲學宣言、四種旅行方式、分層山景 CTA。 | 深色、旅遊、拍立得、襯線 |
| `gl-artist` | Nomura 生成藝術家 | 作品集／淺色 | 白底單色的藝術家作品集＋限量版畫販售：襯線大標、黑白作品、原則、流程、收藏購買與 FAQ。 | 淺色、黑白、藝術家、襯線、版畫 |
| `gl-dringle` | Dringle 品牌工作室 | 工作室 / 代理商／淺色 | 淡藍灰底＋紫色玻璃面板的單屏 hero，接服務、作品、團隊與見證。 | 淺色、紫色、工作室、玻璃 |
| `gl-gring-x` | GringX 數據決策 | 軟體 / SaaS／深色 | 純黑＋電光藍星雲球的 AI 決策層 landing：hero 指標、服務、流程、團隊、見證、CTA。 | 深色、藍色、AI、SaaS |
| `gl-helion` | Helion 品牌重力 | 工作室 / 代理商／深色 | 藍黑深空粒子的品牌工作室：鏡像漸層大標、四格服務、橫向時間軸、案例卡與收尾表單。 | 深色、藍色、粒子、工作室 |
| `gl-lumen` | Lumen 數位銀行卡 | 軟體 / SaaS／深色 | 夜海月光中的紫色簽帳卡：海報式 hero、卡片特寫、服務 bento、流程、數據與 CTA。 | 深色、紫色、fintech、卡片 |
| `gl-lumora` | Lumora 精準工作室 | 工作室 / 代理商／淺色 | 暖灰編輯風工作室：游標揭露的雙色人像 hero、宣言、We/Build/Better、作品、服務清單、數據。 | 淺色、編輯式、燒橙、工作室 |
| `gl-marcus-vane` | Vane 創辦人個人站 | 個人品牌／深色 | 近黑底＋電光橘的創業家個人主頁：出血人名 hero、跑馬燈、原則、四家公司、數據、推薦語。 | 深色、個人品牌、橘紅、大字 |
| `gl-northwall` | Northwall 建築營造 | 專業服務／深色 | 暮光混凝土建築攝影的營造公司站：滿版 hero＋數據、分類清單、三大案型、五步流程、團隊、表單。 | 深淺交替、建築、營造、攝影 |
| `gl-vexon` | Vexon AI 系統 | 軟體 / SaaS／深色 | 深色科技 AI 產品頁：粒子光球 hero、Signal / Pattern / Action 三特色、團隊與 CTA。 | 深色、青色、AI、粒子 |
| `gl-gravity` | Gravity 數位工作室 | 工作室 / 代理商／淺色 | 白底上掉落彈跳、聚成心形的 pastel 玻璃球（捲動驅動 3D 場景）：極簡大標、動力學卡、作品、CTA。 | 淺色、3D、玩味、工作室 |
| `hl-dash` | Dash 外送菜單 | 餐飲 / 空間／淺色 | 外送／自取餐飲的菜單型首頁：俯拍餐點 hero、分類磚、附圖餐點卡、送達數字、三步驟、據點時鐘。適合便當、丼飯、輕食、飲料店。 | 淺色、餐飲、外送、菜單 |
| `hl-encore` | Encore 演唱會 | 活動 / 社群／深色 | 單場演唱會／巡演售票頁：舞台攝影滿版 hero、開演倒數、城市跑馬、早鳥／一般／VIP 票種、歷年場次、卡司、FAQ。 | 深色、演唱會、倒數、票種 |
| `hl-lumina` | Lumina 課程平台 | 課程 / 教育／淺色 | 多課程的線上學習平台首頁：書桌攝影 hero、課程分類磚、影片／直播／社群三分頁展示、學習方式帳本、學員聲音、月／年／終身方案。 | 淺色、課程、訂閱、平台 |
| `hl-margin` | Margin 電子報 | 個人品牌／淺色 | 個人寫作／電子報的首頁：宣言式 hero、訂閱條、最新一期節錄、往期軌道、讀者數字與回信。米紙底、宋體、深綠單色。 | 淺色、電子報、寫作、宋體 |
| `hl-ripple` | Ripple 募款 | 專業服務／淺色 | 非營利／募款頁：田野攝影 hero、成果數字、三個影響力故事、每月捐款滑桿（拉到想支持的棵數直接看金額）、透明度 FAQ。 | 淺色、非營利、募款、定期定額 |
| `hl-corner` | Corner 街角小店 | 品牌商店／淺色 | 有實體店的選物小店：店內攝影 hero、可點貨架（熱點標價）、商品卡、店主故事、地圖卡與營業時間、小店日常。 | 淺色、選物店、實體店、在地 |
| `hl-inko` | Inko 插畫家 | 作品集／淺色 | 插畫家作品集：扁平編輯插畫 hero、客戶跑馬、六格作品、關於、委託項目與流程、客戶聲音。奶油紙底、珊瑚粉單色。 | 淺色、插畫、作品集、委託 |
| `hl-frame` | Frame 動畫師 | 作品集／深色 | 動畫／動態設計師作品集：定格序列 hero、動態標題、分鏡對完成畫面的滑桿對比、作品軌道、製作流程、數字與客戶。近黑底、電光黃單色。 | 深色、動畫、動態設計、作品集 |
| `hl-poly` | Poly 3D 建模師 | 作品集／深色 | 3D 建模／渲染師作品集：可轉動的 .glb 模型 hero、數字、三個可互動模型的畫廊、渲染欄、製作管線、白模對完成的滑桿。石墨黑底、青色單色。 | 深色、3D、建模、作品集 |
| `hl-ink` | Ink 文字工作者 | 作品集／淺色 | 文案／撰稿／編輯的作品集：以字為主的 hero、服務字帶、作品清單（類別／年份／標籤）、一段節錄、宣言、客戶聲音與合作流程。紙白底、酒紅單色、宋體。 | 淺色、文字、文案、宋體 |
| `hl-atelier` | Atelier 室內設計師 | 作品集／淺色 | 室內設計工作室作品集：空間攝影 hero、hover 預覽的住宅／商業／餐旅分類清單、三個專案欄、設計流程、數字、改造前後滑桿。灰米底、陶土單色。 | 淺色、室內設計、空間、作品集 |
| `hl-lens` | Lens 影像創作者 | 作品集／深色 | 攝影／影像創作者作品集：置中大字滿版 hero、照片皮帶、系列拍立得牆、關於、拍攝方案。近黑底、琥珀單色。 | 深色、攝影、影像、作品集 |
| `hl-orbit` | Orbit 顧問個人品牌 | 個人品牌／淺色 | 企業顧問／講師的個人站：窗邊人像 hero、三個服務、數字、演講與著作、客戶聲音、預約諮詢。海軍藍、紙感。 | 淺色、顧問、講師、個人品牌 |
| `hl-halo` | Halo 健身教練 | 個人品牌／深色 | 一對一／小班健身教練：暗房聚光 hero、訓練方式、方案、學員改變、常見問題。近黑、琥珀單色。 | 深色、健身、教練、個人品牌 |
| `hl-quill` | Quill 作家 | 個人品牌／淺色 | 小說家／散文作者的個人站：書桌靜物 hero、著作清單、節錄、活動行程、訂閱。紙白、鼠尾草綠、宋體。 | 淺色、作家、書籍、宋體 |
| `hl-pulse` | Pulse 音樂人 | 個人品牌／深色 | 獨立音樂人／製作人：夜間工作室 hero、最新發行、演出行程倒數、作品牆、合作洽詢。近黑、紫紅。 | 深色、音樂、製作人、演出 |
| `hl-bloom` | Bloom 插花老師 | 個人品牌／淺色 | 花藝老師／工作室：工作桌 hero、課程、作品、季節花材、報名。奶白、腮紅粉。 | 淺色、花藝、課程、工作室 |
| `hl-pixel` | Pixel 獨立開發者 | 個人品牌／深色 | 獨立開發者／indie hacker：夜間桌面 hero、產品清單、數字、開發日誌訂閱、聯絡。深色、青色、等寬字。 | 深色、開發者、產品、等寬 |
| `hl-reel` | Reel 影片創作者 | 作品集／深色 | 影片導演／剪接師：攝影機剪影 hero、作品影格軌道、服務、客戶跑馬、合作。近黑、橙色、電影感。 | 深色、影片、導演、作品集 |
| `hl-canvas` | Canvas 畫家 | 作品集／淺色 | 畫家／視覺藝術家：畫室 hero、作品瀑布、展覽紀錄、關於、收藏洽詢。灰白、赭色、襯線。 | 淺色、繪畫、藝術家、作品集 |
| `hl-thread` | Thread 時尚設計師 | 作品集／淺色 | 獨立服裝設計師：工作室 hero、系列 lookbook、細節、訂製流程、預約。象牙白、純黑、襯線大字。 | 淺色、時尚、服裝、Lookbook |
| `hl-voice` | Voice 配音員／Podcaster | 作品集／深色 | 配音員或 Podcast 主持人：麥克風 hero、節目／作品、聲音類型、合作方案、訂閱。深褐、琥珀。 | 深色、配音、Podcast、聲音 |
| `hl-forge` | Forge 陶藝／手作職人 | 作品集／淺色 | 陶藝或手作職人：拉坯 hero、作品、窯燒紀錄、工作坊課程、線上購買。米白、陶土色。 | 淺色、陶藝、手作、工作坊 |
| `hl-lumeo` | Lumeo UI／UX 設計師 | 作品集／淺色 | 產品設計師：工作桌 hero、案例研究卡、流程、工具、客戶聲音、聯絡。白底、薰衣草紫。 | 淺色、UI/UX、產品設計、案例 |
| `hl-ledger` | Ledger 財務 SaaS | 軟體 / SaaS／淺色 | 中小企業財務／發票 SaaS：產品截圖 hero、信任帶、三個功能分頁、數字、客戶、三方案、FAQ。白底、翡翠綠。 | 淺色、SaaS、財務、B2B |
| `hl-beacon` | Beacon 客服 SaaS | 軟體 / SaaS／淺色 | 客服／Help desk SaaS：收件匣截圖 hero、整合磚、功能、數字、客戶、定價。白底、天藍。 | 淺色、SaaS、客服、B2B |
| `hl-nimbus` | Nimbus 開發者工具 | 軟體 / SaaS／深色 | Developer tool／平台：終端機 hero、程式碼感跑馬、三個功能、工作流程 hero、用量定價滑桿、文件 CTA。黑底、紫色、等寬字。 | 深色、SaaS、開發者、等寬 |
| `hl-canopy` | Canopy 團隊協作 SaaS | 軟體 / SaaS／淺色 | 專案／團隊協作工具：看板 hero、分類磚、三個功能、數字、團隊聲音、每人計價、FAQ。暖白、珊瑚。 | 淺色、SaaS、協作、團隊 |
| `hl-signal` | Signal 數據分析 SaaS | 軟體 / SaaS／深色 | 產品分析／數據平台：數據牆 hero、儀表板 widget 區塊、三個功能、整合、客戶、定價。黑底、青色。 | 深色、SaaS、數據、分析 |
| `hl-harbor` | Harbor 預約排程 SaaS | 軟體 / SaaS／淺色 | 給沙龍／診所／工作室的預約 SaaS：桌面 hero、三步驟、功能、產業磚、客戶、定價。白底、藍綠。 | 淺色、SaaS、預約、店家 |
| `creator-portfolio` | Folio 創作者作品集 | 作品集／淺色 | 白底編輯式版面、襯線大標與 3D 輪播作品牆。適合攝影師、插畫家、建築與設計師。 | 淺色、編輯式、作品集、襯線 |
| `cafe-brew` | Brew 咖啡館 | 餐飲 / 空間／淺色 | 暖色、3D 產品 Hero、菜單卡片與據點時鐘。適合咖啡館、烘焙、小型零售。 | 暖色、餐飲、3D、零售 |
| `course-academy` | Academy 線上課程 | 課程 / 教育／淺色 | 課程列表、學習路徑時間軸、講師與學員見證。適合線上課程、工作坊、顧問培訓。 | 淺色、教育、課程、見證 |
| `event-conference` | Summit 活動／論壇 | 活動 / 社群／深色 | 強烈的影片 Hero、議程時間軸、講者牆與倒數。適合年會、論壇、快閃活動與社群聚會。 | 深色、活動、倒數、講者 |
| `ecommerce-drop` | Drop 品牌商店 | 品牌商店／淺色 | 亮色玩趣、商品格與新品發售倒數。適合 D2C 品牌、選物店、周邊商品。 | 淺色、玩趣、商城、新品 |
| `agency-motion` | Motion 行銷代理商 | 工作室 / 代理商／深色 | 高速流光 Hero、超大字跑馬燈、成果數據與服務展開欄。適合行銷／廣告代理商、成長顧問。 | 深色、強烈、數據、代理商 |
| `wellness-calm` | Calm 身心空間 | 身心 / 健康／淺色 | 柔和自然、留白多、預約導向。適合瑜伽、冥想、按摩、心理諮商與診所。 | 淺色、自然、預約、沉靜 |
| `restaurant-fine` | Ember 餐廳 | 餐飲 / 空間／深色 | 火光影片 Hero、金色強調、菜單與訂位。適合餐廳、酒吧、私廚與宴會空間。 | 深色、精品、餐飲、訂位 |
| `personal-brand` | Voice 個人品牌 | 個人品牌／淺色 | 顧問／講者／創作者的個人官網：關於、服務、專欄與訂閱。清爽淺色。 | 淺色、顧問、專欄、訂閱 |
| `real-estate` | Aerra 建築／房產 | 專業服務／淺色 | 白底、大量照片、玻璃感卡片。適合建案、建築事務所、室內設計與不動產。 | 淺色、攝影、建築、精品 |

> 範本的區塊順序見 `site.templates.list` 回傳的 `pages[].sectionTypes`；要改文案用 `site.pages.get` 取 sections 改字後 `site.pages.update` 整組寫回。

### Webhook 出站事件（🪄 Max 方案，scope 仍為 `homeinfo:*`）
讓 HypeLink 在事件發生時反向推 HTTP 給你的 endpoint（訂單、報名…）。**這是 Max 方案功能**。

| Tool | Scope | 說明 |
|---|---|---|
| `webhooks.list` | read | 列出 endpoints |
| `webhooks.event_types` | read | 可訂閱的事件型別清單 |
| `webhooks.create` | write | 新增 endpoint（`{ url, eventTypes[] }`）—— 非 Max 方案回 `403 SCOPE_DENIED` |
| `webhooks.update` | write | 更新（改訂閱 / 啟停）—— 啟用同樣需 Max |
| `webhooks.delete` | write | 刪除（兩階段確認） |
| `webhooks.rotate_secret` | write | 輪換簽章密鑰 |
| `webhooks.test` | write | 發測試事件 —— 需 Max |
| `webhooks.list_deliveries` | read | 投遞紀錄 |
| `webhooks.redeliver` | write | 重送某筆投遞 |

> 非 Max 方案：`list / list_deliveries / event_types` 仍可讀（只是不會有事件 fire）；`create / update(enable) / test` 會回 `SCOPE_DENIED`。
> 事件共 13 種：活動 7 種（`event.*`）、連結／profile 4 種、以及 **`module.comment.created`**（留言板／Q&A 有新留言）與 **`module.lead.created`**（洽詢表單／E-mail 訂閱／快速 Pitch 有興趣，payload `tag` 區分）。想「有人留言就通知我」就訂這兩個。
> 出站事件規格與簽名格式見官方文件 <https://hypelink.app/docs/ai/webhook>。

## Resources（自動上下文）

可用 `@hypelink://...` attach 讓 Claude 自動拉完整狀態：
`hypelink://brand/profile`、`hypelink://brand/overview`、`hypelink://brand/folders`、`hypelink://brand/folders/{id}`（該分頁的 links + modules）。

## 推薦工作流程

1. **開場先 `homeinfo.get_overview`** —— 沒有上下文不要直接 mutate。
2. **任何寫入前先 `dry_run: true`** → 把 changes 摘要給使用者確認 → 同意後移除 dry_run 正式執行。
3. **`*.delete` 兩階段**：第一次回 `{ confirmToken }` + 將刪除的摘要 → 第二次帶 `confirmToken` 執行。
4. **調順序用 `*.reorder { orderedIds }`**，不要用 N 次 update。
5. **`design.put` 一律先 `design.get`** 取基底，只改必要欄位。
6. 回 `SCOPE_DENIED` → 請使用者在 dashboard 重新產生帶足 scope 的 token。

### 範例：一鍵把空品牌頁填成「公司品牌」雛形
1. `homeinfo.get_overview` 看現況（避免重複）。
2. `profile.update`（dry-run → 確認）寫 name / description / seo。
3. `folders.create` ×3：關於我們 / 產品與服務 / 聯絡我們（記下回傳的 folderId）。
4. 每個分頁 `links.create` 放示範連結、`modules.add` 放 richtext / text-btn / inquiry-form。
5. `socials.set` 補社群。
6. 最後 `homeinfo.get_overview` 複查。
> 後台已有「公司品牌」內容樣板（新建品牌時套用）；MCP 這裡是對既有品牌補內容時的等價流程。

## 安全規則（務必遵守）

1. **永遠 dry-run 後才寫**（除非使用者明確說直接執行）。
2. **不要產生「整個改掉」的提案**：例如「重寫所有連結」應拆成「先 list → 逐項精準改」。`design.put` 尤其危險（整包替換）。
3. **存取門檻變更**需使用者明確同意才設 `acknowledgeAccessChange: true`。
4. **不存 token**：只走 MCP transport；不要把 token 印到 chat / 寫檔 / 進 git。
5. **schema 不確定** → `tools/list` 拉最新，不要猜。

## 常見錯誤碼

| Code | 處理 |
|---|---|
| `SCOPE_DENIED` | token 缺 scope；請使用者重新產生 |
| `RATE_LIMIT` | 約 60 req/min；等 30 秒重試 |
| `VALIDATION_FAILED` | 看 message；多為欄位格式（URL / 長度 / enum） |
| `NOT_FOUND` | id 不存在；先 `list` 確認 |
| `CONFLICT_DIRTY_BASELINE` | 後台被他人同時改；先 `get_overview` 重抓再試 |
| `CONFIRM_REQUIRED` | delete 未帶 `confirmToken`；先 dry-run 取得 |

## 與 dashboard 的關係

MCP 對首頁資訊 / 設計的任何寫入都會：寫入既有 entities、觸發 `revalidateBrandPublicCache`（與 dashboard 儲存同 pipeline）、寫一筆 `mcp_audit_log`（owner 可在後台查）。CLI / AI 與 dashboard 的修改會**立即互相反映**。

> 活動（events）相關操作見另一支 skill：`hypelink_claude_skill/hypelink-event-mcp/SKILL.md`。
