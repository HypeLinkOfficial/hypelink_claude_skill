# hypelink_claude_skill

HypeLink 官方的 **Claude Agent Skills** 集合 —— 讓使用者用 Claude（Claude Code / Claude Desktop / 任何 MCP client）透過 **HypeLink MCP server**（`https://api.hypelink.app/mcp`）操作自己的品牌。

此資料夾是一個**獨立的 git repo**（remote：`HypeLinkOfficial/hypelink_claude_skill`），與主專案 `HypeLink_MainRepo` 分開維護，方便對外發佈／讓使用者安裝。

## 用途

收錄可載入的 skill，每支一個資料夾、內含一個 `SKILL.md`（帶 `name` / `description` frontmatter），符合 Claude Code Agent Skill 格式。

| Skill 資料夾 | 用途 |
|---|---|
| `hypelink-brand-page-mcp/` | 製作 / 編輯**品牌頁**（首頁資訊：profile、folders、links、page modules、socials，以及設計主題 design/theme） |
| `hypelink-event-mcp/` | 製作 / 經營**活動**（活動 CRUD、票種、報名表、通知、名單 / 報到 / 成效，及公告 / 投票 / Q&A / 問卷 / 審核 / EDM / 協作者 / 識別 / 配對 / 成果等子功能） |

## 安裝 / 載入方式

Claude Code 只會掃描 `.claude/skills/<name>/SKILL.md`（專案）與 `~/.claude/skills/<name>/SKILL.md`（個人）。要讓本 repo 的 skill「可載入、可 `/名稱` 觸發」，擇一：

- **個人全域**：clone 後把各 skill 資料夾 symlink 進 `~/.claude/skills/`，例如：
  ```bash
  ln -s "$(pwd)/hypelink-brand-page-mcp" ~/.claude/skills/hypelink-brand-page-mcp
  ln -s "$(pwd)/hypelink-event-mcp"      ~/.claude/skills/hypelink-event-mcp
  ```
- **專案層級**：在使用者自己的專案 `.claude/skills/` 下放同名資料夾（或 symlink）。
- 直接複製整個資料夾到上述位置亦可。

> 前提：使用者需先在 dashboard `/dashboard/brands/[hypeId]/settings/api-tokens` 產生 token 並設定好 `.mcp.json`（細節見各 `SKILL.md`）。一個 token 綁定一個品牌。

## 與主專案的關係

- 這些 skill 描述的「能力」來自 HypeLink 後端的 MCP server（`hypelink-backend-v3/src/mcp/`）。後端工具若新增 / 改名 / 改參數，**請同步更新對應 `SKILL.md`**。
- 主專案 `CLAUDE.md` 的 Development Skills 表已登記這兩支的路徑，供在主 repo 內開發時參照。
