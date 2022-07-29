/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function(factory) {
	if(typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-se', 'datatables.net-buttons'], function($) {
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

			if(!$.fn.dataTable.Buttons) {
				require('datatables.net-buttons')(root, $);
			}

			return factory($, root, root.document);
		};
	} else {
		// Browser
		factory(jQuery, window, document);
	}
}(function($, window, document, undefined) {
	'use strict';
	var DataTable = $.fn.dataTable;


	$.extend(true, DataTable.Buttons.defaults, {
		dom: {
			container: {
				className: 'dt-buttons ui basic buttons'
			},
			button: {
				tag: 'button',
				className: 'ui button'
			},
			collection: {
				tag: 'div',
				className: 'ui basic vertical buttons'
			}
		}
	});


	return DataTable.Buttons;
}));
