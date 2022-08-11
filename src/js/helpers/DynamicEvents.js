/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
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
	/*const oldAddEventListener = HTMLElement.prototype.addEventListener;
	HTMLElement.prototype.addEventListener = function(event, handler, bubbling, data) {
		//console.log(this,event);
		//event.data = data;

		oldAddEventListener.call(event, handler, bubbling);
	}*/

	if(!Element.prototype.matches) {
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

	const delegate = (element, event, selector, handler, useCapture) => {
		if(selector === undefined || selector === null) {
			element.addEventListener(event, handler, useCapture);
		} else {
			element.addEventListener(event, function(event) {
				let t = event.target;
				while(t && t !== this) {
					if(t.matches(selector)) {
						handler.call(t, event);
					}
					t = t.parentNode;
				}
			}, useCapture);
		}
	};

	/**
	 * Binds an event dynamically for the DOM element or turns onan event identified by <b>event name</b> and <b>id</b>.<br>If <b>eventName</b> is not specified, every bind events will be turned on.
	 *
	 * @param {string}[eventName=null] The name or space-separated name of events to bind to the context or DOM element.<p>If not specified, every turned-off events will be turned on.</p>
	 * @param {string}[listener=null] The name of the function or an asynchronous function callback to handle the event(s). (not required if <b>eventName</b> is not specified).
	 * @param {string}[id=null] An unique event identifier to distinguish the event from other listeners of same types.<p>If not specified, only the events of the same type identified by <b>eventName</b> will be turned on.</p>
	 *
	 * @return {jQuery} The DOM element
	 */
	$.fn.on = function(eventName, listener, selector, data, id) {
		/*function GUID() {
			let result, i, j;
			result = '';
			for(j=0; j<32; j++) {
				if(j === 8 || j === 12 || j === 16 || j === 20)
					result = result + '-';
				i = Math.floor(Math.random()*16).toString(16).toUpperCase();
				result = result + i;
			}
			return result;
		}*/
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

		let useCapture = false;

		let tmp = undefined;
		if(typeof listener === 'function' && typeof selector === 'string' && typeof data === 'object' && typeof id === 'string') {

		} else if(typeof listener === 'string' && typeof selector === 'function' && typeof data === 'object' && typeof id === 'string') {
			tmp = listener;
			listener = selector;
			selector = tmp;
		} else if(typeof listener === 'string' && typeof selector === 'object' && typeof data === 'function' && typeof id === 'string') {
			tmp = data;
			data = selector;
			selector = listener;
			listener = tmp;
		} else if(typeof listener === 'string' && typeof selector === 'function' && typeof data === 'string' && typeof id === 'object') {
			tmp = listener;
			listener = selector;
			selector = tmp;
			tmp = data;
			data = id;
			id = tmp;
		}

		const turnOnSingleEvent = ($element, eventData, eventName, create = false) => {
			const element = $element[0];
			if(create) {
				const guid = (id === undefined || id === '') ? GUID() : id;

				const eventData = {
					'element': $element,
					'event': eventName,
					'handler': listener,
					'data': data,
					'guid': guid,
					'status': 'on'
				};

				delegate(element, eventName, selector, listener, useCapture);
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
					$.each(eventData, function(i, c) {
						const name    = c.event,
							  handler = c.handler,
							  data    = c.data;

						delegate(element, eventName, selector, handler, useCapture);
						if(typeof data === 'object') {
							$.extend(element, data);
						}
						c.status = 'on';
					});
				}
			}
		}
		const turnOnEvent = ($element, eventName, create = false) => {
			if(eventName !== undefined && eventName !== null && eventName !== '') {
				const eventData = $element.getEventData(eventName, id);
				turnOnSingleEvent($element, eventData, eventName, create);
			} else {
				const eventDatas = $element.getEventData();

				if(eventDatas !== undefined && eventDatas.length > 0) {
					$.each(eventDatas, function(event, eventData) {
						turnOnSingleEvent($element, eventData, create);
					});
				}
			}
		}

		return this.each(function() {
			const $this = $(this);
			const eventNames = (eventName !== undefined && eventName !== null && eventName !== '') ? eventName.split(' ') : [];

			if(eventNames.length > 0) {
				eventNames.forEach(eventName => turnOnEvent($this, eventName, (typeof listener === 'function')));
			} else {
				turnOnEvent($this, eventName, false);
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
				$.each(eventData, function(i, c) {
					const name    = c.event,
						  handler = c.handler;

					$element[0].removeEventListener(name, handler);
					c.status = 'off';
				});
			}
		}
		const turnOffEvent = ($element, eventName, id) => {
			if(eventName !== undefined && eventName !== null && eventName !== '') {
				const eventData = $element.getEventData(eventName, id);
				turnOffSingleEvent($element, eventData);
			} else {
				const eventDatas = $element.getEventData();

				if(eventDatas !== undefined && eventDatas.length > 0) {
					$.each(eventDatas, function(event, eventData) {
						turnOffSingleEvent($element, eventData);
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
			const element = $element[0];

			if(eventName !== undefined && eventName !== null && eventName !== '') {
				const eventData = $element.getEventData(eventName, id);
				terminateSingleEvent($element, eventData);
			} else {
				const eventDatas = $element.getEventData();

				if(eventDatas !== undefined && eventDatas.length > 0) {
					$.each(eventDatas, function(event, eventData) {
						terminateSingleEvent($element, eventData);
					});
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
	 * Triggers an already bind event identified by <b>event name</b> and <b>id</b>.<br>If <b>eventName</b> is not specified, every bind events will be triggered.
	 *
	 * @param {string}[eventName=null] The name or space-separated name of events to bind to the context or DOM element.<p>If not specified, every bind events will be turned off.</p>
	 * @param {JSON}[data=null] A JSON object containing additional information needed to pass to the event.
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
					const name    = c.event,
						  handler = c.handler;

					let event;
					if(window.CustomEvent) {
						event = new CustomEvent(name, data);
					} else {
						event = document.createEvent('CustomEvent');
						event.initCustomEvent(name, (!useCapture), true, data);
					}

					element.dispatchEvent(event);
				});
			}
		}
		const triggerEvent = ($element, eventName) => {
			const element = $element[0];

			if(eventName !== undefined && eventName !== null && eventName !== '') {
				const eventData = $element.getEventData(eventName, id);
				triggerSingleEvent($element, eventData);
			} else {
				const eventDatas = $element.getEventData();

				if(eventDatas !== undefined && eventDatas.length > 0) {
					$.each(eventDatas, function(event, eventData) {
						triggerSingleEvent($element, eventData);
					});
				}
			}
		}

		return this.each(function() {
			const $this = $(this);
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