<%*
const title = await tp.system.prompt("文章标题（也会作为文件名和网址）");
if (title) { await tp.file.rename(title); }
-%>
---
title: "<% title %>"
description: ""
date: "<% tp.date.now("YYYY-MM-DDTHH:mm:ss") %>Z"
image: ""
categories: ["技术"]
author: "Baiye"
tags: ["blog"]
draft: true
---

在这里写正文。
