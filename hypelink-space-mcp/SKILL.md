---
name: hypelink-space-mcp
description: 透過 HypeLink MCP server 佈置品牌的 3D 空間（space:*）— 列出／設定空間（天空、天氣、導覽手冊開關）、搜尋物件範本目錄、擺放／移動／縮放／刪除物件、設定材質與導覽手冊條目、重排導覽順序。當使用者要用 Claude 經 /mcp 搭建或調整某個既有品牌的 3D 空間時使用。
---

# Skill：HypeLink 3D 空間 MCP 操作

透過 **HypeLink MCP server** 用對話搭建品牌的 **3D 空間**：空間環境設定、從範本目錄擺放物件、調整位置／旋轉／縮放／材質，以及維護「導覽手冊」（訪客進場的逐點導覽）。

## 何時使用

- 「在我的展場中間放一張桌子，上面放一台筆電」
- 「把空間改成黃昏、下點小雨」
- 「幫我把所有物件排成一列，間距 2 公尺」
- 「開啟導覽手冊，第一站是入口的看板，第二站是產品桌」
- 「用基礎幾何拼一個紅色的立方體招牌，會發光」

## 重要前提與邊界

- **操作對象是「已存在的空間」**：建立空間本身、上傳自有 3D 模型（.glb／.fbx）、AI 管家搭建走 dashboard，**MCP 沒有 `space.create` 或上傳工具**。先 `space.list` 確認有空間。
- **一個 token 綁定一個 brand**；呼叫工具時**不需**自帶 hypeId，但每支工具都要帶 `spaceUuid`。
- Server：`POST https://api.hypelink.app/mcp`，`Authorization: Bearer hl_pat_<token>`（HTTP transport）。
- 部分範本有方案門檻（`space.templates.list` 回傳 `tierRequired`：free／creator／pro／max／enterprise）；擺放超出方案的範本會被擋，請引導升級或改用同類 free 範本。
- 座標會 **snap 到 0.5 網格**；旋轉單位是**弧度**（90° = 1.5708）；`scale` 下限 0.1、無上限。

## Scope

| Scope | 範圍 |
|---|---|
| `space:read` | `space.list / get / templates.list / objects.list` |
| `space:write` | `space.update / objects.create / objects.update / objects.delete / guidebook.reorder` |

寫入類工具支援 `dry_run: true`（回傳 `changes` 不執行）；`space.objects.delete` 走兩階段 `confirmToken`。

## 可用工具

### 空間（先讀）
| Tool | Scope | 說明 |
|---|---|---|
| `space.list` | read | **開場第一支**：列出品牌所有 3D 空間（uuid／名稱／狀態／導覽手冊開關） |
| `space.get` | read | `{ spaceUuid }`：單一空間設定（含環境、導覽手冊開關；**不含**物件列表） |
| `space.update` | write | `{ spaceUuid, name?, description?, skyPreset?, weatherPreset?, guidebookEnabled? }`；`skyPreset`＝`day / morning / sunset / night / overcast`、`weatherPreset`＝`clear / fog / rain / snow / cloudy` |

### 範本目錄
| Tool | Scope | 說明 |
|---|---|---|
| `space.templates.list` | read | `{ q?, category?, limit? }`（limit 1–200）：可擺放的物件範本（`templateKey`／名稱／分類／描述／`tierRequired`）。含基礎幾何 `primitive_*`（cube／sphere／cylinder／cone／plane／torus）與燈光 `light_*`。用 `q` 關鍵字搜尋（「桌」「椅」「黑板」） |

### 物件
| Tool | Scope | 說明 |
|---|---|---|
| `space.objects.list` | read | `{ spaceUuid }`：空間內所有已擺放物件（`instanceUuid`、位置／旋轉／縮放／顯示／碰撞／導覽設定） |
| `space.objects.create` | write | `{ spaceUuid, templateKey, positionX/Y/Z?, rotationX/Y/Z?, scale?, displayName?, material?, guide? }`；`material` **僅 `primitive_*` 有效**：`{ color, roughness, metalness, emissive, emissiveIntensity, opacity }` |
| `space.objects.update` | write | `{ spaceUuid, instanceUuid, …transform, scaleX/Y/Z?（非等比，可為 null 還原）, displayName?, visible?, collide?, physicsEnabled?, material?, guide? }` |
| `space.objects.delete` | write | `{ spaceUuid, instanceUuid, confirmToken? }`：兩階段確認 |

### 導覽手冊（Guidebook）
每個物件可帶一筆 `guide`：`{ enabled, title(≤120), body(≤2000), mediaUrl, mediaType: image/video/youtube, order }`。訪客在公開頁會依 `order` 逐站導覽。

| Tool | Scope | 說明 |
|---|---|---|
| `space.guidebook.reorder` | write | `{ spaceUuid, instanceUuids[] }`：依陣列順序寫回各物件 `guide.order` |

> 導覽手冊要對訪客生效，需 `space.update` 把 `guidebookEnabled` 設為 `true`。

## 推薦工作流程

1. `space.list` → 挑出目標空間 → `space.get` + `space.objects.list` 看現況（避免重疊擺放）。
2. 要放東西先 `space.templates.list` 用關鍵字找 `templateKey`，確認 `tierRequired` 符合方案。
3. 以 `dry_run: true` 預覽 `space.objects.create / update`，向使用者描述「放在哪、朝向、大小」再執行。
4. 批次佈置時**逐件下指令**（一件一個工具呼叫），並用 `space.objects.list` 回讀座標檢查。
5. 導覽手冊：先在各物件的 `guide` 填內容，最後 `space.guidebook.reorder` 排序、`space.update` 開啟。

### 範例：把空展場排成一條產品走廊
```
space.templates.list { q: "桌" }                      → 取 templateKey
space.objects.create { spaceUuid, templateKey, positionX: -4, positionZ: 0, guide: { enabled: true, title: "第一站", body: "…", order: 0 } }
space.objects.create { …, positionX: 0 }             → 每件間隔 4
space.objects.create { …, positionX: 4 }
space.objects.create { spaceUuid, templateKey: "primitive_cube", positionY: 2.5, scale: 1.5, material: { color: "#ff3b30", emissive: "#ff3b30", emissiveIntensity: 1.2 }, displayName: "招牌" }
space.guidebook.reorder { spaceUuid, instanceUuids: [第一站, 第二站, 第三站] }
space.update { spaceUuid, guidebookEnabled: true, skyPreset: "sunset" }
```

## 安全規則（務必遵守）

1. **永遠 dry-run 後才寫**（除非使用者明確說直接執行）。
2. **不要「清空重排」**：刪除是兩階段確認且不可復原；要重排請 `update` 既有物件的座標，而不是刪掉重建。
3. 物件數量多時避免一次大量 `create`（範本載入與空間效能會受影響）；先問使用者要幾件。
4. **不存 token**：只走 MCP transport；不要印到 chat／寫檔／進 git。
5. **schema 不確定** → `tools/list` 拉最新，不要猜。

## 常見錯誤碼

| Code | 處理 |
|---|---|
| `SCOPE_DENIED` | token 缺 `space:read/write`；請使用者重新產生 |
| `RATE_LIMIT` | 約 60 req/min；等 30 秒重試 |
| `VALIDATION_FAILED` | 欄位格式錯（enum／scale < 0.1／guide 長度）；`material` 用在非 `primitive_*` 會被忽略 |
| `NOT_FOUND` | `spaceUuid`／`instanceUuid`／`templateKey` 不存在；先對應 `list` 確認 |
| `CONFIRM_REQUIRED` / `CONFIRM_INVALID` | delete 未帶或帶了過期的 `confirmToken`；重新呼叫取得 |

## 與 dashboard 的關係

MCP 的空間寫入與 dashboard「3D 空間」編輯器共用同一套 entities 與快取失效 pipeline，並寫 `mcp_audit_log`；AI 與後台的修改**立即互相反映**。建立空間、上傳自有模型、AI 管家（扣 SP）、發布／下架仍請走 dashboard。

> 品牌頁、活動、變現工具見其他 skill：`hypelink-brand-page-mcp`、`hypelink-event-mcp`、`hypelink-commerce-mcp`。
