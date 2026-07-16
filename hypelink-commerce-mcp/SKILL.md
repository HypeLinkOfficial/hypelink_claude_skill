---
name: hypelink-commerce-mcp
description: 透過 HypeLink MCP server 經營品牌的變現與成長功能——名單神器（投廣 Landing Page 與名單匣 leads）、Mini 商城（商品/庫存/訂單出貨 mall）、Mini 課程（課程/章節/單元/學員 courses）、聯盟行銷（夥伴/歸因訂單/出金查詢 affiliates）。當使用者要用 Claude 經 /mcp 操作某品牌的商品、訂單、課程、投廣頁名單或聯盟分潤時使用。
---

# Skill：HypeLink 變現與成長 MCP 操作

透過 **HypeLink MCP server** 經營一個品牌的**變現與成長**功能：
名單神器（`leads:*`）、Mini 商城（`mall:*`）、Mini 課程（`courses:*`）、聯盟行銷（`affiliates:*`）。

> 品牌頁（首頁資訊 / 設計主題 / Webhook）見 `hypelink-brand-page-mcp`；活動見 `hypelink-event-mcp`。

## 何時使用

- 「幫我上架一個新商品 / 補庫存 / 把訂單標成已出貨並填單號」
- 「幫我開一門課，加兩個章節各三個單元」
- 「看名單神器投廣頁的名單，把成交的標成 won」
- 「新增一位聯盟 KOL 並寄邀請、給他專屬折扣碼」
- 「查這個月待出金的聯盟夥伴有哪些」

## 重要前提與邊界

- **操作對象是「已存在的品牌」**；token 綁定該品牌（呼叫工具**不需**自帶 hypeId）。
- Server：`POST https://api.hypelink.app/mcp`，`Authorization: Bearer hl_pat_<token>`（HTTP transport）。
- 這些是 **Pro / 付費方案** 功能；token 需含對應 scope，缺 scope 會回 `SCOPE_DENIED` 且工具從 `tools/list` 隱藏。
- **金錢敏感操作一律不開放 API**（見下方各節），請引導使用者到 dashboard 完成。

## Scope

| Scope | 範圍 |
|---|---|
| `leads:read` / `leads:write` | 名單神器：投廣 Landing Page、A/B 變體、名單匣 |
| `mall:read` / `mall:write` | Mini 商城：商品、庫存、訂單出貨 |
| `courses:read` / `courses:write` | Mini 課程：課程/章節/單元、學員名單、數據 |
| `affiliates:read` / `affiliates:write` | 聯盟行銷：夥伴、歸因訂單、出金查詢 |

寫入類工具大多支援 `dry_run: true`；`*.delete` 走兩階段 `confirmToken`。

---

## 一、名單神器（`leads:*`）

投廣 Landing Page 的建立、發布、A/B 測試與名單回收。頁面內容為結構化 `sections` JSON（hero／賣點／見證／FAQ／比較表／好評輪播／LINE 按鈕／倒數／表單…16 種區塊，任一區塊可設 `bg` 背景圖）。

| Tool | Scope | 說明 |
|---|---|---|
| `lead_pages.templates` | read | 列出 9 種模板 |
| `lead_pages.list` | read | 列出投廣頁（含瀏覽 / 送出 / 轉換） |
| `lead_pages.get` | read | 取單一頁完整 `sections` |
| `lead_pages.create` | write | 建立投廣頁（可帶 `templateKey`） |
| `lead_pages.update` | write | 更新；`status: "published"` 即發布。`sections` 建議先 `get` 取回、改完整組回寫 |
| `lead_pages.delete` | write | 兩階段確認 |
| `lead_pages.create_variant` | write | 複製為 A/B 變體（權重分流） |
| `leads.list` | read | 名單匣（狀態管線＋標籤）；**回應含個資** |
| `leads.update` | write | 改單一名單狀態 / 標籤 |

- 公開頁網址：`https://hypelink.app/{hypeId}/lp/{slug}`
- **AI 生成 / AI 調整版面需扣 SP，不開放於 API** —— 請走 dashboard。
- `leads.list` 回傳 Email／電話／表單答案等個資，比照名單匯出處理（勿貼公開處）。

---

## 二、Mini 商城（`mall:*`）

| Tool | Scope | 說明 |
|---|---|---|
| `mall.products.list` | read | 列出商品 |
| `mall.products.get` | read | 單一商品（含規格 / 庫存） |
| `mall.products.create` | write | 上架商品 |
| `mall.products.update` | write | 編輯商品 |
| `mall.products.set_status` | write | 上 / 下架 |
| `mall.products.restock` | write | 補庫存 |
| `mall.orders.list` | read | 訂單列表 |
| `mall.orders.get` | read | 單一訂單（**含買家個資**） |
| `mall.orders.update_fulfillment` | write | 更新出貨狀態（可帶物流單號）；**買家會收到通知信** |

- **結帳、金流與退款不開放於 API**（金錢敏感）—— 請走 dashboard「收款管理」。
- `mall.orders.update_fulfillment` 會**對外寄通知信**：先 `dry_run` 摘要、使用者確認後再送。

---

## 三、Mini 課程（`courses:*`）

| Tool | Scope | 說明 |
|---|---|---|
| `courses.list / get` | read | 課程列表 / 單一課程 |
| `courses.create / update / delete` | write | 課程 CRUD（`delete` 兩階段） |
| `courses.chapters.add / update / delete` | write | 章節 |
| `courses.lessons.add / update / delete` | write | 單元 |
| `courses.students` | read | 學員名單（**含個資**） |
| `courses.analytics` | read | 課程數據 |

- **影片檔上傳（multipart）不開放於 API** —— 請走 dashboard；外部影片連結可經 `courses.lessons.update` 設定。
- 建課標準順序：`courses.create` →（記下回傳 id）→ `courses.chapters.add` ×N →每章 `courses.lessons.add` ×N。
- `courses.students` 含學員個資，比照名單匯出處理。

---

## 四、聯盟行銷（`affiliates:*`）

| Tool | Scope | 說明 |
|---|---|---|
| `affiliates.list / get` | read | 夥伴（KOL）列表 / 單一夥伴 |
| `affiliates.create` | write | 新增夥伴；可同時建專屬優惠碼與折扣；`sendInvite: true` 會**寄邀請信** |
| `affiliates.update` | write | 編輯夥伴 |
| `affiliates.orders` | read | 歸因訂單（該夥伴帶來的訂單） |
| `affiliates.payouts.pending` | read | 待出金彙總 |
| `affiliates.payouts.list` | read | 出金單列表 |
| `affiliates.payouts.get` | read | 單一出金單 |

- **出金單的建立、標記已付與作廢不開放於 API**（金錢敏感）—— 出金**只有查詢**；實際操作請走 dashboard「聯盟行銷 > 出金」。
- `affiliates.create` 帶 `sendInvite: true` 會寄信：先 `dry_run` 確認再送。

---

## 推薦工作流程

1. **開場先讀**：對應 `*.list`（`lead_pages.list` / `mall.products.list` / `mall.orders.list` / `courses.list` / `affiliates.list`）看現況，再動作。
2. **任何寫入先 `dry_run: true`** → 摘要給使用者確認 → 同意後正式執行。
3. **`*.delete` 兩階段**：第一次回 `{ confirmToken }` + 摘要 → 第二次帶 `confirmToken`。
4. **會對外寄信 / 通知的動作**（`mall.orders.update_fulfillment`、`affiliates.create` 帶 `sendInvite`）一律先預覽 + 明確同意。
5. **整組覆寫型欄位**（如 `lead_pages.update` 的 `sections`）先 `get` 取基底，改最小子集再回寫。
6. 回 `SCOPE_DENIED` → 請使用者在 dashboard 產生帶對應 scope 的 token（且該功能需付費方案）。

## 安全規則（務必遵守）

1. **金錢敏感操作不要嘗試繞道**：結帳 / 退款 / 出金建立與付款一律不在 API，直接告知使用者到 dashboard 操作。
2. **個資保護**：`leads.list`、`mall.orders.*`、`courses.students` 回傳含個資，不要貼到公開頻道 / 檔案；必要時遮罩 Email / 電話。
3. **永遠 dry-run 後才寫**（除非使用者明確說直接執行）。
4. **不存 token**：只走 MCP transport，不要印到 chat / 寫檔 / 進 git。
5. **schema 不確定** → `tools/list` 拉最新，不要猜。

## 常見錯誤碼

| Code | 處理 |
|---|---|
| `SCOPE_DENIED` | token 缺對應 scope（或非付費方案）；請使用者重新產生 |
| `RATE_LIMIT` | 約 60 req/min；等 30 秒重試 |
| `VALIDATION_FAILED` | 看 message；多為欄位格式（價格 / 庫存 / URL / enum） |
| `NOT_FOUND` | product/order/course/affiliate id 不存在；先對應 `list` 確認 |
| `CONFIRM_REQUIRED` | delete 未帶 `confirmToken`；先 dry-run 取得 |

## 與 dashboard 的關係

MCP 的寫入與 dashboard 對應後台共用同一套 entities 與快取失效 pipeline，並寫 `mcp_audit_log`；AI 與後台的修改**立即互相反映**、可在審計頁追溯。

> 完整 tool schema：client 端 `tools/list`（MCP）或 `GET /api/v1/openapi.json`（REST）。官方文件：<https://hypelink.app/docs/ai/tools>
