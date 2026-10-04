// 由 HypeLink 主程式的產出檔，重新產生 hypelink-brand-site-design/references/ 的區塊與範本目錄。
// 區塊或範本有增減時跑一次（在 MainRepo 根目錄）：
//   node hypelink_claude_skill/tools/gen-site-reference.mjs
// 來源：
//   hypelink-backend-v3/src/brandSite/generated/block-catalog.json  （e2e/export-site-templates.mjs 產生）
//   hypelink-backend-v3/src/brandSite/generated/site-templates.json
//   hypelink/src/components/page-editor/PagePalette.tsx              （頁面編輯器的區塊分類，用來分組）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const GEN = path.join(ROOT, "hypelink-backend-v3/src/brandSite/generated");
const OUT = path.join(HERE, "../hypelink-brand-site-design/references");

const catalog = JSON.parse(fs.readFileSync(path.join(GEN, "block-catalog.json"), "utf8"));
const templates = JSON.parse(fs.readFileSync(path.join(GEN, "site-templates.json"), "utf8"));
const palette = fs.readFileSync(path.join(ROOT, "hypelink/src/components/page-editor/PagePalette.tsx"), "utf8");

const cell = (s) => String(s ?? "").replace(/\|/g, "／").replace(/\n/g, " ");
const today = new Date().toISOString().slice(0, 10);

/* ── 區塊 ── */
const groups = [];
for (const m of palette.matchAll(/\{ key: "([^"]+)", label: "([^"]+)", tab: "[^"]+"[^}]*?types: \[([^\]]*)\]/g)) {
  groups.push({ key: m[1], label: m[2].replace(/\s*✦\s*$/, ""), types: [...m[3].matchAll(/"([^"]+)"/g)].map((x) => x[1]) });
}
const byType = new Map(catalog.blocks.map((b) => [b.type, b]));
const seen = new Set();
let md = `# 官網區塊目錄（${catalog.blocks.length} 種）\n\n`;
md += `> 自動產生於 ${today}（\`tools/gen-site-reference.mjs\`），依頁面編輯器的分類分組。\n`;
md += `> 欄位與空白預設值以 \`site.blocks.catalog { q }\` 的 \`blank\` 為準；這裡只列「長什麼樣、放幾項」幫你選。\n`;
md += `> 建議項數＝版面好看的筆數；標籤字數＝項目標題建議上限（中日韓字算 1）。\n\n`;
for (const g of groups) {
  const rows = g.types.map((t) => byType.get(t)).filter(Boolean);
  if (!rows.length) continue;
  md += `## ${g.label}\n\n| type | 名稱 | 長什麼樣 | 建議項數 | 標籤字數 |\n|---|---|---|---|---|\n`;
  for (const b of rows) {
    seen.add(b.type);
    md += `| \`${b.type}\` | ${cell(b.label)} | ${cell(b.desc)} | ${b.items ? `${b.items.min}–${b.items.max}` : ""} | ${b.labelMax ?? ""} |\n`;
  }
  md += "\n";
}
const rest = catalog.blocks.filter((b) => !seen.has(b.type));
if (rest.length) {
  md += `## 其他\n\n| type | 名稱 | 長什麼樣 | 建議項數 | 標籤字數 |\n|---|---|---|---|---|\n`;
  for (const b of rest) md += `| \`${b.type}\` | ${cell(b.label)} | ${cell(b.desc)} | ${b.items ? `${b.items.min}–${b.items.max}` : ""} | ${b.labelMax ?? ""} |\n`;
  md += "\n";
}
if (catalog.footerLayouts?.length) {
  md += `## 頁尾版型（\`site.update { footer: { layout } }\`）\n\n| layout | 名稱 | 說明 |\n|---|---|---|\n`;
  for (const f of catalog.footerLayouts) md += `| \`${f.key}\` | ${cell(f.label)} | ${cell(f.hint)} |\n`;
  md += "\n";
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "blocks.md"), md);

/* ── 範本 ── */
const cats = new Map(templates.categories.map((c) => [c.key, c.label]));
let tm = `# 官網範本目錄（${templates.templates.length} 個）\n\n`;
tm += `> 自動產生於 ${today}。套用：\`site.apply_template { key, mode: "replace"|"append", applyTheme: true, dry_run: true }\`；只拿一頁：\`site.apply_page_template\`。\n\n`;
for (const [ck, cl] of cats) {
  if (ck === "all") continue;
  const list = templates.templates.filter((t) => t.category === ck);
  if (!list.length) continue;
  tm += `## ${cl}\n\n| key | 名稱 | 深淺 | 醒目色 | 頁數 | 特色與用途 |\n|---|---|---|---|---|---|\n`;
  for (const t of list) tm += `| \`${t.key}\` | ${cell(t.name)} | ${t.tone === "dark" ? "深" : "淺"} | \`${t.accent}\` | ${t.pageCount ?? ""} | ${cell(t.description)} |\n`;
  tm += "\n";
}
fs.writeFileSync(path.join(OUT, "templates.md"), tm);
console.log(`blocks: ${catalog.blocks.length} → references/blocks.md；templates: ${templates.templates.length} → references/templates.md`);
