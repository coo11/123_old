const fs = require("fs"),
  yaml = require("js-yaml");

module.exports = {
  init() {
    try {
      this.config = yaml.load(fs.readFileSync("config.yml", "utf8"));
      //console.log(this.config);
      this.src = new Set(
        this.config.bookmark.filter(i => i.favicon).map(i => i.favicon)
      );
    } catch (e) {
      console.log(e);
    }
  },
  pick({ png = true, pngToUse = false }) {
    let files = fs.readdirSync("./src/img/").filter(i => {
      return (
        fs.statSync(`./src/img/${i}`).isFile() &&
        i.toLowerCase().endsWith(".png") === png
      );
    });
    if (png && pngToUse) {
      files = files.filter(i => this.src.has(i));
    }
    return files;
  }
};
