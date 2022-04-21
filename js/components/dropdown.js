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
	$.fn.SGNDropdown = function() {
		return this.each(function() {
			const $_this = $(this);
			const $parent = $_this.parent('li.dropdown'),
				  $child = $_this.next('ul');

			$_this.on('click', function(e) {
				e.preventDefault();
				const $this = $(this);
				$this.toggleClass('active');
				$parent.toggleClass('active');
				$child.toggle('active');
			});
		});
	};

	$(document).ready(function() {
		const $dropdowns = $('[data-toggle="dropdown"]');
		$dropdowns.SGNDropdown();
	});
});