const { series, parallel, src, dest } = require("gulp"),
  uglify = require("gulp-uglify"),
  cleanCSS = require("gulp-clean-css"),
  spritesmith = require("gulp.spritesmith"),
  clean = require("gulp-clean"),
  harvest = require("./src/harvest.js"),
  layout = require("./src/layout.js"),
  fs = require("fs"),
  siteCss = fs.readFileSync("./src/css/site.css", "utf8");

function initData(cb) {
  harvest.init();
  cb();
}

function sprite(cb) {
  let files = harvest.pick({ png: true, pngToUse: true });
  if (!files.length) return cb();
  return src(files.map(i => `./src/img/${i}`))
    .pipe(
      spritesmith({
        imgName: "sprite.png", // merged name
        cssName: "site.css",
        padding: 2, // default 0px
        cssTemplate: data => {
          let str = siteCss,
            w = data.spritesheet.width,
            h = data.spritesheet.height;
          data.sprites.forEach(({ name, offset_x, offset_y, width }) => {
            const r = width / 16;
            /* prettier-ignore */
            str += `\n[data-name*="${name}"] .site-bookmark-div {
  background: url(${data.spritesheet.image}) no-repeat ${offset_x / r}px ${offset_y / r}px;
  background-size: ${w / r}px ${h / r}px;
}`;
          });
          return str;
        },
      })
    )
    .pipe(dest("dist/assets/"));
}

function jsUglify() {
  return src("src/js/*.js").pipe(uglify()).pipe(dest("dist/assets"));
}

function cssMinify() {
  return src(["./dist/assets/site.css", "./src/css/mobi.css"])
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(dest("dist/assets"));
}

function cleanOutput(cb) {
  if (fs.existsSync("./dist"))
    return src("dist", { read: false }).pipe(clean({ force: true }));
  cb();
}

function newDir(cb) {
  fs.mkdirSync("dist/");
  fs.mkdirSync("dist/assets/");
  cb();
}

function copyFiles(cb) {
  layout(harvest.config, html => {
    fs.writeFileSync("./dist/index.html", html);
    src(["./src/favicon.ico", "./src/apple-touch-icon.png"]).pipe(dest("dist"));
  });
  cb();
}

exports.cleanUnusedImg = cb => {
  let files = harvest.pick({ png: false });
  if (!files.length) return cb();
  src(
    files.map(i => `./src/img/${i}`),
    { read: false }
  ).pipe(clean());
  console.log("Unused Icons Cleaned.");
  cb();
};

exports.build = series(
  cleanOutput,
  newDir,
  initData,
  sprite,
  copyFiles,
  parallel(jsUglify, cssMinify)
);
