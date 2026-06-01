# HypeLink Claude Skills

用聊天的方式，讓 **Claude** 幫你打理 HypeLink 品牌！🎉

把這裡的 skill 裝進你的 Claude（Claude Code / Claude Desktop 等），就能直接用一句話請 Claude 透過 **HypeLink MCP** 幫你編輯品牌頁、建立活動 —— 不必自己一頁一頁點。

> 📖 **完整設定教學請看官方文件**：<https://hypelink.app/docs/ai/mcp>

## 你可以請 Claude 做什麼

| Skill | 你可以這樣說 |
|---|---|
| **品牌頁**（`hypelink-brand-page-mcp/`） | 「把我的 IG 和官網加到品牌頁」「新增一個『關於我們』分頁，放一段公司簡介」「幫我把 bio 改得更專業」「把品牌頁換成深色主題」 |
| **活動**（`hypelink-event-mcp/`） | 「幫我建一場 6/20 的講座並開放報名」「加早鳥 / 一般兩種票」「報名表加一個公司名稱必填」「匯出報名名單、看報到統計」「對報名者寄一封提醒信」 |

## 開始使用（3 步）

1. **拿到你的 Token**
   到 HypeLink 後台 → `品牌設定 → API Tokens`，產生一組 Token（它只會綁定你這一個品牌）。
2. **連上 HypeLink MCP**
   依官方文件把 MCP 設定加進你的 Claude（會用到上一步的 Token）。
   👉 <https://hypelink.app/docs/ai/mcp>
3. **裝上這些 Skill**
   把 `hypelink-brand-page-mcp/` 與 `hypelink-event-mcp/` 兩個資料夾放到 Claude 會讀取 skill 的位置：
   - 個人全域：`~/.claude/skills/`
   - 或你專案的：`.claude/skills/`

   例如（在本資料夾內執行）：
   ```bash
   ln -s "$(pwd)/hypelink-brand-page-mcp" ~/.claude/skills/hypelink-brand-page-mcp
   ln -s "$(pwd)/hypelink-event-mcp"      ~/.claude/skills/hypelink-event-mcp
   ```
   （複製整個資料夾過去也可以。）

裝好後，直接跟 Claude 說你想做什麼就行了 ✨

## 小提醒

- Claude 在動手改之前，通常會先**預覽要做的變更**讓你確認，刪除類操作還會**再確認一次**才執行 —— 可以放心嘗試。
- 你透過 Claude 做的修改，和在後台手動修改是**同步的**，隨時可在後台看到結果。
- 一組 Token 對應一個品牌；想操作另一個品牌，換上該品牌的 Token 即可。

有任何設定問題，都可以參考官方文件：<https://hypelink.app/docs/ai/mcp> 🙌
