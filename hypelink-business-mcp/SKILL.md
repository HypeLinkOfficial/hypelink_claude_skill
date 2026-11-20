---
name: hypelink-business-mcp
description: 透過 HypeLink MCP server 檢視與調整品牌的事業模式（business）——讀取事業地圖（一句話描述、商業模式、受眾、通路、九宮格、品牌識別、模組清單）、各模組完成度與下一步、自動設定計畫與狀態、每週回顧；修改事業地圖、增減模組、以免費範本執行自動設定。當使用者要用 Claude 經 /mcp 了解「我的事業現在進行到哪、下一步做什麼」，或調整事業地圖時使用。AI 規劃與 AI 設定（扣星砂）只在後台。
---

# Skill：HypeLink 事業模式 MCP 操作

透過 **HypeLink MCP server** 檢視與調整一個品牌的**事業地圖**（`business:*`），並搭配其他 skill 把各模組的內容補齊。

## 何時使用

- 「我的事業現在進行到哪？下一步該做什麼？」
- 「幫我把事業地圖加上活動和電子報，拿掉線上課程」
- 「把一句話描述和目標客群改一下」
- 「用範本先幫我把品牌頁和商店的內容準備好」
- 「上週的經營回顧說了什麼？」

## 重要前提與邊界

- 品牌需已是**事業模式**（後台「建立品牌事業」建立，或設定中「轉換成事業模式」）。`business.map.get` 回 `blueprint: null` 表示還不是，請使用者先到後台建立；MCP 不能從無到有建立事業地圖。
- Token 需含 **`business:read` / `business:write`**；修改與執行需為品牌擁有者或管理員。
- **會扣星砂（SP）的都只在後台**：AI 規劃與調整、AI 產生大頭照與封面、以 AI 執行自動設定、產生每週 AI 回顧。MCP 這邊的操作都不呼叫 AI、不扣點數。
- 「測試」分類的模組只有內部帳號能加入事業地圖。

## Tools

| Tool | Scope | 說明 |
|---|---|---|
| `business.map.get` | read | 事業地圖全貌與 `canEdit` |
| `business.map.update` | write | 只帶要改的欄位；模組用 `addModules`／`removeModules` 增減，或 `modules` 整組取代 |
| `business.progress` | read | 各模組完成度與待辦（含要對外申請的項目） |
| `business.setup.plan` | read | 哪些模組可自動準備內容、用 AI 要多少星砂、哪些要手動 |
| `business.setup.status` | read | 最近一次自動設定的狀態與各步驟結果 |
| `business.setup.run_template` | write | 用免費範本執行自動設定（背景執行，內容存成草稿）；`only` 指定模組 |
| `business.review.get` | read | 最近一次每週 AI 經營回顧（沒有產生過則為 null） |

## 事業地圖欄位

`idea`（一句話描述）、`brandName`、`colors`、`businessModels`、`audiences`、`audienceNote`、`market`、`channels`、`marketingGoals`、`aiSummary`、`firstSteps`、`marketingPlan`、`canvas`（商業模式九宮格）、`cis`（品牌識別）、`dashboardStyle`（後台風格）、`modules`。

模組：`{ id, reason, stage, core }`。`id` 是後台側欄的功能 id（例如 `links` 品牌頁、`brand-site` 官網、`mall` 商店、`online-courses` 課程、`events` 活動、`crm`、`newsletter`）；`stage` 為 `brand`／`offer`／`marketing`／`customer`／`ops`／`insight`；`core: true` 表示屬於這門事業的最小組合。

- 模組清單決定後台顯示哪些功能。移除模組**不會刪掉**該功能已建立的內容，只是從後台收起來。
- 至少要保留一個模組。
- `canvas`、`cis` 是整個物件，要改請先 `get` 取回、改完整組回寫。

## 推薦工作流程

**盤點下一步**
1. `business.map.get` 了解這門事業在做什麼
2. `business.progress` 找出還沒完成的模組與要對外申請的項目
3. 依重要性列 3 個下一步；能用 MCP 完成的（品牌頁、商品、活動、文章…）用對應的 skill 幫忙做，不能的（申請金流、綁網域）說明在後台哪裡操作

**調整事業地圖**
1. 先說明要加減哪些模組與理由，使用者確認後 `business.map.update`
2. 新加入的模組若可自動準備內容，問使用者要不要用 `business.setup.run_template`

**用範本準備內容**
1. `business.setup.plan` 確認哪些模組會被設定
2. 向使用者確認後 `business.setup.run_template`（可帶 `only`）
3. 用 `business.setup.status` 等到不是 `running`，回報建立了什麼
4. 若使用者想要 AI 依事業內容撰寫（含品牌大頭照、商品示範圖、官網文案），請他到後台事業地圖執行「AI 設定」

## 安全規則

- `business.setup.run_template` 會在品牌下新增示範內容，執行前一定先取得使用者同意。
- 不要為了「看起來完整」而加入使用者用不到的模組。
- 回顧與完成度沒有資料時照實說，不要自行推測營運數字。
