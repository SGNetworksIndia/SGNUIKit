/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const SGNConsole = function(hideSrc = true) {
	this.hideSrc = (hideSrc === undefined) ? true : hideSrc;
};

SGNConsole.prototype.log = function(message) {
	if(this.hideSrc)
		setTimeout(console.log.bind(window.console, "%c" + message, ...arguments));
	else
		console.log("%c" + message, ...arguments);
};
SGNConsole.prototype.debug = function(message) {
	if(this.hideSrc)
		setTimeout(console.debug.bind(window.console, "%c" + message, ...arguments));
	else
		console.debug("%c" + message, ...arguments);
};
SGNConsole.prototype.info = function(message) {
	if(this.hideSrc)
		setTimeout(console.info.bind(window.console, "%c" + message, ...arguments));
	else
		console.info("%c" + message, ...arguments);
};
SGNConsole.prototype.warn = function(message) {
	if(this.hideSrc)
		setTimeout(console.warn.bind(window.console, "%c" + message, ...arguments));
	else
		console.warn("%c" + message, ...arguments);
};
SGNConsole.prototype.error = function(message) {
	if(this.hideSrc)
		setTimeout(console.error.bind(console, '%c' + message, ...arguments));
	else
		console.error("%c" + message, ...arguments);
	exit();
};

const Console = new SGNConsole(true);