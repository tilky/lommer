var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minify       = require('gulp-cssnano');
var notify       = require('gulp-notify');
var postcss      = require('gulp-postcss');
var pxtorem      = require('postcss-pxtorem');
var atImport 		 = require("postcss-import")

// utils
var pumped       = require('../../utils/pumped');

// config
var config       = require('../../config/styles');


/**
 * Compile SCSS to CSS
 * and Minify
 *
 */
module.exports = function () {
	return gulp.src(config.paths.src)
		.pipe(plumber())

		.pipe(sass.sync(config.options.sass).on('error', sass.logError))
		.pipe(autoprefixer(config.options.autoprefixer))
		.pipe(postcss([pxtorem(config.options.pxtorem), atImport()]))

		.pipe(minify(config.options.minify))

		.pipe(gulp.dest(config.paths.dest))
		.pipe(notify({
			message: pumped('SCSS Compiled & Minified.'),
			onLast: true
		}));
};