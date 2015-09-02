/**
 * Created by ephi on 02/09/15.
 */
'use strict';

var gulp = require('gulp'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('minify', function () {
    return gulp.src('src/shadowDirective.js')
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename(function (path) {
            if(path.extname === '.js') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copySource', function () {
    return gulp.src('src/shadowDirective.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['minify', 'copySource']);
gulp.task('default', ['build']);