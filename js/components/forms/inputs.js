(function($, document, window) {
	"use strict";

	const SGNInput = function(element) {
		const plugin = this;
		const _this  = element,
			  $_this = $(_this);

		const sibling = (elem, $elem) => {
			$elem = ($elem === undefined || $elem === null || $elem === '') ? $_this : $elem;
			const $next = $elem.next(elem),
				  $prev = $elem.prev(elem);

			//console.log($next, $prev);
			if($next.length > 0)
				return $next;
			else if($prev.length > 0)
				return $prev;

			return undefined;
		}
		const getTextWidth = (text, styles) => {
			const isObjectJSON = function(obj) {
				return obj && typeof obj === 'object' && !Array.isArray(obj);
			};

			const element0 = document.createElement('div');
			const element = document.createElement('div');
			if(isObjectJSON(styles)) {
				const styleKeys = Object.keys(styles);
				let i = 0, n = styleKeys.length;
				for(; i < n; ++i) {
					element.style[styleKeys[i]] = styles[styleKeys[i]];
				}
			}
			element.style.fontSize = '12.8px';
			element.style.display = 'inline-block';
			element.innerHTML = text;

			element0.appendChild(element);
			document.body.appendChild(element0);

			const width = element.offsetWidth;

			document.body.removeChild(element0);

			return width;
		}
		const uint = (n) => {
			return Math.sqrt(Math.pow(n, 2));
		}

		function getNodeTextWidth(nodeWithText) {
			const textNode = $(nodeWithText).contents().filter(function() {
				return this.nodeType === Node.TEXT_NODE;
			})[0];
			const range = document.createRange();
			range.selectNode(textNode);
			return range.getBoundingClientRect().width;
		}

		function getTypeClass() {
			const nodeName = ($_this.prop('nodeName')) ? $_this.prop('nodeName') : $_this[0].nodeName;
			const type = (nodeName === 'INPUT') ? $_this.attr('type').toLowerCase() : nodeName.toLowerCase();

			return (nodeName === 'INPUT') ? `sgn-input-${type}` : `sgn-${type}`;
		}

		const init = () => {
			const nodeName = ($_this.prop('nodeName')) ? $_this.prop('nodeName') : $_this[0].nodeName;
			const type = (nodeName === 'INPUT') ? $_this.attr('type').toLowerCase() : nodeName.toLowerCase();
			const typeClass = getTypeClass();

			let $container    = $_this.parents('.sgn-form'),
				$formWrapper  = $_this.parents('.sgn-form-wrapper'),
				$inputWrapper = $_this.parents('.sgn-input-wrapper');

			let $input     = $_this,
				$label     = sibling('label'),
				$prefix    = sibling('.sgn-input-prefix'),
				$suffix    = sibling('.sgn-input-suffix'),
				$helpBlock = sibling('.sgn-form-help-block');

			if($label !== undefined) {
				if($inputWrapper.length <= 0) {
					if($input.prev('label').length > 0)
						$input.prev('label').addBack().wrapAll(`<div class="sgn-input-wrapper"/>`);
					else if($input.next('label').length > 0)
						$input.next('label').addBack().wrapAll(`<div class="sgn-input-wrapper"/>`);
					$inputWrapper = $input.parents('.sgn-input-wrapper');
				} else {
					if($label.parents('.sgn-input-wrapper').length > 0 && $input.parents('.sgn-input-wrapper').length <= 0) {
						$input.detach().appendTo($inputWrapper);
						//$inputWrapper = $label.parents('.sgn-input-wrapper');
					} else if($label.parents('.sgn-input-wrapper').length <= 0 && $input.parents('.sgn-input-wrapper').length > 0) {
						$label.detach().appendTo($inputWrapper);
					}
				}
			} else {
				if($inputWrapper.length <= 0) {
					$input.wrapAll(`<div class="sgn-input-wrapper"/>`);
					$inputWrapper = $input.parents('.sgn-input-wrapper');
				}
			}

			if($formWrapper.length <= 0) {
				$inputWrapper.wrap(`<div class="sgn-form-wrapper"/>`);
				$formWrapper = $inputWrapper.parents('.sgn-form-wrapper');
			}

			if($prefix !== undefined) {
				$prefix.detach().prependTo($formWrapper);
			} else {
				const prefix = $input.attr('sgn-input-prefix');
				if(prefix !== undefined) {
					$prefix = $(`<div class="sgn-input-prefix">${prefix}</div>`);
					$inputWrapper.before($prefix);
					$prefix = $inputWrapper.prev('sgn-input-prefix');
				}
			}
			if($suffix !== undefined) {
				$suffix.detach().appendTo($formWrapper);
			} else {
				const suffix = $input.attr('sgn-input-suffix');
				if(suffix !== undefined) {
					$suffix = $(`<div class="sgn-input-suffix">${suffix}</div>`);
					$inputWrapper.after($suffix);
					$suffix = $inputWrapper.next('sgn-input-suffix');
				}
			}

			if($container.length <= 0) {
				$formWrapper.wrap(`<div class="sgn-form"/>`);
				$container = $formWrapper.parents('.sgn-form');
			}

			if($helpBlock !== undefined) {
				$helpBlock.detach().appendTo($formWrapper);
			} else {
				const helpBlock = $input.attr('sgn-input-help');
				if(helpBlock !== undefined) {
					$helpBlock = $(`<div class="sgn-form-help-block">${helpBlock}</div>`);
					$container.append($helpBlock);
					$helpBlock = $container.children('.sgn-form-help-block');
				}
			}

			if($helpBlock !== undefined && $helpBlock.length > 0) {
				//$helpBlock.marquee(5000, 'left');
				const containerWidth = ($helpBlock.width()),
					  textWidth      = (getTextWidth($helpBlock.text())),
					  boxWidth       = (textWidth + containerWidth);

				if(textWidth > containerWidth) {
					const speed        = 5,
						  timePerPixel = 0.2;
					let distance, duration;
					/*
					Time = Distance / Speed
					Speed = Distance / Time
					Duration = Speed * Distance
					 */
					distance = uint((textWidth) / (containerWidth));
					duration = uint(speed * distance);
					duration = Math.round(duration);

					$helpBlock.marquee();
					$helpBlock.addClass('has-marquee');

					setTimeout(() => {
						$helpBlock.children('.sgn-marquee-wrapper').children('.sgn-marquee').attr('style', `animation: marquee-left ${duration}s linear infinite`);
					}, 10);
				}
			}

			$container.addClass(typeClass);

			bindEvents();

			if(type === 'select')
				$_this.SGNSelect();
		}

		const bindEvents = () => {
			let $container    = $_this.parents('.sgn-form'),
				$formWrapper  = $container.children('.sgn-form-wrapper'),
				$inputWrapper = $formWrapper.children('.sgn-input-wrapper'),
				$input        = $inputWrapper.children('input.form-control');

			$container.on('click', function(e) {
				const $this = $(this);

				if(!$this.hasClass('active'))
					$this.addClass('active');

				if(!$input.is(':focus'))
					$input.focus();

				if(!$input.is(':focus'))
					$container.removeClass('active');
				else
					$this.trigger(`sgninput.click`);
			});

			$input.on('focus', function(e) {
				$container.click();

				$input.trigger(`sgninput.focus`);
			});

			$input.on('blur change', function(e) {
				const $this = $(this);
				const v = $this.val();
				const type = e.type;

				$container.removeClass('active');

				if(v.length > 0)
					$container.addClass('edited');

				$input.trigger(`sgninput.${type}`);
			});
		}

		plugin.invalid = () => {
			const $container = $_this.parents('.sgn-form');

			$container.removeClass('edited active valid');

			if(!$container.hasClass('invalid'))
				$container.addClass('invalid');
		}

		plugin.valid = () => {
			const $container = $_this.parents('.sgn-form');

			$container.removeClass('edited active invalid');

			if(!$container.hasClass('valid'))
				$container.addClass('valid');
		}

		init();

		return plugin;
	};

	$.fn.SGNInput = function() {
		const _this = this;

		return this.each(function() {
			let $this = $(this),
				data  = $this.data('SGNInput');
			const plugin = new SGNInput($this);
			/*if(!data)
				$this.data('SGNInput', (data = new SGNInput($this)));*/

			_this.invalid = function() {
				plugin.invalid();
			}
			_this.valid = function() {
				plugin.valid();
			}
		});
	}

	$(document).ready(function() {
		const $inputs = $('input.form-control, textarea.form-control, select.form-control');
		$inputs.each(function() {
			$(this).SGNInput();
		});
	});

	return this;
})(jQuery, document, window);