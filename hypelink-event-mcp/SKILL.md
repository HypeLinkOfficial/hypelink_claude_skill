---
name: hypelink-event-mcp
description: 透過 HypeLink MCP server 製作 / 經營活動（events）——建立活動、票種、報名表、通知、報名名單與報到、成效，以及子功能（公告、投票、Q&A、問卷、報名審核、EDM 廣播、協作者、活動識別/配對、成果紀錄）。當使用者要用 Claude 經 /mcp 操作某品牌的活動時使用。
---

# Skill：HypeLink 活動 MCP 操作

透過 **HypeLink MCP server** 製作與經營一個品牌的**活動（events）**：
從建立活動、票種、報名表、通知，到報名名單 / 報到 / 成效，以及各種活動子功能。

## 何時使用

- 「幫我建一場 6/20 的講座活動，開放報名」
- 「加兩個票種：早鳥 500、一般 800，早鳥限量 50」
- 「把報名表加一個『公司名稱』必填欄位」
- 「匯出報名名單 / 看報到統計 / 看成效」
- 「對所有已報名者發一封活動提醒 EDM」
- 「開一個活動投票 / Q&A / 會後問卷」

## 重要前提與邊界

- **操作對象是「已存在的品牌」底下的活動**；token 綁定該品牌（不需自帶 hypeId）。
- Server：`POST https://api.hypelink.app/mcp`，`Authorization: Bearer hl_pat_<token>`。
- Token 在 dashboard `/dashboard/brands/[hypeId]/settings/api-tokens` 產生；需含 **`events:read` / `events:write`** scope。
- **可建立活動數量上限：不分方案一律 999 個**（超過才會被擋）。

## Scope

- `events:read` → 讀（list / get / attendees / checkin / report / 各子功能 list/get）
- `events:write` → 寫（create / update / delete / 票種 / 報名表 / 通知 / 報到 / 子功能 create/update/delete）
- 寫入大多支援 `dry_run`；`events.delete` 兩階段確認。

## 核心活動工具（`events.tools.ts`）

### 活動 CRUD
| Tool | Scope | 必填 / 說明 |
|---|---|---|
| `events.list` | read | 列出本品牌活動（可帶 status） |
| `events.get` | read | `{ uuid }` 取完整活動 |
| `events.content_modules` | read | `{ id? }` 列出活動頁 **內容模組目錄**：每個模組的 sections id、資料欄位名（dataKey）、欄位型別／說明／必填、範例，以及頁面層級欄位（themeId、background、sections…）。**寫 pageContent 前先查**，避免猜錯欄位名造成前台空白 |
| `events.create` | write | `{ name, startAt, endAt, slug?, description?, format?, location?, meetingUrl?, registration*?, pageContent?, discountCodes?[] }`。`slug` 未給時由名稱自動產生，只保留 a-z0-9-（中文名稱會退回 `event-<yyyymmdd>-<隨機>`），建議中文活動自行帶英數 slug |
| `events.update` | write | `{ uuid, ... }` 部分更新（`pageContent` 傳 null 物件即清空） |
| `events.duplicate` | write | `{ uuid, name?, slug? }` 複製活動（內容＋票種；副本為 draft、關閉報名）。可指定副本 `name` 與 `slug`（a-z0-9- 1-80 字、同品牌唯一，重複回 409）；未指定時名稱為「原名 (副本)」、slug 為「原 slug-copy-xxxxx」 |
| `events.delete` | write | `{ uuid }` 軟刪除，**兩階段確認** |
| `events.cancel` | write | `{ uuid }` 取消活動（會通知已報名者，不刪資料） |
| `events.set_cover` | write | 從**公開圖片 URL** 設定活動封面（`{ uuid, url }`；`clear:true` 清除；後端下載 re-host）。可搭配 AI 生圖或網路圖庫；封面建議 **1200×900，4:3** |
| `events.check_slug` | read | `{ slug, excludeUuid? }` 檢查 slug 可用 |
| `events.slug_history` | read | `{ uuid, limit? }` slug 變更歷史 |

### `pageContent` 結構（EventContent）

`events.create` 與 `events.update` 的 `pageContent` 使用結構化 **EventContent** JSON（非舊版 Puck 格式）。
完整欄位格式與範例以 **`events.content_modules`** 回傳為準（inputSchema 也帶了每個模組的 properties）；寫入後若有猜錯的欄位名，回傳會多一個 `warnings` 陣列，請依提示修正。

#### 內容模組一覽（sections id → 資料欄位）

| sections id | 模組 | 資料欄位（dataKey） | 形狀 | 欄位 |
|---|---|---|---|---|
| `hero` | 主視覺 | `hero` | object | `title`（留空用活動名）, `subtitle`, `accentColor`, `bgGradient`(hype\|sunset\|ocean\|aurora\|forest\|midnight) |
| `about` | 活動介紹 | `about` | string | 純文字，保留換行 |
| `body` | 富文字內容 | `body` | string | HTML |
| `highlights` | 活動亮點 | `highlights` | array | `icon`(emoji 或 `lucide:Star`), `title`*, `description` |
| `agenda` | 議程 | `agenda` | array | `time`*(自由文字), `endTime`, `title`*, `speaker`, `description`, `ctaLabel`+`ctaUrl` |
| `speakers` | 講者 | `speakers` | array | `name`*, `role`, `avatar`(URL), `bio`, `hypeId`(@handle), `linkUrl`, `socials[{label,url}]` |
| `faqs` | 常見問題 | `faqs` | array | **`q`\*, `a`\***（不是 question／answer） |
| `sponsors` | 贊助商 | `sponsors` | array | `name`*, `logo`, `url`, `tier`(platinum\|gold\|silver\|partner) |
| `coOrganizers` | 協辦方 | `coOrganizers` | array | `name`*, `logo`, `url` |
| `notes` | 注意事項 | `notes` | string | 純文字 |
| `album` | 活動相簿 | `album` | object | `images[{ url*, caption? }]` |
| `venue` | 場地與交通 | `venue` | object | `address`, `mapEmbedUrl`, `directions` |
| `contact` | 聯絡方式 | **`contactChannels`** | array | `type`*(line＝官方 LINE ID\|line_personal＝個人 LINE ID（點擊複製）\|link＝一般連結\|telegram\|discord\|email\|phone\|other), `value`*, `label` |
| `offlinePayment` | 線下付款 | `offlinePayment` | object | `methods[cash\|linepay\|bank_transfer]`, `bankName`, `accountNumber`, `accountHolder`, `linePayId`, `instructions` |
| `quickLinks` | 快速連結 | `quickLinks` | object | `items[{ id, enabled, label, url }]` |
| `imageWall` | 圖片連結牆 | `imageWall` | object | `columns`(2–6), `items[{ id, bgType: image\|gradient, imageUrl?, gradient?{from,to,angle?}, url? }]` |
| `tickets` | 票種 | — | live | 由 `events.tickets.*` 渲染，只用 sections 控制顯隱 |
| `announcements` | 公告 | — | live | 由 `events.announcements.*` 渲染 |

> `sections` 決定順序與顯隱；**不在 sections 裡的模組不會顯示**（即使有資料）。新增模組資料時記得一併把 `{ "id": "...", "visible": true }` 加進 sections。

#### 頁面層級欄位

`themeId`（gradient\|minimal\|editorial\|conference\|workshop\|concert\|midnight\|cyber）、`primaryColor`、`baseBg`、`baseInk`、`glassTone`(dark\|light)、`coverAspectRatio`、`background`（`{ type: none|color|gradient|animated|image|library, … }`）、`sections`、`sectionTitles`（自訂模組標題）、`showQa`、`hideRegistrationCount`、`postRegFields`、`completion`（報名完成頁）、`share`（分享預覽）。

#### 範例

```jsonc
{
  "themeId": "gradient",
  "hero": { "subtitle": "亞洲街頭藝術年度盛會", "bgGradient": "sunset" },
  "about": "長文介紹…",
  "primaryColor": "#7c3aed",
  "sections": [
    { "id": "hero" }, { "id": "about" }, { "id": "highlights" }, { "id": "agenda" },
    { "id": "speakers" }, { "id": "tickets" }, { "id": "venue" }, { "id": "offlinePayment" },
    { "id": "faqs" }, { "id": "contact" }
  ],
  "highlights": [{ "icon": "lucide:Mic", "title": "三組國際藝術家", "description": "日本、法國、台灣" }],
  "agenda":     [{ "time": "13:00", "endTime": "14:30", "title": "開幕論壇", "speaker": "王小明" }],
  "speakers":   [{ "name": "王小明", "role": "街頭藝術家", "avatar": "https://…/a.jpg" }],
  "venue":      { "address": "台北市中正區八德路一段1號", "directions": "捷運忠孝新生站 1 號出口步行 5 分鐘" },
  "offlinePayment": { "methods": ["bank_transfer"], "bankName": "國泰世華 013", "accountNumber": "1234567890", "accountHolder": "XX 協會", "instructions": "匯款後請回報末五碼" },
  "faqs":       [{ "q": "需要事先報名嗎？", "a": "需要。" }],
  "contactChannels": [{ "type": "email", "value": "hi@example.com" }, { "type": "line", "value": "@stracd", "label": "官方 LINE" }]
}
```

> **最小改動原則**：先 `events.get` 取現有 `pageContent`，在其基礎上改最小子集後回傳，避免覆蓋已設定的其他模組。

### 票種（`events.tickets.*`）
| Tool | Scope | 說明 |
|---|---|---|
| `events.tickets.list` | read | `{ eventUuid }`，含 soldCount |
| `events.tickets.create` | write | `{ eventUuid, name, ... }`；`quota` 省略=不限名額、`price` 省略=免費。**同一活動內票種名稱不可重複**（不分大小寫），重複回 409 |
| `events.tickets.update` | write | `{ eventUuid, uuid, ... }` |
| `events.tickets.delete` | write | `{ eventUuid, uuid }` |

### 報名表 / 通知
| Tool | Scope | 說明 |
|---|---|---|
| `events.form.get` | read | `{ uuid }`：basicFields / customFields / successMessage / redirectUrl |
| `events.form.put` | write | `{ uuid, basicFields[], customFields[] }`（覆寫）；basicField=`{key,label,enabled,required}`、customField=`{id,label,type,required,options?}` |

> **姓名欄位可關閉**：`basicFields` 中 `key: "name"` 設 `enabled: false` 後，後端不再要求姓名；報名者姓名會從名稱類自訂欄位（label 含「姓名／名字／name」）或 email 前綴推導。Email 仍為必填。
| `events.notifications.get` | read | `{ uuid }` |
| `events.notifications.put` | write | `{ uuid }` 覆寫 `registrationSuccess / preEventReminder / eventChange` |

### 報名名單 / 報到 / 成效
| Tool | Scope | 說明 |
|---|---|---|
| `events.attendees.list` | read | `{ uuid, page?, pageSize?, status?, search? }`；每筆含 **email**、票號、狀態、報到/付款狀態，以及**報名表單填寫資料** `answers`（label→value）與原始 `customValues`；回應頂層 `customFields`（id/label/type）為表單欄位定義 |
| `events.attendees.get` | read | 取**單一**報名者完整資料（以 `attendeeUuid` 優先，否則 `email`）；欄位同 list 每筆 |
| `events.attendees.patch_status` | write | 改報名狀態（核准 / 拒絕 / 取消…） |
| `events.attendees.export_csv` | read | 匯出名單 |
| `events.attendees.bulk_import` | write | 批次匯入（每筆 `{ name, email, phone?, ticketTypeName? }`；票種以**名稱**對應、不分大小寫；`createMissingTicketTypes: true` 會把不存在的票種名稱自動建成免費、不限名額的票種；回傳 `inserted / skipped / errors / createdTicketTypes`） |
| `events.attendees.invite_by_email` | write | Email 邀請 |
| `events.attendees.gift_ticket` | write | 贈票 |
| `events.checkin.summary` | read | 報到統計 |
| `events.checkin.list_attendees` | read | 報到名單（**已取消 / 被拒絕者不會出現**） |
| `events.checkin.manual` | write | 手動勾選報到（cancelled/rejected 會被擋） |
| `events.checkin.recent` | read | 最近報到 |
| `events.report.summary` | read | 成效摘要（總報名 / 到場 / 到場率 / 來源分佈 / UTM / 每日報名 / 最近報名） |
| `events.report.attendees` | read | 成效名單（checked_in / absent） |
| `events.feature_data.get` / `events.feature_data.put` | read/write | 活動頁進階區塊資料 |
| `events.outcomes.list` / `events.outcomes.delete` / `events.outcomes.quota` | read/write | 活動成果紀錄（回顧素材） |

> **僅 dashboard 的加值功能**（`events.feature_data.*` 之外）：**現場交友**——與會者在活動頁「現場交友」牆（`/@id/events/<slug>/networking`）用 HypeLink 帳號（hypeID 搜尋）或社群帳號上傳名片、公開牆可分享，主辦在 dashboard 活動 → 加值功能 → 現場交友 開啟並設定 6 位數入場密碼；MCP 目前無對應工具，請引導到 dashboard。

> 活動探索頁 `/discover/events` 的「全部」以**即將開始**優先排序，再列已結束活動；要讓活動被探索到請確認已發布且時間正確。

> **報名來源 / UTM**：透過自訂 UTM 分享連結報名者，來源會自動歸因，可在 `events.report.summary` 看到來源分佈與 UTM 標籤。

## 活動子功能（`eventsSubfeatures.tools.ts`）

皆 `{ eventUuid, ... }`，read=`events:read`、write=`events:write`：

- **公告** `events.announcements.list/create/update/delete`
- **投票** `events.polls.list/create/update/delete`
- **Q&A** `events.qa.list/patch/delete`
- **問卷** `events.surveys.get_config/put_config/list_responses/summary`
- **徵稿（Submissions）** — 分兩層：**徵稿活動（campaign）** 是一檔徵件設定、**投稿（submission）** 是參加者作品。
  - 總設定 `events.submissions.update_settings`（活動層級開關 / 允許類型）
  - 徵稿活動 CRUD `events.submissions.campaigns.list/create/update/delete`（`update` 可帶 `status: open/closed`；`delete` 連同投稿兩階段確認）
  - 投稿管理 `events.submissions.create`（以**公開檔案 URL** 新增：`fileUrl` + `fileName` 決定型別 png/jpg/mp4/glb/pdf/zip →image/video/model3d/pdf/archive，未帶 `campaignUuid` 歸入預設徵稿活動）`/list`（`includeAll` 連 pending/rejected）`/set_status`（pending/approved/rejected）`/delete`（兩階段）
- **EDM 廣播** `events.broadcasts.preview_audience/send_email/list_history`
- **協作者** `events.collaborators.list/invite/resend/change_role/remove`
- **活動識別** `events.identity.get_config/put_config/list_cards`
- **配對 / 分組名單** `events.pairing.get_current`（讀取目前分組）`/generate`（隨機或依欄位自動分組）`/import`（**批次上傳分組** `rows: [{ group, email, name? }]`，依 email 對應報名者、單次上限 5000 筆，**取代**目前分組）`/add_group`（新增分組，可帶成員）`/add_members`（加入成員到分組，自動從其他組移除）`/remove_member`（從分組移除成員）`/delete_group`（刪除分組）`/reset`（清空，兩階段確認）。成員以 `attendeeUuid` 或 `email` 指定;`add_group`／`import` 在尚無分組時會自動建立 manual session
- **成果紀錄** `events.feature_records.list/create/delete`

> EDM 廣播（`broadcasts.send_email`）會實際寄信 —— **務必先 `preview_audience` 看收件人數與範圍，請使用者明確同意後才發送**。

## 推薦工作流程

1. **開場先 `events.list`（或 `events.get`）** 看現況，再動作。
2. **任何寫入先 `dry_run: true`** → 摘要給使用者確認 → 同意後正式執行。
3. **`events.delete` 兩階段**：第一次回 `{ confirmToken }` + 摘要 → 第二次帶 `confirmToken`。
4. **建活動標準順序**：`events.create` →（記下回傳 uuid）→ `events.tickets.create` ×N → `events.form.put` → `events.notifications.put` →（需要時）`events.set_cover` → 子功能（公告 / 投票…）→ 最後 `events.update { status: "active" }` 發布。
5. **發布前先 `events.check_slug`** 確認網址不衝突。
6. **發 EDM 前先 `events.broadcasts.preview_audience`**，確認對象與封數。

## 安全規則（務必遵守）

1. **永遠 dry-run 後才寫**（除非使用者明確說直接執行）。
2. **會對外發送 / 通知的動作**（`events.cancel`、`broadcasts.send_email`、`attendees.invite_by_email`、`gift_ticket`）一律先預覽 + 取得明確同意。
3. **不要一次大改**：改報名表 / 通知是「覆寫」語意（`put`），請先 `get` 取基底再改最小子集，避免清掉既有設定。
4. **不存 token**：只走 MCP transport，不要印到 chat / 寫檔 / 進 git。
5. **schema 不確定** → `tools/list` 拉最新，不要猜。

## 常見錯誤碼

| Code | 處理 |
|---|---|
| `SCOPE_DENIED` | token 缺 `events:read/write`；請使用者重新產生 |
| `EVENT_QUOTA_EXCEEDED` | 活動數達 999 上限 |
| `RATE_LIMIT` | 約 60 req/min；等 30 秒重試 |
| `VALIDATION_FAILED` | 欄位格式錯（日期 / slug / enum） |
| `NOT_FOUND` | event/ticket/attendee uuid 不存在；先對應 `list` 確認 |
| `CONFIRM_REQUIRED` | delete 未帶 `confirmToken`；先 dry-run 取得 |

## 與 dashboard 的關係

MCP 的活動寫入與 dashboard「活動」後台共用同一套 entities 與快取失效 pipeline，並寫 `mcp_audit_log`；CLI / AI 與後台的修改**立即互相反映**、可在審計頁追溯。

> 品牌頁（首頁資訊 / 設計主題）相關操作見另一支 skill：`hypelink_claude_skill/hypelink-brand-page-mcp/SKILL.md`。
