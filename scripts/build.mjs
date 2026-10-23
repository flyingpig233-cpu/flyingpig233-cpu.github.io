import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const site = 'https://flyingpig233-cpu.github.io';
const posts = JSON.parse(await readFile(resolve(root, 'content/posts.json'), 'utf8'));
const projects = JSON.parse(await readFile(resolve(root, 'content/projects.json'), 'utf8'));
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const version = async path => createHash('sha256').update(await readFile(resolve(root, path))).digest('hex').slice(0, 12);
const versions = { style: await version('styles.css'), script: await version('app.js'), icon: await version('assets/favicon.svg'), avatar: await version('assets/avatar.jpg') };
const svg = (paths, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${paths}</svg>`;
const icons = {
  arrow: svg('<path d="M7 17 17 7M7 7h10v10"/>'),
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.83a9.6 9.6 0 0 1 2.5.34c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
  rss: svg('<circle cx="5" cy="19" r="1" fill="currentColor"/><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/>'),
  moon: svg('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>','class="moon-icon"'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>','class="sun-icon"'),
  search: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>'),
  code: svg('<path d="m8 6-5 6 5 6m8-12 5 6-5 6m-3-14-2 16"/>'),
  book: svg('<path d="M5 3h11a3 3 0 0 1 3 3v15H7a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1Zm-1 14h15M8 7h7m-7 4h5"/>'),
  angle: svg('<path d="M4 4v16h16M4 20 19 5M4 13a7 7 0 0 1 5 2"/>')
};
const postURL = p => `/posts/${p.slug}/`;
const themeInit = `try{const t=localStorage.getItem('xuchengmin-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch{}`;
const dialog = `<dialog id="search-dialog" aria-labelledby="search-title"><div class="search-header"><h2 id="search-title">搜索随笔</h2><button class="icon-button" type="button" data-search-close aria-label="关闭搜索">×</button></div><label class="sr-only" for="search-input">搜索标题、分类或内容</label><input id="search-input" type="search" placeholder="关键词" autocomplete="off"><div id="search-results" aria-live="polite"></div></dialog>`;

function layout({ title, path = '/', active = 'home', body, home = false, description = '徐承敏 · Developer · Student' }) {
  const nav = [['home', '/', '我'], ['archive', '/archive/', '随笔'], ['projects', '/projects/', '项目']];
  return `<!doctype html>
<html lang="zh-CN" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f6f8fb"><title>${esc(title === '徐承敏' ? title : title + ' · 徐承敏')}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${site}${path}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:site_name" content="徐承敏"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${site}${path}"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg?v=${versions.icon}"><link rel="alternate" type="application/rss+xml" title="徐承敏的随笔" href="/feed.xml"><script>${themeInit}</script><link rel="stylesheet" href="/styles.css?v=${versions.style}"><script src="/app.js?v=${versions.script}" defer></script></head>
<body class="${home ? 'is-home' : ''}"><a class="skip-link" href="#main">跳到正文</a><header class="topbar"><nav aria-label="主导航">${nav.map(([key,href,label])=>`<a href="${href}"${key===active?' aria-current="page"':''}>${label}</a>`).join('')}</nav><button class="icon-button theme-button" type="button" data-theme-toggle aria-label="切换深色模式" aria-pressed="false">${icons.moon}${icons.sun}</button></header>
<main id="main" class="${home ? 'home-main' : 'page-main'}">${body}</main><footer class="site-footer">© 2026 徐承敏<span id="busuanzi_container_page_pv" class="page-views" style="display:none" title="本页浏览次数，由不蒜子统计"><span aria-hidden="true"> · </span>浏览 <span id="busuanzi_value_page_pv"></span> 次</span></footer>${dialog}<script async src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script></body></html>`;
}

const home = `<section class="profile" aria-label="个人介绍"><img class="avatar" src="/assets/avatar.jpg?v=${versions.avatar}" width="112" height="112" alt="徐承敏的头像"><h1>徐承敏</h1><p>Developer · Student</p><div class="profile-links"><a href="https://github.com/flyingpig233-cpu" aria-label="GitHub" title="GitHub">${icons.github}</a><a href="/feed.xml" aria-label="RSS 订阅" title="RSS 订阅">${icons.rss}</a></div></section>`;
const postRow = p => `<article class="note-row" data-post data-category="${esc(p.category)}"><a href="${postURL(p)}"><h2>${esc(p.title)}</h2></a><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time></article>`;
const archive = `<div class="page-title"><h1>随笔</h1>${posts.length?`<button class="icon-button" data-search-open aria-label="搜索文章">${icons.search}</button>`:''}</div>${posts.length ? `<div class="notes-list">${posts.map(postRow).join('')}</div>` : '<p class="empty-state">还没有公开的文字。</p>'}`;
function projectCard(p) {
  return `<article class="project-card"><div class="project-card-top"><span class="project-icon">${icons.code}</span><div><h2><a href="${esc(p.href)}">${esc(p.title)}</a></h2><span class="project-category">${esc(p.category)}</span></div></div><p>${esc(p.summary)}</p><div class="project-card-links"><a href="${esc(p.href)}">GitHub ${icons.arrow}</a></div></article>`;
}
const projectsPage = `<div class="page-title"><h1>项目</h1><span class="count">${projects.length}</span></div><div class="project-grid">${projects.map(projectCard).join('')}</div>`;

function bodyHtml(p) {
  let heading = 0;
  return p.body.map(([type,value])=>{
    if(type==='p') return `<p>${esc(value)}</p>`;
    if(type==='h2') return `<h2 id="section-${++heading}">${esc(value)}</h2>`;
    if(type==='quote') return `<blockquote>${esc(value)}</blockquote>`;
    if(type==='list') return `<ul>${value.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
    if(type==='link') return `<p><a href="${esc(value.href)}">${esc(value.text)} ${icons.arrow}</a></p>`;
    throw new Error(`Unknown block: ${type}`);
  }).join('');
}
const article = p => `<a class="back-link" href="/archive/">← 随笔</a><article class="prose"><header><h1>${esc(p.title)}</h1><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time></header><div data-article-content>${bodyHtml(p)}</div></article>`;
async function save(path, content) { const target=resolve(root,path); await mkdir(dirname(target),{recursive:true}); await writeFile(target,content+'\n','utf8'); }
await save('index.html',layout({title:'徐承敏',home:true,body:home}));
await save('archive/index.html',layout({title:'随笔',path:'/archive/',active:'archive',body:archive}));
await save('projects/index.html',layout({title:'项目',path:'/projects/',active:'projects',body:projectsPage}));
await save('about/index.html',layout({title:'关于',path:'/about/',body:'<section class="about"><h1>徐承敏</h1><p>Developer · Student</p></section>'}));
for(const p of posts) await save(`posts/${p.slug}/index.html`,layout({title:p.title,path:postURL(p),active:'archive',description:p.excerpt,body:article(p)}));
await save('404.html',layout({title:'404',path:'/404.html',active:'',body:'<section class="not-found"><h1>404</h1><a href="/">回到首页</a></section>'}));
await save('search-index.json',JSON.stringify(posts.map(p=>({title:p.title,slug:p.slug,url:postURL(p),excerpt:p.excerpt,category:p.category,date:p.date,searchText:p.body.map(([,v])=>typeof v==='string'?v:Array.isArray(v)?v.join(' '):v.text).join(' ')}))));
const paths=['/','/archive/','/projects/','/about/',...posts.map(postURL)];
await save('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${site}${path}</loc></url>`).join('')}</urlset>`);
await save('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml`);
await save('feed.xml',`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>徐承敏的随笔</title><link>${site}/</link><description>Developer · Student</description><language>zh-CN</language><atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>${posts.map(p=>`<item><title>${esc(p.title)}</title><link>${site}${postURL(p)}</link><guid>${site}${postURL(p)}</guid><pubDate>${new Date(p.date+'T12:00:00+08:00').toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`).join('')}</channel></rss>`);
console.log(`Built ${posts.length} essays and ${projects.length} projects.`);
