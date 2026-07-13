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

  document.querySelectorAll("[data-music-collection]").forEach((collection) => {
    const filters = collection.querySelector("[data-music-filters]");
    const cards = [...collection.querySelectorAll("[data-music-grid] .trance-card")];
    filters?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      const filter = button.dataset.filter;
      filters.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
      cards.forEach((card) => {
        const visible = filter === "all" ||
          (filter === "favourite" && card.dataset.favourite === "true") ||
          card.dataset.artist === filter;
        card.hidden = !visible;
      });
    });
  });

  document.querySelectorAll("[data-quiz]").forEach((quiz) => {
    const form = quiz.querySelector("[data-quiz-form]");
    const questions = [...quiz.querySelectorAll(".quiz-question")];
    const answered = quiz.querySelector("[data-quiz-answered]");
    const progressBar = quiz.querySelector("[data-quiz-progress-bar]");
    const result = quiz.querySelector("[data-quiz-result]");
    const score = quiz.querySelector("[data-quiz-score]");
    const scoreText = quiz.querySelector("[data-quiz-score-text]");
    const message = quiz.querySelector("[data-quiz-message]");
    const domainResults = quiz.querySelector("[data-quiz-domains]");
    const reset = quiz.querySelector("[data-quiz-reset]");

    const updateProgress = () => {
      const count = questions.filter((question) => question.querySelector("input:checked")).length;
      answered.textContent = String(count);
      progressBar.style.width = `${Math.round((count / questions.length) * 100)}%`;
    };

    form?.addEventListener("change", updateProgress);
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      let correctCount = 0;
      const domains = new Map();

      questions.forEach((question) => {
        const expected = Number(question.dataset.correct);
        const selected = question.querySelector("input:checked");
        const optionLabels = [...question.querySelectorAll(".quiz-options label")];
        const feedback = question.querySelector(".quiz-feedback");
        const feedbackLabel = question.querySelector("[data-feedback-label]");
        const domain = question.dataset.domain;
        const domainScore = domains.get(domain) || { correct: 0, total: 0 };
        domainScore.total += 1;

        optionLabels[expected]?.classList.add("is-correct");
        if (selected) {
          const selectedIndex = Number(selected.value);
          if (selectedIndex === expected) {
            correctCount += 1;
            domainScore.correct += 1;
            question.classList.add("answered-correctly");
            feedbackLabel.textContent = quiz.dataset.correctLabel;
          } else {
            optionLabels[selectedIndex]?.classList.add("is-wrong");
            question.classList.add("answered-wrongly");
            feedbackLabel.textContent = quiz.dataset.wrongLabel;
          }
        } else {
          question.classList.add("unanswered");
          feedbackLabel.textContent = quiz.dataset.unansweredLabel;
        }

        domains.set(domain, domainScore);
        feedback.hidden = false;
        question.querySelectorAll("input").forEach((input) => { input.disabled = true; });
      });

      const percentage = Math.round((correctCount / questions.length) * 100);
      score.textContent = `${percentage}%`;
      scoreText.textContent = `${correctCount} / ${questions.length}`;
      message.textContent = percentage >= Number(quiz.dataset.pass) ? quiz.dataset.passMessage : quiz.dataset.reviewMessage;
      domainResults.replaceChildren();

      domains.forEach((value, name) => {
        const row = document.createElement("div");
        const label = document.createElement("span");
        const valueText = document.createElement("strong");
        label.textContent = name;
        valueText.textContent = `${value.correct} / ${value.total} · ${Math.round((value.correct / value.total) * 100)}%`;
        row.append(label, valueText);
        domainResults.append(row);
      });

      result.hidden = false;
      form.querySelector("button[type='submit']").disabled = true;
      result.focus();
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    reset?.addEventListener("click", () => {
      form.reset();
      questions.forEach((question) => {
        question.classList.remove("answered-correctly", "answered-wrongly", "unanswered");
        question.querySelectorAll(".quiz-options label").forEach((label) => label.classList.remove("is-correct", "is-wrong"));
        question.querySelectorAll("input").forEach((input) => { input.disabled = false; });
        question.querySelector(".quiz-feedback").hidden = true;
      });
      form.querySelector("button[type='submit']").disabled = false;
      result.hidden = true;
      domainResults.replaceChildren();
      updateProgress();
      quiz.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
