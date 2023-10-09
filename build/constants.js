/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

Date.prototype.toUnixTime = function() { return this.getTime() / 1000 | 0; };
Date.time = function() { return new Date().toUnixTime(); };
const timestamp = Date.time();

const env  = process.env,
      argv = process.argv,
      info = require("../package.json");
const cdn_dir = "E:\\home\\sgn\\public_html\\cdn\\jquery\\plugins\\SGNetworks\\SGNUIKit\\",
      args    = {
	      'css': true,
	      'js': true,
	      'noMinify': false,
	      'jsOnly': false,
	      'cssOnly': false,
	      'minifyOnly': false,
	      'loaderOnly': false,
	      'noLoader': false,
	      'mode': "production"
      };

if(argv[1].endsWith('webpack')) {
	for(let i = 2; i < argv.length; i++) {
		const k = argv[i].replace("--", "");
		i++;
		args[k] = argv[i];
	}
} else {
	for(let i = 3; i < argv.length; i++) {
		const k = argv[i].replace("--", "");
		i++;
		const v = argv[i];
		args[k] = v;
		if(v.indexOf(':') !== -1 || v.indexOf('=') !== -1) {
			const kv = (v.indexOf('=') !== -1) ? v.split('=') : v.split(':');
			args[kv[0]] = kv[1];
		}
	}
	/*for(let key in env) {
	 args[key] = env[key];
	 }*/
}

const devBuild    = args.env || false,
      buildFlavor = args.flavor || false;
const v = info.version.split(".");

const version = {
	"major": v[0] | 0,
	"minor": v[1] | 0,
	"patch": v[2] | 0,
	"build": v[3] | 0,
	"version": `${v[0] | 0}.${v[0] | 0}.${v[0] | 0} [build ${v[0] | 0}]`,
	"flavor": buildFlavor || 'unknown',
	"timestamp": timestamp,
};

const pluginName = 'SGNUIKit';

const SRC_DIR                = './src',
      SRC_JS_DIR             = `${SRC_DIR}/js`,
      SRC_CSS_DIR            = `${SRC_DIR}/css`,
      SRC_FONTS_DIR          = `${SRC_CSS_DIR}/fonts`,
      SRC_ADDONS_DIR         = `${SRC_DIR}/addons`,
      BUILD_DIR              = './dist',
      BUILD_JS_DIR           = `${BUILD_DIR}/js`,
      BUILD_CSS_DIR          = `${BUILD_DIR}/css`,
      BUILD_ASSETS_DIR       = `${BUILD_DIR}/assets`,
      BUILD_IMG_ASSETS_DIR   = `${BUILD_ASSETS_DIR}/img`,
      BUILD_FONTS_ASSETS_DIR = `${BUILD_ASSETS_DIR}/fonts`;
const IMAGES_RX = /\.(png|jpe?g|gif|webp|svg)$/,
      FONTS_RX  = /\.(woff|woff2|eot|ttf|otf)(\?[a-z0-9=.]+)?$/;

module.exports = {
	env, args, buildFlavor, devBuild, pluginName, version, cdn_dir,
	SRC_DIR, SRC_JS_DIR, SRC_CSS_DIR, SRC_FONTS_DIR, SRC_ADDONS_DIR,
	BUILD_DIR, BUILD_JS_DIR, BUILD_CSS_DIR,
	BUILD_ASSETS_DIR, BUILD_IMG_ASSETS_DIR, BUILD_FONTS_ASSETS_DIR,
	IMAGES_RX, FONTS_RX
};
