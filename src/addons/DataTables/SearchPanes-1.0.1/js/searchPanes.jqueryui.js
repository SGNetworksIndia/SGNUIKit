/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

(function(factory) {
	if(typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-ju', 'datatables.net-searchpanes'], function($) {
			return factory($, window, document);
		});
	} else if(typeof exports === 'object') {
		// CommonJS
		module.exports = function(root, $) {
			if(!root) {
				root = window;
			}
			if(!$ || !$.fn.dataTable) {
				$ = require('datatables.net-ju')(root, $).$;
			}
			if(!$.fn.dataTable.searchPanes) {
				require('datatables.net-searchpanes')(root, $);
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
	$.extend(true, DataTable.SearchPane.classes, {
		disabledButton: 'dtsp-paneInputButton dtsp-dull',
		paneButton: 'dtsp-paneButton ui-button',
		topRow: 'dtsp-topRow ui-state-default'
	});
	$.extend(true, DataTable.SearchPanes.classes, {
		clearAll: 'dtsp-clearAll ui-button'
	});
	return DataTable.searchPanes;
}));
