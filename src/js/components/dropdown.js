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

	/**
	 *
	 * @param {jQuery} $elem The <b>DOM Element</b> wrapped with <b>jQuery</b> where the <b>SGNDropdown</b> will be initialized.
	 * @param {boolean} isAccordion Specify whether to intialize as dropdown or accordion.
	 *
	 * @return {SGNDropdown} An instance of <b>SGNDropdown</b> if initialized.
	 *
	 * @constructor
	 */
	const SGNDropdown = function($elem, isAccordion = false) {
		const plugin = this;

		const init = () => {
			if(!$elem.parent("li").hasClass("dropdown")) {
				$elem.parent("li").addClass("dropdown");
			}
			if(isAccordion) {
				if(!$elem.parent("li").hasClass("accordion")) {
					$elem.parent("li").addClass("accordion");
				}
			}

			const $parent = $elem.parent("li.dropdown"),
			      $child  = $elem.next("ul"),
			      toggle  = select($elem.attr("sgn-toggle"), $elem.attr("data-sgn-toggle"), $elem.attr("data-toggle"), "click");

			if(toggle === "hover" || toggle === "mouseenter" || toggle === "mouseover") {
				let timeoutID;
				$elem.on(toggle, function(e) {
					e.preventDefault();
					const $this = $(this);
					if(!$parent.hasClass("on-hover")) {
						$this.toggleClass("active");
						$parent.toggleClass("active");
						$child.toggle("active");
					} else {
						clearTimeout(timeoutID);
						setTimeout(() => $parent.addClass("on-hover"), 100);
					}
				}, function(e) {
					e.preventDefault();
					const $this = $(this);
					if(!$parent.hasClass("on-hover")) {
						timeoutID = setTimeout(() => {
							$this.toggleClass("active");
							$parent.toggleClass("active");
							$child.toggle("active");
						}, 100);
					} else {
						clearTimeout(timeoutID);
						timeoutID = setTimeout(() => {
							$this.toggleClass("active");
							$parent.toggleClass("active");
							$child.toggle("active");
						}, 100);
					}
				});
				$child.on("mouseenter", function(e) {
					const $this = $(this);
					clearTimeout(timeoutID);
					$parent.addClass("on-hover");
				});
				$child.on("mouseleave", function(e) {
					const $this = $(this);
					clearTimeout(timeoutID);
					timeoutID = setTimeout(() => {
						$this.removeClass("active");
						$parent.removeClass("active");
						$child.toggle("active");
						$parent.removeClass("on-hover");
					}, 100);
				});
			} else {
				$elem.on(toggle, function(e) {
					e.preventDefault();
					const $this = $(this);
					$this.toggleClass("active");
					$parent.toggleClass("active");
					$child.toggle("active");
				});
			}

			if(isAccordion) {
				$elem.data("SGNAccordion", plugin);
				$elem[0]["SGNAccordion"] = plugin;
			} else {
				$elem.data("SGNDropdown", plugin);
				$elem[0]["SGNDropdown"] = plugin;
			}
		};

		const isDropdown = ($elem.hasClass("dropdown") || $elem.attr("sgn-component") === "dropdown" || $elem.attr("data-sgn-component") === "dropdown" || $elem.attr("data-component") === "dropdown");
		isAccordion = isAccordion || ($elem.hasClass("accordion") || $elem.attr("sgn-component") === "accordion" || $elem.attr("data-sgn-component") === "accordion" || $elem.attr("data-component") === "accordion");
		if($elem.length > 0 && (isDropdown || isAccordion)) {
			init();
		} else {
			throw new Error(`[SGNDropdown] Failed to initialize SGNDropdown: Invalid DOM element supplied.`);
		}

		return plugin;
	};

	/**
	 * Initialize <b>SGNDropdown</b> on the element.
	 *
	 * @return {jQuery} The <b>jQuery</b> to retain method chaining capabilities.
	 *
	 * @constructor
	 */
	$.fn.SGNDropdown = function() {
		return $(this).each(function() {
			const $_this = $(this),
			      data   = $_this.data("SGNDropdown");

			const plugin = (data === undefined) ? new SGNDropdown($_this) : data;

			$_this.data("SGNDropdown", plugin);
			$_this[0]["SGNDropdown"] = plugin;
		});
	};

	/**
	 * Initialize <b>SGNAccordion</b> on the element.
	 *
	 * @return {jQuery} The <b>jQuery</b> to retain method chaining capabilities.
	 *
	 * @constructor
	 */
	$.fn.SGNAccordion = function() {
		return $(this).each(function() {
			const $_this = $(this),
			      data   = $_this.data("SGNAccordion");

			const plugin = (data === undefined) ? new SGNDropdown($_this, true) : data;

			$_this.data("SGNAccordion", plugin);
			$_this[0]["SGNAccordion"] = plugin;
		});
	};

	SUKR(() => {
		const $dropdowns = $("[sgn-component=\"dropdown\"], [sgn-data-component=\"dropdown\"], [data-component=\"dropdown\"]");
		const $accordions = $("[sgn-component=\"accordion\"], [sgn-data-component=\"accordion\"], [data-component=\"accordion\"]");

		$dropdowns.SGNDropdown();
		$accordions.SGNAccordion();
	});
})(window, document, jQuery);
