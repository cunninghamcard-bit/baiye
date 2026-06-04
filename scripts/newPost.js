import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: bun run new:post "Post title"');
  process.exit(1);
}

// 保留任意语言文字与数字（含中文），只剔除文件系统非法字符；空格转连字符
const slug = title
  .toLowerCase()
  .normalize("NFKC")
  .replace(/[\\/:*?"<>|]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "");

if (!slug) {
  console.error("Could not generate a safe filename from the title.");
  process.exit(1);
}

const blogDir = path.join(process.cwd(), "src/content/blog");
const filePath = path.join(blogDir, `${slug}.md`);

if (existsSync(filePath)) {
  console.error(`Post already exists: ${path.relative(process.cwd(), filePath)}`);
  process.exit(1);
}

mkdirSync(blogDir, { recursive: true });

const date = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
const content = `---
title: "${title.replace(/"/g, '\\"')}"
description: ""
date: ${date}
image: ""
categories: ["技术"]
author: "Baiye"
tags: ["blog"]
draft: true
---

在这里写正文。

## 背景

## 正文

## 总结
`;

writeFileSync(filePath, content);
console.log(`Created ${path.relative(process.cwd(), filePath)}`);
