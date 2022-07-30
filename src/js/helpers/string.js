/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

String.prototype.format = function() {
	let s = [...arguments].reduce((p, c) => p.replace(/%s/, c), this);
	s = [...arguments].reduce((p, c) => p.replace(/%d/, c), s);
	s = [...arguments].reduce((p, c) => p.replace(/%f/, c), s);

	return s;
};
String.prototype.guid = function() {

};

String.prototype.ltrim = function(s) {
	return this.replace(new RegExp("^" + s + "*"), '');
};
String.prototype.rtrim = function(s) {
	return this.replace(new RegExp(s + "*$"), '');
};

$.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
	arg = arg.trim();
	return function(elem) {
		return $(elem).text().trim().match("^" + arg + "$");
	}
});