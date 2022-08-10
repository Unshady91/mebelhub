const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const pug = require("gulp-pug");
const rename = require("gulp-rename");

// pug
const pugRender = () => {
  return gulp.src('source/pugFiles/main.pug')
  .pipe(pug({pretty: true}))
  .pipe(rename('index.html'))
  .pipe(gulp.dest('source/'))
  .pipe(sync.stream());
}

exports.pugRender = pugRender;

// Styles
const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/**/*.pug", gulp.series(pugRender));
}

exports.default = gulp.series(
  styles, pugRender, server, watcher
);
