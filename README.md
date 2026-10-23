# 徐承敏的随笔

徐承敏（iamputin）的个人博客，用来记录所看所想与个人随笔。暖白底色、深绿文字、克制的赭红点缀，保留大留白和阅读空间。

网站：https://flyingpig233-cpu.github.io/

## 本地使用

需要 Node.js 20 或以上，无需安装依赖。

```sh
npm run build
npm run check
npm start
```

预览地址为 `http://127.0.0.1:4173/`。按 `/` 或 `Ctrl/Cmd + K` 搜索随笔。

## 添加自己的文字

`content/posts.json` 当前为空。首页和归档显示留白状态。添加一篇文章时，在数组中写入：

```json
{
  "slug": "my-first-note",
  "title": "一篇随笔的标题",
  "date": "2026-10-23",
  "category": "随笔",
  "label": "随笔",
  "excerpt": "这篇文字的简短介绍。",
  "cover": "cover-notes.svg",
  "coverAlt": "笔记本与纸张的插画",
  "body": [
    ["p", "在这里写自己的正文。"],
    ["h2", "一个小标题"],
    ["p", "继续写下想法。"]
  ]
}
```

文章按新到旧排列。正文支持 `p` 段落、`h2` 标题、`quote` 引用、`list` 列表和 `link` 链接。封面放在 `assets/`，`cover` 填写文件名。

修改后运行 `npm run build` 与 `npm run check`，把源文件和生成文件一起提交到 `main`，GitHub Pages 会自动发布。删除文章时，同步删除对应的 `posts/<slug>/index.html`。

## 页面与样式

- `scripts/build.mjs`：首页、关于、归档、文章、RSS、搜索索引与站点地图生成器。
- `content/posts.json`：自己的文章。
- `styles.css`：配色、字体、排版和手机适配。
- `app.js`：搜索、分类、主题与阅读交互。

GitHub Pages 沿用 `main` 分支根目录部署，保留 `.nojekyll`。主题偏好存于当前浏览器，搜索在浏览器读取静态索引后进行。

## 原有页面

仓库原有的 `/course-assistant/`、`/spatial-geometry-classroom/` 与 `/angle-explorer/` 继续保留独立访问地址。
