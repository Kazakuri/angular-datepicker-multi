var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var copy = require('gulp-contrib-copy');

var distFolder = "./dist";

gulp.task('lint-app', function () {
  return gulp.src('./src/angular-datepicker-multi.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('uglify',['lint-app'], function () {
  return gulp.src('./src/angular-datepicker-multi.js')
    .pipe(uglify())
    .pipe(rename('angular-datepicker-multi.min.js'))
    .pipe(gulp.dest(distFolder));
});

gulp.task('copy', [], function () {
  return gulp.src('./src/angular-datepicker-multi.js')
    .pipe(copy())
    .pipe(gulp.dest(distFolder));
});

gulp.task('styles', [], function () {
  return gulp.src('./src/angular-datepicker-multi.scss')
    .pipe(sass())
    .pipe(prefix({cascade: true}))
    .pipe(cleanCSS())
    .pipe(gulp.dest(distFolder));
});

gulp.task('default', ['uglify', 'styles', 'copy']);
