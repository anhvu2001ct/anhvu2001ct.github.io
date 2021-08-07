const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const rename = require("gulp-rename");
const prefix = require('autoprefixer');
const browserSync = require('browser-sync').create();

const path_scss = "./src/scss/**/*.scss";

function styling() {
  const plugins = [prefix(), cssnano()];
  return gulp.src(path_scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./src/css"))
    .pipe(postcss(plugins))
    .pipe(rename(path => {path.basename += ".min"}))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {baseDir: "dist"}
  });
  gulp.watch(path_scss, styling);
  gulp.watch(["dist/**/*.html", "dist/**/*.js"]).on("change", browserSync.reload);
}

exports.style = styling;
exports.watch = watch;