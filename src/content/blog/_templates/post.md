<%*
const title = await tp.system.prompt("文章标题（也会作为文件名和网址）");
if (title) { await tp.file.rename(title); }
// 从 _data/images/ 里列出所有图片，让你选一张做封面（之后也能直接改 image: 字段）
const imgs = app.vault.getFiles()
  .filter(f => f.path.startsWith("_data/images/"))
  .map(f => f.name);
const cover = imgs.length
  ? (await tp.system.suggester(["（暂不配图）", ...imgs], ["", ...imgs], false, "选一张封面图")) || ""
  : "";
-%>
---
title: "<% title %>"
description: ""
date: "<% tp.date.now("YYYY-MM-DDTHH:mm:ss") %>Z"
image: "<% cover %>"
categories: ["技术"]
author: "Baiye"
tags: ["blog"]
draft: true
---

在这里写正文。
