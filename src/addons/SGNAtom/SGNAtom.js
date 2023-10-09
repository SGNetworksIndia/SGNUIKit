/*
 * Copyright (c) 2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

;(function(window, noGlobal) {
	"use strict";
	let empty      = window.empty,
	    is_numeric = window.is_numeric;
	if(typeof empty === "undefined") {
		/**
		 * @param v The value to check
		 * @return {boolean}
		 */
		empty = (v) => {
			if(typeof v === "object") {
				return (v.length <= 0);
			} else {
				return (v === undefined || v === null || v === "");
			}
		};
	}
	if(typeof is_numeric === "undefined") {
		/**
		 * Finds whether a variable is a number or a numeric string.
		 *
		 * @param value The variable being evaluated.
		 *
		 * @return {boolean} Returns <b>TRUE</b> if value is a number or a numeric string, <b>FALSE</b> otherwise.
		 *
		 * @since 1.2.2
		 * @version 1.0.1
		 * @author Kevin van Zonneveld ({@link https://kvz.io})
		 * {@link https://locutus.io/php/var/is_numeric}
		 * @example
		 * Example 1: is_numeric(186.31) : true
		 * Example 2: is_numeric('Kevin van Zonneveld') : false
		 * Example 3: is_numeric(' +186.31e2') : true
		 * Example 4: is_numeric("") : false
		 * Example 5: is_numeric([]) : false
		 * Example 6: is_numeric("1 ") : false
		 */
		is_numeric = (value) => {
			const whitespace = [
				" ",
				"\n",
				"\r",
				"\t",
				"\f",
				"\x0b",
				"\xa0",
				"\u2000",
				"\u2001",
				"\u2002",
				"\u2003",
				"\u2004",
				"\u2005",
				"\u2006",
				"\u2007",
				"\u2008",
				"\u2009",
				"\u200a",
				"\u200b",
				"\u2028",
				"\u2029",
				"\u3000"
			].join("");
			return (typeof value === "number" || (typeof value === "string" && whitespace.indexOf(value.slice(-1)) === -1)) && value !== "" && !isNaN(value);
		};
	}

	if(typeof HTMLElement.prototype.attr !== "function") {
		HTMLElement.prototype.attr = function(name, value) {
			if(value === undefined) {
				return this.getAttribute(name);
			} else {
				this.setAttribute(name, value);
			}
		};
	}

	if(typeof HTMLElement.prototype.fadeIn !== "function") {
		HTMLElement.prototype.fadeIn = function(speed, callback) {
			let _this = this;
			speed = (typeof speed !== "number") ? 2000 : speed;

			if(!_this.style.opacity) {
				_this.style.opacity = ((speed > 0) ? 0 : 1).toString();
			}

			if(speed > 0) {
				const inInterval = setInterval(function() {
					_this.style.opacity = (Number(_this.style.opacity) + 0.02).toString();
					if(_this.style.opacity >= 1) {
						clearInterval(inInterval);

						if(typeof callback === "function") {
							callback(_this);
						}
					}
				}, speed / 50);
			} else {
				if(typeof callback === "function") {
					callback(_this);
				}
			}
		};
	}

	if(typeof HTMLElement.prototype.fadeOut !== "function") {
		HTMLElement.prototype.fadeOut = function(speed, callback) {
			let _this = this;
			speed = (typeof speed !== "number") ? 2000 : speed;

			if(!_this.style.opacity) {
				_this.style.opacity = ((speed > 0) ? 1 : 0).toString();
			}

			if(speed > 0) {
				const outInterval = setInterval(function() {
					_this.style.opacity -= 0.02.toString();
					if(_this.style.opacity <= 0) {
						clearInterval(outInterval);

						if(typeof callback === "function") {
							callback(_this);
						}
					}
				}, speed / 50);
			} else {
				if(typeof callback === "function") {
					callback(_this);
				}
			}
		};
	}

	class SGNAtomParameterError extends Error {
		constructor(message) {
			super(message);
			this.name = "SGNAtomParameterError";
		}
	}

	class SGNAtomDOMError extends Error {
		constructor(message) {
			super(message);
			this.name = "SGNAtomDOMError";
		}
	}

	class HistoryNodeObject {
		/**
		 *
		 * @param {NodeList|HTMLDocument|HTMLCollection|HTMLHtmlElement[0]|HTMLBodyElement[]}nodes
		 * @param {string}[html]
		 */
		constructor(nodes, html) {
			this.nodes = nodes;
			let newHTML = "";
			nodes.forEach((c) => newHTML += `${c.outerHTML}\n`);

			this.html = (!empty(newHTML)) ? newHTML : newHTML;
		}

		// noinspection JSUnusedGlobalSymbols
		/**
		 *
		 * @return {HistoryObject} The deserialized <b>HistoryObject</b> instance.
		 */
		static deserialize(object) {
			const o = JSON.parse(object);

			return Object.setPrototypeOf(o, HistoryNodeObject.prototype);
		}

		/**
		 *
		 * @return {string} The serialized <b>HistoryObject</b> instance.
		 */
		serialize() {
			const sn = [];
			this.nodes.forEach((node) => {
				const s = JSON.stringify(this.stringify(node), null, " ");
				sn.push(s);
			});
			const r = {
				"nodes": sn,
				"html": this.html,
			};
			return JSON.stringify(r);
		}

		stringify(element) {
			let obj = {};
			obj.name = element.localName;
			obj.attributes = [];
			obj.children = [];
			element = (element.nodeName === "#document") ? element.documentElement : element;
			if(element instanceof HTMLElement && element.hasOwnProperty("nodeName")) {
				Array.from(element.attributes).forEach(a => {
					obj.attributes.push({name: a.name, value: a.value});
				});
				Array.from(element.children).forEach(c => {
					obj.children.push(this.stringify(c));
				});
			}

			return obj;
		}
	}

	/**
	 * @class HistoryObject
	 */
	class HistoryObject {
		/**
		 *
		 * @param {string}guid
		 * @param {string}url
		 * @param {string}title
		 * @param {HistoryNodeObject}html
		 * @param {HistoryNodeObject}head
		 * @param {HistoryNodeObject}body
		 */
		constructor(guid, url, title, html, head, body) {
			this.guid = guid;
			this.url = url;
			this.title = title;
			this.html = html;
			this.head = head;
			this.body = body;
			this.state = {
				"guid": guid,
				"url": url,
				"title": title
			};
		}

		// noinspection JSUnusedGlobalSymbols
		/**
		 *
		 * @return {HistoryObject} The deserialized <b>HistoryObject</b> instance.
		 */
		static deserialize(object) {
			const o = JSON.parse(object);

			return Object.setPrototypeOf(o, HistoryObject.prototype);
		}

		/**
		 *
		 * @return {string} The serialized <b>HistoryObject</b> instance.
		 */
		serialize() {
			return JSON.stringify(this);
		}
	}

	/**
	 * @return HistoryStack<string, Array<HistoryObject>>
	 */
	class HistoryStack {
		length = 0;

		/**
		 *
		 * @param {HistoryObject}historyObject
		 */
		constructor(historyObject) {
			if(!historyObject instanceof HistoryObject) {
				throw new SGNAtomParameterError("The parameter 'historyObject' must be an instance of 'HistoryObject'");
			}

			const historyString = window.sessionStorage.getItem("HISTORY_STACK") || this.serialize();
			const stack = historyString ? HistoryStack.deserialize(historyString) : this;
			stack.length = this.getLength(stack);
			this.setObject(stack, historyObject);
			window.sessionStorage.setItem("HISTORY_STACK", this.serialize());

			return this;
		}

		/**
		 *
		 * @return {HistoryStack[string<HistoryObject>]} The deserialized <b>HistoryObject</b> instance.
		 */
		static deserialize(object) {
			const o = JSON.parse(object);
			let r = {},
			    l = 0;
			for(const k in o) {
				if(k !== "length") {
					const c = o[k];
					const guid = c.guid;
					let head = JSON.parse(c.head),
					    body = JSON.parse(c.body),
					    html = JSON.parse(c.html);

					head = Object.setPrototypeOf(head, HistoryNodeObject.prototype);
					body = Object.setPrototypeOf(body, HistoryNodeObject.prototype);
					html = Object.setPrototypeOf(html, HistoryNodeObject.prototype);

					const no = {
						"url": c.url,
						"title": c.title,
						"guid": c.guid,
						"state": c.state,
						"head": head,
						"body": body,
						"html": html,
					};
					r[guid] = Object.setPrototypeOf(no, HistoryNodeObject.prototype);
					l++;
				}
			}
			r["length"] = l;
			return Object.setPrototypeOf(r, HistoryStack.prototype);
		}

		/**
		 * @callback forEachCallback
		 * @param {HistoryObject}value
		 * @param {string}index
		 */

		/**
		 *
		 * @param {HistoryStack}historyStack
		 * @param {HistoryObject}historyObject
		 */
		setObject(historyStack, historyObject) {
			const url = historyObject.url;
			let guid = historyObject.guid;

			if(historyStack.length > 0) {
				historyStack = this.mergeDuplicates(historyStack, url, guid);
				const oldHistoryObject = this.searchByURL(historyStack, url);
				if(oldHistoryObject !== undefined) {
					guid = oldHistoryObject.guid;
					historyObject = oldHistoryObject;
				}
			}
			historyStack[guid] = historyObject;

			delete historyStack.length;
			for(let k in historyStack) {
				/**
				 * @var {HistoryObject}element
				 */
				const element = historyStack[k];
				this[element.guid] = element;
				this.length++;
			}
		}

		/**
		 * @param {(historyObject: HistoryObject, guid: string)=>void}[callback] A function that forEach calls once for each element in the array.
		 */
		forEach(callback) {
			const stack = this,
			      l     = this.getLength();
			if(stack.hasOwnProperty("length")) {
				delete stack.length;
			}
			if(l > 0) {
				for(let key in stack) {
					const element = stack[key];
					callback(element, key);
				}
			}
		}

		reverse() {
			const stack = this;
			let json = stack.serialize();
			json = JSON.parse(json);
			let r = {};

			let jsonArr = Object.keys(json).map(function(key) {
				return [key, json[key]];
			});
			jsonArr = jsonArr.reverse();
			jsonArr.forEach(value => {
				const element = value[1];
				r[element.guid] = element;
			});

			r = JSON.stringify(r);
			r = HistoryStack.deserialize(r);

			return r;
		}

		/**
		 *
		 * @param {HistoryStack}[stack]
		 * @return {number}
		 */
		getLength(stack) {
			stack = (stack instanceof HistoryStack) ? stack : this;
			delete stack.length;
			let size = 0,
			    key;
			for(key in stack) {
				if(stack.hasOwnProperty(key)) size++;
			}
			return size;
		}

		/**
		 *
		 * @return {*[]|undefined}
		 */
		shift() {
			const obj = this;
			if(!obj || obj.length === 0) return undefined;
			return obj.splice(0, 1);
		}

		/**
		 *
		 * @param {number}start
		 * @param {number}end
		 * @return {*[]|undefined}
		 */
		splice(start, end) {
			const obj = this;
			if(!obj || obj.length === 0) return undefined;
			return obj.slice(start, end);
		}

		/**
		 *
		 * @param {number}[start]
		 * @param {number}[end]
		 * @return {*[]|undefined}
		 */
		slice(start, end) {
			const obj = this;
			if(!obj || obj.length <= 0) return undefined;
			let tempArray = [];

			if(end === undefined || end > obj.length) {
				end = obj.length;
			}

			for(let i = start; i < end; i++) {
				tempArray.push(obj[i]);
			}
			return tempArray;
		}

		/**
		 *
		 * @param {HistoryStack<string, Array<HistoryObject>>}historyStack
		 * @param {string}url
		 * @param {('url'|'state'|'title'|'html'|'head'|'body'|'guid')|null}[get]
		 * @return {HistoryObject|undefined}
		 */
		searchByURL(historyStack, url, get = null) {
			let obj = undefined;
			historyStack.forEach((c) => {
				if(c.url === url) {
					return c;
				}
			});

			return obj;
		}

		/**
		 *
		 * @param {HistoryStack<string, Array<HistoryObject>>}historyStack
		 * @param {string}url
		 * @param {string}[guid]
		 * @return {HistoryStack<string, Array<HistoryObject>>}
		 */
		mergeDuplicates(historyStack, url, guid) {
			const found  = {},
			      result = {};
			historyStack.forEach((c, k) => {
				if(c.url === url) {
					if(!found.hasOwnProperty(c.url)) {
						if(!empty(guid)) {
							c.guid = guid;
						}
						found[c.url] = c;
					} else {
						delete historyStack[k];
					}
				} else {
					found[c.url] = c;
				}
			});
			for(let k in found) {
				/**
				 * @var {HistoryObject}element
				 */
				const element = found[k];
				const guid = element.guid;
				result[guid] = element;
			}
			Object.setPrototypeOf(result, HistoryStack.prototype);

			return result;
		}

		/**
		 *
		 * @return {string} The serialized <b>HistoryObject</b> instance.
		 */
		serialize() {
			let r = {};
			this.forEach((c) => {
				const guid = c.guid;
				r[guid] = {
					"url": c.url,
					"title": c.title,
					"guid": c.guid,
					"state": c.state,
					"head": c.head.serialize(),
					"body": c.body.serialize(),
					"html": c.html.serialize(),
				};
			});
			return JSON.stringify(r);
		}
	}

	/**
	 *
	 * @type {SGNAtom}
	 * @type {SGNAtom.SGNAtomCore}
	 * @type {SGNAtom.SGNAtomNavigator}
	 */

	/**
	 * @typedef {Object} SGNAtomOptions The options for <b>SGNAtom</b>
	 *
	 * @property {boolean} [debugMode=false] State whether to turn on debug mode. If set to <b>TRUE</b>, any type of warnings/errors will be printed to the browser console or stdout (Standard Output).
	 * @property {SGNAtomCoreOptions} core The options for <b>SGNAtomCore</b> to override the default settings.
	 * @property {SGNAtomNavigatorOptions} navigator The options for <b>SGNAtomNavigator</b> to override the default settings.
	 */
	/**
	 * @typedef {Object} SGNAtomCoreOptions The options for <b>SGNAtomCore</b>
	 *
	 * @property {string} [defaultPage] Specify the page to load by default when the DOM is ready and <b>SGNAtomCore</b> is loaded. The Default page can also be set by setting `sgnatom-home` attribute on the <b>SGNAtom</b> container element and giving it the link or relative page name of the
	 * page to load.
	 */
	/**
	 * @typedef {Object} SGNAtomNavigatorOptions The options for <b>SGNAtomNavigator</b>
	 *
	 * @property {string} [elements="a, button, .clickable"] A comma-separated(,) list of clickable DOM elements. A non-clickable element can also be made clickable by adding the CSS class "clickable" to it (i.e. a `<div class="clickable"/>`). [Default: <b>a, button</b>]
	 * @property {boolean} [resetHead=true] Specifies whether to reset the HTML `<head/>` whenever a page is loaded or not.
	 * @property {boolean} [interceptErrors=true] Specifies whether to intercept HTTP errors or not.
	 * @property {boolean} [showErrors=true] Specifies whether to show HTTP errors or not.
	 * @property {boolean} [resumePreviousSession=true] Specifies whether to resume the previously active session or not. If set to <b>TRUE</b>, <b>SGNAtomNavigator</b> will load the previous page when the <b>SGNATomNavigator</b> is ready.
	 */

	/**
	 * Creates new instance of <b><i>SGNAtom</i></b> identified by element
	 *
	 * @param {HTMLElement|NodeList} elements The element to use as <b><i>SGNAtom</i></b> container.
	 * @param {SGNAtomOptions}[options={}] A <b><i>JSON</i></b> object of supported options to override default functionalities.
	 *
	 * @return {SGNAtom} An instance of <b><i>SGNAtom</i></b>.
	 *
	 * @constructor
	 */
	let SGNAtom = function(elements, options) {
		const plugin = this;
		/**
		 * This callback is called when a state is changed.
		 *
		 * @callback SGNAtomStatesChangeCallback
		 * @param {string} state
		 * @param {boolean|JSON} value
		 */
		/**
		 * This callback is called when an instance(s) is changed.
		 *
		 * @callback SGNAtomStatesInstanceChangeCallback
		 * @param {SGNAtom[]} value
		 */
		/**
		 * This callback is called when a state is ready.
		 *
		 * @callback SGNAtomStatesReadyCallback
		 * @param {boolean} isReady
		 */
		const SGNAtomStates = {
			isReady: false,
			isCoreReady: false,
			isNavigatorReady: false,
			instances: {},
			onChangeListener: [],
			onReadyListener: [],
			onCoreReadyListener: [],
			onNavigatorReadyListener: [],
			onInstanceChangeListener: [],

			/**
			 * @param {boolean}isReady
			 */
			set ready(isReady) {
				this.isReady = isReady;
				this.onChangeListener.forEach((listener) => listener("main", isReady));

				if(isReady || (this.coreReady && this.navigatorReady)) {
					this.onReadyListener.forEach((listener) => listener(isReady));
				}
			},

			/**
			 * @return {boolean}
			 */
			get ready() {
				return this.isReady;
			},

			/**
			 * @param {boolean}isReady
			 */
			set coreReady(isReady) {
				this.isCoreReady = isReady;
				this.ready = (this.isCoreReady && this.navigatorReady);

				this.onChangeListener.forEach((listener) => listener("isCoreReady", isReady));

				if(isReady) {
					this.onCoreReadyListener.forEach((listener) => listener(isReady));
				}
			},

			/**
			 * @return {boolean}
			 */
			get coreReady() {
				return this.isCoreReady;
			},

			/**
			 * @param {boolean}isReady
			 */
			set navigatorReady(isReady) {
				this.isNavigatorReady = isReady;
				this.ready = (this.isCoreReady && this.navigatorReady);

				this.onChangeListener.forEach((listener) => listener("isNavigatorReady", isReady));

				if(isReady) {
					this.onNavigatorReadyListener.forEach((listener) => listener(isReady));
				}
			},

			/**
			 * @return {boolean}
			 */
			get navigatorReady() {
				return this.isNavigatorReady;
			},

			/**
			 * @param {SGNAtom|SGNAtom.SGNAtomCore|SGNAtom[]|SGNAtom.SGNAtomCore[]}value
			 */
			set instance(value) {
				const guid = value.guid;
				this.instances[guid] = value;

				this.onChangeListener.forEach((listener) => listener("instances", value));
				this.onInstanceChangeListener.forEach((listener) => listener(value));
			},

			/**
			 * @return {SGNAtom|SGNAtom.SGNAtomCore|SGNAtom[]|SGNAtom.SGNAtomCore[]}
			 */
			get instance() {
				return this.instances;
			},

			/**
			 *
			 * @param {SGNAtomStatesChangeCallback}listener
			 */
			setOnChangeListener: function(listener) {
				this.onChangeListener.push(listener);
			},

			/**
			 *
			 * @param {SGNAtomStatesInstanceChangeCallback}listener
			 */
			setOnInstanceChangeListener: function(listener) {
				this.onInstanceChangeListener.push(listener);
				this.onChangeListener.forEach((listener) => listener(this.instance));
				this.onInstanceChangeListener.forEach((listener) => listener(this.instance));
			},

			/**
			 *
			 * @param {SGNAtomStatesReadyCallback}listener
			 */
			setOnCoreReadyListener: function(listener) {
				this.onCoreReadyListener.push(listener);
				this.ready = (this.isCoreReady && this.navigatorReady);

				if(this.coreReady) {
					this.onCoreReadyListener.forEach((listener) => listener(this.coreReady));
				}
			},

			/**
			 *
			 * @param {SGNAtomStatesReadyCallback}listener
			 */
			setOnNavigatorReadyListener: function(listener) {
				this.onNavigatorReadyListener.push(listener);
				this.ready = (this.isCoreReady && this.navigatorReady);

				if(this.navigatorReady) {
					this.onNavigatorReadyListener.forEach((listener) => listener(this.navigatorReady));
				}
			},

			/**
			 *
			 * @param {SGNAtomStatesReadyCallback}listener
			 */
			setOnReadyListener: function(listener) {
				this.ready = (this.isCoreReady && this.navigatorReady);
				this.onReadyListener.push(listener);

				if(this.coreReady && this.navigatorReady) {
					this.onReadyListener.forEach((listener) => listener(this.ready));
				}
			},
		};

		plugin.name = "SGNAtom";
		/**
		 * @type {SGNAtomOptions}
		 */
		plugin.settings = {
			"core": {
				"defaultPage": "",
			},
			"navigator": {
				"elements": "a, button",
				"resetHead": true,
				"showErrors": true,
				"interceptErrors": true,
				"resumePreviousSession": true
			},
		};
		plugin.settings = Object.assign(plugin.settings, options);
		plugin.SGNAtomStates = SGNAtomStates;
		SGNAtom.prototype.SGNAtomStates = SGNAtomStates;
		plugin.guid = undefined;

		const init = () => {
			if(!window.SGNUIKit) {
				if(!SGNAtomStates.ready) {
					const core = new plugin.SGNAtomCore(elements, plugin, plugin.settings.core);
					plugin.core = core;

					core.setOnCoreReadyListener((isReady) => {
						SGNAtomStates.ready = isReady;
						plugin.guid = plugin.GUID();
						SGNAtomStates.instance = core;
					});
				}
			} else {
				SGNUIKit.holdPreloader = true;
				const stack = new Error().stack;
				if(stack.indexOf("set ready") !== -1) {
					if(!SGNAtomStates.ready) {
						const core = new plugin.SGNAtomCore(elements, plugin, plugin.settings.core);
						plugin.core = core;
						plugin.guid = plugin.GUID();
						SGNAtomStates.instance = plugin;
						SGNAtomStates.ready = core.isInitialized();
					}
				} else {
					if(!SGNAtomStates.ready) {
						window.SGNUIKit.setOnInitListener(() => {
							const core = new plugin.SGNAtomCore(elements, plugin, plugin.settings.core);
							plugin.core = core;
							plugin.guid = plugin.GUID();
							SGNAtomStates.instance = plugin;
							SGNAtomStates.ready = core.isInitialized();
						}, "sgn-atom-onSGNUIKitInit-handler", true);
					}
				}
			}
		};

		plugin.isInitialized = () => {
			return SGNAtomStates.isReady;
		};

		/**
		 *
		 * @return {SGNAtom[]}
		 */
		plugin.getCoreInstance = () => {
			return SGNAtomStates.instance;
		};

		/**
		 *
		 * @param {SGNAtomStatesChangeCallback}listener
		 */
		plugin.setOnStateChangeListener = (listener) => {
			return SGNAtomStates.setOnChangeListener(listener);
		};

		/**
		 *
		 * @param {SGNAtomStatesInstanceChangeCallback}listener
		 */
		plugin.setOnInstanceChangeListener = (listener) => {
			return SGNAtomStates.setOnInstanceChangeListener(listener);
		};

		/**
		 *
		 * @param {SGNAtomStatesReadyCallback}listener
		 */
		plugin.setOnReadyListener = (listener) => {
			return SGNAtomStates.setOnReadyListener(listener);
		};

		/**
		 *
		 * @param {SGNAtomStatesReadyCallback}listener
		 */
		plugin.setOnCoreReadyListener = (listener) => {
			return SGNAtomStates.setOnCoreReadyListener(listener);
		};

		/**
		 *
		 * @param {SGNAtomStatesReadyCallback}listener
		 */
		plugin.setOnNavigatorReadyListener = (listener) => {
			return SGNAtomStates.setOnNavigatorReadyListener(listener);
		};

		plugin.GUID = (uppercase = true, hyphen = true) => {
			let result, i, j;
			result = "";
			for(j = 0; j < 32; j++) {
				if(hyphen && (j === 8 || j === 12 || j === 16 || j === 20)) {
					result = result + "-";
				}
				i = Math.floor(Math.random() * 16).toString(16);
				i = (uppercase) ? i.toUpperCase() : i.toLowerCase();
				result = result + i;
			}
			return result;
		};

		/* plugin.getStack = (search = null) => {
		 const regex = /^(<?(\w+)(\.(\w+))?>?)? ?([a-zA-Z0-9*!/<]+)? ?@?(https?:\/\/[a-z\d-_]+\.?[a-z\d-_]+[^\s:"]+):(\d+):?(\d+)?$/;
		 const errors = [],
		 stack  = (new Error()).stack;

		 function getFilenameAndExtension(path) {
		 if(path !== undefined) {
		 const filenameextension = path.replace(/^.*[\\\/]/, ""),
		 filename          = filenameextension.substring(0, filenameextension.lastIndexOf(".")),
		 ext               = filenameextension.split(".").pop();

		 return {
		 "name": filename,
		 "ext": ext
		 };
		 }
		 return {
		 "name": "",
		 "ext": ""
		 };
		 }

		 stack.split("\n").forEach(v => {
		 const match = v.match(regex);
		 let val;
		 if(match !== null) {
		 if(v.startsWith("@")) {
		 val = {
		 "signature": "<anonymous>",
		 "class": match[2],
		 "function": "<anonymous>",
		 "url": match[6],
		 "line": match[7],
		 "column": match[8],
		 "str": v,
		 "file": getFilenameAndExtension(match[6]),
		 };
		 } else {
		 val = {
		 "signature": match[1],
		 "class": match[2],
		 "function": match[4],
		 "url": match[6],
		 "line": match[7],
		 "column": match[8],
		 "str": v,
		 "file": getFilenameAndExtension(match[6]),
		 };
		 }
		 }
		 if(search !== undefined && search !== null) {
		 if(v.indexOf(search) !== -1) {
		 errors.push(val);
		 }
		 } else {
		 if(val !== undefined && val !== "" && val.signature !== "getStack" && val.signature !== "SUKRinit" && val.signature !== "SUKR" && val.signature !== "window.SUKR") {
		 errors.push(val);
		 }
		 }
		 });
		 if(search !== undefined && search !== null) {
		 return (errors.length > 0) ? errors[0] : null;
		 } else {
		 return errors;
		 }
		 }; */

		plugin.getStack = (search = null) => {
			const regex = /^(<?(\w+)(\.(\w+))?>?)? ?([a-zA-Z0-9*/<]+)? ?@?(https?:\/\/[a-z\d-_]+\.?[a-z\d-_]+[^\s:"]+):(\d+):?(\d+)?$/;
			const errors = [], stack = (new Error()).stack;

			function getFilenameAndExtension(path) {
				if(path !== undefined) {
					const filenameextension = path.replace(/^.*[\\\/]/, ""), filename = filenameextension.substring(0, filenameextension.lastIndexOf(".")), ext = filenameextension.split(".").pop();

					return {
						"name": filename, "ext": ext
					};
				}
				return {
					"name": "", "ext": ""
				};
			}

			stack.split("\n").forEach((v, i) => {
				const match = v.match(regex);
				let val;
				if(match !== null) {
					if(v.startsWith("@")) {
						val = {
							"signature": "<anonymous>",
							"class": match[2],
							"function": "<anonymous>",
							"url": match[6],
							"line": match[7],
							"column": match[8],
							"str": v,
							"file": getFilenameAndExtension(match[6]),
						};
					} else {
						val = {
							"signature": match[1], "class": match[2], "function": match[4], "url": match[6], "line": match[7], "column": match[8], "str": v, "file": getFilenameAndExtension(match[6]),
						};
					}
				}
				if(search !== undefined && search !== null) {
					if(v.indexOf(search) !== -1) errors.push(val);
				} else {
					if(val !== undefined && val !== "" && val.signature !== "getStack" && val.signature !== "SUKRinit" && val.signature !== "SUKR" && val.signature !== "window.SUKR") errors.push(val);
				}
			});
			if(search !== undefined && search !== null) return (errors.length > 0) ? errors[0] : null; else return errors;
		};

		plugin.isExistsOnStack = (search = null) => {
			const stack = plugin.getStack(search);
			return (stack !== null);
		};

		plugin.getI18nString = (key, fallback, ...args) => {
			const i18n = (window.SGNUIKit && window.SGNUIKit.i18n instanceof SGNi18n) ? window.SGNUIKit.i18n : window.i18n;
			return (i18n instanceof SGNi18n) ? i18n.getString(key, fallback, ...args) : fallback;
		};

		if(elements !== undefined && elements !== null) {
			init();
		}

		return plugin.prototype;
	};
	// noinspection JSUnusedGlobalSymbols
	SGNAtom.instances = {
		instances: {},
		onChangeListener: [],
		onCreateListener: [],

		/**
		 * @returns {SGNAtom}
		 */
		get instance() {
			let ins = this;
			return ins.instances;
		},

		/**
		 * @param {SGNAtom}sgnAtom
		 */
		set instance(sgnAtom) {
			const guid = sgnAtom.guid;
			this[guid] = this.instances[guid] = sgnAtom;
			this["length"] = this.instances["length"] = Object.keys(this.instances).length;

			this.onChangeListener.forEach((listener) => listener(this.instances));
		},

		/**
		 *
		 * @param {SGNAtomStatesInstanceChangeCallback}listener
		 */
		setOnChangeListener: function(listener) {
			this.onChangeListener.push(listener);
			//this.onChangeListener.forEach((listener) => listener(this));
		},

		/**
		 *
		 * @param {SGNAtomStatesInstanceChangeCallback}listener
		 */
		setOnCreateListener: function(listener) {
			this.onCreateListener.push(listener);
			$(() => this.onCreateListener.forEach((listener) => listener(this.instances)));
		},
	};
	SGNAtom.interceptWindowUnloadEvents = true;

	/**
	 * Creates new instance of <b><i>SGNAtomCore</i></b> identified by element
	 *
	 * @param {HTMLElement|NodeList} elements The element to use as <b><i>SGNAtom</i></b> container.
	 * @param {SGNAtom} sgnatom The instance of <b><i>SGNAtom</i></b>.
	 * @param {SGNAtomCoreOptions}[options] A <b><i>JSON</i></b> object of supported options to override default functionalities.

	 * @return {SGNAtom.SGNAtomCore|SGNAtom} An instance of <b><i>SGNAtom</i></b>.
	 *
	 * @constructor
	 */
	SGNAtom.prototype.SGNAtomCore = function(elements, sgnatom, options) {
		//SGNAtom.call(this);
		const plugin = Object.assign(this, sgnatom);
		const _plugin = {
			...plugin,
			...sgnatom,
		};

		const pluginName = "SGNAtomCore";
		const isInternalCall = _plugin.isExistsOnStack("SGNAtom.create");
		const SGNAtomCoreStates = _plugin.SGNAtomStates;
		const guid = _plugin.GUID();

		plugin.instances = {};
		plugin.name = pluginName;
		plugin.navigator = undefined;
		plugin.guid = guid;
		plugin.defaultPage = "";

		/**
		 * @type {SGNAtomCoreOptions}
		 */
		plugin.options = _plugin.settings.core;
		if(typeof options === "object" && options.hasOwnProperty("core")) {
			plugin.options = Object.assign(plugin.options, options.core);
		}

		const init = () => {
			elements = (elements instanceof HTMLElement) ? [elements] : elements;
			//const elems = document.querySelectorAll(plugin.settings.navigator.elements) || document.querySelectorAll("a, button");
			if(elements.length <= 0) {
				throw new SGNAtomParameterError("No DOM elements provided");
			} else {
				elements.forEach((c) => {
					if(!c.hasOwnProperty(pluginName)) {
						c[pluginName] = plugin;
						const home = c.attr("sgnatom-home");
						/*const guid = _plugin.GUID();
						 plugin.guid = guid;*/
						c.attr("sgnatom-guid", guid);
						c.classList.remove("sgn-atom-container");
						c.classList.add("sgn-atom-container");
						plugin.instances[guid] = c;
						/*const obj = SGNAtomCoreStates.instance;
						 obj[guid] = c;
						 SGNAtomCoreStates.instance = obj;*/

						if(home !== undefined && home !== null && home !== "") {
							plugin.options.defaultPage = plugin.defaultPage = home;

							if(!isInternalCall) {
								const navOpt = plugin.settings.navigator;
								const navigator = new SGNAtom.prototype.SGNAtomNavigator(plugin, guid, navOpt);
								plugin.navigator = navigator;
								//SGNAtomCoreStates.isCoreReady = true;
								//navigator.load(home);
								navigator.setOnNavigatorReadyListener(() => {
									//SGNAtomCoreStates.isCoreReady = (navigator.isInitialized());
									//SGNAtomCoreStates.ready = (SGNAtomCoreStates.isCoreReady && SGNAtomCoreStates.isNavigatorReady);
								});
							} else {
								//SGNAtomCoreStates.isNavigatorReady = true;
								SGNAtomCoreStates.isCoreReady = true;
							}
						} else {
							//SGNAtomCoreStates.isNavigatorReady = true;
							SGNAtomCoreStates.isCoreReady = true;
						}
					} else {
						throw new SGNAtomDOMError(`${pluginName} is already initialized`);
					}
				});
			}
		};

		plugin.getInstance = (guid) => {
			if(plugin.instances.hasOwnProperty(guid)) {
				return plugin.instances[guid];
			}
			return undefined;
		};

		plugin.isInitialized = () => {
			return SGNAtomCoreStates.isCoreReady;
		};

		if(elements !== undefined && elements !== null) {
			init();
		}

		//return plugin.prototype.SGNAtomCore.prototype;
		sgnatom.core = plugin;

		return plugin;
	};

	/**
	 * Creates new instance of <b><i>SGNAtomNavigator</i></b> identified by elements specified in the <b><i>options</i></b>.
	 *
	 * @param {SGNAtom.SGNAtomCore|SGNAtom} sgnatomcore The instance of <b><i>SGNAtom</i></b>.
	 * @param {string} instance_guid The <b><i>GUID</i></b> of the <b><i>SGNAtom</i></b> instance.
	 * @param {SGNAtomNavigatorOptions}[options={}] A <b><i>JSON</i></b> object of supported options to override default functionalities.

	 * @return {SGNAtom.SGNAtomNavigator|SGNAtom} An instance of <b><i>SGNAtom</i></b>.
	 *
	 * @constructor
	 */
	SGNAtom.prototype.SGNAtomNavigator = function(sgnatomcore, instance_guid, options) {
		const plugin = Object.assign(this, sgnatomcore);
		const _plugin = {
			...plugin,
			...sgnatomcore,
		};
		const pluginName = "SGNAtomNavigator";
		const instance = _plugin.getInstance(instance_guid);
		/**
		 *
		 * @type {number}
		 */
		const PRELOADER_TRANSITION_DURATION = 1000;
		const SGNAtomNavigatorStates = _plugin.SGNAtomStates;
		/**
		 * @type {Element[]}
		 */
		const rootHeadElements = Array.from(document.head.children);
		const forEach = (obj, callback) => {
			let value;
			//context = context || this;  //apply the function to 'this' by default

			for(const key in obj) {
				if(key !== "length" && obj.hasOwnProperty(key)) {  //to rule out inherited properties
					value = obj[key];
					if(typeof callback === "function") {
						callback(value, key);
					}
				}
			}
		};
		const push = (obj, ...items) => {
			let k = obj.length || 0;

			items.forEach(value => {
				obj[k] = value;
				k++;
				obj.length = k;
			});
		};
		const SGNANEventsListeners = {
			onPageLoadListeners: {},
			onChangeListener: {},
			onCreateListener: {},

			/**
			 * Add a loaded <b>SGNUIKit</b> component.
			 *
			 * @param {(url:string, code:200|201|202|203|204, isDefaultPage:boolean)=>void} value The <b><i>JSON</i></b> object of the loaded <b>SGNUIKit</b> component.
			 */
			set onPageLoadListener(value) {
				if(typeof value === "function") {
					push(this.onPageLoadListeners, value);
				}

				//forEach(this.onChangeListener, listener => listener(value, this.onPageLoadListeners));
			},

			/**
			 * Get the list of loaded <b>SGNUIKit</b> components.
			 *
			 * @return {object} The <b><i>JSON</i></b> object of loaded <b>SGNUIKit</b> components, or an empty <b><i>JSON</i></b> object if no components loaded.
			 */
			get onPageLoadListener() {
				return this.onPageLoadListeners;
			},

			/**
			 * Set the handler for <b>SGNUIKit</b> <b><i>OnChange</i></b> event, which will be triggered when a component is loaded/removed or the status of readiness is changed.
			 *
			 * @param {(newOnPageLoadListener:function|null, onPageLoadListeners:{})=>void}listener
			 * @param {string|number}[id=undefined]
			 */
			setOnChangeListener: function(listener, id) {
				if(typeof id !== "string" || is_numeric(id)) {
					this.onChangeListener[id] = listener;
				} else {
					push(this.onChangeListener, listener);
				}

				forEach(this.onChangeListener, (listener) => listener(null, this.onPageLoadListeners));
			},

			/**
			 * Set the handler for <b>SGNUIKit</b> <b><i>OnChange</i></b> event, which will be triggered when a component is loaded/removed or the status of readiness is changed.
			 *
			 * @param {(newInstance:{}, instances:{})=>void}listener
			 * @param {string|number}[id=undefined]
			 */
			setOnCreateListener: function(listener, id) {
				if(typeof id !== "string" || is_numeric(id)) {
					this.onCreateListener[id] = listener;
				} else {
					push(this.onCreateListener, listener);
				}

				SGNUIKit.setOnReadyListener(() => forEach(this.onCreateListener, (listener) => listener(this.onPageLoadListeners)), "sgnan-create-listener");
			},
		};
		let defaultPageLoaded = false, previousLoadedPage = false;
		/**
		 * @type {string|false}
		 */
		let currentlyLoadingPage = false;

		plugin.name = pluginName;
		plugin.options = _plugin.settings.navigator;
		plugin.options = Object.assign(plugin.options, options);
		plugin.options.onPageLoadListener = [];
		plugin.instances = {};
		const elements = plugin.options.elements || "a, button, .clickable";

		/**
		 * The init function is the entry point for the plugin.
		 * It will check if there is a previous session to resume, and load it if so.
		 * Otherwise, it will load the default page or do nothing at all.
		 *
		 * @return The plugin object
		 */
		const init = () => {
			if(!window.SGNUIKit) {
				(() => {
					const style = printPreLoaderStyles();
					rootHeadElements.push(style);
				})();
			}
			setupMutationObserver();

			_plugin.base_dir = getCurrentURLDir();
			_plugin.base_url = getCurrentURL();

			let loaders = document.querySelector(".sgn-preloader");
			if(loaders === null || loaders.length < 1) {
				printPreLoader(false);
			}

			const urls   = parseURL(document.URL),
			      params = urls.params,
			      page   = params.get('page'),
			      search = urls.search.replace(`page=${page}`, '').replace('?&', '?');
			if(typeof page !== 'undefined' && page !== null && page !== '') {
				setTimeout(() => plugin.load(`${page}${search}`, null, false), 100);
			} else if(plugin.options.resumePreviousSession) {
				const url          = window.localStorage.getItem("LAST_URL"),
				      historyStack = getHistoryStack();
				if(historyStack.getLength() > 0) {
					window.history.pushState(null, document.title, location.href);
					historyStack.forEach(historyObject => window.history.pushState(historyObject.state, "", historyObject.url));
					window.sessionStorage.setItem("HISTORY_STACK", historyStack.serialize());
				}
				if(url !== undefined && url !== null && url !== "") {
					setTimeout(() => plugin.load(url, null, false), 100);
				} else if(_plugin.defaultPage !== undefined && _plugin.defaultPage !== null && _plugin.defaultPage !== "") {
					setTimeout(() => plugin.load(_plugin.defaultPage, null, false), 100);
				} else if(_plugin.base_url !== undefined && _plugin.base_url !== null && _plugin.base_url !== "") {
					setTimeout(() => plugin.load(_plugin.base_url, null, false), 100);
				} else {
					SGNAtomNavigatorStates.isNavigatorReady = true;
				}
			} else {
				if(_plugin.defaultPage !== undefined && _plugin.defaultPage !== null && _plugin.defaultPage !== "") {
					setTimeout(() => plugin.load(_plugin.defaultPage, null, false), 100);
				} else {
					SGNAtomNavigatorStates.isNavigatorReady = true;
				}
			}

			bindGlobalEvents();

			SGNAtomNavigatorStates.isNavigatorReady = true;
		};

		/**
		 * The setupMutationObserver function sets up a MutationObserver to watch for changes in the DOM.
		 * When it detects a change, it calls fixSources() and setupNavigator().
		 *
		 * @return The observer
		 */
		const setupMutationObserver = () => {
			// Select the node that will be observed for mutations
			const targetNode = instance;

			// Options for the observer (which mutations to observe)
			const config = {childList: true, subtree: true};

			// Callback function to execute when mutations are observed
			const callback = (mutationList, observer) => {
				const elems = document.querySelectorAll(elements);
				fixSources();
				setupNavigator(elems);
			};

			// Create an observer instance linked to the callback function
			const observer = new MutationObserver(callback);

			// Start observing the target node for configured mutations
			observer.observe(targetNode, config);

			// Later, you can stop observing
			//observer.disconnect();
		};

		/**
		 * The bindGlobalEvents function binds the global events to the window object.
		 *
		 * @param pageLoadFinished Determine whether the page has been loaded or not
		 */
		const bindGlobalEvents = (pageLoadFinished = false) => {
			if(pageLoadFinished) {
				window.onbeforeunload = function(e) {
					/* const callerStack = plugin.getStack(), lastCallerStack = callerStack[0], caller = `${lastCallerStack.file.name}.${lastCallerStack.signature}:${lastCallerStack.line}:${lastCallerStack.column}` || null;
					 console.default.log(callerStack, caller); */
					//return "Are you sure to exit?";
					if(SGNAtom.interceptWindowUnloadEvents) window.location.assign(_plugin.base_url);
				};
				window.onunload = function(e) {
					//return "Are you sure to exit?";
					if(SGNAtom.interceptWindowUnloadEvents) window.location.assign(_plugin.base_url);
				};
			} else {
				window.onbeforeunload = function(e) {
					if(SGNAtom.interceptWindowUnloadEvents) window.location.assign(_plugin.base_url);
				};
				window.onunload = function(e) {
					if(SGNAtom.interceptWindowUnloadEvents) window.location.assign(_plugin.base_url);
				};
				window.onpopstate = function(e) {
					if(e.state) {
						const guid  = e.state.guid,
						      title = e.state.title;
						let historyObject = getHistoryObject(guid);
						if(historyObject !== undefined) {
							const head = historyObject.head,
							      body = historyObject.body,
							      url  = historyObject.url;

							$(document).trigger("SGNAtom.startPageLoad", {"url": url});

							showPreLoader(true, () => {
								if(plugin.options.resetHead) {
									//document.head.innerHTML = null;
									const headChildElems = document.head.children,
									      headElems      = Array.from(headChildElems);
									headElems.forEach((c) => {
										if(!isNodeExists(rootHeadElements, c) && c.nodeName !== "TITLE") {
											document.head.removeChild(c);
										}
									});
									head.nodes.forEach((item) => {
										if(!isNodeExists(rootHeadElements, item) && item.nodeName !== "TITLE") {
											document.head.append(item);
										}
									});
								} else {
									document.head.innerHTML = head.html;
								}
								instance.innerHTML = body.html;
								const parser = new DOMParser();
								const doc = parser.parseFromString(body.html, "text/html");
								fixSources(doc);

								const scripts = doc.querySelectorAll("script");
								if(scripts.length > 0) {
									scripts.forEach((script) => {
										if(!script.hasAttribute("src")) {
											executeScript(script);
										}
									});
								}

								document.title = title;
								const elems = document.querySelectorAll(plugin.options.elements);
								setupNavigator(elems);

								setLastURL(url);
								finishPageLoad(200, url, false);
							});
						}
					}
				};
				window.addEventListener("offline", () => {
					hidePreLoader();
					let msg = `Sorry! You are currently offline. You'll be able to access the application once your internet connection is restored.`;
					if(currentlyLoadingPage) {
						msg = `Sorry! You are currently offline. You'll be able to access the application and the page <b>${currentlyLoadingPage}</b> will load once your internet connection is restored.`;
					}
					const offlineErrorMsg = plugin.getI18nString("sgn_atom_error_user_offline_msg", msg);
					const offlineErrorHeading = plugin.getI18nString("txt_no_internet", `No Internet!`);

					let overlayElem = document.createElement("div");
					overlayElem.className = "overlay";
					//overlayElem.attr("style", "opacity: 0;");
					let preloader = `\t\t<div class="offline-msg">\n`;
					preloader += `\t\t\t<h2 class="title danger-text">${offlineErrorHeading}</h2>\n`;
					preloader += `\t\t\t<div class="msg text-secondary">${offlineErrorMsg}</div>\n`;
					preloader += `\t\t</div>\n`;

					overlayElem.innerHTML = preloader;

					document.body.className += " user-offline";
					document.body.insertBefore(overlayElem, document.body.firstChild);

					overlayElem = document.querySelector(".overlay");

					if(overlayElem !== null && overlayElem instanceof HTMLElement) {
						overlayElem.fadeIn(PRELOADER_TRANSITION_DURATION);
					}
				});
				window.addEventListener("online", () => {
					let msg = `Hooray! Your internet connection is restored, you'll now be able to access the application shortly.`;
					if(currentlyLoadingPage) {
						msg = `Hooray! Your internet connection is restored, the page <b>${currentlyLoadingPage}</b> will load shortly.`;
					}
					const onlineMsg = plugin.getI18nString("sgn_atom_user_online_msg", msg);
					const overlayElem = document.querySelector(".overlay");
					$.SGNSnackbar(onlineMsg).show();

					if(overlayElem !== null && overlayElem instanceof HTMLElement) {
						overlayElem.fadeOut(PRELOADER_TRANSITION_DURATION, () => {
							overlayElem.remove();
							document.body.classList.remove("user-offline");
						});
					}
					if(currentlyLoadingPage) {
						plugin.load(currentlyLoadingPage);
					}
				});
			}
		};

		const setupPageLoadStartEvents = () => {
			window.onbeforeunload = null;
			window.onunload = null;
		};

		/**
		 * The setupNavigator function is used to initialize the navigator plugin.
		 *
		 *
		 * @param {HTMLElement[]|NodeList} clickables Pass in the element(s) that will be used to navigate
		 * @param {boolean} [firstInit=false] Check if the plugin is already initialized
		 */
		const setupNavigator = (clickables, firstInit = false) => {
			bindGlobalEvents(true);
			clickables = (clickables instanceof HTMLElement) ? [clickables] : clickables;

			clickables.forEach((c) => {
				const href = c.attr("href");
				if(!c.hasOwnProperty(pluginName) && (typeof href === 'string' && href.startsWith(_plugin.base_dir))) {
					c[pluginName] = _plugin;
					const eventData = $(c).getEventData("click");
					if(eventData === undefined) {
						bindEvents(c);
					}
					const guid = _plugin.GUID();
					plugin.guid = guid;
					c.attr("sgnatom-navigator-guid", guid);

					plugin.instances[guid] = c;
					if(firstInit) {
						SGNAtomNavigatorStates.isNavigatorReady = true;
						firstInit = false;
					}
				} else {
					if(firstInit) {
						throw new SGNAtomDOMError(`${pluginName} is already initialized`);
					}
				}
			});
		};

		/**
		 * The getHistoryStack function retrieves the history stack from session storage.
		 *
		 * @return {HistoryStack|undefined} The **HistoryStack** (if exists), **undefined** otherwise.
		 */
		const getHistoryStack = () => {
			const stack = HistoryStack.deserialize(window.sessionStorage.getItem("HISTORY_STACK"));
			return (stack) ? stack : undefined;
		};

		/**
		 *
		 * @param {string}guid
		 * @return {HistoryObject|undefined}
		 */
		const getHistoryObject = (guid) => {
			const stack = getHistoryStack();
			if(guid === undefined) {
				return stack;
			} else {
				return (stack.hasOwnProperty(guid)) ? stack[guid] : undefined;
			}
		};

		/**
		 * The setHistoryStack function is used to set the history stack.
		 *
		 * @param {HistoryObject} historyObject An instance of **HistoryObject**.
		 *
		 * @return {HistoryStack[string<HistoryObject>]} An instance of **HistoryStack**.
		 */
		const setHistoryStack = (historyObject) => {
			if(!historyObject instanceof HistoryObject) {
				throw new SGNAtomParameterError("The parameter 'historyObject' must be an instance of 'HistoryObject'");
			}

			const dURLs = parseURL(_plugin.defaultPage);
			const url = (historyObject.url === dURLs.url) ? _plugin.base_dir : historyObject.url;

			const state = historyObject.state || {
				"title": historyObject.title,
				"url": historyObject.url,
				"guid": historyObject.guid,
			};

			const historyStack = new HistoryStack(historyObject);

			window.history.pushState(state, "", url);

			window.sessionStorage.setItem("HISTORY_STACK", historyStack.serialize());
			window.localStorage.setItem("LAST_URL", historyObject.url);
			return historyStack;
		};

		/**
		 * The setLastURL function stores the last URL visited by the user in local storage.
		 *
		 * @param {string} url Set the last url in local storage
		 */
		const setLastURL = (url) => window.localStorage.setItem("LAST_URL", url);

		/**
		 * The parseURL function takes a URL string and returns an object containing the following properties:
		 * 	- url: The original URL string.
		 * 	- origin: The window's location origin (e.g., &quot;http://localhost&quot; or &quot;http://example.com&quot;).
		 *  - path: The full path of the URL, including any query parameters (e.g., &quot;/path/to/page?foo=bar&amp;baz=qux&quot;).
		 *  - relative {object}: An object containing two properties, both of which are relative to the window's location origin property above; these are as follows...
		 *
		 * @param {string} url Parse the url and get the path
		 *
		 * @return {{path: (string|*|string), origin: string, url: (*|string), relative: {path: (string|string|*|string), url: string}}} An object with the following properties:
		 * 	- url: The original URL string.
		 * 	- origin: The window's location origin (e.g., &quot;http://localhost&quot; or &quot;http://example.com&quot;).
		 *  - path: The full path of the URL, including any query parameters (e.g., &quot;/path/to/page?foo=bar&amp;baz=qux&quot;).
		 *  - relative {object}: An object containing two properties, both of which are relative to the window's location origin property above; these are as follows...
		 */
		const parseURL = (url) => {
			url = (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) ? url : `${_plugin.base_dir}${url}`;

			const origin = window.location.origin;
			let urlPath = (url.indexOf(origin) !== -1) ? url.replace(origin, "") : url;
			const cUrlPath = (urlPath === _plugin.defaultPage) ? "/" : urlPath,
			      cUrl     = new URL(cUrlPath, origin).href;
			const urls = new URL(url);

			return {
				"url": url,
				"origin": urls.hostname,
				"path": urls.pathname,
				"search": urls.search,
				"params": urls.searchParams,
				"relative": {
					"path": cUrlPath,
					"url": cUrl
				}
			};
		};

		/**
		 * The getCurrentURL function returns the current URL of the page.
		 *
		 * @return {string} The current url
		 */
		const getCurrentURL = () => {
			const urls     = new URL(document.URL),
			      origin   = `${urls.origin}/`,
			      location = window.location.pathname;

			return `${origin}${location}`.replace(/([^:]\/)\/+/g, "$1");
		};

		const getCurrentURLDir = () => {
			const urls     = new URL(document.URL),
			      origin   = `${urls.origin}/`,
			      location = window.location.pathname,
			      path     = location.substring(0, location.lastIndexOf("/"));

			const dir = path.substring(path.lastIndexOf("/") + 1);
			return `${origin}${dir}/`.replace(/([^:]\/)\/+/g, "$1");
		};

		/**
		 * The getPageFullURL function takes a URL and returns the full URL of that page.
		 *
		 * @param {string} url Determine the page to load
		 *
		 * @return {string} The full url of a page
		 */
		const getPageFullURL = (url) => (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) ? url : `${_plugin.base_dir}${url}`;

		/**
		 * The bindEvents function binds the click event to all elements
		 *
		 * @param {HTMLElement} element Bind the event listener to an element
		 *
		 * @return {HTMLElement} The element that was passed to it
		 */
		const bindEvents = (element) => {
			element.addEventListener("click", function(e) {
				e.preventDefault();
				const _this = this;
				const href = _this.attr("href");

				if(href !== undefined && href !== null && href !== "") {
					setupPageLoadStartEvents();
					plugin.load(href);
				}
			}, false);
		};

		/**
		 * The printPreLoaderStyles function is used to print the styles for the preloader.
		 *
		 * @return {HTMLStyleElement} A style element
		 */
		const printPreLoaderStyles = () => {
			let r = undefined;
			if(!window.SGNUIKit) {
				(() => {
					const css = `/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

.has-preloader,
.has-preloader * {
\t--sgn-background: #fff;
\t--sgn-preloader-stripes-width: 6px;
\t--sgn-preloader-circles-width: 44px;
\t--sgn-preloader-circles-height: 22px;
\t--sgn-preloader-circles-margin: 1px;
\t--sgn-preloader-circles-radius: 6px;
}

@media all and (prefers-color-scheme: dark) {
\t.has-preloader,
\t.has-preloader * {
\t--sgn-background: #000;
\t}
}

body {
\tmargin: 0;
}

.sgn-preloader {
\tpadding: 0;
\twidth: 100%;
\theight: 100%;
\tbackground-color: var(--sgn-background);
\tdisplay: flex;
\tjustify-content: center;
\talign-items: center;
\tposition: absolute;
\tz-index: 999999;
}


.sgn-preloader > .preloader {
\tposition: relative;
\tdisplay: inline-flex;
\tjustify-content: center;
\talign-items: center;
}

.sgn-preloader > .preloader > .spinner {
\tanimation: rotate 10s infinite linear;
\tposition: relative;
\tdisplay: inline-flex;
\tjustify-content: center;
\talign-items: center;
\twidth: 100%;
\theight: 100%;
}


.sgn-preloader > .preloader > img {
\twidth: 100%;
\theight: 100%;
\tmargin: var(--sgn-preloader-circles-margin);
\tdisplay: flex;
\tjustify-content: center;
\talign-items: center;
\tposition: relative;
\ttop: 50%;
\tleft: 50%;
}
.sgn-preloader > .preloader > .spinner > img {
\twidth: calc(var(--sgn-preloader-circles-width));
\theight: calc(var(--sgn-preloader-circles-width));
\tmargin: var(--sgn-preloader-circles-margin);
}
.sgn-preloader > .preloader > .spinner > i {
\tanimation: rotate 3s infinite cubic-bezier(0.09, 0.6, 0.8, 0.03);
\ttransform-origin: 50% 100% 0;
\tposition: absolute;
\tdisplay: inline-flex;
\tjustify-content: center;
\talign-items: center;
\ttop: 50%;
\tleft: 50%;
\tborder: solid var(--sgn-preloader-stripes-width) transparent;
\tborder-bottom: none;
}
.sgn-preloader > .preloader > .spinner > i:nth-child(1) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 0.3, 0.12, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 0.3, 0.12, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 0.3, 0.12, 0.03);
\twidth: var(--sgn-preloader-circles-width);
\theight: var(--sgn-preloader-circles-height);
\tmargin-top: calc(0px - var(--sgn-preloader-circles-height));
\tmargin-left: calc(0px - var(--sgn-preloader-circles-height));
\tborder-color: #2172b8;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 1) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 1) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(2) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 0.6, 0.24, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 0.6, 0.24, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 0.6, 0.24, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2));
\theight: calc(var(--sgn-preloader-circles-height) + (var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)));
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + (var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin))));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + (var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin))));
\tborder-color: #18a39b;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(3) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 0.9, 0.36, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 0.9, 0.36, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 0.9, 0.36, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2));
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2)));
\tborder-color: #82c545;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(4) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 1.2, 0.48, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 1.2, 0.48, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 1.2, 0.48, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 1.5);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 3)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 3)));
\tborder-color: #f8b739;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(5) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 1.5, 0.6, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 1.5, 0.6, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 1.5, 0.6, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 4);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 4)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 4)));
\tborder-color: #f06045;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 4) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 4) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(6) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 1.8, 0.72, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 1.8, 0.72, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 1.8, 0.72, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 5);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2.5);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 5)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 5)));
\tborder-color: #ed2861;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 5) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 5) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(7) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 2.1, 0.84, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 2.1, 0.84, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 2.1, 0.84, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 6);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 6)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 6)));
\tborder-color: #c12680;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 6) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 6) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(8) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 2.4, 0.96, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 2.4, 0.96, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 2.4, 0.96, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 7);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3.5);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 7)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 7)));
\tborder-color: #5d3191;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 7) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 7) + var(--sgn-preloader-circles-radius));
}

@-moz-keyframes rotate {
\tto {
\t\ttransform: rotate(360deg);
\t}
}
@-webkit-keyframes rotate {
\tto {
\t\ttransform: rotate(360deg);
\t}
}
@keyframes rotate {
\tto {
\t\ttransform: rotate(360deg);
\t}
}


`;
					const head  = document.head || document.getElementsByTagName("head")[0],
					      style = document.createElement("style");

					head.appendChild(style);
					style.id = "sgn-uikit-styles";
					style.appendChild(document.createTextNode(css));
					r = style;
				})();
			}
			return r;
		};

		/**
		 * The printPreLoader function creates a preloader element and inserts it into the DOM.
		 *
		 * @param  {boolean} [hidden=true] Determine whether the preloader should be hidden or not
		 *
		 * @return {Element} A dom element
		 */
		const printPreLoader = (hidden = true) => {
			let preloaderElem = document.createElement("div");
			preloaderElem.className = "sgn-preloader";
			if(hidden) {
				preloaderElem.attr("style", "opacity: 0;");
			}
			let preloader = `\t\t\t<div class="preloader">\n`;
			//preloader += `\t\t\t\t<img src="<?=$public_imgAssets;?>icons/xsmall.png">\n`;
			preloader += `\t\t\t\t<div class="spinner">\n`;
			preloader += `\t\t\t\t\t<i></i>\n`;
			preloader += `\t\t\t\t\t<i></i>\n`;
			preloader += `\t\t\t\t\t<i></i>\n`;
			preloader += `\t\t\t\t\t<i></i>\n`;
			preloader += `\t\t\t\t\t<i></i>\n`;
			preloader += `\t\t\t\t\t<i></i>\n`;
			preloader += `\t\t\t\t\t<i></i>\n`;
			preloader += `\t\t\t\t\t<i></i>\n`;
			preloader += `\t\t\t\t</div>\n`;
			preloader += `\t\t\t</div>\n`;
			preloader += `\t\t</div>\n`;

			preloaderElem.innerHTML = preloader;

			document.body.className += " has-preloader";
			document.body.insertBefore(preloaderElem, document.body.firstChild);

			/*const loader = document.querySelector('.sgn-preloader');
			 loader.fadeIn(2000);*/

			return document.querySelector(".sgn-preloader");
		};

		const showPreLoader = (transitive = true, callback) => {
			let loaders = document.querySelector(".sgn-preloader");
			if(loaders === null || !loaders instanceof HTMLElement) {
				loaders = printPreLoader();
			}
			if(transitive) {
				instance.fadeOut(PRELOADER_TRANSITION_DURATION);
				loaders.fadeIn(PRELOADER_TRANSITION_DURATION, callback);
			} else {
				loaders.fadeIn(0, callback);
			}
		};

		const hidePreLoader = (transitive = true, callback) => {
			const loader = document.querySelector(".sgn-preloader");

			if(loader !== null && loader instanceof HTMLElement) {
				if(transitive) {
					instance.fadeIn(PRELOADER_TRANSITION_DURATION);
					loader.fadeOut(PRELOADER_TRANSITION_DURATION, () => {
						loader.remove();
						document.body.classList.remove("has-preloader");

						if(typeof callback === "function") {
							callback();
						}
					});
				} else {
					instance.fadeIn(0);
					loader.fadeOut(0, () => {
						loader.remove();
						document.body.classList.remove("has-preloader");

						if(typeof callback === "function") {
							callback();
						}
					});
				}
			}
		};

		/**
		 * @param {Element[]} current
		 * @param {Element} element
		 * @return {Element[]|boolean}
		 */
		const isNodeExists = (current, element) => {
			if(element instanceof Element) {
				const data = Array.from(current);
				return data.some(obj => (obj.isEqualNode(element)));
			}

			return current;
		};

		/**
		 *
		 * @param {string}msg
		 * @param {"error"|"success"|"warning"|"info"}[type="error"]
		 *
		 * @return {HTMLElement}
		 */
		const showAlert = (msg, type = "error") => {
			if(typeof $.SGNSnackbar === "function") {
				$.SGNSnackbar(msg).show();
			} else {
				let $div = document.createElement("div").attr("class", `sgn-atom-alert ${type}`);
				$div.innerHTML = msg;
				$div.addEventListener("click", (e) => {
					e.preventDefault();
					hideAlert($div);
				});
				instance.appendChild($div);

				$div.fadeIn(10000, () => hideAlert($div));

				return $div;
			}
		};

		/**
		 *
		 * @param {HTMLElement}$alert
		 */
		const hideAlert = ($alert) => $alert.remove();

		/**
		 * @param {HTMLElement|Node} [elem=undefined]
		 */
		const fixSource = (elem) => {
			const srcAttr  = (elem.hasAttribute("src")) ? elem.getAttribute("src") : "",
			      hrefAttr = (elem.hasAttribute("href")) ? elem.getAttribute("href") : "";
			if(!empty(srcAttr)) {
				const src = (srcAttr.startsWith("data:")) ? srcAttr : srcAttr.replace(/([^:]\/)\/+/g, "$1");
				elem.src = (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//") || src.startsWith("data:")) ? src : `${_plugin.base_dir}${src}`;
			}
			if(!empty(hrefAttr)) {
				const src = hrefAttr.replace(/([^:]\/)\/+/g, "$1");
				//el.href = (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) ? src : `${_plugin.base_dir}${src}`;
				elem.href = (src.match(/^(([a-z]+:)?\/\/)|(\.\.?\/)/i)) ? src : `${_plugin.base_dir}${src}`;
			}
		};

		/**
		 * @param {Document} [doc=undefined]
		 */
		const fixSources = (doc) => {
			doc = doc || document;
			const srcs = doc.querySelectorAll("*[src], *[href]");
			if(srcs.length > 0) srcs.forEach((el) => fixSource(el));
		};

		/**
		 *
		 * @param {HTMLScriptElement}script
		 */
		const executeScript = (script, n) => {
			try {
				eval(script.innerHTML);
			} catch(e) {
				const msg = plugin.getI18nString('sgn_atom_error_script_parse_failed', 'Failed to parse the script');
				const url = getPageFullURL(currentlyLoadingPage);

				if(_plugin.settings.debugMode) {
					console.error(`[SGNAtom] ${msg}: ${e.message} on ${url} and tag number ${n}`);
				}
			}
		};

		/**
		 *
		 * @param {HTMLScriptElement[]} scripts
		 * @param {number} [i=0]
		 */
		const executeScripts = (scripts, i = 0) => new Promise((resolve) => {
			const l = scripts.length;
			if(l > 0) {
				if(i === l) return;

				const script = scripts[i];

				executeScript(script, (i + 1));

				if(i >= (l - 1)) {
					resolve(scripts, i);
				} else {
					resolve(executeScripts(null, ++i));
				}
			} else {
				resolve(scripts, i);
			}
		});

		const finishPageLoad = (code = 200, url = null, triggerSUKR = false) => {
			const isDefaultPage = (!defaultPageLoaded);
			url = url || currentlyLoadingPage;
			switch(code) {
				case 200:
					fixSources();
					previousLoadedPage = url;
					defaultPageLoaded = isDefaultPage;

					if(plugin.options.onPageLoadListener.length > 0) plugin.options.onPageLoadListener.forEach(listener => listener(url, code, isDefaultPage));
					SGNANEventsListeners.setOnChangeListener((newListener) => {
						if(newListener !== null) {
							newListener(url, 200, isDefaultPage);
						}
					}, "sgnatom-page-load-event-listener");
					if(triggerSUKR) forEach(SUKRInstances.instances, inst => inst.trigger());
					break;
			}
			currentlyLoadingPage = false;
			hidePreLoader();
		};

		/**
		 * Get the instance of <b>SGNAtomNavigator</b> identified by GUID.
		 *
		 * @param {string} guid The GUID of the <b>SGNAtomNavigator</b> instance.
		 *
		 * @return {undefined|SGNAtom.SGNAtomNavigator|SGNAtom} If found then, the instance of <b>SGNAtomNavigator</b> matching the <b><i>guid</i></b>, otherwise <b>undefined</b>.
		 */
		plugin.getNavigatorInstance = (guid) => {
			if(plugin.instances.length > 0 && plugin.instances.hasOwnProperty(guid)) {
				return plugin.instances[guid];
			}
			return undefined;
		};

		/***
		 * Set 'onPageLoadListener' event which will be triggered whenever a page is finished loading.
		 *
		 * @param {(url:string, code:200|201|202|203|204, isDefaultPage:boolean)=>void} onPageLoadListener The callback function to the event handler.
		 */
		plugin.setOnPageLoadListener = (onPageLoadListener) => {
			plugin.options.onPageLoadListener.push(onPageLoadListener);
			SGNANEventsListeners.onPageLoadListener = onPageLoadListener;
		};

		/***
		 * @typedef {function(error, data)} loadPageCallback Callback for load page.
		 *
		 * @callback loadPageCallback
		 * @param {boolean} error <b>TRUE</b> if any error encountered during loading the page, <b>FALSE</b> otherwise.
		 * @param {JSON} data A <b>JSON</b> object (if found).
		 */
		/***
		 * Load a particular page
		 *
		 * @param {string} page The path to the page to load (can be relative or absolute but must be on HTTP/HTTPS protocol).
		 * @param {loadPageCallback} [callback] A callback function which will be called when the page is finished loading (very similar to <b><i>SGNAtomNavigator.setOnPageLoadListener()</i></b> but contains the loaded data).
		 * @param {boolean} [transitive=ture] State whether to use animations.
		 */
		plugin.load = (page, callback, transitive = true) => {
			if(page !== undefined && page !== null && page !== "") {
				currentlyLoadingPage = (page === "/" || parseURL(page).path === "/") ? _plugin.defaultPage : page;
				const url = getPageFullURL(currentlyLoadingPage);
				const isDefaultPage = (!defaultPageLoaded);
				$(document).trigger("SGNAtom.startPageLoad", {"url": url});

				if(navigator.onLine) {
					showPreLoader(transitive, () => {
						let code     = 0,
						    response = undefined;

						fetch(url, {
							credentials: "include",
							method: "GET", // or 'PUT'
							headers: {
								"Content-Type": "text/html",
							},
						}).then((r) => {
							response = r;
							code = response.status;

							if(!response.ok) {
								if(plugin.options.interceptErrors) {
									hidePreLoader();
									switch(code) {
										case 403:
											showAlert(plugin.getI18nString("sgnatom_load_error_403", `Sorry! You don't have the rights to access the page.`));
											break;
										case 404:
											//window.alert(getI18nString('sgnatom_load_error_404', `Failed to load the page. The page couldn't be found.`));
											//console.log(response, response.status);
											showAlert(plugin.getI18nString("sgnatom_load_error_404", `Failed to load the page. The page couldn't be found.`));
											break;
									}
								}
							} else {
								return response.text();
							}
						}).then((data) => {
							if(typeof data !== "undefined" && typeof data === "string") {
								const parser = new DOMParser();

								// Parse the text
								// noinspection JSCheckFunctionSignatures
								const doc = parser.parseFromString(data, "text/html");
								const head  = doc.querySelector("head"),
								      title = head.querySelector("title"),
								      body  = doc.querySelector("body");

								const headChildElems = document.head.children,
								      headElems      = Array.from(headChildElems);
								const newHeadElems = (plugin.options.resetHead) ? [] : rootHeadElements;

								if(plugin.options.resetHead) {
									headElems.forEach((c) => {
										if(!isNodeExists(rootHeadElements, c) && c.nodeName !== "TITLE") {
											document.head.removeChild(c);
										}
									});
								} else {
									//document.head.innerHTML = null;
									//document.head.innerHTML += rootHeadElementsHTML;
								}

								//const sgnatomScript = document.currentScript || document.querySelector("script[src*=\"SGNAtom.js\"]") || document.querySelector("script[src*=\"SGNAtom.min.js\"]");
								Array.from(head.children).forEach((item) => {
									if(!isNodeExists(rootHeadElements, item) && item.nodeName !== "TITLE") {
										document.head.append(item);
										newHeadElems.push(item);
									}
								});
								let headHTML = "";
								newHeadElems.forEach((c) => headHTML += `${c.outerHTML}\n`);

								fixSources(doc);

								const scripts = doc.querySelectorAll("script");
								if(scripts.length > 0) {
									scripts.forEach((script, i) => {
										if(!script.hasAttribute("src")) {
											executeScript(script, (i + 1));
										}
									});
								}

								document.title = (title !== undefined && title !== null) ? title.innerText : document.title;
								instance.innerHTML = body.innerHTML;

								const historyObjectGUID = _plugin.GUID();
								const historyObject = new HistoryObject(historyObjectGUID, url, document.title, new HistoryNodeObject([doc]), new HistoryNodeObject(newHeadElems), new HistoryNodeObject([body]));
								setHistoryStack(historyObject);
								setTimeout(() => {
									forEach(SUKIInstances.instances, inst => inst.trigger());
									const elems = document.querySelectorAll(elements);
									setupNavigator(elems);
								}, 500);

								if(typeof callback === "function") {
									callback(false, data);
								}
								return doc;
							}
						}).catch((error) => {
							const msg = plugin.getI18nString('sgn_atom_error_page_load_failed', 'Failed to load the page');
							if(_plugin.settings.debugMode) {
								console.error(`[SGNAtom] ${msg}: ${error.message} on ${url}`);
							}
							if(plugin.options.showErrors) {
								showAlert(msg);
							}
							if(typeof callback === "function") {
								callback(true, error);
							}
						}).finally(() => setTimeout(() => finishPageLoad(code, currentlyLoadingPage, false), 1000));
					});
				}
			}
		};

		plugin.isInitialized = () => SGNAtomNavigatorStates.isNavigatorReady;

		if(!SGNAtomNavigatorStates.navigatorReady) {
			init();
		}

		sgnatomcore.navigator = plugin;

		return plugin;
	};

	/**
	 * Creates new instance of <b><i>SGNAtom</i></b> identified by <b><i>element</i></b>
	 *
	 * @param {HTMLElement|NodeList|string} element The element to use as <b><i>SGNAtom</i></b> container.
	 * @param {SGNAtomOptions}[options={}] A <b><i>JSON</i></b> object of supported options to override default functionalities.

	 * @return {SGNAtom.create} An instance of <b><i>SGNAtom.create</i></b>.
	 */
	SGNAtom.create = function(element, options = {}) {
		const _this = this;

		if(!element instanceof HTMLElement && !element instanceof NodeList && typeof element !== "string") {
			throw new SGNAtomParameterError("Parameter 'element' must be either an instance of 'HTMLElement/NodeList' or a CSS representation string identifying the element.");
		}

		const elem = (element instanceof HTMLElement) ? [element] :
		             (element instanceof NodeList) ? element :
		             document.querySelectorAll(element);

		_this.create.prototype.sgnAtom = new SGNAtom(elem, options);
		SGNAtom.instances.instance = _this.create.prototype.sgnAtom;

		return _this.create.prototype;
	};

	/**
	 * Creates new instance of <b><i>SGNAtomNavigator</i></b> identified by element
	 *
	 * @param {HTMLElement|NodeList|string} [element="a,button,.clickable"] The element to use as navigator for <b><i>SGNAtom</i></b> supported by <b><i>SGNAtomNavigator</i></b>.
	 * @param {SGNAtomNavigatorOptions}[options={}] A <b><i>JSON</i></b> object of supported options to override default functionalities.
	 *
	 * @return {SGNAtom.create} An instance of <b><i>SGNAtom.create</i></b>.
	 */
	SGNAtom.create.prototype.with = function(element = "a,button,.clickable", options = {}) {
		const _this = this;

		if(!element instanceof HTMLElement && !element instanceof NodeList && typeof element !== "string") {
			throw new SGNAtomParameterError("Parameter 'element' must be either an instance of 'HTMLElement/NodeList' or a CSS representation string identifying the element.");
		}

		/**
		 *
		 * @type {SGNAtom}
		 */
		const sgnAtom = _this.sgnAtom;

		sgnAtom.setOnCoreReadyListener((isReady) => {
			if(isReady) {
				/**
				 * @type {SGNAtom.SGNAtomCore|SGNAtom}
				 */
				const sgnAtomCore = sgnAtom.core;
				options.elements = select(element, options.elements);
				sgnAtomCore.navigator = new sgnAtom.SGNAtomNavigator(sgnAtomCore, sgnAtomCore.guid, options);
			}
		});

		return _this;
	};

	/***
	 *
	 * @param {string} [guid]
	 *
	 * @return {Object<SGNAtom>}
	 */
	SGNAtom.getInstance = function(guid) {
		const instances = SGNAtom.instances;
		if(instances.hasOwnProperty(guid)) {
			return instances[guid];
		}
		return SGNAtom.instances;
	};

	if(!noGlobal) {
		if(typeof root !== "undefined") {
			root.SGNAtom = SGNAtom;
		} else {
			window.SGNAtom = SGNAtom;
		}
	}

	return SGNAtom;
})(root, (root !== window));
