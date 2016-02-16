'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util')
var phpConnect = require('gulp-connect-php');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jsHint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

var paths = {
	styles: {
		src: 'scss/**/*.scss',
		dest: 'build/css/'
	},
	scripts: {
		src: 'js/**/*.js',
		dest: 'build/js/'
	},
	images: {
		src: 'images/**/*.*',
		dest: 'build/images/'
	}
};

var liveReloadFiles = [
	'index.php',
	'build/css/**/*.css',
	'build/js/**/*.js',
	'build/images/**/*.*'
];

gulp.task('default', ['serve', 'watch']);

gulp.task('serve', ['connect', 'browser-sync']);

gulp.task('watch', function() {
	gulp.watch(paths.styles.src, ['scss']);
	gulp.watch(paths.scripts.src, ['jshint', 'build-js']);
	gulp.watch(paths.images.src, ['minify-images']);
});

// Start the server
gulp.task('connect', function() {
	// PHP server (will be proxied)
	phpConnect.server({
		base: './',
		hostname: '0.0.0.0',
		port: 6000
	});

	// Another server for phpMyAdmin, since connect-php doesn't support multiple bases
	phpConnect.server({
		base: 'phpmyadmin',
		open: false,
		hostname: '0.0.0.0',
		port: 1337
	});
});

gulp.task('browser-sync', function() {
	browserSync({
		files: liveReloadFiles,
		proxy: 'localhost:6000',
    	port: 8080,
    	open: false,
    	ui: {
    		port: 3001,
    		weinre: {
    			port: 8000
    		}
    	}
	}, function (err, bs) {
		if (err)
			console.log(err);
		else
			console.log('BrowserSync is ready.');
	});
});

// Build all
gulp.task('build', ['scss', 'build-js', 'minify-images']);

// scss stuff
gulp.task('scss', function() {
	gulp.src(paths.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// JS stuff
gulp.task('jshint', function() {
	gulp.src(paths.scripts.src)
		.pipe(jsHint())
		.pipe(jsHint.reporter('jshint-stylish'));
});

gulp.task('build-js', function() {
	gulp.src(paths.scripts.src)
		.pipe(concat('script.js'))
		// Only uglify if gulp is ran with '--type production'
		.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Images
gulp.task('minify-images', function () {
	gulp.src(paths.images.src)
		.pipe(imagemin({
			progressive: true
		}))
		.pipe(gulp.dest(paths.images.dest));
});
