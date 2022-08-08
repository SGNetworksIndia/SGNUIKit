/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

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

			if($_this.hasClass('sgn-select-input'))
				return '';

			return (nodeName === 'INPUT') ? `sgn-input-${type}` : `sgn-${type}`;
		}

		function GUID(uppercase = true, hyphen = true) {
			let result, i, j;
			result = '';
			for(j = 0; j < 32; j++) {
				if(hyphen && (j === 8 || j === 12 || j === 16 || j === 20))
					result = result + '-';
				i = Math.floor(Math.random() * 16).toString(16);
				i = (uppercase) ? i.toUpperCase() : i.toLowerCase();
				result = result + i;
			}
			return result;
		}

		const init = () => {
			//region Variables
			const nodeName = ($_this.prop('nodeName')) ? $_this.prop('nodeName') : $_this[0].nodeName;
			const typeClass = getTypeClass();
			let type = (nodeName === 'INPUT') ? $_this.attr('type').toLowerCase() : nodeName.toLowerCase();
			let id = ($_this.attr('id') === undefined || $_this.attr('id') === null || $_this.attr('id') === '') ? $_this.attr('name') : $_this.attr('id');
			id = (id === undefined || id === null || id === "") ? `sgn-${type}-` + GUID() : id;

			let $container    = $_this.parents('.sgn-form'),
				$formWrapper  = $_this.parents('.sgn-form-wrapper'),
				$inputWrapper = $_this.parents('.sgn-input-wrapper');

			let $input     = $_this,
				$label     = sibling('label'),
				$prefix    = sibling('.sgn-input-prefix'),
				$suffix    = sibling('.sgn-input-suffix'),
				$helpBlock = sibling('.sgn-form-help-block');
			//endregion

			if(type === 'switch') {
				type = 'checkbox';
				$input.attr('type', type).addClass('switch');
			}

			const $inputGroup = ($_this.parents('.crtb-group').length > 0) ? $_this.parents('.crtb-group') : $_this.parents('.input-group');
			let $inputGroupLabel, $inputGroupHelp;


			if($_this.attr('id') === undefined || $_this.attr('id') === null || $_this.attr('id') === '')
				$_this.attr('id', id);

			if($label !== undefined) {
				const forv = $label.attr('for');
				if(forv !== $_this.attr('id')) {
					$label.attr('for', id);
				}
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
				$label = $inputWrapper.children('label');
			} else {
				if($inputWrapper.length <= 0) {
					$input.wrapAll(`<div class="sgn-input-wrapper"/>`);
					$inputWrapper = $input.parents('.sgn-input-wrapper');
				}
				const label = $_this.attr('sgn-input-label');
				if(label !== undefined && label !== null) {
					$inputWrapper.prepend(`<label for="${id}">${label}</label>`);
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
				const containerWidth = ($helpBlock.width()),
					  textWidth      = (getTextWidth($helpBlock.text())),
					  boxWidth       = (textWidth + containerWidth);

				if(textWidth > containerWidth) {
					const speed        = parseFloat($_this.attr('sgn-input-help-scroll-speed')) || 10,
						  timePerPixel = 0.2;
					let distance, duration;
					/*
					Time = (Distance / Speed)
					Speed = (Distance / Time)
					Duration = (Speed * Distance)
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

			if($inputGroup.length > 0) {
				$inputGroupLabel = $inputGroup.children('label.sgn-input-group-label');
				$inputGroupHelp = $inputGroup.children('.sgn-input-group-help');
				const inputGroupLabel = $inputGroup.attr('sgn-input-group-label'),
					  inputGroupHelp  = $inputGroup.attr('sgn-input-group-help');

				if(inputGroupLabel !== undefined && inputGroupLabel !== null && inputGroupLabel !== '') {
					const inputGroupLabelHTML = `<label class="sgn-input-group-label">${inputGroupLabel}</label>`;

					if($inputGroupLabel.length < 1) {
						$inputGroup.prepend(inputGroupLabelHTML);
						$inputGroupLabel = $inputGroup.children('label.sgn-input-group-label');
					}
				}

				if(inputGroupHelp !== undefined && inputGroupHelp !== null && inputGroupHelp !== '') {
					const inputGroupHelpHTML = `<div class="sgn-input-group-help-block">${inputGroupHelp}</div>`;

					if($inputGroupHelp.length < 1) {
						$inputGroup.append(inputGroupHelpHTML);
						$inputGroupHelp = $inputGroup.children('.sgn-input-group-help-block');
					}
				}

				if($inputGroup.hasClass('labels-left')) {
					$label.detach().prependTo($inputWrapper);
					if(!$inputWrapper.hasClass('label-left'))
						$inputWrapper.addClass('label-left')
				} else {
					$label.detach().appendTo($inputWrapper);
					if(!$inputWrapper.hasClass('label-right'))
						$inputWrapper.addClass('label-right')
				}
				$label = $inputWrapper.children('label');
			}

			$container.addClass(typeClass);
			$label = $container.find('label');

			const minlength = $_this.attr('minlength');
			let required = ($_this.attr('required') || (minlength && minlength > 0));

			if(!$_this.hasClass('sgn-select-input')) {
				const requiredHTML = `<span class="sgn-required">*</span>`,
					  optionalHTML = `<span class="sgn-optional">*</span>`;
				if(required) {
					if($_this.attr('required') === undefined)
						$_this.attr('required', true);

					if(!$container.hasClass('sgn-input-radio') && !$container.hasClass('sgn-input-checkbox') && !$container.hasClass('sgn-input-switch')) {
						if($label !== undefined)
							$label.html(`${requiredHTML} ${$label.html()}`);
					} else {
						if($inputGroupLabel.length > 0 && $inputGroupLabel.find('.sgn-required').length < 1) {
							$inputGroupLabel.html(`${requiredHTML} ${$inputGroupLabel.html()}`);
						}
					}
				} else {
					if($_this.hasClass('denote') || $_this.parents().hasClass('denote')) {
						if(!$container.hasClass('sgn-input-radio') && !$container.hasClass('sgn-input-checkbox') && !$container.hasClass('sgn-input-switch')) {
							if($label !== undefined)
								$label.html(`${optionalHTML} ${$label.html()}`);
						} else {
							if($inputGroupLabel.length > 0 && $inputGroupLabel.find('.sgn-optional').length < 1) {
								$inputGroupLabel.html(`${optionalHTML} ${$inputGroupLabel.html()}`);
							}
						}
					}
				}
			}


			if($_this.hasClass('ckeditor')) {
				let editorButtons = $_this.attr('ck-toolbar');
				editorButtons = (editorButtons !== undefined) ? editorButtons : [
					'heading',
					'|',
					'bold',
					'italic',
					'underline',
					'fontSize',
					'|',
					'fontFamily',
					'fontColor',
					'fontBackgroundColor',
					'highlight',
					'|',
					'subscript',
					'superscript',
					'strikethrough',
					'|',
					'todoList',
					'bulletedList',
					'numberedList',
					'|',
					'outdent',
					'alignment',
					'indent',
					'|',
					'specialCharacters',
					'blockQuote',
					'link',
					/*'insertTable',
					'imageUpload',
					'imageInsert',
					'mediaEmbed',
					'|',*/
					'findAndReplace',
					'|',
					'horizontalLine',
					'htmlEmbed',
					'sourceEditing',
					'removeFormat',
					'|',
					'undo',
					'redo',
					'|',
					'restrictedEditingException'
				];

				let ckEditor;
				if(CKSource !== undefined) {
					const watchdog = new CKSource.EditorWatchdog();
					window.watchdog = watchdog;
					watchdog.setCreator((element, config) => {
						return CKSource.Editor
									   .create(element, config)
									   .then(editor => {
										   ckEditor = editor;
										   return editor;
									   });
					});

					watchdog.setDestructor(editor => {
						return editor.destroy();
					});

					watchdog.on('error', handleError);
					watchdog
						.create($_this[0], {
							toolbar: {
								items: editorButtons
							},
							language: 'en',
							/*image: {
								toolbar: [
									'imageTextAlternative',
									'imageStyle:inline',
									'imageStyle:block',
									'imageStyle:side',
									'linkImage'
								]
							},*/
							table: {
								contentToolbar: [
									'tableColumn',
									'tableRow',
									'mergeTableCells',
									'tableCellProperties',
									'tableProperties'
								]
							},
							licenseKey: '',
						})
						.catch(handleError);

					function handleError(error) {
						console.error('Oops, something went wrong!');
						console.error('Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:');
						console.warn('Build id: lymhcd9e0h4n-tapjouc4w8dg');
						console.error(error);
					}
				}
			}

			if(type === 'select') {
				$_this.SGNSelect();
			} else {
				const isSelect = ($_this.hasClass('sgn-select-input'));
				bindEvents(isSelect);
			}
		}

		const bindEvents = (rebind) => {
			let $container             = $_this.parents('.sgn-form:not(.sgn-input-checkbox):not(.sgn-input-radio):not(.sgn-input-switch)'),
				$clickableContainer    = $_this.parents('.sgn-form.sgn-input-checkbox, .sgn-form.sgn-input-radio, .sgn-form.sgn-input-switch'),
				$formWrapper           = $container.children('.sgn-form-wrapper'),
				$clickableFormWrapper  = $clickableContainer.children('.sgn-form-wrapper'),
				$inputWrapper          = $formWrapper.children('.sgn-input-wrapper'),
				$clickableInputWrapper = $clickableFormWrapper.children('.sgn-input-wrapper'),
				$input                 = $inputWrapper.children('input.form-control'),
				$clickableInput        = $clickableInputWrapper.children('input.form-control');

			$container.on('click', function(e) {
				const $this = $(this);
				let $wrapper = ($this.hasClass('sgn-form') && $this.parents('.sgn-form').length <= 0) ? $this : $this.parents('.sgn-form');
				const $inputGroup = ($wrapper.find('.crtb-group').length > 0) ? $wrapper.find('.crtb-group') : $wrapper.find('.input-group');
				const $input = $wrapper.children('.sgn-form-wrapper').children('.sgn-input-wrapper').children('input.form-control');

				$('.sgn-form.sgn-select .form-control').blur();
				$('.sgn-form.sgn-select.open').removeClass('open');
				//console.log($wrapper, $input, $this);

				if(!$wrapper.hasClass('active'))
					$wrapper.removeClass('edited').addClass('active');
				if($inputGroup.length > 0)
					$inputGroup.removeClass('edited').addClass('active');

				/*if(!$input.is(':focus'))
					$input.focus();

				if(!$wrapper.hasClass('sgn-select')) {
					if(!$input.is(':focus'))
						$container.removeClass('active');
					else
						$wrapper.trigger('sgninput.click');
				}*/

				$wrapper.trigger('sgninput.click');
				e.preventDefault();
				return false;
			});

			$container.on('sgninput.click', function(e) {
				const $input = $(this).children('.sgn-form-wrapper').children('.sgn-input-wrapper').children('input.form-control');
				if($input.length > 0)
					$input[0].focus();
			});

			$clickableContainer.on('sgniclick', function(e) {
				const $this = $(this);
				const $inputGroup = ($this.parents('.crtb-group').length > 0) ? $this.parents('.crtb-group') : $this.parents('.input-group');

				if($inputGroup.length > 0)
					$inputGroup.removeClass('edited').addClass('active');

				$this.trigger('sgninput.click');
			});

			$clickableContainer.on('sgniblur', function(e) {
				const $this = $(this);
				const $inputGroup = ($this.parents('.crtb-group').length > 0) ? $this.parents('.crtb-group') : $this.parents('.input-group');

				if($inputGroup.length > 0)
					$inputGroup.removeClass('active').addClass('edited');

				$this.trigger('sgninput.blur');
			});

			$input.on('focus', function() {
				const $container = $(this).parents('.sgn-form');

				if(!$container.hasClass('active'))
					$container.click();

				$(this).trigger('sgninput.focus');
			});

			$input.on('blur change', function(e) {
				const $this = $(this);
				const $container = $this.parents('.sgn-form');
				const v = $this.val();
				const type = e.type;

				$container.removeClass('active');

				if(v.length > 0)
					$container.addClass('edited');

				$(this).trigger(`sgninput.${type}`);
			});

			$clickableInput.on('change', function() {
				$(this).parents('.sgn-form').trigger('sgniclick');

				$(this).trigger('sgninput.focus');
			});

			$clickableInput.on('blur', function() {
				$(this).parents('.sgn-form').trigger('sgniblur');

				$(this).trigger('sgninput.blur');
			});
		}

		plugin.invalid = () => {
			const $container = $_this.parents('.sgn-form');
			const $inputGroup = ($_this.parents('.crtb-group').length > 0) ? $_this.parents('.crtb-group') : $_this.parents('.input-group');

			$container.removeClass('valid');
			$inputGroup.removeClass('valid');

			if(!$container.hasClass('invalid'))
				$container.addClass('invalid');

			if(!$inputGroup.hasClass('invalid'))
				$inputGroup.addClass('invalid');
		}

		plugin.valid = () => {
			const $container = $_this.parents('.sgn-form');
			const $inputGroup = ($_this.parents('.crtb-group').length > 0) ? $_this.parents('.crtb-group') : $_this.parents('.input-group');

			$container.removeClass('invalid');
			$inputGroup.removeClass('invalid');

			if(!$container.hasClass('valid'))
				$container.addClass('valid');

			if(!$inputGroup.hasClass('valid'))
				$inputGroup.addClass('valid');
		}

		init();

		return plugin;
	};

	/**
	 * Creates an instance of <b>jQuery.SGNInput</b> and initiates <b>SGNInput</b> for the called form elements.
	 *
	 * @return {jQuery.SGNInput} Returns <b>jQuery.SGNInput</b> object for method chaining.
	 */
	$.fn.SGNInput = function() {
		const _this = this;

		_this.each(function() {
			const $this = $(this),
				  data  = $this.data('SGNInput');
			const plugin = (data === undefined) ? new SGNInput($this) : data;
			$this.data('SGNInput', plugin);

			$this[0]['SGNInput'] = plugin;
		});

		/**
		 * Denotes that the form elements are valid.
		 *
		 * @return {jQuery} Returns <b>jQuery</b> object for DOM chaining.
		 */
		$.fn.SGNInput.valid = function() {
			return _this.each(function() {
				const $this  = $(this),
					  plugin = $this.data('SGNInput');
				$this.data('SGNInput', plugin);

				if(plugin !== undefined)
					plugin.valid();
			});
		};

		/**
		 * Denotes that the form elements are invalid.
		 *
		 * @return {jQuery} Returns <b>jQuery</b> object for DOM chaining.
		 */
		$.fn.SGNInput.invalid = function() {
			return _this.each(function() {
				const $this  = $(this),
					  plugin = $this.data('SGNInput');
				$this.data('SGNInput', plugin);

				if(plugin !== undefined)
					plugin.invalid();
			});
		};

		return _this;
	}

	$(document).ready(function() {
		const $inputs = $('input.form-control, textarea.form-control, select.form-control');
		$inputs.SGNInput();
	});

	window.SGNInput = SGNInput;

	return this;
})(jQuery, document, window);