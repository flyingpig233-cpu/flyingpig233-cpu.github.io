import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const posts = JSON.parse(await readFile(resolve(root, 'content/posts.json'), 'utf8'));
const projects = JSON.parse(await readFile(resolve(root, 'content/projects.json'), 'utf8'));
const slugs = new Set();
const files = ['index.html', 'archive/index.html', 'about/index.html', 'projects/index.html', '404.html', ...projects.map(p=>`projects/${p.slug}/index.html`), ...posts.map(p=>`posts/${p.slug}/index.html`)];
const fragments = new Map();
for (const p of posts) {
  assert.match(p.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(!slugs.has(p.slug), `Duplicate slug: ${p.slug}`); slugs.add(p.slug);
  assert.match(p.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Date(p.date).toISOString().slice(0, 10), p.date);
  for (const key of ['title', 'excerpt', 'category', 'cover', 'coverAlt']) assert(p[key], `Missing ${key}`);
}
for (const file of files) {
  const html = await readFile(resolve(root,file), 'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length, 1, `${file}: need one h1`);
  assert(html.includes('lang="zh-CN"'));
  assert(html.includes('rel="canonical"'));
  assert(!/iamputin|飞猪|>FlyingPig</i.test(html), `${file}: unexpected old display name`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`${file}: duplicate IDs`);
  fragments.set('/'+file.replace(/index\.html$/,''),new Set(ids));
}
let checked = 0;
for (const file of files) {
  const html = await readFile(resolve(root,file), 'utf8');
  for (const [,attr,href] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const link = new URL(href, 'https://example.com/'+file);
    let target = resolve(root,'.'+decodeURIComponent(link.pathname));
    if (link.pathname.endsWith('/')) target = resolve(target,'index.html');
    assert((await stat(target)).isFile(),`${file}: missing ${attr} ${href}`);
    if (link.hash && target.endsWith('.html')) {
      const other = await readFile(target,'utf8');
      assert(other.includes(`id="${decodeURIComponent(link.hash.slice(1))}"`),`${file}: broken fragment ${href}`);
    }
    checked++;
  }
}
const index = JSON.parse(await readFile(resolve(root,'search-index.json'),'utf8'));
assert.equal(index.length,posts.length);
for (const p of posts) assert(index.find(entry=>entry.slug===p.slug && entry.searchText.includes(p.body[0][1])));
const feed = await readFile(resolve(root,'feed.xml'),'utf8');
assert.equal((feed.match(/<item>/g)||[]).length,posts.length);
execFileSync(process.execPath,['--check',resolve(root,'app.js')]);
console.log(`Passed: ${files.length} pages, ${checked} local references, unique articles, search/RSS parity and JavaScript syntax.`);
