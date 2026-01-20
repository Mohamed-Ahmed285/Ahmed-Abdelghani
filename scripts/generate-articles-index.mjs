import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd());
const ARTICLES_DIR = path.join(REPO_ROOT, "content", "articles");
const INDEX_JSON_PATH = path.join(ARTICLES_DIR, "index.json");

function parseFrontmatter(md) {
  // Very small YAML frontmatter parser: expects YAML between first two --- lines.
  // Supports simple "key: value" pairs (strings).
  if (!md.startsWith("---")) return { attributes: {}, body: md };

  const end = md.indexOf("\n---", 3);
  if (end === -1) return { attributes: {}, body: md };

  const raw = md.slice(3, end).trim();
  const body = md.slice(end + "\n---".length).trimStart();

  const attributes = {};
  raw.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    if (key) attributes[key] = value;
  });

  return { attributes, body };
}

function stripMarkdown(s = "") {
  return String(s)
    .replace(/\r\n/g, "\n")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(body, maxLen = 140) {
  const text = stripMarkdown(body);
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1).trimEnd() + "…";
}

function normalizeImagePath(p) {
  if (!p) return "";
  if (/^https?:\/\//i.test(p) || p.startsWith("/")) return p;
  if (p.startsWith("./")) return p.slice(1);
  return `/${p}`;
}

async function main() {
  const entries = await fs.readdir(ARTICLES_DIR, { withFileTypes: true });
  const mdFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  const items = [];

  for (const fileName of mdFiles) {
    const slug = path.basename(fileName, path.extname(fileName));
    const fullPath = path.join(ARTICLES_DIR, fileName);
    const md = await fs.readFile(fullPath, "utf8");
    const { attributes, body } = parseFrontmatter(md);

    const title = attributes.title || slug;
    const date = attributes.date || "";
    const image = normalizeImagePath(attributes.image || "");
    const excerpt = attributes.excerpt || makeExcerpt(body);

    items.push({ slug, title, date, image, excerpt });
  }

  // Sort newest first (same behavior as the frontend)
  items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const json = JSON.stringify(items, null, 2) + "\n";
  await fs.writeFile(INDEX_JSON_PATH, json, "utf8");

  console.log(`Wrote ${items.length} items to ${path.relative(REPO_ROOT, INDEX_JSON_PATH)}`);
}

await main();

