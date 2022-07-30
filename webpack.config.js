/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const path                 = require('path'),
	  MiniCSSExtractPlugin = require('mini-css-extract-plugin'),
	  CSSOWebpackPlugin    = require('csso-webpack-plugin').default,
	  webpack              = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const SRC_JS_DIR             = path.resolve(__dirname, 'src/js'),
	  SRC_CSS_DIR            = path.resolve(__dirname, 'src/css'),
	  SRC_ADDONS_DIR         = path.resolve(__dirname, 'src/addons'),
	  BUILD_DIR              = path.resolve(__dirname, 'dist'),
	  BUILD_CSS_DIR          = path.resolve(__dirname, 'dist/css'),
	  BUILD_JS_DIR           = path.resolve(__dirname, 'dist/js'),
	  BUILD_ASSETS_DIR       = path.resolve(__dirname, 'dist/assets'),
	  BUILD_IMG_ASSETS_DIR   = path.resolve(__dirname, 'dist/assets/img'),
	  BUILD_FONTS_ASSETS_DIR = path.resolve(__dirname, 'dist/assets/fonts');

function recursiveIssuer(m) {
	if(m.issuer)
		return recursiveIssuer(m.issuer);
	else if(m.name)
		return m.name;
	else
		return false;
}

class Without {
	constructor(patterns) {
		this.patterns = patterns;
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync("MiniCssExtractPluginCleanup", (compilation, callback) => {
			Object.keys(compilation.assets)
				  .filter(asset => {
					  let match = false,
						  i     = this.patterns.length;
					  while(i--) {
						  if(this.patterns[i].test(asset)) {
							  match = true;
						  }
					  }
					  return match;
				  }).forEach(asset => {
				delete compilation.assets[asset];
			});

			callback();
		});
	}
}

const config = {
	mode: "production", // "production" | "development" | "none"
	target: 'web',
	//devtool: "source-map",
	resolve: {
		extensions: [".js", ".css", ".scss", ".less"],
		/*alias: {
			// fix every jQuery to our direct jQuery dependency. Shariff 1.24.1 brings its own jQuery, and it would be included twice without this alias.
			'jquery': nodeExternals() + '/jquery/ist/jquery.js', //./node_modules/jquery/dist/jquery.js
		},*/
	},
	externals: {
		jquery: 'jQuery',
	}, // in order to ignore all modules in node_modules folder
	/*externals: [
		nodeExternals({
			importType: 'umd'
		})
	],
	externalsPresets: {
		node: true // in order to ignore built-in modules like path, fs, etc.
	},*/
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.(scss|less|css)$/i,
				use: [MiniCSSExtractPlugin.loader, "css-loader"]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				//type: "asset/resource",
				use: [
					{
						options: {
							name: "[name].[ext]",
							// name: '[hash:8].[ext]',
							outputPath: '../assets/img'
						},
						loader: "file-loader"
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				//type: "asset/resource",
				use: [
					{
						options: {
							name: '[hash].[ext]',
							outputPath: '../assets/fonts'
						},
						loader: "file-loader"
					}
				]
			},
		],
	},
	plugins: [
		new MiniCSSExtractPlugin({
			filename: "SGNUIKit.bundle.css",
			chunkFilename: "[id].min.css",
			ignoreOrder: false
		}),
		new CSSOWebpackPlugin(),
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		}),
		/*new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery',
			jquery: 'jquery'
		}),*/
		//new Without([/\.js$/]), // just give a list with regex patterns that should be excluded
	],
};

const jsConfig = (env) => {
	return Object.assign({}, config, {
		name: "js",
		entry: {
			'SGNUIKit.loader': './src/js/SGNUIKit.loader.js',
			'SGNUIKit.bundle': `./src/js/SGNUIKit-${env.flavor}.js`
			/*'SGNUIKit.bundle': [
				'./src/js/i18n/SGNi18n.js',
				'./src/js/helpers/helpers.js',
				'./src/css/fonts/FontAwesome6Free/js/all.min.js',
				'./src/css/fonts/FontAwesome6Free/js/v4-shims.min.js',
				'./src/js/addons/addons.js',
				'./src/addons/addons.js',
				'./src/js/components/components.js',
			]*/
		},
		output: {
			path: BUILD_JS_DIR,
			filename: '[name].js',
			libraryTarget: 'umd',
			library: {
				type: 'umd'
			}
		},
		optimization: {
			minimize: true,
			mergeDuplicateChunks: false,
			moduleIds: 'natural',
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						keep_classnames: true,
						keep_fnames: true
					}
				})
			]
		},
	});
}

const cssConfig = (env) => {
	return Object.assign({}, config, {
		name: "css",
		entry: {
			css: `./src/css/SGNUIKit-${env.flavor}.css`
		},
		output: {
			path: BUILD_CSS_DIR,
			sourceMapFilename: "SGNUIKit.map.css"
		},
		optimization: {
			minimize: true,
			moduleIds: 'natural',
			splitChunks: {
				cacheGroups: {
					css: {
						name: 'css',
						test: (m, c, entry = 'css') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
						chunks: "all",
						enforce: true
					}
				}
			},
			removeEmptyChunks: true
		}
	});
}

module.exports = [
	cssConfig,
	jsConfig
];

