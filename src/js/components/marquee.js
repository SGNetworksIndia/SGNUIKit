/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

if(typeof jQuery === "undefined") {
	throw new Error("SGNMarquee requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	/***
	 * Initialize <b>SGNMarquee</b> on the element identified by <b><i>$elem</i></b>.
	 *
	 * @param {jQuery} $elem The <b>DOM Element</b> wrapped with <b>jQuery</b> where the <b>SGNMarquee</b> will be initialized.
	 * @param {number} [duration=5000] Specify the duration (in milliseconds) of how long should the marquee take to complete its full revolution. By default, it is set to 5000 (5 seconds).
	 * @param {"left"|"right"|"top"|"bottom"} [direction='left'] Specify the direction of the marquee.
	 * @param {boolean} [force=false] If <b>TRUE</b>, the marquee will be generated regardless of the necessity.
	 *
	 * @return {SGNMarquee} An instance of <b>SGNMarquee</b> if initialized.
	 */
	const SGNMarquee = function($elem, duration = 5000, direction = "left", force = false) {
		const plugin = this;

		const directions = [
			"left", "right",
			"top", "bottom",
		];
		const isDurationSpecified = (typeof duration === 'number');
		const sDir = direction;
		duration = (!isDurationSpecified) ? 5000 : duration;
		direction = ($.inArray(direction, directions) !== -1) ? direction : "left";

		const getTextWidth = (text, $elem, styles) => {
			text = (!empty(text)) ? text : $elem.text();
			const isObjectJSON = function(obj) {
				return obj && typeof obj === "object" && !Array.isArray(obj);
			};

			//const element0 = document.createElement('div');
			const element = document.createElement("div");
			if(isObjectJSON(styles)) {
				const styleKeys = Object.keys(styles);
				let i = 0, n = styleKeys.length;
				for(; i < n; ++i) {
					element.style[styleKeys[i]] = styles[styleKeys[i]];
				}
			}
			element.style.display = "inline-block";
			element.innerHTML = text;

			let width;
			if($elem !== undefined && $elem.length > 0) {
				$elem[0].appendChild(element);

				width = element.offsetWidth;
				$elem[0].removeChild(element);
			} else {
				element.style.fontSize = "12.8px";
				//element0.appendChild(element);

				document.body.appendChild(element);

				width = element.offsetWidth;
				document.body.removeChild(element);
			}


			return width;
		};
		const uint = (n) => Math.sqrt(Math.pow(n, 2));

		const init = () => {
			let uTime  = (typeof $elem.attr("sgn-marquee-duration") === 'number') ? $elem.attr("sgn-marquee-duration") : $elem.attr("data-marquee-duration"),
			    uSpeed = (!empty($elem.attr("sgn-marquee-speed"))) ? $elem.attr("sgn-marquee-speed") : $elem.attr("data-marquee-speed"),
			    uDir   = (!empty($elem.attr("sgn-marquee-direction"))) ? $elem.attr("sgn-marquee-direction") : $elem.attr("data-marquee-direction");
			uSpeed = (typeof uSpeed === 'number') ? uSpeed : 10;

			const textWidth       = (getTextWidth($elem.text(), $elem)),
			      containerWidth  = ($elem.width() < textWidth) ? $elem.width() : $elem.parent().width(),
			      containerHeight = ($elem.height() < textWidth) ? $elem.height() : $elem.parent().height();
			direction = (textWidth > containerHeight && empty(sDir)) ? 'top' : direction;
			uDir = (!empty(uDir) && $.inArray(uDir, directions) !== -1) ? uDir : direction;
			let distance, time;
			/*
			 Time = (Distance / Speed)
			 Speed = (Distance / Time)
			 Duration = (Speed * Distance)
			 */
			distance = (uDir === 'top' || uDir === 'bottom') ? uint((textWidth) / (containerHeight)) : uint((textWidth) / (containerWidth));
			time = uint(uSpeed * distance);
			time = Math.round(time);
			time = (typeof uTime === 'number') ? uTime : time;
			time = (typeof time === 'number') ? time : duration;
			time = (isDurationSpecified) ? duration : time;
			const dirClass = (uDir === 'top' || uDir === 'bottom') ? 'vertical' : 'horizontal';

			if(force || (textWidth > containerWidth || textWidth > containerHeight)) {
				$elem.wrapInner("<div class=\"sgn-marquee\"/>");
				const $marquee = $elem.children(".sgn-marquee");
				$marquee.clone(true).appendTo($elem);
				const $marquees = $elem.children(".sgn-marquee");

				$elem.wrapInner(`<div class="sgn-marquee-wrapper"/>`);

				if(!$elem.hasClass("has-marquee"))
					$elem.addClass("has-marquee");

				$elem.addClass(dirClass);

				$marquees.css("animation-name", `marquee-${uDir}`);
				$marquees.css("animation-duration", `${time}s`);
			}

			$elem.data("SGNMarquee", plugin);
			$elem[0]["SGNMarquee"] = plugin;
		}

		if($elem.length > 0 && ($elem.hasClass('marquee') || $elem.attr('sgn-component') === 'marquee' || $elem.attr('data-sgn-component') === 'marquee' || $elem.attr('data-component') === 'marquee'))
			init();
		else
			throw new Error(`[SGNMarquee] Failed to initialize SGNMarquee: Invalid DOM element supplied.`);

		return plugin;
	}

	/***
	 * Initialize <b>SGNMarquee</b> on the element.
	 *
	 * @param {number} [duration=5000] Specify the duration (in milliseconds) of how long should the marquee take to complete its full revolution. By default, it is set to 5000 (5 seconds).
	 * @param {"left"|"right"|"top"|"bottom"} [direction='left'] Specify the direction of the marquee.
	 * @param {boolean} [force=false] If <b>TRUE</b>, the marquee will be generated regardless of the necessity.
	 *
	 * @return {jQuery} The <b>jQuery</b> to retain method chaining capabilities.
	 */
	$.fn.marquee = function(duration = 5000, direction = "left", force = false) {
		return this.each(function() {
			const $_this = $(this),
			      data   = $_this.data("SGNMarquee");

			const plugin = (data === undefined) ? new SGNMarquee($_this, duration, direction, force) : data;

			$_this.data("SGNMarquee", plugin);
			$_this[0]["SGNMarquee"] = plugin;
		});
	};

	SUKR(() => {
		const $elem = $("[sgn-component=\"marquee\"], [data-sgn-component=\"marquee\"], [data-component=\"marquee\"]");
		const $marquees = ($elem.length > 0) ? $elem : $(".marquee");

		$marquees.marquee();
	});
})(window, document, jQuery);
