/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const liveServer = require("live-server");

const params = {
	port: 8080, // Set the server port. Defaults to 8080.
	host: process.env.IP, // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
	root: "D:\\Libraries\\JS\\SGNetworks\\SGNUIKit\\demos", // Set root directory that's being served. Defaults to cwd.
	open: true, // When false, it won't load your browser by default.
	ignore: 'build,run.js,release,src/js/SGNUIKit.loader.js', // comma-separated string for paths to ignore
	//file: "switch.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
	wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
	mount: [['/components', './node_modules'], ['/dist', './dist'], ['/src', './src']], // Mount a directory to a route.
	logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
	middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};

liveServer.start(params);