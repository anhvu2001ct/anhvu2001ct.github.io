const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const prefix = require('autoprefixer');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

const project = "index";
const srcPath = `src/${project}/`;
const distPath = "dist/" + (project == "index" ? "index/" : `project/${project}/`);
console.log(distPath)

function allFiles(dir, ext, extFolder=true) {
  if (!extFolder) return `${dir}**/*.${ext}`;
  return `${dir}${ext}/**/*.${ext}`
}

function createPages() {
  return gulp.src([
      allFiles(srcPath, "html"),
      allFiles(`!${srcPath}html/components`, "html", false)
  ]).pipe(fileinclude())
    .pipe(gulp.dest(distPath));
}

function styling() {
  return gulp.src(allFiles(srcPath, "scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([prefix()]))
    .pipe(gulp.dest(srcPath+"css"))
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest(distPath+"css"))
    .pipe(browserSync.stream());
}

async function create() {
  require('del')(distPath+"**");
  createPages();
  styling();
}

function watch() {
  create();
  browserSync.init({
    server: {baseDir: distPath}
  });
  gulp.watch(allFiles(srcPath, "scss"), styling);
  gulp.watch([allFiles(srcPath, "html"), allFiles(srcPath, "js")]).on("change", () => {
    createPages();
    browserSync.reload();
  });
}

exports.markup = createPages;
exports.style = styling;
exports.create = create;
exports.watch = watch;