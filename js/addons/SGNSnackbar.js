;(function(factory) {
	'use strict';
	if(typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if(typeof exports !== 'undefined') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}
})(function($) {
	/**
	 * @param msg{string}
	 * @param block{boolean}
	 */
	const SGNSnackbar = function(msg, block = false) {
		const plugin = this;
		const $body     = $('body');
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

		plugin.show = () => {
			if($snackbar.length <= 0)
				init();
			else {
				if(!$snackbar.hasClass('show'))
					$snackbar.addClass('show');
			}
		};

		plugin.hide = () => {
			if($snackbar.length <= 0)
				init();
			else {
				if(!$snackbar.hasClass('show'))
					$snackbar.addClass('show');
			}
		};

		init();

		return plugin;
	}

	/**
	 * Creates a snackbar with the supplied message
	 *
	 * @param msg{string} The message to add to the snackbar
	 * @param block{boolean} If <b>true</b>, the snackbar will be taken the full-width considering some parameters.
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
});
