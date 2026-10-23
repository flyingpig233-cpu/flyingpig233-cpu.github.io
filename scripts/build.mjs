import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const site = 'https://flyingpig233-cpu.github.io';
const posts = JSON.parse(await readFile(resolve(root, 'content/posts.json'), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const external = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const date = d => d.replaceAll('-', '.');
const url = p => `/posts/${p.slug}/`;
const minutes = p => Math.max(1, Math.ceil(JSON.stringify(p.body).length / 450));
const meta = p => `<div class="post-meta"><span>${esc(p.label)}</span><i aria-hidden="true">·</i><time datetime="${p.date}">${date(p.date)}</time></div>`;
const themeInit = `try{const t=localStorage.getItem('iamputin-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;else if(matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.dataset.theme='dark'}catch{}`;

function header(active) {
  const nav = [['home', '/', '随笔'], ['archive', '/archive/', '归档'], ['about', '/about/', '关于']];
  return `<a class="skip-link" href="#main">跳到正文</a><header class="site-header" id="header"><div class="container header-inner"><a class="brand" href="/" aria-label="徐承敏的随笔 首页"><img src="/assets/favicon.svg" width="34" height="34" alt=""><span>徐承敏<span class="brand-en">IAMPUTIN</span></span></a><nav id="main-nav" aria-label="主导航">${nav.map(([key, href, title]) => `<a href="${href}" ${active === key ? 'aria-current="page"' : ''}>${title}</a>`).join('')}</nav><div class="header-actions"><button class="icon-button search-button" type="button" data-search-open aria-label="搜索文章"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><span class="key-hint">/</span></button><span class="action-divider"></span><button class="icon-button theme-button" type="button" data-theme-toggle aria-label="切换深色模式" aria-pressed="false"><svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg><svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/></svg></button><button class="icon-button menu-button" data-menu-toggle aria-controls="main-nav" aria-expanded="false" aria-label="展开导航"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg></button></div></div></header>`;
}
const footer = `<footer class="site-footer container"><div><a class="footer-brand" href="/">徐承敏<span>所看所想，随笔记下。</span></a><p>© 2026 徐承敏 / iamputin</p></div><div class="footer-links"><a href="/archive/">随笔归档 ${arrow}</a><a href="/feed.xml">RSS ${external}</a><a href="/about/">关于我 ${arrow}</a></div></footer>`;
const search = `<dialog id="search-dialog" aria-labelledby="search-title"><div class="search-header"><h2 id="search-title">找一篇随笔</h2><button type="button" class="icon-button" data-search-close aria-label="关闭搜索">×</button></div><label class="sr-only" for="search-input">搜索标题、分类或内容</label><input id="search-input" type="search" placeholder="输入关键词，开始探索…" autocomplete="off"><div id="search-results" aria-live="polite"></div><div class="search-footer"><span>搜索全部文章</span><span><kbd>ESC</kbd> 关闭</span></div></dialog>`;
function layout({title, description, path = '/', active = 'home', body, article = false, image = 'cover-notes.svg'}) {
  return `<!doctype html><html lang="zh-CN" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f8f7f3"><title>${esc(title)} · 徐承敏的随笔</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${site}${path}"><meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:locale" content="zh_CN"><meta property="og:site_name" content="徐承敏的随笔"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${site}${path}"><meta property="og:image" content="${site}/assets/${image}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="alternate" type="application/rss+xml" title="徐承敏的随笔 RSS" href="/feed.xml"><script>${themeInit}</script><link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script></head><body>${article ? '<div id="reading-progress" aria-hidden="true"></div>' : ''}${header(active)}<main id="main">${body}</main>${footer}${search}<button class="back-top icon-button" data-back-top type="button" aria-label="回到顶部" hidden>↑</button></body></html>`;
}
function filters() {
  return `<div class="filters" role="group" aria-label="按分类浏览">${['全部', ...new Set(posts.map(p => p.category))].map((c, i) => `<button type="button" data-filter="${c}" aria-pressed="${i === 0}">${c}<span>${i === 0 ? String(posts.length).padStart(2, '0') : posts.filter(p => p.category === c).length}</span></button>`).join('')}</div><p class="filter-status sr-only" id="filter-status" role="status"></p>`;
}
function card(p, i) {
  return `<article class="post-card ${i === 0 ? 'featured' : 'compact'}" data-post data-category="${p.category}"><a class="cover-link" href="${url(p)}" tabindex="-1" aria-hidden="true"><img src="/assets/${p.cover}" alt="" width="1100" height="740" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></a><div class="post-card-content">${meta(p)}<h3><a href="${url(p)}">${esc(p.title)}</a></h3><p>${esc(p.excerpt)}</p><a class="read-link" href="${url(p)}" aria-label="阅读：${esc(p.title)}"><span>阅读全文<span class="read-time">${minutes(p)} 分钟阅读</span></span>${arrow}</a></div></article>`;
}
const emptyJournal = `<div class="journal-empty"><div class="journal-empty-art"><img src="/assets/cover-notes.svg" alt="纸张、笔记本与铅笔组成的静物插画" width="900" height="620"></div><div class="journal-empty-copy"><span class="eyebrow">A BLANK PAGE</span><h3>一些文字，<br>慢慢写下。</h3><p>暂时还没有公开的随笔。<br>这里会收录我的所看所想，<br>以及一些个人随笔。</p><span class="journal-signature">徐承敏 <span>/ iamputin</span></span></div></div>`;
const home = `
  <section class="hero container">
    <div class="hero-main">
      <p class="eyebrow"><span class="status-dot"></span> NOTES &amp; ESSAYS</p>
      <h1>所看，所想。<br>随笔记下<span class="accent">。</span></h1>
      <p class="hero-description">记录一些见闻，留下一些念头。<br>这里是徐承敏（iamputin）的个人随笔。</p>
      <a class="text-link hero-link" href="#writings">翻开随笔 <span>↓</span></a>
    </div>
    <aside class="hero-aside journal-aside">
      <span class="aside-name">徐承敏</span>
      <p class="aside-caption">IAMPUTIN<br>PERSONAL NOTES.</p>
      <p class="aside-text">所看见的，所想到的。<br>都可以在这里，随手记下。</p>
      <a class="text-link" href="/about/">关于我 ${arrow}</a>
    </aside>
    <span class="hero-index" aria-hidden="true">A PERSONAL SPACE / IAMPUTIN</span>
  </section>
  <section class="writings container" id="writings">
    <div class="section-heading"><div><p class="eyebrow">THE JOURNAL</p><h2>随笔之间<span class="small-dot">.</span></h2></div><a class="text-link archive-link" href="/archive/">全部随笔 ${arrow}</a></div>
    ${posts.length ? filters() + '<div class="post-grid">' + posts.map(card).join('') + '</div>' : emptyJournal}
  </section>`;

const years = [...new Set(posts.map(p => p.date.slice(0,4)))].sort().reverse();
const archive = `<section class="page-heading container"><p class="eyebrow">THE ARCHIVE</p><h1>文字的归处<span class="accent">。</span></h1><p>把所看所想，按时间收好。</p></section><section class="archive-section container">${posts.length ? filters() : ''}${years.map(year => '<div class="archive-year"><h2>'+year+'<span>'+String(posts.filter(p=>p.date.startsWith(year)).length).padStart(2,'0')+' ENTRIES</span></h2><div>'+posts.filter(p=>p.date.startsWith(year)).map((p,i)=>'<article class="archive-row" data-post data-category="'+esc(p.category)+'"><span class="archive-number">'+String(i+1).padStart(2,'0')+'</span><time datetime="'+p.date+'">'+p.date.slice(5).replace('-','.')+'</time><a href="'+url(p)+'"><h3>'+esc(p.title)+'</h3><span>'+esc(p.excerpt)+'</span></a><span class="archive-category">'+esc(p.category)+'</span><span class="archive-arrow" aria-hidden="true">'+arrow+'</span></article>').join('')+'</div></div>').join('')}${posts.length ? '<p class="archive-end">— 文字慢慢积攒 —</p>' : '<div class="archive-empty"><span class="empty-page-mark" aria-hidden="true">—</span><p>暂时还没有公开的随笔。</p><span>想写的，慢慢写下来。</span><a class="text-link" href="/">回到首页 '+arrow+'</a></div>'}</section>`;

const about = `<section class="page-heading container"><p class="eyebrow">A FEW WORDS ABOUT ME</p><h1>我是徐承敏<span class="accent">。</span></h1><p>也用 iamputin 这个网名。</p></section><section class="about-layout container"><div class="about-identity"><img src="/assets/favicon.svg" width="88" height="88" alt="徐承敏的笔尖图标"><h2>徐承敏</h2><span>iamputin</span><div class="identity-note">个人随笔 · 所看所想</div></div><div class="prose about-prose"><p class="lead">一些见闻，一些念头。</p><p>我是徐承敏，平时更习惯用 iamputin 这个网名。</p><p>这个网站用来记录我的所看所想，放一些个人随笔。</p><h2>关于这里</h2><p>把想写下来的文字收在一起，留一个属于自己的地方。</p><p class="about-signature">徐承敏 <span>iamputin</span></p></div></section>`;

function bodyHtml(p) {
  let heading = 0;
  return p.body.map(([type, value]) => {
    if (type === 'p') return `<p>${esc(value)}</p>`;
    if (type === 'h2') return `<h2 id="section-${++heading}">${esc(value)}</h2>`;
    if (type === 'quote') return `<blockquote><p>${esc(value)}</p></blockquote>`;
    if (type === 'list') return `<ul>${value.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
    if (type === 'link') return `<p><a class="article-project-link" href="${esc(value.href)}">${esc(value.text)} ${external}</a></p>`;
    throw new Error(`Unsupported content block: ${type}`);
  }).join('');
}
function article(p, i) {
  let heading = 0;
  const next = posts[(i + 1) % posts.length];
  return `<article class="article-page"><header class="article-header container"><a class="text-link article-back" href="/archive/">← 所有随笔</a>${meta(p)}<h1>${esc(p.title)}</h1><p class="article-excerpt">${esc(p.excerpt)}</p><div class="article-byline"><img src="/assets/favicon.svg" width="28" height="28" alt=""><span>徐承敏 / iamputin</span><span>·</span><span>${minutes(p)} 分钟阅读</span></div></header><figure class="article-cover container"><img src="/assets/${p.cover}" width="1100" height="740" alt="${esc(p.coverAlt)}"></figure><div class="article-layout container"><aside class="article-toc"><p class="eyebrow">ON THIS PAGE / 本文目录</p><nav aria-label="文章目录">${p.body.filter(([type])=>type==='h2').map(([,title])=>`<a href="#section-${++heading}">${esc(title)}</a>`).join('')}</nav><a class="toc-home" href="/">回到首页 ${arrow}</a></aside><div class="prose" data-article-content>${bodyHtml(p)}<div class="article-end-mark" aria-hidden="true">✳</div><div class="article-note">本文收录于「${p.category}」，最后更新于 ${date(p.date)}。</div><div class="next-post"><span class="eyebrow">NEXT ENTRY / 继续阅读</span><a href="${url(next)}">${esc(next.title)} ${arrow}</a></div></div></div></article>`;
}
async function save(path, text) { const target = resolve(root, path); await mkdir(dirname(target), {recursive: true}); await writeFile(target, text + '\n', 'utf8'); }
await save('index.html', layout({title:'所看所想，随笔记下',description:'徐承敏（iamputin）的个人随笔，记录所看所想。',body:home}));
await save('archive/index.html', layout({title:'随笔归档',description:'徐承敏（iamputin）的随笔归档。',path:'/archive/',active:'archive',body:archive}));
await save('about/index.html', layout({title:'关于徐承敏',description:'徐承敏，网名 iamputin。这个网站记录我的所看所想和个人随笔。',path:'/about/',active:'about',body:about}));
for (const [i,p] of posts.entries()) await save(`posts/${p.slug}/index.html`, layout({title:p.title,description:p.excerpt,path:url(p),body:article(p,i),article:true,image:p.cover}));
await save('404.html',layout({title:'这一页，暂时走丢了',description:'页面没有找到，回到徐承敏的随笔继续探索。',path:'/404.html',active:'',body:`<section class="not-found container"><p class="eyebrow">404 / A SMALL DETOUR</p><span class="not-found-number">404<span class="accent">.</span></span><h1>这一页，暂时走丢了。</h1><p>也许是地址有误，也许是故事还没写到这里。</p><a class="button-primary" href="/">回到首页 ${arrow}</a></section>`}));
await save('search-index.json', JSON.stringify(posts.map(p=>({title:p.title,slug:p.slug,url:url(p),excerpt:p.excerpt,category:p.category,date:p.date,searchText:p.body.map(([,v])=>typeof v==='string'?v:Array.isArray(v)?v.join(' '):v.text).join(' ')}))));
const paths = ['/', '/about/', '/archive/', ...posts.map(url)];
await save('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${site}${path}</loc></url>`).join('')}</urlset>`);
await save('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml`);
await save('feed.xml',`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>徐承敏的随笔</title><link>${site}/</link><description>徐承敏（iamputin）的个人随笔，记录所看所想。</description><language>zh-CN</language><atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>${posts.map(p=>`<item><title>${esc(p.title)}</title><link>${site}${url(p)}</link><guid>${site}${url(p)}</guid><pubDate>${new Date(p.date+'T12:00:00+08:00').toUTCString()}</pubDate><description>${esc(p.excerpt)}</description><category>${p.category}</category></item>`).join('')}</channel></rss>`);
console.log(`Built ${posts.length} articles, home, archive, about, 404, RSS and search index.`);
