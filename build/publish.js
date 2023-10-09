/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const {constants, functions} = require("./config");
const {console, copyRecursiveSync, deleteFolderRecursive} = functions;
const {cdn_dir, version} = constants;

let cdnVInfo;
try {
	cdnVInfo = require(`${cdn_dir}latest\\version.json`);
	if(version.version !== cdnVInfo.version) {
		copyRecursiveSync(`${cdn_dir}latest`, `${cdn_dir}${cdnVInfo.version}`);
	} else {
		console.warn(`The SGNUIKit version %c${cdnVInfo.version} already exists. Cleaning...`, "font-weight: bold; font-style: italic");
		deleteFolderRecursive(`${cdn_dir}latest`);
	}
} catch(e) {}

console.info(`Publishing release v${version.version} to: "SGN CDN"...`);
copyRecursiveSync("dist", `${cdn_dir}latest`);
console.success(`Package Published Successfully to "SGN CDN" which could be found at "https://cdn.sgnetworks.net/jquery/plugins/SGNetworks/SGNUIKit/latest/"`);
