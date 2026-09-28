---
name: hypelink-rich-brand-page
description: 打造「內容豐富」品牌頁的實戰手冊 — 分頁結構、展示模組總覽（後台分類×名稱×說明×推薦情境）、模組選用與正確 data 格式、漸層／圖片連結按鈕、命名與標籤，以及變現模組（商城／課程／會員）的嵌入。當使用者想把品牌頁做得豐富漂亮（不只放幾個連結）、要「內容多一點／模組多一點」、或想參考範例品牌怎麼組時使用。搭配 hypelink-brand-page-mcp 的工具清單一起用。
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
| `quick-poll` | `{ title, accentColor, questions:[{id,type:"single"\|"multi"\|"versus"\|"rating",text,options:[{label,imageUrl}],maxChoices,ratingScale}], rules:{voterGate:"anyone"\|"login"\|"member", resultsVisibility:"after-vote"\|"after-close"\|"always"\|"manual"\|"never", startAt, closeAt, allowComment, showTotals} }` | 快速投票 v2：最多 10 題；單題可只填舊欄位 `question/optionsText`；後台可揭曉、審留言、匯出 CSV |
| `email-capture` | `{ title, description, buttonText, placeholder, successMessage, url, layout }` | Email 訂閱名單（存 module-leads）；url 為訂閱後導引 |
| `inquiry-form` | `{ title, description, buttonText, successMessage, fields, tag, accentColor, notifyEnabled }` | 諮詢/合作表單（存 module-leads）；`tag` 內部分類（booking/collab…）；notifyEnabled 填寫時寄 Email 通知 |
| `pitch-card` | `{ introFromProfile, showProducts, showEvents, showCourses, showProjects, showArticles, showSocials, showBrandQr, showSocialQr, imageSlides:[url], pitches:[{id,title,hook,problem,solution,audience,traction[{value,label}],ask,askText,ctas[{type,label,url}],tags}], timerSeconds, interestEnabled, fieldName/fieldEmail/fieldLine/fieldNote:"required"\|"optional"\|"hidden", style, accentColor }` | 快速 Pitch：預設同步品牌頁內容，`pitches` 選填；`imageSlides` 需公開 PNG URL；「我有興趣」進 module_lead（tag=pitch） |
| `friend-quiz` | `{ title, intro, theme, gradient, accentColor, resultGate:"none"\|"member", allowDownload, leaderboardSize, questions:[{id,text,options[],answerIndex}] }` | 好友挑戰；`theme` 可用範本 key（kpop/anime/movie/food/brand/travel/fashion/idol/game/friends/music/daily/love） |
| `friend-impression` | `{ …共用欄位, tags:[string], questions:[{id,text,options[]}], allowAnonymous }` | 朋友眼中的我；標籤池讓朋友挑 3 個 |
| `friend-tier` | `{ …共用欄位, items:[{id,label}], ownerOrder:[id] }` | 喜好排行大挑戰；朋友猜順序算默契度 |
| `similarity` | `{ …共用欄位, questions:[{id,text,options[],dimension}], ownerAnswers:{questionId:optionIndex} }` | 我們有多像；品牌主先答一遍 |

### B. 需要「後端先有資料」才會顯示（先建資料，再放模組；否則空白 / 不顯示）
`brand-services`（服務目錄）、`mall-products`（商城商品）、`mall-reviews`（買家評價）、`news-list`（最新消息）、`articles-list`（專欄）、`course-list`（線上課程）、`coupon-claim`（需先建優惠券）、`reservation`（需先設預約）、`event-list` / `event-timeline`（需先建活動）、`team-members`（需先在 dashboard 建「成員資料」；data 只有顯示設定 `{ title, layout, avatarStyle, scope:"active"|"alumni"|"all", paginated, perPage }`）、`projects-list`（需先發布「作品專案」；data `{ title, maxItems, layout:"grid"|"list", category?: 分類 slug }`）、`brand-points-status`（品牌點數 BP 狀態卡，需啟用品牌點數；data `{ title, description }`）、`digital-goods`（預設 `source:"tool"` 撈 線上商店 digital 商品，需先上架；`source:"manual"` 可退回手填 `{ title, description, price, url, imageUrl }` 單一商品＝A 類用法）、`file-vault`（檔案下載區；**檔案須經 dashboard 上傳**產生 assetId，data 的 files/accessMode 由編輯器管理，另支援密碼/會員解鎖）、`music-showcase`（音樂陳列室；貼歌曲連結後**自動解析各平台**，data 由自訂編輯器管理，MCP 只適合改 `customPlatformsText`）。

> 這類模組**拉取其他系統的資料**。想用它們，先透過對應功能（商城 / 課程 / 活動 / 優惠券…）建立資料，模組才有東西可顯示。純展示用途時，改用 A 類（richtext 手寫菜單/服務也可以）。

---

## 展示模組總覽（後台「品牌頁管理 › 內容 › 展示模組」的分類、名稱、說明與使用情境）

> 這一節對應 dashboard「新增模組」對話框的分頁（常用分類＝全部＋「連結／文字」項目；「HypeLink 系統模組」＝讀取或寫回後台資料的模組；其餘依用途分類，同一模組可同時屬於多個用途）。名稱／說明與後台目錄同步（來源：`builtin-modules.catalog.ts`），**data 形狀仍以 `modules.catalog { q }` 為準**。「推薦情境」是選型建議：先問使用者「這一段想讓訪客做什麼」，再從對應分類挑模組。

### 分類速覽（先選分類再選模組）
| 後台分類 | 目的 | 典型情境 |
|---|---|---|
| 展示內容 | 讓人「看懂你是誰、在做什麼」 | 開場介紹、主打活動、品牌牆、倒數、社群佐證、成員 |
| 蒐集互動 | 讓訪客「留下東西」（名單、留言、投票、提問） | 電子報、洽詢、粉絲互動、LINE 導流 |
| 販售轉換 | 讓訪客「付錢或加入」 | 商城、課程、會員、優惠券、打賞、預約、委託 |
| 個人檔案 | 履歷／作品集式的專業呈現 | 個人品牌、接案者、求職、講師 |
| 媒體嵌入 | 影音、音樂、直播、地圖 | 創作者、音樂人、實體店 |
| 小遊戲 | 停留時間與趣味（含排行榜） | 活動現場、社群同樂、品牌人格 |
| 社交互動 | 線下交友／朋友間玩、認識彼此 | 聚會、交換名片、粉絲同樂、HypeCard 碰卡 |
| HypeLink 系統模組 | 讀取後台既有資料或把互動寫回後台 | 已在用商城／課程／活動／作品／CRM 的品牌 |
| 其他擴充 | 未歸類（分隔線、外部表單、HypeLink 互連等） | 版面調整、第三方工具 |

### 展示內容（purpose_showcase）
| moduleId | 名稱 | 後台說明 | 推薦情境 |
|---|---|---|---|
| `text-btn` | 文字按鈕 | 單行 CTA 按鈕，適合放「前往商店」「預約諮詢」等主要動作 | 每個分頁最上方放 1 顆主要行動；只要一個明確動作時用它，不要用連結列 |
| `banner-h` | 橫幅看板 | 寬版圖文橫幅，適合主打活動或封面 | 當期主打（新品、演唱會、檔期）；一頁最多 1–2 張 |
| `banner-sq` | 方形看板 | 1x1 / 2x2 方形格子，支援多張圖片並排 | IG 九宮格感的視覺入口、系列商品／作品 |
| `dual-grid` | 雙方格看板 | 並排兩格圖文，支援獨立連結 | 兩個並列選項（線上／線下、男裝／女裝、A 方案／B 方案） |
| `richtext` | 文字區塊 | 富文本編輯：支援粗體、清單、連結、標題等格式 | 關於我們、菜單、服務說明、公告；**content 是 HTML** |
| `bio` | 自我介紹 | 創作者／品牌簡介區塊，附照片 | 個人品牌第一屏、講師／顧問開場 |
| `marquee` | 跑馬燈 | 像素風滾動文字，適合強調標語或促銷 | 促銷標語、「熱賣中」「本週公休」等短訊息 |
| `image-carousel` | 輪播圖 | 全寬圖片輪播，自動或手動切換。適合展示插畫系列、角色設計、合作案例等多張作品 | 環境照、作品系列、活動花絮（5–8 張最佳） |
| `picture-book` | 繪本展示 | 翻頁式圖文繪本，逐頁展示插圖與故事文字。適合繪本創作者、漫畫家、圖文作家 | 繪本／漫畫／圖文故事試閱 |
| `album-wall` | 專輯牆 | 以 CD 外型展示專輯封面與連結，支援格狀或橫向滑動 | 音樂人作品列、Podcast 系列封面 |
| `user-manual` | 我的使用說明書 | 用半開玩笑的「人類使用手冊」格式介紹自己：喜歡／討厭標籤、地雷、如何相處；適合 KOL、創作者、合作對象，讓陌生人 30 秒讀懂你 | KOL、接案者、找合作對象的自我介紹 |
| `countdown` | 倒數計時 | 新歌發行、演唱會、出道紀念日等倒數，支援翻牌／數位／簡約三種視覺 | 發行日、開賣日、活動日；**targetAt 需未來時間** |
| `tour-schedule` | 巡演行程 | 顯示巡演／演唱會場次清單（日期、城市、場地、購票連結與售票狀態） | 樂團／偶像／講座巡迴 |
| `testimonial` | 客戶見證 | 橫向滑動展示多筆客戶口碑與評分，建立信任感 | 服務型品牌、課程、顧問；放在 CTA 之前 |
| `follower-proof` | 追蹤數認證 | 展示 IG／Threads／FB 等平台追蹤數，作為社群影響力佐證 | KOL 業配頁、媒體資料頁 |
| `social-card` | 社群連結卡 | IG／FB／YouTube／TikTok 等捷徑一次列出 | 「聯絡我們」分頁收尾 |
| `logo-wall` | Logo 牆 | 合作品牌／贊助商 Logo 列 | 合作案例、贊助商、媒體露出 |
| `object-3d` | 3D 模型展示 | 上傳 .glb／.fbx 3D 模型，訪客可拖曳旋轉檢視；容量依方案 Free 5MB／Creator 10MB／Pro 50MB／Max 以上 100MB | 產品／公仔／建築模型；**檔案需 dashboard 上傳** |
| `team-members` | 成員資料 | 讀取後台「成員資料」自動列出成員（現任／校友／全部） | 工作室、樂團、社團、公司團隊頁 |
| `flash` | 限時活動 | 倒數計時看板＋明確 CTA | 快閃優惠、限時報名（同時屬販售轉換） |
| `pixel-paint` / `piano` | 像素小畫家／電子琴 | 見「小遊戲」 | 品牌人格、互動彩蛋 |
| `divider` | 分隔線 | 視覺區隔兩個區塊 | 段落分隔（其他擴充） |

### 蒐集互動（purpose_collect）
| moduleId | 名稱 | 後台說明 | 推薦情境 |
|---|---|---|---|
| `email-capture` | E-mail 蒐集 | 電子報訂閱表單 | 電子報、預購通知、免費資源；名單進「留單資料」 |
| `inquiry-form` | 洽詢表單 | 商演／合作洽詢表單，送出後寫入「會員 › 留單資料」彙整管理 | 合作／商演／報價洽詢；可設 tag 分類與 Email 通知 |
| `guestbook` | 留言板 | 訪客留言板，支援彈幕／留言牆／時間列表三種顯示樣式，可選擇是否限會員留言 | 粉絲留言、活動祝福牆、開幕留言 |
| `quick-poll` | 快速投票 | 多題（最多 10 題）、單選／複選／二選一對決／評分；可設誰能投、結果顯示時機、開始與截止、投票留言；後台可揭曉、審核留言、匯出 CSV | 內容選題、新品命名、活動決定；現場活動用「手動揭曉」 |
| `qna-box` | Q&A 信箱 | 粉絲匿名提問信箱，問題寫入 module-comments；可於後台精選回覆並公開展示 | 粉絲問答、AMA、講師課後提問 |
| `google-form` | 表單整合 | 嵌入 Google Form／Typeform 等表單 | 已有外部表單、報名／問卷不想重做 |
| `line-add-friend` | LINE 加好友 | LINE 官方帳號加好友卡（含 QR code） | 台灣在地導流首選；實體店、客服 |

### 販售轉換（purpose_sell）
| moduleId | 名稱 | 後台說明 | 推薦情境 |
|---|---|---|---|
| `mall-products` | 線上商店 | 展示線上商店商品格，可撈全部或依分類撈取 | 已在商城上架；周邊／伴手禮／電子書（需先建商品） |
| `digital-goods` | 數位商品 | 展示單一數位商品，連至購買頁 | 單一主打數位品（模板、電子書）；`source:"manual"` 可手填 |
| `mall-reviews` | 買家評價 | 自動輪播線上商店買家評價（社會證明） | 商品頁下方、商城入口前 |
| `course-list` | 課程清單 | 展示品牌的線上課程（卡片／清單樣式），導向課程頁報名 | 講師、知識型創作者（需先建課程） |
| `brand-services` | 服務項目 | 列出「品牌內容 › 服務項目」設定的所有項目，訪客可點擊進詢價／報價流程 | 接案／設計／顧問服務目錄，含報價流程 |
| `reservation` | 預約系統 | HypeLink 內建時段預約（需先設定預約） | 美業、諮詢、體驗課；想用站內預約而非 Calendly |
| `booking` | 行事曆預約 | 嵌入 Calendly／Cal.com 預約頁 | 已用 Calendly／cal.com 的顧問、講師 |
| `commission-info` | 委託資訊 | 接稿委託價目與規範：委託方案、價格區間、注意事項 | 繪師、設計接案、客製訂製（同時屬個人檔案） |
| `member-recruit` | 會員招募 | 會員權益列表＋加入會員 CTA | 想累積會員／熟客；搭配會員等級與會員價 |
| `membership` | 會員訂閱 | 月費／年費會員計畫 CTA | 靜態訂閱方案卡（真會員系統用 member-recruit） |
| `coupon-claim` | 優惠券 | 展示品牌進行中的優惠券，導向會員專區領取 | 首購折扣、節慶活動（需先建優惠券） |
| `lead-magnet` | 名單磁鐵 | 展示名單神器贈品，導向領取頁收集名單 | 免費資源換名單、投廣落地 |
| `tip-jar` | 小費罐 | 隨喜打賞按鈕，多個金額選項 | 街頭藝人、Podcast、免費內容創作者 |
| `sponsor` | 贊助連結 | 導流到 Buymeacoffee／Patreon 等贊助平台 | 已有海外贊助平台的創作者 |
| `flash` | 限時活動 | 倒數計時看板＋明確 CTA | 快閃促銷、早鳥截止 |

### 個人檔案（purpose_profile）
| moduleId | 名稱 | 後台說明 | 推薦情境 |
|---|---|---|---|
| `resume-experience` | 工作經歷 | 以時間軸呈現多筆工作經歷（公司、職位、時間、職責） | 個人品牌、求職、顧問資歷 |
| `resume-education` | 學歷模組 | 以時間軸呈現多筆學歷（學校、科系、學位與時間） | 學術、講師、專業人士 |
| `resume-skills` | 技能清單 | 條列專長技能，可附熟練度標籤 | 接案者、工程師、設計師 |
| `resume-certificate` | 證照／獎項 | 列出專業認證與獲獎紀錄 | 醫美、教練、財務、設計得獎 |
| `projects-list` | 作品專案（自動同步） | 自動列出「品牌內容 › 作品專案」已發布的作品，新增作品不必改模組；可設顯示數量與格狀／列表樣式 | **作品 10 件以上一律用這個**；可依分類分頁 |
| `portfolio-gallery` | 作品集圖庫（手動貼圖） | 手動貼多張作品圖片網址並排展示，不會連動作品專案工具 | 1–10 件精選圖牆 |
| `portfolio-featured` | 精選作品（手動單件） | 手動填單件大圖＋描述，突顯代表作 | 一件代表作放首屏 |
| `portfolio-case` | 案例研究（手動單篇） | 手動填寫單一專案的客戶、角色、成果，深度呈現 | 顧問／設計的深度案例 2–3 篇 |
| `commission-info` | 委託資訊 | 同上 | 繪師接稿頁 |

### 媒體嵌入（purpose_media）
| moduleId | 名稱 | 後台說明 | 推薦情境 |
|---|---|---|---|
| `video` | 影片播放器 | 嵌入 YouTube／Vimeo 影片 | 品牌形象片、課程試看、一支主打 MV |
| `playlist` | 播放清單 | 多支影片列表 | 系列教學、Vlog 合集 |
| `shorts` | 短影音列 | 直式短片列表 | Reels／Shorts 精選 |
| `live-embed` | 直播嵌入 | YouTube／Twitch 直播頻道 | 實況主、固定直播時段 |
| `social-post` | 社群貼文嵌入 | 單則 IG／X／Threads 貼文嵌入 | 置頂貼文、爆紅貼文、合作公告 |
| `music-showcase` | Smart Link | 彙整 Spotify／Apple Music／YouTube／KKBOX／街聲等連結；貼一個連結自動解析或手填 | 音樂人單曲／專輯發行頁（舊版 `smart-link` 已隱藏） |
| `music-player` | 音樂播放器 | 上傳多首歌曲，wavesurfer 波形或 meyda 頻譜視覺化，可加 LRC 同步歌詞 | Demo 試聽、獨立音樂人、Podcast 片段 |
| `store-map` | 門市地圖 | 實體據點地圖與營業資訊 | 餐飲、門市、工作室；`mapUrl` 留空自動用地址產生 |

### 小遊戲（purpose_game）
| moduleId | 名稱 | 後台說明 | 推薦情境 |
|---|---|---|---|
| `tetris` | 俄羅斯方塊 | 經典俄羅斯方塊：7 種方塊、消行加分、隨等級加速；鍵盤與畫面按鈕可操作，結束可留暱稱進排行榜（每人取最高分） | 活動現場競賽、社群挑戰週 |
| `snake` | 貪食蛇 | 經典貪食蛇：吃到食物加分並變長，速度隨長度加快；排行榜同上 | 同上，手機友善 |
| `basketball` | 籃球機 | 夜市籃球機：限時投籃、籃框移動、蓄力出手，時間到結算分數進排行榜 | 夜市／運動品牌、市集活動 |
| `gameboy` | GameBoy | 復古掌機外殼＋卡帶「超級瑪麗」（原創橫向平台跳躍），分數進排行榜 | 復古／潮流品牌的彩蛋頁 |
| `piano` | 電子琴 | tone.js 可彈奏鍵盤：橫式／直式、1–3 個八度、五種音色；調性高亮與順階和弦；內建 Loop Station | 音樂教室、樂器行、音樂人互動 |
| `pixel-paint` | 像素小畫家 | 復刻 Windows XP 小畫家的像素繪圖畫布，可下載 PNG | 插畫家、像素風品牌、活動塗鴉牆（**不持久化**） |

### 社交互動（purpose_social）
| moduleId | 名稱 | 後台說明 | 推薦情境 |
|---|---|---|---|
| `pitch-card` | 快速 Pitch | 線下交友／聚會 60 秒認識我：簡報預設同步品牌頁（開場頭像／品牌名／簡介，可開關商店精選、活動、課程、作品、專欄、社群），可插多張自訂圖片頁，結尾品牌頁 QR＋社群 QR；另可加最多 3 個七段式 pitch；「我有興趣」留 Email／LINE 進名單並通知；🔥／🤔 反應；HypeCard 碰卡或 `?focus=module&i=` 直接進簡報 | 創業者聚會、交換名片、展會攤位、HypeCard 落點 |
| `friend-quiz` | 好友挑戰 | 出關於自己的題目與正確答案，朋友作答看誰最了解你，後端計分＋排行榜；可設加入會員後才看結果、下載 IG 直式結果圖；後台有 KPOP／動漫／電影／食物／品牌／旅遊／穿搭／偶像／遊戲／朋友範本 | 粉絲互動、生日／週年活動、社群同樂 |
| `friend-impression` | 朋友眼中的我 | 標籤池讓朋友挑 3 個＋印象題，可匿名；統計最常被貼的標籤與各題分布成結果卡 | 個人品牌定位調查、KOL 人設回饋 |
| `friend-tier` | 喜好排行大挑戰 | 品牌主排自己的喜好順序，朋友猜順序，算默契度％＋排行榜 | 偶像／動漫／食物喜好比拚、粉絲默契賽 |
| `similarity` | 我們有多像？ | 品牌主先答一遍，朋友答同一組題，算整體相似度與各面向％ | 交友破冰、社群配對、粉絲相似度 |

> 社交互動五個模組都支援：IG 風漸層動態背景、「加入會員後查看結果」門檻、下載結果圖；訪客資料存後端（`module-social` / `module-pitch`）。

### HypeLink 系統模組（tab_brand_content）
讀取後台既有資料：`news-list`（最新消息：列表／卡片／跑馬燈）、`articles-list`（文章：卡片／雜誌／列表）、`event-list`（活動：可顯示報名入口）、`event-timeline`（活動歷程時間軸，累積信任感）、`team-members`、`projects-list`、`mall-products`、`mall-reviews`、`course-list`、`brand-services`、`reservation`、`music-showcase`、`file-vault`（檔案保險箱：密碼／會員／會員等級解鎖，最多 5 檔、單檔 ≤ 30 MB，**檔案需 dashboard 上傳**）、`digital-goods`、`coupon-claim`、`brand-points-status`（品牌點數介紹卡，會員登入可見餘額）。
互動寫回後台：`guestbook`、`quick-poll`、`qna-box`、`inquiry-form`、`pitch-card`、`friend-quiz`、`friend-impression`、`friend-tier`、`similarity`。
> 推薦情境：品牌已經在用某個 HypeLink 工具（商城／課程／活動／作品／CRM）時，優先放對應系統模組而不是手填模組，之後新增內容不用回來改品牌頁。

### 其他擴充（purpose_other）
| moduleId | 名稱 | 後台說明 | 推薦情境 |
|---|---|---|---|
| `divider` | 分隔線 | 視覺區隔兩個區塊 | 段落之間留白 |
| `hypelink-link` | HypeLink 連結 | 連結到另一個公開 HypeLink 品牌頁，以品牌卡片顯示 | 母品牌↔子品牌、合作夥伴互連、Teams 組織成員 |
| `digital-card` | 數位名片 | 聯絡資訊集中卡片（後台已隱藏，改用 `save-contact`） | — |
| `save-contact` | 加入聯絡人 | 一鍵把品牌聯絡資訊存進手機通訊錄（vCard），備註可附加入時間與品牌頁連結 | 每個「聯絡我們」分頁收尾、名片替代 |
| `copy-text` | 可複製文字區塊 | 標題＋內文，尾端附複製 icon，點擊即複製 | 匯款帳號、折扣碼、Wi-Fi 密碼、Discord ID |
| `faq` | 常見問答 | FAQ 折疊問答清單，降低重複詢問 | 服務／課程／活動頁必備收尾 |

### 情境 → 模組組合建議
- **實體店／餐飲**：richtext(關於)＋richtext(菜單) → text-btn(訂位) 或 reservation → image-carousel → store-map → line-add-friend → mall-reviews／testimonial → faq → save-contact。
- **個人品牌／顧問／講師**：bio → testimonial → brand-services／course-list → resume-experience → resume-skills → projects-list → inquiry-form／booking → faq → social-card。
- **音樂人／偶像**：countdown → music-showcase → tour-schedule → album-wall → video／shorts → member-recruit → quick-poll／qna-box → line-add-friend。
- **繪師／設計接案**：portfolio-featured → projects-list → commission-info → picture-book／image-carousel → inquiry-form → copy-text(匯款) → guestbook。
- **電商／品牌商城**：banner-h → mall-products(分類) → coupon-claim → mall-reviews → member-recruit → brand-points-status → faq。
- **活動／社群同樂**：event-list → countdown → quick-poll(手動揭曉) → 小遊戲一款 → guestbook → friend-quiz → email-capture。
- **線下交友／展會**：pitch-card(HypeCard 落點) → save-contact → similarity／friend-impression → social-card。

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
5. **模組上限**：所有方案統一 99 個；**分頁至少保留一個**。
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
