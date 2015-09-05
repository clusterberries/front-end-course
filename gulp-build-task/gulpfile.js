var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var useref = require('gulp-useref');

gulp.task('lint', function() {
  return gulp.src('./js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
/*
gulp.task('compress', function() {
  return gulp.src('./js/ ** / *.js')
  return gulp.src(['./bower_components/jquery/dist/jquery.js',
  		'./bower_components/underscore/underscore.js',
  		'./bower_components/backbone/backbone.js',
  		'./bower_components/backbone.localstorage/backbone.localStorage.js',
  		'./js/models/*.js', 
  		'./js/collections/*.js', 
  		'./js/routers/*.js', 
  		'./js/views/*.js',
  		'./js/*.js'])
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/'));
});


gulp.task('css', function () {
    gulp.src(['node_modules/todomvc-common/*.css', 'node_modules/todomvc-app-css/*.css'])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
//       .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/'));
});*/

gulp.task('html', function () {
    var assets = useref.assets();

    return gulp.src('index.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['lint', 'html']);