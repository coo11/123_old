const { series, parallel, src, dest } = require("gulp"),
  uglify = require("gulp-uglify"),
  cleanCSS = require("gulp-clean-css"),
  spritesmith = require("gulp.spritesmith"),
  clean = require("gulp-clean"),
  harvest = require("./src/harvest.js"),
  layout = require("./src/layout.js"),
  fs = require("fs");

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
        cssName: "sprite.json",
        padding: 2, // default 0px
        cssTemplate: data => {
          let obj = {},
            w = data.spritesheet.width,
            h = data.spritesheet.height,
            url = `./assets/${data.spritesheet.image}`;
          //console.log(data)
          data.sprites.forEach(({ name, offset_x, offset_y, width }) => {
            const r = width / 16;
            obj[name] = `background: url('${url}') no-repeat ${
              offset_x / r
            }px ${offset_y / r}px; background-size: ${w / r}px ${h / r}px;`;
          });
          return JSON.stringify(obj);
        }
      })
    )
    .pipe(dest("dist/assets/"));
}

function jsUglify() {
  return src("src/js/*.js").pipe(uglify()).pipe(dest("dist/assets"));
}

function cssMinify() {
  return src("src/css/*.css")
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

function copyRestFiles(cb) {
  let cssIcons = {};
  try {
    cssIcons = JSON.parse(fs.readFileSync("./dist/assets/sprite.json", "utf8"));
  } catch (e) {
    console.log("Sprite NOT Found.");
  }
  layout(harvest.config, cssIcons, html => {
    fs.writeFileSync("./dist/index.html", html);
    try {
      fs.unlinkSync("./dist/assets/sprite.json");
    } catch (e) {}
    src("./src/favicon.ico").pipe(dest("dist"));
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
  parallel(jsUglify, cssMinify),
  copyRestFiles
);
