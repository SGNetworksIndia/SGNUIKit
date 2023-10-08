/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const fs       = require("fs"),
      archiver = require("archiver"),
      vInfo    = require("../dist/version.json");
const {args} = require("./constants");
const {console} = require('./functions');
const flavor = (args.flavor === undefined) ? vInfo.flavor : args.flavor;

/**
 * Creates a new release for the build
 * @param {string} [flavor=free] The flavor of the build
 */
const createRelease = function(flavor) {
	flavor = (flavor === undefined) ? vInfo.flavor : flavor;
	const name = (flavor === "pro") ? `SGNUIKit Pro v${vInfo.version} (Stable)` : `SGNUIKit Free v${vInfo.version} (Stable)`,
	      file = `release\\${name}.zip`;
	if(fs.existsSync(file)) {
		console.warn(`The release '${name}' already exists.`);
		console.error(`Deleting release: ${name}...`);
		fs.unlink(file, () => console.success(`Deleted: Release: '${name}'`));
	}

	const output  = fs.createWriteStream(file),
	      archive = archiver("zip", {zlib: {level: 9}});

	output.on("open", () => console.info(`Creating release 'v${vInfo.version}'...`));

	output.on("close", function() {
		console.info(archive.pointer() + " total bytes");
		//console.info("Archiver has been finalized and the output file descriptor has closed.");
	});

	archive.on("warning", function(err) {
		throw err;
	});

	archive.on("error", function(err) {
		throw err;
	});

	archive.pipe(output);

	// append files from a subdirectory, putting its contents at the root of archive
	archive.directory("dist/assets", '/assets', null);
	archive.directory("dist/types", '/types', null);
	archive.directory("demos", '/demos', null);
	archive.file("LICENSE", {name: '/LICENSE'});
	archive.file("README.md", {name: '/README.md'});
	archive.file("SECURITY.md", {name: '/SECURITY.md'});
	archive.file("dist/version.json", {name: '/version.json'});
	archive.file("dist/css/SGNUIKit.css", {name: '/css/SGNUIKit.css'});
	archive.file("dist/css/SGNUIKit.css.map", {name: '/css/SGNUIKit.css.map'});
	archive.file("dist/css/SGNUIKit.min.css", {name: '/css/SGNUIKit.min.css'});
	archive.file("dist/css/SGNUIKit.min.css.map", {name: '/css/SGNUIKit.min.css.map'});
	archive.file("dist/js/SGNUIKit.umd.min.js", {name: '/js/SGNUIKit.min.js'});
	archive.file("dist/js/SGNUIKit.umd.min.js.map", {name: '/js/SGNUIKit.min.js.map'});
	archive.file("dist/js/SGNUIKit.esm.min.js", {name: '/js/SGNUIKit.esm.min.js'});
	archive.file("dist/js/SGNUIKit.esm.min.js.map", {name: '/js/SGNUIKit.esm.min.js.map'});
	archive.file("dist/js/SGNUIKit.loader.umd.min.js", {name: '/js/SGNUIKit.loader.min.js'});
	archive.file("dist/js/SGNUIKit.loader.umd.min.js.map", {name: '/js/SGNUIKit.loader.min.js.map'});
	archive.file("dist/js/SGNUIKit.loader.esm.min.js", {name: '/js/SGNUIKit.loader.esm.min.js'});
	archive.file("dist/js/SGNUIKit.loader.esm.min.js.map", {name: '/js/SGNUIKit.loader.esm.min.js.map'});

	archive.finalize().then(() => console.success(`The release '${name}' has been created.`));
};

if(flavor === "free" || flavor === "pro") {
	console.info(`Creating release 'v${vInfo.version}' with build flavor: ${flavor}`);
	createRelease(flavor);
} else
	console.error(`Failed to create release 'v${vInfo.version}': Invalid flavor supplied: ${flavor}`);
