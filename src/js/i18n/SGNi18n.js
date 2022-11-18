/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

;(function(global, factory) {
	if(typeof define === 'function' && define.amd) {
		define([], factory(global));
	} else if(typeof module === "object" && typeof module.exports === "object") {
		module.exports = factory(global);
	} else {
		factory(global);
	}
})(typeof global !== 'undefined' ? global : window || this.window || this.global, function(window, noGlobal) {
	'use strict';

	/**
	 * Create an instance of <b>SGNi18n</b> with the supplied SGNi18n language object and DOM Element.
	 *
	 * @param {JSON}[language] The SGNi18n language JSON object.
	 * @param {HTMLElement|HTMLDocument|jQuery}[$element] The element to process.
	 *
	 * @return {SGNi18n} An instance of <b>SGNi18n</b>.
	 */
	const SGNi18n = function(language, $element) {
		const _this = this,
			  regex = /{{(\w+)(\(((([\w\d]+), ?)*('.*?')*)\))?}}/gi;
		this.language = language;
		this.context = $element;

		this.refresh = () => {
			if(_this.context !== undefined && _this.context.length > 0) {
				if(_this.context[0].nodeName !== 'HTML') {
					walkText(document.getElementsByTagName('title')[0]);
				}
				walkText(_this.context[0]);
			}
		}

		this.setContext = ($element) => {
			this.context = $element;

			return _this;
		}

		this.setLanguage = (language) => {
			this.language = language;

			return _this;
		}

		this.getString = (key, ...args) => {
			if(this.language.hasOwnProperty(key)) {
				let value = (args !== undefined && args !== null) ? _this.language[key].format(...args) : _this.language[key];
				if(regex.test(value)) {
					const matches = getMatches(value, regex);

					if(matches !== null) {
						const match = matches[0][1];

						value = (match !== key) ? process(value) : value;
					}
				}
				return value;
			} else {
				return `${key}_not_defined`;
			}
		}

		function getMatches(string, regex, index) {
			//index || (index = 1); // default to the first capturing group
			const matches = [];
			let match;
			regex.lastIndex = 0;
			while(match = regex.exec(string)) {
				if(index)
					matches.push(match[index]);
				else
					matches.push(match);
			}
			return matches;
		}

		function process(str) {
			str = str.replace(regex, function(match, varname, p3, p4, p5, p6, p7) {
				if(varname !== str) {
					let args   = p4,
						params = p7;
					if(params !== undefined && params !== null) {
						params = params.replaceAll(',', '{%COMMA%}');
						args = args.replaceAll(p7, params);

						args = args.replaceAll(',', '{%SEMICOLON%}');
						args = args.replaceAll(/\s?{%SEMICOLON%}\s?/g, ';');
						args = args.replaceAll(/{%COMMA%}/g, ',');
					}

					if(args !== undefined && args !== null) {
						args = args.split(';');
						return _this.getString(varname, ...args);
					}
					return _this.getString(varname);
				}
			});

			return str;
		}

		function walkText(node) {
			if(node.nodeType === 3) {
				node.data = process(node.data);
			}
			if(node.nodeType === 1) {
				if(node.attributes['sgn-input-group-label'] !== undefined)
					node.attributes['sgn-input-group-label'].value = process(node.attributes['sgn-input-group-label'].value);
				if(node.attributes['sgn-input-group-help'] !== undefined)
					node.attributes['sgn-input-group-help'].value = process(node.attributes['sgn-input-group-help'].value);
				if(node.attributes['title'] !== undefined)
					node.attributes['title'].value = process(node.attributes['title'].value);
				if(node.attributes['data-next-button'] !== undefined)
					node.attributes['data-next-button'].value = process(node.attributes['data-next-button'].value);
				if(node.attributes['data-prev-button'] !== undefined)
					node.attributes['data-prev-button'].value = process(node.attributes['data-prev-button'].value);
			}
			if(node.nodeType === 1 && (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA')) {
				node.placeholder = process(node.placeholder);
				node.value = process(node.value);
			}
			if(node.nodeType === 1 && node.nodeName !== "SCRIPT") {
				for(let i = 0; i < node.childNodes.length; i++) {
					walkText(node.childNodes[i]);
				}
			}
		}

		this.refresh();

		return this;
	}


	if(typeof noGlobal === "undefined") {
		window.SGNi18n = SGNi18n;
	}

	return SGNi18n;
});


