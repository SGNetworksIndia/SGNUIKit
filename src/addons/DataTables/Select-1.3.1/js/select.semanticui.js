/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

/*! Semanic UI styling wrapper for Select
 * ©2018 SpryMedia Ltd - datatables.net/license
 */

(function(factory) {
	if(typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-se', 'datatables.net-select'], function($) {
			return factory($, window, document);
		});
	} else if(typeof exports === 'object') {
		// CommonJS
		module.exports = function(root, $) {
			if(!root) {
				root = window;
			}

			if(!$ || !$.fn.dataTable) {
				$ = require('datatables.net-se')(root, $).$;
			}

			if(!$.fn.dataTable.select) {
				require('datatables.net-select')(root, $);
			}

			return factory($, root, root.document);
		};
	} else {
		// Browser
		factory(jQuery, window, document);
	}
}(function($, window, document, undefined) {

	return $.fn.dataTable;

}));