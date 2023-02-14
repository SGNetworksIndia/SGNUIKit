/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
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
	return this.replace(new RegExp("^" + s + "*"), "");
};
String.prototype.rtrim = function(s) {
	return this.replace(new RegExp(s + "*$"), "");
};

/***
 * Replace all occurrences of the search string with the replacement string.
 * <br>
 * This function returns a <b>string</b> with all occurrences of search in <b><i>subject</i></b> replaced with the given <b><i>replace</i></b> value.
 *
 * @param {string|array}search The value being searched for, otherwise known as the needle. An array may be used to designate multiple needles.
 * @param {string|array}replace The replacement value that replaces found search values. An array may be used to designate multiple replacements.
 * @param {boolean}caseSensitive Specify if the searching would be case-sensitive or not.
 *
 * @returns {string} A <b>string</b> with the replaced values.
 */
String.prototype.str_replace = function(search, replace, caseSensitive = true) {
	let v = this;

	function getIndicesOf(needle, haystack) {
		const searchStrLen = needle.length;
		if(searchStrLen === 0) {
			return [];
		}
		let startIndex = 0, index, indices = [];
		if(!caseSensitive) {
			haystack = haystack.toLowerCase();
			needle = needle.toLowerCase();
		}
		while((index = haystack.indexOf(needle, startIndex)) > -1) {
			indices.push(index);
			startIndex = index + searchStrLen;
		}
		return indices;
	}

	if(typeof search === 'object' && typeof replace === 'object') {
		search.forEach((s, i) => {
			const r = replace[i];
			v = v.replace(s, r);
		});
	} else if(typeof search === 'object' && (typeof replace === 'string' || typeof replace === 'number')) {
		search.forEach(s => v = v.replace(s, replace));
	} else if((typeof search === 'string' || typeof search === 'number') && typeof replace === 'object') {
		let indices = getIndicesOf(search, v);
		indices.forEach((k, i) => {
			const s = search[k],
			      r = replace[i];
			v = v.replace(s, r);
		});
		v = v.replace(search, replace);
	} else if((typeof search === 'string' || typeof search === 'number') && (typeof replace === 'string' || typeof replace === 'number')) {
		v = v.replace(search, replace);
	}

	return v;
};

/**
 * Convert a string to HTML entities
 */
String.prototype.toHtmlEntities = function() {
	return escapeHTML(this);
};

/**
 * Create string from HTML entities
 */
String.fromHtmlEntities = function(string) {
	return (string + "").replace(/&#\d+;/gm, function(s) {
		return String.fromCharCode(s.match(/\d+/gm)[0]);
	});
};

$.expr[":"].textEquals = $.expr.createPseudo(function(arg) {
	arg = arg.trim();
	return function(elem) {
		return $(elem).text().trim().match("^" + arg + "$");
	};
});
