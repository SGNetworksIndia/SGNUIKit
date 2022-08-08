/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const fs = require('fs');
const args = require('./args.js');

function deleteFolderRecursive(path, actualPath) {
	actualPath = (actualPath === undefined || actualPath === null || actualPath === '') ? path : actualPath;

	if(fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
		fs.readdirSync(path).forEach(function(file, index) {
			const curPath = path + "/" + file;

			if(fs.lstatSync(curPath).isDirectory()) {
				// recurse
				deleteFolderRecursive(curPath, actualPath);
			} else {
				// delete file
				fs.unlinkSync(curPath);
			}
		});

		if(path !== actualPath) {
			console.log(`Deleting directory "${path}"...`);
			fs.rmdirSync(path);
		}
	} else {
		console.log(`Directory "${path}" doesn't exists...`);
	}
}

console.log("Cleaning working tree...");

const dir = (args.dir === 'dst') ? 'E:\\home\\sgn\\public_html\\cdn\\jquery\\plugins\\SGNetworks\\SGNUIKit\\latest' : 'dist';

deleteFolderRecursive(dir);

console.log("Successfully cleaned working tree!");
