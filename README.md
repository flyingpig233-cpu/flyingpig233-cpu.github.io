# 徐承敏

Developer · Student。个人网站，GitHub Pages 部署。

网站：https://flyingpig233-cpu.github.io/

## 本地预览

需要 Node.js 20+，无需安装依赖。

```sh
npm run build
npm run check
npm start
```

预览：http://127.0.0.1:4173/

## 更新内容

- `content/posts.json`：随笔，当前为空。每篇包含 `slug`、`title`、`date`、`category`、`label`、`excerpt`、`cover`、`coverAlt` 与 `body`。
- `content/projects.json`：GitHub 主页置顶项目，按主页顺序记录标题、语言、简短描述和仓库链接。
- `body` 支持 `["p","段落"]`、`["h2","标题"]`、`["quote","引用"]`、`["list",["条目"]]`、`["link",{"text":"链接","href":"/"}]`。

修改后运行 `npm run build` 和 `npm run check`，将源文件及生成文件一起推送到 `main`。删文章或项目时，同步删除对应生成页面。

## 结构

- `scripts/build.mjs`：页面、RSS、搜索索引与站点地图生成器。
- `styles.css`：简洁布局及手机适配。
- `app.js`：主题与随笔搜索。支持 `/` 和 `Ctrl/Cmd + K`。
- `/projects/`：置顶项目及简短介绍。

原有作品的 `/course-assistant/`、`/spatial-geometry-classroom/`、`/angle-explorer/` 保留原地址。

GitHub Pages 继续使用 `main` 分支根目录，保留 `.nojekyll`。CSS、脚本和图标使用内容哈希处理更新缓存。
