var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
	styles: {
		src: 'scss/**/*.scss',
		dest: 'css/'
	}
};

gulp.task('default', ['scss', 'scss_watch']);

gulp.task('scss_watch', function() {
	gulp.watch(paths.styles.src, ['scss']);
});

gulp.task('scss', function() {
	gulp.src(paths.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.styles.dest))
});