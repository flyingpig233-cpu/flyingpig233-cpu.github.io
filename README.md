# 飞猪手记

FlyingPig 的个人博客，采用暖白、森林绿与赭红配色，包含文章阅读、分类、归档、搜索、深色模式和 RSS。纯静态页面，使用 GitHub Pages 根目录部署，无需安装依赖。

网站：https://flyingpig233-cpu.github.io/

## 本地预览

需要 Node.js 20 或以上版本：

```sh
npm run build
npm run check
npm start
```

浏览器打开 `http://127.0.0.1:4173/`。按 `/` 或 `Ctrl/Cmd + K` 搜索文章。

## 写文章

编辑 `content/posts.json`，按新到旧排序。每篇文章包含唯一 `slug`、标题、日期、分类、摘要、封面和 `body` 内容。当前三篇是开站手记及已有作品的介绍，可直接改写或替换。

正文支持以下内容块：

```json
[
  ["p", "正文段落"],
  ["h2", "二级标题"],
  ["quote", "引用或重点句"],
  ["list", ["第一项", "第二项"]],
  ["link", { "text": "打开作品", "href": "/course-assistant/" }]
]
```

封面放在 `assets/`，在文章的 `cover` 字段填写文件名。修改后运行 `npm run build`，它会生成首页、文章、归档、RSS、搜索索引与站点地图。不要直接修改生成的 HTML；公共布局和「关于」文案位于 `scripts/build.mjs`，样式位于 `styles.css`。

构建后将源文件与生成文件一起提交、推送到 `main`。沿用 GitHub Pages 的 **Deploy from a branch → main → /(root)** 设置，无需另建 Actions 工作流。

## 保留的作品

- `/spatial-geometry-classroom/`：立体几何互动课堂，原文件保留。
- `/course-assistant/`：HUST Course 网页助手，原文件保留。
- `/angle-explorer/`：改版前根首页「立体几何 · 角的探索」的完整副本。

保留 `.nojekyll`，确保 GitHub Pages 直接提供静态文件。

## 结构

- `content/posts.json`：文章内容和排序
- `scripts/build.mjs`：静态页面与订阅生成器
- `scripts/check.mjs`：页面、路径与内容一致性检查
- `scripts/serve.mjs`：本地预览服务
- `styles.css`、`app.js`：视觉与渐进增强交互
- `assets/`：原创 SVG 封面与图标

主题偏好只存储于当前浏览器，搜索在浏览器中读取静态索引执行。博客本身不使用第三方字体、分析脚本或第三方图片。
