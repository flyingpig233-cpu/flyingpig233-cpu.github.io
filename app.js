(() => {
  const root = document.documentElement;
  const theme = document.querySelector('[data-theme-toggle]');
  const reflectTheme = () => {
    const dark = root.dataset.theme === 'dark';
    theme?.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
    theme?.setAttribute('aria-pressed', String(dark));
  };
  theme?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('xuchengmin-theme', root.dataset.theme); } catch {}
    reflectTheme();
  });
  reflectTheme();

  const dialog = document.getElementById('search-dialog');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  let index = null;
  let returnFocus = null;
  let request = null;
  if (!dialog || !input || !results) return;
  const message = text => {
    const p = document.createElement('p');
    p.className = 'search-message'; p.textContent = text;
    results.replaceChildren(p);
  };
  const render = () => {
    if (!index) return;
    if (!index.length) { message('还没有公开的文字。'); return; }
    const tokens = input.value.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = index.filter(p => tokens.every(t => [p.title,p.category,p.excerpt,p.searchText].join(' ').normalize('NFKC').toLowerCase().includes(t)));
    if (!matches.length) { message('没有找到相关随笔。'); return; }
    const fragment = document.createDocumentFragment();
    for (const p of matches) {
      const target = new URL(p.url, location.href);
      if (target.origin !== location.origin) continue;
      const a = document.createElement('a');
      a.href = target.href; a.className = 'search-result';
      const title = document.createElement('span');
      title.className = 'search-result-title'; title.textContent = p.title;
      const date = document.createElement('span');
      date.className = 'search-result-meta'; date.textContent = p.date;
      a.append(title,date); fragment.append(a);
    }
    results.replaceChildren(fragment);
  };
  const load = async () => {
    if (index) { render(); return; }
    if (request) return request;
    message('加载中…'); results.setAttribute('aria-busy','true');
    request = (async () => {
      try {
        const r = await fetch('/search-index.json', {cache:'no-store',credentials:'same-origin'});
        if (!r.ok) throw new Error('Unavailable');
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error('Invalid index');
        index = data; render();
      } catch { message('暂时无法搜索，请到随笔页浏览。'); }
      finally { results.setAttribute('aria-busy','false'); request = null; }
    })();
    return request;
  };
  const open = () => {
    if (dialog.open) return;
    returnFocus = document.activeElement;
    dialog.showModal(); input.focus(); void load();
  };
  const close = () => dialog.close();
  document.querySelectorAll('[data-search-open]').forEach(b=>b.addEventListener('click',open));
  document.querySelectorAll('[data-search-close]').forEach(b=>b.addEventListener('click',close));
  dialog.addEventListener('close',()=>returnFocus?.isConnected && returnFocus.focus());
  dialog.addEventListener('click',e=>{
    const b = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom)) close();
  });
  input.addEventListener('input',render);
  document.addEventListener('keydown',e=>{
    if (e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    if ((e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey)||(e.key.toLowerCase()==='k'&&(e.ctrlKey||e.metaKey)&&!e.altKey)) {e.preventDefault();open();}
  });
})();
