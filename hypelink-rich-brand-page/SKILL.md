---
name: hypelink-rich-brand-page
description: 打造「內容豐富」品牌頁的實戰手冊 — 分頁結構、模組選用與正確 data 格式、漸層／圖片連結按鈕、命名與標籤，以及變現模組（商城／課程／會員）的嵌入。當使用者想把品牌頁做得豐富漂亮（不只放幾個連結）、要「內容多一點／模組多一點」、或想參考範例品牌怎麼組時使用。搭配 hypelink-brand-page-mcp 的工具清單一起用。
---

# Skill：打造內容豐富的品牌頁

把品牌頁從「一排連結」升級成**有分頁、有多元模組、有設計感連結按鈕**的完整品牌大廳。
本 skill 是「怎麼組得豐富」的**實戰手冊**；工具的完整參數見 `hypelink-brand-page-mcp`。

## 何時使用
- 「幫我把品牌頁做豐富一點 / 模組多加一點」
- 「照 XX 場景（偶像 / 餐飲 / 個人品牌…）把整頁內容填好」
- 「加一些漂亮的連結按鈕，連到我的 Spotify / IG / 訂位」
- 想參考現成範例：`@start_idol_demo`、`@start_cafe_demo`、`@start_pro_demo`（實際上線的範例品牌）

## 心法：豐富 = 分頁 × 多元模組 × 設計感連結 × 命名/標籤
1. **分頁（folders）**：2–3 個分頁把內容分群（例：關於／作品／聯絡），比一長串更好逛。
2. **多元模組（page modules）**：每個分頁放 3–5 個不同模組，開場資訊 → 行動/會員 → 社群/聯絡。
3. **連結按鈕**：用**漸層或圖片背景**的大按鈕連到相關網站，質感立刻拉高。
4. **命名 + 標籤**：好名字讓人記得、好標籤讓人在「品牌探索」找到你。

---

## 建置流程（每一步都先 `dry_run` 再正式）
1. **開場先讀** `homeinfo.get_overview` 看現況。
2. **規劃分頁** `folders.create` / `folders.update`：依場景命名（如「關於 & 菜單」「行程 & 作品」「預約諮詢」）。至少保留一個分頁。
3. **每個分頁放模組** `modules.add {folderId, moduleId, data}`：見下方「模組選型速查」。`data` 形狀隨 `moduleId` 變，不確定就先 `modules.list` 看既有模組或查 `tools/list`。
4. **加連結按鈕** `links.create`（可直接帶漸層／buttonSize／textPosition；圖片走 `assets.upload` → `links.set_background` / `links.set_image`）。配方見「連結按鈕」一節。
5. **命名 + 標籤** `profile.update`（name/description）＋ discovery 設 tags。
6. **發布 + 複查**：`profile.update { isPublic:true }`，再 `homeinfo.get_overview` 檢查。

---

## 模組選型速查（moduleId → data 形狀 → 重點）

> 下表是速查；**權威 schema 用 `modules.catalog { q }` 取得**（含 options 與預設值）。品牌色與名稱／hypeID／簡介文字顏色用 `design.set_colors`。

### A. 內容直接存 data（可用 `modules.add` 直接建，最常用）
| moduleId | data 重點 | 備註 / 坑 |
|---|---|---|
| `richtext` | `{ content }` | **content 是 HTML**（`<h2>`/`<p>`/`<ul>`），**不是 markdown**（`##` 會原樣顯示） |
| `bio` | 自我介紹 | 簡短開場 |
| `text-btn` | `{ text, url, style }` | style: `primary`/… 單一行動按鈕 |
| `faq` | `{ title, items:[{q,a}] }` | 折疊問答 |
| `testimonial` | `{ title, items:[{quote,author,role,avatarUrl,rating}] }` | 客戶好評；rating 0–5 |
| `countdown` | `{ title, subtitle, targetAt, ctaText, ctaUrl, accentColor, endedMessage }` | **targetAt 必須是未來時間**（ISO，如 `2026-12-15T20:00:00+08:00`），否則顯示已結束 |
| `member-recruit` | `{ title, description, perks, ctaText }` | `perks` 每行一項權益 |
| `tour-schedule` | `{ title, showsText, layout, hidePast, accentColor }` | `showsText` 每行：`日期 \| 城市 \| 場地 \| 購票連結 \| 狀態(onsale/soldout/upcoming)` |
| `album-wall` | `{ title, albumsText, layout, spinOnHover, accentColor }` | `albumsText` 每行：`標題 \| 封面URL \| 連結URL`（需公開圖片 URL） |
| `image-carousel` | `{ title, images, captions, autoplay, interval, size, aspectRatio, fit }` | `images` / `captions` 用換行分隔；需公開圖片 URL |
| `store-map` | `{ title, address, hours, mapUrl }` | `mapUrl` 留空會**用 address 自動產生 Google Map**，最省事 |
| `line-add-friend` | `{ title, description, lineId, url, showQr }` | 在地觸點；`showQr:true` 顯示 QR |
| `social-card` | `{ title, instagram, facebook, youtube, tiktok, threads, x }` | 填帳號 handle |
| `marquee` | `{ text, bgColor, textColor, speed, layout }` | speed: `slow/normal/fast`；layout: `full/half` |
| `resume-experience` | `{ title, items:[{company,position,location,startDate,endDate,description}] }` | 個人品牌經歷 |
| `resume-education` | `{ title, items:[{school,department,degree,startYear,endYear}] }` | degree: high_school/associate/bachelor/master/phd/other |
| `resume-skills` | `{ title, items:[{name,level}] }` | 技能 + 熟練度 |
| `portfolio-case` | `{ cover, title, client, role, year, summary, highlights, url }` | `cover` 需公開圖片 URL；`highlights` 換行分隔 |
| `save-contact` | `{ name, title, org, phone, email, website, avatarUrl, buttonText, hint }` | 一鍵存通訊錄 |
| `divider` | — | 分隔留白 |
| `banner-h` | `{ title, subtitle, url, imageUrl, layout }` | 橫幅大圖卡；imageUrl 需公開 URL |
| `banner-sq` | `{ gridSize, cells:[{imageUrl,title,url}] }` | 方格拼貼（IG grid 感） |
| `dual-grid` | `{ items:[{imageUrl,title,url}] }` | 兩欄圖卡 |
| `video` | `{ videoUrl, showControls, autoplay, layout }` | YouTube / Vimeo / mp4；autoplay 會自動靜音 |
| `shorts` | `{ shorts:[{url,title}] }` | 直式短影音（YouTube Shorts / Reels 連結） |
| `playlist` | `{ title, videos:[{url,title}] }` | YouTube 影片清單 |
| `live-embed` | `{ platform:"youtube"\|"twitch", channelUrl, title, layout }` | 直播嵌入 |
| `social-post` | `{ url, title, showFrame }` | 單則社群貼文嵌入（IG / X / Threads 貼文網址） |
| `google-form` | `{ formUrl, height }` | Google 表單 iframe；height 預設 600 |
| `booking` | `{ calendarUrl, height }` | cal.com / Calendly 預約頁 iframe；height 預設 700 |
| `smart-link` | `{ title, artist, coverUrl, releaseDate, platforms:[{platform,url}], accentColor }` | 音樂 smart link（一首歌全平台按鈕） |
| `music-player` | `{ title, tracks, visualizer, accentColor, autoNext, showLyrics, lyricsText }` | `tracks` 每行「標題 \| 音檔URL」；`lyricsText` LRC 格式；visualizer 有 wavesurfer/meyda 多款 |
| `piano` | `{ title, keyRoot, highlightScale, autoChord, showLoop, bpm, loopBars, showLabels, accentColor }` | 可彈電子琴＋Loop Station；純前端互動 |
| `pixel-paint` | `{ title, gridSize, pixelScale, bgColor, defaultColor, paletteText, showGrid, showDownload }` | 復古小畫家；**訪客塗鴉不持久化**（各自裝置） |
| `tetris` | `{ title, startLevel:"1"|"3"|"5", leaderboardSize:"5"|"10"|"20", showLeaderboard, accentColor }` | 小遊戲：俄羅斯方塊，鍵盤＋畫面左右下角按鈕；**排行榜持久化**（每人取最高分，訪客留暱稱即可） |
| `snake` | `{ title, speed:"slow"|"normal"|"fast", wallWrap, leaderboardSize, showLeaderboard, accentColor }` | 小遊戲：貪食蛇，方向按鈕；排行榜同上 |
| `basketball` | `{ title, duration:"30"|"60"|"90", movingHoop, leaderboardSize, showLeaderboard, accentColor }` | 小遊戲：籃球機（限時投籃、蓄力出手）；排行榜同上 |
| `gameboy` | `{ title, game:"mario", shellColor:"classic"|"purple"|"yellow"|"teal", leaderboardSize, showLeaderboard, accentColor }` | 小遊戲：掌機外殼＋卡帶「超級瑪麗」（原創像素平台跳躍）；排行榜同上 |
| `object-3d` | `{ modelUrl, title, autoRotate, shadow, playAnimations, autoLoad, backgroundColor, … }` | 3D 模型展示；**modelUrl 需經 dashboard 上傳器**，MCP 難直建 |
| `logo-wall` | `{ logos:[{imageUrl,name,url}], grayscale, marquee, marqueeSpeed, shadow, noFrame }` | 合作品牌牆；marquee 跑馬燈模式 |
| `portfolio-featured` | `{ image, title, tags, description, url }` | 單件主打作品；tags 逗號分隔 |
| `portfolio-gallery` | `{ title, description, images, columns:"2"\|"3"\|"4" }` | 作品圖牆；images 換行分隔公開 URL |
| `picture-book` | `{ title, author, coverImage, description, pages:[{image,text}] }` | 翻頁繪本；pages 由編輯器管理（JSON） |
| `resume-certificate` | `{ title, items:[{name,issuer,year,url,description,imageUrl}] }` | 證照與獎項 |
| `user-manual` | `{ title, intro, likes, dislikes, redLines, howToGetAlong }` | 個人使用說明書；likes/dislikes 逗號分隔 |
| `digital-card` | `{ name, title, email, phone, company, url }` | 數位名片卡 |
| `hypelink-link` | `{ hypeId, title, name, avatar, note }` | 站內品牌頁互連卡；name/avatar 是選取時快照 |
| `copy-text` | `{ title, items:[{label,text}] }` | 點擊複製（銀行帳號 / 折扣碼 / Discord ID） |
| `flash` | `{ title, description, endTime, url }` | 限時快閃倒數；endTime ISO 且須未來時間 |
| `follower-proof` | `{ title, showFollowers, items:[{platform,url,followers,handle,verified}] }` | 社群影響力數字牆；followers `null`=不顯示數字 |
| `commission-info` | `{ title, status, description, tiers:[{name,price,description}], notes, contactUrl, contactLabel }` | 繪師/接案委託資訊；status 開放/暫停 |
| `membership` | `{ planName, price, benefits, ctaLabel, url }` | **靜態**會員方案卡（benefits 每行一項）；真會員系統用 `member-recruit`＋會員功能 |
| `sponsor` | `{ platform:"buymeacoffee"\|"patreon"\|"kofi"\|"other", url, label }` | 贊助平台按鈕 |
| `tip-jar` | `{ title, amounts, currency:"TWD"\|"USD"\|"JPY", url }` | 打賞小費；amounts 逗號分隔金額 |

### A-2. 互動模組（設定存 data；**訪客產生的資料存後端**，會自動累積）
| moduleId | data 重點 | 備註 / 坑 |
|---|---|---|
| `guestbook` | `{ title, memberOnly, accentColor, placeholder }` | 訪客留言板（存 module-comments）；memberOnly 可鎖會員 |
| `qna-box` | `{ title, intro, placeholder, answersText, accentColor }` | 匿名提問箱；`answersText` 每組兩行（問題/回覆）、空行分隔 |
| `quick-poll` | `{ question, optionsText, allowMulti, showResults:"after-vote"\|"always"\|"never", closeAt, accentColor }` | 快速投票；optionsText 一行一選項；closeAt 到期鎖票 |
| `email-capture` | `{ title, description, buttonText, placeholder, successMessage, url, layout }` | Email 訂閱名單（存 module-leads）；url 為訂閱後導引 |
| `inquiry-form` | `{ title, description, buttonText, successMessage, fields, tag, accentColor, notifyEnabled }` | 諮詢/合作表單（存 module-leads）；`tag` 內部分類（booking/collab…）；notifyEnabled 填寫時寄 Email 通知 |

### B. 需要「後端先有資料」才會顯示（先建資料，再放模組；否則空白 / 不顯示）
`brand-services`（服務目錄）、`mall-products`（商城商品）、`mall-reviews`（買家評價）、`news-list`（最新消息）、`articles-list`（專欄）、`course-list`（線上課程）、`coupon-claim`（需先建優惠券）、`reservation`（需先設預約）、`event-list` / `event-timeline`（需先建活動）、`team-members`（需先在 dashboard 建「成員資料」；data 只有顯示設定 `{ title, layout, avatarStyle, scope:"active"|"alumni"|"all", paginated, perPage }`）、`projects-list`（需先發布「作品專案」；data `{ title, maxItems, layout:"grid"|"list", category?: 分類 slug }`）、`brand-points-status`（品牌點數 BP 狀態卡，需啟用品牌點數；data `{ title, description }`）、`digital-goods`（預設 `source:"tool"` 撈 線上商店 digital 商品，需先上架；`source:"manual"` 可退回手填 `{ title, description, price, url, imageUrl }` 單一商品＝A 類用法）、`file-vault`（檔案下載區；**檔案須經 dashboard 上傳**產生 assetId，data 的 files/accessMode 由編輯器管理，另支援密碼/會員解鎖）、`music-showcase`（音樂陳列室；貼歌曲連結後**自動解析各平台**，data 由自訂編輯器管理，MCP 只適合改 `customPlatformsText`）。

> 這類模組**拉取其他系統的資料**。想用它們，先透過對應功能（商城 / 課程 / 活動 / 優惠券…）建立資料，模組才有東西可顯示。純展示用途時，改用 A 類（richtext 手寫菜單/服務也可以）。

---

## 連結按鈕（漸層 / 圖片背景）
連結卡（`links.create`）欄位：
- `backgroundType`: `color` | `gradient` | `image`
- `backgroundColor`（hex）、`backgroundGradient`（**完整 CSS gradient 字串**）、`backgroundAssetId`（圖片，先上傳取得）
- `buttonSize`: `small` | `medium` | `large`（large ≈ 160px 高，最像 hero 按鈕）
- `textPosition`: `top-left/top-right/bottom-left/bottom-right/center`

> ✅ **MCP 已全開**：`links.create` / `links.update` 可直接帶 `backgroundType / backgroundColor / backgroundGradient / backgroundAssetId / buttonSize / textPosition / textStyle`；
> 或用 `links.set_background { id, type:'gradient', gradient }` 一步到位。
> 圖片：使用者貼的圖用 `assets.upload { data: <base64> }` 上傳拿 `assetId`，再 `links.set_background { id, type:'image', assetId }` 或 `links.set_image { id, assetId }`；有公開網址則直接給 `url`。

**可直接抄的漸層配方（backgroundType=gradient）：**
```
Spotify   linear-gradient(135deg,#1DB954 0%,#191414 100%)
Instagram linear-gradient(135deg,#F58529 0%,#DD2A7B 50%,#8134AF 100%)
YouTube   linear-gradient(135deg,#FF0000 0%,#7A0000 100%)
LINE      linear-gradient(135deg,#06C755 0%,#048C3E 100%)
LinkedIn  linear-gradient(135deg,#0A66C2 0%,#004182 100%)
品牌紫    linear-gradient(135deg,#7C3AED 0%,#4C1D95 100%)
粉→紫     linear-gradient(135deg,#FF5C9A 0%,#7C3AED 100%)
暖橙→棕   linear-gradient(135deg,#F59E0B 0%,#7C2D12 100%)
```
**連去哪**：Spotify / Apple Music、IG / YouTube / TikTok、官網、線上訂位（inline / EZTABLE）、Google Maps、預約（cal.com / Calendly）、電子報（Substack）、KKTIX 等 —— 挑與品牌相關的即可。
**圖片背景**：用一張有氛圍的照片（商品 / 空間 / 作品）當背景、文字放 `bottom-left`，比純色更吸睛。

---

## 命名 & 標籤（決定被記得 / 被找到）
- **名稱**：`品牌/人名 + 定位`，例「星野 STARLIGHT · 應援基地」「小巷咖啡 Lane Coffee」「陳品睿 · 品牌顧問」。中英並列利於搜尋與打卡。
- **handle**：用跨平台一致的英文名，Email 簽名 / 名片 / bio 都放同一個。
- **標籤（discovery tags）**：用「受眾會搜的詞」，決定你出現在「品牌探索」的哪一區。例：偶像→`偶像/應援/K-Pop`；餐飲→`咖啡廳/餐廳/台北`；顧問→`個人品牌/顧問/講師`。

---

## 進階：變現模組怎麼嵌
- **線上商店**：先在商城建商品（`mall.*` 或 dashboard），再放 `mall-products` 模組；適合周邊 / 伴手禮 / 電子書。
- **線上課程**：先建課程/章節/單元，再放 `course-list`。
- **會員**：`member-recruit` 招募 + 會員等級綁權益 / 會員價。
- **名單神器**：投廣落地頁（`lead_pages.*`）搭配活動導流。
> 金流敏感操作（結帳 / 退款 / 出金）走 dashboard，見 `hypelink-commerce-mcp`。

---

## 常見坑（務必避開）
1. **richtext 用 HTML 不是 markdown** —— `## 標題` 會原樣顯示，請用 `<h2>`。
2. **countdown 的 targetAt 要未來時間** —— 過去會顯示「已結束」。
3. **圖片類模組/連結需要「公開可存取的圖片 URL」** —— album-wall / carousel / portfolio 的圖、圖片背景連結；MCP 用 `*.set_image`（吃公開 URL）或走上傳流程；別留 `example.com` 佔位。
4. **用 `company` 範本建立會附帶佔位連結**（example.com 的「公司官網」等）—— 記得刪掉再放自己的內容。
5. **模組上限**：Free 12 / Pro 30 / Max 50；**分頁至少保留一個**。
6. **每個模組要正確 `folderId`**；模組是「整包覆寫」語意，改動前先 `modules.list` 取現況、只改必要部分。
7. **寫入前先 `dry_run`**；destructive 走兩階段 `confirmToken`；缺 scope 回 `SCOPE_DENIED`。

---

## 範例藍圖（可直接當範本改）
用「分頁 → 模組 → 連結」三層規劃。以下是三個實際上線範例的組成：

**偶像應援 `@start_idol_demo`**
- 分頁：應援基地 / 行程 & 作品 / 加入我們
- 模組：richtext(關於)、countdown(生日應援倒數)、member-recruit、marquee ｜ tour-schedule、album-wall(封面圖) ｜ line-add-friend、social-card、faq、save-contact
- 連結：Spotify、KKTIX、YouTube、Instagram（漸層）＋限定周邊（圖片背景）

**餐飲 `@start_cafe_demo`**
- 分頁：關於 & 菜單 / 訂位 & 環境 / 聯絡我們
- 模組：richtext(關於)、richtext(菜單)、text-btn(訂位)、member-recruit(熟客) ｜ image-carousel(環境照)、store-map、faq ｜ line-add-friend、testimonial、save-contact
- 連結：inline 訂位（暖橙漸層）、週末甜點（圖片背景）、Google Maps、IG、foodpanda

**個人品牌 `@start_pro_demo`**
- 分頁：關於 & 服務 / 經歷 & 作品 / 預約諮詢
- 模組：richtext(關於)、richtext(服務)、text-btn(預約)、testimonial ｜ resume-experience、resume-skills、resume-education、portfolio-case×2(封面圖) ｜ faq、social-card、inquiry-form、save-contact
- 連結：cal.com 預約、品牌指南、LinkedIn、演講回顧（圖片背景）、電子報

---

## 與其他 skill 的關係
- 工具完整參數與 scope：`hypelink-brand-page-mcp`
- 商城 / 課程 / 聯盟 / 名單：`hypelink-commerce-mcp`
- 活動：`hypelink-event-mcp`

> 名稱 / 分頁 / 模組 / 連結的任何寫入都與 dashboard 同一條 pipeline、立即反映公開頁，並寫 `mcp_audit_log`。

## 作品集（作品專案）
品牌內容 → 作品專案是 Behance 式的作品集（公開頁 `/@id/projects`），比在分頁堆 album-wall 更適合放大量作品。
**模組怎麼選（名字相近，別混用）**：
- `projects-list`「作品專案（自動同步）」— 自動列出作品專案工具已發布的作品，`modules.add { slug:'projects-list', data:{ title, maxItems, layout:'grid'|'list', category?:'<分類 slug>' } }`；新增作品不用改模組。**大量作品一律用這個。** 作品多時先用 `projects.categories.create` 建分類，一個分頁放一個分類的模組。
- `portfolio-gallery`「作品集圖庫（手動貼圖）」、`portfolio-featured`「精選作品（手動單件）」、`portfolio-case`「案例研究（手動單篇）」、`album-wall`「專輯牆」— 資料手動填在模組裡，不會連動；只適合 1～10 件精選或單篇深度案例。
流程：
`assets.upload`（封面＋內容圖）→ `projects.create { title, coverAssetId, projectDate, client, category, tags, blocks }` → `projects.reorder`。
分頁上只放精選幾件，或放一顆連結按鈕指向 `/@id/projects`。
