---
name: hypelink-brand-page-mcp
description: 透過 HypeLink MCP server 製作 / 編輯品牌頁（首頁資訊：profile、folders、links、page modules、socials，以及設計主題 design/theme）。當使用者要用 Claude 經 /mcp 操作某個既有品牌的公開頁內容或外觀時使用。
---

# Skill：HypeLink 品牌頁 MCP 操作

透過 **HypeLink MCP server** 製作與維護一個品牌的**公開頁內容與外觀**：
首頁資訊（profile / folders / links / page modules / socials）＋ 設計主題（design / theme）。

## 何時使用

- 「幫我把 IG / 官網連結加進品牌頁」
- 「新增一個『關於我們』分頁放在第一個位置，並放一段公司簡介」
- 「把首頁 bio 改成更專業的口吻」
- 「找出所有 dead link 並刪除」
- 「把品牌頁套成深色主題 / 換主題色」
- 「依『公司品牌』樣板把空品牌頁一次填好」

## 重要前提與邊界

- **MCP 操作的是「已存在的品牌」**。建立品牌實體本身（hypelink shell）走 dashboard / onboarding，**MCP 沒有 `hypelinks.create`**。先確認品牌已存在、且使用者已產生 token。
- **一個 token 綁定一個 brand**：server 由 token 解析 `hypeId`，呼叫工具時**不需**自己帶 hypeId。
- Server 端點：`POST https://api.hypelink.app/mcp`，`Authorization: Bearer hl_pat_<token>`（HTTP transport，MCP 2025-03-26）。
- Token 在 dashboard `/dashboard/brands/[hypeId]/settings/api-tokens` 產生；scope 不足會回 `SCOPE_DENIED`。

## Scope

- `homeinfo:read` → 可讀（profile / folders / links / modules / socials / design / themes）
- `homeinfo:write` → 才能寫
- 寫入類工具大多支援 `dry_run: true`（回傳 changes 不執行）；`*.delete` 走兩階段 `confirmToken`。

## 可用工具

### 開場（先讀）
| Tool | Scope | 說明 |
|---|---|---|
| `homeinfo.get_overview` | read | **對話開場第一支**：一次取回 profile + folders + module 計數 + socials 計數 |

### Profile（品牌基本資料）
| Tool | Scope | 說明 |
|---|---|---|
| `profile.get` | read | 完整 profile |
| `profile.update` | write | `name / description / mail / isPublic / publicEnabled / stickyNote / prefer3dFirst / seoTitle / seoDescription / socialOgImageUrl / hideFooterBranding` 等任意子集 |
| `profile.set_image` | write | 從**公開圖片 URL** 設定 avatar / socialOgImage / brandLogo（`{ target, url }`；後端下載並 re-host 到 R2，限 image/*、10MB） |

### Folders（分頁 / 分類）
| Tool | Scope | 主要參數 |
|---|---|---|
| `folders.list` | read | — |
| `folders.create` | write | `{ name, iconKey?, description?, accessMode?, password?, memberTierIds?, acknowledgeAccessChange? }` |
| `folders.update` | write | 部分更新 |
| `folders.reorder` | write | `{ orderedIds }` |
| `folders.delete` | write | 預設 `dry_run=true`；實刪需兩階段 |

> **存取門檻變更**（`accessMode !== 'public'`，例如鎖密碼 / 會員限定）一定要使用者**明確同意**才帶 `acknowledgeAccessChange: true`，避免不小心把公開分頁鎖起來。
> **至少保留一個分頁** —— 後端會擋下刪除最後一個分頁（避免空殼）。

### Links（連結卡）
| Tool | Scope | 說明 |
|---|---|---|
| `links.list` | read | 支援 `?folderId` 過濾 |
| `links.create` | write | 連結卡欄位（name / url / 描述 / size / backgroundType / buttonSize / **textPosition** 等） |
| `links.update` | write | 部分更新 |
| `links.set_image` | write | 從**公開圖片 URL** 設定連結卡封面（`{ id, url }`；`clear:true` 清除）—— 可搭配 AI 生圖或網路圖庫：取得公開圖片網址即可套用 |
| `links.reorder` | write | `{ orderedIds }` |
| `links.delete` | write | 兩階段 |

> `textPosition` 可選 `top-left / top-right / bottom-left / bottom-right / center`（卡片標題文字位置，預設 `bottom-left`）。

### Page Modules（首頁內容模組）
| Tool | Scope | 說明 |
|---|---|---|
| `modules.list` | read | — |
| `modules.add` | write | `{ folderId, moduleId, data }`；**`data` schema 隨 `moduleId` 動態變化** |
| `modules.update` | write | — |
| `modules.reorder` | write | — |
| `modules.delete` | write | — |

> 常見 `moduleId`：`richtext`（`{ content }`）、`text-btn`（`{ text, url, style }`）、`bio`、`inquiry-form`、`video`、`logo-wall`…。
> **不確定某模組的 `data` 形狀時，先 `tools/list` 拉最新 schema 或 `modules.list` 看既有模組的 data，不要憑記憶猜。**

### Socials（社群列）
| Tool | Scope | 說明 |
|---|---|---|
| `socials.list` | read | — |
| `socials.set` | write | 新增一筆（依 `type` + `data`） |
| `socials.update` | write | 編輯既有 `id` |
| `socials.reorder` | write | — |
| `socials.delete` | write | 兩階段確認 |

### 設計 / 主題（外觀）
| Tool | Scope | 說明 |
|---|---|---|
| `design.get` | read | 取得目前 `designSettings` |
| `design.put` | write | **整包替換** `designSettings`（`{ settings }`）—— 風險高，務必先 `design.get` 再做最小變更 |
| `design.set_theme` | write | 套用內建主題（`{ themeId }`，例如 `builtin-original` / `builtin-dark` / `builtin-notion`…） |
| `themes.list` | read | 列出可用內建主題 |

> 改主題色：選了內建主題後，主題色覆寫值（accentColor）會影響強調色與分頁 active 文字。`design.put` 是整包替換，請以 `design.get` 的結果為基底改最小子集，避免清掉其他設定。

## Resources（自動上下文）

可用 `@hypelink://...` attach 讓 Claude 自動拉完整狀態：
`hypelink://brand/profile`、`hypelink://brand/overview`、`hypelink://brand/folders`、`hypelink://brand/folders/{id}`（該分頁的 links + modules）。

## 推薦工作流程

1. **開場先 `homeinfo.get_overview`** —— 沒有上下文不要直接 mutate。
2. **任何寫入前先 `dry_run: true`** → 把 changes 摘要給使用者確認 → 同意後移除 dry_run 正式執行。
3. **`*.delete` 兩階段**：第一次回 `{ confirmToken }` + 將刪除的摘要 → 第二次帶 `confirmToken` 執行。
4. **調順序用 `*.reorder { orderedIds }`**，不要用 N 次 update。
5. **`design.put` 一律先 `design.get`** 取基底，只改必要欄位。
6. 回 `SCOPE_DENIED` → 請使用者在 dashboard 重新產生帶足 scope 的 token。

### 範例：一鍵把空品牌頁填成「公司品牌」雛形
1. `homeinfo.get_overview` 看現況（避免重複）。
2. `profile.update`（dry-run → 確認）寫 name / description / seo。
3. `folders.create` ×3：關於我們 / 產品與服務 / 聯絡我們（記下回傳的 folderId）。
4. 每個分頁 `links.create` 放示範連結、`modules.add` 放 richtext / text-btn / inquiry-form。
5. `socials.set` 補社群。
6. 最後 `homeinfo.get_overview` 複查。
> 後台已有「公司品牌」內容樣板（新建品牌時套用）；MCP 這裡是對既有品牌補內容時的等價流程。

## 安全規則（務必遵守）

1. **永遠 dry-run 後才寫**（除非使用者明確說直接執行）。
2. **不要產生「整個改掉」的提案**：例如「重寫所有連結」應拆成「先 list → 逐項精準改」。`design.put` 尤其危險（整包替換）。
3. **存取門檻變更**需使用者明確同意才設 `acknowledgeAccessChange: true`。
4. **不存 token**：只走 MCP transport；不要把 token 印到 chat / 寫檔 / 進 git。
5. **schema 不確定** → `tools/list` 拉最新，不要猜。

## 常見錯誤碼

| Code | 處理 |
|---|---|
| `SCOPE_DENIED` | token 缺 scope；請使用者重新產生 |
| `RATE_LIMIT` | 約 60 req/min；等 30 秒重試 |
| `VALIDATION_FAILED` | 看 message；多為欄位格式（URL / 長度 / enum） |
| `NOT_FOUND` | id 不存在；先 `list` 確認 |
| `CONFLICT_DIRTY_BASELINE` | 後台被他人同時改；先 `get_overview` 重抓再試 |
| `CONFIRM_REQUIRED` | delete 未帶 `confirmToken`；先 dry-run 取得 |

## 與 dashboard 的關係

MCP 對首頁資訊 / 設計的任何寫入都會：寫入既有 entities、觸發 `revalidateBrandPublicCache`（與 dashboard 儲存同 pipeline）、寫一筆 `mcp_audit_log`（owner 可在後台查）。CLI / AI 與 dashboard 的修改會**立即互相反映**。

> 活動（events）相關操作見另一支 skill：`hypelink_claude_skill/hypelink-event-mcp/SKILL.md`。
