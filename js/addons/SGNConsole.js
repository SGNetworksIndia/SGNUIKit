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