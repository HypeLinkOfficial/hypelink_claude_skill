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
| `events.create` | write | `{ name, startAt, endAt, slug?, description?, format?, location?, meetingUrl?, registration*?, pageContent?, discountCodes?[] }` |
| `events.update` | write | `{ uuid, ... }` 部分更新（`pageContent` 傳 null 物件即清空） |
| `events.duplicate` | write | `{ uuid }` 複製活動 |
| `events.delete` | write | `{ uuid }` 軟刪除，**兩階段確認** |
| `events.cancel` | write | `{ uuid }` 取消活動（會通知已報名者，不刪資料） |
| `events.set_cover` | write | 從**公開圖片 URL** 設定活動封面（`{ uuid, url }`；`clear:true` 清除；後端下載 re-host）。可搭配 AI 生圖或網路圖庫；封面建議 **1200×900，4:3** |
| `events.check_slug` | read | `{ slug, excludeUuid? }` 檢查 slug 可用 |
| `events.slug_history` | read | `{ uuid, limit? }` slug 變更歷史 |

### `pageContent` 結構（EventContent）

`events.create` 與 `events.update` 的 `pageContent` 使用結構化 **EventContent** JSON（非舊版 Puck 格式）：

```jsonc
{
  "themeId": "gradient",        // gradient|minimal|editorial|conference|workshop|concert|midnight|cyber
  "hero": {
    "title": "",                // 留空時用 event.name
    "subtitle": "",             // 副標 / tagline
    "bgGradient": "hype"        // hype|sunset|ocean|aurora|forest|midnight（官方漸層配色）
                                // 或省略讓主題自帶漸層
  },
  "about": "長文介紹（純文字）",
  "body": "<p>富文字 HTML</p>",
  "primaryColor": "#7c3aed",    // 全頁 CTA / 通知信主色
  "background": {
    "type": "animated",         // none|color|gradient|animated
    "animatedVariant": "iridescence",
    "accent": "#8B5CF6"
  },
  "sections": [                 // 內容模組排序＋顯隱（hero 也可排序）
    { "id": "hero",    "visible": true },
    { "id": "about",   "visible": true },
    { "id": "tickets", "visible": true }
    // id 可為：hero/about/body/highlights/agenda/speakers/faqs/
    //          sponsors/notes/album/tickets/venue/contact/offlinePayment
  ],
  "highlights": [{ "icon": "lucide:Star", "title": "", "description": "" }],
  "agenda":     [{ "time": "09:00", "title": "", "speaker": "" }],
  "speakers":   [{ "name": "", "role": "", "avatar": "", "bio": "" }],
  "faqs":       [{ "question": "", "answer": "" }],
  "contactChannels": [
    { "type": "line",     "value": "@handle", "label": "" },
    { "type": "telegram", "value": "@user" },
    { "type": "discord",  "value": "invite-code" },
    { "type": "email",    "value": "hi@example.com" }
  ]
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
