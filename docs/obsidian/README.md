# Obsidian writing workflow

Open this folder as an Obsidian vault:

```text
/home/cunningham/baiye
```

Install and enable these community plugins:

- Templater
- QuickAdd
- Obsidian Git

Write blog posts in:

```text
src/content/blog/
```

Put images in:

```text
public/images/
```

Use this frontmatter shape:

```md
---
title: "Post title"
description: "Short summary"
date: 2026-05-09T00:00:00Z
image: ""
categories: ["技术"]
author: "Baiye"
tags: ["blog"]
draft: true
---
```

Set `draft: false` before publishing.

Deploy:

```bash
bun run deploy:cf-pages
```
