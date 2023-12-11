const gulp = require("gulp");
const fileinclude = require("gulp-file-include");
const server = require("browser-sync").create();
const { watch, series } = require("gulp");
const minifyCSS = require("gulp-minify-css");
const concat = require("gulp-concat");

const paths = {
  scripts: {
    src: "./",
    dest: "./build/",
  },
};

// Reload Server
async function reload() {
  server.reload();
}

// Copy assets after build
async function copyAssets() {
  gulp
    .src(["content/images/**"])
    .pipe(gulp.dest(paths.scripts.dest + "/content/images/"));
  gulp
    .src(["content/js/**"])
    .pipe(gulp.dest(paths.scripts.dest + "/content/js/"));
}

async function styles() {
  gulp
    .src("content/css/*.css")
    .pipe(concat("main.css"))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.scripts.dest + "/content/css"));
}

async function build() {
  await includeHTML();
  await copyAssets();
  await styles();
}

async function includeHTML() {
  return gulp
    .src(["*.html", "!html-sections/*.html", "sitemap.xml", "robots.txt"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(paths.scripts.dest));
}

exports.includeHTML = includeHTML;
exports.build = build;

exports.default = async function () {
  // Init serve files from the build folder
  server.init({
    server: {
      baseDir: paths.scripts.dest,
    },
  });

  build();

  styles();

  // reload at the first time
  reload();

  // Watch task
  watch(["*.html", "content/**/*"], series([build, reload]));
  watch(["html-sections/*.html"], series([build, reload]));
};
