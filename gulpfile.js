const gulp = require("gulp");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const csso = require("gulp-csso");
const autoprefixer = require("gulp-autoprefixer");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();
const gulpIf = require("gulp-if");
const del = require("del");
const newer = require("gulp-newer");
const svgmin = require("gulp-svgmin");
const svgSprite = require("gulp-svg-sprite");

//const rev = require("gulp-rev");

sass.compiler = require("node-sass");

const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

gulp.task("styles", () => {
  return (
    gulp
      .src("src/styles/main.scss")
      .pipe(gulpIf(isDevelopment, sourcemaps.init()))
      .pipe(sass())
      .pipe(
        autoprefixer({
          browsers: ["last 5 versions"],
          cascade: false
        })
      )
      .on("error", notify.onError("Style Error: <%= error.message %>"))
      .pipe(gulpIf(isDevelopment, sourcemaps.write()))
      .pipe(gulpIf(!isDevelopment, csso()))
      //.pipe(gulpIf(!isDevelopment, rev()))
      .pipe(gulp.dest("build"))
  );
  //.pipe(gulpIf(!isDevelopment, rev.manifest("css.json")))
  //.pipe(gulpIf(!isDevelopment, gulp.dest("manifest")));
});

gulp.task("scripts", () => {
  return (
    gulp
      .src([
        "./node_modules/svg4everybody/dist/svg4everybody.js",
        "src/js/main.js"
      ])
      .pipe(concat("main.js"))
      //.pipe(babel())
      .pipe(gulp.dest("build"))
  );
});

gulp.task("html", () => {
  return gulp.src("src/*.html").pipe(gulp.dest("build"));
});

gulp.task("images", () => {
  return gulp
    .src("src/images/**/*.{png,jpg}", { since: gulp.lastRun("images") })
    .pipe(newer("build/images"))
    .pipe(gulp.dest("build/images"));
});

gulp.task("svg", function() {
  return (
    gulp
      .src("src/images/icons/sprite.svg/*.svg")
      .pipe(
        svgmin({
          js2svg: {
            pretty: true
          }
        })
      )
      .pipe(
        svgSprite({
          shape: {
            spacing: {
              padding: 0,
              box: "content"
            }
          },
          mode: {
            stack: {
              sprite: "../sprite.svg"
            }
          }
        })
      )
      .pipe(gulp.dest("build/images/icons"))
  );
});

gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });
  browserSync.watch("build/**/*.*").on("change", browserSync.reload);
});

gulp.task("watch", () => {
  gulp.watch("src/*.html", gulp.parallel("html"));
  gulp.watch("src/styles/**/*.scss", gulp.series("styles"));
  gulp.watch("src/images/**/*.*", gulp.series("images"));
  gulp.watch("src/js/**/*.js", gulp.series("scripts"));
});

gulp.task("clean", () => del("build"));

gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "svg", "images", "styles", "scripts"),
    gulp.parallel("watch", "serve")
  )
);

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel("html", "svg", "images", "styles", "scripts")
  )
);
