// utils
var deepMerge = require('../utils/deepMerge');

// config
// var overrides = require('../../config/sprite');
var assets = require('./common').paths.assets;

/**
 * Svg Sprite Building
 * Configuration
 * Object
 *
 * @type {{}}
 */
module.exports = {
	paths: {
		watch: assets.src + '/svg/sprite/**/*.svg',
		src:   assets.src + '/svg/sprite',
		dest:  './theme/snippets',
		clean: './theme/snippets/sprite-*.svg.liquid'
	},

	options: {
		svgmin: {
			multipass: true,
			plugins: [
				{cleanupIDs: false},
				{removeAttrs: {attrs: 'fill'}}
			]
		},
		svgSprite: function (name) {
			return {
				mode: {
					inline: true,
					symbol: {
						dest: '.',
						sprite: 'sprite-' + name + '.svg.liquid'
					}
				},
				shape: {
					id: {
						generator: 'icon-%s'
					}
				}
			};
		}
	}

}
