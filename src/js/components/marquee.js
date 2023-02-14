/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

if(typeof jQuery === "undefined") {
	throw new Error("marquee requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	/***
	 *
	 * @param {number} [duration=5000]
	 * @param {"left"|"right"|"top"|"bottom"} [direction='left']
	 * @param {boolean} [force=false] If <b>TRUE</b>, the marquee will be generated regardless of the necessity.
	 * @return {jQuery}
	 */
	$.fn.marquee = function(duration = 5000, direction = "left", force = false) {
		const directions = [
			"left", "right",
			"top", "bottom",
		];
		const isDurationSpecified = ($.isNumeric(duration));
		const sdir  = direction,
		      stime = duration;
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

			let width = "0px";
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

		return this.each(function() {
			const $this = $(this);
			let utime  = ($.isNumeric($this.attr("sgn-marquee-duration"))) ? $this.attr("sgn-marquee-duration") : $this.attr("data-marquee-duration"),
			    uspeed = (!empty($this.attr("sgn-marquee-speed"))) ? $this.attr("sgn-marquee-speed") : $this.attr("data-marquee-speed"),
			    udir   = (!empty($this.attr("sgn-marquee-direction"))) ? $this.attr("sgn-marquee-direction") : $this.attr("data-marquee-direction");
			uspeed = ($.isNumeric(uspeed)) ? uspeed : 10;

			const textWidth       = (getTextWidth($this.text(), $this)),
			      containerWidth  = ($this.width() < textWidth) ? $this.width() : $this.parent().width(),
			      containerHeight = ($this.height() < textWidth) ? $this.height() : $this.parent().height(),
			      boxWidth        = (textWidth + containerWidth);
			direction = (textWidth > containerHeight && empty(sdir)) ? 'top' : direction;
			udir = (!empty(udir) && $.inArray(udir, directions) !== -1) ? udir : direction;
			let distance, time;
			/*
			 Time = (Distance / Speed)
			 Speed = (Distance / Time)
			 Duration = (Speed * Distance)
			 */
			distance = (udir === 'top' || udir === 'bottom') ? uint((textWidth) / (containerHeight)) : uint((textWidth) / (containerWidth));
			time = uint(uspeed * distance);
			time = Math.round(time);
			time = ($.isNumeric(utime)) ? utime : time;
			time = ($.isNumeric(time)) ? time : duration;
			time = (isDurationSpecified) ? duration : time;
			const dirClass = (udir === 'top' || udir === 'bottom') ? 'vertical' : 'horizontal';

			if(force || (textWidth > containerWidth || textWidth > containerHeight)) {
				$this.wrapInner("<div class=\"sgn-marquee\"/>");
				const $marquee = $this.children(".sgn-marquee");
				$marquee.clone(true).appendTo($this);
				const $marquees = $this.children(".sgn-marquee");

				$this.wrapInner(`<div class="sgn-marquee-wrapper"/>`);

				if(!$this.hasClass("has-marquee"))
					$this.addClass("has-marquee");

				$this.addClass(dirClass);

				$marquees.css("animation-name", `marquee-${udir}`);
				$marquees.css("animation-duration", `${time}s`);
			}
		});
	};

	SUKR(() => {
		const $elem = $("[sgn-component=\"marquee\"], [data-component=\"marquee\"]");
		const $marquees = ($elem.length > 0) ? $elem : $(".marquee");

		$marquees.marquee();
	});
})(window, document, jQuery);
