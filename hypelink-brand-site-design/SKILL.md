---
name: hypelink-brand-site-design
description: 設計並製作 HypeLink「品牌官網」（/@id/site）的方法手冊 — 先定氛圍三件事（深淺／一個醒目色／材質），再用七段骨架排首頁、從 126 種區塊挑對的、背景三層規則、繁中文案、圖片提示詞、內容頁與頁尾、站內連結與表單、動畫與上線檢查；含「拆解參考網站變成範本」的流程與產業藍圖。當使用者要做／改版官網、想要「像某某網站那樣」、要挑範本或排版、或覺得官網不好看時使用。工具參數見 hypelink-brand-page-mcp。
---

# Skill：品牌官網的設計與製作方法

把官網做得「像一套」而不是區塊拼貼。這份是**怎麼想、怎麼排、怎麼驗**的手冊；
每支工具的參數在 `hypelink-brand-page-mcp`（官網那一節：`site.*`）。

> **先確認方案：用 MCP 製作官網（`site.*`）限 Max 方案（含 Enterprise）。** 第一支 `site.get` 若回 `PLAN_REQUIRED`，就停下來告訴使用者需升級 Max，別繼續規劃整套官網。

## 何時使用
- 「幫我做一個官網」「把官網改得專業／好看一點」
- 「我想要像 https://… 那樣的網站」→ 走〈拆解參考網站〉
- 「我是 SaaS／餐廳／設計師／顧問…，官網要怎麼排？」→ 看〈產業藍圖〉
- 「哪個範本適合我？」「這段要用什麼區塊？」

## 分工
| 需求 | 用哪個 |
|---|---|
| 官網的設計方法、版面、區塊選擇（本 skill） | `hypelink-brand-site-design` |
| `site.*`／`assets.*`／`projects.*` 的參數與錯誤碼 | `hypelink-brand-page-mcp` |
| 品牌頁（link-in-bio，`/@id`）的分頁與模組 | `hypelink-rich-brand-page` |

參考檔（需要時再讀）：
- `references/blocks.md` — 126 種區塊：長什麼樣、建議項數、標籤字數（自動產生）
- `references/templates.md` — 92 個範本：產業、深淺、醒目色、用途（自動產生）
- `references/decompose-reference-site.md` — 把參考網站拆成區塊與範本的流程＋完整範例
- `references/blueprints.md` — 產業藍圖、內容頁設計與頁尾的搭配表

---

## 第 0 步：先問四件事（不要直接開做）
1. **給誰、做什麼生意**（產業、客群、價位）
2. **要訪客做什麼**：買東西／預約／留名單／申請試用／看作品／加 LINE ── 這決定每頁的主按鈕
3. **深色還淺色、既有品牌色**（沒有就從產業推薦，見〈氛圍三件事〉）
4. **手上有什麼素材**：照片、作品、商品、Logo、客戶評價、數字

問完先用 `site.get` 看現況（有沒有啟用、已有哪些頁），再決定走哪條路。

## 三條路，挑一條
| 路 | 什麼時候 | 怎麼做 |
|---|---|---|
| **A. 套範本再改字**（最快） | 使用者沒有特定參考、要快速上線 | `site.templates.list { category }` 挑 1–2 個 → `site.apply_template { key, dry_run:true }` 給他看會變成哪些頁 → 正式套用 → 逐頁改文案、換圖 |
| **B. 拆解參考網站** | 使用者給了想模仿的網址 | 讀 `references/decompose-reference-site.md`：逐段對到區塊、改寫文案與圖片，結構可微調 |
| **C. 從零拼** | 範本都不對、或只要加一兩頁 | 依下面的方法挑區塊，`site.blocks.catalog { q }` 拿 `blank` 改內容，`site.pages.create／update` 寫入 |

就算走 C，也先找一個「氛圍最接近的範本」用 `applyTheme` 只拿外觀（主色、字體、背景、Menu、內容頁設計、頁尾），比自己調十個設定一致得多。

---

## 1. 氛圍三件事：先寫下來，再選區塊
| 決定 | 選項 | 會影響 |
|---|---|---|
| **深淺（tone）** | 淺／深／深淺交替 | 每頁 `theme.mode`、`footer.scheme`、區塊 `bg.textLight` |
| **一個醒目色** | 只有一個（SaaS 可主色＋副色兩個），其他全中性 | `theme.primary`（＋`theme.accent` 副色）、按鈕、眉標、強調字 |
| **材質語言** | 玻璃（深色半透明板）／紙（米白、細線、襯線字）／攝影（滿版照片）／場景（全站 3D／粒子背景透出）／產品 UI（白卡陰影、柔和漸層） | 區塊底 `bg` 用哪一種、內容頁設計、頁尾版型 |

三者一致就會「像一套」。最常見的失敗：深色 hero 接一段米白紙感、再接一段霓虹玻璃 ── 三種材質混用，看起來像拼貼。

產業起手式：SaaS＝淺＋靛藍／翡翠綠＋產品 UI；餐飲＝淺米＋番茄紅／橄欖綠＋攝影＋紙；設計工作室＝深＋一個燒橙／螢光色＋攝影；顧問／個人＝淺＋海軍藍＋紙；活動＝深＋螢光桃紅＋舞台攝影＋玻璃。

## 2. 首頁節奏：七段骨架（可刪，不要亂序）
| # | 段落 | 要回答 | 常用區塊 |
|---|---|---|---|
| 1 | **Hero**（約一屏） | 你是誰、能幫我什麼、下一步按哪裡 | `immersiveHero`、`wordmarkCardHero`、`imageFillWordmark`、`floatingUiHero`、`workflowHero`、`bentoHero`、`modelHero`、`wordmarkBleed`、`kineticHeadline` |
| 2 | **信任帶**（薄） | 有誰在用／合作過 | `marquee`、`logoGrid`、`integrationTiles`、`tileLinks`、`announcementBar`、`socialProof` |
| 3 | **是什麼／痛點** | 解決什麼問題、有哪些功能或服務 | `expandServiceRows`、`riseCards`、`serviceCategoryCards`、`serviceFinder`、`questionCards`、`splitFeature`、`bento`、`featureTabsPanel`、`tabsShowcase`、`serviceRows`、`featureLedger` |
| 4 | **證據** | 憑什麼相信你 | `cinemaCases`、`projectIndexGrid`、`caseResultCards`、`compareVsTable`、`statBand`、`statsPanel`、`portfolioCards`、`galleryTrack`、`imageCompare`、`compareWall`、`shoppableImage`、`catalogueList` |
| 5 | **人** | 誰在做、客戶怎麼說 | `partnerPortraits`、`team`、`testimonialSwitch`、`reviewCards`、`proof` |
| 6 | **怎麼開始／怎麼買** | 流程、價格、常見疑問 | `steps`、`timeline`、`pricing`、`pricingGuide`、`runMeter`、`faqList`、`spotlightRoadmap`（即將推出） |
| 7 | **收尾** | 現在就行動 | `glowCta`、`ctaBand`、`subscribeBar`、`form` ＋ 全站頁尾 |

**呼吸段**：每兩個資訊密集段之間，插一個少字、滿版的段落（`bigStatement`、`statement`、`wordBand`、`pixelPanel`），節奏感就出來了。
**一頁最多一個「重互動」區塊**（3D、游標效果、拖曳環），兩個以上會互搶注意力，手機也會變慢。

挑區塊時先讀 `references/blocks.md` 的「長什麼樣」，項數照「建議項數」，項目標題不超過「標籤字數」，超過容易換行難看。

## 3. 背景三層：全站背景 → 區塊底 → 內容
- 全站背景用 **3D／粒子場景** 時，區塊底一律透明或半透明玻璃，**不要再鋪照片**，否則場景白做。
- 用 **攝影** 時，照片只放三處：hero、一個中段滿版、收尾。其他段用純色或淡色（`tint`），照片太多會像相簿。
- 照片上的字：overlay 0.2–0.35 保留照片、0.45–0.6 以字為主；白字（`textLight:true`）只在 overlay ≥ 0.3 或深色照片上。
- 亮照片配白字時用「文字所在側」漸層：文字靠左＝`overlayStyle:"left"`，比整片加深好讀又不壓暗照片。直式照片放橫幅用 `focusY`（0＝保留上緣）決定保留哪一段。
- 淺色場景上的區塊用白玻璃 `{ color:"rgba(255,255,255,0.72)" }`，不要用深玻璃。
- 「產品 UI」類區塊（`floatingUiHero` 的漂浮卡、`questionCards`、`spotlightRoadmap` 的卡列）本身就是白卡，放在白底或淡色底上最好看。

## 4. 文案：繁中改寫，不是翻譯
- **標題兩行**：第一行主張、第二行收尾（`headline2` 或換行）。「交接的工作，／自己跑完。」勝過一行長句。
- **數字要具體**：「91 件施工紀錄」「平均 6 小時」，不要「多年經驗」「大幅提升」。
- **英文眉標可以留**（"From plan to payroll."、"(02) — Catalogue"），編輯感來源；中英雙眉標（`eyebrow`＋`eyebrowEn`）適合 SaaS／品牌敘事。
- **一個站一種口氣**：工匠＝短句事實；生活風格＝詩意換行；SaaS＝問句痛點＋具體成果。
- 痛點用**問句**（「這週的班，誰又跟誰撞了？」），比「排班衝突偵測」更讓人有感。
- 按鈕用動詞＋結果：「免費試用 14 天」「預約丈量」「看作品」，不要「了解更多」。

## 5. 圖片：同一種攝影語言
- 先用使用者自己的照片；沒有就請他用會生圖的 AI 或圖庫（Unsplash／Pexels）取得，拿到公開網址後 `assets.upload { url }` 存進品牌空間再用。
- 生圖提示詞五要素：**主體＋材質＋光線＋色調＋構圖**；hero 圖要寫「留白給標題」（例：large calm negative space on the left）；結尾加 `no text, no logos, no watermarks`。
- 全站同一種攝影語言（同色溫、同光線、同後製），例如「全部 warm greige backdrop, soft side light」。
- 比例跟著區塊：hero 16:9／21:9、卡片 4:3、人像 4:5／3:4、頭像 1:1、產品截圖 16:10。
- 放在光暈或彩色底上的**人物去背圖**要真的透明（PNG／WebP alpha）；生圖的「白底」常是 #F3F5F5 之類的淺灰，直接放會出現方框。
- 圖片不能留空 URL ── 公開頁會出現「加入圖片」佔位。

## 6. 內容頁與頁尾：跟材質一致
內容頁（作品專案、商店、專欄、最新消息、課程、服務項目）由 `site.update { theme:{ contentDesign } }` 決定長相；頁尾由 `footer.layout` 決定。搭配表見 `references/blueprints.md`。原則：
- 作品集用 `list: editorial` 或 `masonry`（作品要大），文字類用 `rows`，產品／SaaS 用 `card: lift`＋`radius: xl`＋`header: band`。
- **首尾呼應**：深色滿版 hero 配 `mega`／`photo` 頁尾；淺色紙感配 `minimal`／`stacked`；SaaS 配 `minimal`／`newsletter`／`panel`。

## 7. 讓訪客「做事」：連結、表單、會員
- **站內連結**：區塊按鈕的網址寫 `/site/<頁面 slug>`（例：`/site/apply`、`/site/pricing`），會自動換成官網實際網址（自訂網域也正確），同分頁開啟。外部網址會開新分頁。
- **表單區塊** `form`：官網上可直接送出（姓名、公司、Email／電話至少一項、需求說明），進後台「服務報價 › 詢價」收件匣、寄站內通知＋Email、自動建立 CRM 潛在客戶。`title` 會附在留言前面，讓品牌分得出是哪個表單（例：「申請試用」「預約丈量」）。品牌在服務報價設定關閉「接受詢價」時表單會被拒。
- **詢價單**：有作品專案或服務項目內容頁時，Menu 右上自動出現「詢價」。
- **會員**：`site.update { memberPageEnabled }`（預設開）＝右上角登入／帳號選單＋官網內會員中心 `/site/member`；不做會員的品牌（純形象、B2B）可關掉。
- **電話**：B2B 或電腦訪客多的站用 `contact.phoneLinkMode: "mobileOnly"`，電腦上不會跳 FaceTime。

## 7.5 進階樣式 `sx`：最後一哩的微調
任何區塊都能帶 `sx`，用來做出參考站的細節，而不必新開區塊：
- **出血圓角卡**（深色段落浮在淺色頁上）：`sx: { inset: 8, radius: 28 }` 配深色 `bg`。
- **只圓上緣的面板**（深色作品區蓋在淺段上）：`sx: { radius: 32, radiusMode: "top" }`。
- **藍圖格線／底片顆粒**：`sx: { texture: "grid" | "grain", textureOpacity: 0.07–0.12 }`。
- **細框線**：`sx: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }`。
- **單段換醒目色**：`sx: { accent: "#E5241B" }`（只影響這個區塊）。
- **錯位、傾斜**：`translateX/Y`、`rotate`（±15°）——少量使用，一頁一兩處就好。
- **背景光效**：`backdrop: curtain`（直條光幕，AI／SaaS 深色站）、`aurora`、`spotlight`（裝置截圖下方的光暈）、`mesh`。
- **直條紋玻璃／點陣**：`texture: flute | dots`（SaaS hero 背景）。
- **藍圖導軌**：`guides: frame`（新創站的虛線導軌與段落交界）。
- **巨字被下一段壓住**：下一段 `overlapTop: -80`，巨字段 `edgeFade: bottom`。
- **漸層大數字**：`gradFrom`／`gradTo`。
- **整段放大縮小**：`zoom`（字與元件一起）；字距 `letterSpacing`、行高 `lineHeight`、全大寫 `textTransform`。
- **動態**（公開頁才動，訪客「減少動態」時自動關閉）：
  - `delay`（0–2 秒）：讓並排的兩段錯開進場。
  - `scrollFx: parallax | zoom | fade | tilt | recede`＋`scrollFxAmount`（0.2–2）：捲動連動。宣言段用 `fade`、作品大圖用 `zoom`、下一段要蓋上來的段落用 `recede`。
  - `imgHover: zoom | gray | lift`：區塊內所有圖片的滑過效果；攝影／藝廊用 `gray`（黑白轉彩色），商品格用 `zoom`。
  - `loop: float | breathe | sway`：圖片循環動態，只給去背物件或裝飾圖，一頁最多一處。
- 進場種類（`section.entrance` 或 `theme.animation.defaultEntrance`）另有 `clip-up`／`clip-left`（布幕揭開，海報感、藝術祭）、`rise`（長距離緩升，高端）、`tilt`（3D 立起）、`drop`。
- 真的不夠再用 `customCss`（只作用在該區塊，`&` 代表區塊本身）。
原則：`sx` 是微調，不是重做版面；同一頁的圓角、陰影、質感要一致。

## 7.6 Menu 與第一段的關係
首段是滿版主視覺（immersiveHero／projectPlateHero／deviceHero…）或有背景圖時，`theme.menu.overlay: true` 讓 Menu 透明疊在上面（不在 hero 上方留白），捲動後才補回背景；孤島形式（`island`）預設就是疊加。其他選項：
- `overlayText: "light" | "dark"`：透明時的文字色，深色首屏用 light。
- `navAlign: "center"`：連結置中（建築、攝影、精品）。
- `height: "compact" | "tall"`：攝影／藝術祭用 compact，高端住宅用 tall。
- `hideOnScroll: true`：往下捲收起、往上捲出現，長篇作品頁更沉浸。

## 7.7 進站載入畫面與切頁過場
- 頁面 `theme.intro.style`：`curtain`／`counter`／`wordmark`／`split`（上下對開）／`stairs`（階梯升起）／`iris`（圓形收合）／`type`（打字機，`text` 填標語）／`logo`（字首圓標脈動）。通常只放首頁。
- 站內切頁 `theme.animation`（站台層級）：`fade`／`slide`／`zoom`／`blur`（模糊聚焦）／`wipe`（醒目色幕上掀）／`columns`（直欄收合）／`slate`（顯示目的頁標題的字卡）。
- 搭配建議見 document/site-template-design-guideline.md §10.8；一個站各選一種，別每頁不同。

## 8. 動畫與效能
- 進站動畫 `theme.intro.style`（counter／curtain／wordmark）一個站選一種，文字用品牌名；不需要就 none。
- 區塊進場預設開；客戶回報「標題不見」「捲動卡」時先關掉再查：整站 `site.update { theme:{ motion:{ blocks:false } } }` 或單頁 `theme.animation.blocksEnabled:false`。
- 毛玻璃 Menu（`menu.glass`）好看但吃效能；圖多的長頁可改實色 Menu。
- 載入指示器 `theme.loading { enabled, style }` 與品牌一致（logo 脈動最不突兀）。

---

## MCP 施作流程
1. `site.get` → 了解現況；`site.blocks.catalog` 的 `enums` 是所有可設定值（字體、內容頁設計、頁尾、動畫…），**不確定的值先查，不要猜**。
2. 走 A：`site.templates.list { category }` → `site.apply_template { key, mode, applyTheme:true, dry_run:true }` → 使用者同意後正式套用。
   走 B／C：`site.pages.create { title, slug, sections, theme }`；區塊從 `site.blocks.catalog { q:"<type>" }` 的 `blank` 起手改內容。
3. 改文案：`site.pages.get { slug }` 取 sections → 改字 → `site.pages.update { slug, sections }`（**sections 是整組取代**，務必帶回全部區塊）。
4. 換圖：`assets.upload { url }` → 用回傳的網址填進區塊或 `bg.imageUrl`。
5. 全站外觀：`site.update { theme, footer, seo }`（merge）。SEO：`seo.title／description／ogImageUrl`，分享圖建議 1200×630 橫圖。
6. 寫入都先 `dry_run:true` 看 `ignoredFields`／`warnings`，有被忽略的欄位就照訊息修正。
7. 給使用者看草稿（後台「品牌官網 › 頁面設計」即時預覽）→ 確認後 `site.publish`。改壞了用 `site.versions.list`／`site.versions.restore`。

## 上線前檢查
- [ ] 三件事一致（深淺／一個醒目色／一種材質），沒有混搭
- [ ] 首頁有 hero 與收尾 CTA，中間兩個密集段之間有呼吸段
- [ ] 每頁一個主要行動，按鈕都連到東西（`/site/<slug>`、表單、外部網址），沒有空 `ctaUrl`
- [ ] 沒有空圖片網址；同一種攝影語言；去背圖真的透明
- [ ] 項目數在建議範圍內、標籤沒超過字數
- [ ] 文案是繁中改寫、數字具體、標題在標點換行
- [ ] 手機看過（漂浮卡、表格、大字在 390px 寬是否正常）
- [ ] 內容頁設計與頁尾跟材質一致；SEO 標題／描述／分享圖填了
- [ ] `site.publish` 後打開公開頁確認，分享到 LINE／FB 看預覽

## 常見坑
| 症狀 | 原因與解法 |
|---|---|
| 區塊寫進去不見了 | `site.pages.update` 的 `sections` 是整組取代，只帶一個區塊會把其他刪掉；先 `site.pages.get` 再整組寫回 |
| 回 `VALIDATION_FAILED` | 訊息會列出可用欄位或可用值，照改；enum 查 `site.blocks.catalog` 的 `enums` |
| 公開頁沒變 | 寫入都是草稿，要 `site.publish` |
| 照片上的字看不清 | 加 overlay 或改 `overlayStyle` 為文字那一側；淺色照片別配白字 |
| 一頁好幾個 3D／游標效果，很卡 | 一頁只留一個重互動區塊，其他換成靜態區塊 |
| 按鈕連到 hypelink.app 首頁 | 站內頁要寫 `/site/<slug>`，不是 `/<slug>` |
| 換了圖但畫面還是舊的 | 圖片網址有長期快取，換圖要用新網址（重新 `assets.upload`），不要覆蓋同一個檔 |
