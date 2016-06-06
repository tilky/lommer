var gutil = require('gulp-util');
var path  = require('path');

/**
 * Validate the options passed
 * into the project's package.json
 *
 * @param project
 */
module.exports = function (project) {
	var validationFailed = false;


	/**
	 * Safely handle missing
	 * project name or
	 * project prettyName
	 */
	if (!project.name) {
		validationFailed = true;

		gutil.log('Project Config Error:', gutil.colors.red('The \"name\" option in your project.config.js configuration cannot be empty'));
	}
	if (!project.prettyName) {
		validationFailed = true;

		gutil.log('Project Config Error:', gutil.colors.red('The \"prettyName\" option in your project.config.js configuration cannot be empty'));
	}


  /**
	 * Exit the gulp process
	 * if validation failed
	 */
	if (validationFailed) {
		// if validation has failed
		// do not continue further
		process.exit(1);
	}
};