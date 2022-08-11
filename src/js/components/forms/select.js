/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

(function($, document, window) {
	"use strict";

	const SGNSelect = function(element) {
		const plugin = this;
		const _this  = element,
			  $_this = $(_this);

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

			const t        = $option.text(),
				  disabled = $option.attr('disabled'),
				  readonly = $option.attr('readonly');

			const disabledClass = (disabled) ? 'disabled' : '',
				  readonlyClass = (readonly) ? 'readonly' : '';
			$option.attr('aria-describedby', guid);
			$option.data('describedby', guid);

			return `<li class="sgn-option${disabledClass}${readonlyClass}" id="${guid}" value="${guid}"><span class="sgn-option-label" aria-labelledby="${guid}">${t}</span></li>`;
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
				$sgnSelectInput = $inputWrapper.children('input.sgn-select-input'),
				$sgnSelect      = $inputWrapper.children('.sgn-select'),
				$sgnOptions     = $sgnSelect.children('.sgn-option');

			$sgnSelectInput.on('focus', function(e) {
				e.stopPropagation();
				$('.sgn-form.sgn-select').removeClass('open');
				$sgnSelectInput.off('blur');
				plugin.show();
			});

			$sgnSelectInput.on('focusout', function(e) {
				e.stopPropagation();
				const eot     = e.explicitOriginalTarget,
					  $eot    = $(eot),
					  $option = ($eot.hasClass('sgn-option')) ? $eot : $eot.parents('.sgn-option');

				if($option.length <= 0) {
					plugin.hide();
					$sgnSelectInput.on('blur').trigger('blur');
				}
			});

			$sgnOptions.on('click', function(e) {
				e.stopPropagation();
				const $this = $(this),
					  id    = $this.attr('id'),
					  t     = $this.children('.sgn-option-label').text();

				$sgnOptions.removeClass('selected').removeAttr('selected').prop('selected', false);
				$this.addClass('selected').attr('selected', true).prop('selected', true);

				$options.removeAttr('selected').prop('selected', false);
				$select.find(`option[aria-describedby="${id}"]`).attr('selected', true).prop('selected', true);

				if($this.prop('selected')) {
					$select.trigger('change');

					$sgnSelectInput.val(t).trigger('change');
					plugin.hide();
				}
			});
		}

		plugin.show = () => {
			let $container = $_this.parents('.sgn-form.sgn-select');

			if(!$container.hasClass('open')) {
				$container.addClass('open');
			}
		}

		plugin.hide = () => {
			let $container = $_this.parents('.sgn-form.sgn-select');

			if($container.hasClass('open')) {
				$container.removeClass('open');
			}
		}

		init();
	}

	/**
	 * Creates an instance of <b>jQuery.SGNSelect</b> and initiates <b>SGNSelect</b> for the called <b><i><select></i></b> elements.
	 *
	 * @return {jQuery.SGNSelect} Returns <b>jQuery.SGNSelect</b> object for method chaining.
	 */
	$.fn.SGNSelect = function() {
		const _this = this;

		_this.each(function() {
			const $this = $(this),
				  data  = $this.data('SGNSelect');
			const plugin = (data === undefined) ? new SGNSelect($this) : data;
			$this.data('SGNSelect', plugin);

			$this[0]['SGNSelect'] = plugin;
		});


		/**
		 * Shows the selected SGNSelect elements (if hidden).
		 *
		 * @return {jQuery} Returns <b>jQuery</b> object for DOM chaining.
		 */
		$.fn.SGNSelect.show = function() {
			return _this.each(function() {
				const $this  = $(this),
					  plugin = $this.data('SGNSelect');
				$this.data('SGNSelect', plugin);

				if(plugin !== undefined)
					plugin.show();
			});
		};

		/**
		 * Hides the selected SGNSelect elements (if shown).
		 *
		 * @return {jQuery} Returns <b>jQuery</b> object for DOM chaining.
		 */
		$.fn.SGNSelect.hide = function() {
			return _this.each(function() {
				const $this  = $(this),
					  plugin = $this.data('SGNSelect');
				$this.data('SGNSelect', plugin);

				if(plugin !== undefined)
					plugin.hide();
			});
		};

		return _this;
	}

	window.SGNSelect = SGNSelect;

	return this;
})(jQuery, document, window);