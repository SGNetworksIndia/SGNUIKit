/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict"; // Start of use strict
if(typeof jQuery === "undefined") {
	throw new Error("DynamicEvents requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	if(!Element.prototype.matches) {
		// noinspection JSDeprecatedSymbols,JSUnresolvedVariable
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			function(s) {
				const matches = (this.document || this.ownerDocument).querySelectorAll(s);
				let i = matches.length;
				while(--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	const inlineFunctionRegex = new RegExp("^([\\w.]+)(\\((.+(?=.*\\))+)\\))?;?$", 'gi'),
	      funcArgsRegex       = new RegExp("([^,]+\\(.+?\\))|([^,]+)", 'gi');

	const delegate = (element, event, selector, handler, useCapture, outHandler) => {
		const trigger = (event, element) => {
			if(typeof outHandler === 'function') {
				if(selector === undefined || selector === null) {
					if(element.eventTriggered) {
						outHandler.call(element, event);
						element.eventTriggered = false;
					} else {
						handler.call(element, event);
						element.eventTriggered = true;
					}
				} else {
					let t = event.target;
					while(t && t !== this) {
						if(t.matches(selector)) {
							if(element.eventTriggered) {
								outHandler.call(t, event);
								element.eventTriggered = false;
							} else {
								handler.call(t, event);
								element.eventTriggered = true;
							}
						}
						t = t.parentNode;
					}
				}
			} else {
				let t = event.target;
				while(t && t !== this) {
					if(t.matches(selector)) {
						handler.call(t, event);
					}
					t = t.parentNode;
				}
			}
		};

		if(typeof outHandler === 'function') {
			element.addEventListener(event, function(event) {
				trigger(event, element);
			}, useCapture);
		} else {
			if(selector === undefined || selector === null) {
				element.addEventListener(event, handler, useCapture);
			} else {
				element.addEventListener(event, function(event) {
					trigger(event, element);
				}, useCapture);
			}
		}
	};

	/**
	 * Binds an event dynamically for the DOM element or turns onan event identified by <b>event name</b> and <b>id</b>.<br>If <b>eventName</b> is not specified, every bind events will be turned on.
	 *
	 * @param {string} [eventName=null] The name or space-separated name of events to bind to the context or DOM element.<p>If not specified, every turned-off events will be turned on.</p>
	 * @param {function} [listener=null] The name of the function or an asynchronous function callback to handle the event(s). (not required if <b>eventName</b> is not specified).
	 * @param {string|null} [selector=null] A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
	 * @param {{}|[]|null} [data=null] Data to be passed to the handler in event.data when an event is triggered.
	 * @param {string|null} [id=null] An unique event identifier to distinguish the event from other listeners of same types.<p>If not specified, only the events of the same type identified by <b>eventName</b> will be turned on.</p>
	 *
	 * @return {jQuery} The DOM element
	 * @since 1.1
	 */
	$.fn.on = function(eventName, listener, selector, data, id) {
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

				r += c.toString();
			}
			return r;
		}

		let useCapture = (this[0] === window);

		let listenerArgs = '';
		if(typeof listener === 'string' && inlineFunctionRegex.test(listener)) {
			inlineFunctionRegex.lastIndex = 0;
			const matches = inlineFunctionRegex.exec(listener);

			const funcArgs = [];
			const funcName        = window[matches[1]],
			      funcArgsMatches = (matches[3] !== null) ? matches[3].matchAll(funcArgsRegex) : [];
			for(let argsMatch of funcArgsMatches) {
				argsMatch = argsMatch[0];
				if(!empty(argsMatch)) {
					argsMatch = argsMatch.trim().replace(/(^['"]+|['"]+$)/mg, '');
					if(funcArgs.indexOf(argsMatch) === -1) {
						funcArgs.push(argsMatch);
					}
				}
			}
			listener = function() {
				return funcName.apply($(this)[0], funcArgs);
			};
			listenerArgs = funcArgs;
		}

		const useMouseOver = (typeof listener === 'function' && typeof selector === 'function');
		let outHandler;
		if(typeof listener === 'function') {
			if(typeof selector === 'string' && $(selector).length > 0) {
				if(typeof data === 'object') {
					if(typeof id !== 'string') {
						// $(document).on('event', listener(){}, '#bubling_element', {data: 'test'}, 'event-id');
						// $(document).on('event', listener(){}, '#bubling_element', {data: 'test'});
						id = undefined;
					}
				} else if(typeof data === 'string') {
					if(typeof id === 'object') {
						// $(document).on('event', listener(){}, '#bubling_element', 'event-id', {data: 'test'});
						const tmp = id;
						id = data;
						data = tmp;
					}
				} else if(typeof data === 'undefined') {
					if(typeof id === 'object') {
						// $(document).on('event', listener(){}, '#bubling_element', undefined, {data: 'test'});
						data = id;
					}
				}
			} else if(typeof selector === 'string') {
				const tmp0 = selector;
				if(typeof data === 'object') {
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', listener(){}, 'event-id', {data: 'test'}, '#bubling_element');
						selector = id;
					} else {
						// $(document).on('event', listener(){}, 'event-id', {data: 'test'});
						selector = undefined;
					}
				} else if(typeof data === 'string' && $(data).length > 0) {
					selector = data;
					if(typeof id === 'object') {
						// $(document).on('event', listener(){}, 'event-id', '#bubling_element', {data: 'test'});
						data = id;
					} else {
						// $(document).on('event', listener(){}, 'event-id', '#bubling_element');
						data = undefined;
					}
				} else {
					selector = undefined;
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', listener(){}, 'event-id', undefined, '#bubling_element');
						selector = id;
					} else if(typeof id === 'object') {
						// $(document).on('event', listener(){}, 'event-id', undefined, {data: 'test'});
						data = id;
					} else {
						// $(document).on('event', listener(){}, 'event-id');
						selector = undefined;
					}
				}
				id = tmp0;
			} else if(typeof selector === 'object') {
				const tmp0 = selector;
				if(typeof data === 'string' && $(data).length > 0) {
					selector = data;
					if(typeof id !== 'string')
						id = undefined;
					// $(document).on('event', listener(){}, {data: 'test'}, '#bubling_element', 'event-id');
					// $(document).on('event', listener(){}, {data: 'test'}, '#bubling_element');
				} else if(typeof data === 'string') {
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', listener(){}, {data: 'test'}, 'event-id', '#bubling_element');
						selector = id;
					} else {
						// $(document).on('event', listener(){}, {data: 'test'}, 'event-id');
						selector = undefined;
					}
					id = data;
				} else {
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', listener(){}, {data: 'test'}, undefined, '#bubling_element');
						selector = id;
					} else if(typeof id === 'string') {
						// $(document).on('event', listener(){}, {data: 'test'}, undefined, 'event-id');
						selector = undefined;
					}
				}
				data = tmp0;
			} else if(typeof selector === 'function') {
				outHandler = selector;
				if(typeof data === 'object') {
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', listener(){}, undefined, {data: 'test'}, '#bubling_element');
						selector = id;
						id = undefined;
					} else if(typeof id === 'string') {
						// $(document).on('event', listener(){}, undefined, {data: 'test'}, 'event-id');
						selector = id = undefined;
					}
				} else if(typeof data === 'string' && $(data).length > 0) {
					selector = data;
					if(typeof id === 'object') {
						// $(document).on('event', listener(){}, undefined, '#bubling_element', {data: 'test'});
						data = id;
						id = undefined;
					} else if(typeof id === 'string') {
						// $(document).on('event', listener(){}, undefined, '#bubling_element', 'event-id');
						data = undefined;
					} else {
						// $(document).on('event', listener(){}, undefined, '#bubling_element');
						data = id = undefined;
					}
				} else {
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', listener(){}, undefined, undefined, '#bubling_element');
						selector = id;
						data = id = undefined;
					} else if(typeof id === 'string') {
						// $(document).on('event', listener(){}, undefined, undefined, 'event-id');
						data = selector = undefined;
					} else if(typeof id === 'object') {
						// $(document).on('event', listener(){}, undefined, undefined, {data: 'test'});
						data = id;
						id = selector = undefined;
					} else {
						// $(document).on('event', listener(){});
						selector = data = id = undefined;
					}
				}

			} else {
				selector = undefined;
				if(typeof data === 'object') {
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', listener(){}, undefined, {data: 'test'}, '#bubling_element');
						selector = id;
						id = undefined;
					} else if(typeof id === 'string') {
						// $(document).on('event', listener(){}, undefined, {data: 'test'}, 'event-id');
						selector = id = undefined;
					}
				} else if(typeof data === 'string' && $(data).length > 0) {
					selector = data;
					if(typeof id === 'object') {
						// $(document).on('event', listener(){}, undefined, '#bubling_element', {data: 'test'});
						data = id;
						id = undefined;
					} else if(typeof id === 'string') {
						// $(document).on('event', listener(){}, undefined, '#bubling_element', 'event-id');
						data = undefined;
					} else {
						// $(document).on('event', listener(){}, undefined, '#bubling_element');
						data = id = undefined;
					}
				} else {
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', listener(){}, undefined, undefined, '#bubling_element');
						selector = id;
						data = id = undefined;
					} else if(typeof id === 'string') {
						// $(document).on('event', listener(){}, undefined, undefined, 'event-id');
						data = selector = undefined;
					} else if(typeof id === 'object') {
						// $(document).on('event', listener(){}, undefined, undefined, {data: 'test'});
						data = id;
						id = selector = undefined;
					} else {
						// $(document).on('event', listener(){});
						selector = data = id = undefined;
					}
				}
			}
		} else if(typeof listener === 'string' && $(listener).length > 0) {
			const tmp0 = listener;
			if(typeof selector === 'function') {
				listener = selector;
				if(typeof data === 'object') {
					if(typeof id === 'string') {
						// $(document).on('event', '#bubling_element', listener(){}, {data: 'test'}, 'event-id');
					} else if(typeof id === 'undefined') {
						// $(document).on('event', '#bubling_element', listener(){}, {data: 'test'});
					}
				} else if(typeof data === 'string') {
					if(typeof id === 'object') {
						// $(document).on('event', '#bubling_element', listener(){}, 'event-id', {data: 'test'});
						const tmp = id;
						id = data;
						data = tmp;
					}
				} else if(typeof data === 'undefined') {
					if(typeof id === 'object') {
						// $(document).on('event', '#bubling_element', listener(){}, undefined, {data: 'test'});
						data = id;
					}
				}
			} else if(typeof selector === 'object') {
				const tmp1 = selector;
				if(typeof data === 'function') {
					listener = data;
					if(typeof id !== 'string')
						id = undefined;
					// $(document).on('event', '#bubling_element', {data: 'test'}, listener(){}, 'event-id');
					// $(document).on('event', '#bubling_element', {data: 'test'}, listener(){});
				} else if(typeof data === 'string') {
					if(typeof id === 'function') {
						// $(document).on('event', '#bubling_element', {data: 'test'}, 'event-id', listener(){});
						listener = id;
					} else if(typeof id === 'undefined') {
						// $(document).on('event', '#bubling_element', {data: 'test'}, 'event-id');
						listener = undefined;
					}
					id = data;
				} else if(typeof data === 'undefined') {
					if(typeof id === 'function') {
						// $(document).on('event', '#bubling_element', {data: 'test'}, undefined, listener(){});
						listener = id;
					} else {
						// $(document).on('event', '#bubling_element', {data: 'test'}, undefined, 'event-id');
						// $(document).on('event', '#bubling_element', {data: 'test'});
						listener = undefined;
					}
				}
				data = tmp1;
			} else if(typeof selector === 'string') {
				const tmp1 = selector;
				if(typeof data === 'function') {
					listener = data;
					if(typeof id === 'object') {
						// $(document).on('event', '#bubling_element', 'event-id', listener(){}, {data: 'test'});
						data = id;
					} else {
						// $(document).on('event', '#bubling_element', 'event-id', listener(){});
						data = undefined;
					}
				} else if(typeof data === 'object') {
					if(typeof id === 'function') {
						// $(document).on('event', '#bubling_element','event-id', {data: 'test'}, listener(){});
						listener = id;
					} else if(typeof id === 'undefined') {
						// $(document).on('event', '#bubling_element', 'event-id', {data: 'test'});
						listener = undefined;
					}
				} else if(typeof data === 'undefined') {
					if(typeof id === 'function') {
						// $(document).on('event', '#bubling_element', 'event-id', undefined, listener(){});
						listener = id;
					} else {
						// $(document).on('event', '#bubling_element', 'event-id', undefined, 'event-id');
						// $(document).on('event', '#bubling_element', 'event-id');
						listener = undefined;
					}
				}
				id = tmp1;
			} else {
				if(typeof data === 'string') {
					if(typeof id === 'function') {
						// $(document).on('event', '#bubling_element', undefined, 'event-id', listener(){});
						listener = id;
					} else if(typeof id === 'undefined') {
						// $(document).on('event', '#bubling_element', undefined, 'event-id');
						listener = undefined;
					}
					id = data;
				} else if(typeof data === 'function') {
					listener = data;
					if(typeof id === 'object') {
						// $(document).on('event', '#bubling_element', undefined, listener(){}, {data: 'test'});
						data = id;
					} else {
						// $(document).on('event', '#bubling_element', undefined, listener(){});
						data = undefined;
					}
				} else if(typeof data === 'object') {
					if(typeof id === 'function') {
						// $(document).on('event', '#bubling_element', undefined, {data: 'test'}, listener(){});
						listener = id;
					} else if(typeof id === 'undefined') {
						// $(document).on('event', '#bubling_element', undefined, {data: 'test'});
						listener = undefined;
					}
				} else if(typeof data === 'undefined') {
					if(typeof id === 'function') {
						// $(document).on('event', '#bubling_element', undefined, undefined, listener(){});
						listener = id;
					} else {
						// $(document).on('event', '#bubling_element', undefined, undefined, 'event-id');
						// $(document).on('event', '#bubling_element');
						listener = undefined;
					}
				}
			}
			selector = tmp0;
		} else if(typeof listener === 'string' && $(listener).length <= 0) {
			const tmp0 = listener;
			if(typeof selector === 'function') {
				listener = selector;
				if(typeof data === 'object') {
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', 'event-id', listener(){}, {data: 'test'}, '#bubling_element');
						selector = id;
					} else {
						// $(document).on('event', 'event-id', listener(){}, {data: 'test'});
						selector = undefined;
					}
				} else if(typeof data === 'string' && $(data).length > 0) {
					selector = data;
					if(typeof id === 'object') {
						// $(document).on('event', 'event-id', listener(){}, '#bubling_element', {data: 'test'});
						data = id;
					} else {
						// $(document).on('event', 'event-id', listener(){}, '#bubling_element');
						data = undefined;
					}
				} else if(typeof data === 'undefined') {
					selector = undefined;
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', 'event-id', listener(){}, undefined, '#bubling_element');
						selector = id;
					} else if(typeof id === 'object') {
						// $(document).on('event', 'event-id', listener(){}, undefined, {data: 'test'});
						data = id;
					} else {
						// $(document).on('event', 'event-id', listener(){});
						selector = undefined;
					}
				}
			} else if(typeof selector === 'object') {
				const tmp1 = selector;
				if(typeof data === 'function') {
					listener = data;
					if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', 'event-id', {data: 'test'}, listener(){}, '#bubling_element');
						selector = id;
					} else {
						// $(document).on('event', 'event-id', {data: 'test'}, listener(){});
						selector = undefined;
					}
				} else if(typeof data === 'string' && $(data).length > 0) {
					selector = data;
					if(typeof id === 'function') {
						// $(document).on('event', 'event-id', {data: 'test'}, '#bubling_element', listener(){});
						listener = id;
					} else {
						// $(document).on('event', 'event-id', {data: 'test'}, '#bubling_element');
						listener = undefined;
					}
				} else if(typeof data === 'undefined') {
					if(typeof id === 'function') {
						// $(document).on('event', 'event-id', {data: 'test'}, undefined, listener(){});
						listener = id;
					} else if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', 'event-id', {data: 'test'}, undefined, '#bubling_element');
						selector = id;
						listener = undefined;
					} else {
						// $(document).on('event', 'event-id', {data: 'test'});
						listener = selector = undefined;
					}
				}
				data = tmp1;
			} else if(typeof selector === 'string' && $(selector).length > 0) {
				if(typeof data === 'function') {
					listener = data;
					if(typeof id === 'object') {
						// $(document).on('event', 'event-id', '#bubling_element', listener(){}, {data: 'test'});
						data = id;
					} else {
						// $(document).on('event', 'event-id', '#bubling_element', listener(){});
						data = undefined;
					}
				} else if(typeof data === 'object') {
					if(typeof id === 'function') {
						// $(document).on('event', 'event-id', '#bubling_element', {data: 'test'}, listener(){});
						listener = id;
					} else if(typeof id === 'undefined') {
						// $(document).on('event', 'event-id', '#bubling_element', {data: 'test'});
						listener = undefined;
					}
				} else if(typeof data === 'undefined') {
					if(typeof id === 'function') {
						// $(document).on('event', 'event-id', '#bubling_element', undefined, listener(){});
						listener = id;
					} else {
						// $(document).on('event', 'event-id', '#bubling_element', undefined, 'event-id');
						// $(document).on('event', 'event-id', '#bubling_element');
						listener = undefined;
					}
				}
			} else {
				if(typeof data === 'string' && $(data).length > 0) {
					if(typeof id === 'function') {
						// $(document).on('event', 'event-id', undefined, '#bubbling_element', listener(){});
						listener = id;
					} else if(typeof id === 'object') {
						// $(document).on('event', 'event-id', undefined, '#bubbling_element', listener(){}, {data: 'test'});
						data = id;
					} else {
						// $(document).on('event', 'event-id', undefined, '#bubbling_element');
						listener = data = undefined;
					}
					selector = data;
				} else if(typeof data === 'function') {
					listener = data;
					if(typeof id === 'object') {
						// $(document).on('event', 'event-id', undefined, listener(){}, {data: 'test'});
						data = id;
					} else if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', 'event-id', undefined, listener(){}, '#bubbling_element');
						selector = id;
					} else {
						// $(document).on('event', 'event-id', undefined, listener(){});
						data = selector = undefined;
					}
				} else if(typeof data === 'object') {
					if(typeof id === 'function') {
						// $(document).on('event', 'event-id', undefined, {data: 'test'}, listener(){});
						listener = id;
					} else if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', 'event-id', undefined, {data: 'test'}, '#bubbling_element');
						selector = id;
					} else if(typeof id === 'undefined') {
						// $(document).on('event', 'event-id', undefined, {data: 'test'});
						listener = selector = undefined;
					}
				} else if(typeof data === 'undefined') {
					if(typeof id === 'function') {
						// $(document).on('event', 'event-id', undefined, undefined, listener(){});
						listener = id;
					} else if(typeof id === 'object') {
						// $(document).on('event', 'event-id', undefined, undefined, {data: 'test'});
						data = id;
					} else if(typeof id === 'string' && $(id).length > 0) {
						// $(document).on('event', 'event-id', undefined, undefined, '#bubbling_element');
						selector = id;
					} else {
						// $(document).on('event', 'event-id', undefined, undefined, 'event-id');
						// $(document).on('event', 'event-id');
						listener = selector = data = undefined;
					}
				}
			}

			id = tmp0;
		}

		useCapture = (typeof selector === 'string' && $(selector).length > 0) ? true : useCapture;

		const turnOnSingleEvent = ($element, eventData, eventName, listener, outListener) => {
			const element = $element[0];
			if(typeof listener === 'function') {
				const guid = (id === undefined || id === '') ? GUID() : id;

				const eventData = {
					'element': $element,
					'event': eventName,
					'handler': listener,
					'outHandler': outHandler,
					'data': data,
					'guid': guid,
					'status': 'on'
				};

				delegate(element, eventName, selector, listener, useCapture, outHandler);
				if(typeof data === 'object') {
					$.extend(element, data);
				}

				if(element.events === undefined)
					element.events = {};

				if(!element.events.hasOwnProperty(eventName))
					element.events[eventName] = {};

				element.events[eventName][guid] = eventData;
			} else {
				if(eventData !== undefined) {
					if(eventData.hasOwnProperty('guid')) {
						const handler    = eventData.handler,
						      outHandler = eventData.outHandler,
						      data       = eventData.data;

						delegate(element, eventName, selector, handler, useCapture, outHandler);
						if(typeof data === 'object') {
							$.extend(element, data);
						}
						eventData.status = 'on';
					} else {
						$.each(eventData, (i, c) => {
							const handler    = c.handler,
							      outHandler = c.outHandler,
							      data       = c.data;

							delegate(element, eventName, selector, handler, useCapture, outHandler);
							if(typeof data === 'object') {
								$.extend(element, data);
							}
							c.status = 'on';
						});
					}
				}
			}
		}
		const turnOnEvent = ($element, eventName, handler, outHandler) => {
			if(eventName !== undefined && eventName !== null && eventName !== '') {
				eventName = (eventName === 'hover') ? 'mouseenter' : eventName;
				const eventData = $element.getEventData(eventName, id);
				turnOnSingleEvent($element, eventData, eventName, handler, outHandler);
			} else {
				const eventData = $element.getEventData();

				if(eventData !== undefined && eventData.length > 0) {
					$.each(eventData, (event, eventDatum) => turnOnSingleEvent($element, eventDatum, handler, outHandler));
				}
			}
		}

		return this.each(function() {
			const $this = $(this);
			const eventNames = (eventName !== undefined && eventName !== null && eventName !== '' && eventName.indexOf(' ') > -1) ? eventName.split(' ') : [];

			if(eventNames.length > 0) {
				if(useMouseOver) {
					if(str_contains(eventName, ['hover', 'mouseover', 'mousemove'])) {
						eventName = eventName.replace(/\s*hover/ig, ' mouseover').replace(/hover\s*/ig, 'mouseover ');
						eventNames.forEach(eventName => turnOnEvent($this, eventName, listener));
						turnOnEvent($this, 'mouseout', outHandler);
					} else if(str_contains(eventName, ['click'])) {
						eventNames.forEach(eventName => turnOnEvent($this, eventName, listener, outHandler));
					}
				} else {
					eventNames.forEach(eventName => turnOnEvent($this, eventName, listener));
				}
			} else {
				if(useMouseOver) {
					if(str_contains(eventName, ['hover', 'mouseover', 'mousemove'])) {
						turnOnEvent($this, 'mouseover', listener);
						turnOnEvent($this, 'mouseout', outHandler);
					} else if(str_contains(eventName, ['click'])) {
						turnOnEvent($this, eventName, listener, outHandler);
					}
				} else {
					turnOnEvent($this, eventName, listener);
				}
				;
			}
		});
	};

	/**
	 * Turns off an event identified by <b>event name</b> and <b>id</b>.<br>If <b>eventName</b> is not specified, every bind events will be turned off.
	 *
	 * @param {string}[eventName=null] The name or space-separated name of events to bind to the context or DOM element.<p>If not specified, every bind events will be turned off.</p>
	 * @param {string}[id=null] An unique event identifier to distinguish the event from other listeners of same types.<p>If not specified, only the events of the same type identified by <b>eventName</b> will be turned off.</p>
	 *
	 * @return {jQuery} The DOM element
	 */
	$.fn.off = function(eventName, id) {
		const turnOffSingleEvent = ($element, eventData) => {
			if(eventData !== undefined) {
				if(eventData.hasOwnProperty('guid')) {
					const name    = eventData.event,
					      handler = eventData.handler;

					$element[0].removeEventListener(name, handler);
					eventData.status = 'off';
				} else {
					$.each(eventData, (i, c) => {
						const name    = c.event,
						      handler = c.handler;

						$element[0].removeEventListener(name, handler);
						c.status = 'off';
					});
				}
			}
		}
		const turnOffEvent = ($element, eventName, id) => {
			if(eventName !== undefined && eventName !== null && eventName !== '') {
				const eventData = $element.getEventData(eventName, id);
				turnOffSingleEvent($element, eventData);
			} else {
				const eventData = $element.getEventData();

				if(eventData !== undefined && eventData.length > 0) {
					$.each(eventData, function(event, eventDatum) {
						turnOffSingleEvent($element, eventDatum);
					});
				}
			}
		}

		return this.each(function() {
			const $this = $(this);
			const eventNames = (eventName !== undefined && eventName !== null && eventName !== '' && eventName.indexOf(' ') !== -1) ? eventName.split(' ') : [];
			if(eventNames.length > 0) {
				eventNames.forEach(eventName => turnOffEvent($this, eventName, id));
			} else {
				turnOffEvent($this, eventName, id);
			}
		});
	};

	/**
	 * Turns off an event identified by <b>event name</b> and <b>id</b>.<br>If <b>eventName</b> is not specified, every bind events will be turned off.
	 *
	 * @param {string}[eventName=null] The name or space-separated name of events to bind to the context or DOM element.<p>If not specified, every bind events will be turned off.</p>
	 * @param {string}[id=null] An unique event identifier to distinguish the event from other listeners of same types.<p>If not specified, only the events of the same type identified by <b>eventName</b> will be turned off.</p>
	 *
	 * @return {jQuery} The DOM element
	 */
	$.fn.terminate = function(eventName, id) {
		const terminateSingleEvent = ($element, eventData) => {
			const element = $element[0];

			if(eventData !== undefined) {
				$.each(eventData, function(i, c) {
					const name    = c.event,
						  handler = c.handler;

					element.removeEventListener(name, handler, true);
					c.status = 'off';
					delete element.events[eventName][id];
				});
			}
		}
		const terminateEvent = ($element, eventName) => {
			if(eventName !== undefined && eventName !== null && eventName !== '') {
				const eventData = $element.getEventData(eventName, id);
				terminateSingleEvent($element, eventData);
			} else {
				const eventData = $element.getEventData();

				if(eventData !== undefined && eventData.length > 0) {
					$.each(eventData, (event, eventDatum) => terminateSingleEvent($element, eventDatum));
				}
			}
		}

		return this.each(function() {
			const $this = $(this);
			const eventNames = (eventName !== undefined && eventName !== null && eventName !== '' && eventName.indexOf(' ') !== -1) ? eventName.split(' ') : [];
			if(eventNames.length > 0) {
				eventNames.forEach(eventName => terminateEvent($this, eventName));
			} else {
				terminateEvent($this, eventName);
			}
		});
	};

	/**
	 * Triggers an already bound event identified by <b>event name</b> and <b>id</b>.<br>If <b>eventName</b> is not specified, every bind events will be triggered.
	 *
	 * @param {string}[eventName=null] The name or space-separated name of events to bind to the context or DOM element.<p>If not specified, every bind events will be turned off.</p>
	 * @param {{}}[data=null] A JSON object containing additional information needed to pass to the event.
	 * @param {string}[id=null] An unique event identifier to distinguish the event from other listeners of same types.<p>If not specified, all the events of the same type identified by <b>eventName</b> will be turned off.</p>
	 *
	 * @return {jQuery} The DOM element
	 */
	$.fn.trigger = function(eventName, data, id) {
		let useCapture = false;

		const triggerSingleEvent = ($element, eventData) => {
			const element = $element[0];
			if(eventData !== undefined) {
				$.each(eventData, function(i, c) {
					const name = c.event;

					let event;
					const evtData = $.extend({'detail': data}, data);
					if(window.CustomEvent) {
						event = new CustomEvent(name, evtData);

						//console.default.log($(this),eventName, data, id, event);
					} else {
						event = document.createEvent('CustomEvent');
						// noinspection JSDeprecatedSymbols
						event.initCustomEvent(name, (!useCapture), true, evtData);
					}

					element.dispatchEvent(event);
				});
			}
		}
		const triggerEvent = ($element, eventName) => {
			if(eventName !== undefined && eventName !== null && eventName !== '') {
				const eventData = $element.getEventData(eventName, id);
				triggerSingleEvent($element, eventData);
			} else {
				const eventData = $element.getEventData();

				if(eventData !== undefined && eventData.length > 0) {
					$.each(eventData, (event, eventDatum) => triggerSingleEvent($element, eventDatum));
				}
			}
		}

		return this.each(function() {
			const $this = $(this);
			// noinspection JSUnresolvedVariable
			eventName = (eventName !== undefined && eventName !== null && eventName !== '' && typeof eventName === 'object') ? eventName.type : eventName;

			const eventNames = (eventName !== undefined && eventName !== null && eventName !== '' && eventName.indexOf(' ') !== -1) ? eventName.split(' ') : [];
			if(eventNames.length > 0) {
				eventNames.forEach(eventName => triggerEvent($this, eventName));
			} else {
				triggerEvent($this, eventName);
			}
		});
	};

	/**
	 * Retrieve information about all or specific event or id
	 *
	 * @param {string}[eventName=null] The name or space-separated name of events to bind to the context or DOM element.
	 * @param {string} [id=null] An unique event identifier to distinguish the event from other listeners of same types.
	 *
	 * @return {{element: Element, event: string, handler: function, guid: string, status: 'on'|'off'}|[]}
	 */
	$.fn.getEventData = function(eventName, id) {
		let _this = undefined;
		this.each(function() {
			const $_this = $(this);
			const $this = $_this[0];

			eventName = (eventName !== undefined && eventName !== null && eventName !== '') ? eventName : undefined;
			id = (id !== undefined) ? id : undefined;

			if($this.events !== undefined) {
				const eventInfo = $this.events;

				if(eventName !== undefined && eventInfo[eventName] !== undefined) {
					const eventData = eventInfo[eventName];

					if(id !== undefined && eventData[id] !== undefined) {
						_this = eventData[id];
					} else {
						_this = eventData;
					}
				} else {
					_this = eventInfo;
				}
			}
		});

		return _this;
	};
})(window, document, jQuery);
