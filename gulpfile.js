/*
	dev mode = gulp
	prod mode = gulp finish  	(js, css, html)

*/

// list of js files that libs.js contain are
var js_scripts = [
	//	'./app/libs/jquery/jquery-3.1.1.min.js',
	//	,'./app/libs/bootstrap/js/bootstrap.min.js'

	];
var css_bundles = [
	//'./app/libs/bootstrap/css/bootstrap-grid.min.css'
];



var 	gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify'),
		postcss      = require('gulp-postcss'),
		sourcemaps   = require('gulp-sourcemaps'),
		cssnano		 = require('cssnano'); 
var postcss_plugins = [ 
			require('autoprefixer'),
			require('precss')
		];


var dev_dir = './app/',
	prod_dir = './dist/'

	sass_dir = 'sass/',
	sass_options = '*.sass',
	sass_configured = dev_dir + sass_dir + sass_options,

	css_dir = 'css/',

	js_dir = 'js/';


gulp.task('browser-sync', ['styles', 'scripts'], function() {
		browserSync.init({
				server: {
					baseDir: dev_dir
				},
				notify: false
		});
});

gulp.task('styles', function () {
	return gulp.src( sass_configured )
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '', prefix : ''}))
	.pipe( sourcemaps.init() )
	.pipe(postcss( postcss_plugins ))
	.pipe( sourcemaps.write('.') )
	.pipe(gulp.dest( dev_dir + css_dir ))
	.pipe(browserSync.stream());
});

gulp.task('styles-bundle', function () {
  return gulp.src( css_bundles )
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest(dev_dir + css_dir));
});


gulp.task('scripts', function() {
	return gulp.src(
			js_scripts
		)
		.pipe(concat('libs.js'))
		.pipe(gulp.dest( dev_dir + js_dir ));
});

gulp.task('watch', function () {
	gulp.watch( sass_configured , ['styles']);
	gulp.watch( dev_dir + js_dir + '*.js', ['scripts']);
	gulp.watch( dev_dir + '*.html').on('change', browserSync.reload);
});

gulp.task('default', ['styles-bundle' ,'browser-sync', 'watch']);

gulp.task('finish', ['styles-production', 'script-production', 'mark-production']);
gulp.task('styles-production', function () {
	return gulp.src( dev_dir + css_dir + '*.css' )
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(postcss( postcss_plugins.concat([ cssnano ]) ))
	.pipe(gulp.dest( prod_dir + css_dir ))
});
gulp.task('script-production', function () {
	return gulp.src( dev_dir + js_dir + '*.js' )
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(uglify())
	.pipe(gulp.dest( prod_dir + js_dir ))
});
gulp.task('mark-production', function () {
	return gulp.src( dev_dir + '*.html' )
	.pipe(gulp.dest( prod_dir ))
});

