---
name: hypelink-newsletter-mcp
description: 透過 HypeLink MCP server 準備與分析品牌的電子報（newsletter）——電子報草稿建立／修改／組版預覽、訂閱者匯入與整理、成效（開信／點擊）、設定與電子報公開頁、範本、寄件點數與信譽查詢。當使用者要用 Claude 經 /mcp 寫一封電子報草稿、整理訂閱名單、看哪一封表現好，或調整電子報公開頁時使用。實際寄出、排程與購買點數只在後台。
---

# Skill：HypeLink 電子報 MCP 操作

透過 **HypeLink MCP server** 幫品牌**準備電子報、整理訂閱者、看成效**（`newsletter:*`）。

## 何時使用

- 「幫我寫下週的電子報草稿，放最新三篇文章和新商品」
- 「把這份名單匯入訂閱者，貼上『展覽名單』標籤」
- 「上個月哪一封開信率最高？主旨有什麼共通點？」
- 「這封如果寄給訂閱者加上 VIP 分群，大概會寄給幾個人？」
- 「把電子報公開頁打開，只讓付費會員看」
- 「我還剩多少寄件點數？寄件信譽正常嗎？」

## 重要前提與邊界

- 操作對象是「已存在的品牌」；token 綁定該品牌。Server：`POST https://api.hypelink.app/mcp`。
- Token 需含 **`newsletter:read` / `newsletter:write`**；方案門檻與後台相同（Creator 以上）。
- **MCP 不能寄信。** 正式寄出、排程、測試信、重寄未開信者、訂閱意願詢問信、購買寄件點數、寄件網域綁定都只在後台——寄信會實際送到收件人信箱並扣點數，必須由人確認。
- 草稿建好後的固定收尾：告訴使用者到後台「電子報」確認內容、收件人數與點數後寄出。
- 所有工具走 `inputSchema` 嚴格驗證，欄位打錯會回 `VALIDATION_FAILED` 並列出可用欄位。

## Tools

| Tool | Scope | 說明 |
|---|---|---|
| `newsletter.issues.list` | read | 草稿、排程中、已寄出的電子報；`status` 篩選 |
| `newsletter.issues.get` | read | 單封完整內容；`includeHtml: true` 才附 HTML 快照（很長） |
| `newsletter.issues.create` | write | 建立草稿，必填 `subject` |
| `newsletter.issues.update` | write | 改草稿或尚未寄出的排程；`blocks` 整組取代 |
| `newsletter.issues.delete` | write | 兩階段確認 |
| `newsletter.issues.preview` | read | 組版後的信件 HTML（不寄出） |
| `newsletter.issues.stats` | read | 單封成效：開信、點擊、各區塊點擊、每日走勢 |
| `newsletter.stats.overview` | read | 各封開信率與點擊率 |
| `newsletter.sources` | read | 可放進信裡的文章／商品／課程／活動（拿 `refUuid`） |
| `newsletter.recipients.estimate` | read | 試算收件人數（不寄信、不扣點數） |
| `newsletter.subscribers.list` / `.summary` | read | 訂閱者列表與各狀態人數；**含 Email** |
| `newsletter.subscribers.import` | write | 匯入（≤5000）；已退訂的不會被重新訂閱 |
| `newsletter.subscribers.update` | write | 姓名、標籤、狀態（`subscribed`／`unsubscribed`） |
| `newsletter.subscribers.delete` | write | 兩階段確認；只想停寄請改設 `unsubscribed` |
| `newsletter.settings.get` / `.update` | read / write | 寄件者、回覆信箱、簽名檔、雙重確認、歡迎序列、公開頁 |
| `newsletter.archive.list` / `.set_public` | read / write | 已寄出的電子報是否顯示在公開頁 |
| `newsletter.templates.list` / `.save` | read / write | 範本與可重用區塊 |
| `newsletter.credits.get` | read | 寄件點數、本月贈送額度與重置時間 |
| `newsletter.reputation.get` | read | 近 30 天退信率、檢舉率、是否被暫停 |

## 內容區塊（`blocks`）

每個區塊 `{ id, type, size?, ... }`，`id` 同一封內不可重複。

- 自己帶內容：`text`（`title`＋`body` 純文字）、`richtext`（`html`，伺服端消毒）、`image`（`imageUrl`＋`url`）、`link`／`cta`（`title`＋`url`＋`buttonLabel`）、`video`（`videoUrl`）、`sponsor`
- 引用型：`article`／`product`／`course`／`event` 只給 `refUuid`。先呼叫 `newsletter.sources` 取得可用的 uuid；寄出時會抓最新的標題、封面與價格
- `size`：`full`（預設）或 `half`（兩個 half 並排）

## 收件對象（`audience`）

`subscribers` 訂閱者／`members` 會員／`all` 兩者／`extra` 只寄 `extraEmails`／`both` 會員＋`extraEmails`／`segment`（需 `segmentUuid`，CRM 分群）／`funnel`（需 `funnelFilter`）／`multi`（需 `audienceSources`，多來源聯集去重）。

改完收件對象用 `newsletter.recipients.estimate` 試算人數，對照 `newsletter.credits.get` 的餘額，再提醒使用者。

## 推薦工作流程

**寫一封草稿**
1. `newsletter.issues.list` 看最近幾封的主旨與語氣；`newsletter.stats.overview` 看哪類內容表現好
2. `newsletter.sources` 取得要引用的文章／商品 uuid
3. 先把主旨、預覽文字、區塊大綱給使用者看，確認後 `newsletter.issues.create`
4. `newsletter.issues.preview` 檢查組版結果
5. 提醒使用者到後台確認並寄出

**整理訂閱者**
1. `newsletter.subscribers.summary` 看現況
2. 匯入前確認名單已同意收信；`newsletter.subscribers.import` 帶 `tags`
3. 回報新增／略過筆數

**開放公開頁**（預設不公開）
1. `newsletter.settings.update`：`archiveEnabled: true`，要限定會員等級再帶 `archiveTiers`
2. `newsletter.archive.list` 檢查每一封，逐封用 `newsletter.archive.set_public` 調整

## 安全規則

- 訂閱者資料含 Email，不要貼到公開處，也不要匯入來源不明或未經同意的名單。
- 不要把已退訂的人改回 `subscribed`，除非使用者明確表示對方重新同意。
- 修改「排程中」的電子報會直接影響到時寄出的內容，動手前先告知使用者。
- 不編造成效數字；`stats` 沒有資料就照實說。
