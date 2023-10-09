/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

if(typeof jQuery === "undefined") {
	throw new Error("SGNTabLayout requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	/**
	 *
	 * @param {jQuery} $elem The <b>DOM Element</b> wrapped with <b>jQuery</b> where the <b>SGNTabLayout</b> will be initialized.
	 *
	 * @return {SGNTabLayout} An instance of <b>SGNTabLayout</b> if initialized.
	 *
	 * @constructor
	 */
	const SGNTabLayout = function($elem) {
		const plugin = this;
		const $tabLinks   = $elem.children('.tab-links'),
		      $tabView    = $elem.children('.tab-view'),
		      $tabLink    = $tabLinks.children(`.tab-link`),
		      $tab        = $tabView.children(`.tab`),
		      $activeLink = $tabLinks.children(`.tab-link.active`),
		      $activeTab  = $tabView.children(`.tab.active`),
		      $activeElem = $activeLink || $activeTab;


		const init = () => {
			if($activeElem.length > 0) {
				if($activeLink.length === 1) {
					const targetTab  = $activeLink.attr('sgn-target-tab') || $activeLink.attr('data-target-tab'),
					      $targetTab = ($tabView.children(`.tab[sgn-tab="${targetTab}"]`).length > 0) ? $tabView.children(`.tab[sgn-tab="${targetTab}"]`) : $tabView.children(`.tab[data-tab="${targetTab}"]`);

					if(!$targetTab.hasClass('active'))
						$targetTab.addClass('active');
				} else if($activeTab.length === 1) {
					const targetLink  = $activeTab.attr('sgn-tab') || $activeTab.attr('data-tab'),
					      $targetLink = ($tabView.children(`.tab[sgn-tab="${targetLink}"]`).length > 0) ? $tabView.children(`.tab[sgn-tab="${targetLink}"]`) : $tabView.children(`.tab[data-tab="${targetLink}"]`);

					if(!$targetLink.hasClass('active'))
						$targetLink.addClass('active');
				}
			} else {
				$tabLink.first().addClass('active');
				$tab.first().addClass('active');
			}

			$tabLink.each(function() {
				const $_this = $(this);

				const targetTab = $_this.attr('sgn-target-tab') || $_this.attr('data-target-tab'),
				      target    = $_this.attr('sgn-target') || $_this.attr('data-target');
				const $targetTab = ($tabView.children(`.tab[sgn-tab="${targetTab}"]`).length > 0) ? $tabView.children(`.tab[sgn-tab="${targetTab}"]`) : $tabView.children(`.tab[data-tab="${targetTab}"]`),
				      $target    = $(target);

				if($target.length > 0 || $targetTab.length > 0) {
					$_this.on('click', function(e) {
						e.preventDefault();

						const $this = $(this);
						$tabView.children(`.tab.active`).toggle(500);

						setTimeout(() => {
							if($targetTab.length > 0)
								$tabLink.removeClass('active');
							$tab.removeClass('active');

							$targetTab.toggle(500, function() {
								$this.addClass('active');
								$(this).addClass('active');
							});
						}, 500);
					});
				}
			});

			$elem.data("SGNTabLayout", plugin);
			$elem[0]["SGNTabLayout"] = plugin;
		}

		if($elem.length > 0 && ($elem.hasClass('tab-layout') || $elem.attr('sgn-component') || $elem.attr('data-sgn-component') || $elem.attr('data-component')))
			init();
		else
			throw new Error(`[SGNTabLayout] Failed to initialize SGNTabLayout: Invalid DOM element supplied.`);

		return plugin;
	};

	/**
	 * Initialize <b>SGNTabLayout</b> on the element.
	 *
	 * @return {jQuery} The <b>jQuery</b> to retain method chaining capabilities.
	 *
	 * @constructor
	 */
	$.fn.SGNTabLayout = function() {
		return $(this).each(function() {
			const $this = $(this),
			      data  = $this.data("SGNTabLayout");

			const plugin = (data === undefined) ? new SGNTabLayout($this) : data;

			$this.data("SGNTabLayout", plugin);
			$this[0]["SGNTabLayout"] = plugin;
		});
	};

	SUKR(() => {
		const $tab = $('[sgn-component="tab"], [data-sgn-component="tab"], [data-component="tab"]') || $('.tab-layout');
		$tab.SGNTabLayout();
	});
})(window, document, jQuery);
