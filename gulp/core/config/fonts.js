// utils
var deepMerge = require('../utils/deepMerge');

// config
var assets = require('./common').paths.assets;

/**
 * Font Building
 * Configuration
 * Object
 *
 * @type {{}}
 */
module.exports = {
	paths: {
		watch: assets.src  + '/fonts/**/*.{eot,otf,ttf,woff,woff2,svg}',
		src:   assets.src  + '/fonts/**/*.{eot,otf,ttf,woff,woff2,svg}',
		dest:  assets.dest,
		clean: assets.dest + '/*.{eot,otf,ttf,woff,woff2,svg}'
	}
};