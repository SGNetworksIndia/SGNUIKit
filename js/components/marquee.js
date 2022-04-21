;(function(factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports !== 'undefined') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}
})(function($) {
	$.fn.marquee = function(duration, direction) {
		return this.each(function() {
			const $this = $(this);

			$this.wrapInner('<div class="sgn-marquee"/>');
			const $marquee = $this.children('.sgn-marquee');
			$marquee.clone(true).appendTo($this);

			$this.wrapInner('<div class="sgn-marquee-wrapper"/>');
		});
	};
});