/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

/* if(typeof jQuery === "undefined") {
 throw new Error("Ripple requires jQuery");
 } */

;(function(window) {
	"use strict";

	const Waves = {},
	      $$    = document.querySelectorAll.bind(document);

	// Find exact position of element
	const isWindow = (obj) => obj !== null && obj === obj.window;

	const getWindow = (elem) => isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;

	const offset = (elem) => {
		const doc = elem && elem.ownerDocument;
		let docElem, win,
		    box = {top: 0, left: 0};

		docElem = doc.documentElement;

		if(typeof elem.getBoundingClientRect !== typeof undefined) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow(doc);
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	}

	const convertStyle = (obj) => {
		let style = "";

		for(const a in obj) {
			if(obj.hasOwnProperty(a)) {
				style += (a + ":" + obj[a] + ";");
			}
		}

		return style;
	}

	const Effect = {
		// Effect delay
		duration: 750,

		show: function(e, element) {
			// Disable right click
			if(e.button === 2) {
				return false;
			}

			const el = element || this;

			// Create ripple
			const ripple = document.createElement("div");
			ripple.className = "waves-ripple";
			el.appendChild(ripple);

			// Get click coordinate and element width
			const pos   = offset(el),
			      scale = "scale(" + ((el.clientWidth / 100) * 10) + ")";
			const d = Math.max(el.clientWidth, el.clientHeight);
			let relativeY = (e.pageY - pos.top),
			    relativeX = (e.pageX - pos.left);

			// Support for touch devices
			if("touches" in e) {
				relativeY = (e.touches[0].pageY - pos.top);
				relativeX = (e.touches[0].pageX - pos.left);
			}

			// Attach data to element
			ripple.setAttribute("data-hold", Date.now().toString());
			ripple.setAttribute("data-scale", scale);
			ripple.setAttribute("data-x", relativeX.toString());
			ripple.setAttribute("data-y", relativeY.toString());

			// Set ripple position
			const rippleStyle = {
				"top": relativeY + "px",
				"left": relativeX + "px"
			};

			ripple.className = ripple.className + " waves-notransition";
			ripple.setAttribute("style", convertStyle(rippleStyle));
			ripple.className = ripple.className.replace("waves-notransition", "");
			ripple.classList.add('waves-active');

			// Scale the ripple
			rippleStyle["-webkit-transform"] = scale;
			rippleStyle["-moz-transform"] = scale;
			rippleStyle["-ms-transform"] = scale;
			rippleStyle["-o-transform"] = scale;
			rippleStyle.transform = scale;
			rippleStyle.opacity = ".2";

			rippleStyle["-webkit-transition-duration"] = Effect.duration + "ms";
			rippleStyle["-moz-transition-duration"] = Effect.duration + "ms";
			rippleStyle["-o-transition-duration"] = Effect.duration + "ms";
			rippleStyle["transition-duration"] = Effect.duration + "ms";

			rippleStyle["-webkit-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)";
			rippleStyle["-moz-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)";
			rippleStyle["-o-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)";
			rippleStyle["transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)";

			ripple.setAttribute("style", convertStyle(rippleStyle));
		},

		hide: function(e) {
			TouchHandler.touchup(e);

			const el    = this,
			      width = el.clientWidth * 1.4;

			// Get first ripple
			let ripple = null;
			const ripples = el.getElementsByClassName("waves-ripple");
			if(ripples.length > 0) {
				ripple = ripples[ripples.length - 1];
			} else {
				return false;
			}

			const relativeX = ripple.getAttribute("data-x"),
			      relativeY = ripple.getAttribute("data-y"),
			      scale     = ripple.getAttribute("data-scale");

			// Get delay between mousedown and mouse leave
			const diff = Date.now() - Number(ripple.getAttribute("data-hold"));
			let delay = 350 - diff;

			if(delay < 0) {
				delay = 0;
			}

			// Fade out ripple after delay
			setTimeout(function() {
				const style = {
					"top": relativeY + "px",
					"left": relativeX + "px",
					"opacity": "0",

					// Duration
					"-webkit-transition-duration": Effect.duration + "ms",
					"-moz-transition-duration": Effect.duration + "ms",
					"-o-transition-duration": Effect.duration + "ms",
					"transition-duration": Effect.duration + "ms",
					"-webkit-transform": scale,
					"-moz-transform": scale,
					"-ms-transform": scale,
					"-o-transform": scale,
					"transform": scale,
				};

				ripple.setAttribute("style", convertStyle(style));

				setTimeout(function() {
					ripple.classList.remove('waves-active');
					try {
						el.removeChild(ripple);
					} catch(e) {
						return false;
					}
				}, Effect.duration);
			}, delay);
		},

		// Little hack to make <input> can perform waves effect
		wrapInput: function(elements) {
			for(let a = 0; a < elements.length; a++) {
				const el = elements[a];

				if(el.tagName.toLowerCase() === "input") {
					const parent = el.parentNode;

					// If input already have parent just pass through
					if(parent.tagName.toLowerCase() === "i" && parent.className.indexOf("waves-effect") !== -1) {
						continue;
					}

					// Put element class and style to the specified parent
					const wrapper = document.createElement("i");
					wrapper.className = el.className + " waves-input-wrapper";

					let elementStyle = el.getAttribute("style");

					if(!elementStyle) {
						elementStyle = "";
					}

					wrapper.setAttribute("style", elementStyle);

					el.className = "waves-button-input";
					el.removeAttribute("style");

					// Put element as child
					parent.replaceChild(wrapper, el);
					wrapper.appendChild(el);
				}
			}
		}
	};

	/**
	 * Disable mousedown event for 500ms during and after touch
	 */
	const TouchHandler = {
		/* uses an integer rather than bool so there's no issues with
		 * needing to clear timeouts if another touch event occurred
		 * within the 500ms. Cannot mouseup between touchstart and
		 * touchend, nor in the 500ms after touchend. */
		touches: 0,
		allowEvent: function(e) {
			let allow = true;

			if(e.type === "touchstart") {
				TouchHandler.touches += 1; //push
			} else if(e.type === "touchend" || e.type === "touchcancel") {
				setTimeout(function() {
					if(TouchHandler.touches > 0) {
						TouchHandler.touches -= 1; //pop after 500ms
					}
				}, 500);
			} else if(e.type === "mousedown" && TouchHandler.touches > 0) {
				allow = false;
			}

			return allow;
		},
		touchup: function(e) {
			TouchHandler.allowEvent(e);
		}
	};

	/**
	 * Delegated click handler for .waves-effect element.
	 * returns null when .waves-effect element not in "click tree"
	 */
	function getWavesEffectElement(e) {
		if(TouchHandler.allowEvent(e) === false) {
			return null;
		}

		let element = null,
		    target  = e.target || e.srcElement;

		while(target.parentElement !== null) {
			if(!(target instanceof SVGElement) && target.className.indexOf("waves-effect") !== -1) {
				element = target;
				break;
			} else if(target.classList.contains("waves-effect")) {
				element = target;
				break;
			}
			target = target.parentElement;
		}

		return element;
	}

	/**
	 * Bubble the click and show effect if .waves-effect elem was found
	 */
	function showEffect(e) {
		const element = getWavesEffectElement(e);

		if(element !== null) {
			Effect.show(e, element);

			if("ontouchstart" in window) {
				element.addEventListener("touchend", Effect.hide, false);
				element.addEventListener("touchcancel", Effect.hide, false);
			}

			element.addEventListener("mouseup", Effect.hide, false);
			element.addEventListener("mouseleave", Effect.hide, false);
		}
	}

	Waves.displayEffect = function(options) {
		options = options || {};

		if("duration" in options) {
			Effect.duration = options.duration;
		}

		//Wrap input inside <i> tag
		//Effect.wrapInput($$(".waves-effect"));

		if("ontouchstart" in window) {
			document.body.addEventListener("touchstart", showEffect, false);
		}

		document.body.addEventListener("mousedown", showEffect, false);
	};

	/**
	 * Attach Waves to an input element (or any element which doesn't
	 * bubble mouseup/mousedown events).
	 *   Intended to be used with dynamically loaded forms/inputs, or
	 * where the user doesn't want a delegated click handler.
	 */
	Waves.attach = function(element) {
		//FUTURE: automatically add waves classes and allow users
		// to specify them with an options param? Eg. light/classic/button
		/* if(element.tagName.toLowerCase() === "input") {
		 Effect.wrapInput([element]);
		 element = element.parentElement;
		 } */

		if("ontouchstart" in window) {
			element.addEventListener("touchstart", showEffect, false);
		}

		element.addEventListener("mousedown", showEffect, false);
	};

	window.Waves = Waves;

	SUKR(() => Waves.displayEffect());

})(window);

