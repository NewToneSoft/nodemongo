'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var eslintIfFixed = require('gulp-eslint-if-fixed');

gulp.task('sass', function () {
    return gulp.src('./public/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('lint_n_fix', function() {
    return gulp.src(['public/js/**/*.js','!node_modules/**'])
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(eslintIfFixed( file => (file.base)));
});

gulp.task('watch', function () {
    gulp.watch('./public/sass/**/*.scss', ['sass']);
});

gulp.task('watch_n_fix', function() {
    gulp.watch('public/js/**/*.js', ['lint_n_fix']);
});