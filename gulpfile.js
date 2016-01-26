'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell')
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
	styles: {
		src: 'scss/**/*.scss',
		dest: 'css/'
	}
};

gulp.task('default', ['php', 'scss', 'scss_watch']);

gulp.task('php', shell.task('php -S localhost:8000'));

gulp.task('scss_watch', function() {
	gulp.watch(paths.styles.src, ['scss']);
});

gulp.task('scss', function() {
	gulp.src(paths.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.styles.dest))
});