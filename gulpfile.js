/*
 * Copyright (c) 2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const {series, parallel} = require('gulp');
const gulp          = require('gulp'),
      rename        = require('gulp-rename'),
      autoprefixer  = require('gulp-autoprefixer'),
      postcss       = require("gulp-postcss"),
      postcssImport = require("postcss-import"),
      postcssUrl    = require("postcss-url"),
      minifyCss     = require('gulp-clean-css'),
      sourcemaps    = require("gulp-sourcemaps"),
      terser        = require('gulp-terser');

const {constants, functions, terserOptions} = require("./build/config");
const {deleteFolderRecursive, HELPERS, appendToFiles} = functions;

const {buildFlavor, pluginName, SRC_FONTS_DIR, SRC_FONTS_ASSETS_DIR, BUILD_JS_DIR, BUILD_ASSETS_DIR, BUILD_CSS_DIR, BUILD_FONTS_ASSETS_DIR, BUILD_IMG_ASSETS_DIR, FONTS_RX, IMAGES_RX, SRC_CSS_DIR} = constants;
const {copyRecursiveSync, fs, path, hasha, createLoader} = functions;

const inputCSS = `${SRC_CSS_DIR}/${buildFlavor}.css`;

const clean = async() => {
	const dir = "dist";
	await deleteFolderRecursive(dir, 'dist/types');
	fs.mkdirSync(BUILD_FONTS_ASSETS_DIR, {recursive: true});
	fs.mkdirSync(BUILD_IMG_ASSETS_DIR, {recursive: true});
};

const appendFA = async() => {
	const input1      = `${BUILD_JS_DIR}/${pluginName}.umd.js`,
	      input2      = `${BUILD_JS_DIR}/${pluginName}.umd.min.js`,
	      input3      = `${BUILD_JS_DIR}/${pluginName}.esm.js`,
	      input4      = `${BUILD_JS_DIR}/${pluginName}.esm.min.js`,
	      insertFile1 = (buildFlavor === 'pro') ? `${SRC_FONTS_DIR}/FontAwesome5Pro/js/all.min.js` : `${SRC_FONTS_DIR}/FontAwesome6Free/js/all.min.js`,
	      insertFile2 = (buildFlavor === 'pro') ? `${SRC_FONTS_DIR}/FontAwesome5Pro/js/v4-shims.min.js` : `${SRC_FONTS_DIR}/FontAwesome6Free/js/v4-shims.min.js`;

	appendToFiles([input1, input2, input3, input4], [insertFile1, insertFile2]);
};

const cssBundle = () => gulp.src(inputCSS, {sourcemaps: true})
                            .pipe(autoprefixer())
                            .pipe(postcss([
			                            postcssImport(),
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
					                            /*const filePath = (!isFont) ? `${assetDir}/${name}` : `${assetDir}/${hashedFileName}`;
					                             const urlPath = (!isFont) ? `../assets/img/${name}` : `../assets/fonts/${hashedFileName}`;*/
					                            const filePath = (!isFont) ? `${assetDir}/${hashedFileName}` : `${assetDir}/${hashedFileName}`;
					                            const urlPath = (!isFont) ? `../assets/img/${hashedFileName}` : `../assets/fonts/${hashedFileName}`;

					                            copyRecursiveSync(fpath, filePath);

					                            return urlPath;
				                            }
			                            })
		                            ]
	                            )
                            )
                            .pipe(rename(`${pluginName}.css`))
                            .pipe(gulp.dest(BUILD_CSS_DIR, {sourcemaps: '.'}));

const cssMinify = () => gulp.src(inputCSS)
                            .pipe(sourcemaps.init())
                            .pipe(autoprefixer())
                            .pipe(postcss([
			                            postcssImport(),
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
					                            /*const filePath = (!isFont) ? `${assetDir}/${name}` : `${assetDir}/${hashedFileName}`;
					                             const urlPath = (!isFont) ? `../assets/img/${name}` : `../assets/fonts/${hashedFileName}`;*/
					                            const filePath = (!isFont) ? `${assetDir}/${hashedFileName}` : `${assetDir}/${hashedFileName}`;
					                            const urlPath = (!isFont) ? `../assets/img/${hashedFileName}` : `../assets/fonts/${hashedFileName}`;

					                            copyRecursiveSync(fpath, filePath);

					                            return urlPath;
				                            }
			                            })
		                            ]
	                            )
                            )
                            .pipe(minifyCss())
                            .pipe(rename(`${pluginName}.min.css`))
                            .pipe(sourcemaps.write('.'))
                            .pipe(gulp.dest(BUILD_CSS_DIR));

const jsBundle = () => HELPERS.execute(`rollup -c --maxParallelFileOps 5 --environment flavor=${buildFlavor} --environment jsOnly=true --environment noLoader=true --environment noMinify=true`);
const jsMinify = () => HELPERS.execute(`rollup -c --maxParallelFileOps 5 --environment flavor=${buildFlavor} --environment jsOnly=true --environment noLoader=true --environment minifyOnly=true`);

const createLoaderSource = async() => {
	if(!fs.existsSync(`${BUILD_JS_DIR}/loader.umd.js`)) {
		createLoader('umd');
	}
	if(!fs.existsSync(`${BUILD_JS_DIR}/loader.esm.js`)) {
		createLoader('esm');
	}
}
const createLoaderMinifiedSource = async() => {
	if(!fs.existsSync(`${BUILD_JS_DIR}/loader.umd.min.js`)) {
		createLoader('umd.min');
	}
	if(!fs.existsSync(`${BUILD_JS_DIR}/loader.esm.min.js`)) {
		createLoader('esm.min');
	}
}

const cleanupBuild = async() => {
	if(fs.existsSync(`${BUILD_JS_DIR}/loader.umd.min.js`)) {
		fs.unlinkSync(`${BUILD_JS_DIR}/loader.umd.min.js`);
	}
	if(fs.existsSync(`${BUILD_JS_DIR}/loader.esm.min.js`)) {
		fs.unlinkSync(`${BUILD_JS_DIR}/loader.esm.min.js`);
	}
	if(fs.existsSync(`${BUILD_JS_DIR}/loader.umd.js`)) {
		fs.unlinkSync(`${BUILD_JS_DIR}/loader.umd.js`);
	}
	if(fs.existsSync(`${BUILD_JS_DIR}/loader.esm.js`)) {
		fs.unlinkSync(`${BUILD_JS_DIR}/loader.esm.js`);
	}
}
/* const loaderTransform = () => HELPERS.execute(`rollup -c --maxParallelFileOps 5 --environment flavor=${buildFlavor} --environment loaderOnly=true --environment noMinify=true`);
 const loaderMinify = () => HELPERS.execute(`rollup -c --maxParallelFileOps 5 --environment flavor=${buildFlavor} --environment loaderOnly=true --environment minifyOnly=true`); */
const loaderTransformUMD = () => gulp.src(`${BUILD_JS_DIR}/loader.umd.js`, {sourcemaps: true})
                                     .pipe(gulp.dest('./dist'))
                                     .pipe(rename(`${pluginName}.loader.umd.js`))
                                     .pipe(gulp.dest(BUILD_JS_DIR, {sourcemaps: '.'}));

const loaderTransformESM = () => gulp.src(`${BUILD_JS_DIR}/loader.esm.js`, {sourcemaps: true})
                                     .pipe(gulp.dest('./dist'))
                                     .pipe(rename(`${pluginName}.loader.esm.js`))
                                     .pipe(gulp.dest(BUILD_JS_DIR, {sourcemaps: '.'}));

const loaderMinifyUMD = () => gulp.src(`${BUILD_JS_DIR}/loader.umd.min.js`, {sourcemaps: true})
                                  .pipe(terser(terserOptions))
                                  .pipe(gulp.dest('./dist'))
                                  .pipe(rename(`${pluginName}.loader.umd.min.js`))
                                  .pipe(gulp.dest(BUILD_JS_DIR, {sourcemaps: '.'}));

const loaderMinifyESM = () => gulp.src(`${BUILD_JS_DIR}/loader.esm.min.js`, {sourcemaps: true})
                                  .pipe(terser(terserOptions))
                                  .pipe(gulp.dest('./dist'))
                                  .pipe(rename(`${pluginName}.loader.esm.min.js`))
                                  .pipe(gulp.dest(BUILD_JS_DIR, {sourcemaps: '.'}));

const publish = async() => await HELPERS.execute('npm run publish:cdn & npm run publish:release');

/*exports.build = series(
 cssBundle, cssMinify
 );*/
/* exports.build = series(
 parallel(series(jsBundle, appendFA)),
 //parallel(series(jsMinify, appendFA)),
 ); */
/* exports.build = series(
 createLoaderSource,
 createLoaderMinifiedSource,
 //series(loaderTransform, appendFA),
 series(
 loaderTransformUMD,
 loaderTransformESM,
 ),
 series(
 loaderMinifyUMD,
 loaderMinifyESM,
 ),
 appendFA,
 cleanupBuild
 ); */

exports.build = series(
	clean,
	parallel(cssBundle, series(jsBundle, appendFA)),
	parallel(cssMinify, series(jsMinify, appendFA)),
	parallel(
		series(
			createLoaderSource,
			series(
				loaderTransformUMD,
				loaderTransformESM,
			),
		),
		series(
			createLoaderMinifiedSource,
			series(
				loaderMinifyUMD,
				loaderMinifyESM,
			)
		)
	),
	cleanupBuild,
	publish
);
