/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict"; // Start of use strict
if(typeof jQuery === "undefined") {
	throw new Error("SGNMultiPage requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	if(typeof $.fn.getCSSPath === "undefined") {
		$.fn.getCSSPath = function() {
			let $current = $(this),
			    path     = [],
			    realPath = "BODY";
			while($($current).prop("tagName") !== "BODY") {
				let index    = $($current).parent().find($($current).prop("tagName")).index($($current)),
				    name     = $($current).prop("tagName"),
				    selector = " " + name + ":eq(" + index + ")";
				path.push(selector);
				$current = $($current).parent();
			}
			while(path.length !== 0) {
				realPath += path.pop();
			}
			return realPath.toLowerCase();
		};
	}

	/**
	 * Creates an instance of <b>SGNMultiPage</b> and initiates <b>SGNMultiPage</b> for the elements having css class `.sgn-multi-page`.
	 *
	 * @param $elem{jQuery} The <b>SGNMultiPage</b> <b>jQuery</b> wrapped HTML DOM element having css class `.sgn-multi-page`.
	 *
	 * @returns {SGNMultiPage} <b>SGNMultiPage</b> object for method chaining.
	 *
	 * @constructor
	 */
	const SGNMultiPage = function($elem) {
		const plugin = this;
		const $pages = $elem.children(".page");

		const init = () => {
			const $toggles = $elem.find("[sgn-toggle=\"page\"], [sgn-data-toggle=\"page\"], [data-toggle=\"page\"]"),
			      $backBtn = select($pages.find(".page-back-btn"), $pages.find(".back-btn"));
			if($backBtn !== undefined && $backBtn.length > 0) {
				$backBtn.each(function() {
					const $heading = $(this).parents(".page-heading");
					if($heading.length > 0) {
						if(!$heading.hasClass("with-page-back-btn")) {
							$heading.addClass("with-page-back-btn");
						}
					}

					$(this).on("click", function(e) {
						e.preventDefault();
						const $this = $(this);

						const target  = select($this.attr("sgn-target"), $this.attr("sgn-data-target"), $this.data("target"), $this.attr("data-target")),
						      $target = select($(target), $pages.filter('.prev'));

						if($target.length === 1) {
							changePage(true, $target);
						}
					});
				});
			}
			if($toggles.length > 0) {
				$toggles.on("click", function(e) {
					e.preventDefault();

					const $this = $(this);

					const target  = select($this.attr("sgn-target"), $this.attr("sgn-data-target"), $this.data("target"), $this.attr("data-target")),
					      $target = $(target);

					if($target.length === 1) {
						changePage(false, $target);
					}
				});
			}

			$elem.data("SGNMultiPage", plugin);
			$elem[0]["SGNMultiPage"] = plugin;
		};

		const changePage = (prev = false, $target) => {
			const $current = $elem.children(".page.current");

			if(!prev) {
				if($target.length === 1) {
					$pages.removeClass("prev current");
					$current.addClass('prev');
					$target.addClass("current").data("target", $target.getCSSPath());
					setTimeout(() => $current.addClass('d-none'), 300);
				}
			} else {
				if($target.length === 1) {
					$pages.removeClass("d-none");
					setTimeout(() => {
						$pages.removeClass("d-none prev current");
						$target.addClass("current");
					}, 200);
				}
			}
		};

		plugin.switch = ($page, prev = false) => changePage(prev, $page);

		if($elem.length > 0 && $elem.hasClass("sgn-multi-page") && $pages.length > 0) {
			init();
		} else {
			throw new Error(`[SGNMultiPage] Failed to initialize SGNMultiPage: Invalid DOM element supplied or no pages defined.`);
		}

		return plugin;
	};

	/**
	 * Creates an instance of <b>jQuery.SGNMultiPage</b> and initiates <b>SGNMultiPage</b> for the elements having css class `.sgn-multi-page`.
	 *
	 * @return {jQuery.SGNMultiPage} Returns <b>jQuery.SGNMultiPage</b> object for method chaining.
	 */
	$.fn.SGNMultiPage = function() {
		const _this = this;

		_this.each(function() {
			const $this = $(this),
			      data  = $this.data("SGNMultiPage");

			const plugin = (data === undefined) ? new SGNMultiPage($this) : data;
			$this.data("SGNMultiPage", plugin);

			$this[0]["SGNMultiPage"] = plugin;
		});

		/**
		 * Switch around pages defined in <b>SGNMultiPage</b>
		 *
		 * @param {jQuery} $page The Page to switch to. A page is a <b>jQuery</b> wrapped HTML DOM element having css class `.page`, which are children of <b>SGNMultiPage</b>.
		 * @param {boolean} [prev=false] Specify whether to switch to previous page or not.
		 *
		 * @return {jQuery} Returns <b>jQuery</b> object for DOM chaining.
		 */
		_this.switch = ($page, prev = false) => {
			return _this.each(function() {
				const $this = $(this), plugin = $this.data("SGNMultiPage");
				$this.data("SGNMultiPage", plugin);

				if(plugin !== undefined) plugin.switch($page, prev);
			});
		};

		return _this;
	};

	SUKR(() => {
		const $elems = $(".sgn-multi-page");
		if($elems.length > 0 && $elems.hasClass("sgn-multi-page") && $elems.children('.page').length > 0)
			$elems.SGNMultiPage();
	});

	return this;
})(window, document, jQuery);
