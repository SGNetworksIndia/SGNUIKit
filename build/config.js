/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const functions = require('./functions');
const constants = require('./constants');
const {SGNUIKitLoader} = require('./loaders');

const {SRC_DIR} = constants;
const {path} = functions;

const terserOptions  = {
	      output: {
		      // Preserve add-on license comments.
		      comments: false,
	      },
	      compress: {
		      keep_fargs: true,
		      typeofs: false,
	      },
	      ecma: 2022,
	      keep_classnames: true,
	      keep_fnames: true,
      },
      licenseOptions = {
	      sourcemap: true,
	      cwd: process.cwd(), // The default
	      banner: {
		      commentStyle: 'regular', // The default

		      content: {
			      file: `${SRC_DIR}/LICENSE`, encoding: 'utf-8', // Default is utf-8
		      },
	      },

	      thirdParty: {
		      includePrivate: true, // Default is false.
		      allow: {
			      test: '(MIT OR Apache-2.0)',
			      failOnUnlicensed: true,
			      failOnViolation: true,
		      }, output: {
			      file: path.join(__dirname, 'dist', 'dependencies.txt'), encoding: 'utf-8', // Default is utf-8.
		      },
	      },
      };

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

module.exports = {
	constants, functions, terserOptions, licenseOptions, AUTOPREFIXER_BROWSERS, SGNUIKitLoader
};
