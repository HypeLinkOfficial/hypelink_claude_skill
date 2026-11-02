# 設計語言：從 40 個參考站學到的佈局、材質與互動（2026-10-29）

來源：39 個 Framer 作品集／工作室／SaaS 範本站 ＋ reactbits.dev。這份是「看到什麼 → 用 HypeLink 哪個設定做到」的對照，做範本或幫品牌設計官網時先翻這裡，再去 `blocks.md`／`templates.md` 查細節。

## 1. 十二條共同語言

| # | 語言 | 在參考站的樣子 | HypeLink 怎麼做 |
|---|---|---|---|
| 1 | **大字＋留白** | 標題 64–240px Grotesk、字距 -2～-5%、行高 0.9–1.0；段間 160–240px；內容寬 1200–1280 | 區塊 `padTop/padBottom` 120–200；`sx.letterSpacing: -0.03`、`sx.lineHeight: 1`；頁面 `theme.layout.containerWidth: "wide"|"full"`；標題用 `bigStatement`／`giantWordHeader`／`giantWordmarkHero` |
| 2 | **雙色標題** | 大標後半降灰；或一個關鍵詞改醒目色 | `sx.titleTone: "muted-tail"`（標題寫 `前半 \| 後半`）或 `"accent-word"`（`*關鍵詞*`） |
| 3 | **眉標系統** | 等寬字全大寫＋符號：`(01) NAME`、`[ SEC-01 ]`、`● REC`、`/ NAME`、`■ NAME` | `sx.eyebrowStyle: dot|bracket|square|slash|mono`；區塊 `eyebrow` 欄位寫大寫英文 |
| 4 | **單一醒目色大面積用** | 整段換成醒目色底、巨字、數字；深色站底色帶色相（暖黑 #1c1916／紫黑 #120f17／藍黑 #050609）；邊框＝文字色 8–16% | 區塊 `bg.color` 直接用醒目色＋`sx.textColor`；深色底不要 #000，用帶色相近黑；邊框 `sx.borderColor: "rgba(255,255,255,.1)"` |
| 5 | **圓角兩極** | SaaS 16–24px＋毛玻璃；作品集／編輯型全直角、無陰影 | 全站決定一次：`sx.cardRadius` 0 或 20、`sx.cardShadow` none／sm；`menu.glass` 只給 SaaS |
| 6 | **巨型字標 Hero** | 品牌名 160–300px 撐滿，角落 meta | `giantWordmarkHero { fill: solid|outline, variant: static|marquee, corners }` |
| 7 | **一案一屏／釘住** | 作品、案例各占一屏 sticky | `pinnedCaseScreens`、`cinemaCases`、`fragmentStream` |
| 8 | **角落資訊** | 活時鐘、城市、營業狀態點、剩餘名額、版權壓四角或直排貼邊 | `menu.clock { timezone, city }`、`menu.status { text, dot }`、`cornerInfoHero.corners`、`motion.progressRail` |
| 9 | **固定元素取代頁尾** | 浮動膠囊、底部漢堡、側欄、Dock | `menu.layout: dock|side`、`menu.burgerPos: "bottom"`、`menu.shrinkOnScroll`、`footer.layout: "minimal"` |
| 10 | **底線式按鈕** | 文字＋↗＋1px 底線 | `sx.btnStyle: "underline"`（整個區塊的按鈕一起換） |
| 11 | **互動** | 連結逐字翻字、hover 浮圖／放大／壓暗＋中央鈕、拉霸數字、跑馬燈 | `menu.linkHover: "flip"`、`sx.hoverFx: lift|zoom|glare|tilt|spotlight|glow-border|dim-others`、`ledgerRows.hoverImage`、`marquee`／`iconPillMarquee` |
| 12 | **游標** | 九成站預設游標；差異化靠跟隨標籤 VIEW／DRAG／YOU | `effects.cursor: "follow"` ＋ `sx.cursorLabel`（每區塊換字）；cursor-lab 效果一個站最多一種 |

## 2. 四張對照表

### 2.1 眉標
| 想要的樣子 | 設定 |
|---|---|
| `● RECENT WORK` | `sx.eyebrowStyle:"dot"`（圓點＝醒目色） |
| `( 01 ) CAPABILITIES` | `"bracket"`，eyebrow 文字寫 `01 ) CAPABILITIES`… 或直接 `( 01 ) CAPABILITIES` 不設樣式 |
| `■ ENERGY` | `"square"` |
| `/ ABOUT` | `"slash"` |
| 純等寬小字 | `"mono"` |

### 2.2 按鈕
| 樣子 | 設定 |
|---|---|
| 膠囊（預設） | `sx.btnStyle:"pill"` |
| 方角 6px（企業／編輯型） | `"square"` |
| 細框透明 | `"outline"` |
| 文字＋↗＋底線（深色工作室） | `"underline"` |

### 2.3 標題
| 樣子 | 設定 |
|---|---|
| 後半灰 | `sx.titleTone:"muted-tail"`＋標題 `我們做品牌 \| 也做網站` |
| 關鍵詞醒目色 | `"accent-word"`＋標題 `讓*對的人*找到你` |
| 逐行上滑進場 | `sx.titleFx:"rise"`（標題用換行分行） |
| 逐詞淡入 | `"words"` |
| 模糊轉清晰 | `"blur"` |
| 亂碼解碼（科技感） | `"scramble"` |
| 打字 | `"typewriter"` |
| 掃光（深色站） | `"shiny"` |
| 襯線展示字只用在這段 | `sx.displayFont:"Playfair Display"`（BRAND_FONTS value） |

### 2.4 間距與材質
| 項目 | 作品集／編輯型 | SaaS／服務型 |
|---|---|---|
| 段間 | 160–240px | 96–160px |
| 卡片圓角 | 0 | 16–24 |
| 卡片陰影 | none | sm／glow |
| 邊框 | 1px 文字色 10–16% | 1px 8%＋毛玻璃 |
| 間距 gap | 0–10px（圖片不裁切） | 16–24px |
| 字體 | Inter Display／Switzer／Geist＋IBM Plex Mono 眉標 | Inter／Geist＋Geist Mono |
| 底色 | 純白或純黑 | 帶色相近黑／米白 |

對應：`sx.padY`、`sx.cardRadius`、`sx.cardShadow`、`sx.cardBorder`＋`cardBorderColor`、`sx.gap`、`theme.fontFamily`、`sx.displayFont`。

## 3. Menu 八種模式

| 模式 | 參考站 | 設定 |
|---|---|---|
| 固定頂欄・品牌左／連結右＋CTA | portfolite、vertical | `menu { layout:"classic", cta }` |
| 品牌左／連結置中／CTA 右 | rushes、noahmiles | `navAlign:"center"` |
| 頂欄捲動後收縮成置中膠囊 | verrity、nexra | `shrinkOnScroll:true, overlay:true` |
| 常駐置中浮動膠囊 | orchard、meeko、sawad | `island:true, navAlign:"center"`（純圖示版用 cta＋linkCase caps） |
| 只有品牌＋底部置中漢堡 | mattis、aldena | `alwaysMobile:true, burgerPos:"bottom", burgerStyle:"lines"`＋`mobileMenu.preset:"stage"` |
| 品牌＋MENU 鈕 → 右側抽屜 | velorn | `alwaysMobile:true`＋`mobileMenu.preset:"drawer"` |
| 無頂欄、側欄即導覽 | oktav、monodrift、alara | `layout:"side"`＋`dock { intro, links }`＋`clock` |
| 左下角白卡堆 | localremote | `layout:"dock"` |

附屬：`clock`（活時鐘）、`status`（狀態膠囊）、`linkHover:"flip"`、`linkNumbers`、`blend:"difference"`（透明頂欄走過深淺段落自動反色）、`motion.progressRail`。

## 4. 動態與游標

- **文字**：`sx.titleFx` 六種；`sx.titleTone` 雙色。
- **跑馬燈**：`marquee`（文字／logo／display）、`iconPillMarquee`（兩列反向圖示膠囊）、`giantWordmarkHero.variant:"marquee"`。
- **捲動驅動**：`sx.scrollFx: parallax|zoom|fade|tilt|recede`、`pinnedCaseScreens`、`folderTabCards`（黏頂堆疊）、`fragmentStream`、`motion.progressRail`。
- **hover**：`sx.hoverFx` 七種；`ledgerRows.hoverImage`；`catalogueList`。
- **數字**：`countFigures`／`statPills`（拉霸滾動）。
- **背景**：區塊 `bg.rich`（61 種動態背景，與活動頁共用）；`sx.backdrop`、`sx.texture`。
- **游標**：全站 `effects.cursor:"follow"`＋區塊 `sx.cursorLabel`；`effects.cursorLab` 29 種特效（一站一種）。
- 原則：一個站挑 2–3 個動態就好；AAA／減少動態時全部退回靜態（系統自動）。

## 5. 40 站索引（類型 → 可學的點）

| 站 | 類型 | 氛圍 | 學什麼 |
|---|---|---|---|
| rushes | 影像工作室 | 黑＋橘、Space Grotesk | REC 眉標、取景框作品卡、巨字字標、三段式頂欄 |
| velorn | 設計工作室 | 黑＋紅、IBM Plex Mono | 右側抽屜選單、整段紅底案例、DRAG 游標標籤 |
| vertical | 視覺藝術家 | 黑＋螢光綠 | 雙色分割海報、巨字、相位進度點 |
| walkerr | 極簡作品集 | 純白黑 | 底線「Menu」全螢幕覆蓋、零圓角、底線按鈕 |
| verrity | SaaS | 暖黑＋米白 | 頂欄收縮膠囊、UI 功能輪播、照片數據卡、整站雲海背景 |
| nexra | SaaS | 黑＋薄荷綠 | 深色卡 10–16px、宣言逐行亮起、Logo 跑馬 |
| sanjaya | AI 代理商 | 近黑、Geist Mono | 四角資訊 Hero、黏頂案例卡、Logo 牆嵌數據、軌道標籤 |
| portfolite | 自由設計師 | 純黑 | 圖示膠囊雙列跑馬、毛玻璃 CTA、煙霧光線 |
| sawad | 工程師 | 深灰＋橘 | 左固定人物名片＋右內容流、置中圖示膠囊導覽 |
| spherefolio | 攝影 | 近黑 | 球面照片牆 |
| mattis | 設計開發工作室 | 黑／淺灰／橘紅輪替 | 底部漢堡、整段橘紅宣言、背景巨字跑馬、名額條 |
| monodrift | 數位工作室 | 近黑＋螢光綠、Tektur | 左側側欄、釘住橫向作品秀、拉霸數字、獎項表 |
| noahmiles | 數位設計師 | 純黑白 | 滿版作品圖內文字、經歷表、左黏右捲 |
| nolan-barret | 設計師 | 純白 | 檔案索引作品格（等寬檔名）、欄數切換、活時鐘 |
| nudge-folio | 產品設計師 | 白＋格線＋三原色 | 便利貼 Hero、檔案夾分頁卡、分頁式頂欄 |
| meeko | 產品設計師 | 淡紫＋粉彩 | 框線膠囊導覽、outline 數據膠囊、硬陰影按鈕 |
| orchard | 動態影像工作室 | 白、瑞士極簡 | 置中毛玻璃膠囊＋「＋」鈕、大字名單滑過浮圖、gap 0 |
| oktav | 設計工作室 | 淺灰＋白 | 側欄＋分類膠囊＋瀑布流、主題切換 |
| myos | 個人 | 桌面 OS | 底部 Dock（已有 dock 版型可近似） |
| alara | 產品設計師 | 淺＋粉紅鈕 | 側欄名片＋面板標題列 sticky |
| aldena | 編輯工作室 | 黑／淺灰、Baskervville | 一案一屏浮水印大字、底部方框漢堡、拱形圖卡 |
| anderson | 作品集 | 單屏儀表板 | 側欄即導覽 |
| armory | AI 工作室 | 黑白輪替＋4 欄格線 | 細線列表揭圖、遙測卡、格線＋顆粒材質 |
| arqvolt | 能源企業 | 深綠／米白＋萊姆綠 | 企業頂欄＋即時數據、右緣進度軌、示意圖面板 |
| artemis1 | 設計師 | 米白＋深藍襯線＋橘 | 漂浮物件 Hero、散落標籤、透視格線 |
| bungee | 創意工作室 | 白＋粉彩三色 | 拱形圖卡跑馬、直立時鐘、服務卡滑軌 |
| caspia | 品牌策略師 | 單屏 | 漂浮照片＋字標變色 |
| cerno | 數位工作室 | 深 | adidas 式釘住案例＋巨型數據、稀缺狀態列 |
| cohesion | 網頁設計師 | 白＋橘＋青綠 | 浮動膠囊＋滑動指示、背景跑馬巨字、雙層卡 |
| conversion | 廣告代操 agency | 純黑＋珊瑚紅、Satoshi＋襯線斜體 | 大標裡一個字換襯線斜體（`sx.titleTone:"accent-word"` 近似）、黑底細邊膠囊眉標、案例卡無限橫捲兩側淡出＋數據膠囊 |
| deformo | 創意 agency | 深藍紫→蜜桃噪點漸層與白段交替 | 透明頂欄捲過 Hero 變內縮白浮動卡片條（`shrinkOnScroll`）、「01 ● SERVICES」編號眉標、玻璃數據卡階梯錯位 |
| ethanclark | 設計師作品集 | 純白＋黑實心塊、Inter Display | 窄欄置中 560px 精品感、人像壓在文字上混色、頁尾即時時鐘 |
| formastudio | 室內／建築工作室 | 淺灰與近黑交替、Mona Sans | 首屏完整連結＋聯絡資訊捲動後收漢堡、數字滾輪（`statPills`）、作品格寬窄交錯 hover 換副標 |
| formlane | 品牌識別工作室 | 純白灰階、Helvetica | 灰字句中嵌黑字 email 當強調、一種字體靠細線分段、作品卡近滿版 gap 20 |
| fuel | 創意 agency（訂閱制） | 淺灰與 #111 交替＋橘紅／淺藍 | 「◆ (01) — Label — © 2025」三點細線眉標列、段落斜切邊界（`sx.edgeBottom:"tilt"`）、作品卡底層模糊放大同圖＋釘住疊卡 |
| gojett | 攝影師工作室 | 近黑＋米白段、Condensed＋Martian Mono | 「[ Label ]」方括號眉標（`eyebrowStyle:"bracket"`）、連結上滑翻字、頂欄直線分格附最新作品縮圖 |
| interiia | 室內設計 | 暖米 #F6F2EA、PP Neue Montreal | Hero 底部四欄資訊（`cornerInfoHero`）、高度階梯遞增的橫向圖片帶、見證輪播 01/03＋細進度條 |
| kaimarlow | 品牌設計師作品集 | 米白紙紋、Gambarino 襯線＋Switzer 大寫 | 3D 圓柱圖帶壓在巨字名下、作品 hover 變模糊中央浮清晰小圖、頂欄放職稱與時區（`menu.clock`） |
| kora | B2B 成長顧問 | 象牙白＋薄荷綠、Manrope | Hero 內縮圓角框（`sx { inset:20, radius:40 }`）右下浮最新案例卡、CTA 膠囊帶真人頭像、宣言逐字揭露背景同步變模糊 |
| reactbits | 元件庫 | — | 文字動態／hover／導覽元件的靈感與 Customize 面板的設定 UI 範式 |

## 6. 做範本時的流程（補充 decompose-reference-site.md）
1. 先決定「材質」：直角無陰影 vs 圓角毛玻璃；底色是純色還是帶色相；眉標格式；按鈕形狀。這四個決定寫在範本檔最上面的常數。
2. Hero 選型：巨字字標／四角資訊／漂浮物件／滿版照＋大字／貼紙畫布。
3. 作品呈現選一種主節奏：一案一屏（pinned）／三欄卡（tagProjectGrid）／細線列表（ledgerRows）／錯位長捲（fragmentStream）／檔案索引（projectIndexGrid）。
4. 關於頁：`studioDossier`／`profileRail`／`awardsTable`。
5. Menu 選模式（§3），決定是否要 clock／status／progressRail。
6. 動態只挑 2–3 個。
7. 圖片 Pexels（CREDITS.md）、插圖 SVG；文案原創。
