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

### 票種（`events.tickets.*`）
| Tool | Scope | 說明 |
|---|---|---|
| `events.tickets.list` | read | `{ eventUuid }`，含 soldCount |
| `events.tickets.create` | write | `{ eventUuid, name, ... }`；`quota` 省略=不限名額、`price` 省略=免費 |
| `events.tickets.update` | write | `{ eventUuid, uuid, ... }` |
| `events.tickets.delete` | write | `{ eventUuid, uuid }` |

### 報名表 / 通知
| Tool | Scope | 說明 |
|---|---|---|
| `events.form.get` | read | `{ uuid }`：basicFields / customFields / successMessage / redirectUrl |
| `events.form.put` | write | `{ uuid, basicFields[], customFields[] }`（覆寫）；basicField=`{key,label,enabled,required}`、customField=`{id,label,type,required,options?}` |
| `events.notifications.get` | read | `{ uuid }` |
| `events.notifications.put` | write | `{ uuid }` 覆寫 `registrationSuccess / preEventReminder / eventChange` |

### 報名名單 / 報到 / 成效
| Tool | Scope | 說明 |
|---|---|---|
| `events.attendees.list` | read | `{ uuid, ... }` |
| `events.attendees.patch_status` | write | 改報名狀態（核准 / 拒絕 / 取消…） |
| `events.attendees.export_csv` | read | 匯出名單 |
| `events.attendees.bulk_import` | write | 批次匯入 |
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

> **報名來源 / UTM**：透過自訂 UTM 分享連結報名者，來源會自動歸因，可在 `events.report.summary` 看到來源分佈與 UTM 標籤。

## 活動子功能（`eventsSubfeatures.tools.ts`）

皆 `{ eventUuid, ... }`，read=`events:read`、write=`events:write`：

- **公告** `events.announcements.list/create/update/delete`
- **投票** `events.polls.list/create/update/delete`
- **Q&A** `events.qa.list/patch/delete`
- **問卷** `events.surveys.get_config/put_config/list_responses/summary`
- **報名審核** `events.submissions.update_settings/list/set_status/delete`
- **EDM 廣播** `events.broadcasts.preview_audience/send_email/list_history`
- **協作者** `events.collaborators.list/invite/resend/change_role/remove`
- **活動識別** `events.identity.get_config/put_config/list_cards`
- **配對** `events.pairing.get_current/generate/reset`
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
