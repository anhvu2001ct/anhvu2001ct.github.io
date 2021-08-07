const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const prefix = require('autoprefixer');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

const project = "WED201c";
const srcPath = `src/${project}/`;
const distPath = (project == "index") ? "dist/" : `project/${project}/`;

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
  const plugins = [prefix(), cssnano()];
  return gulp.src(allFiles(srcPath, "scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(srcPath+"css"))
    .pipe(postcss(plugins))
    .pipe(rename(path => {path.basename += ".min"}))
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