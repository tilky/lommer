var assets = require('./common').paths.assets;

/**
 * Svg Building
 * Configuration
 * Object
 *
 * @type {{}}
 */
module.exports = {
	paths: {
		watch: [
			assets.src + '/svg/**/*.svg',
			'!' + assets.src + '/svg/sprite/**/*.svg'
		],
		src: [
			assets.src + '/svg/**/*.svg',
			'!' + assets.src + '/svg/sprite/**/*.svg'
		],
		dest: assets.dest,
		clean: [
			assets.dest + '/svg/**/*.svg',
			'!' + assets.dest + '/svg/sprite-*.svg'
		]
	},

	options: {
		svgmin: {multipass: true}
	}

}