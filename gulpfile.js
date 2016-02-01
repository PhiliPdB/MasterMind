'use strict';

var gulp = require('gulp');
var phpConnect = require('gulp-connect-php');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
	styles: {
		src: 'scss/**/*.scss',
		dest: 'css/'
	}
};

var liveReloadFiles = [
	'index.php',
	'css/**/*.css',
	'js/**/*.js'
];

gulp.task('default', ['serve', 'scss', 'scss_watch']);
gulp.task('serve', ['connect', 'browser-sync']);

// server config
gulp.task('connect', function() {
	// PHP server (will be proxied)
	phpConnect.server({
		base: './',
		hostname: '127.0.0.1',
		port: 8000
	});

	// Another server for phpMyAdmin, since connect-php doesn't support multiple bases
	phpConnect.server({
		base: 'phpmyadmin',
		open: false,
		hostname: '127.0.0.1',
		port: 1337
	});
});

gulp.task('browser-sync', function() {
	browserSync({
		files: liveReloadFiles,
		proxy: '127.0.0.1:8000',
    	port: 8080,
    	open: false
	}, function (err, bs) {
		if (err)
			console.log(err);
		else
			console.log('BrowserSync is ready.');
	});
});

// scss stuff
gulp.task('scss_watch', function() {
	gulp.watch(paths.styles.src, ['scss']);
});

gulp.task('scss', function() {
	gulp.src(paths.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.reload({
			stream: true
		}));
});
