# 拆解參考網站 → HypeLink 官網

使用者說「我想要像 https://… 那樣」時用這份。目標是**借結構與節奏，不借內容**：
版面可以像，文案、圖片、品牌名一律換成使用者自己的（或改寫成原創示範），不複製對方的字、圖、Logo。

## 流程

### 1. 看懂對方（不用寫程式也能做）
打開網址從上捲到下，每一段記四件事：
| 記什麼 | 例 |
|---|---|
| 這段在骨架的哪一格 | Hero／信任帶／是什麼／證據／人／怎麼開始／收尾 |
| 版面長相 | 「置中大標＋四周傾斜漂浮的產品卡」「三欄白卡：照片＋問句標題」 |
| 互動 | 分頁切換、輪播、hover、漂浮動畫 |
| 底與材質 | 白底／淡灰面板／深色漸層卡／滿版照片 |

同時抓整站的**氛圍三件事**：深淺、醒目色（SaaS 常是主色＋副色兩個）、材質；以及字體感覺（黑體／宋體／幾何英文）、頁尾樣式。

### 2. 逐段對到區塊
先查 `references/blocks.md` 的「長什麼樣」，找最接近的；沒有完全一樣的就用最接近的，**不要為了像而塞好幾個區塊拼一段**。

| 你在參考網站看到 | 用這個區塊 |
|---|---|
| 滿版照片／影片＋大字 | `immersiveHero`（layout: left／center／corners／bottom） |
| 柔和漸層面板、置中標題、四周漂浮傾斜的產品畫面卡 | `floatingUiHero`（卡片：數字／清單／進度／表格） |
| 產品視窗、流程畫布 | `workflowHero` |
| 3D 模型主視覺 | `modelHero`／`modelStage` |
| 單屏 bento（標題＋表單＋媒體） | `bentoHero` |
| 巨型出血字 | `wordmarkBleed` |
| 「核心理念 Core Problem」＋三張照片問句卡 | `questionCards` |
| 淡色面板＋圖示膠囊分頁＋左文右截圖 | `featureTabsPanel`；無面板的置中分頁 → `tabsShowcase` |
| 左右交錯的圖文功能 | `splitFeature` |
| 不規則格子卡 | `bento` |
| 人物去背＋光暈＋一排「即將推出」卡 | `spotlightRoadmap` |
| logo 牆／跑馬燈 | `logoGrid`／`marquee`／`integrationTiles` |
| 大數字一排 | `statBand`；儀表板 widget → `signalsBoard` |
| 作品卡牆、橫向捲動作品 | `portfolioCards`／`galleryTrack`／`revealColumns` |
| 前後對比 | `imageCompare`／`compareWall` |
| 實景圖上的熱點標價 | `shoppableImage` |
| hover 大字分類＋預覽圖 | `catalogueList` |
| 三方案定價 | `pricing`；滑桿估價 → `runMeter`；不標價只講影響因素 → `pricingGuide` |
| 客戶評價 | `testimonialSwitch`／`reviewCards` |
| FAQ | `faqList`（可讀 SEO 問答） |
| 深色圓角卡＋光暈的收尾 CTA | `glowCta`；滿版收尾 → `ctaBand` |
| 一句宣言、滿版少字 | `bigStatement`／`statement` |
| 申請／聯絡表單 | `form`（官網上可送出，進詢價收件匣＋CRM） |
| 服務大類＋三個子項的白卡 | `serviceCategoryCards` |
| 「當公司…您會需要…」情境對服務 | `serviceFinder` |
| 我們 vs 一般業者的比較表 | `compareVsTable` |
| 段落開頭超大單字＋上標數量（Projects.⁽²⁴⁾） | `giantWordHeader` |
| 設計師專案索引（名稱, 類別, 年份＋瀑布圖） | `projectIndexGrid` |
| 一案一屏、背景模糊、中央直式圖 | `cinemaCases` |
| 編號服務列、點開變深色面板（含起價） | `expandServiceRows` |
| 直式照片疊大編號、捲動升起 | `riseCards` |
| 見證附兩格成效數字 | `caseResultCards` |
| 兩行巨字＋中間浮人物預約卡 | `wordmarkCardHero` |
| 字裡面填照片的大字 Hero | `imageFillWordmark` |
| 活動票根條／多日議程 | `ticketStrip`／`agendaStairs` |
| 出血圓角黑卡、只圓上緣面板、格線／顆粒、細框 | 任何區塊加 `sx`（見 SKILL.md 7.5） |
| 總所／分所多據點聯絡 | `officeDirectory` |
| 合夥人／律師直式人像（含證照） | `partnerPortraits` |
| 國稅局、商工登記等常用連結 | `resourceLinks` |
| 一列式頁尾（logo · 連結 · 版權） | `footer.layout: "minimal"` |
| 段落交界是波浪／一排半圓（扇貝）／拱形 | 任何區塊加 `sx.edgeBottom`／`edgeTop`（wave／waves／scallop／arch／curve／tilt） |
| 圖片裁成不規則有機形、拱門、圓、橢圓（＋細金框） | `sx.imgShape`（＋`imgRing`）；列表卡片用 `hlContent.style.imageShape` |
| 標題左右兩片葉子、標題下一條波浪線 | `sx.headingDeco: leaf`／`squiggle`（或 `headingDecoUrl` 放自己的裝飾圖） |
| 紙張紋理底、上下兩色底 | `sx.texture: "paper"`、`sx.splitColor`＋`splitAt` |
| 左標語＋右側色塊上輪播去背商品、後方淡色英文大字 | `spotlightCarousel`（白底照片開 `knockoutWhite`） |
| 內頁頂端「About／關於我們」大字＋右側有機形圖 | `ornamentHeader`＋`sx.edgeBottom:"scallop"` |
| 一張超寬圓角照片輪播，箭頭在下緣 | `photoSlider` |
| 圓形徽章（麻布紋圓環裡放 service＋標題＋線稿） | `badgeCards` |
| 每間店一張卡：地圖＋地址／時間／電話＋社群 | `storeLocator` |
| 商品型錄左側直排分類 | `hlContent { filterTabs:true, filterLayout:"sidebar" }` |
| 右下角固定的 FB／IG／LINE 圓鈕 | `theme.floatingActions`（小工具） |
| 頁尾嵌地圖、自訂版權字 | `footer { layout:"contact", mapQuery, copyright }` |
| 淺灰底＋白卡、無陰影、等寬小字「ALL NEWS →」「READ MORE ↗」的工作室站 | 工作室檔案區塊（下列六個），頁面 `layout.containerWidth:"full"` |
| 左下角一疊白卡當 Menu（介紹＋品牌＋連結＋在地時間／社群），捲動後收起 | `menu { layout:"dock", dock:{ intro, timezone, city, links } }`（手機自動回頂欄） |
| 滿版橫向大圖軌慢慢往左捲、每張右上角一張霧面標題卡 | `captionReel` |
| 三欄瀑布流消息白卡（上圖下文／左圖右文／純文字混排） | `newsMasonry` |
| 作品卡：圖下左標題＋灰副標、右側白色分類膠囊 | `tagProjectGrid`（`source:"projects"` 直接讀作品專案） |
| 一張一屏、左中右錯位的作品片段＋右上年份點點捲軸 | `fragmentStream` |
| 圓角跑道上的編號流程節點、上排黑色階段膠囊、下方說明輪播 | `strategyLoop` |
| 關於頁：左固定照片輪播＋介紹，右捲動團隊／客戶／服務／職缺／聯絡，右上段落導覽 | `studioDossier` |
| 大標後半灰、關鍵詞一個顏色 | `sx.titleTone: "muted-tail"`（標題寫 `A \| B`）／`"accent-word"`（`*詞*`） |
| 等寬字眉標 `● REC`、`( 01 )`、`■`、`/` | `sx.eyebrowStyle: dot|bracket|square|slash|mono` |
| 文字＋↗＋底線的按鈕；方角按鈕；細框按鈕 | `sx.btnStyle: underline|square|outline` |
| 標題逐行上滑／逐詞淡入／模糊轉清晰／亂碼解碼／打字／掃光 | `sx.titleFx` |
| 卡片滑過抬起／放大／掃光／3D 傾斜／聚光／發光邊／其餘變暗 | `sx.hoverFx` |
| 卡片圓角 0 或 20、1px 淡邊框、無陰影、gap 0–8 | `sx { cardRadius, cardBorder, cardBorderColor, cardShadow, gap }` |
| 滑過作品時游標變成「VIEW」膠囊 | `effects.cursor:"follow"`＋`sx.cursorLabel` |
| 頂欄捲動後縮成置中膠囊 | `menu.shrinkOnScroll:true` |
| 只有品牌＋底部置中漢堡圓鈕 | `menu { alwaysMobile:true, burgerPos:"bottom" }`＋`mobileMenu.preset:"stage"` |
| 品牌＋MENU 鈕 → 右側抽屜 | `menu.alwaysMobile:true`＋`mobileMenu.preset:"drawer"` |
| 左側固定側欄當導覽 | `menu.layout:"side"`＋`dock { intro, links }` |
| 頂欄文字走過深淺段落自動反色 | `menu.blend:"difference"` |
| 導覽連結逐字翻字 | `menu.linkHover:"flip"` |
| 頂欄活時鐘／城市、「剩 3 個名額」狀態 | `menu.clock`／`menu.status` |
| 右緣直排頁名＋進度線 | `motion.progressRail:true` |
| 分類側欄：膠囊／底線樣式、放右邊、筆數、搜尋框、底部聯絡 | `hlContent { filterLayout:"sidebar", sidebarStyle, sidebarPosition, sidebarCounts, sidebarSearch, sidebarFooter }` |
| 品牌名 160–300px 撐滿的 Hero（描邊／跑馬） | `giantWordmarkHero` |
| 滿版圖四角各一組資訊 | `cornerInfoHero` |
| 一案一屏釘住、巨型數據或浮水印大字 | `pinnedCaseScreens` |
| 細線分隔列（logo／標題／meta／標籤，hover 浮圖） | `ledgerRows` |
| 年份／單位／獎項細線表 | `awardsTable` |
| 兩列反向圖示膠囊跑馬 | `iconPillMarquee` |
| outline 數字膠囊／照片大數字卡＋數據列 | `statPills` |
| 置中大標＋傾斜便利貼／拍立得 | `stickerHero` |
| 全寬色塊卡堆疊、左上斜角 tab | `folderTabCards` |
| 左半醒目色巨字、右半滿版人像 | `splitPosterPanel` |
| 左固定人物名片＋右內容流 | `profileRail` |
| 拱形頂直式圖卡列 | `archImageStrip` |
| 球面照片牆可拖曳 | `domeGallery` |
| 上 UI 截圖下說明的橫向拖曳卡 | `uiFeatureCarousel` |

### 3. 決定全站外觀
- **Menu 與載入畫面**：Menu 是否固定、是否透明疊在首屏、往下捲會不會收起、桌機是否只有漢堡鈕；進站時有沒有載入畫面、長什麼樣、怎麼離場。判斷方法與對應設定見 `migrate-existing-site.md` §1「Menu 與載入畫面」。
- 找 `references/templates.md` 裡氛圍最接近的範本，`site.apply_template { key, applyTheme:true, mode:"append", dry_run:true }` 只為了拿外觀，或直接 `site.update { theme, footer }` 設。
- 雙色系統（主色＋副色）：頁面 `theme.primary`＝主色、`theme.accent`＝副色；`floatingUiHero`／`questionCards`／`featureTabsPanel`／`spotlightRoadmap`／`glowCta` 會用副色做眉標、副標與漸層按鈕。
- 字體：參考站用思源黑體就選 `Noto Sans TC`；英文幾何感選 `Inter`／`Space Grotesk`。

### 4. 改寫內容（最重要）
- 產品／服務換成使用者自己的；沒有就寫一個**虛構但合理**的示範（虛構品牌名、虛構數字），不要留對方的品牌名與數字。
- 文案照 SKILL.md〈文案〉：兩行標題、問句痛點、具體數字、動詞按鈕。
- 圖片全部換：使用者的照片，或用生圖／圖庫取得「同一種攝影語言」的新圖。產品截圖可以先用示意圖，提醒使用者上線前換成真的。

### 5. 結構可以微調
參考站常有的問題順手修掉：
- 首頁少了「證據」或「人」→ 補一段 `statBand` 或評價。
- 只有一頁 → 把定價、功能細節、申請表拆成內頁（`/site/pricing`、`/site/features`、`/site/apply`），首頁按鈕連過去。
- 收尾 CTA 沒有真的表單 → 加一頁 `form`。

### 6. 驗收
桌機、手機各從上捲到下：每段都有東西、沒有空圖、按鈕都會動、分頁切換正常；再對照參考站確認「節奏像」而內容是自己的。

---

## 完整範例：kickflo.app → 「Crewly 排班 SaaS」範本

參考站：專案財務管理 SaaS，白底、靛紫主色＋青綠副色、產品 UI 材質、思源黑體。
改寫：產品換成虛構的「門市／工作室排班與工時工具」，文案與 10 張圖片全部重做。

| 參考站的段落 | 區塊 | 改寫後的內容 |
|---|---|---|
| 漸層面板 Hero，四周漂浮「營收／毛利率／進行中專案／報價項目庫／財務風險」卡 | `floatingUiHero` | 眉標「From plan to payroll.」；標題「每週 10 分鐘，排好整個團隊的時間」；卡片：本週總工時、待確認班表（2 衝突）、今日出勤進度、班別範本、加班警示表、人力成本率 |
| 核心理念 Core Problem ＋三張照片問句卡 | `questionCards` | 「核心痛點 Why Crewly」；「這週的班，誰又跟誰撞了？」等三問 |
| 產品功能：報價試算／財務監控／風險提示／結案復盤 四分頁 | `featureTabsPanel` | 智慧排班／打卡工時／成本警示／薪資試算，各配一張產品示意圖 |
| 「不只是專案管理」＋人物光暈＋勞報單／發票／LINE Bot／Desktop 四欄 | `spotlightRoadmap` | 「不只是排班表，而是團隊的營運中樞」；即將推出：LINE 通知、電子薪資單、多店管理、POS 串接 |
| 深色漸層卡 CTA | `glowCta` | 「讓 Crewly 接手你的排班表」，按鈕連 `/site/apply` |
| 一列頁尾 | `footer.layout:"minimal"` | — |

結構微調：原站只有一頁、CTA 是外部表單 → 拆成四頁：
- **首頁**：上表五段
- **產品功能**：`questionCards`（給店長／員工／老闆）→ `splitFeature`（三步驟上手）→ `integrationTiles`（LINE、Google 日曆、POS…）→ `statBand` → `glowCta`
- **定價方案**：`pricing`（三方案，依人數）→ `faq` → `glowCta`
- **申請試用**：`form`（送出進詢價收件匣＋CRM）

（這個示範範本後來沒有收進範本庫，五個區塊仍可在「SaaS 產品敘事」分類使用。）

---

## 完整範例：法式甜點店官網 → 「Sucré 糖霜甜點」範本（`hl-sucre`）

參考站：Duda 架的甜點品牌站。粉膚色底、金棕醒目色、明體＋黑體，**所有段落交界都是柔邊**（波浪、扇貝），圖片多裁成有機形或橢圓。Menu 是白色圓角膠囊、不固定；沒有進站載入畫面；右下角固定 FB／IG 圓鈕。
改寫：品牌、店名、地址、文案全部原創；照片用 Pexels（可商用）＋自繪線稿插圖（來源記在 `Assets/GetLayers/templates/hl-sucre/CREDITS.md`）。

| 參考站的段落 | 區塊／設定 |
|---|---|
| Hero：左標語＋細框鈕，右側粉色色塊上輪播去背甜點，後方白色襯線大字、星芒 | `spotlightCarousel`（`knockoutWhite`）＋`sx.edgeBottom:"wave"` |
| EVENT 最新活動：四張橢圓金框圖卡、置中明體標題 | `hlContent { source:"articles", eyebrow:"EVENT", style:{ imageShape:"oval", imageRing, textAlign:"center", titleFont:"serif", titleAccent:true, columns:4 } }`＋`sx.headingDeco:"leaf"` |
| STORE 店內環境：紙紋底＋下半粉色，一張圓角大圖輪播 | `photoSlider`＋`sx { texture:"paper", splitColor, splitAt:48, headingDeco:"leaf" }` |
| TEAM：不規則形照片＋右文 | `splitFeature`＋`sx.imgShape:"blob1"` |
| 立即預約：滿版甜點照上一張霧面卡 | `glassPanel`（不放 `imageUrl` 就只排文字、置中）＋背景圖＋`sx.edgeTop:"wave"` |
| 頁尾：logo＋聯絡＋社群＋地圖＋版權列 | `footer { layout:"contact", mapQuery, copyright, bgColor }` |
| 內頁頂端 About／Dessert／Locations 大字＋扇貝下緣 | `ornamentHeader`＋`sx.edgeBottom:"scallop"` |
| 關於：五個圓形服務徽章 | `badgeCards`（3＋2） |
| 甜品專區：左側分類欄＋圓形商品圖 | `hlContent { source:"projects", filterTabs:true, filterLayout:"sidebar", sidebarImageUrl, style:{ imageShape:"circle", … } }` |
| 門市據點：每間店地圖卡 | `storeLocator` |
| 右下浮動社群鈕 | `theme.floatingActions` |

參考站本身的問題順手修掉：Menu 連結太多時在 HypeLink 會自動收成漢堡；甜點牆用作品專案資料（不寫死）、活動用專欄文章，之後新增不用改頁面。

## 完整範例：台北品牌設計工作室官網 → 「Lowtide 退潮設計室」範本（`hl-lowtide`）

參考站：Next.js 自架的品牌／創意工作室站。整站只有三種顏色——淺灰頁底 `#ECEDEF`、白卡、近黑字，**沒有陰影、沒有醒目色**；卡片 10px 圓角、間距 22px；小標與連結用等寬字大寫（ALL NEWS ARTICLES →、READ MORE ↗）。**沒有頂欄**：Menu 是左下角一疊白卡，捲動後收成品牌一列。內容滿版、左右只留 22px。
改寫：工作室名、人名、客戶名、職缺與文案全部原創；照片用 Pexels（可商用，已排除真實品牌標籤、真實招牌），來源記在 `Assets/GetLayers/templates/hl-lowtide/CREDITS.md`。

| 參考站的段落 | 區塊／設定 |
|---|---|
| 左下角白卡：一句介紹、品牌名、四個連結、當地時間＋IG／FB | `menu { layout:"dock", dock:{ intro:"第一行粗體\n其餘灰字", timezone:"Asia/Taipei", city:"TAIPEI", links:[{label,url}] } }` |
| 首屏：滿版橫向大圖軌（直橫混排）自動慢捲、右上霧面卡寫新聞標題 | `captionReel { items[{ imageUrl, width:"normal"|"wide", title, text, url }], height:84, speed }`，`padTop:0` |
| 最新消息：三欄瀑布流白卡 | `newsMasonry { title, linkText, linkUrl, items[{ variant:"tall"|"side"|"text", … }] }` |
| 精選作品：3:2 圓角圖＋分類膠囊 | `tagProjectGrid { ratio:"wide", items[{ title, subtitle, tags }] }`；正式站改 `source:"projects"` |
| Fragments：一張一屏錯位長捲＋右上年份捲軸 | `fragmentStream { items[{ imageUrl, title, date, year }] }` |
| About：Core Strategy 跑道圖（Research → Design，五個節點） | `strategyLoop { stages:["研究","設計"], nodes[{ label, title, text }] }` |
| About：左固定照片右捲動的 Team／Clients／Services／Career／Contact，右上段落膠囊 | `studioDossier { images, intro, panels[{ id, kind:"people"|"list"|"columns"|"jobs"|"contact", … }] }` |
| 頁尾：幾乎沒有 | `footer { layout:"minimal", bgColor:"#ECEDEF" }` |

做法重點：
- 這種「材質就是設計」的站，**整頁都要同一個底色**：每個區塊 `bg.color` 與全站 `background` 都設成同一個淺灰，頁尾也是，白卡才會浮出來。
- 頁面主題用 `theme(accent, "light", { layout:{ containerWidth:"full" } })`，否則內容被限制在 1200px，跟滿版圖軌對不齊。
- 左下 dock 會蓋住頁面左下角：重要的按鈕別放在區塊左下；手機版 dock 不出現、用一般頂欄。
- 職缺用 `studioDossier` 的 `jobs` 段落（可展開、Apply 連到 mailto 或表單頁），錨點 `id:"jobs"` 讓首頁消息卡可以連 `/site/about#jobs`。
