/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const {functions, constants} = require("./config");
const {args, cdn_dir} = constants;
const {console, deleteFolderRecursive} = functions;

const doExec = (args.dir === "dst" || args.dir === "src");
const dir = (args.dir === "dst") ? `${cdn_dir}latest` : "dist";

if(doExec) {
	console.info("Cleaning working tree...");
	deleteFolderRecursive(dir, 'dist/types');
	console.success("Successfully cleaned working tree!");
}

