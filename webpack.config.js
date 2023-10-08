/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */


const MiniCSSExtractPlugin      = require('mini-css-extract-plugin'),
      CSSUrlRelativePlugin      = require('css-url-relative-plugin'),
      FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries"),
      webpack                   = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const {constants, functions, terserOptions, licenseOptions} = require("./build/config");
const {args, buildFlavor, pluginName} = constants;
const {copyRecursiveSync, fs, path, hasha} = functions;
const SRC_JS_DIR             = path.resolve(__dirname, 'src/js'),
      SRC_CSS_DIR            = path.resolve(__dirname, 'src/css'),
      SRC_ADDONS_DIR         = path.resolve(__dirname, 'src/addons'),
      BUILD_DIR              = path.resolve(__dirname, 'dist'),
      BUILD_CSS_DIR          = path.resolve(__dirname, 'dist/css'),
      BUILD_JS_DIR           = path.resolve(__dirname, 'dist/js'),
      BUILD_ASSETS_DIR       = path.resolve(__dirname, 'dist/assets'),
      BUILD_IMG_ASSETS_DIR   = path.resolve(__dirname, 'dist/assets/img'),
      BUILD_FONTS_ASSETS_DIR = path.resolve(__dirname, 'dist/assets/fonts');

const debugBuild = (args.mode === 'development') || false;


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
			Object.keys(compilation.assets).filter(asset => {
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

if(debugBuild) {
	console.info("Building SGNUIKit for 'Development' environment...");
} else {
	console.info("Building SGNUIKit for 'Production' environment...");
}

const config = {
	mode: (!debugBuild) ? "production" : "development", // "production" | "development" | "none"
	target: ['web'],
	//devtool: "source-map",
	resolve: {
		extensions: [".js", ".css", ".scss", ".less"],
	},
	externals: {
		'CKSource': 'CKSource'
	}, // in order to ignore all modules in node_modules folder

	module: {
		rules: [
			/*{
			 test: /\.(js)$/,
			 exclude: /node_modules/,
			 use: ['babel-loader'],
			 },*/
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
				generator: {
					filename: '../assets/img/[name][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)(\?[a-z0-9=.]+)?$/i,
				type: "asset/resource",
				generator: {
					filename: '../assets/fonts/[hash][ext][query]',
				},
			},
			{
				test: /\.(scss|less|css)$/i,
				use: [
					{
						loader: MiniCSSExtractPlugin.loader,
						options: {
							//publicPath: '../assets/',
						}
					},
					{
						loader: "css-loader",
						options: {
							url: true,
							sourceMap: true,
							importLoaders: 2,
							modules: false,
							esModule: false,
						}
					},
				]
			},
		],
	},
	plugins: [
		new FixStyleOnlyEntriesPlugin(),
		new MiniCSSExtractPlugin({
			filename: "SGNUIKit.bundle.css",
			chunkFilename: "[id].min.css",
			ignoreOrder: false
		}),
		new CSSUrlRelativePlugin({
			root: '../assets/'
		}),
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		}),
		/*new webpack.ProvidePlugin({
		 CKSource: 'CKSource'
		 }),*/
		//new Without([/\.js$/]), // just give a list with regex patterns that should be excluded
	],
	stats: {
		warnings: false
	}
};

const jsConfig = (env) => {
	return Object.assign({}, config, {
		name: "js",
		entry: {
			'SGNUIKit.bundle': `./src/js/${env.flavor}.js`
		},
		output: {
			path: BUILD_JS_DIR,
			filename: '[name].js',
			libraryTarget: 'umd',
			library: {
				type: 'module',
			},
			libraryExport: 'default',
			module: true
		},
		optimization: {
			minimize: (debugBuild),
			mergeDuplicateChunks: true,
			concatenateModules: true,
			usedExports: true,
			moduleIds: 'named',
			runtimeChunk: true,
			/*minimizer: [
			 new TerserPlugin({
			 sourceMap: true,
			 terserOptions: {
			 output: {
			 // Preserve add-on license comments.
			 comments: /^!/
			 },
			 keep_classnames: true,
			 keep_fnames: true
			 },
			 extractComments: false
			 })
			 ]*/
		},
		experiments: {
			outputModule: true
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
			publicPath: '',
			sourceMapFilename: "SGNUIKit.map.css",
			/*assetModuleFilename: (pathData) => {
			 const dir = (pathData.extension)
			 //return `${filepath}/[name].[hash][ext][query]`;
			 },*/
		},
		optimization: {
			minimize: (!debugBuild),
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
	//cssConfig,
	jsConfig
];

