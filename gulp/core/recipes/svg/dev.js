var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');

// utils
var pumped       = require('../../utils/pumped');

// config
var config       = require('../../config/svg');


/**
 * Move Svgs to
 * the built theme
 *
 */
module.exports = function () {
	return gulp.src(config.paths.src)
		.pipe(plumber())

		.pipe(gulp.dest('../assets/'))
		.pipe(notify({
			message: pumped('Svgs Moved'),
			onLast: true
		}))
};
