var gulp         = require('gulp');
var filter       = require('gulp-filter');
var plumber      = require('gulp-plumber');
// var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var notify       = require('gulp-notify');
var postcss      = require('gulp-postcss');
var pxtorem      = require('postcss-pxtorem');
var atImport 		 = require("postcss-import");
var scss 			 = require('postcss-scss');
var ext_replace = require('gulp-ext-replace');

// utils
var pumped       = require('../../utils/pumped');

// config
var config       = require('../../config/styles.js');

/**
 * Merge CSS files
 *
 */
module.exports = function (cb) {
	// var filterCSS = filter('**/*.css', { restore: true });

	// return gulp.src('../assets_src/scss/main.scss.liquid')
    // .pipe( postcss( [ atImport() ] ).process( scss, { syntax: syntax } ).then( function ( result ) { result.content } ) )
    // .pipe( postcss([ atImport() ], { syntax: scss } ) )
    // .pipe(gulp.dest('../assets'))
    
    // .pipe(autoprefixer(config.options.autoprefixer))
   // .pipe(notify({
			// message: pumped('SCSS Compiled.'),
			// onLast: true
   // }));
	
	return gulp.src(config.paths.src)
		.pipe(plumber())

		// .pipe(sourcemaps.init())
		.pipe(sass.sync(config.options.sass).on('error', sass.logError))
		.pipe(autoprefixer(config.options.autoprefixer))
    .pipe(postcss([atImport()]))
		.pipe(ext_replace('.css.liquid', '.scss.css'))

		.pipe(gulp.dest(config.paths.dest))

		// .pipe(filterCSS) // sourcemaps adds `.map` files to the gulp
		                 // stream, but we only want to trigger
		                 // Browser-sync on CSS files so we need to
		                 // filter the stream for the css files
		// .pipe(filterCSS.restore)

		.pipe(notify({
			message: pumped('SCSS Compiled.'),
			onLast: true
    }));
};
