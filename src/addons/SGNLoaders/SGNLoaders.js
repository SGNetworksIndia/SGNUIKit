/*
 * Copyright (c) 2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

/************************************************************************************************************************************************************
 ******************************************************SGNLoader v1.0.9***************************************************************************************
 *************************************************************************************************************************************************************
 *	DATE: December 19, 2019																																	*
 *	AUTHOR: Sagnik Ganguly																																	*
 *	E-MAIL: sagnikganguly2012@rediffmail.com																												*
 *	WEBSITE: https://plugins.sgnetworks.ga/jquery/SGNLoader																									*
 *	DOCUMENTATION: https://docs.plugins.sgnetworks.ga/jquery/SGNLoader																						*
 *************************************************************************************************************************************************************
 *	DEPENDENCIES:																																			*
 *		jQuery v3.2.1+																																		*
 ************************************************************************************************************************************************************/
/************************************************************************************************************************************************************
 *	WHAT'S NEW:																																				*
 *		Version: 1.0.9																																		*
 *			+ Added Option 'addElementClass'																												*
 *			+ Added Option 'addElementStyles'																												*
 *			+ Added Option 'loaderType'																														*
 *			+ Added Option 'type'																															*
 *			+ Added Option 'dialogHeading'																													*
 *			+ Added Option 'dialogHeadingImg'																												*
 *			+ Added Option 'dialogHeadingText'																												*
 *			+ Added Option 'dialogBody'																														*
 *			+ Added Option 'dialogBodyImg'																													*
 *			+ Added Option 'dialogBodyText'																													*
 *			+ Added Option 'modalImg'																														*
 *			+ Added Option 'modalText'																														*
 *			+ Added Option 'modalFooterImg'																													*
 *			+ Added Option 'modalFooterText'																												*
 *			+ Added Option 'speedup'																														*
 *			+ Added Option 'barStripesDirection'																											*
 *			+ Added Callback Function 'onShow'																												*
 *			+ Added Callback Function 'onHide'																												*
 *			+ Added Callback Function 'onRemove'																											*
 ************************************************************************************************************************************************************/
/************************************************************************************************************************************************************
 *	USAGE:																																					*
 *************************************************************************************************************************************************************
 *	INITIALIZATION:																																			*
 *		$(".myLoader").SGNLoader({																															*
 *			//Options																																		*
 *		});																																					*
 *                                                                                                                                                            *
 *                                                                                                                                                            *
 *	OPTIONS:																																				*
 *		animation			:	'default','linear','ease','easein','easeinout','easeout','steps','stepstart','stepend'										*
 *		border				:	'default','xxxs','xxs','xs','sm','md','lg','xl','xxl','xxxl'																*
 *		size				:	'default','xxs','xxs','xs','sm','md','lg','xl','xxl','xxl'																	*
 *		slowdown			:	'default','1x','2x','3x','4x','5x'																							*
 *		speedup				:	'default','1x','2x','3x','4x','5x','6x','7x','8x','9x','10x','11x','12x','13x','14x','15x','16x','17x','18x','19x','20x'	*
 *		style				:	'default','black','black-inverse','white','white-inverse','colour','neon','nimbus','trimmed'								*
 *		barStripesDirection	:	'left','right'																												*
 *		keepContents		:	true,false																													*
 *		showContents		:	true,false																													*
 *		keepSize			:	true,false																													*
 *		addElementClass		:	'name of css class(es)'																										*
 *		addElementStyles	:	'custom css3 rules for root element'																						*
 *		strictHide			:	true,false																													*
 *		halign				:	'left','center','right'																										*
 *		valign				:	'default','top','middle','bottom'																							*
 *		disable				:	true,false																													*
 *		loaderType			:	'spinner','bar'																												*
 *		type				:	'default','dialog','modal'																									*
 *		dialogHeading		:	'[HTML]'																													*
 *		dialogHeadingImg	:	'[IMAGE URL]'																												*
 *		dialogHeadingText	:	'[TEXT]'																													*
 *		dialogBody			:	'[HTML]'																													*
 *		dialogBodyImg		:	'[IMAGE URL]'																												*
 *		dialogBodyText		:	'[TEXT]'																													*
 *		modalImg			:	'[IMAGE URL]'																												*
 *		modalText			:	'[TEXT]'																													*
 *		modalFooterImg		:	'[IMAGE URL]'																												*
 *		modalFooterText		:	'[TEXT]'																													*
 *                                                                                                                                                            *
 *                                                                                                                                                            *
 *	EVENTS:																																					*
 *		onCreate	:	Fired after the loader has been created																								*
 *			ARGUMENTS	:	function(callback)																												*
 *			SYNTAX		:	- At the time of initialization:																								*
 *								$(".myLoader").SGNLoader({																									*
 *									onCreate: function(callback){																							*
 *										//do something																										*
 *									}																														*
 *									-----------OR---------																									*
 *									onCreate: myCallbackFunction(callback)																					*
 *								});																															*
 *							- At the time of update (After initialization):																					*
 *								$(".myLoader").SGNLoader().update({																							*
 *									onCreate: function(callback){																							*
 *										//do something																										*
 *									}																														*
 *									-----------OR---------																									*
 *									onCreate: myCallbackFunction(callback)																					*
 *								});																															*
 *		onShow		:	Fired after the loader has been shown																								*
 *			ARGUMENTS	:	function(callback)																												*
 *			SYNTAX		:	- At the time of initialization:																								*
 *								$(".myLoader").SGNLoader({																									*
 *									onShow: function(callback){																								*
 *										//do something																										*
 *									}																														*
 *									-----------OR---------																									*
 *									onShow: myCallbackFunction(callback)																					*
 *								});																															*
 *							- At the time of update (After initialization):																					*
 *								$(".myLoader").SGNLoader().update({																							*
 *									onShow: function(callback){																								*
 *										//do something																										*
 *									}																														*
 *									-----------OR---------																									*
 *									onShow: myCallbackFunction(callback)																					*
 *								});																															*
 *		onHide		:	Fired after the loader has been shown																								*
 *			ARGUMENTS	:	function(callback)																												*
 *			SYNTAX		:	- At the time of initialization:																								*
 *								$(".myLoader").SGNLoader({																									*
 *									onHide: function(callback){																								*
 *										//do something																										*
 *									}																														*
 *									-----------OR---------																									*
 *									onHide: myCallbackFunction(callback)																					*
 *								});																															*
 *							- At the time of update (After initialization):																					*
 *								$(".myLoader").SGNLoader().update({																							*
 *									onHide: function(callback){																								*
 *										//do something																										*
 *									}																														*
 *									-----------OR---------																									*
 *									onHide: myCallbackFunction(callback)																					*
 *								});																															*
 *		onRemove		:	Fired after the loader has been shown																							*
 *			ARGUMENTS	:	function(callback)																												*
 *			SYNTAX		:	- At the time of initialization:																								*
 *								$(".myLoader").SGNLoader({																									*
 *									onRemove: function(callback){																							*
 *										//do something																										*
 *									}																														*
 *									-----------OR---------																									*
 *									onRemove: myCallbackFunction(callback)																					*
 *								});																															*
 *							- At the time of update (After initialization):																					*
 *								$(".myLoader").SGNLoader().update({																							*
 *									onRemove: function(callback){																							*
 *										//do something																										*
 *									}																														*
 *									-----------OR---------																									*
 *									onRemove: myCallbackFunction(callback)																					*
 *								});																															*
 *                                                                                                                                                            *
 *                                                                                                                                                            *
 *	METHODS:																																				*
 *		show()							:	Show the currently initialized hidden loader																	*
 *			SYNTAX		:	$(".myLoader").SGNLoader().show();																								*
 *                                                                                                                                                            *
 *		hide([boolean strict=false])	:	Show the currently initialized shown loader																		*
 *			ARGUMENTS	:	strict - false(default). If true, SGNLoader will remove the layout also															*
 *			SYNTAX		:	$(".myLoader").SGNLoader().hide();																								*
 *                                                                                                                                                            *
 *		update(json options)			:	Update the currently initialized loader with new option(s)														*
 *			ARGUMENTS	:	options - specify the option to be modified																						*
 *			SYNTAX		:	$(".myLoader").SGNLoader().update({																								*
 *								style: "nimbus"																												*
 *							});																																*
 *                                                                                                                                                            *
 *		remove()						:	Remove the currently initialized loader																			*
 *			SYNTAX		:	$(".myLoader").SGNLoader().remove()																								*
 ************************************************************************************************************************************/

(function($) {
	$.fn.removeClassStartingWith = function(name) {
		let classes = this.attr('class');
		if(classes) {
			classes = classes.replace(new RegExp('\\b' + name + '\\S*\\s?', 'g'), '').trim();
			classes ? this.attr('class', classes) : this.removeAttr('class');
		}
		return this;
	};

	var SGNLoader = function(element, options) {
		var _pluginName    = "SGNLoader",
		    _pluginVersion = "1.0.9";
		var _defaults = {
			animation: 'linear',
			border: 'sm',
			size: 'xs',
			slowdown: '2x',
			speedup: '1x',
			style: 'default',
			barStripesDirection: 'left',
			keepContents: true,
			showContents: false,
			keepSize: true,
			addElementClass: '',
			strictHide: false,
			positionType: 'absolute',
			halign: 'center',
			valign: 'middle',
			disable: true,
			icon: '',
			backdrop: false,
			transitive: false,
			transitionDuration: 1000,
			loaderType: 'spinner',
			type: 'default',
			dialogHeadingText: 'Loading',
			dialogBodyText: 'Please wait...',
			onCreate: function(el, spinner) {},
			onShow: function(el, spinner) {},
			onHide: function(el, spinner) {},
			onRemove: function(el, spinner) {}
		}
		var _options = {
			animation: [
				'default', 'linear', 'ease', 'easein', 'easeinout', 'easeout', 'steps', 'stepstart', 'stepend'
			],
			border: [
				'default', 'xxxs', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'
			],
			size: [
				'default', 'xxxs', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'
			],
			slowdown: [
				'default', '1x', '2x', '3x', '4x', '5x'
			],
			speedup: [
				'default', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x', '11x', '12x', '13x', '14x', '15x', '16x', '17x', '18x', '19x', '20x'
			],
			style: [
				'default', 'black', 'black-inverse', 'white', 'white-inverse', 'colour', 'neon', 'nimbus', 'trimmed'
			],
			barStripesDirection: [
				'left', 'right'
			],
			keepContents: [
				true, false
			],
			showContents: [
				true, false
			],
			keepSize: [
				true, false
			],
			backdrop: [
				true, false
			],
			transitive: [
				true, false
			],
			transitionDuration: ':number',
			addElementClass: ':string',
			addElementStyles: ':string',
			strictHide: [
				true, false
			],
			positionType: [
				'absolute', 'flex', 'relative'
			],
			halign: [
				'default', 'left', 'center', 'right'
			],
			valign: [
				'default', 'top', 'middle', 'bottom'
			],
			disable: [
				true, false
			],
			loaderType: [
				'spinner', 'bar'
			],
			icon: ':string',
			type: [
				'default', 'dialog', 'modal'
			],
			dialogHeading: ':string',
			dialogHeadingImg: ':url',
			dialogHeadingText: ':string',
			dialogBody: ':string',
			dialogBodyImg: ':url',
			dialogBodyText: ':string',
			modalImg: ':url',
			modalText: ':string',
			modalFooterImg: ':url',
			modalFooterText: ':string',
			onCreate: '',
			onShow: '',
			onHide: '',
			onRemove: ''
		};
		var plugin = this;

		plugin.settings = {}

		let $element = $(element), $loader;
		const $this = $element;

		plugin.init = function(args) {
			if(options !== undefined && options.hasOwnProperty('loaderType')) {
				if((options.loaderType == 'spinner' || options.loaderType == 'default')) {
					_defaults.slowdown = '2x';
				} else if(options.loaderType == 'bar') {
					_defaults.slowdown = '1x';
				}
			}
			plugin.settings = $.extend(_defaults, options);
			if(plugin.settings.type == 'modal' || plugin.settings.type == 'dialog') {
				plugin.settings.keepSize = false;
			}
			$.each(plugin.settings, function(k, v) {
				if(typeof v === 'function') {
					if(_options.hasOwnProperty(k)) {
						_checked = true;
					} else {
						_checked = false;
						$.error('Invalid callback for: ' + k + ' in jQuery.' + _pluginName + ' v' + _pluginVersion);
					}
				} else if(typeof v === 'string') {
					if($.inArray(v, _options[k]) !== -1 || _options[k] == ':string' || _options[k] == ':number') {
						_checked = true;
					} else {
						_checked = false;
						$.error('Invalid value: ' + v + ' for option: ' + k + ' in jQuery.' + _pluginName + ' v' + _pluginVersion);
					}
				}
			});
			if(_checked) {
				$element.data('sgn-loader', plugin.settings);
				plugin.settings = $element.data('sgn-loader');
				create();
			}
		}

		//PUBLIC METHODS
		plugin.showLoader = function(duration, callback) {
			showLoader(duration, callback);
		}
		plugin.hideLoader = function(duration, callback, strict) {
			hideLoader(duration, callback, strict);
		}
		plugin.update = function(options) {
			update(options);
		}
		plugin.removeLoader = function() {
			removeLoader();
		}

		//PRIVATE METHODS
		var getClasses = function() {
			var rx = /(^|\s)sgn-loader-\S+/g;
			var classes = $element.attr('class').split(' ');
			var ret = "";
			$.each(classes, function(i, c) {
				if(rx.test(c) || c == "sgn-loader" || c == "sgn-spinner" || c == "sgn-bar")
					ret = c + " ";
			});
			return ret.trim();
		}
		var create = function() {
			if(plugin.settings.type == 'modal' || plugin.settings.type == 'dialog') {
				$element.addClass("sgn-loader-modal");
			} else {
				$element.removeClass("sgn-loader-modal");
			}
			let _anim = '', _border = '', _size = '', _slowdown = '', _style = '', _classes = '';
			if(plugin.settings.loaderType == 'spinner' || plugin.settings.loaderType == 'default') {
				if(plugin.settings.animation) {
					_anim = "sgn-spinner-animation-" + plugin.settings.animation;
				}
				if(plugin.settings.border) {
					_border = "sgn-loader-border-" + plugin.settings.border;
				}
				if(plugin.settings.size) {
					_size = "sgn-loader-" + plugin.settings.size;
				}
				if(plugin.settings.slowdown) {
					_slowdown = "sgn-spinner-" + plugin.settings.slowdown;
				}
				if(plugin.settings.style) {
					_style = "sgn-spinner-" + plugin.settings.style;
				}
				_classes = _style + " " + _slowdown + " " + _size + " " + _border + " " + _anim;
				_classes = "sgn-spinner " + _classes.trim();
			} else if(plugin.settings.loaderType == 'bar') {
				if(plugin.settings.animation) {
					_anim = "sgn-bar-animation-" + plugin.settings.animation;
				}
				if(plugin.settings.size) {
					_size = "sgn-loader-" + plugin.settings.size;
				}
				if(plugin.settings.slowdown) {
					_slowdown = "sgn-bar-delay-" + plugin.settings.slowdown;
				}
				if(plugin.settings.barStripesDirection) {
					_barStripesDirection = "sgn-bar-stripes-" + plugin.settings.barStripesDirection;
				}
				if(plugin.settings.speedup) {
					_speedup = "sgn-bar-speed-" + plugin.settings.speedup;
				}
				if(plugin.settings.style) {
					_style = "sgn-bar-" + plugin.settings.style;
				}
				_classes = _style + " " + _size + " " + _barStripesDirection + " " + _slowdown + " " + _speedup + " " + _anim;
				_classes = "sgn-bar " + _classes.trim();
			}
			if(plugin.settings.keepSize) {
				/*_width = $element.width();
				 _height = $element.height();
				 if(_width > 0)
				 $element.width(_width);
				 if(_height > 0)
				 $element.height(_height);*/
			}
			if(plugin.settings.disable) {
				$element.attr("disabled", true);
			}
			if(plugin.settings.addElementClass) {
				$element.addClass(plugin.settings.addElementClass);
			}

			let iconHTML = '';
			if(!empty(plugin.settings.icon)) {
				iconHTML = `<img class="sgn-spinner-icon" src="${plugin.settings.icon}">`;
			}

			var _content = ($element.html()) ? $element.html() : "";
			/* _showContent = (plugin.settings.showContents) ? '' : ' style="display:none;"';
			 _content = '<span class="sgn-spinner-contents"' + _showContent + '>' + _content + '</span>';
			 _content = (plugin.settings.keepContents) ? _content : ""; */
			$element.removeClass("sgn-loader").addClass("sgn-loader");

			$element.data('SGNLoaderContents', _content);

			let html;
			if(plugin.settings.loaderType == 'spinner' || plugin.settings.loaderType == 'default') {
				html = `<span class="${_classes}" style="display:none;">${iconHTML}</span>`;
			} else if(plugin.settings.loaderType == 'bar') {
				html = `<span class="${_classes}" style="display:none;"><span class="bar"></span></span>`;
			}
			if($element.find('.sgn-spinner').length > 0)
				$element.find('.sgn-spinner').remove();

			if(plugin.settings.transitive && plugin.settings.transitionDuration > 0) {
				$element.append(html);
			} else {
				$element.append(html);
			}

			if((plugin.settings.halign != '' && plugin.settings.halign != null && plugin.settings.halign !== undefined && plugin.settings.halign != 'default') &&
			   (plugin.settings.valign != '' && plugin.settings.valign != null && plugin.settings.valign !== undefined && plugin.settings.valign != 'default')) {
				if(plugin.settings.halign == 'default')
					plugin.settings.halign = 'center';
				if(plugin.settings.valign == 'default')
					plugin.settings.valign = 'middle';
				if(plugin.settings.valign != '' && plugin.settings.valign != null && plugin.settings.valign !== undefined)
					_align = plugin.settings.valign;
				if(plugin.settings.halign != '' && plugin.settings.halign != null && plugin.settings.halign !== undefined)
					_align = _align + "_" + plugin.settings.halign;

				if(plugin.settings.positionType !== undefined)
					positionType = plugin.settings.positionType;

				if(plugin.settings.loaderType == 'spinner' || plugin.settings.loaderType == 'default')
					$element.children('.sgn-spinner').addClass('sgn-loader-aligner-type-' + positionType + ' sgn-loader-aligner-' + _align);
				else if(plugin.settings.loaderType == 'bar')
					$element.children('.sgn-bar').addClass('sgn-loader-aligner-type-' + positionType + ' sgn-loader-aligner-' + _align);
			}
			$loader = $element.children('.sgn-spinner');
			//hideLoader();
			if(plugin.settings.loaderType == 'spinner' || plugin.settings.loaderType == 'default') {
				plugin.settings.onCreate($element, $element.children('.sgn-spinner'));
				plugin.settings.onShow($element, $element.children('.sgn-spinner'));

				$this.data("SGNSpinner", plugin);
			} else if(plugin.settings.loaderType == 'bar') {
				plugin.settings.onCreate($element, $element.children('.sgn-bar'));
				plugin.settings.onShow($element, $element.children('.sgn-bar'));

				$this.data("SGNLoader", plugin);
			}
		}
		var update = function(options) {
			_defaults = (!$element.data('sgn-loader')) ? defaults : $element.data('sgn-loader');
			plugin.settings = $.extend(_defaults, options);
			$.each(plugin.settings, function(k, v) {
				if(typeof v === 'function') {
					if(_options.hasOwnProperty(k)) {
						_checked = true;
					} else {
						_checked = false;
						$.error('Invalid callback for ' + k + ' in jQuery.' + _pluginName + ' v' + _pluginVersion);
					}
				} else if(typeof v === 'object') {
					if($.inArray(v, _options[k]) !== -1) {
						_checked = true;
					} else {
						_checked = false;
						$.error('Invalid Value for option ' + k + ' in jQuery.' + _pluginName + ' v' + _pluginVersion);
					}
				}
			});
			if(_checked) {
				if(plugin.settings.animation) {
					_anim = "sgn-spinner-animation-" + plugin.settings.animation;
				}
				if(plugin.settings.border) {
					_border = "sgn-loader-border-" + plugin.settings.border;
				}
				if(plugin.settings.size) {
					_size = "sgn-loader-" + plugin.settings.size;
				}
				if(plugin.settings.slowdown) {
					_slowdown = "sgn-spinner-" + plugin.settings.slowdown;
				}
				if(plugin.settings.style) {
					_style = "sgn-spinner-" + plugin.settings.style;
				}
				_classes = _style + " " + _slowdown + " " + _size + " " + _border + " " + _anim;
				_classes = "sgn-spinner " + _classes.trim();
				var _content = ($element.html()) ? $element.html() : "";
				_showContent = (plugin.settings.showContents) ? '' : ' style="display:none;"';
				_content = '<span class="sgn-spinner-contents"' + _showContent + '>' + _content + '</span>';
				_content = (plugin.settings.keepContents) ? _content : "";
				if($element.hasClass("sgn-loader")) {
					if($element.children(".sgn-spinner").length > 0) {
						$element.children(".sgn-spinner").removeClass().addClass(_classes);
					} else {
						$element.html('<span class="' + _classes + '"></span>' + _content);
					}
				} else {
					if($element.children(".sgn-spinner").length > 0) {
						$element.addClass("sgn-loader");
						$element.children(".sgn-spinner").removeClass().addClass(_classes);
					} else {
						$element.removeClass("sgn-loader").addClass("sgn-loader");
						$element.html('<span class="' + _classes + '"></span>' + _content);
					}
				}
			}
		}
		var showLoader = function(duration, callback) {
			var settings = $element.data('sgn-loader') || plugin.settings;
			if(!$element.hasClass("sgn-loader"))
				$element.addClass("sgn-loader");
			if(settings.disable)
				$element.attr("disabled", true);

			const _content = ($element.html()) ? $element.html() : "";
			$element.data('SGNLoaderContents', _content);

			if($element.find('.sgn-spinner').length <= 0) {
				if((plugin.settings.transitive && plugin.settings.transitionDuration > 0) || (typeof duration === 'number' && duration > 0)) {
					$element.append($loader);
				} else {
					$element.html($loader);
				}
			}

			if(plugin.settings.loaderType == 'spinner' || plugin.settings.loaderType == 'default') {
				const $spinner = $element.children(".sgn-spinner");
				//$spinner.next(".sgn-spinner-contents").hide();

				if(typeof duration === 'number' && duration > 0) {
					$spinner.fadeIn(duration, () => {
						settings.onShow($element, $spinner);
						if(typeof callback === 'function') callback($spinner);
					});
				} else {
					if(plugin.settings.transitive && plugin.settings.transitionDuration > 0) {
						$element.find('*').fadeOut(plugin.settings.transitionDuration, function() {
							$element.children(".sgn-spinner:not(.shown)").fadeIn(plugin.settings.transitionDuration, function() {
								$element.children(".sgn-spinner").addClass('shown');
							});
							settings.onShow($element, $element.children('.sgn-spinner'));
						});
					} else {
						$spinner.show();
						settings.onShow($element, $spinner);
					}
				}
			} else if(plugin.settings.loaderType == 'bar') {
				//$element.children(".sgn-bar").next(".sgn-spinner-contents").hide();
				$element.children(".sgn-bar").show();
				settings.onShow($element, $element.children('.sgn-bar'));
			}
		}
		var hideLoader = function(duration, callback, strict) {
			var settings = $element.data('sgn-loader') || plugin.settings;
			var strict = (typeof strict == 'undefined') ? $element.data('sgn-loader').strictHide : strict;

			const _content = $element.data('SGNLoaderContents');
			if(plugin.settings.loaderType == 'spinner' || plugin.settings.loaderType == 'default') {
				//$element.children(".sgn-spinner").next(".sgn-spinner-contents").show();
				const $spinner = $element.children(".sgn-spinner");
				if(typeof duration === 'number' && duration > 0) {
					$spinner.fadeOut(duration, () => {
						//$element.html(_content);
						$spinner.hide();
						settings.onHide($element, $spinner);
						if(typeof callback === 'function') callback($spinner);
					});
				} else {
					$spinner.hide();
					$element.html(_content);
					settings.onHide($element, $spinner);
				}
			} else if(plugin.settings.loaderType == 'bar') {
				//$element.children(".sgn-bar").next(".sgn-spinner-contents").show();
				const $loader = $element.children(".sgn-bar");
				$loader.hide();
				$element.html(_content);
				settings.onHide($element, $loader);
			}

			if(settings.disable)
				$element.removeAttr("disabled");
			$element.removeClass('sgn-loader');
			if(strict) {
				$element.removeClass(getClasses());
			}

			/* if(plugin.settings.loaderType == 'spinner' || plugin.settings.loaderType == 'default')
			 settings.onHide($element, $element.children('.sgn-spinner'));
			 else if(plugin.settings.loaderType == 'bar')
			 settings.onHide($element, $element.children('.sgn-bar')); */
		}
		var removeLoader = function(options) {
			var settings = $element.data('sgn-loader') || plugin.settings;
			var _content;
			if(settings.disable)
				$element.removeAttr("disabled");
			if(plugin.settings.loaderType == 'spinner' || plugin.settings.loaderType == 'default') {
				_content = $element.children(".sgn-spinner").next(".sgn-spinner-contents").html();
				$element.children(".sgn-spinner").remove();
			} else if(plugin.settings.loaderType == 'bar') {
				_content = $element.children(".sgn-bar").next(".sgn-spinner-contents").html();
				$element.children(".sgn-bar").remove();
			}
			$element.removeClass("sgn-loader");
			$element.css("width", "");
			$element.css("height", "");
			$element.html(_content);
			if(plugin.settings.loaderType == 'spinner' || plugin.settings.loaderType == 'default')
				settings.onRemove($element, $element.children('.sgn-spinner'));
			else if(plugin.settings.loaderType == 'bar')
				settings.onRemove($element, $element.children('.sgn-bar'));
		}

		if($this.data("SGNLoader") === undefined && $this.data("SGNSpinner") === undefined)
			plugin.init();
	}

	// add the plugin to the jQuery.fn object
	$.fn.SGNLoader = function(options = {}) {
		const _this = this;
		const $this = $(_this);

		const init = () => {
			const defaults = {
				type: 'dialog',
				backdrop: true
			};
			options = $.extend(options, defaults);

			$this.data('SGNLoader', new SGNLoader($this, options));
		};

		this.show = function() {
			const plugin = $(this).data("SGNLoader");
			if(plugin !== undefined)
				plugin.showLoader();

			return this;
		}
		this.hide = function(strict) {
			const plugin = $(this).data("SGNLoader");
			if(plugin !== undefined)
				plugin.hideLoader();

			return this;
		}
		this.update = function(options) {
			const plugin = $(this).data("SGNLoader");
			if(plugin !== undefined)
				plugin.update();

			return this;
		}
		this.remove = function() {
			const plugin = $(this).data("SGNLoader");
			if(plugin !== undefined)
				plugin.removeLoader();

			return this;
		}

		if($this.data("SGNLoader") === undefined)
			init();

		return this;
	}

	$.fn.SGNSpinner = function(options = {}) {
		var _this = this;
		var _plugin = new SGNLoader(this, options);
		this.initialize = function() {
			_plugin.init(options);
			return this;
		}
		this.show = function(duration, callback) {
			_plugin.showLoader(duration, callback);
		}
		this.hide = function(duration, callback, strict) {
			_plugin.hideLoader(duration, callback, strict);
		}
		this.update = function(options) {
			_plugin.update(options);
		}
		this.remove = function() {
			_plugin.removeLoader();
		}
		if(this.data('SGNLoader') === undefined && this.data('SGNSpinner') === undefined)
			return this.initialize();
		return this;
	}

	return this;

})(jQuery);
