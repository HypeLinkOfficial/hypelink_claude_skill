---
name: hypelink-teams-mcp
description: 透過 HypeLink MCP server 操作「Teams 組織後台」(/teams/console)——組織與總覽、成員（編號、自訂欄位、等級、徽章、停權、移出、Email 邀請、帳號授權）、綁定申請審核、組織 CRM 名單與互動、月目標、最新消息、組織單位（子組織建立／編輯／刪除／權限、邀請品牌綁定）、會員制度（等級、勳章、幹部、自訂欄位）、證書（範本、批次頒發、撤銷）、論壇與大會、企業公開頁（Banner／主題／分頁／自訂頁面／商城隱藏／品牌範本／圖片）、多語系與 AI 翻譯（只用組織自己的 AI 金鑰）。當使用者要用 Claude 經 /mcp 管理一個 Teams 組織時使用。帳號升級授權、星砂轉帳、自訂網域、刪除組織、CSV 匯出、AI 金鑰設定與 Logo 上傳仍在網頁操作。
---

# Skill：HypeLink Teams 組織 MCP 操作

透過 **HypeLink MCP server** 操作 **Teams 組織後台** `/teams/console/<orgUuid>`，scope `teams:read` / `teams:write`，共 **76 支**工具。

> 使用說明：`https://hypelink.app/docs/teams/console`（「AI 金鑰」「用 Claude 管理組織（MCP）」兩節）。完整工具表：`https://hypelink.app/docs/ai/tools` 的「Teams 組織」。

## 何時使用

- 「有誰在等審核？資料齊的都核准，其他退回並說明原因」
- 「把這份名單的 30 位都寄加入邀請」「授權 amy@company.com 當管理員」
- 「列出台中分會的成員，把沒有成員編號的補上」「把王小明的等級改成 DTM」
- 「新增一個高雄分會，負責人是 lee@example.com」「把新竹分會改掛到北區底下」
- 「頒發『2026 優秀講師』證書給這 8 個品牌頁」「把這張證書撤銷」
- 「在公告論壇發一篇年會通知」「建一場 12 月的年會，議程和講者如下…」
- 「把企業公開頁的 Banner 標語改成…，關於我們加一段」「把公開頁翻成英文和日文」
- 「這個月組織目標設 300 萬，各分會各 50 萬」「名單裡還沒聯絡的轉給 Amy 跟進」

## 身分、權限與方案

- Server：`POST https://api.hypelink.app/mcp`，`Authorization: Bearer hl_pat_<token>`。token（或 claude.ai 連接器授權）要勾「**讀取 Teams 組織**」「**管理 Teams 組織**」。
- **權限＝建立 token 的帳號在該組織的角色**（不是 token 綁定的品牌）：跟他登入組織後台能做的事完全一樣。
  - 角色：owner > admin > manager > sales > viewer。上層組織的 owner／admin 對子組織視為 admin，manager 視為 manager，其他為 viewer。
  - 多數寫入需 **owner／admin**；名單、論壇發文、最新消息開放較多角色（見各工具描述）；sales 只看得到指派給自己的名單。
  - 成員管理（改資料、停權）要在**成員所屬組織**的 `orgUuid` 操作；子組織的綁定申請要在子組織審核。
- **方案**：所有 Teams 方案（basic／growth／scale）都可讀寫，沒有方案門檻；能不能做只看角色。
- 所有寫入都會記在組織稽核紀錄（`mcp:<tool>`）。
- 個資：成員 Email、電話只在使用者要求時輸出；邀請品牌綁定時系統不回傳品牌擁有者信箱，不要推測或索取。

## 標準流程

1. `teams.orgs.list` → 讓使用者選組織（有多個時列名稱與角色），記下 `orgUuid`。
2. 先讀：`teams.orgs.get`／`teams.overview`／`teams.members.list`／`teams.config.get`…，把要改的對象與現況說清楚。
3. **寄信類先 dryRun**：`teams.members.invite`、`teams.org_units.create`、`teams.org_units.invite_brand` 帶 `dryRun: true`，把「會寄給誰／會略過誰」給使用者確認。
4. 使用者確認後才正式寫入（`dryRun: false` 或不帶）。
5. 破壞性工具（⚠️）第一次呼叫只回 `confirmToken`：**先跟使用者確認**，5 分鐘內帶 `confirmToken`＋相同參數再呼叫一次。
6. 「整組取代」的工具（`levels.set`、`badges.set`、`cadres.set`、`members.set_badges`、`brand_templates.set`、`mall.set_hidden`、公開頁的陣列欄位）一定先讀出現有內容、修改後整包送回，**保留既有 id**。

## 工具

### 組織與總覽

| Tool | 讀/寫 | 用途 |
|---|---|---|
| `teams.orgs.list` | 讀 | 我可以進入的組織與角色 |
| `teams.orgs.get` | 讀 | 組織資料、方案與用量、合約到期、主要品牌頁 |
| `teams.overview` | 讀 | 首頁 KPI、待審數 |
| `teams.tree` | 讀 | 子組織樹（owner／admin） |

### 成員與審核

| Tool | 讀/寫 | 重點參數 |
|---|---|---|
| `teams.members.list` | 讀 | `includeDescendants`、`status`、`role`、`unitOrgUuid`、`q`、`customField {key,value}`、`page`、`pageSize` |
| `teams.members.get` | 讀 | `memberUuid`（含活動參與紀錄） |
| `teams.members.update` | 寫 | `memberUuid`、`role`、`memberCode`、`profile`、`customFields`（未定義的欄位會被丟掉；擁有者不能被降級） |
| `teams.members.set_level` | 寫 | `memberUuid`、`levelId`（null 清除） |
| `teams.members.set_badges` | 寫 | `memberUuid`、`badgeIds`（整組取代） |
| `teams.members.set_public` | 寫 | `memberUuid`、`isPublic`、`publicAlias` |
| `teams.members.suspend` ⚠️ | 寫 | `memberUuid`、`action`（suspend／reactivate） |
| `teams.members.move` | 寫 | `memberUuid`、`targetOrgUuid` |
| `teams.members.remove` ⚠️ | 寫 | `memberUuid`（刪除成員並解除品牌頁綁定；只想暫停用 suspend） |
| `teams.members.invite` | 寫・寄信 | `emails`（最多 50）、`dryRun` |
| `teams.access.grant` | 寫 | `email`、`role`（admin／manager／viewer；不寄信，對方須有帳號） |
| `teams.requests.list` | 讀 | 本組織待審的綁定申請 |
| `teams.requests.decide` | 寫 | `decisions[]`：`memberUuid`、`decision`（approve／reject）、`role`、`reason`；逐筆回報 |

### 名單與目標

| Tool | 讀/寫 | 重點參數 |
|---|---|---|
| `teams.leads.list` | 讀 | `category`、`status`、`assignedMemberUuid`、`source`、`q`、`page` |
| `teams.leads.get` | 讀 | `leadUuid`（含互動紀錄） |
| `teams.leads.create` | 寫 | `name`、`email`、`phone`、`company`、`category`、`sourceName`、`assignedMemberUuid` |
| `teams.leads.update` | 寫 | `leadUuid`、`category`、`status`（new／contacted／in_progress／won／lost）、`note`、`nextFollowUpAt` |
| `teams.leads.add_activity` | 寫 | `leadUuid`、`type`（call／message／visit／exhibition／note）、`content`、`nextFollowUpAt` |
| `teams.leads.reassign` | 寫 | `leadUuid`、`memberUuid`（owner／admin／manager） |
| `teams.crm_dashboard` | 讀 | CRM 儀表板（owner／admin／manager） |
| `teams.event_attendees.list` | 讀 | `q`、`eventUuid`、`status`、`page` |
| `teams.goals.get` / `teams.goals.set` | 讀/寫 | `month`、`totalTarget`、`brandTargets {"@hypeId": 金額}`、`goalsVisibleToBrands` |

### 最新消息

`teams.news.list`（讀）、`teams.news.create`（`title`、`body`）、`teams.news.delete` ⚠️（`newsUuid`）——寫入需 owner／admin／manager。

### 組織單位與權限

| Tool | 讀/寫 | 重點參數 |
|---|---|---|
| `teams.org_units.create` | 寫・寄信 | `name`、`slug`、`email`（負責人帳號）、`parentOrgUuid`、`dryRun` |
| `teams.org_units.update` | 寫 | `targetOrgUuid`、`name`、`slug`、`description`、`parentOrgUuid`、`secondaryParentUuids` |
| `teams.org_units.delete` ⚠️ | 寫 | `targetOrgUuid`（停用，子單位改掛上一層） |
| `teams.org_units.members` | 讀 | `targetOrgUuid` |
| `teams.org_units.invite_brand` | 寫・寄信 | `targetOrgUuid`、`hypeId`、`dryRun` |
| `teams.brands.search` | 讀 | `q`（找品牌頁 hypeId） |
| `teams.org_units.permissions_get` / `permissions_set` | 讀/寫 | `targetOrgUuid`、`publicSite`、`mall`、`events`、`viewScope`（subtree／all）、`editScope`（subtree／self） |

### 會員制度與證書

| Tool | 讀/寫 | 重點參數 |
|---|---|---|
| `teams.config.get` | 讀 | 等級、勳章、幹部、自訂欄位（任何成員可讀） |
| `teams.levels.set` / `teams.badges.set` / `teams.cadres.set` | 寫 | `levels`／`badges`／`terms`（整組取代，保留 id） |
| `teams.member_fields.upsert` / `delete` ⚠️ | 寫 | `fieldUuid`、`label`、`type`、`options`、`required`、`sortOrder` |
| `teams.certificates.list` | 讀 | 範本與頒發紀錄 |
| `teams.certificates.upsert` | 寫 | `certUuid`、`name`、`description`、`validMonths`、`status`（archived＝封存） |
| `teams.certificates.issue` | 寫 | `certUuid`、`hypeIds`（最多 50）、`note`；不寄信，逐筆回報 |
| `teams.certificates.revoke` ⚠️ | 寫 | `issueUuid` |

### 論壇

| Tool | 讀/寫 | 重點參數 |
|---|---|---|
| `teams.forums.list` / `get` | 讀 | `forumUuid` |
| `teams.forums.upsert` | 寫 | `forumUuid`、`name`、`postAccess`、`template`、`startAt`、`endAt`、`venue`、`agenda`、`speakers`、`sponsors`、`isPublic`…（owner／admin） |
| `teams.forums.delete` ⚠️ | 寫 | `forumUuid`（連同貼文） |
| `teams.forum_posts.list` / `get` | 讀 | `forumUuid`、`q`、`postUuid` |
| `teams.forum_posts.upsert` | 寫 | `postUuid`、`forumUuid`、`title`、`content`（HTML）、`pinned`；以使用者本人身分發文 |
| `teams.forum_posts.delete` ⚠️ / `teams.forum_comments.delete` ⚠️ | 寫 | `postUuid`／`commentUuid` |
| `teams.forum_posts.comment` | 寫 | `postUuid`、`content`（純文字） |

### 企業公開頁、多語系與圖片

| Tool | 讀/寫 | 重點參數 |
|---|---|---|
| `teams.public_site.get` | 讀 | Banner、主題、品牌色、分頁、自訂頁面、多語系設定 |
| `teams.public_site.update` | 寫 | `brandSettings`、`sections`（陣列欄位整組取代，先 get） |
| `teams.about.update` | 寫 | `name`、`description`（slug 只在網頁改） |
| `teams.pages.list` / `get` / `upsert` / `reorder` / `delete` ⚠️ | 讀/寫 | `pageUuid`、`title`、`slug`、`kind`、`access`、`sections`、`contentHtml`；公開網址 `/t/<代稱>/p/<slug>` |
| `teams.mall.get` / `set_hidden` | 讀/寫 | `hiddenProductUuids`（整組取代；商品本身用該品牌的 `mall.*`） |
| `teams.brand_templates.get` / `set` | 讀/寫 | `templates`（整組取代） |
| `teams.assets.upload` | 寫 | `kind`、`dataBase64` 或 `url`（https），回傳 url |
| `teams.i18n.get` | 讀 | `locale`（帶了回每個欄位的原文、譯文、狀態） |
| `teams.i18n.settings_set` | 寫 | `defaultLocale`、`enabledLocales`（最多 8 種） |
| `teams.i18n.put` | 寫 | `locale`、`items [{path, value}]`（value 空字串＝刪除） |
| `teams.i18n.ai_translate` | 寫 | `locale`、`mode`（missing／outdated／all）；**只用組織 AI 金鑰** |
| `teams.ai_key.get` | 讀 | 金鑰狀態：`effective` own／inherited／none（不回傳金鑰） |

## 常見組合

- **批次審核**：`teams.requests.list` → 依使用者條件分成核准／退回 → 念清單確認 → `teams.requests.decide`（一次最多 50 筆，逐筆看結果；「席次已滿」要請使用者升級方案或先移出成員）。
- **從名單邀請成員**：整理 Email → `teams.members.invite { dryRun: true }` → 念出 `willSend`／`alreadyMember`／`invalid` → 確認後 `dryRun: false`（超過 50 位分批）。
- **新增分會**：`teams.tree` 找父層 → `teams.org_units.create { dryRun: true }`（檢查負責人帳號、代號、父層）→ 確認後正式建立 → 需要時 `teams.org_units.invite_brand` 邀品牌綁定。
- **頒發證書**：`teams.certificates.list`（沒有範本先 `upsert`）→ `teams.brands.search` 確認每個 hypeId → `teams.certificates.issue`。
- **論壇公告**：`teams.forums.list` 找公告論壇 → `teams.forum_posts.upsert`（`pinned: true` 置頂需 owner／admin）→ 另發 `teams.news.create` 讓首頁看得到。
- **翻譯公開頁**：`teams.ai_key.get`——`effective: none` 就請使用者先到「企業設定 › AI 金鑰」綁定 → `teams.i18n.settings_set` 啟用語言 → `teams.i18n.ai_translate { mode: "missing" }` → `teams.i18n.get { locale }` 抽查，需要時 `teams.i18n.put` 手動修正。
- **整理會員資料**：`teams.config.get` 看自訂欄位與等級 → `teams.members.list { customField }` 找對象 → 逐筆 `teams.members.update`／`set_level`。

## 不開放（只在網頁操作）

帳號升級授權（tier grants）、星砂轉帳、自訂網域、刪除組織／變更方案／離開組織、名單與活動報名者 CSV 匯出、組織 AI 金鑰設定與刪除（機密）、Logo 上傳、主要品牌頁設定。遇到這些需求，告訴使用者到組織後台對應頁面處理。

## 錯誤處理

| 錯誤 | 處理 |
|---|---|
| `SCOPE_DENIED 權限不足：需要 owner／admin…` | 你在這個組織的角色不夠；請擁有者／管理員操作或授權 |
| `SCOPE_DENIED`（缺 scope） | token 沒勾 Teams 權限；重新建立 token 或重新授權連接器 |
| `您並非此組織的成員或已停權` | `orgUuid` 錯或帳號不在組織；重跑 `teams.orgs.list` |
| `請先在組織後台「設定 › AI 金鑰」綁定…` | 沒有組織金鑰，請使用者到網頁綁定（MCP 不能設定金鑰） |
| `組織 AI 金鑰無效或沒有權限／額度用完` | 金鑰失效，請使用者到網頁更新；不會改用平台 AI |
| `VALIDATION_FAILED` | 依訊息修正參數（欄位名、enum、格式） |
| `CONFIRM_INVALID` | 破壞性操作第二次呼叫的參數要與第一次完全相同，且在 5 分鐘內 |
