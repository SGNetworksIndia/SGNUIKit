/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const fs       = require("fs"),
      archiver = require("archiver"),
      config   = require("./config.js"),
      info     = require("../package.json");

/**
 * Creates a new release for the build
 * @param {string} [flavor=free] The flavor of the build
 */
const createRelease = function(flavor = "free") {
	const name = (flavor === "pro") ? `SGNUIKit v${info.version} (Stable)-Pro` : `SGNUIKit v${info.version} (Stable)`,
	      file = `release\\${name}.zip`;
	if(fs.existsSync(file)) {
		console.warn(`The release '${name}' already exists.`);
		console.warn(`Deleting release: ${name}...`);
		fs.unlinkSync(file);
	}

	const output  = fs.createWriteStream(file),
	      archive = archiver("zip", {zlib: {level: 9}});

	output.on("close", function() {
		console.log(archive.pointer() + " total bytes");
		console.log("Archiver has been finalized and the output file descriptor has closed.");
	});

	archive.on("warning", function(err) {
		throw err;
	});

	archive.on("error", function(err) {
		throw err;
	});

	archive.pipe(output);

	// append files from a subdirectory, putting its contents at the root of archive
	archive.directory("dist/", false);

	archive.finalize().then(r => console.log(`The release '${name}' has been created.`));
};

if(config.args.flavor === "free" || config.args.flavor === "pro") {
	console.info(`Creating release with build flavor: ${config.args.flavor}`);
	createRelease(config.args.flavor);
} else
	console.error(`Failed to create release: Invalid flavor supplied: ${config.args.flavor}`);
