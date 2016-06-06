var assets = require('./common').paths.assets;

/**
 * Style Building
 * Configuration
 * Object
 *
 * @type {{}}
 */
module.exports = {
	paths: {
		watch: [
			assets.src + '/scss/**/*.scss',
			assets.src + '/scss/**/*.scss.liquid',
			'!' + assets.src + '/scss/**/*_tmp\\d+.scss'
		],
		src:   [
			assets.src + '/scss/main.scss.liquid'
		],
		dest:  assets.dest,
		clean: assets.dest + 'main.scss.liquid'
	},

	options: {
		sass: {},
		autoprefixer: {
			browsers: [
				'last 2 version',
				'ie >= 9'
			]
		},
		minify: {
			autoprefixer: false,
			discardComments: { removeAll: true }
		},
    pxtorem: {
      rootValue: 18,
      unitPrecision: 5,
      propWhiteList: [],
      selectorBlackList: [/^html$/],
      replace: false,
      mediaQuery: true
    }
	}
}