(() => {
  let searchForm = document.getElementById("search-form");
  let searchInput = document.getElementById("search-input");
  let searchStyle = document.getElementById("search-style");

  document.addEventListener("keyup", handleGlobalKeyup);
  searchForm.addEventListener("submit", handleSearchFormSubmit);
  searchInput.addEventListener("input", handleSearchInput);

  function handleGlobalKeyup(e) {
    if (
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      document.activeElement === searchInput
    ) {
      return;
    }
    let c = String.fromCharCode(e.keyCode).toLowerCase();
    if (c.match(/\w/)) {
      searchInput.focus();
      searchInput.value += c;
      handleSearchInput();
    }
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
      .site-bookmark-category {
        display: none;
      }
      .site-bookmark-a {
        opacity: 0.3;
      }
      ${generateQuerySelectorQuery(splitedQuery)} {
        order: -1;
        -ms-flex-order: -1;
      }
      ${generateQuerySelectorQuery(splitedQuery)} .site-bookmark-a {
        opacity: 1;
      }
    `;
  }

  function setTabindex(splitedQuery) {
    let filteredItems = document.querySelectorAll(
      `${generateQuerySelectorQuery(splitedQuery)} .site-bookmark-a`
    );

    filteredItems.forEach(item => {
      item.setAttribute("tabindex", "2");
    });
  }

  function setFocus(splitedQuery) {
    let firstItem = document.querySelector(
      `${generateQuerySelectorQuery(splitedQuery)} .site-bookmark-a`
    );
    if (firstItem) {
      firstItem.classList.add("site-bookmark-a-focus");
    }
  }

  function generateQuerySelectorQuery(splitedQuery) {
    return splitedQuery.map(query => `[data-name*="${query}"]`).join("");
  }
})();
