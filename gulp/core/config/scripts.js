var path = require('path');
var webpack = require('webpack-stream').webpack;
var BowerWebpackPlugin = require('bower-webpack-plugin');

// config
var assets = require('./common').paths.assets;

/**
 * Script Building
 * Configuration
 * Object
 *
 * @type {{}}
 */
module.exports = {
	paths: {
		watch: assets.src + '/js/**/*.js',
		src: [
			assets.src + '/js/*.js',
			assets.src + '/js/*.js.liquid',
			'!' + assets.src + '/js/**/_*'
		],
		dest: assets.dest,
		clean: assets.dest + '/*.{js,js.liquid}'
	},

	options: {
		webpack: {

			// merged with defaults
			// for :watch task
			watch: {
				cache: true,
				watch: true,
				devtool: 'eval',
				keepalive: true
			},


			// merged with defaults
			// for :dev task
			dev: {
				devtool: 'eval'
			},


			// merged with defaults
			// for :prod task
			prod: {
				plugins: [
					new webpack.optimize.DedupePlugin(),
					new webpack.optimize.OccurenceOrderPlugin(true),
					new webpack.optimize.UglifyJsPlugin({
						sourceMap: false,
						comments: false,
						screw_ie8: true,
						compress: {
							drop_console: true,
							pure_getters: true,
							unsafe: false,
							unsafe_comps: false,
							screw_ie8: true,
							warnings: false
						}
					})
				],
				eslint: {
					failOnError: true,
					failOnWarning: false
				}
			},

			defaults: {
				resolve: {
					extensions: ['', '.liquid', '.js', '.jsx']
				},
				output: {
					chunkFilename: 'chunk-[name].js'
				},
				stats: {
					colors: true
				},
				module: {
					// preLoaders: [
					// 	{
					// 		test: /\.jsx?$/,
					// 		exclude: [
					// 			/node_modules/,
					// 			/bower_components/,
					// 			/vendor/,
					// 			/polyfills/
					// 		],
					// 		loader: 'eslint'
					// 	}
					// ],
					loaders: [
						{
							test: /\.jsx?$/,
							exclude: [
								/node_modules/,
								/bower_components/,
								/polyfills/
							],
							loader: 'babel',
							query: {
								presets: ['es2015', 'stage-2'],
								plugins: ['transform-runtime']
							}
						}
					]
				},
				plugins: [
					new BowerWebpackPlugin({
						includes: /\.jsx?$/
					}),
					new webpack.ProvidePlugin({
	        	'$': 'jquery',
	          'jQuery': 'jquery',
	          'window.jQuery': 'jquery'
	        })
				],
				eslint: {
					emitError: true,
					emitWarning: true,
					configFile: path.resolve('./.eslintrc')
				}
			}

		}
	}
};
