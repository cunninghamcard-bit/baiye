// 解析 Obsidian vault 里 _data/ 下的可编辑内容（随记 / 关于 / 站点信息）。
// 各页用 `?raw` 导入这些文件后调用下面的 parse 函数 —— 这样 dev 下改完即时热更新。
import matter from "gray-matter";

/* ---------- 图片 Images ---------- */
// _data/images/ 下的图片，构建时解析成可用 URL。用户把图丢进那个文件夹，按文件名引用即可。
const VAULT_IMAGES = import.meta.glob("/src/content/blog/_data/images/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

// name 可以是：_data/images/ 里的文件名、/xxx（public 路径）、http 外链，或空。
export function resolveImage(name?: string): string {
  if (!name) return "";
  if (name.startsWith("/") || name.startsWith("http")) return name;
  return VAULT_IMAGES[`/src/content/blog/_data/images/${name}`] ?? "";
}

export interface SiteImages {
  icon: string;
  home_hero: string;
  about_portrait: string;
}

export function parseImages(raw: string): SiteImages {
  const { data } = matter(raw);
  const d = data as Partial<SiteImages>;
  return {
    icon: d.icon ?? "",
    home_hero: d.home_hero ?? "",
    about_portrait: d.about_portrait ?? "",
  };
}

// 极小行内标记：先转义 HTML，再把 `代码` 和 *斜体* 转成标签。只支持这两种，别的当纯文字。
export function inline(s: string): string {
  const esc = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
}

/* ---------- 随记 Notes ---------- */
export interface Note {
  date: string; // YYYY-MM-DD
  body: string; // 已渲染好的行内 HTML
}

export function parseNotes(raw: string): Note[] {
  const notes: Note[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*-\s*(\d{4}-\d{2}-\d{2})\s+(.*\S)\s*$/);
    if (m) notes.push({ date: m[1], body: inline(m[2]) });
  }
  // 按日期倒序，新的在上 —— 不依赖文件里手写的顺序。
  return notes.sort((a, b) => (a.date < b.date ? 1 : -1));
}

const WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
export function fmtNoteDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${mm}.${dd} · ${WEEK[d.getUTCDay()]}`;
}

/* ---------- 关于 About ---------- */
export interface About {
  lead: string; // 第一段（斜体引导句）
  paragraphs: string[]; // 其余段落
}

export function parseAbout(raw: string): About {
  const { content } = matter(raw);
  const blocks = content
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.trim().replace(/\s+/g, " "))
    .filter(Boolean);
  const [lead, ...rest] = blocks;
  return { lead: inline(lead ?? ""), paragraphs: rest.map(inline) };
}

/* ---------- 站点信息 Site ---------- */
export interface NavItem { label: string; href: string }
export interface SocialItem { k: string; label: string; href: string }
export interface SiteData {
  brand: string;
  nav: NavItem[];
  social: SocialItem[];
  credit: string;
  creditUrl: string;
  heroKicker: string;
  heroTitle: string; // 已渲染（可含斜体）
  heroLede: string;
  heroImage: string;
}

export function parseSite(raw: string): SiteData {
  const { data } = matter(raw);
  const s = data as Partial<SiteData>;
  return {
    brand: s.brand ?? "天真 / Naive",
    nav: s.nav ?? [],
    social: s.social ?? [],
    credit: s.credit ?? "",
    creditUrl: s.creditUrl ?? "#",
    heroKicker: s.heroKicker ?? "",
    heroTitle: inline(s.heroTitle ?? ""),
    heroLede: s.heroLede ?? "",
    heroImage: s.heroImage ?? "",
  };
}
