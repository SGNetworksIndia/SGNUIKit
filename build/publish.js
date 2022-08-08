/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const fs   = require("fs"),
	  path = require("path");

/**
 * Copy files recursively
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
const copyRecursiveSync = function(src, dest) {
	const srcExists   = fs.existsSync(src),
		  destExists  = fs.existsSync(dest),
		  stats       = srcExists && fs.statSync(src),
		  isDirectory = srcExists && stats.isDirectory();

	if(isDirectory) {
		if(!destExists) {
			console.log(`Creating directory: "${dest}"...`);
			fs.mkdirSync(dest);
		}
		fs.readdirSync(src).forEach(function(childItemName) {
			console.log(`Copying directory from: "${path.join(src, childItemName)}" to "${path.join(dest, childItemName)}"...`);
			copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	} else {
		if(srcExists) {
			console.log(`Copying file: "${src}" to "${dest}"...`);
			fs.copyFileSync(src, dest);
		}
	}
};

copyRecursiveSync('src\\js\\SGNUIKit.loader.js', 'dist\\js\\SGNUIKit.loader.js');
copyRecursiveSync('dist', 'E:\\home\\sgn\\public_html\\cdn\\jquery\\plugins\\SGNetworks\\SGNUIKit\\latest');
