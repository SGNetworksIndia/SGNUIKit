/*
 * Copyright (c) 2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const commonjs      = require("@rollup/plugin-commonjs"),
      inject        = require('@rollup/plugin-inject'),
      nodeResolve   = require("@rollup/plugin-node-resolve"),
      terser        = require("@rollup/plugin-terser"),
      postcss       = require("rollup-plugin-postcss"),
      progress      = require("rollup-plugin-progress"),
      postcssImport = require("postcss-import"),
      postcssNested = require("postcss-nested"),
      autoprefixer  = require("autoprefixer"),
      postcssUrl    = require("postcss-url"),
      license       = require('rollup-plugin-license');
const {constants, functions, terserOptions, licenseOptions} = require("./build/config");
const {createVersionInfo, createLoader} = functions;

const {args, buildFlavor, pluginName, BUILD_ASSETS_DIR, BUILD_CSS_DIR, BUILD_FONTS_ASSETS_DIR, BUILD_IMG_ASSETS_DIR, BUILD_JS_DIR, FONTS_RX, IMAGES_RX, SRC_CSS_DIR, SRC_JS_DIR} = constants;
const {copyRecursiveSync, fs, path, hasha} = functions;

const inputCSS = args.input || `${SRC_CSS_DIR}/${buildFlavor}.css`,
      inputJS  = args.input || `${SRC_JS_DIR}/${buildFlavor}.js`;
const bundleName = `${pluginName}Component`,
      loaderName = `${pluginName}Loader`;

const jsConfig = {
	input: inputJS,
	output: [
		{
			file: `${BUILD_JS_DIR}/${pluginName}.umd.js`,
			format: "umd",
			name: bundleName,
			sourcemap: true,
			assetFileNames: 'assets/[name]-[hash][extname]',
			manualChunks: {},
			exports: 'default',
			preserveModules: false,
			generatedCode: {preset: 'es2015', arrowFunctions: true},
			externalLiveBindings: false,
			freeze: false,
			noConflict: true
		},
		{file: `${BUILD_JS_DIR}/${pluginName}.esm.js`, format: "esm", name: bundleName, sourcemap: true, inlineDynamicImports: true, preserveModules: false, generatedCode: {preset: 'es2015', arrowFunctions: true}, externalLiveBindings: false, freeze: false, noConflict: true},
	],
	external: [
		'jQuery'
	],
	treeshake: {
		moduleSideEffects: true,
	},
	plugins: [
		progress({
			clearLine: true // default: true
		}),
		commonjs({
			transformMixedEsModules: true,
			ignoreGlobal: true,
			defaultIsModuleExports: false,
			requireReturnsDefault: 'namespace',
		}),
		license(licenseOptions)
	],
	onwarn: function(warning, warn) {
		if(warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'EVAL') return;
		const loc   = (warning.hasOwnProperty('loc')) ? warning.loc : undefined,
		      frame = (warning.hasOwnProperty('frame')) ? warning.frame : undefined,
		      msg   = (warning.hasOwnProperty('message')) ? warning.message : undefined;
		if(loc) {
			console.warn(`${loc.file} (${loc.line}:${loc.column}) ${msg}`);
			/*if(frame)
			 console.warn(frame);*/
		} else
			console.warn(msg);
	}
};
const jsMinConfig = {
	input: inputJS,
	output: [
		{
			file: `${BUILD_JS_DIR}/${pluginName}.umd.min.js`,
			format: "umd",
			name: bundleName,
			sourcemap: true,
			assetFileNames: 'assets/[name]-[hash][extname]',
			manualChunks: {},
			plugins: [terser(terserOptions)],
			exports: 'default',
			preserveModules: false,
			generatedCode: {preset: 'es2015', arrowFunctions: true},
			externalLiveBindings: false,
			freeze: false,
			noConflict: true
		},
		{
			file: `${BUILD_JS_DIR}/${pluginName}.esm.min.js`,
			format: "esm",
			name: bundleName,
			sourcemap: true,
			inlineDynamicImports: true,
			plugins: [terser(terserOptions)],
			preserveModules: false,
			generatedCode: {preset: 'es2015', arrowFunctions: true},
			externalLiveBindings: false,
			freeze: false,
			noConflict: true
		},
	],
	plugins: [
		progress({
			clearLine: true // default: true
		}),
		//nodeResolve(),
		commonjs({transformMixedEsModules: true}),
		license(licenseOptions),
		{
			name: 'buildEnd',
			buildEnd() {
				createVersionInfo();
				createLoader();
			}
		}
	],
	onwarn: function(warning, warn) {
		if(warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'EVAL') return;
		const loc   = (warning.hasOwnProperty('loc')) ? warning.loc : undefined,
		      frame = (warning.hasOwnProperty('frame')) ? warning.frame : undefined,
		      msg   = (warning.hasOwnProperty('message')) ? warning.message : undefined;
		if(loc) {
			console.warn(`${loc.file} (${loc.line}:${loc.column}) ${msg}`);
			/*if(frame)
			 console.warn(frame);*/
		} else
			console.warn(msg);
	}
};
const cssConfig = {
	input: inputCSS,
	output: [
		{file: `${BUILD_CSS_DIR}/${pluginName}.css`, format: "es", assetFileNames: 'assets/[name]-[hash][extname]', manualChunks: () => 'app'},
	],
	plugins: [
		progress({
			clearLine: true // default: true
		}),
		//externalAssets("**/*.{jpg,png,gif,bmp,svg}"),
		postcss({
			plugins: [postcssImport(), postcssNested(), autoprefixer()],
			extract: `${pluginName}.css`,
			sourceMap: true
		}),
	]
};
const cssMinConfig = {
	input: inputCSS,
	output: [
		{file: `${BUILD_CSS_DIR}/${pluginName}.min.css`, format: "es", assetFileNames: 'assets/[name]-[hash][extname]', manualChunks: () => 'app'},
	],
	plugins: [
		progress({
			clearLine: true // default: true
		}),
		//externalAssets("**/*.{jpg,png,gif,bmp,svg}"),
		postcss({
			extract: `${pluginName}.min.css`,
			sourceMap: true,
			minimize: true,
			plugins: [
				postcssImport(),
				postcssNested(),
				autoprefixer(),
				postcssUrl({
					url: (asset) => {
						const url = asset.url;
						const isImage = (IMAGES_RX.test(url)),
						      isFont  = (FONTS_RX.test(url));
						if(!isImage && !isFont)
							return url;

						const fpath = asset.absolutePath,
						      name  = path.basename(fpath),
						      file  = fs.readFileSync(fpath);
						const hash = hasha(file, {algorithm: "md5"});
						const extname = path.extname(asset.absolutePath);
						const hashedFileName = `${hash}${extname}`;
						const assetDir = (isImage) ? BUILD_IMG_ASSETS_DIR :
						                 (isFont) ? BUILD_FONTS_ASSETS_DIR : BUILD_ASSETS_DIR;
						//fse.ensureDirSync(BUILD_IMG_ASSETS_DIR, false);
						const filePath = (!isFont) ? `${assetDir}/${pluginName}` : `${assetDir}/${hashedFileName}`;
						const urlPath = (!isFont) ? path.join("_assets", name) : path.join("assets", hashedFileName);

						copyRecursiveSync(fpath, filePath);

						return urlPath;
					},
				}),
			],
		})
	]
};
const loaderJSConfig = {
	input: `${BUILD_JS_DIR}/loader.umd.js`,
	output: [
		{
			file: `${BUILD_JS_DIR}/${pluginName}.loader.umd.js`,
			format: "umd",
			name: loaderName,
			sourcemap: true,
			assetFileNames: 'assets/[name]-[hash][extname]',
			manualChunks: {},
			preserveModules: false,
			generatedCode: {preset: 'es2015', arrowFunctions: true},
			externalLiveBindings: false,
			freeze: false,
			noConflict: true,
			intro: "/**\n * @type {global|Window|WindowWorkerSpace}\n */\nconst root = (typeof global !== 'undefined') ? global : window || self;\n//FAHERE"
		},
	],
	plugins: [
		progress({
			clearLine: true // default: true
		}),
		commonjs({transformMixedEsModules: true}),
		license(licenseOptions),
		{
			name: 'buildEnd',
			buildEnd() {
				fs.unlinkSync(loaderJSConfig.input);
			}
		}
	],
	onwarn: function(warning, warn) {
		if(warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'EVAL') return;
		const loc   = (warning.hasOwnProperty('loc')) ? warning.loc : undefined,
		      frame = (warning.hasOwnProperty('frame')) ? warning.frame : undefined,
		      msg   = (warning.hasOwnProperty('message')) ? warning.message : undefined;
		if(loc) {
			console.warn(`${loc.file} (${loc.line}:${loc.column}) ${msg}`);
		} else
			console.warn(msg);
	}
};
const loaderJSMinConfig = {
	input: `${BUILD_JS_DIR}/loader.umd.min.js`,
	output: [
		{
			file: `${BUILD_JS_DIR}/${pluginName}.loader.umd.min.js`,
			name: loaderName,
			sourcemap: true,
			assetFileNames: 'assets/[name]-[hash][extname]',
			plugins: [terser(terserOptions)],
			manualChunks: {},
			preserveModules: false,
			generatedCode: {preset: 'es2015', arrowFunctions: true},
			externalLiveBindings: false,
			freeze: false,
			noConflict: true,
			intro: "/**\n * @type {global|Window|WindowWorkerSpace}\n */\nconst root = (typeof global !== 'undefined') ? global : window || self;\n//FAHERE"
		},
	],
	plugins: [
		progress({
			clearLine: true // default: true
		}),
		commonjs({transformMixedEsModules: true}),
		license(licenseOptions),
		{
			name: 'buildEnd',
			buildEnd() {
				fs.unlinkSync(loaderJSMinConfig.input);
			}
		}
	],
	onwarn: function(warning, warn) {
		if(warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'EVAL') return;
		const loc   = (warning.hasOwnProperty('loc')) ? warning.loc : undefined,
		      frame = (warning.hasOwnProperty('frame')) ? warning.frame : undefined,
		      msg   = (warning.hasOwnProperty('message')) ? warning.message : undefined;
		if(loc) {
			console.warn(`${loc.file} (${loc.line}:${loc.column}) ${msg}`);
		} else
			console.warn(msg);
	}
};
const loaderJSESMConfig = {
	input: `${BUILD_JS_DIR}/loader.esm.js`,
	output: [
		{
			file: `${BUILD_JS_DIR}/${pluginName}.loader.esm.js`,
			format: "esm",
			name: loaderName,
			sourcemap: true,
			inlineDynamicImports: true,
			preserveModules: false,
			generatedCode: {preset: 'es2015', arrowFunctions: true},
			externalLiveBindings: false,
			freeze: false,
			noConflict: true,
			intro: "/**\n * @type {global|Window|WindowWorkerSpace}\n */\nconst root = (typeof global !== 'undefined') ? global : window || self;\n//FAHERE"
		},
	],
	plugins: [
		progress({
			clearLine: true // default: true
		}),
		commonjs({transformMixedEsModules: true}),
		license(licenseOptions),
		{
			name: 'buildEnd',
			buildEnd() {
				fs.unlinkSync(loaderJSESMConfig.input);
			}
		}
	],
	onwarn: function(warning, warn) {
		if(warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'EVAL') return;
		const loc   = (warning.hasOwnProperty('loc')) ? warning.loc : undefined,
		      frame = (warning.hasOwnProperty('frame')) ? warning.frame : undefined,
		      msg   = (warning.hasOwnProperty('message')) ? warning.message : undefined;
		if(loc) {
			console.warn(`${loc.file} (${loc.line}:${loc.column}) ${msg}`);
		} else
			console.warn(msg);
	}
};
const loaderJSESMMinConfig = {
	input: `${BUILD_JS_DIR}/loader.esm.min.js`,
	output: [
		{
			file: `${BUILD_JS_DIR}/${pluginName}.loader.esm.min.js`,
			format: "esm",
			name: loaderName,
			sourcemap: true,
			inlineDynamicImports: true,
			plugins: [terser(terserOptions)],
			preserveModules: false,
			generatedCode: {preset: 'es2015', arrowFunctions: true},
			externalLiveBindings: false,
			freeze: false,
			noConflict: true,
			intro: "/**\n * @type {global|Window|WindowWorkerSpace}\n */\nconst root = (typeof global !== 'undefined') ? global : window || self;\n//FAHERE"
		},
	],
	plugins: [
		progress({
			clearLine: true // default: true
		}),
		commonjs({transformMixedEsModules: true}),
		license(licenseOptions),
		{
			name: 'buildEnd',
			buildEnd() {
				fs.unlinkSync(loaderJSESMMinConfig.input);
			}
		}
	],
	onwarn: function(warning, warn) {
		if(warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'EVAL') return;
		const loc   = (warning.hasOwnProperty('loc')) ? warning.loc : undefined,
		      frame = (warning.hasOwnProperty('frame')) ? warning.frame : undefined,
		      msg   = (warning.hasOwnProperty('message')) ? warning.message : undefined;
		if(loc) {
			console.warn(`${loc.file} (${loc.line}:${loc.column}) ${msg}`);
		} else
			console.warn(msg);
	}
};

if((args.js && args.css) && (!args.jsOnly && !args.cssOnly && !args.loaderOnly)) {
	if(!args.noMinify && !args.minifyOnly)
		module.exports = (args.noLoader) ? [jsConfig, jsMinConfig, cssConfig, cssMinConfig] : [jsConfig, jsMinConfig, cssConfig, cssMinConfig, loaderJSConfig, loaderJSMinConfig, loaderJSESMConfig, loaderJSESMMinConfig];
	else if(args.minifyOnly)
		module.exports = (args.noLoader) ? [jsMinConfig, cssMinConfig] : [jsMinConfig, cssMinConfig, loaderJSMinConfig, loaderJSESMMinConfig];
	else
		module.exports = (args.noLoader) ? [jsConfig, cssConfig] : [jsConfig, cssConfig, loaderJSConfig, loaderJSESMConfig];
} else if((args.js && !args.css) || (args.jsOnly && !args.loaderOnly)) {
	if(!args.noMinify && !args.minifyOnly)
		module.exports = (args.noLoader) ? [jsConfig, jsMinConfig] : [jsConfig, jsMinConfig, loaderJSConfig, loaderJSMinConfig], loaderJSESMConfig, loaderJSESMMinConfig;
	else if(args.minifyOnly)
		module.exports = (args.noLoader) ? [jsMinConfig] : [jsMinConfig, loaderJSMinConfig, loaderJSESMMinConfig];
	else
		module.exports = (args.noLoader) ? [jsConfig] : [jsConfig, loaderJSConfig, loaderJSESMConfig];
} else if((!args.js && args.css && !args.loaderOnly) || args.cssOnly && !args.loaderOnly) {
	if(!args.noMinify && !args.minifyOnly)
		module.exports = [cssConfig, cssMinConfig];
	else if(args.minifyOnly)
		module.exports = [cssMinConfig];
	else
		module.exports = [cssConfig];
} else if((!args.js && !args.css) || (!args.jsOnly && !args.cssOnly && args.loaderOnly)) {
	if(!args.noMinify && !args.minifyOnly)
		module.exports = [loaderJSConfig, loaderJSMinConfig, loaderJSESMConfig, loaderJSESMMinConfig];
	else if(args.minifyOnly)
		module.exports = [loaderJSMinConfig, loaderJSESMMinConfig];
	else
		module.exports = [loaderJSConfig, loaderJSESMConfig];
}
