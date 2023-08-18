(()=>{var e=window.navigator.userAgent;if(!/mobile|mobi|wap|simulator|ipad|ipod|iphone|android/gi.test(e)){document.body.style.background="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAAAAADF+lnMAAAAAnRSTlMA/1uRIrUAAAAmSURBVAjXNcYxAQAwEAIx6t8er+c6AJnyUJwIo6UznelMl6AFLXybuUg2me0a1QAAAABJRU5ErkJggg==') fixed";try{fetch("https://api.coo11.eu.org/navi/bg",{method:"HEAD"}).then(e=>{200===e.status&&(document.body.style.background=`url("${e.url}") fixed no-repeat top center / cover`)})}catch(e){}}e=document.getElementById("search-form");let o=document.getElementById("search-input"),a=document.getElementById("search-style");function r(){document.querySelectorAll('[tabindex="2"]').forEach(e=>{e.setAttribute("tabindex","9")}),document.querySelectorAll(".site-bookmark-a-focus").forEach(e=>{e.classList.remove("site-bookmark-a-focus")});var e,t=o.value.trim().toLowerCase();""===t?a.innerHTML="":(t=t.split(/\s+/),e=t,a.innerHTML=`
      .site-bookmark-category {
        display: none;
      }
      .site-bookmark-a {
        opacity: 0.3;
      }
      ${n(e)} {
        order: -1;
        -ms-flex-order: -1;
      }
      ${n(e)} .site-bookmark-a {
        opacity: 1;
      }
    `,e=t,(e=document.querySelectorAll(n(e)+" .site-bookmark-a")).forEach(e=>{e.setAttribute("tabindex","2")}),e=t,(e=document.querySelector(n(e)+" .site-bookmark-a"))&&e.classList.add("site-bookmark-a-focus"))}function n(e){return e.map(e=>`[data-name*="${e}"]`).join("")}document.addEventListener("keyup",function(e){var t=e.key;if("Escape"===t)o.blur(),o.value="";else if(e.altKey||e.ctrlKey||e.metaKey||/F\d{1,2}/.test(t)||document.activeElement===o)return;t.match(/^\w$/)&&(o.focus(),o.value+=t);r()}),e.addEventListener("submit",function(e){e.preventDefault();e=document.querySelector(".site-bookmark-a-focus");e&&(location.href=e.href)}),o.addEventListener("input",r),o.addEventListener("blur",()=>{var e=document.querySelector(".site-bookmark-a-focus");e&&e.classList.remove("site-bookmark-a-focus")})})();