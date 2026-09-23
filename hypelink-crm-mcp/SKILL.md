---
name: hypelink-crm-mcp
description: 透過 HypeLink MCP server 經營品牌的 CRM（商業工具 › CRM）——客戶主檔與跟進（備註、互動、銷售階段、關心程度、下次跟進）、標籤庫、CRM 分類、自訂欄位、分群（segments）、儀表板與行事曆，以及把名單神器的名單轉成客戶。當使用者要用 Claude 經 /mcp 查客戶、記錄拜訪、推進銷售階段、整理標籤與分群時使用。會扣 SP 的 AI 功能、群發送出、檔案上傳仍在 dashboard。
---

# Skill：HypeLink CRM MCP 操作

透過 **HypeLink MCP server** 經營一個品牌的 **CRM**（dashboard：商業工具 › CRM），scope `crm:read` / `crm:write`。

> 名單神器（名單匣）、商城、課程、聯盟見 `hypelink-commerce-mcp`；活動報名者見 `hypelink-event-mcp`。

## 何時使用

- 「幫我查采婕這個客戶，最近有哪些互動」
- 「把丈量表單進來的名單建成客戶，標成『已聯絡』」
- 「今天拜訪完王小明，記一筆互動並把階段改成報價中」
- 「列出本週要跟進的客戶」「哪些客戶超過 30 天沒聯絡」
- 「建一個『高意向 + 台北』的分群，看有幾個人」
- 「把所有 tag 為 inquiry 的客戶加上『Q4 活動』標籤」

## 重要前提與邊界

- token 綁定單一品牌，呼叫工具**不需**帶 hypeId。
- Server：`POST https://api.hypelink.app/mcp`，`Authorization: Bearer hl_pat_<token>`。
- **不開放**（請引導到 dashboard）：CRM AI 助理、身份調查、名片 OCR、個人化群發生成與送出、生日禮物建議（皆扣 SP）；檔案上傳與客戶附件；CSV 匯入；提醒設定。
- 客戶資料屬個資：只在使用者明確要求時輸出 email／電話，摘要時以姓名與階段為主。

## Scope

| Scope | 範圍 |
|---|---|
| `crm:read` | 客戶列表與詳細、標籤庫、分類、自訂欄位定義、分群與人數、儀表板、行事曆 |
| `crm:write` | 建立／更新／刪除客戶、備註與互動、標籤庫／分類／欄位／分群管理、名單轉客戶 |

寫入類工具多支援 `dry_run: true`；`*.delete` 走兩階段 `confirmToken`。

---

## 一、客戶（`crm.members.*`）

| Tool | Scope | 說明 |
|---|---|---|
| `crm.members.list` | read | 分頁列表；`q` 關鍵字、`status`、`kind`(person/company)、`careLevel`、`stage`、`category`、`tag`、`followUp`(overdue/today/due/week/scheduled/none)、`sort` |
| `crm.members.get` | read | `{ memberUuid }` 完整資料：標籤、分類、自訂欄位、備註、互動紀錄、活動時間軸、購買紀錄、關係人 |
| `crm.members.create` | write | `{ name, email?, phone?, lineId?, instagram?, kind?, description?, preferences?, birthday?, careLevel?, salesStage?, tags?, categories?, customFields?, nextFollowUpAt?, nextFollowUpReason? }` |
| `crm.members.update` | write | `{ memberUuid, ...同上, status? }` 部分更新；`tags` / `categories` 整組取代；`salesStage: null` 清除；`customFields` 只更新給定 key |
| `crm.members.add_note` | write | `{ memberUuid, content }` |
| `crm.members.add_interaction` | write | `{ memberUuid, type, note?, occurredAt? }`；type 例 call / meeting / email / line / visit / other；會更新最近互動與互動分數 |
| `crm.members.delete` | write | 兩階段確認 |

**銷售階段**：`new → contacting → scheduled → visited → quoting → won / lost`。
**關心程度**：`low / medium / high`。列表回傳另含系統算的 `intentTier`（visitor / engaged / lead / high_intent / priority_lead）與 `lifecycleStage`，這兩個是唯讀。

## 二、標籤庫、分類、自訂欄位

| Tool | Scope | 說明 |
|---|---|---|
| `crm.tags.list` / `create` / `update` / `delete` | read / write | 品牌標籤庫：`{ label, tagKey?, color?, category?, description? }`；客戶身上的 `tags` 用 label 或 tagKey。建立受方案配額限制 |
| `crm.categories.list` / `create` / `update` / `delete` | read / write | CRM 分類：`{ name, color? }`；改名會同步客戶身上的值；客戶的 `categories` 用 name |
| `crm.fields.list` / `create` / `update` | read / write | 自訂欄位定義：`{ label, key?, type?, config?, required?, description?, visibleInList?, visibleToMember?, editableByMember? }`；type：text / longtext / richtext / number / date / select / multiselect / boolean / url / email / phone；key 與 type 建立後不可改。寫值用 `crm.members.update { customFields:{ key: value } }` |

## 三、分群（`crm.segments.*`）

| Tool | Scope | 說明 |
|---|---|---|
| `crm.segments.list` | read | name / filterJson / memberCountCache |
| `crm.segments.preview` | read | `{ filterJson }` 不存檔直接算人數 |
| `crm.segments.create` / `update` / `delete` | write | `{ name, description?, filterJson }` |
| `crm.segments.recipients` | read | `{ uuid, limit? }` 目前符合的客戶（userUuid / name / email，最多 500） |

`filterJson` 條件樹，組合節點 `{ op:'and'|'or'|'not', children:[...] }`。葉節點（2026-09-23 大幅擴充）：

| 葉節點 | 用途 |
|---|---|
| `{ type:'tag', tagKey }` | 有某個標籤 |
| `{ type:'tier', tiers:['vip','svip'] }` | 會員等級 |
| `{ type:'sales_stage', stages:['quoting','won'] }` | 銷售階段 |
| `{ type:'care_level', levels:['high'] }` | 關心程度 |
| `{ type:'category', categories:['老客戶'] }` | CRM 分類 |
| `{ type:'days_since_last_purchase', op:'>=', days:180, includeNeverPurchased? }` | **沉睡喚醒**：多久沒再買 |
| `{ type:'days_since_last_interaction', op:'>=', days:90, includeNeverInteracted? }` | 多久沒互動 |
| `{ type:'purchase_item_like', keyword:'窗簾', withinDays? }` | 買過什麼（品名模糊比對） |
| `{ type:'intent_score', op, value }`／`{ type:'intent_tier', tiers }`／`{ type:'lifecycle_stage', stages }` | Lead Scoring 相關 |

先用 `preview` 確認人數再 `create`。沉睡名單的正確定義是「沒再買」而不是「沒互動」，兩者都設會更準。

## 四、儀表板與行事曆

| Tool | Scope | 說明 |
|---|---|---|
| `crm.dashboard` | read | 客戶數、階段分佈、待跟進、近期互動統計 |
| `crm.calendar` | read | `{ from, to }`（ISO 日期）區間內的跟進排程、生日／紀念日提醒、活動 |

## 五、案源與介紹人（`crm.sources.*`）

案源要能統計，選項就得先定死——自由文字會讓同一個來源被寫成「朋友介紹」「介紹」「朋友」三種。

| Tool | Scope | 說明 |
|---|---|---|
| `crm.sources.list` | read | 案源選項（含 `monthlyCost` 每月投入，供 ROI 計算） |
| `crm.sources.create` | write | `{ name, monthlyCost?, color? }`；`monthlyCost` 是廣告費／平台月租等固定投入，0＝免費來源 |
| `crm.sources.update` | write | `{ sourceUuid, name?, monthlyCost?, color?, enabled? }`；改名會同步搬移客戶身上的值 |
| `crm.sources.delete` | write | 標記此案源的客戶會被清空案源欄位（客戶本身不受影響） |
| `crm.source_analytics` | read | `{ months? }` 每個來源的客戶數／案件／成交額／客單價／毛利／取得成本／淨利／ROI |
| `crm.referrer_analytics` | read | 介紹人排行：誰介紹了幾位、帶來多少營收（只計直接介紹） |

客戶身上用 `crm.members.update { source, referrerMemberUuid }` 設定。**毛利需要專案有登錄成本才算得出來**，沒登錄時 `source_analytics` 的毛利欄位不具參考價值。

## 六、案件與業績目標

| Tool | Scope | 說明 |
|---|---|---|
| `crm.members.projects` | read | `{ memberUuid }` 這位客戶在專案管理（HL-30）的所有案件與加總：成交總額、成本、毛利、已收／未收、往來期間。**回頭客價值看這支** |
| `crm.goals.get` | read | `{ month? }`（YYYY-MM，省略＝本月）目標／實際／達成率；沒設定過回 `null` |
| `crm.goals.set` | write | `{ month, targetAmount, actualAmount? }`；`actualAmount` 省略時不動既有值 |

## 七、名單匣 → 客戶

| Tool | Scope | 說明 |
|---|---|---|
| `leads.convert_to_member` | `crm:write` | `{ leadUuid }` 以 email 比對建立或連結客戶，回 `{ memberUuid, created }`；名單需有 email（名單本身用 `leads.list` 查，見 commerce skill） |

## 推薦工作流程

1. **表單進件後跟進**：`leads.list { status:'new' }` → `leads.convert_to_member` → `crm.members.update { salesStage:'contacting', nextFollowUpAt }` → `leads.update { status:'contacted' }`。
2. **拜訪紀錄**：`crm.members.list { q }` 找到人 → `crm.members.add_interaction { type:'visit', note }` → 視情況 `update { salesStage:'quoting' }`。
3. **每日待辦**：`crm.members.list { followUp:'today' }` 或 `crm.calendar { from, to }`。
4. **整理客群**：先 `crm.tags.list` 對照既有標籤，避免同義標籤重複；批次貼標時一位一位 `crm.members.update { tags }`（整組取代，先 `get` 再合併）。
5. **沉睡喚醒**：`crm.segments.preview { filterJson: { op:'and', children:[ {type:'days_since_last_purchase',op:'>=',days:180}, {type:'days_since_last_interaction',op:'>=',days:90} ] } }` 確認人數 → `create` 存成名單 → 到 dashboard 發 EDM。
6. **案源檢討**：`crm.source_analytics { months:12 }` 看哪個來源淨利為負 → `crm.sources.update` 調整每月投入，或停用該來源。
7. **回頭客盤點**：`crm.members.projects { memberUuid }` 看這位客戶做過幾個案子、毛利多少，再決定要不要投資源經營。

## 安全規則（務必遵守）

- 貼標、改階段等批次動作先列出將影響的客戶清單讓使用者確認，再逐筆執行。
- `tags` / `categories` 是整組取代：更新前先讀取現值合併，不要把既有標籤洗掉。
- 刪除客戶不可逆，務必走 `confirmToken` 並複述姓名。
- 不主動把客戶 email／電話貼進對話摘要或外部工具。

## 常見錯誤碼

| code | 意思 |
|---|---|
| `SCOPE_DENIED` | token 缺 `crm:*` scope |
| `VALIDATION_FAILED` | 欄位錯誤（同名分類／標籤、找不到客戶、filterJson 格式） |
| `CONFIRM_INVALID` | confirmToken 過期或不符 |
| `QUOTA_EXCEEDED`／400 | 標籤庫或自訂欄位達方案上限 |

## 與 dashboard 的關係

MCP 與 dashboard 讀寫同一份資料，互相即時可見。

以下留在 dashboard，MCP 刻意不開放：
- **AI 助理**（對話式操作、條件式批次與復原、名片辨識、圖表與匯出）——那是互動式流程，需要人看著確認清單再執行
- **名片 OCR**、**身份調查**、**個人化群發**——會扣 SP
- **檔案上傳**、**CSV／Excel 匯入精靈**、**群發送出**
