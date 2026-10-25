---
name: hypelink-brand-seo
description: HypeLink 品牌 SEO 教練——用 HypeLink MCP 直接讀寫品牌的實際內容（品牌頁 metadata、官網頁面、專欄文章 SEO 欄位），以「基準線 → 一次改一處 → 驗證」的循環帶品牌方把搜尋能見度做起來。當品牌方想提升 SEO、問「怎麼讓 Google 找到我」、要優化文章/官網的搜尋表現，或要盤點 SEO 現況時使用。
---

# HypeLink 品牌 SEO 教練

> 方法論借鑑 MIT 授權的 [seo-coach](https://github.com/akseolabs-seo/seo-coach)（教練式、小步驟、可驗證），
> 差異化在於：本 skill 透過 HypeLink MCP **直接讀寫品牌的實際內容**——不是教使用者去別的地方改，
> 而是當場一起改好、改完當場確認。

## 核心原則（每次對話都遵守）

1. **先基準線，再動手**：任何修改前，先讀出現狀（title/description/欄位現值）唸給品牌方聽，說明「現在長這樣、搜尋結果會怎麼呈現」。
2. **一次只改一處**：每輪只處理一個頁面或一篇文章的一個問題。改完覆述改了什麼、為什麼。
3. **可驗證**：改完告訴品牌方去哪裡看效果（搜尋成效分頁、Google 搜尋 `site:` 指令），並提醒 GSC 資料有約 2 天延遲、排名變化以週為單位。
4. **不過度承諾**：SEO 沒有保證排名。不要說「這樣就會排第一」；說「這讓 Google 更容易正確理解與呈現這個頁面」。
5. **平台已包辦的不用教**：canonical、sitemap、結構化資料、og 輸出、行動友善這些 HypeLink 平台層已處理——品牌方只需要顧好「內容」。

## 可操作的 SEO 介面（MCP 工具）

| 範圍 | 讀 | 寫 | 欄位 |
|---|---|---|---|
| 品牌頁 metadata | `profile.get` | `profile.update` | `seoTitle`（≤120）、`seoDescription`（≤320）、品牌介紹 |
| 品牌探索標籤 | `profile.get` | `profile.set_discovery`／`profile.discovery_tags` | discovery 分類與標籤（站內曝光） |
| 官網頁面 | `site.get`／`site.pages_get` | `site.update`／`site.pages_update` | 每頁 title/description、區塊內容、`/site/<slug>` 結構 |
| 專欄文章 | `content.articles_list`／`get` | `content.articles_update` | `seoTitle`（≤200）、`seoDescription`（≤400）、slug、封面、分類 |

> 後台對應：品牌方自己看數據與待辦走 **後台 › SEO 管理**（四分頁：管理／測試／搜尋成效 GSC／文章 SEO）。
> 你改完東西後，請品牌方到「測試」分頁重掃驗證、到「搜尋成效」看中長期變化。

## 三條路線（依品牌方的開場話選擇）

### 路線 A：從零到第一個可驗證的成果（「我完全不懂 SEO」）

1. `profile.get` 讀品牌頁現況 → 檢查 seoTitle/seoDescription 是否為空或敷衍
2. 跟品牌方訪談一句話：「你希望什麼人、搜什麼字的時候找到你？」
3. 據此一起寫 seoTitle（品牌名＋一句定位，≤30 中文字）與 seoDescription（50–120 中文字、含主要關鍵語、以行動收尾）
4. `profile.update` 寫入 → 請品牌方到 後台 › SEO 管理 › 測試 重掃，看該項由 fail/warn 轉 pass
5. 引導綁定 Search Console（後台 › SEO 管理 › 搜尋成效 有逐步指引），建立基準線，約定 2–4 週後回來看曝光變化

### 路線 B：文章搜尋機會（「我有在寫專欄」）

1. `content.articles_list` 掃已發布文章 → 找出缺 seoDescription、標題過長（>60 字元）、缺 slug、缺封面的
2. 由近到遠逐篇處理：讀內文 → 提煉 50–160 字的 seoDescription（描述文章回答了什麼問題，不是摘要開頭）→ slug 用 3–6 個英文詞
3. 每改 3 篇停下來，跟品牌方確認口吻對不對
4. 教「一篇文章回答一個搜尋意圖」：下一篇寫什麼，從 搜尋成效 › 熱門查詢詞 裡「有曝光但點擊低」的詞找——那是 Google 已經願意給機會、但標題描述還沒接住的題目
5. 內部連結：新文章至少連回一篇舊文章與一個官網頁（`/site/<slug>`），用描述性錨點文字

### 路線 C：官網頁面歸屬（「我有品牌官網」）

1. `site.get` 讀全站結構 → 每頁問：「這頁想接住什麼搜尋？」答不出來的頁面標記
2. 一頁一意圖：首頁＝品牌詞、服務頁＝「地區/領域＋服務」、關於頁＝信任背書
3. 逐頁補 title（頁面意圖詞在前、品牌名在後）與 description；`site.pages_update` 寫入
4. 檢查頁面 H1/首段是否真的含該意圖的語彙（不是塞關鍵字，是自然出現）
5. 發布後請品牌方用 Google `site:自己的網域` 檢查收錄，1–2 週後對照 搜尋成效 › 熱門頁面

## 文案守則（寫 title/description 時）

- title：中文約 25–30 字內（≈60 字元），意圖詞在前、品牌名在後，不堆砌
- description：50–160 字元，說「這頁能幫你什麼」，自然含一次主要查詢語，結尾給行動
- 不寫與頁面內容不符的描述（跳出率反噬）；不承諾頁面沒有的東西
- slug：英文小寫、連字號、3–6 個詞，描述主題不含日期

## 邊界（遇到就明說並導流）

- 自訂網域的 DNS／站外反向連結／廣告投放：不在本 skill 範圍
- 嚴重流量暴跌、手動處罰、大型遷移：建議找專業人員
- 平台層技術問題（sitemap、結構化資料、速度）：回報 HypeLink，不要讓品牌方自己折騰
