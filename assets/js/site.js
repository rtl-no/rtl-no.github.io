(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navigation = document.querySelector("[data-navigation]");

  themeToggle?.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = theme;
    localStorage.setItem("rtl-theme", theme);
  });

  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navigation?.toggleAttribute("data-open", !open);
  });

  navigation?.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navToggle?.setAttribute("aria-expanded", "false");
      navigation.removeAttribute("data-open");
    }
  });

  const search = document.querySelector("[data-search]");
  if (search) {
    const input = search.querySelector("input");
    const results = search.querySelector("[data-search-results]");
    const empty = search.querySelector("[data-search-empty]");
    const indexUrl = search.getAttribute("data-index");
    let index = [];

    const render = () => {
      const query = input.value.trim().toLocaleLowerCase();
      results.replaceChildren();
      empty.hidden = true;
      if (query.length < 2) return;

      const matches = index.filter((item) =>
        [item.title, item.summary, item.section, ...(item.tags || [])]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query)
      ).slice(0, 30);

      for (const item of matches) {
        const article = document.createElement("article");
        article.className = "search-result";
        const title = document.createElement("h2");
        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.title;
        title.append(link);
        article.append(title);
        if (item.summary) {
          const summary = document.createElement("p");
          summary.textContent = item.summary;
          article.append(summary);
        }
        results.append(article);
      }
      empty.hidden = matches.length !== 0;
    };

    fetch(indexUrl)
      .then((response) => response.ok ? response.json() : Promise.reject(response))
      .then((data) => { index = data; input.disabled = false; })
      .catch(() => { input.disabled = true; });
    input.addEventListener("input", render);
  }

  const tranceFilters = document.querySelector("[data-trance-filters]");
  const tranceCards = [...document.querySelectorAll("[data-trance-grid] .trance-card")];
  tranceFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const filter = button.dataset.filter;
    tranceFilters.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    tranceCards.forEach((card) => {
      const visible = filter === "all" ||
        (filter === "favourite" && card.dataset.favourite === "true") ||
        card.dataset.artist === filter;
      card.hidden = !visible;
    });
  });
})();
