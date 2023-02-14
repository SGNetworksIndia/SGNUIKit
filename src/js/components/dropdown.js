/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

if(typeof jQuery === "undefined") {
	throw new Error("SGNDropdown requires jQuery");
}

;(function(window, document, $) {
	"use strict";
	$.fn.SGNDropdown = function() {
		return this.each(function() {
			const $_this = $(this);

			if(!$_this.parent('li').hasClass('dropdown')) {
				$_this.parent('li').addClass('dropdown');
			}

			const $parent = $_this.parent('li.dropdown'),
				  $child  = $_this.next('ul');

			$_this.on('click', function(e) {
				e.preventDefault();
				const $this = $(this);
				$this.toggleClass('active');
				$parent.toggleClass('active');
				$child.toggle('active');
			});
		});
	};

	SUKR(() => {
		const $dropdowns = $('[data-toggle="dropdown"]');
		$dropdowns.SGNDropdown();
	});
})(window, document, jQuery);
