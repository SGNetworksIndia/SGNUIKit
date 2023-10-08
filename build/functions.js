/*
 * Copyright (c) 2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const os    = require('os'),
      fs    = require('fs'),
      path  = require('path'),
      hasha = require('hasha');
const pkg = require("../package.json");
const {version, BUILD_DIR, BUILD_JS_DIR} = require("./constants");
const {exec, execSync} = require("child_process");
const {SGNUIKitLoader} = require("./loaders");

const colours = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m",

	fg: {
		black: "\x1b[30m",
		red: "\x1b[31m",
		green: "\x1b[32m",
		yellow: "\x1b[33m",
		blue: "\x1b[34m",
		magenta: "\x1b[35m",
		cyan: "\x1b[36m",
		white: "\x1b[37m",
		gray: "\x1b[90m",
		crimson: "\x1b[38m" // Scarlet
	},
	bg: {
		black: "\x1b[40m",
		red: "\x1b[41m",
		green: "\x1b[42m",
		yellow: "\x1b[43m",
		blue: "\x1b[44m",
		magenta: "\x1b[45m",
		cyan: "\x1b[46m",
		white: "\x1b[47m",
		gray: "\x1b[100m",
		crimson: "\x1b[48m"
	}
};
const xconsole = global.console;
const console = {
	'log': (msg, ...args) => {
		args = Array.from(args);
		args.unshift(colours.fg.white, msg, colours.reset);
		xconsole.log.apply(xconsole, args);
	},
	'error': (msg, ...args) => {
		args = Array.from(args);
		args.unshift(colours.fg.red, msg, colours.reset);
		xconsole.log.apply(xconsole, args);
	},
	'warn': (msg, ...args) => {
		args = Array.from(args);
		args.unshift(colours.fg.yellow, msg, colours.reset);
		xconsole.log.apply(xconsole, args);
	},
	'info': (msg, ...args) => {
		args = Array.from(args);
		args.unshift(colours.fg.blue, msg, colours.reset);
		xconsole.log.apply(xconsole, args);
	},
	'success': (msg, ...args) => {
		args = Array.from(args);
		args.unshift(colours.fg.green, msg, colours.reset);
		xconsole.log.apply(xconsole, args);
	},
}
global.console = console;

const HELPERS = {
	execute: (command, callback) => {
		console.info(`Executing command: ${command}`);
		const process = exec(command);
		process.stdout.on('data', (data) => {
			console.log(data.toString());
		});
		process.stderr.on('data', (data) => {
			console.log(data.toString());
		});
		process.on('exit', (code) => {
			console.log('Process exited with code ' + code.toString());
			if(code === 0) {
				if(typeof callback === 'function')
					callback(false, code);
			} else {
				if(typeof callback === 'function')
					callback(true, code);
			}
		});

		return process;
	},

	executeSync: (command, callback) => {
		console.info(`Executing command: ${command}`);
		try {
			return execSync(command).toString();
		} catch(error) {
			const code   = error.status,  // 0 : successful exit, but here in exception it has to be greater than 0
			      msg    = error.message, // Holds the message you typically want.
			      err    = error.stderr.toString(),  // Holds the stderr output. Use `.toString()`.
			      output = error.stdout.toString();  // Holds the stdout output. Use `.toString()`.

			console.log('Process exited with code ' + code.toString());
			if(code === 0) {
				if(typeof callback === 'function')
					callback(false, code);
			} else {
				if(typeof callback === 'function')
					callback(true, code);
			}
		}
	}
};

/**
 * Copy files recursively.
 *
 * @param {string} src  The path to the source file/directory to copy.
 * @param {string} dest The path to the destination file/directory.
 */
const copyRecursiveSync = (src, dest) => {
	const srcExists      = fs.existsSync(src),
	      destExists     = fs.existsSync(dest),
	      srcStats       = srcExists && fs.statSync(src),
	      isSrcDirectory = srcExists && srcStats.isDirectory();

	if(isSrcDirectory) {
		if(!destExists) {
			console.info(`Creating directory: "${dest}"...`);
			fs.mkdirSync(dest, {recursive: true});
		}
		fs.readdirSync(src).forEach(function(childItemName) {
			console.info(`Copying directory from: "${path.join(src, childItemName)}" to "${path.join(dest, childItemName)}"...`);
			copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	} else {
		if(srcExists) {
			const destDir = path.dirname(dest);
			if(!fs.existsSync(destDir)) {
				console.warn(`Destination directory doesn't exists!`);
				console.info(`Creating destination directory: "${destDir}"...`);
				fs.mkdir(destDir, {recursive: true}, err => {
					if(err) {
						const error = `[ERROR#${err.errno}]: ${err.name}: ${err.message}`
						console.error(`Failed to create directory: "${destDir}"!`, error, err.cause);
					} else {
						console.success(`Directory Created: "${destDir}"!`);
						console.info(`Copying file: "${src}" to "${dest}"...`);
						fs.copyFile(src, dest, () => console.success(`File copied to: "${dest}"!`));
					}
				});
			} else {
				console.info(`Copying file: "${src}" to "${dest}"...`);
				fs.copyFile(src, dest, () => console.success(`File copied to: "${dest}"!`));
			}
		}
	}
};

/***
 * Delete directory recursively.
 *
 * @param {string} path The path to the source directory to delete.
 * @param {string} [exclude=undefined] The path to exclude.
 * @param {string} [actualPath=undefined] The context to the path.
 */
const deleteFolderRecursive = (path, exclude, actualPath) => {
	actualPath = (actualPath === undefined || actualPath === null || actualPath === '') ? path : actualPath;

	if(fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
		fs.readdirSync(path).forEach(file => {
			const curPath = path + "/" + file;

			if(fs.lstatSync(curPath).isDirectory()) {
				// recurse
				deleteFolderRecursive(curPath, exclude, actualPath);
			} else {
				if(exclude !== undefined && !path.startsWith(exclude)) {
					console.error(`Cleaning directory "${path}"...`);
					// delete file
					fs.unlinkSync(curPath);
				}
			}
		});

		if(path !== actualPath) {
			if(exclude !== undefined && !path.startsWith(exclude)) {
				console.error(`Deleting directory "${path}"...`);
				fs.rmdirSync(path);
			}
		}
	} else {
		console.warn(`Directory "${path}" doesn't exists...`);
	}
};

const insertAt = (main_string, ins_string, pos, addIndents = 1) => {
	if(typeof (pos) === "undefined") {
		pos = 0;
	}
	if(typeof (ins_string) === "undefined") {
		ins_string = '';
	}
	if(addIndents > 0) {
		const rs = ins_string.split("\n");
		const indents = (addIndents > 1) ? "\t".repeat(addIndents) : "\t";
		ins_string = '';
		const l = rs.length;
		rs.forEach((line, i) => {
			if(i < (l - 1)) {
				line = (i > 0) ? indents + line : line;
				ins_string += line;
			}
		});
		ins_string += "\n" + indents;
	}
	let r = (main_string.length > 0) ? main_string.slice(0, pos) + ins_string + main_string.slice(pos) : main_string + ins_string;
	return r;
}

const insertFileAfter = (inputFile, search, file, isContent = false, addNL = true) => {
	fs.readFile(inputFile, (err, content) => {
		if(err)
			throw err;
		content = content.toString();
		const pos = content.indexOf(search);
		if(content === '') {
			console.error(`[insertFileAfter] The content of the file "${inputFile}" is empty!`);
		} else if(pos > -1) {
			if(isContent) {
				const newData = insertAt(content, file, pos, ((addNL) ? 1 : 0));
				fs.writeFile(inputFile, newData, err => {
					if(err) {
						const error = `[ERROR#${err.errno}]: ${err.name}: ${err.message}`
						console.error(`Failed to write to output file!`, error, err.cause);
					}
				});
			} else if(fs.existsSync(file)) {
				fs.readFile(file, (err, fileContent) => {
					fileContent = (addNL) ? fileContent.toString() + "\n" : fileContent.toString();
					const newData = insertAt(content, fileContent, pos, ((addNL) ? 1 : 0));
					fs.writeFile(inputFile, newData, err => {
						if(err) {
							const error = `[ERROR#${err.errno}]: ${err.name}: ${err.message}`
							console.error(`Failed to write to output file!`, error, err.cause);
						}
					});
				});
			}
		} else {
			console.error(`[insertFileAfter] Search string "${search}" could not be found on file "${inputFile}"!`);
		}
	});
}

const appendToFiles = (inputs, files) => {
	const search = `//FAHERE`;
	console.info('Appending FontAwesome...');
	if(Array.isArray(inputs)) {
		inputs.forEach(input => {
			if(fs.existsSync(input)) {
				if(Array.isArray(files)) {
					let content = '';
					for(let i = 0; i < files.length; i++) {
						const file = files[i];
						if(fs.existsSync(file)) {
							const data = fs.readFileSync(file).toString();
							content += os.EOL + data + os.EOL;
						}
					}
					content += os.EOL;
					insertFileAfter(input, search, content, true, (!input.endsWith('.min.js')));
				} else if(typeof files === 'string') {
					if(fs.existsSync(files)) {
						insertFileAfter(input, search, files, false, (!input.endsWith('.min.js')));
					}
				}
			} else {
				console.error('Input file: "${input}" could not be found!');
			}
		});
	} else if(typeof inputs === 'string') {
		if(fs.existsSync(inputs)) {
			if(Array.isArray(files)) {
				let content = '';
				files.forEach(file => {
					if(fs.existsSync(file)) {
						content += fs.readFileSync(file);
					}
				});
				insertFileAfter(input, search, content, true, (!input.endsWith('.min.js')));
			} else if(typeof files === 'string') {
				if(fs.existsSync(files)) {
					insertFileAfter(inputs, search, files, false, (!inputs.endsWith('.min.js')));
				}
			}
		} else {
			//console.error('Input file: "${input}" could not be found!');
		}
	}
}

const buildVersion = (version) => {
	return new Promise(resolve => {
		version.patch++;
		if(version.patch === 100) {
			version.minor++;
			version.patch = 0;
		}
		if(version.minor === 10) {
			version.major++;
			version.minor = 0;
		}

		version.build = getVersionBuildNumber(version.major, version.minor, version.patch, version.build);
		pkg.version = `${version.major}.${version.minor}.${version.patch}`;
		version.version = `${pkg.version} [build ${version.build}]`;

		fs.writeFile(`package.json`, JSON.stringify(pkg, null, '\t'), err => {
			if(err) {
				const error = `[ERROR#${err.errno}]: ${err.name}: ${err.message}`
				console.error(`Failed to write to package.json!`, error, err.cause);
			} else {
				resolve(version);
			}
		});
	});
}

const getVersionBuildNumber = (major = 0, minor = 0, patch = 0, build) => {
	/**
	 * for version: 0.1.1
	 * minor = (major * 10)
	 * patch = (minor * 100)
	 * build = (patch + minor + major)
	 *
	 * version: 0.1.0 => patch = 100; minor = 1; major = 0; build = 101
	 * version: 1.1.0 => patch = 1000; minor = 11; major = 1; build = 1022
	 */

	if(patch === 100) {
		minor++;
		patch = 0;
	}
	if(minor === 10) {
		major++;
		minor = 0;
	}

	const majorX = (major * 10),
	      minorX = (minor * 10),
	      patchX = (major > 0 || minor > 0) ? ((minorX * 100) + patch) : patch;

	build = ((major + minor) + (majorX + minorX + patchX));

	return build;
}

const createVersionInfo = () => {
	console.info(`Creating version information: "version.json" in "${BUILD_DIR}/"...`);

	buildVersion(version).then(versionInfo => {
		fs.writeFile(`${BUILD_DIR}/version.json`, JSON.stringify(versionInfo, null, '\t'), err => {
			if(err) {
				const error = `[ERROR#${err.errno}]: ${err.name}: ${err.message}`
				console.error(`Failed to version information!`, error, err.cause);
			} else {
				console.success(`Created: Version information!`);
			}
		});
	});
}

const createLoader = (variant) => {
	const regex0 = /const preload = \[[^\]]+\];/,
	      regex1 = /const styles = \[[^\]]+\];/,
	      regex2 = /const scripts = \[[^\]]+\];/,
	      regex3 = /script\[src\*=\\"SGNUIKit\.loader\.js\\"\]/igm;
	const replace0 = "const preload = [];";
	replace1 = (variant === 'umd.min' || variant === 'esm.min') ? "const styles = [\n\t\t\"css/SGNUIKit.min.css\",];" : "const styles = [\n\t\t\"css/SGNUIKit.css\",];",
		replace2 = (variant === 'esm') ? "const scripts = [\n\t\t\"js/SGNUIKit.esm.js\",];" :
		           ((variant === 'esm.min') ? "const scripts = [\n\t\t\"js/SGNUIKit.esm.min.js\",];" :
		            ((variant === 'umd.min') ? "const scripts = [\n\t\t\"js/SGNUIKit.umd.min.js\",];" :
		             "const scripts = [\n\t\t\"js/SGNUIKit.umd.js\",];")),
		replace3 = (variant === 'esm') ? 'script\[src\*=\\"SGNUIKit\.loader\.esm\.js\\"\]' :
		           ((variant === 'esm.min') ? 'script\[src\*=\\"SGNUIKit\.loader\.esm\.min\.js\\"\]' :
		            ((variant === 'umd.min') ? 'script\[src\*=\\"SGNUIKit\.loader\.umd\.min\.js\\"\]' :
		             'script\[src\*=\\"SGNUIKit\.loader\.umd\.js\\"\]'));

	const create = (variant) => {
		const buffer    = Buffer.from(SGNUIKitLoader, "base64"),
		      loaderStr = buffer.toString("utf8").replace(regex0, replace0).replace(regex1, replace1).replace(regex2, replace2).replace(regex3, replace3);

		console.info(`Creating SGNUIKit Loader: "loader.${variant}.js" in "${BUILD_JS_DIR}/"...`);
		fs.writeFile(`${BUILD_JS_DIR}/loader.${variant}.js`, loaderStr, err => {
			if(err) {
				const error = `[ERROR#${err.errno}]: ${err.name}: ${err.message}`
				console.error(`Failed to SGNUIKit Loader!`, error, err.cause);
			} else {
				console.success(`Created: SGNUIKit Loader!`);
			}
		});
	};

	if(typeof variant === 'undefined') {
		create('umd');
		create('umd.min');
		create('esm');
		create('esm.min');
	} else if(variant === 'umd' || variant === 'umd.min' || variant === 'esm' || variant === 'esm.min') {
		create(variant);
	}
}

module.exports = {
	colours, xconsole, console, fs, path, hasha, HELPERS,
	createVersionInfo, createLoader, copyRecursiveSync, deleteFolderRecursive, appendToFiles
};
