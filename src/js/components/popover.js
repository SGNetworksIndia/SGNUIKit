/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

if(typeof jQuery === "undefined") {
	throw new Error("SGNPopover requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	/***
	 * Initialize <b>SGNPopover</b> on the element identified by <b><i>$elem</i></b>.
	 *
	 * @param {jQuery} $elem The <b>DOM Element</b> wrapped with <b>jQuery</b> where the <b>SGNPopover</b> will be initialized.
	 * @param {number} [duration=5000] Specify the duration (in milliseconds) of how long should the marquee take to complete its full revolution. By default, it is set to 5000 (5 seconds).
	 * @param {"left"|"right"|"top"|"bottom"} [direction='left'] Specify the direction of the marquee.
	 * @param {boolean} [force=false] If <b>TRUE</b>, the marquee will be generated regardless of the necessity.
	 *
	 * @return {SGNPopover} An instance of <b>SGNPopover</b> if initialized.
	 */
	const SGNPopover = function($elem, options) {
		const plugin   = this,
		      $window  = $(window),
		      _options = {
			      placement: [
				      'auto', 'left-start', 'left', 'left-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-start', 'bottom', 'bottom-end'
			      ],
			      trigger: [
				      'click', 'hover', 'manual'
			      ]
		      };
		plugin.settings = {
			placement: 'auto',
			trigger: 'hover'
		};

		const ANIMATION_DURATION = 500;

		let $popover, position = {};

		function GUID(uppercase = true, hyphen = true) {
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

		const uint = (n) => Math.sqrt(Math.pow(n, 2));

		const getPlacement = function(tip, element) {
			const $window = $(getScrollParent(element[0]));
			let $element      = $(element),
			    elementHeight = $element.outerHeight(),
			    elementWidth  = $element.outerWidth(),
			    elementOffset = $element.offset(),
			    elementTop    = elementOffset.top - $window.scrollTop(),
			    elementLeft   = elementOffset.left - $window.scrollLeft(),
			    $tip          = $(tip),
			    $tempTip      = $tip.clone().css('display', 'none').removeClass('top').insertAfter($element),
			    tipHeight     = $tempTip.outerHeight(),
			    tipWidth      = $tempTip.outerWidth(),
			    gutter        = 0;

			$tempTip.remove();

			if(elementTop + (elementHeight / 2) - (tipHeight / 2) > 0 && elementTop + (elementHeight / 2) + (tipHeight / 2) < $window.height()) {
				if(elementLeft + (elementWidth / 2) + (tipWidth / 2) > $window.width() - gutter) {
					return 'left';
				}

				if(elementLeft + (elementWidth / 2) - (tipWidth / 2) < gutter) {
					return 'right';
				}
			}

			if(elementTop - tipHeight < gutter) {
				return 'bottom';
			}

			return 'top';
		};

		const getOppositePlacement = (placement) => {
			placement = placement || plugin.settings.placement;

			const regex = /(left|right|top|bottom)\-?(start|end)?/g;
			const opposites = {
				axis: {
					'left': 'right',
					'top': 'bottom',
					'right': 'left',
					'bottom': 'top'
				},
				yaxis: {
					'start': 'end',
					'end': 'start'
				}
			};

			if(regex.test(placement)) {
				const placements = placement.match(regex),
				      xAxis      = placements[1],
				      yAxis      = placements[2];
				const axis = opposites.axis[xAxis];
				return (!empty(yAxis)) ? `${axis}-${opposites.yaxis[yAxis]}` : axis;
			}

			return placement;
		};


		/* calculate tip position relative to the trigger */
		function getPosition(trigger, target, pos) {
			const conf = {
				relative: false,
			};

			// get origin top/left position 
			let top  = conf.relative ? trigger.position().top : trigger.offset().top,
			    left = conf.relative ? trigger.position().left : trigger.offset().left;
			const height = target.outerHeight() + trigger.outerHeight(),
			      width  = target.outerWidth() + trigger.outerWidth();

			const placement = (pos === undefined) ? plugin.settings.placement : getOppositePlacement(plugin.settings.placement);
			const isLeft   = (placement === 'left' || placement === 'left-start' || placement === 'left-end'),
			      isTop    = (placement === 'top' || placement === 'top-start' || placement === 'top-end'),
			      isRight  = (placement === 'right' || placement === 'right-start' || placement === 'right-end'),
			      isBottom = (placement === 'bottom' || placement === 'bottom-start' || placement === 'bottom-end');

			if(pos === undefined) {
				top -= target.outerHeight();
				left += trigger.outerWidth();

				// iPad position fix
				if(/iPad/i.test(navigator.userAgent)) {
					top -= $(window).scrollTop();
				}


				// adjust Y
				if(isBottom)
					top += height;
				else if(isLeft || isRight)
					top += height / 2;

				if(isLeft)
					left -= (width + 12);
				else if(isBottom || isTop) {
					left -= width / 2;
					left -= 7;
				}

				top -= 7;
			} else {
				top -= target.outerHeight();
				left += trigger.outerWidth();

				// iPad position fix
				if(/iPad/i.test(navigator.userAgent)) {
					top -= $(window).scrollTop();
				}


				// adjust Y
				if(isBottom)
					top += height;
				else if(!isTop)
					top += height / 2;

				if(isLeft)
					left -= (width + 12);
				else if(isBottom || isTop)
					left -= width / 2;

				top -= 7;
			}

			return {top: top, left: left};
		}

		function getScrollParent(node) {
			if(node == null) {
				return null;
			}

			if(node.scrollHeight > node.clientHeight) {
				return node;
			} else {
				return getScrollParent(node.parentNode);
			}
		}

		const init = () => {
			const id = `sgn-popover-` + GUID();

			const $body = $('body');

			const header        = select($elem.attr("title"), $elem.attr("data-title"), $elem.attr("sgn-title"), $elem.attr("data-popover-title"), $elem.attr("sgn-popover-title")),
			      content       = select($elem.attr("content"), $elem.attr("data-content"), $elem.attr("sgn-content"), $elem.attr("data-popover-content"), $elem.attr("sgn-popover-content")),
			      footer        = select($elem.attr("footer"), $elem.attr("data-footer"), $elem.attr("sgn-footer"), $elem.attr("data-popover-footer"), $elem.attr("sgn-popover-footer")),
			      triggerAttr   = select($elem.attr("data-trigger"), $elem.attr("sgn-trigger"), $elem.attr("data-popover-trigger"), $elem.attr("sgn-popover-trigger")),
			      placementAttr = select($elem.attr("data-placement"), $elem.attr("sgn-placement"), $elem.attr("data-popover-placement"), $elem.attr("sgn-popover-placement"));
			const trigger   = (in_array(triggerAttr, _options.trigger)) ? triggerAttr : plugin.settings.trigger,
			      placement = (in_array(placementAttr, _options.placement)) ? placementAttr : plugin.settings.placement;

			plugin.settings = $.extend(plugin.settings, options);

			const arrowHTML  = `<div class="arrow" style=""></div>`,
			      headerHTML = `<h3 class="popover-header">${header}</h3>`,
			      bodyHTML   = `<div class="popover-body">${content}</div>`;

			const $tooltip = $(`<div class="popover fade popover-${placement}" role="tooltip" id="${id}" x-placement="${placement}"/>`);
			$tooltip.html(`${arrowHTML}${headerHTML}${bodyHTML}`);

			$elem.removeAttr('title data-title sgn-title data-popover-title sgn-popover-title');
			$elem.removeAttr('content data-content sgn-content data-popover-content sgn-popover-content');
			$elem.removeAttr('footer data-footer sgn-footer data-popover-footer sgn-popover-footer');
			$elem.removeAttr('placement data-placement sgn-placement data-popover-placement sgn-popover-placement');
			//$elem.removeAttr('trigger data-trigger sgn-trigger data-popover-trigger sgn-popover-trigger');
			//$elem.removeAttr('data-toggle sgn-toggle data-popover-toggle sgn-popover-toggle');

			$popover = select($(`#${id}`));
			if(trigger !== 'manual') {
				$elem.on(trigger, function(e) {
					e.preventDefault();
					const $this = $(this);

					if($popover === undefined || $popover.length < 0) {
						$body.append($tooltip);
						$popover = select($(`#${id}`));
						const $arrow = $popover.children('.arrow');

						if(placement === 'auto') plugin.settings.placement = getPlacement($popover, $this);

						position = getPosition($this, $popover);
						const arrowPos = getPosition($this, $arrow, 'center');

						const css   = {
							"will-change": "top, left",
							...position
						}, arrowCSS = {
							"will-change": "top, left",
							"top": arrowPos.top,
							"left": arrowPos.left
						};

						//$arrow.css(arrowCSS);
						$popover.attr("x-placement", plugin.settings.placement).css(css);
						$popover.fadeIn(ANIMATION_DURATION);
						setupScrollEvent();
					}
				}, function() {
					const $this = $(this);
					if($popover !== undefined && $popover.length > 0) {
						$popover.fadeOut(ANIMATION_DURATION, () => {
							$popover.remove();
							$popover = undefined;
						});
					}
				});
			} else {
				if($popover.length < 0) {
					$body.append($tooltip);
					$popover = select($(`#${id}`));
				}
			}

			$elem.data("SGNPopover", plugin);
			$elem[0]["SGNPopover"] = plugin;
		}

		const setupScrollEvent = () => {
			$(window).terminate('scroll').on('scroll', function(e) {
				const $target = $(e.originalTarget),
				      $this   = $(getScrollParent($target[0])),
				      top     = $this.scrollTop();

				/* const isScrollUP = (this.oldScroll > top);
				 if(isScrollUP) {
				 css.top = pos.top;
				 } else {
				 css.top = pos.top;
				 }
				 this.oldScroll = top; */

				if($popover !== undefined && $popover.length > 0) {
					const $arrow = $popover.children('.arrow');
					const position = getPosition($elem, $popover),
					      arrowPos = getPosition($popover, $arrow, 'center');

					const css   = {
						"will-change": "top, left",
						...position
					}, arrowCSS = {
						"will-change": "top, left",
						"top": arrowPos.top
					};
					$popover.css(css);
					//$arrow.css(arrowCSS);
				}
			});
		}

		if($elem.length > 0 && ($elem.hasClass('popover') || $elem.attr('sgn-toggle') === 'popover' || $elem.attr('data-sgn-toggle') === 'popover' || $elem.attr('data-toggle') === 'popover'))
			init();
		else
			throw new Error(`[SGNPopover] Failed to initialize SGNPopover: Invalid DOM element supplied.`);

		return plugin;
	}

	/***
	 * Initialize <b>SGNPopover</b> on the element.
	 *
	 * @param {number} [duration=5000] Specify the duration (in milliseconds) of how long should the marquee take to complete its full revolution. By default, it is set to 5000 (5 seconds).
	 * @param {"left"|"right"|"top"|"bottom"} [direction='left'] Specify the direction of the marquee.
	 * @param {boolean} [force=false] If <b>TRUE</b>, the marquee will be generated regardless of the necessity.
	 *
	 * @return {jQuery} The <b>jQuery</b> to retain method chaining capabilities.
	 */
	$.fn.SGNPopover = function(options) {
		return this.each(function() {
			const $_this = $(this),
			      data   = $_this.data("SGNPopover");

			const plugin = (data === undefined) ? new SGNPopover($_this, options) : data;

			$_this.data("SGNPopover", plugin);
			$_this[0]["SGNPopover"] = plugin;
		});
	};

	SUKR(() => {
		const $elem = $("[sgn-toggle=\"popover\"], [data-sgn-toggle=\"popover\"], [data-toggle=\"popover\"]");
		const $popovers = ($elem.length > 0) ? $elem : $(".popover");

		$popovers.SGNPopover();
	});
})(window, document, jQuery);
