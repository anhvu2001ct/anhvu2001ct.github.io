const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const prefix = require('autoprefixer');
const browserSync = require('browser-sync').create();

const project = "WED201c";
const srcPath = `src/${project}/`;
const distPath = `dist/${project}/`;

function allFiles(dir, ext, extFolder=true) {
  if (!extFolder) return `${dir}**/*.${ext}`;
  return `${dir}${ext}/**/*.${ext}`
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

function watch() {
  browserSync.init({
    server: {baseDir: distPath}
  });
  gulp.watch(allFiles(srcPath, "scss"), styling);
  gulp.watch([allFiles(distPath, "html", false), allFiles(distPath, "js")]).on("change", browserSync.reload);
}

exports.style = styling;
exports.watch = watch;