---
name: hypelink-deal-mcp
description: 透過 HypeLink MCP server 操作「終身成交系統」(/deal)——成交團隊管理員頁 /deal/admin（全部團隊總覽、團隊設定、交戰守則規則、成員與管理權限、移除成員、申請審核、團隊邀請：Email／品牌 @hypeId／Excel 批次、邀請碼、團隊動態與 AI 用量）與品牌後台 › 成交系統（總覽、名單與互動紀錄、下一步、下線夥伴名單、行事曆、年度目標、分享等級、換主管申請）。當使用者要用 Claude 經 /mcp 邀請一批夥伴、審核申請、管理成員與權限、寫交戰守則、整理名單或排今天的跟進時使用。建立／加入團隊、離開團隊、AI 產出（扣 SP 或用團隊金鑰）與 AI 金鑰設定仍在網頁操作。
---

# Skill：HypeLink 成交系統 MCP 操作

透過 **HypeLink MCP server** 操作一個品牌在**終身成交系統**（HL-38）的資料，scope `deal:read` / `deal:write`，共 **37 支**工具。

| 介面 | 網址 | 誰用 | 對應工具 |
|---|---|---|---|
| 成交團隊管理員頁 | `/deal/admin` | 擁有者、管理員 | `deal.teams.*`、`deal.playbook.*`、`deal.members.*`、`deal.requests.*`、`deal.invites.*` |
| 品牌後台 › 成交系統 | `/dashboard/brands/@id/tool/deal` | 每位成員 | `deal.overview.get`、`deal.contacts.*`、`deal.partners.contacts`、`deal.calendar.get`、`deal.goals.*`、`deal.me.*`、`deal.invites.*`、`deal.playbook.list` |

> 成交系統的「名單」就是 CRM 會員（同一個 `memberUuid`、同一筆資料），CRM 欄位、標籤庫、分群見 `hypelink-crm-mcp`。
> - 電話、Email、LINE ID（`lineId`）、社群（`social`→CRM `instagram`）、城市（`city`）都是 CRM 的正式欄位，各自一欄。
> - 照顧標籤在 CRM 標籤庫（分類「照顧」、key `care:*`，不計方案額度），會員身上存名稱，兩邊同一份。
> - 成交紀錄＝CRM 購買紀錄＋平台訂單（商城、數位商品、活動票券、快速收款、報價訂金等，依 Email 對應），會一起算進成交與目標達成。
> 使用說明（成員限定）：`https://hypelink.app/docs/platform/deal`。

## 何時使用

- 「把這份 Excel 的 40 個人都寄團隊邀請」「邀請 @cafe_lane 加入東區團隊」「給我邀請連結，我貼到 LINE」
- 「我管的幾個團隊現在狀況怎樣？哪個團隊最多人該跟進？」
- 「有誰在等我審核？把王小明的申請核准」「把陳美華設成管理員」「把林大文換到張主管底下」「把離職的阿哲移出團隊」
- 「幫團隊寫一條交戰守則：第一次見面不談產品」「把『邀約』分類的規則整理一下」
- 「今天先跟進哪幾個人？」「剛跟李先生通完電話，記一筆並改成準備成交」「看一下小美底下的名單，她卡在哪」
- 「今年目標設 360 萬，每月平均」「我的分享等級改成分享名單」

## 重要前提與邊界

- token 綁定單一品牌，呼叫工具**不需**帶 hypeId；這個品牌就是操作身分（在團隊裡的角色看 `deal.teams.list`）。
- Server：`POST https://api.hypelink.app/mcp`，`Authorization: Bearer hl_pat_<token>`。token 要勾「讀取成交系統」「操作成交系統」（舊 token 要重新建立或在 claude.ai 連接器重新授權）。
- 品牌必須**已加入**成交團隊（或開啟個人使用）才有資料；沒有就引導到 `https://hypelink.app/deal/apply`。**建立團隊、申請加入、離開團隊**不開放 MCP。
- 權限沿用網頁：
  - 團隊管理（`deal.teams.update`、交戰守則寫入、`deal.members.update`／`remove`、審核、重設邀請碼、團隊動態、AI 用量）需這個品牌是該團隊的**擁有者或管理員**。
  - 設定／取消管理員只有**擁有者**能做；管理員不能移除其他管理員。
  - 主管只看得到自己的下線，內容依對方選的分享等級（`stats` 只有數字／`list` 名單／`full` 完整紀錄）；工作、家庭、伴侶、資金與保單**任何等級都不分享**。
- **不開放**：AI 今日重點、AI 行動包、AI 摘要／建議、保單 AI 讀取（扣 SP 或用金鑰）；團隊與個人 AI 金鑰設定（成員可在成交系統 › 設定「我的 AI 金鑰」掛自己的金鑰，AI 會優先走它，再來才是團隊金鑰、平台 SP）；Teams 組織連結。
- 破壞性操作（`deal.teams.reset_invite_code`、`deal.members.remove`、`deal.playbook.delete`、`deal.invites.delete`）一律**兩段確認**：第一次呼叫只回 `confirmToken` 與將執行的內容，**先跟使用者確認**，再於 5 分鐘內帶 `confirmToken`＋相同參數呼叫一次。
- 名單屬個資：只在使用者要求時輸出電話／Email；摘要以姓名、階段、下一步為主。以品牌邀請時系統不會回傳對方擁有者的信箱，不要試圖推測或索取。

## Scope

| Scope | 範圍 |
|---|---|
| `deal:read` | 團隊與全部團隊總覽、團隊動態、AI 用量、交戰守則、成員樹、待審申請、邀請連結與紀錄、品牌搜尋、總覽、名單、下線名單、行事曆、目標 |
| `deal:write` | 團隊設定、交戰守則、成員權限／主管／徽章、移除成員、審核、邀請（寄出／刪紀錄／重設邀請碼）、分享等級、換主管申請、名單與互動紀錄、目標 |

---

## 一、團隊（管理員頁）

| Tool | Scope | 說明 |
|---|---|---|
| `deal.teams.list` | read | 這個品牌加入的團隊：`teamUuid`、團隊名、`role`（owner／admin／member）、`status`（active／pending）、主管、分享等級。**其他工具的 teamUuid 從這裡取** |
| `deal.teams.summary` | read | **全部團隊**：這個品牌當擁有者／管理員的每個團隊一列（成員、審核中、待我審核、在談、該跟進、準備成交、本月成交金額）＋ `totals` 合計 |
| `deal.teams.get` | read | `{ teamUuid }` 團隊設定（業務協作原則、經營重點、照顧標籤、商品、換線規則、可見上限、規則門檻、分級徽章、交戰守則）與我的身分；管理者另含 `inviteCode` |
| `deal.teams.update` | write | `{ teamUuid, name?, industry?, color?, settings? }`。`settings` 可含 `salesPrinciples`、`guide`（Markdown）、`careTags`、`products`、`switchRule`（`upline_approve`／`owner_only`）、`visibilityCap`、`ruleOverrides`、`badges`（`null`＝恢復預設）、`playbook`。只改有送的欄位；陣列欄位整組取代——**先 get 再合併** |
| `deal.teams.activity` | read | `{ teamUuid }` 近 30 天動態：`counts`（approve 加入、leave、remove、switch…）與 `recent` |
| `deal.teams.ai_usage` | read | `{ teamUuid, month? }` 團隊 AI 金鑰用量（擁有者／管理員）：總次數、失敗、每日／每小時（台北）用量、平均回應毫秒、各功能、每位成員用量，與上限 `limits`（每人每月／團隊每月／每人每日，null＝不限） |
| `deal.teams.reset_invite_code` | write ⚠️ | `{ teamUuid }` 重設邀請碼：舊碼與所有舊邀請連結**立即失效**（兩段確認） |

### 交戰守則（`deal.playbook.*`）

團隊的業務規則清單 `{ id, title, category, content }`（最多 100 條，`content` 是 **Markdown**）。成員在成交系統「交戰守則」頁唯讀查看，AI 產生下一步與訊息時也會參考。逐條操作請用這三支，不要自己整組改 `settings.playbook`：

| Tool | Scope | 說明 |
|---|---|---|
| `deal.playbook.list` | read | `{ teamUuid }` 依顯示順序 |
| `deal.playbook.upsert` | write | `{ teamUuid, id?, title?, category?, content?, position? }`。帶 `id`＝修改（只改有送的欄位）；不帶＝新增（`title` 必填）。`position` 1 起算，可順便調整順序 |
| `deal.playbook.delete` | write ⚠️ | `{ teamUuid, id }`（兩段確認） |

寫規則的建議：`title` 是一句可執行的做法（「第一次見面不談產品」），`category` 用團隊共通的分類（開發／邀約／成交／售後），`content` 用 Markdown 寫「為什麼、怎麼做、可以怎麼說」，例如：

```markdown
先建立信任，再談需求。

- 問近況、工作與家人，記到人物側寫
- 對方主動問起才簡短帶過

> 可以這樣說：「最近在忙什麼？上次你說要換工作，後來怎麼樣？」
```

業務協作原則 `salesPrinciples` 與經營重點 `guide` 也是 Markdown，用 `deal.teams.update` 改。

## 二、成員與申請（管理員頁）

| Tool | Scope | 說明 |
|---|---|---|
| `deal.members.list` | read | `{ teamUuid }` 主管鏈樹：`memberUuid`、品牌、`parentMemberUuid`、`role`、`status`、`shareLevel`、`directCount`／`downlineCount`、`badge`、`stats`（依分享等級）。擁有者／管理員看全隊（含審核中），一般成員看自己＋下線 |
| `deal.members.update` | write | `{ teamUuid, memberUuid, role?, parentMemberUuid?, badgeId?, aiKeyEnabled?, aiMonthlyLimit? }`。`role: "admin"`＝有管理權限、可進 `/deal/admin`；`"member"`＝一般成員（只有擁有者能改）。`parentMemberUuid` 直接換主管（不經換線審核） |
| `deal.members.remove` | write ⚠️ | `{ teamUuid, memberUuid }` 移出團隊；他底下的成員接到他的主管底下，對方 CRM 資料完整保留（兩段確認） |
| `deal.requests.list` | read | `{ teamUuid }` 待審的加入申請（`type: join`）與換主管申請（`type: switch`）。`canDecide: false`＝要等對方主管處理（7 天未處理才由擁有者代審） |
| `deal.requests.decide` | write | `{ teamUuid, requestId, type, decision: "approve" \| "reject" }` |

## 三、團隊邀請（任何已加入的成員都能用）

| Tool | Scope | 說明 |
|---|---|---|
| `deal.invites.list` | read | `{ teamUuid }` 我的邀請連結 `joinUrl`（受邀者申請時**預選這個品牌為主管**）、邀請碼、`limits`，與邀請紀錄（擁有者／管理員看全隊，一般成員看自己寄的）。紀錄狀態：`sent`／`failed`／`pending` 已申請／`joined` 已加入；以品牌邀請的紀錄 `email` 為 `null`、`brand` 有值 |
| `deal.invites.search_brands` | read | `{ teamUuid, q }` 用 hypeId 或名稱搜尋公開品牌頁，依關聯度排序（hypeId 完全相符＞開頭＞名稱完全相符＞名稱開頭＞包含），最多 8 筆；`teamStatus` active／pending／null、`mine` 自己的品牌 |
| `deal.invites.send` | write | `{ teamUuid, invites: [...], message?, dryRun? }` 一次最多 **200 位**。每位可為 `"a@b.com"`、`"王小明 <a@b.com>"`、`"王小明, a@b.com"`、`"@hypeId"`，或 `{ email, name }`／`{ hypeId }`（也收 Excel 表頭 `姓名`、`Email`、`品牌`）。以品牌邀請＝寄給該品牌擁有者（信箱不回傳），連結預選該品牌 |
| `deal.invites.delete` | write ⚠️ | `{ teamUuid, inviteUuid }` 刪紀錄（信無法收回、連結仍有效；兩段確認） |

**寄邀請的流程**：

1. `deal.teams.list` 找到 `teamUuid`。
2. 整理名單：
   - 使用者給 Excel／CSV：讀出每列姓名與 Email（或品牌欄），組成 `invites`（超過 200 位分批）。
   - 使用者說品牌名或不確定的 hypeId：先 `deal.invites.search_brands` 讓使用者從候選中確認，再用 `"@hypeId"`；`teamStatus` 不是 `null` 或 `mine: true` 的不要邀。
3. **先** `deal.invites.send { dryRun: true }`，回報：`sent` 會寄出；`skipped`（`already_member`、`already_pending`、`recently_sent` 24 小時內寄過、`self`、`daily_cap` 超過團隊每天 500 封）；`errors`（`invalid_email`、`invalid_hypeid`、`brand_not_found`、`duplicate`、`empty`，附列號）。
4. 使用者確認後拿掉 `dryRun` 正式寄出；`failed` 有值時回報。
5. 只要連結：回 `deal.invites.list` 的 `joinUrl`。

受邀者點連結 → `/deal/apply` 選品牌頁（預選主管與被邀品牌）→ 送出 → 寄件人用 `deal.requests.decide` 審核。

## 四、工作區（品牌後台 › 成交系統）

| Tool | Scope | 說明 |
|---|---|---|
| `deal.overview.get` | read | `{ team?, range? }` 今天先做這幾件、在談、已成交、30 天新加入、團隊夥伴與需要輔導、成交漏斗、客戶照顧。`team`：`all`（預設）或團隊 uuid；`range`：30／90／365／all |
| `deal.contacts.list` | read | `{ team?, range?, q?, view? }` 名單；`kind`：lead 在談／customer 客戶／partner 夥伴；`view`：`active`（預設）／`lost` 不再經營／`others` CRM 其他聯絡人（關閉自動同步時） |
| `deal.contacts.get` | read | `{ memberUuid }` 聯絡方式、人物側寫、互動紀錄、成交紀錄、照顧標籤、下一步 |
| `deal.contacts.create` | write | `{ name, email?, phone?, lineId?, social?, city?, kind?, stage?, nextStep?, nextDate?, teamIds?, nicknames?, careTags?, facets? }`。Email 已在 CRM → 409 `DEAL_CRM_EXISTS`（附 memberUuid，改用 update）；曾從 CRM 刪除 → 409 `DEAL_CRM_DELETED` |
| `deal.contacts.update` | write | `{ memberUuid, ...同上, closed?, lost?, included? }`；`closed` 標成交／取消；`lost: true` 不再經營（CRM lost）、`false` 恢復；`included: true` 把 CRM 其他聯絡人拉進來 |
| `deal.contacts.add_deal` | write | `{ memberUuid, name, amount, date?, note? }` 記一筆成交（寫進 CRM 購買紀錄，來源 deal）；平台訂單會自動算，不用記 |
| `deal.contacts.delete_deal` | write ⚠️ | `{ memberUuid, purchaseUuid }` 只能刪來源 deal 的那筆（兩段確認） |
| `deal.contacts.restore` | write | `{ memberUuid, partnerMemberUuid? }` 還原曾從 CRM 刪除的人。**收到 `DEAL_CRM_DELETED` 先問使用者**，同意才呼叫 |
| `deal.settings.get` / `update` | read／write | 名單界線 `crmSyncAll`：true（預設）CRM 所有客戶都進成交系統；false 只有歸屬事業體／從成交系統新增／有下一步／手動拉進來的（品牌擁有者才能改） |
| `deal.contacts.log` | write | `{ memberUuid, text, type? }` 互動紀錄（call／meet／message／other），更新上次聯絡 |
| `deal.contacts.done` | write | `{ memberUuid, title?, later?, days? }` 下一步完成；`later: true` 順延 `days` 天 |
| `deal.partners.contacts` | read | `{ memberUuid, range?, q? }` 下線夥伴的名單（輔導用）；對方分享等級 `stats` 時回 403 |
| `deal.calendar.get` | read | `{ team?, from?, to? }` 期間內的下一步與生日／週年提醒（預設今天起 14 天） |
| `deal.goals.get` | read | `{ team?, year? }` 年度目標、各月目標、其他收入與達成進度 `computed` |
| `deal.goals.update` | write | `{ team?, year?, target?, months?, extra?, scope? }`；`months` 只送要改的月份 `{ "YYYY-MM": 金額 }`；`extra` 整組取代；`scope` me／team |
| `deal.me.update` | write | `{ teamUuid, shareLevel }` 這個品牌在團隊的分享等級（受團隊可見上限限制） |
| `deal.me.switch_parent` | write | `{ teamUuid, newParentMemberUuid }` 申請換主管（依換線規則由目前主管或擁有者核准；擁有者不能用） |

**成交階段 `stage`**：`0` 陌生新接觸、`1` 潛在成交、`2` 準備成交；已成交用 `closed: true`。
**人物側寫 `facets`**：`work`、`hobby`、`family`、`partner`、`money`。
**照顧標籤 `careTags`**：只接受團隊設定裡的照顧標籤（`deal.teams.get` 的 `settings.careTags`），其他字會被忽略。

## 常見組合

- **全部團隊巡一遍**：`deal.teams.summary` → 依 `requestsToDecide`、`late` 排序念給使用者 → 有待審的跑 `deal.requests.list`／`decide`；該跟進多的團隊用 `deal.members.list` 找出 `stats.late` 高的夥伴。
- **排今天的跟進**：`deal.overview.get` → 念出「今天先做這幾件」→ 做完 `deal.contacts.done`；通話內容 `deal.contacts.log`。
- **一對一輔導**：`deal.members.list` 找夥伴 → `deal.partners.contacts { memberUuid }` 看他的名單與卡關處 → 給建議（不能替他改資料）。
- **新人上手**：`deal.contacts.create`（帶 `stage`、`nextStep`、`nextDate`）→ 隔天 `deal.calendar.get`。
- **主管審核＋分級**：`deal.requests.list` → `decide` → `deal.members.list` 找新成員 → `deal.members.update` 設 `badgeId`（徽章 id 見 `deal.teams.get` 的 `settings.badges`）。
- **給夥伴管理權限**：`deal.members.update { role: "admin" }`（擁有者）。對方就能在 `/deal/admin` 管這個團隊。
- **建交戰守則**：`deal.playbook.list` 看現有 → 逐條 `deal.playbook.upsert` → 請使用者到成交系統「交戰守則」頁確認呈現。
- **邀請碼外流**：`deal.teams.reset_invite_code`（兩段確認，提醒舊連結全失效）→ `deal.invites.list` 取新的 `joinUrl`。

## 錯誤處理

| 錯誤 | 處理 |
|---|---|
| `403 這個品牌不是團隊成員` | 看 `deal.teams.list`；可能要換別的品牌的 token |
| `403 只有團隊擁有者或管理員…` | 這個品牌在該團隊是一般成員；請擁有者／管理員操作或給權限 |
| `403`（`deal.partners.contacts`） | 對方分享等級是「只分享數字」，只能看 `deal.members.list` 的 `stats` |
| `400 一次最多邀請 200 位` | 分批送出 |
| `400 團隊擁有者沒有主管`／`新主管不能是你自己或你的下線` | 換主管只適用於非擁有者，且不能選自己的下線 |
| `409 CRM 裡已經有這個 Email 的客戶` | `deal.contacts.list { q: email }` 找既有 memberUuid 再 update |
| `VALIDATION_FAILED` | 錯誤訊息會列出可用欄位／可用值，照著修正 |
| `CONFIRM_INVALID` | 破壞性操作的第二次呼叫參數要與第一次完全相同，且在 5 分鐘內 |
