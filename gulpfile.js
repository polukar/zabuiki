var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	pug = require('gulp-pug'),
	cache = require('gulp-cache'),
	del = require('del');

gulp.task('sass', function () {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass_page', function () {
	return gulp.src('src/pug/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(concat('_content.scss'))
		.pipe(gulp.dest('src/sass/template'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('views', function buildHTML() {
	return gulp.src('src/pug/*.pug')
		.pipe(pug({
			pretty: true,
		})).pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('scripts', ['delJs'], function () {
	return gulp.src([
		'src/libs/jquery/dist/jquery.js',
		// 'src/libs/mask/tmask.js',
		// 'src/libs/mask/mask.js',
		'src/libs/datepicker.js',
		// 'src/libs/slick.js',
		// 'src/libs/scrolloverflow.js',
		// 'src/libs/fullpage.js',
		// 'src/libs/fancybox.js',
		// 'src/libs/scrollbar.js',
		'src/libs/wnumb.js',
		'src/libs/nouislider.js'
	])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/js'))
});

gulp.task('mainjs', ['scripts'], function () {
	return gulp.src([
		'src/js/template/*.js'
	])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('build/js'));
});

gulp.task('css-libs', ['sass'], function () {
	return gulp.src('build/css/main.css')
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build/css'))
});



gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false
	});
});

gulp.task('del', function () {
	return del.sync('src/js/main.js');
});
gulp.task('delJs', function () {
	return del.sync('build/js/libs.min.js');
});



gulp.task('cache', function () {
	return cache.clearAll();
});

gulp.task('img', function () {
	return gulp.src('src/images/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }]
		})))
		.pipe(gulp.dest('build/images/'));
});

gulp.task('docs', function () {
	return gulp.src('src/docs/**/*')
		.pipe(gulp.dest('build/docs/'));
});

gulp.task('font', function () {
	return gulp.src([
		'src/fonts/*.*'
	]).pipe(gulp.dest('build/fonts'));
});

gulp.task('csv', function () {
	return gulp.src([
		'src/csv/*.*'
	]).pipe(gulp.dest('build/csv'));
});

gulp.task('delWatch', function () {
	return del.sync('build');
});

gulp.task('watch', ['delWatch', 'browser-sync', 'css-libs', 'csv', 'img', 'views', 'mainjs', 'font', 'docs'], function () {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/pug/**/*.scss', ['sass_page']);
	gulp.watch('src/**/*.html', browserSync.reload);
	gulp.watch('src/pug/**/*.pug', ['views'], browserSync.reload);
	gulp.watch('src/js/**/*.js', ['mainjs'], browserSync.reload);
	gulp.watch('src/images/**/*', ['img'], browserSync.reload);
});

gulp.task('build', ['delWatch', 'browser-sync', 'css-libs', 'csv', 'img', 'views', 'mainjs', 'font', 'docs']);
