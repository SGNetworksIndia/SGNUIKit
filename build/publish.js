/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const fs     = require("fs"),
      path   = require("path"),
      config = require("./config.js");
const ts = Date.time();
const vinfo = {
	"major": config.version.major,
	"minor": config.version.minor,
	"patch": config.version.patch,
	"code": 0,
	"version": `${config.version.major}.${config.version.minor}.${config.version.patch}`,
	"flavor": "",
	"timestamp": ts,
};
let cdnVInfo;
const {deleteFolderRecursive} = require("./clean");
const buffer    = Buffer.from(config.SGNUIKitLoader, "base64"),
      loaderStr = buffer.toString("utf8");

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

if(config.args.flavor === "free" || config.args.flavor === "pro") {
	vinfo.flavor = config.args.flavor;
}

console.info("Creating version info: " + "%cversion.json" + " in " + "%c/dist/" + "...", "font-weight: bold; font-style: italic", "font-weight: bold; font-style: italic");
fs.writeFileSync("dist/version.json", JSON.stringify(vinfo));

console.info("Creating loader: " + "%cSGNUIKit.loader.js" + " in " + "%c/dist/js/" + "...", "font-weight: bold; font-style: italic", "font-weight: bold; font-style: italic");
fs.writeFileSync("dist/js/SGNUIKit.loader.js", loaderStr);

try {
	cdnVInfo = require(`${config.cdn_dir}latest\\version.json`);
	if(vinfo.version !== cdnVInfo.version) {
		copyRecursiveSync(`${config.cdn_dir}latest`, `${config.cdn_dir}${cdnVInfo.version}`);
	} else {
		console.warn(`The SGNUIKit version %c${cdnVInfo.version} already exists. Cleaning...`, "font-weight: bold; font-style: italic");
		deleteFolderRecursive(`${config.cdn_dir}latest`);
	}
} catch(e) {}

console.info("Publishing to : " + "%cSGN CDN", "font-weight: bold; font-style: italic");
copyRecursiveSync("dist", `${config.cdn_dir}latest`);
console.info("Package Published Successfully to " + "%cSGN CDN" + " which could be found at " + "%chttps://cdn.sgnetworks.net/jquery/plugins/SGNetworks/SGNUIKit/latest/", "font-weight: bold; font-style: italic", "font-weight: bold; font-style: italic");
