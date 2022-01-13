const pinyin = require("pinyin");

const CHINESE = /[\u4e00-\u9fa5]/;

module.exports = (config, cb) => {
  // Line 37: From V2EX https://static.v2ex.com/grids/air.png
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
      <link rel="apple-touch-icon" href="./apple-touch-icon.png">
      <link rel="stylesheet" href="./assets/mobi.css" />
      <link rel="stylesheet" href="./assets/site.css" />
      <script>
        let ua = window.navigator.userAgent;
        if (!/mobile|mobi|wap|simulator|ipad|ipod|iphone|android/gi.test(ua)) {
          let images = ${JSON.stringify(config.images || [])},
            n = images.length,
            style = 'url("https://pic3.58cdn.com.cn/nowater/webim/big/n_v23ba8022bc3904bacabf05b4193d264f4.png") fixed repeat;';
          if (n) {
            let i = Math.round(Math.random() * Math.max(9, n));
            if (i < n) style = \`url("\${images[i]}") fixed no-repeat top center / cover;\`;
          }
          document.head.insertAdjacentHTML("beforeend", \`<style>body { background: \${style} }</style>\`);
        }
      </script>
      <script defer src="./assets/search.js"></script>
    </head>
    <body>
      <div class="flex-center">
        <div class="container">
          ${renderSearch()}
          ${renderBookmarks()}
          ${renderFooter()}
        </div>
      </div>
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

  function renderBookmark({ category, name, url, favicon, newTab }) {
    if (category) {
      return `
        <li class="site-bookmark-li site-bookmark-category unit-1 top-gap text-muted text-small" id="${category.replace(
          /\s/g,
          ""
        )}">${category}</li>
      `;
    }
    if (favicon) favicon = favicon.slice(0, -4).toLowerCase();
    else favicon = "";
    return `
      <li
        class="site-bookmark-li unit-0"
        data-name="${addPinyin(String(name).toLowerCase(), favicon)}"
      >
        <a href="${url}" ${
      newTab ? 'target="_blank" ' : " "
    }class="site-bookmark-a flex-middle" tabindex="9">
          ${favicon ? '<div class="site-bookmark-div"></div>' : ""}
          <span>${name}</span>
        </a>
      </li>
    `;
  }

  function renderFooter() {
    const n = config.bookmark.filter(i => "category" in i).length;
    return `
      <footer class="text-center top-gap-big text-muted text-small">
        <hr/>
        <p>Modified by <a class="text-muted" href="https://github.com/coo11/123">coo11</a> & forked from <a class="text-muted" href="https://github.com/xcatliu/123">xcatliu</a><br>${n} categories included & ${
      config.bookmark.length - n
    } links in total</p>
      </footer>
    `;
  }
};

function addPinyin(name, fav) {
  if (!CHINESE.test(name)) {
    return name === fav ? name : `${name} ${fav}`;
  }
  const py = pinyin(name, {
    style: pinyin.STYLE_NORMAL // 普通风格，即不带音标。
  }).join("");
  return py === fav ? `${name} ${py}` : `${name} ${fav} ${py}`;
}
