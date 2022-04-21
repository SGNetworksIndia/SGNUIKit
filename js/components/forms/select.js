(function($, document, window) {
	"use strict";

	const SGNSelect = function(element) {
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

		function GUID(str) {
			if(str === undefined || !str.length)
				str = "" + Math.random() * new Date().getTime() + Math.random();

			let c = 0,
				r = "";

			for(let i = 0; i < str.length; i++)
				c = (c + (str.charCodeAt(i) * (i + 1) - 1)) & 0xfffffffffffff;

			str = str.substr(str.length / 2) + c.toString(16) + str.substr(0, str.length / 2);
			for(let i = 0, p = c + str.length; i < 32; i++) {
				if(i === 8 || i === 12 || i === 16 || i === 20)
					r += "-";

				c = p = (str[(i ** i + p + 1) % str.length]).charCodeAt(0) + p + i;
				if(i === 12)
					c = (c % 5) + 1; //1-5
				else if(i === 16)
					c = (c % 4) + 8; //8-B
				else
					c %= 16; //0-F

				r += c.toString(16);
			}
			return r;
		}

		/**
		 * @param $option{jQuery} The name or space-separated name of events to bind to the context or DOM element.
		 *
		 * @return {string} The generated HTML string.
		 */
		const getOptionHTML = ($option) => {
			const guid = `sgn-option-${GUID()}`;

			const v        = $option.val(),
				  t        = $option.text(),
				  disabled = $option.attr('disabled'),
				  readonly = $option.attr('readonly');

			const disabledClass = (disabled) ? 'disabled' : '',
				  readonlyClass = (readonly) ? 'readonly' : '';
			$option.attr('aria-describedby', guid);
			$option.data('describedby', guid);

			let html = `<li class="sgn-option${disabledClass}${readonlyClass}" id="${guid}" value="${guid}"><span class="sgn-option-label" aria-labelledby="${guid}">${t}</span></li>`;

			return html;
		}

		const init = () => {
			let $container    = $_this.parents('.sgn-form.sgn-select'),
				$formWrapper  = $container.children('.sgn-form-wrapper'),
				$inputWrapper = $formWrapper.children('.sgn-input-wrapper');

			$_this.hide();

			create();
		}

		const create = () => {
			const guid = `sgn-select-${GUID()}`;

			let $container    = $_this.parents('.sgn-form.sgn-select'),
				$formWrapper  = $container.children('.sgn-form-wrapper'),
				$inputWrapper = $formWrapper.children('.sgn-input-wrapper');
			let $sgnSelectInput = `<input type="text" class="form-control sgn-select-input" aria-labelledby="${guid}" />`;

			$_this.attr('aria-describedby', guid).data('describedby', guid);
			$inputWrapper.append($sgnSelectInput);
			$sgnSelectInput = $inputWrapper.children('input.sgn-select-input');

			const $options = $_this.find('option');

			let html = `<ul class="sgn-select" id="${guid}">`;
			$options.each(function() {
				html += getOptionHTML($(this));
			});
			html += `</ul>`;

			$inputWrapper.append(html);

			$sgnSelectInput.SGNInput();

			bindEvents();
		}

		const bindEvents = () => {
			let $container    = $_this.parents('.sgn-form.sgn-select'),
				$formWrapper  = $container.children('.sgn-form-wrapper'),
				$inputWrapper = $formWrapper.children('.sgn-input-wrapper');
			let $select         = $inputWrapper.children('select.form-control'),
				$options        = $select.find('option'),
				$sgnSelectInput = $inputWrapper.children('.sgn-select-input'),
				$sgnSelect      = $inputWrapper.children('.sgn-select'),
				$sgnOptions     = $sgnSelect.children('.sgn-option');

			$sgnSelectInput.on('focus', function(e) {
				_this.show();
			});

			$sgnSelectInput.on('blur', function(e) {
				_this.hide();
			});

			$sgnSelect.on('mouseover', function(e) {
				$sgnSelectInput.off('blur');
			});

			$sgnSelect.on('mouseout', function(e) {
				$sgnSelectInput.on('blur');
			});

			$sgnOptions.on('click', function(e) {
				e.preventDefault();
				const $this = $(this),
					  id    = $this.attr('id'),
					  v     = $this.val(),
					  t     = $this.children('.sgn-option-label').text();

				$sgnOptions.removeClass('selected').removeAttr('selected').prop('selected', false);
				$this.addClass('selected').attr('selected', true).prop('selected', true);

				$options.removeAttr('selected').prop('selected', false);
				$select.find(`option[aria-describedby="${id}"]`).attr('selected', true).prop('selected', true).change();

				$sgnSelectInput.val(t).change();
				$sgnSelectInput.on('blur');

				_this.hide();
			});
		}

		_this.show = () => {
			let $container = $_this.parents('.sgn-form.sgn-select');

			if(!$container.hasClass('open')) {
				$container.addClass('open');
			}
		}

		_this.hide = () => {
			let $container = $_this.parents('.sgn-form.sgn-select');

			if($container.hasClass('open')) {
				$container.removeClass('open');
			}
		}

		init();
	}

	$.fn.SGNSelect = function() {
		const _this = this;

		return _this.each(function() {
			let $this = $(this),
				data  = $this.data('SGNSelect');
			const plugin = new SGNSelect($this);
			/*if(!data)
				$this.data('SGNInput', (data = new SGNInput($this)));*/
		});
	}

	return this;
})(jQuery, document, window);