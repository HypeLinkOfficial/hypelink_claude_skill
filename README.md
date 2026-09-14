# HypeLink Claude Skills

用聊天的方式，讓 **Claude** 幫你打理 HypeLink 品牌！🎉

把這裡的 skill 裝進你的 Claude（Claude Code / Claude Desktop 等），就能直接用一句話請 Claude 透過 **HypeLink MCP** 幫你編輯品牌頁、建立活動 —— 不必自己一頁一頁點。

> 📖 **完整設定教學請看官方文件**：<https://hypelink.app/docs/ai/mcp>

## 你可以請 Claude 做什麼

| Skill | 你可以這樣說 |
|---|---|
| **品牌頁**（`hypelink-brand-page-mcp/`） | 「把我的 IG 和官網加到品牌頁」「新增一個『關於我們』分頁，放一段公司簡介」「幫我把 bio 改得更專業」「把品牌頁換成深色主題」「設定一個訂單 Webhook」（Webhook 為 Max 方案） |
| **活動**（`hypelink-event-mcp/`） | 「幫我建一場 6/20 的講座並開放報名」「加早鳥 / 一般兩種票」「報名表加一個公司名稱必填」「匯出報名名單、看報到統計」「對報名者寄一封提醒信」「開一檔徵稿並批次匯入分組」 |
| **變現與成長**（`hypelink-commerce-mcp/`） | 「上架一個新商品 / 補庫存 / 把訂單標成已出貨並填單號」「幫我開一門課，加章節與單元」「看名單神器投廣頁的名單，把成交的標成 won」「新增一位聯盟 KOL 並寄邀請、給專屬折扣碼」「查這個月待出金的夥伴」 |
| **3D 空間**（`hypelink-space-mcp/`） | 「在展場中間放一張桌子和一台筆電」「把空間改成黃昏、下點雨」「開啟導覽手冊，第一站是入口看板」「用發光的紅色方塊做招牌」 |
| **內容豐富品牌頁**（`hypelink-rich-brand-page/`） | 「幫我把品牌頁做豐富一點、模組多加一點」「照偶像 / 餐飲 / 個人品牌的場景把整頁填好」「加幾個漸層 / 圖片背景的連結按鈕連到我的 Spotify / IG / 訂位」 |

> **變現與成長** skill 涵蓋名單神器（`leads`）、Mini 商城（`mall`）、Mini 課程（`courses`）、聯盟行銷（`affiliates`）與 PayConnect 唯讀查詢（`payconnect`：外部系統以 email 查會員資格 / 付款狀態），皆為付費方案功能；結帳 / 退款 / 出金等金錢操作僅開放於後台，MCP 不提供。
>
> **3D 空間** skill 只能佈置已存在的空間（擺放 / 移動 / 材質 / 導覽手冊）；建立空間、上傳自有模型、AI 管家仍在後台。

## 真實使用情境 💡

> 直接把下面的句子貼給 Claude，它會先讓你確認再動手。

**🚀 新品牌一鍵開張**
> 「我剛開了品牌頁還是空的，幫我建『關於我們 / 產品服務 / 聯絡我們』三個分頁，各放一段簡介和一個按鈕，再把我的 IG、官網加上去。」

**🎟️ 活動從零到上架**
> 「幫我建一場 7/5 下午的新品發表會，開放報名；加『早鳥 590（限量 50）』和『一般 790』兩種票；報名表加『公司 / 職稱』兩個必填欄位；都設定好就發布。」

**🎨 換季 / 節慶視覺（快速生圖或找圖）**
> 「幫我把活動封面換成聖誕風格。」→ 用會生圖的 AI 產一張、或上網搜尋圖庫找一張，拿到圖片網址後請 Claude 套上去（見下方「快速取得圖片」）。

**🧹 定期整理品牌頁**
> 「幫我檢查所有連結，把失效的列出來讓我確認後刪除，並把『最新消息』分頁移到第一個。」

**📊 活動結束後**
> 「幫我匯出這場活動的報名名單，看一下到場率和報名來源，然後對所有到場者寄一封感謝信。」

**📨 開跑前提醒**
> 「活動前三天，幫我對已報名的人寄一封提醒信，內容附上時間地點。」

## 🎨 快速取得圖片：用 AI 生圖或搜尋圖庫

不用自己開設計軟體！要頭像、封面、連結圖時，建議你用最快的方式拿到一張圖：

- 🤖 **用會生圖的 AI**：跟有生成圖片能力的 AI（例如能生圖的 Claude 或其他模型）描述你想要的風格，請它幫你生一張。
- 🔎 **上網搜尋圖庫**：到免費 / 付費圖庫（Unsplash、Pexels 等）搜尋合適的圖。

HypeLink 的 skill 可以**直接吃一張公開圖片網址**幫你換上去（系統會自動把圖下載、存到自己的空間，支援一般圖片格式、單張上限 10MB）。流程超簡單：

1. 用上面任一方式取得一張圖。
2. 拿到它的**公開圖片網址**（圖庫的圖片連結，或先把圖上傳到任一圖床 / 雲端取得連結）。
3. 把網址貼給 Claude，例如：
   > 「把這張當我的品牌頭像：<圖片網址>」
   > 「用這張當 7/5 活動的封面：<圖片網址>」
   > 「把『產品型錄』那張連結卡的封面換成：<圖片網址>」

Claude 就會幫你套上去（頭像、品牌 Logo、社群分享圖、活動封面、連結封面都支援），整個品牌頁很快就豐富起來 ✨

> 小撇步：活動封面建議用 **4:3、約 1200×900** 的圖，呈現最漂亮。

## 開始使用（3 步）

1. **拿到你的 Token**
   到 HypeLink 後台 → `品牌設定 → API Tokens`，產生一組 Token（它只會綁定你這一個品牌）。
2. **連上 HypeLink MCP**
   依官方文件把 MCP 設定加進你的 Claude（會用到上一步的 Token）。
   👉 <https://hypelink.app/docs/ai/mcp>
3. **裝上這些 Skill**
   把 `hypelink-brand-page-mcp/`、`hypelink-event-mcp/`、`hypelink-commerce-mcp/`、`hypelink-rich-brand-page/`、`hypelink-space-mcp/` 五個資料夾放到 Claude 會讀取 skill 的位置：
   - 個人全域：`~/.claude/skills/`
   - 或你專案的：`.claude/skills/`

   例如（在本資料夾內執行）：
   ```bash
   ln -s "$(pwd)/hypelink-brand-page-mcp"  ~/.claude/skills/hypelink-brand-page-mcp
   ln -s "$(pwd)/hypelink-event-mcp"       ~/.claude/skills/hypelink-event-mcp
   ln -s "$(pwd)/hypelink-commerce-mcp"    ~/.claude/skills/hypelink-commerce-mcp
   ln -s "$(pwd)/hypelink-rich-brand-page" ~/.claude/skills/hypelink-rich-brand-page
   ln -s "$(pwd)/hypelink-space-mcp"       ~/.claude/skills/hypelink-space-mcp
   ```
   （複製整個資料夾過去也可以；只需要用到的 skill 也可只裝其中一兩個。）

裝好後，直接跟 Claude 說你想做什麼就行了 ✨

## 小提醒

- Claude 在動手改之前，通常會先**預覽要做的變更**讓你確認，刪除類操作還會**再確認一次**才執行 —— 可以放心嘗試。
- 你透過 Claude 做的修改，和在後台手動修改是**同步的**，隨時可在後台看到結果。
- 一組 Token 對應一個品牌；想操作另一個品牌，換上該品牌的 Token 即可。

有任何設定問題，都可以參考官方文件：<https://hypelink.app/docs/ai/mcp> 🙌

## 品牌自訂網域（網域綁定）流程速查

MCP 目前未暴露網域綁定工具，請引導使用者到 dashboard：品牌設定 → 網域（`/dashboard/brands/@id/settings/domain`；側欄「網域綁定」會轉到同一頁）。

1. 需 **Pro 以上**；網域數預設 0，按「增加網域數」以 **1000 SP／個** 加購（每品牌上限 10 個）。輸入網域本身（不含 https:// 與路徑，不可為 hypelink.app 子網域）。
2. 到 DNS 服務商加兩筆：`TXT _hypelink.<網域>` = `hl-verify=<token>`；`CNAME <網域>` → `pages.hypelink.app`（Cloudflare 託管請用灰雲 DNS only）。根網域不能設 CNAME 時改綁 www。
3. 按「重新驗證」→ 通過後平台自動向 Cloudflare 簽發憑證（幾分鐘）→ 狀態「已開通」。
4. 可選：「以品牌官網作為此網域首頁」開關（需官網已開放）：`/` 變官網、`/link` 為公開頁；關閉時 `/` 為公開頁、`/site` 為官網。
5. SEO：canonical／og:url／sitemap 自動改指主網域；提醒使用者到 Google Search Console 驗證該網域並提交 `https://<網域>/sitemap.xml`。
6. 訪客在自訂網域登入：Email 原地登入；Google 會先到 hypelink.app 登入再自動帶回。
7. 方案降到 Pro 以下 → 網域暫停（訪客看到說明頁），升級後自動恢復。

詳細規劃與故障排除：`document/HL-26-custom-domain-plan.md`、`infra/cloudflare/README.md`。

