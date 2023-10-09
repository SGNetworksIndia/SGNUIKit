/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict"; // Start of use strict
if(typeof jQuery === "undefined") {
	throw new Error("SGNSnackbar requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	/**
	 * Creates a snackbar with the supplied message
	 *
	 * @param {string} msg The message to add to the snackbar
	 * @param {boolean} [block=false] If <b>true</b>, the snackbar will be taken the full-width considering some parameters.
	 */
	const SGNSnackbar = function(msg, block = false) {
		const plugin = this;
		const $body = $('body');
		let $snackbar = $body.children('.sgn-snackbar');

		function init() {
			const $html = `<div class="sgn-snackbar">${msg}</div>`;

			if($snackbar.length <= 0) {
				$body.append($html);
				$snackbar = $body.children('.sgn-snackbar');
			} else {
				$snackbar.html(msg);
			}

			if(block) {
				if(!$snackbar.hasClass('block'))
					$snackbar.addClass('block');
			}
		}

		plugin.show = (duration) => {
			duration = (duration !== true && !$.isNumeric(duration)) ? undefined : duration;
			duration = (duration !== true && !$.isNumeric(duration) && duration === undefined) ? 5000 : duration;
			duration = (duration === true) ? null : duration;

			if($snackbar.length <= 0)
				init();
			else {
				if(!$snackbar.hasClass('show'))
					$snackbar.addClass('show');
			}

			if(duration !== null) {
				setTimeout(function() {
					plugin.hide();
				}, duration);
			}
		};

		plugin.hide = () => {
			if($snackbar.length > 0) {
				if($snackbar.hasClass('show'))
					$snackbar.removeClass('show');
			}
		};

		init();

		return plugin;
	}

	/**
	 * Creates a snackbar with the supplied message
	 *
	 * @param {string} msg The message to add to the snackbar
	 * @param {boolean} [block=false] If <b>true</b>, the snackbar will be taken the full-width considering some parameters.
	 */
	$.SGNSnackbar = function(msg, block = false) {
		const _this = this;

		const plugin = new SGNSnackbar(msg, block);

		/**
		 * Show a built snackbar
		 */
		_this.show = function() {
			plugin.show();
		}

		/**
		 * Hide a snackbar
		 */
		_this.hide = function() {
			plugin.hide();
		}

		return _this;
	};
})(window, document, jQuery);
