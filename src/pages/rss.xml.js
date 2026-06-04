import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import config from "@/config/config.json";

// /rss.xml —— 读者用阅读器订阅这个地址。文章列表跟首页同一套规则：
// 滤掉草稿（draft）和以 - 开头的隐藏文件，按日期倒序。
export async function GET(context) {
  const posts = (await getCollection("blog"))
    .filter((p) => !p.data.draft && !p.id.startsWith("-"))
    .sort((a, b) => +new Date(b.data.date) - +new Date(a.data.date));

  return rss({
    title: config.site.title,
    description: config.metadata.meta_description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      pubDate: post.data.date ? new Date(post.data.date) : undefined,
      categories: post.data.categories,
      link: `/blog/${post.id}`,
    })),
  });
}
