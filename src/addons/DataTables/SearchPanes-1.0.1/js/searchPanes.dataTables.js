/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

(function(factory) {
	if(typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-dt', 'datatables.net-searchPanes'], function($) {
			return factory($, window, document);
		});
	} else if(typeof exports === 'object') {
		// CommonJS
		module.exports = function(root, $) {
			if(!root) {
				root = window;
			}
			if(!$ || !$.fn.dataTable) {
				$ = require('datatables.net-dt')(root, $).$;
			}
			if(!$.fn.dataTable.searchPanes) {
				require('datatables.net-searchPanes')(root, $);
			}
			return factory($, root, root.document);
		};
	} else {
		// Browser
		factory(jQuery, window, document);
	}
}(function($, window, document) {
	'use strict';
	var DataTable = $.fn.dataTable;
	return DataTable.searchPanes;
}));
