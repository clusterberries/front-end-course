var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

gulp.task('lint', function() {
  return gulp.src('./js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('compress', function() {
  return gulp.src('./js/**/*.js')
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/'));
});


gulp.task('default', function () {
    gulp.src(['node_modules/todomvc-common/*.css', 'node_modules/todomvc-app-css/*.css'])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/'));
});