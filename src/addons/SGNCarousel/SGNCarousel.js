/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

//"use strict"; // Start of use strict
// @ts-ignore
if(typeof jQuery === "undefined") {
	throw new Error("SGNCarousel requires jQuery");
}

;(function(window, document, $) {
	"use strict";
	/**
	 * @typedef {Object} SGNCarouselOptions The options for <b>SGNCarousel</b>
	 *
	 * @property {boolean} [autoplay=true] If <b>FALSE</b>, the carousel will not start as soon as it's ready, instead the <b>SGNCarousel.play()</b> method needs to be invoked explicitly on the <b>SGNCarousel</b> instance.<br>[DEFAULT: <b>TRUE</b>]
	 * @property {boolean} [indicators=true] If <b>FALSE</b>, the <b>SGNCarousel</b> will not generate the indicators.<br>[DEFAULT: <b>TRUE</b>]
	 * @property {boolean} [controls=true] If set to <b>FALSE</b>, the <b>SGNCarousel</b> will not generate the carousel controls (Next/Previous buttons).<br>[DEFAULT: <b>TRUE</b>]
	 * @property {boolean} [rollover=true] If set to <b>FALSE</b>, the carousel will stop when reached the end item, in this case, the <b>SGNCarousel</b>.<br>[DEFAULT: <b>TRUE</b>]
	 * @property {number} [duration=5000]  Specify the interval of time in <i>milliseconds</i> to show each item of the <b>SGNCarousel</b> for, by default each item will be show for <i>5 seconds</i>.
	 */

	/**
	 * Creates a new instance of <b>SGNCarousel</b> with the supplied options if not created or returns the old instance.
	 *
	 * @param {jQuery} $carousel The carousel container with CSS class 'carousel'.
	 * @param {SGNCarouselOptions} [options={}] The options to override the default settings of <b>SGNCarousel</b>.
	 *
	 * @return {SGNCarousel} A new instance of <b>SGNCarousel</b> if not created be fore for the element. Otherwise, the previously created instance of <b>SGNCarousel</b>.
	 *
	 * @constructor
	 */
	const SGNCarousel = function($carousel, options) {
		const plugin = this;
		const $_this = $carousel;
		const $items = $_this.children('.carousel-item');
		let itemCount = 0, $wrapper, $indicators, interval;
		/***
		 *
		 * @type {{duration: number, controls: boolean, rollover: boolean, indicators: boolean, autoplay: boolean}}
		 */
		plugin.settings = {
			autoplay: true,
			indicators: true,
			controls: true,
			rollover: true,
			duration: 5000
		};

		const GUID = (uppercase = true, hyphen = true) => {
			let result, i, j;
			result = '';
			for(j = 0; j < 32; j++) {
				if(hyphen && (j === 8 || j === 12 || j === 16 || j === 20)) result = result + '-';
				i = Math.floor(Math.random() * 16).toString(16);
				i = (uppercase) ? i.toUpperCase() : i.toLowerCase();
				result = result + i;
			}
			return result;
		}

		/***
		 * @type {string} guid The <b>GUID</b> of the <b>SGNCarousel</b> instance.
		 */
		plugin.guid = GUID();

		const init = () => {
			itemCount = $items.length;

			const autoplayAttr   = select($_this.attr('sgn-carousel-autoplay'), $_this.attr('data-carousel-autoplay'), $_this.attr('autoplay')),
			      indicatorsAttr = select($_this.attr('sgn-carousel-indicators'), $_this.attr('data-carousel-indicators')),
			      controlsAttr   = select($_this.attr('sgn-carousel-controls'), $_this.attr('data-carousel-controls')),
			      rolloverAttr   = select($_this.attr('sgn-carousel-rollover'), $_this.attr('data-carousel-rollover')),
			      durationAttr   = select($_this.attr('sgn-carousel-duration'), $_this.attr('data-carousel-duration'));

			if(autoplayAttr !== undefined)
				options.autoplay = autoplayAttr;
			if(indicatorsAttr !== undefined)
				options.indicators = indicatorsAttr;
			if(controlsAttr !== undefined)
				options.controls = controlsAttr;
			if(rolloverAttr !== undefined)
				options.rollover = rolloverAttr;
			if(durationAttr !== undefined)
				options.duration = durationAttr;

			$.extend(plugin.settings, options);

			$wrapper = $_this.parents('.sgn-carousel');
			if($wrapper.length <= 0) {
				$carousel.wrap(`<div class="sgn-carousel"/>`);
				$wrapper = $carousel.parent('.sgn-carousel');
			}

			const prevControlHTML = `<div class="sgn-carousel-control previous"></div>`,
			      nextControlHTML = `<div class="sgn-carousel-control next"></div>`,
			      indicatorHTML   = `<ul class="sgn-carousel-indicators"></ul>`;
			let $prevControl = $wrapper.children('.sgn-carousel-control.previous'),
			    $nextControl = $wrapper.children('.sgn-carousel-control.next'),
			    $indicator   = $wrapper.children('.sgn-carousel-indicators');
			$indicators = $indicator.children('.sgn-carousel-indicator');

			if($prevControl.length > 0)
				$prevControl.remove();
			if($indicator.length > 0)
				$indicator.remove();
			if($nextControl.length > 0)
				$nextControl.remove();

			const $active = ($items.filter('.active').length === 0) ? $items.first() : $items.filter('.active'),
			      target  = $active.attr('id');
			if(!$active.hasClass('active'))
				$active.addClass('active');

			if(itemCount > 1) {
				if(plugin.settings.controls && $prevControl.length < 1) {
					$wrapper.prepend(prevControlHTML);
					$prevControl = $wrapper.children('.sgn-carousel-control.previous');
				}
				if(plugin.settings.indicators && $indicator.length < 1) {
					$wrapper.append(indicatorHTML);
					$indicator = $wrapper.children('.sgn-carousel-indicators');
				}
				if(plugin.settings.controls && $nextControl.length < 1) {
					$wrapper.append(nextControlHTML);
					$nextControl = $wrapper.children('.sgn-carousel-control.next');
				}

				let indicatorsHTML = '';
				$.each($items, function() {
					const $item = $(this);
					const id = $item.attr('id') || GUID();

					$item.attr('id', id);
					indicatorsHTML += `<li class="sgn-carousel-indicator" data-target="${id}"><a class="sgn-carousel-indicator-link"></a></li>`;
				});

				if(plugin.settings.indicators) {
					$indicator.html(indicatorsHTML);
					$indicators = $indicator.children('.sgn-carousel-indicator');
				} else {
					$indicators = $indicator.children('.sgn-carousel-indicator');
				}

				const $target = $indicators.filter(`[data-target="${target}"]`);

				$target.addClass('active');

				bindEvents($nextControl, $prevControl);
				if(plugin.settings.autoplay) plugin.play(plugin.settings.duration);
			}
		}

		const bindEvents = ($nextControl, $prevControl) => {
			const id = `sgn-carousel-${plugin.guid}`;

			$prevControl.on('click', function(e) {
				e.preventDefault();
				plugin.prev();
			}, id);

			$nextControl.on('click', function(e) {
				e.preventDefault();
				plugin.next();
			}, id);

			$indicators.on('click', function(e) {
				e.preventDefault();
				const $this = $(this), target = $this.attr('data-target'), $target = $_this.children(`#${target}`);

				$items.removeClass('active');
				$indicators.removeClass('active');
				if(!$target.hasClass('active')) $target.addClass('active');
				$this.addClass('active');
			}, id);
		};

		/***
		 * Play the <b>SGNCarousel</b> and show each item for a specific interval of time in <i>milliseconds</i>.
		 *
		 * @param {number} [duration=5000] Specify the interval of time in <i>milliseconds</i> to show each item of the <b>SGNCarousel</b> for, by default each item will be show for <i>5 seconds</i>..<br/>
		 */
		plugin.play = (duration = 5000) => {
			duration = duration || 5000;

			interval = setInterval(() => {
				plugin.next();
			}, duration);
		}

		/***
		 * Pause the <b>SGNCarousel</b> <i>indefinitely</i> or for a specific interval of time in <i>milliseconds</i>.
		 *
		 * @param {number} [duration=10000] Specify the interval of time in <i>milliseconds</i> to pause the <b>SGNCarousel</b> for.<br/><br/>
		 * If the <b><i>duration</i></b> is not specified, then calling <b>SGNCarousel.pause()</b> will pause the <b>SGNCarousel</b> for <i>10 seconds</i>.
		 * <br/><br/>
		 * And if <b><i>duration</i></b> is less than or equal to <i>0 (zero)</i> then it will pause <b>SGNCarousel</b> <i>indefinitely</i> until called the <b>SGNCarousel.play()</b> method.
		 */
		plugin.pause = (duration = 10000) => {
			clearInterval(interval);
			if(typeof duration === 'number' && duration > 0) setTimeout(() => plugin.play(plugin.settings.duration), duration);
		}

		/***
		 * Show the previous carousel item.<br>If <b><i>SGNCarouselOptions.rollover</i></b> is set to <b>TRUE</b> then, if the there's no carousel items before the current item, the carousel will restart from the ending position.
		 */
		plugin.prev = () => {
			const $active = $items.filter('.active'),
			      $prev   = ($active.prev().length === 0) ? $items.last() : $active.prev(),
			      target  = $prev.attr('id'),
			      $target = $indicators.filter(`[data-target="${target}"]`);

			$active.addClass('item-next').removeClass('active');
			$prev.addClass('item-prev');
			$indicators.removeClass('active');

			setTimeout(() => {
				if(!$prev.hasClass('active'))
					$prev.addClass('active');
			}, 0);

			setTimeout(() => {
				if(!$target.hasClass('active'))
					$target.addClass('active');
				$items.removeClass('item-prev item-next');
			}, 1000);
		}

		/***
		 * Show the next carousel item.<br>If <b><i>SGNCarouselOptions.rollover</i></b> is set to <b>TRUE</b> then, if the there's no carousel items after the current item, the carousel will restart from the starting position.
		 */
		plugin.next = () => {
			const $active = $items.filter('.active'),
			      $next   = ($active.next().length === 0) ? $items.first() : $active.next(),
			      target  = $next.attr('id'),
			      $target = $indicators.filter(`[data-target="${target}"]`);

			$active.addClass('item-prev').removeClass('active');
			$next.addClass('item-next');
			$indicators.removeClass('active');

			setTimeout(() => {
				if(!$next.hasClass('active'))
					$next.addClass('active');
			}, 0);

			setTimeout(() => {
				if(!$target.hasClass('active'))
					$target.addClass('active');
				$items.removeClass('item-prev item-next');
			}, 1000);
		}

		/***
		 * Reset the <b>SGNCarousel</b> to the starting position.
		 */
		plugin.reset = () => {
			const $active = $items.filter('.active'),
			      $first  = $items.first(),
			      target  = $first.attr('id'),
			      $target = $indicators.filter(`[data-target="${target}"]`);

			$active.addClass('item-next').removeClass('active');
			$first.addClass('item-prev');
			$indicators.removeClass('active');

			setTimeout(() => {
				if(!$first.hasClass('active'))
					$first.addClass('active');
			}, 0);

			setTimeout(() => {
				if(!$target.hasClass('active'))
					$target.addClass('active');
				$items.removeClass('item-prev item-next');
			}, 1000);
		}

		/***
		 * Set current carousel item.
		 *
		 * @param {string} id The <b><i>ID</i></b> of the carousel item.
		 */
		plugin.setCurrent = (id) => {
			id = (empty(id)) ? '' : id;
			const $active = $items.filter('.active'),
			      $search = ($items.filter(`[id="${id}"]`).length === 0) ? $active : $items.filter(`[id="${id}"]`),
			      target  = $search.attr('id'),
			      $target = $indicators.filter(`[data-target="${target}"]`);

			$active.addClass('item-next').removeClass('active');
			$search.addClass('item-prev');
			$indicators.removeClass('active');

			setTimeout(() => {
				if(!$search.hasClass('active'))
					$search.addClass('active');
			}, 0);

			setTimeout(() => {
				if(!$target.hasClass('active'))
					$target.addClass('active');
				$items.removeClass('item-prev item-next');
			}, 1000);
		}

		init();

		return plugin;
	}

	/**
	 * Initializes a SGNCarousel on the element with the supplied options.
	 *
	 * @param {SGNCarouselOptions}[options={}] A JSON object specifying the options.
	 *
	 * @return {jQuery} The jQuery object
	 */
	$.fn.SGNCarousel = function(options) {
		const _this = this, $_this = $(_this);

		return $_this.each(function() {
			const $this = $(this), data = $this.data("SGNCarousel");

			const plugin = (data === undefined) ? new SGNCarousel($this, options) : data;
			$this.data("SGNCarousel", plugin);
			$this[0]["SGNCarousel"] = plugin;
		});
	};

	SUKR(() => {
		const $carousel = $('.carousel');

		if($carousel.length > 0) {
			$carousel.SGNCarousel();
		}
	});

	return this;
})(window, document, jQuery);
