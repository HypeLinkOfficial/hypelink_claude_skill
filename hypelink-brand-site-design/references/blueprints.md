# 產業藍圖與搭配表

每列是「三件事＋首頁區塊順序」，可直接照排；括號是可換的同類區塊。範本 key 見 `templates.md`。

## 首頁藍圖

| 產業 | 三件事（深淺／醒目色／材質） | 首頁區塊順序 | 內頁建議 |
|---|---|---|---|
| **SaaS（產品敘事）** | 淺／靛紫＋青綠／產品 UI | floatingUiHero → questionCards → featureTabsPanel → spotlightRoadmap → glowCta | 產品功能、定價方案、申請試用（form） |
| **SaaS（B2B 財務／工具）** | 淺／翡翠綠／產品截圖 | immersiveHero → marquee（合作夥伴）→ tabsShowcase → statBand → testimonialSwitch → pricing → faqList → ctaBand | 定價、客戶案例 |
| **自動化／開發者工具** | 深／青檸／玻璃 | workflowHero → integrationTiles → bento → runMeter → signalsBoard → ctaBand | 文件、定價 |
| **會計師事務所（傳統）** | 米白／香檳金／紙＋攝影、襯線 | immersiveHero（櫃台實拍＋年資數字）→ imageTextOverlap → serviceCategoryCards → bigStatement → partnerPortraits → hlContent（財稅新知）→ faqList → ctaBand；範本 `hl-meridian` | 服務項目（serviceFinder＋timeline）、關於、聯絡（officeDirectory＋form） |
| **記帳／創業代辦** | 白／暖橘／產品感 | immersiveHero → serviceFinder（依階段）→ compareVsTable → timeline（設立流程）→ serviceCategoryCards → testimonialSwitch → ctaBand；範本 `hl-kite` | 收費方案（pricing＋pricingGuide＋faqList）、團隊（partnerPortraits＋resourceLinks）、免費諮詢（form） |
| **大型所／跨境顧問** | 深海軍藍／冷藍／玻璃＋攝影 | immersiveHero → statBand → serviceCategoryCards（四服務線圖卡）→ bigStatement（洞察問句）→ partnerPortraits → hlContent → ctaBand；範本 `hl-atlas` | 服務與產業、據點與聯絡 |
| **設計工作室／代理商** | 深／一個燒橙／攝影 | immersiveHero（colossal）→ marquee → portfolioCards → bigStatement → serviceRows → team → ctaBand | 作品專案（內容頁）、關於 |
| **室內設計／裝修施工** | 灰米／陶土／空間攝影 | immersiveHero → categoryCards → compareWall → serviceArea → pricingGuide → reviewCards → faqList → form | 作品專案、服務項目（詢價單） |
| **攝影／影像** | 近黑／琥珀／大幅攝影 | immersiveHero（center）→ beltSlider → polaroidWall → splitFeature → pricing（拍攝方案）→ ctaBand | 作品專案 |
| **插畫／3D 創作者** | 奶油紙或石墨／珊瑚或青／作品本身 | hero 用作品（gallery／modelHero）→ marquee（客戶）→ imageCompare（白模↔完成）→ serviceRows → steps → ctaBand | 作品專案 |
| **顧問／講師（個人品牌）** | 淺／海軍藍／紙＋人像 | immersiveHero（人像）→ marquee → serviceRows → imageTextOverlap → galleryTrack（演講、著作）→ testimonialSwitch → faq → ctaBand | 專欄、預約 |
| **餐飲／咖啡** | 淺米／番茄紅或橄欖綠／攝影＋紙 | brewHero 或 immersiveHero → shoppableImage → productCards → imageTextOverlap → mapCard → clockLocations → ctaBand | 商店、最新消息 |
| **零售品牌／選物** | 淺／一個品牌色／商品攝影 | immersiveHero → catalogueList → productCards → statement → reviewCards → subscribeBar | 商店 |
| **課程／教育** | 淺／靛藍／書桌攝影 | immersiveHero → tileLinks → tabsShowcase → featureLedger → statBand → testimonialSwitch → pricing → faq → ctaBand | 線上課程 |
| **活動／演唱會** | 深／螢光桃紅／舞台攝影＋玻璃 | immersiveHero（corners）→ countdown → marquee → pricing（票種）→ galleryTrack → team → faq → ctaBand | 最新消息 |
| **健身／身心** | 深或淺／琥珀或鼠尾草綠／人像攝影 | immersiveHero → splitFeature → statBand → pricing（方案）→ testimonialSwitch → faq → ctaBand | 預約 |
| **募款／非營利** | 淺／暖橘／田野攝影 | immersiveHero → statBand → splitFeature → scrollStory → runMeter（每月捐款滑桿）→ statement → faq → ctaBand | 最新消息 |
| **電子報／寫作者** | 米紙／深綠／宋體、幾乎無圖 | immersiveHero（純文字 colossal）→ subscribeBar → richtext → galleryTrack → proof → subscribeBar | 專欄 |

作品集三通則：**作品本身就是 hero**；**一定要有「怎麼合作」段**（serviceRows／steps／pricing 其一），不然只是相簿；`imageCompare` 是最省力的「專業感」區塊（分鏡↔完成、白模↔材質、改造前後）。

## 內容頁設計（`site.update { theme:{ contentDesign } }`）

| 材質 | 建議 |
|---|---|
| 玻璃（深色） | `card: glass`, `header: hero`, `eyebrow: index`, `list: grid` 或 `masonry` |
| 紙／襯線 | `card: flat`, `radius: none` 或 `sm`, `headingFont: serif`, `header: minimal`, `list: editorial`, `density: airy` |
| 攝影 | `card: flat`, `header: hero`（自動取首頁 hero 圖）, `list: editorial` 或 `masonry` |
| 產品／SaaS | `card: lift` 或 `outline`, `radius: xl`, `header: band`, `eyebrow: pill` |
| Mono／工程 | `card: outline`, `radius: none`, `headingFont: mono`, `eyebrow: index`, `list: rows`, `uppercase: true` |

作品集優先 `editorial`／`masonry`；文字類用 `rows`；商品固定四欄格。內容頁的更多內容載入：`site.pages.update { content:{ loadMode: pagination|infinite|loadmore, pageSize } }`。

## 頁尾（`site.update { footer:{ layout, … } }`）

| 材質 | 建議版型 |
|---|---|
| 攝影／建築 | `photo`（自動取 hero 圖）或 `mega`（巨型品牌字，配 `giantWord`） |
| 紙／襯線／個人 | `minimal`（可開 `showClock` 當地時間）或 `stacked` |
| SaaS／產品 | `minimal`、`newsletter`（訂閱表單）或 `panel`（浮起面板＋主色光暈） |
| 活動／零售 | `ticker`（`marquee` 放日期／城市）或 `contact`（`hours` 營業時間） |
| 代理商／工作室 | `cta`（`headline` 一句大標＋聯絡）或 `index`（編號網站地圖） |

首尾呼應：深色滿版 hero ↔ `mega`／`photo`；淺色紙感 ↔ `minimal`／`stacked`。
