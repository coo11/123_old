const pinyin = require("pinyin");

const CHINESE = /[\u4e00-\u9fa5]/;

module.exports = (config, cssIcons, cb) => {
  cb(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0,
            maximum-scale=1.0, user-scalable=no"
      />
      <title>${config.title}</title>
      <link rel="shortcut icon" type="image/png" href="./favicon.ico" />
      <link rel="stylesheet" href="./assets/mobi.css" />
      <link rel="stylesheet" href="./assets/site.css" />
      <script>
        let ua = window.navigator.userAgent;
        if (!/mobile|mobi|wap|simulator|ipad|ipod|iphone|android/gi.test(ua)) {
          let images = ${JSON.stringify(config.images || [])},
            n = images.length;
          if (n) {
            let i = Math.round(Math.random() * (n - 1));
            document.write(
              "<style>body{background:url(" + images[i] + ") no-repeat center top;background-attachment:fixed;background-size:cover;}</style>"
            );
          }
        }
      </script>
    </head>
    <body>
      <div class="flex-center">
        <div class="container">
          ${renderSearch()}
          ${renderBookmarks()}
          ${renderFooter()}
        </div>
      </div>
      <script src="./assets/search.js"></script>
    </body>
  </html>
  `);

  function renderSearch() {
    return `
      <style id="search-style"></style>
      <form id="search-form" class="form">
        <input id="search-input" type="search" placeholder="Type to search" autocomplete="off" tabindex="1" style="padding:0 8px 1px 8px; height:32px; border-radius:15px;" />
      </form>
    `;
  }

  function renderBookmarks() {
    return `
      <ul class="site-bookmark-ul flex-left flex-wrap units-gap">
        ${config.bookmark.map(renderBookmark).join("")}
      </ul>
    `;
  }

  function renderBookmark({ category, name, url, favicon }) {
    if (category) {
      return `
        <li class="site-bookmark-li site-bookmark-category unit-1 top-gap text-muted text-small">${category}</li>
      `;
    }
    return `
      <li
        class="site-bookmark-li unit-0"
        data-name="${addPinyin(name).toLowerCase()}"
      >
        <a href="${url}" class="site-bookmark-a flex-middle" tabindex="9">
          ${renderIcon(favicon)}<span>${name}</span>
        </a>
      </li>
    `;
  }

  function renderIcon(name) {
    if (!name) return "";
    name = name.slice(0, -4);
    if (!cssIcons[name]) return "";
    return `<div class="site-bookmark-div" style="${cssIcons[name]}"></div>\n`;
  }

  function renderFooter() {
    const n = config.bookmark.filter(i => "category" in i).length;
    return `
      <footer class="text-center top-gap-big text-muted text-small">
        <hr/>
        <p>${n} categories included. ${
      config.bookmark.length - n
    } links in total. Forked from <a class="text-muted" href="https://github.com/xcatliu/123">xcatliu</a></p>
      </footer>
    `;
  }
};

function addPinyin(str) {
  if (!CHINESE.test(str)) {
    return str;
  }

  return (
    str +
    " " +
    pinyin(str, {
      style: pinyin.STYLE_NORMAL // 普通风格，即不带音标。
    }).join("")
  );
}
