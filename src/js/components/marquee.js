/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

if(typeof jQuery === "undefined") {
	throw new Error("marquee requires jQuery");
}

;(function(window, document, $) {
	"use strict";
	$.fn.marquee = function(duration, direction) {
		return this.each(function() {
			const $this = $(this);

			$this.wrapInner('<div class="sgn-marquee"/>');
			const $marquee = $this.children('.sgn-marquee');
			$marquee.clone(true).appendTo($this);

			$this.wrapInner('<div class="sgn-marquee-wrapper"/>');
		});
	};
})(window, document, jQuery);