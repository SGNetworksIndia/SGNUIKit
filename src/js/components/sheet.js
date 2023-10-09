// noinspection SpellCheckingInspection

/*
 * Copyright (c) 2023 SGNetworks. All rights reserved.
 * Copyright (c) 2022 Ivan Teplov
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

if(typeof jQuery === "undefined") {
	throw new Error("SGNSheet requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	/**
	 * @typedef {Object} SGNSheetOptions The options for <b>SGNSheet</b>
	 *
	 * @property {number} [defaultHeight=25] Set the default height of <b>SGNSheet</b>.<br/>Minimum: 10<br/>Maximum: 100
	 * @property {number} [snap=10] Set the value to snap to the height of <b>SGNSheet</b>.<br/>Minimum: 10<br/>Maximum: 90
	 */

	/**
	 *
	 * @param {jQuery} $elem The <b>DOM Element</b> wrapped with <b>jQuery</b> where the <b>SGNSheet</b> will be initialized.
	 * @param {SGNSheetOptions} [options={}] A JSON object specifying the options to override default settings.
	 *
	 * @return {SGNSheet} An instance of <b>SGNSheet</b> if initialized.
	 *
	 * @constructor
	 */
	const SGNSheet = function($elem, options) {
		const plugin = this;
		const $_this  = $elem,
		      $window = $(window);
		const minimumHeight = 10, maximumHeight = 100, defaultHeight = 25, snap = 10;
		const settings = {
			defaultHeight: defaultHeight,
			snap: snap
		};
		const overlayHTML        = `<div class="overlay"></div>`,
		      draggableThumbHTML = `<div class="draggable-thumb"></div>`,
		      closeBtnHTML       = `<button class="sgn-sheet-closeBtn" type="button" title="{{txt_close}}">&times;</button>`,
		      draggableAreaHTML  = `<div class="draggable-area">${draggableThumbHTML}</div>`,
		      controlsHTML       = `<div class="sgn-sheet-controls">${draggableAreaHTML}${closeBtnHTML}</div>`,
		      bodyHTML           = `<div class="sgn-sheet-body"/>`,
		      wrapperHTML        = `<div class="sgn-sheet-wrapper"/>`;

		let $wrapper        = $_this.parent('.sgn-sheet-wrapper'),
		    $overlay        = $wrapper.children(".overlay"),
		    $sheet          = select($wrapper.children(".sgn-sheet"), $_this),
		    $controls       = $sheet.children(".sgn-sheet-controls"),
		    $draggableThumb = $controls.children(".draggable-thumb"),
		    $draggableArea  = $controls.children(".draggable-area"),
		    $closeBtn       = $controls.children(".sgn-sheet-closeBtn"),
		    $body           = $sheet.children(".sgn-sheet-body");

		let dragPosition, sheetHeight; // in vh

		const init = () => {
			$.extend(settings, options);
			settings.defaultHeight = (settings.defaultHeight < minimumHeight || settings.defaultHeight > maximumHeight) ? defaultHeight : settings.defaultHeight;
			settings.snap = (settings.snap < minimumHeight || settings.snap > maximumHeight) ? snap : settings.snap;

			if($wrapper.length === 0) {
				$sheet.wrap(wrapperHTML);
				$wrapper = $_this.parent('.sgn-sheet-wrapper');
			}

			if($body.length === 0) {
				$sheet.append(bodyHTML);
				$body = $sheet.children(".sgn-sheet-body");
			}

			if($controls.length > 0) {
				if($draggableArea.length > 0) {
					if($draggableThumb.length === 0) {
						$draggableArea.html(draggableThumbHTML);
						$draggableThumb = $controls.children(".draggable-thumb");
					}
				} else {
					$controls.prepend(draggableAreaHTML);
					$draggableThumb = $controls.children(".draggable-thumb");
					$draggableArea = $controls.children(".draggable-area");
				}
			} else {
				$sheet.prepend(controlsHTML);
				$controls = $sheet.children(".sgn-sheet-controls");
				$draggableThumb = $controls.children(".draggable-thumb");
				$draggableArea = $controls.children(".draggable-area");
				$closeBtn = $controls.children(".sgn-sheet-closeBtn");
			}

			if($overlay.length === 0) {
				$wrapper.prepend(overlayHTML);
				$overlay = $wrapper.children(".overlay");
			}

			bindEvents();

			$elem.data("SGNSheet", plugin);
			$elem[0]["SGNSheet"] = plugin;
		}

		const bindEvents = () => {
			//const isFocused = element => document.activeElement === element;

			// Hide the sheet when clicking the 'close' button
			$closeBtn.on("click", (e) => {
				e.preventDefault();
				plugin.close();
			});

			// Hide the sheet when clicking the background
			$overlay.on("click", (e) => {
				e.preventDefault();
				plugin.close();
			});

			// Hide the sheet when pressing Escape if the target element is not an input field
			$window.on("keyup", (e) => {
				e.preventDefault();
				//const isSheetElementFocused = $sheet.contains(e.target) && isFocused(e.target);
				const isSheetElementFocused = false;

				if(e.key === "Escape" && !isSheetElementFocused) {
					plugin.close();
				}
			});


			$draggableArea.on("mousedown", onDragStart);
			$draggableArea.on("touchstart", onDragStart);

			$window.on("mousemove", onDragMove);
			$window.on("touchmove", onDragMove);

			$window.on("mouseup", onDragEnd);
			$window.on("touchend", onDragEnd);
		}

		const setSheetHeight = (value) => {
			sheetHeight = Math.max(0, Math.min(100, value));
			$sheet.height(`${sheetHeight}vh`);

			if(sheetHeight === 100) {
				$sheet.addClass("fullscreen");
			} else {
				$sheet.removeClass("fullscreen");
			}
		}

		const setIsSheetShown = (isShown) => {
			$wrapper.attr("aria-hidden", String(!isShown));
			setSheetHeight(settings.defaultHeight);
		}

		const touchPosition = (event) => event.touches ? event.touches[0] : event;

		const onDragStart = (e) => {
			e.preventDefault();
			dragPosition = touchPosition(e).pageY;
			$wrapper.addClass("not-selectable");
			$draggableArea[0].style.cursor = document.body.style.cursor = "grabbing";
		}

		const onDragMove = (e) => {
			e.preventDefault();
			if(dragPosition === undefined) return;

			const y = touchPosition(e).pageY;
			const deltaY = dragPosition - y;
			const deltaHeight = deltaY / window.innerHeight * 200;

			setSheetHeight(sheetHeight + deltaHeight);
			dragPosition = y;
		}

		const onDragEnd = (e) => {
			e.preventDefault();
			dragPosition = undefined;
			$sheet.removeClass("not-selectable");
			$draggableArea[0].style.cursor = document.body.style.cursor = "";

			if(sheetHeight < minimumHeight) {
				setIsSheetShown(false);
			} else if(sheetHeight > (maximumHeight - settings.snap)) {
				setSheetHeight(maximumHeight);
			} else {
				setSheetHeight(settings.defaultHeight);
			}
		}

		plugin.open = () => setIsSheetShown(true);

		plugin.close = () => setIsSheetShown(false);

		plugin.toggleSheet = () => {
			if(!Boolean($wrapper.attr("aria-hidden")))
				plugin.close();
			else
				plugin.open();
		};

		plugin.remove = () => $wrapper.toggle(() => $wrapper.remove());

		if($elem.length > 0 && ($sheet.hasClass('sgn-sheet') || $elem.attr('sgn-component') || $elem.attr('data-sgn-component') || $elem.attr('data-component')))
			init();
		else
			throw new Error(`[SGNSheet] Failed to initialize SGNSheet: Invalid DOM element supplied.`);

		return plugin;
	}

	/**
	 * Initialize <b>SGNSheet</b> on the element.

	 * @param {SGNSheetOptions} [options={}] A JSON object specifying the options to override default settings.
	 *
	 * @return {jQuery.SGNSheet} The <b>jQuery</b> to retain method chaining capabilities.
	 *
	 * @constructor
	 */
	$.fn.SGNSheet = function(options) {
		const _this = this;
		const $_this = $(_this);

		const init = () => {
			const data = $_this.data("SGNSheet");

			const plugin = (data === undefined) ? new SGNSheet($_this, options) : data;

			$_this.data("SGNSheet", plugin);
			$_this[0]["SGNSheet"] = plugin;
		};

		/***
		 * Open the currently selected <b><i>SGNSheet</b> instance</i>.
		 *
		 * @returns {jQuery.SGNSheet}
		 */
		_this.open = function() {
			const plugin = $(this).data("SGNSheet");
			if(plugin !== undefined)
				plugin.open();

			return _this;
		};

		/***
		 * Close the currently selected <b><i>SGNSheet</b> instance</i>.
		 *
		 * @returns {jQuery.SGNSheet}
		 */
		_this.close = function() {
			const plugin = $(this).data("SGNSheet");
			if(plugin !== undefined)
				plugin.close();

			return _this;
		};

		/***
		 * Toggle between open/close operations of the currently selected <b><i>SGNSheet</b> instance</i>.
		 *
		 * @returns {jQuery.SGNSheet}
		 */
		_this.toggleSheet = function() {
			const plugin = $(this).data("SGNSheet");
			if(plugin !== undefined)
				plugin.toggleSheet();

			return _this;
		};

		if($_this.data("SGNSheet") === undefined) {
			if($_this.length > 0 && ($_this.hasClass('sgn-sheet') || $_this.attr('sgn-component') || $_this.attr('data-sgn-component') || $_this.attr('data-component')))
				init();
			else
				throw new Error(`[SGNSheet] Failed to initialize SGNSheet: Invalid DOM element supplied.`);
		}

		return _this;
	};

	SUKR(() => {
		const $toggles = $('[sgn-sheet], [data-sgn-sheet], [data-sheet]');
		const $sheets = select($('[sgn-component="sheet"], [data-sgn-component="sheet"], [data-component="sheet"]'), $('.sgn-sheet'));

		if($sheets !== undefined) {
			$sheets.each(function() {
				const $this = $(this);
				$this.SGNSheet();
			});
		}

		if($toggles.length > 0) {
			$toggles.each(function() {
				$(this).on("click", function(e) {
					e.preventDefault();

					const $this   = $(this),
					      target  = select($this.attr("sgn-sheet"), $this.attr("data-sgn-sheet"), $this.attr("data-sheet")),
					      $target = $(target);

					if($target.length > 0) {
						$target.SGNSheet().open();
					}
				});
			});
		}
	});
})(window, document, jQuery);
