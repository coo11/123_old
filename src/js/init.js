(() => {
  {
    let ua = window.navigator.userAgent;
    if (!/mobile|mobi|wap|simulator|ipad|ipod|iphone|android/gi.test(ua)) {
      document.body.style.background = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAAAAADF+lnMAAAAAnRSTlMA/1uRIrUAAAAmSURBVAjXNcYxAQAwEAIx6t8er+c6AJnyUJwIo6UznelMl6AFLXybuUg2me0a1QAAAABJRU5ErkJggg==') fixed";
      try {
        fetch("https://123.coo11.workers.dev/bg", { method: 'HEAD' }).then(resp => {
          if (resp.status === 200) document.body.style.background = `url("${resp.url}") fixed no-repeat top center / cover`;
        })
      } catch (e) { }
    }
  };

  let searchForm = document.getElementById("search-form");
  let searchInput = document.getElementById("search-input");
  let searchStyle = document.getElementById("search-style");

  document.addEventListener("keyup", handleGlobalKeyup);
  searchForm.addEventListener("submit", handleSearchFormSubmit);
  searchInput.addEventListener("input", handleSearchInput);

  function handleGlobalKeyup(e) {
    let key = e.key;
    if (key === "Escape") {
      searchInput.blur();
      searchInput.value = "";
    } else if (
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      /F\d{1,2}/.test(key) ||
      document.activeElement === searchInput
    )
      return;
    if (key.match(/^\w$/)) {
      searchInput.focus();
      searchInput.value += key;
    }
    handleSearchInput();
  }

  function handleSearchFormSubmit(e) {
    e.preventDefault();
    let focusedResult = document.querySelector(".site-bookmark-a-focus");
    if (focusedResult) {
      location.href = focusedResult.href;
    }
  }

  function handleSearchInput() {
    clearTabindex();
    clearFocus();

    let query = searchInput.value.trim().toLowerCase();
    if (query === "") {
      searchStyle.innerHTML = "";
      return;
    }

    let splitedQuery = query.split(/\s+/);

    setSearchStyle(splitedQuery);
    setTabindex(splitedQuery);
    setFocus(splitedQuery);
  }

  searchInput.addEventListener("blur", () => {
    let focusedResult = document.querySelector(".site-bookmark-a-focus");
    if (focusedResult) {
      focusedResult.classList.remove("site-bookmark-a-focus");
    }
  });

  function clearTabindex() {
    document.querySelectorAll('[tabindex="2"]').forEach(element => {
      element.setAttribute("tabindex", "9");
    });
  }

  function clearFocus() {
    document.querySelectorAll(".site-bookmark-a-focus").forEach(element => {
      element.classList.remove("site-bookmark-a-focus");
    });
  }

  function setSearchStyle(splitedQuery) {
    searchStyle.innerHTML = `
      .site - bookmark - category {
        display: none;
      }
        .site - bookmark - a {
      opacity: 0.3;
    }
      ${generateQuerySelectorQuery(splitedQuery)} {
      order: -1;
        - ms - flex - order: -1;
  }
      ${generateQuerySelectorQuery(splitedQuery)} .site - bookmark - a {
    opacity: 1;
  }
  `;
  }

  function setTabindex(splitedQuery) {
    let filteredItems = document.querySelectorAll(
      `${generateQuerySelectorQuery(splitedQuery)} .site - bookmark - a`
    );

    filteredItems.forEach(item => {
      item.setAttribute("tabindex", "2");
    });
  }

  function setFocus(splitedQuery) {
    let firstItem = document.querySelector(
      `${generateQuerySelectorQuery(splitedQuery)} .site - bookmark - a`
    );
    if (firstItem) {
      firstItem.classList.add("site-bookmark-a-focus");
    }
  }

  function generateQuerySelectorQuery(splitedQuery) {
    return splitedQuery.map(query => `[data - name*="${query}"]`).join("");
  }
})();
