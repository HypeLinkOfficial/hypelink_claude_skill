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
