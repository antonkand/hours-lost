'use strict';

var gulp = require('gulp');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
// css
var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var prefix = require('gulp-autoprefixer');
// img
var imagemin = require('gulp-imagemin');
var optipng = require('imagemin-optipng');
var jpegtran = require('imagemin-jpegtran');
var svgo = require('imagemin-svgo');
// angular
var annotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var hours_lost_folder = './frontend/src/js/angular/';

// File paths
var paths = {
    sass: './frontend/src/scss',
    css: './public/css',
    original_img: './frontend/src/img/**/*.*',
    minified_img: './public/img',
    // add your angular scripts in the order you want them,
    // globbing isn't used, you need to be specific
    angular_src: [
      hours_lost_folder + 'app/HoursLostApp.js',
      hours_lost_folder + 'components/OAuth2Component/OAuth2Module.js'
    ],
    templates: hours_lost_folder + '**/*.html',
    templates_dist: './public/js/angulartemplates',
    script_dist: './public/js',
    script_src: './frontend/src/js/vanilla/**/*.js'
};

// Tasks
gulp.task('compass', function() {
     gulp.src(paths.sass + '/*.scss')
        //.pipe(watch(paths.sass + '/*.scss'))
        .pipe(compass({
            css: paths.css,
            sass: paths.sass,
            comments: false
        }))
        .pipe(prefix('last 6 versions', '> 1%', 'ie 9'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.css));
      //.pipe(livereload());
});

gulp.task('img', function () {
    return gulp.src(paths.original_img)
      .pipe(imagemin ({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [optipng(), jpegtran(), svgo()]
        }))
        .pipe(gulp.dest(paths.minified_img));
});

gulp.task('angular', function () {
    return gulp.src(paths.angular_src)
      //.pipe(watch(paths.angular_src))
      .pipe(annotate())
        .pipe(concat('angularbundle.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(paths.script_dist));
      //.pipe(livereload());
});

gulp.task('scripts', function () {
    return gulp.src(paths.script_src)
      //.pipe(watch(paths.script_src))
      .pipe(concat('jsbundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.script_dist));
    //.pipe(livereload());
});

gulp.task('templates', function () {
    return gulp.src(paths.templates)
      //.pipe(watch(paths.templates))
      .pipe(gulp.dest(paths.templates_dist));
    //.pipe(livereload());
});

gulp.task('watch', function () {
    gulp.watch(paths.sass + '/imports/**/*.scss', ['compass']);
    gulp.watch(paths.sass + '/*.scss', ['compass']);
    gulp.watch(paths.original_img + '/**/*.*', ['img']);
    gulp.watch(paths.angular_src, ['angular']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.script_src, ['scripts']);
});

gulp.task('default', ['compass', 'img', 'angular', 'templates', 'scripts', 'watch']);
