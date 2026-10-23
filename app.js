(() => {
  "use strict";

  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const root = document.documentElement;
    const themeButtons = [...document.querySelectorAll("[data-theme-toggle]")];

    const reflectTheme = () => {
      const isDark = root.dataset.theme === "dark";
      themeButtons.forEach((button) => {
        button.setAttribute("aria-label", isDark ? "切换浅色模式" : "切换深色模式");
        button.setAttribute("aria-pressed", String(isDark));
      });
    };

    themeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = nextTheme;
        try {
          localStorage.setItem("iamputin-theme", nextTheme);
        } catch {
          // Theme switching still works when browser storage is unavailable.
        }
        reflectTheme();
      });
    });
    reflectTheme();

    const menuButton = document.querySelector("[data-menu-toggle]");
    const navigation = document.getElementById("main-nav");
    let menuOpen = false;

    const setMenuOpen = (open, restoreFocus = false) => {
      if (!menuButton || !navigation) return;
      menuOpen = open;
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
      navigation.classList.toggle("is-open", open);
      navigation.dataset.open = String(open);
      if (restoreFocus) menuButton.focus();
    };

    if (menuButton && navigation) {
      menuButton.setAttribute("aria-controls", "main-nav");
      setMenuOpen(false);
      menuButton.addEventListener("click", () => setMenuOpen(!menuOpen));
      navigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) setMenuOpen(false);
      });
      document.addEventListener("click", (event) => {
        if (menuOpen && !navigation.contains(event.target) && !menuButton.contains(event.target)) {
          setMenuOpen(false);
        }
      });
    }

    const dialog = document.getElementById("search-dialog");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    let searchReturnFocus = null;
    let searchIndex = null;
    let searchRequest = null;

    const normalize = (value) => String(value ?? "").normalize("NFKC").toLocaleLowerCase();

    const resultURL = (entry) => {
      if (typeof entry.url !== "string" || !entry.url.trim()) return null;
      try {
        const url = new URL(entry.url, document.baseURI);
        if (!["http:", "https:"].includes(url.protocol) || url.origin !== location.origin) return null;
        return url.href;
      } catch {
        return null;
      }
    };

    const searchMessage = (message) => {
      if (!searchResults) return;
      const paragraph = document.createElement("p");
      paragraph.className = "search-message";
      paragraph.setAttribute("role", "status");
      paragraph.textContent = message;
      searchResults.replaceChildren(paragraph);
    };

    const renderSearch = () => {
      if (!searchInput || !searchResults || !searchIndex) return;
      if (!searchIndex.length) {
        searchMessage("暂时还没有公开的随笔。新的文字，会慢慢写在这里。");
        return;
      }
      const tokens = normalize(searchInput.value).trim().split(/\s+/u).filter(Boolean);
      const matches = searchIndex.filter((entry) => {
        const haystack = normalize([entry.title, entry.excerpt, entry.category, entry.searchText].join(" "));
        return tokens.every((token) => haystack.includes(token));
      });
      if (!matches.length) {
        searchMessage("没有找到相关内容，试试其他关键词。");
        return;
      }
      const fragment = document.createDocumentFragment();
      const count = document.createElement("p");
      count.className = "search-message search-count";
      count.setAttribute("role", "status");
      count.textContent = tokens.length ? `找到 ${matches.length} 篇文章` : `全部 ${matches.length} 篇文章`;
      fragment.append(count);
      matches.forEach((entry) => {
        const link = document.createElement("a");
        link.className = "search-result";
        link.href = entry.href;
        const title = document.createElement("span");
        title.className = "search-result-title";
        title.textContent = String(entry.title || "未命名文章");
        const meta = document.createElement("span");
        meta.className = "search-result-meta";
        meta.textContent = [entry.category, entry.date].filter(Boolean).join(" · ");
        const excerpt = document.createElement("span");
        excerpt.className = "search-result-excerpt";
        excerpt.textContent = String(entry.excerpt || "");
        link.append(title, meta, excerpt);
        fragment.append(link);
      });
      searchResults.replaceChildren(fragment);
    };

    const loadSearch = async () => {
      if (!searchResults) return;
      if (searchIndex) {
        renderSearch();
        return;
      }
      if (searchRequest) return searchRequest;
      searchResults.setAttribute("aria-busy", "true");
      searchMessage("正在加载文章索引……");
      searchRequest = (async () => {
        try {
          const response = await fetch("/search-index.json", { credentials: "same-origin", cache: "no-store" });
          if (!response.ok) throw new Error("Search index unavailable");
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error("Invalid search index");
          searchIndex = data.filter((entry) => entry && typeof entry === "object")
            .map((entry) => ({ ...entry, href: resultURL(entry) }))
            .filter((entry) => entry.href);
          renderSearch();
        } catch {
          searchMessage("搜索暂时无法加载，请稍后重试。也可以前往文章归档浏览。");
          const retry = document.createElement("button");
          retry.type = "button";
          retry.className = "search-retry";
          retry.textContent = "重新加载";
          retry.addEventListener("click", () => void loadSearch());
          searchResults.append(retry);
        } finally {
          searchResults.setAttribute("aria-busy", "false");
          searchRequest = null;
        }
      })();
      return searchRequest;
    };

    const restoreSearchFocus = () => {
      if (searchReturnFocus instanceof HTMLElement && searchReturnFocus.isConnected) {
        searchReturnFocus.focus();
      }
      searchReturnFocus = null;
    };

    const closeSearch = () => {
      if (!dialog || !dialog.open) return;
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
        restoreSearchFocus();
      }
    };

    const openSearch = () => {
      if (!dialog || !searchInput || !searchResults || dialog.open) return;
      searchReturnFocus = document.activeElement;
      setMenuOpen(false);
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
      }
      searchInput.focus();
      void loadSearch();
    };

    if (dialog && searchInput && searchResults) {
      document.querySelectorAll("[data-search-open]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          openSearch();
        });
      });
      dialog.querySelectorAll("[data-search-close]").forEach((button) => {
        button.addEventListener("click", closeSearch);
      });
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeSearch();
      });
      dialog.addEventListener("close", restoreSearchFocus);
      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) closeSearch();
      });
      searchInput.addEventListener("input", renderSearch);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (dialog?.open) closeSearch();
        else if (menuOpen) setMenuOpen(false, true);
        return;
      }
      if (event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof Element &&
          (target.closest("input, textarea, select, [role='textbox']") || target.isContentEditable)) return;
      const slash = event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey;
      const shortcut = event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey) && !event.altKey;
      if ((slash || shortcut) && dialog && searchInput && searchResults) {
        event.preventDefault();
        openSearch();
      }
    });

    const filterButtons = [...document.querySelectorAll("[data-filter]")];
    const postCards = [...document.querySelectorAll("[data-post]")];
    const filterStatus = document.getElementById("filter-status");
    const availableCategories = new Set(filterButtons.map((button) => button.dataset.filter));

    const applyFilter = (requestedCategory, updateURL) => {
      const category = availableCategories.has(requestedCategory) ? requestedCategory : "全部";
      let count = 0;
      postCards.forEach((card) => {
        const visible = category === "全部" || card.dataset.category === category;
        card.hidden = !visible;
        if (visible) count += 1;
      });
      filterButtons.forEach((button) => {
        const active = button.dataset.filter === category;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("is-active", active);
      });
      if (filterStatus) {
        filterStatus.hidden = false;
        filterStatus.setAttribute("aria-live", "polite");
        filterStatus.textContent = count
          ? `${category === "全部" ? "共" : category + " ·"} ${count} 篇文章`
          : "这个分类暂时没有文章。";
      }
      if (updateURL) {
        try {
          const url = new URL(location.href);
          if (category === "全部") url.searchParams.delete("category");
          else url.searchParams.set("category", category);
          history.replaceState(history.state, "", url);
        } catch {
          // Filtering is independent of the browser's history permissions.
        }
      }
    };

    if (filterButtons.length) {
      filterButtons.forEach((button) => {
        button.addEventListener("click", () => applyFilter(button.dataset.filter, true));
      });
      let initialCategory = "全部";
      try {
        initialCategory = new URL(location.href).searchParams.get("category") || "全部";
      } catch {
        // Use the complete archive when URL parsing is unavailable.
      }
      applyFilter(initialCategory, false);
      window.addEventListener("popstate", () => {
        applyFilter(new URL(location.href).searchParams.get("category") || "全部", false);
      });
    }

    const backTop = document.querySelector("[data-back-top]");
    const progress = document.getElementById("reading-progress");
    const article = document.querySelector("[data-article-content]");
    let scrollFrame = 0;

    const updateScrollUI = () => {
      scrollFrame = 0;
      if (backTop) {
        const visible = window.scrollY > 600;
        backTop.hidden = !visible;
        backTop.classList.toggle("is-visible", visible);
      }
      if (progress && article) {
        const bounds = article.getBoundingClientRect();
        const start = bounds.top + window.scrollY;
        const distance = Math.max(1, bounds.height - window.innerHeight);
        const value = Math.min(100, Math.max(0, (window.scrollY - start) / distance * 100));
        progress.style.width = `${value}%`;
        progress.setAttribute("aria-valuenow", String(Math.round(value)));
      }
    };

    const scheduleScrollUI = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollUI);
    };

    if (backTop) {
      backTop.addEventListener("click", (event) => {
        event.preventDefault();
        const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
      });
    }
    if (backTop || (progress && article)) {
      window.addEventListener("scroll", scheduleScrollUI, { passive: true });
      window.addEventListener("resize", scheduleScrollUI);
      window.addEventListener("load", scheduleScrollUI, { once: true });
      if (article && typeof ResizeObserver !== "undefined") {
        new ResizeObserver(scheduleScrollUI).observe(article);
      }
      updateScrollUI();
    }
  });
})();
