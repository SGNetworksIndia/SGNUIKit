/*
 * Copyright (c) 2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict";

let empty;
if(!window.empty) {
	/**
	 *
	 * @param v The value to check
	 * @return {boolean}
	 */
	empty = (v) => {
		if(typeof v === "object")
			return (v.length <= 0);
		else
			return (v === undefined || v === null || v === "");
	};
} else
	empty = window.empty;

if(typeof HTMLElement.prototype.attr !== "function") {
	HTMLElement.prototype.attr = function(name, value) {
		if(value === undefined) {
			return this.getAttribute(name);
		} else
			this.setAttribute(name, value);
	};
}

if(typeof HTMLElement.prototype.fadeIn !== "function") {
	HTMLElement.prototype.fadeIn = function(speed, callback) {
		let _this = this;
		speed = (typeof speed !== "number") ? 2000 : speed;

		if(!_this.style.opacity) {
			_this.style.opacity = (speed > 0) ? 0 : 1;
		}

		if(speed > 0) {
			const inInterval = setInterval(function() {
				_this.style.opacity = Number(_this.style.opacity) + 0.02;
				if(_this.style.opacity >= 1) {
					clearInterval(inInterval);

					if(typeof callback === "function")
						callback(_this);
				}
			}, speed / 50);
		} else {
			if(typeof callback === "function")
				callback(_this);
		}
	};
}

if(typeof HTMLElement.prototype.fadeOut !== "function") {
	HTMLElement.prototype.fadeOut = function(speed, callback) {
		let _this = this;
		speed = (typeof speed !== "number") ? 2000 : speed;

		if(!_this.style.opacity) {
			_this.style.opacity = (speed > 0) ? 1 : 0;
		}

		if(speed > 0) {
			const outInterval = setInterval(function() {
				_this.style.opacity -= 0.02;
				if(_this.style.opacity <= 0) {
					clearInterval(outInterval);

					if(typeof callback === "function")
						callback(_this);
				}
			}, speed / 50);
		} else {
			if(typeof callback === "function")
				callback(_this);
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
	 * @param {string}url
	 * @param {{guid: string, title: string}}state
	 * @param {string}title
	 * @param {HistoryNodeObject}html
	 * @param {HistoryNodeObject}head
	 * @param {HistoryNodeObject}body
	 * @param {string}guid
	 */
	constructor(url, state, title, html, head, body, guid) {
		this.url = url;
		this.state = state;
		this.html = html;
		this.title = title;
		this.head = head;
		this.body = body;
		this.guid = guid;

		//this.prevNode = prevNode;
	}

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
		if(!historyObject instanceof HistoryObject)
			throw new SGNAtomParameterError("The parameter 'historyObject' must be an instance of 'HistoryObject'");

		const historyString = window.sessionStorage.getItem("HISTORY_STACK") || this.serialize();
		const stack = historyString ? HistoryStack.deserialize(historyString) : this;
		stack.length = this.#getLength(stack);
		this.setObject(stack, historyObject);
		window.sessionStorage.setItem("HISTORY_STACK", this.serialize());
		//console.log(this);

		return this;
	}

	/**
	 *
	 * @return {HistoryStack[string<HistoryObject>]} The deserialized <b>HistoryObject</b> instance.
	 */
	static deserialize(object) {
		const o = JSON.parse(object);
		let r = {};
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
			}
		}
		//console.log(Object.setPrototypeOf(r, HistoryStack.prototype));
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
		const url  = historyObject.url,
		      guid = historyObject.guid;

		if(historyStack.length > 0) {
			historyStack = this.mergeDuplicates(historyStack, url, guid);
			historyObject = this.searchByURL(historyStack, url) || historyObject;
			historyObject.guid = guid;
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
	 *
	 * @param {forEachCallback<?value: HistoryObject, ?index: string>}[callback] A function that forEach calls once for each element in the array.
	 */
	forEach(callback) {
		const stack = this;
		delete stack.length;
		for(let key in stack) {
			const element = stack[key];
			callback(element, key);
		}
	}

	/**
	 *
	 * @param {HistoryStack}[stack]
	 * @return {number}
	 */
	#getLength(stack) {
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

		if(end === undefined || end > obj.length)
			end = obj.length;

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
					if(!empty(guid))
						c.guid = guid;
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
 * Creates new instance of <b><i>SGNAtom</i></b> identified by element
 *
 * @param {HTMLElement|NodeList} elements The element to use as <b><i>SGNAtom</i></b> container.
 * @param {{core: {defaultPage: String}, navigator: {elements: HTMLElement|NodeList, resetHead: Boolean, interceptErrors: Boolean, showErrors: Boolean }}}[options] A <b><i>JSON</i></b> object of supported options to override default functionalities.

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

			if(isReady || (this.coreReady && this.navigatorReady))
				this.onReadyListener.forEach((listener) => listener(isReady));
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

			if(isReady)
				this.onCoreReadyListener.forEach((listener) => listener(isReady));
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

			if(isReady)
				this.onNavigatorReadyListener.forEach((listener) => listener(isReady));
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

			if(this.coreReady)
				this.onCoreReadyListener.forEach((listener) => listener(this.coreReady));
		},

		/**
		 *
		 * @param {SGNAtomStatesReadyCallback}listener
		 */
		setOnNavigatorReadyListener: function(listener) {
			this.onNavigatorReadyListener.push(listener);
			this.ready = (this.isCoreReady && this.navigatorReady);

			if(this.navigatorReady)
				this.onNavigatorReadyListener.forEach((listener) => listener(this.navigatorReady));
		},

		/**
		 *
		 * @param {SGNAtomStatesReadyCallback}listener
		 */
		setOnReadyListener: function(listener) {
			this.ready = (this.isCoreReady && this.navigatorReady);
			this.onReadyListener.push(listener);

			if(this.coreReady && this.navigatorReady)
				this.onReadyListener.forEach((listener) => listener(this.ready));
		},
	};

	plugin.name = "SGNAtom";
	plugin.settings = {
		"core": {
			"defaultPage": "",
		},
		"navigator": {
			"elements": "a, button",
			"resetHead": true,
			"showErrors": true,
			"interceptErrors": true
		},
	};
	plugin.settings = Object.assign(plugin.settings, options);
	plugin.SGNAtomStates = SGNAtomStates;
	SGNAtom.prototype.SGNAtomStates = SGNAtomStates;
	plugin.guid = undefined;

	/**
	 *
	 * @type {SGNAtom.SGNAtomCore}
	 * @type {SGNAtom.SGNAtomNavigator}
	 */

	const init = () => {
		if(!window.SGNUIKit) {
			/*document.onload = function() {
			 new plugin.SGNAtomCore(elements, plugin.settings);
			 }*/
			if(!SGNAtomStates.ready) {
				const core = new plugin.SGNAtomCore(elements, plugin, plugin.settings);
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
					const core = new plugin.SGNAtomCore(elements, plugin, plugin.settings);
					plugin.core = core;
					plugin.guid = plugin.GUID();
					SGNAtomStates.instance = plugin;
					SGNAtomStates.ready = core.isInitialized();
				}
			} else {
				if(!SGNAtomStates.ready) {
					window.SGNUIKit.setOnInitListener(() => {
						const core = new plugin.SGNAtomCore(elements, plugin, plugin.settings);
						plugin.core = core;
						plugin.guid = plugin.GUID();
						SGNAtomStates.instance = plugin;
						SGNAtomStates.ready = core.isInitialized();
					});
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
			if(hyphen && (j === 8 || j === 12 || j === 16 || j === 20))
				result = result + "-";
			i = Math.floor(Math.random() * 16).toString(16);
			i = (uppercase) ? i.toUpperCase() : i.toLowerCase();
			result = result + i;
		}
		return result;
	};

	plugin.getStack = (search = null) => {
		const regex = /^((\w+)?\.?(\w+))@(https?:\/\/[a-z\d-_]+\.?[a-z\d-_]+[^\s:"]+):(\d+):(\d+)$/;
		const errors = [];
		(new Error()).stack.split("\n").reverse().forEach((v, i) => {
			if(v !== "" && v.indexOf("SGNAtom/plugin.getStack") === -1) {
				const match = v.match(regex) || [6];
				let val = v;
				if(match !== null) {
					val = {
						"signature": match[1],
						"class": match[2],
						"function": match[3],
						"url": match[4],
						"line": match[5],
						"column": match[6],
					};
				}
				if(search !== undefined && search !== null) {
					if(v.indexOf(search) !== -1)
						errors.push(val);
				} else
					errors.push(val);
			}
		});
		if(search !== undefined && search !== null)
			return (errors.length > 0) ? errors[0] : null;
		else
			return errors;
	};

	plugin.isExistsOnStack = (search = null) => {
		const stack = plugin.getStack(search);
		return (stack !== null);
	};

	if(elements !== undefined && elements !== null)
		init();

	return plugin.prototype;
};
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
		this['length'] = this.instances['length'] = Object.keys(this.instances).length;

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

/**
 * Creates new instance of <b><i>SGNAtomCore</i></b> identified by element
 *
 * @param {HTMLElement|NodeList} elements The element to use as <b><i>SGNAtom</i></b> container.
 * @param {SGNAtom} sgnatom The instance of <b><i>SGNAtom</i></b>.
 * @param {{defaultPage: String}}[options] A <b><i>JSON</i></b> object of supported options to override default functionalities.

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
	plugin.options = _plugin.settings.core;
	if(typeof options === "object" && options.hasOwnProperty("core"))
		plugin.options = Object.assign(plugin.options, options.core);

	const init = () => {
		elements = (elements instanceof HTMLElement) ? [elements] : elements;
		const elems = document.querySelectorAll(options.navigator.elements) || document.querySelectorAll("a");
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
							const navOpt = options.navigator;
							const navigator = new SGNAtom.prototype.SGNAtomNavigator(elems, plugin, guid, navOpt);
							plugin.navigator = navigator;
							//SGNAtomCoreStates.isCoreReady = true;
							//navigator.load(home);
							navigator.setOnNavigatorReadyListener((isReady) => {
								//SGNAtomCoreStates.isCoreReady = (navigator.isInitialized());
								//SGNAtomCoreStates.ready = (SGNAtomCoreStates.isCoreReady && SGNAtomCoreStates.isNavigatorReady);
								//console.log(SGNAtomCoreStates, isReady);
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

	if(elements !== undefined && elements !== null)
		init();

	//return plugin.prototype.SGNAtomCore.prototype;
	sgnatom.core = plugin;

	return plugin;
};

/**
 * Creates new instance of <b><i>SGNAtomNavigator</i></b> identified by element
 *
 * @param {HTMLElement|NodeList} elements The element to use as <b><i>SGNAtom</i></b> container.
 * @param {SGNAtom.SGNAtomCore} sgnatomcore The instance of <b><i>SGNAtom</i></b>.
 * @param {string} instance_guid The <b><i>GUID</i></b> of the <b><i>SGNAtom</i></b> instance.
 * @param {{elements: HTMLElement|NodeList, resetHead: Boolean, interceptErrors: Boolean}}[options] A <b><i>JSON</i></b> object of supported options to override default functionalities.

 * @return {SGNAtom.SGNAtomNavigator|SGNAtom} An instance of <b><i>SGNAtom</i></b>.
 *
 * @constructor
 */
SGNAtom.prototype.SGNAtomNavigator = function(elements, sgnatomcore, instance_guid, options) {
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
	const rootHeadElements = Array.from(document.head.children);
	const dom = document;
	const forEach = (obj, callback) => {
		let value;
		//context = context || this;  //apply the function to 'this' by default

		for(const key in obj) {
			if(key !== 'length' && obj.hasOwnProperty(key)) {  //to rule out inherited properties
				value = obj[key];
				if(typeof callback === 'function')
					callback(value, key);
			}
		}
	}
	const push = (obj, ...items) => {
		let k = obj.length || 0;

		items.forEach((value, index) => {
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
		 * @param {(url:string, code:number)=>void} value The <b><i>JSON</i></b> object of the loaded <b>SGNUIKit</b> component.
		 */
		set onPageLoadListener(value) {
			if(value !== undefined && value !== null && value !== "") {
				push(this.onPageLoadListeners, value);
			}

			forEach(this.onChangeListener, listener => listener(value, this.onPageLoadListeners));
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
			if(typeof id !== 'string' || $.isNumeric(id))
				this.onChangeListener[id] = listener;
			else
				push(this.onChangeListener, listener);

			forEach(this.onChangeListener, (listener) => listener(null, this.onPageLoadListeners));
		},

		/**
		 * Set the handler for <b>SGNUIKit</b> <b><i>OnChange</i></b> event, which will be triggered when a component is loaded/removed or the status of readiness is changed.
		 *
		 * @param {(newInstance:{}, instances:{})=>void}listener
		 * @param {string|number}[id=undefined]
		 */
		setOnCreateListener: function(listener, id) {
			if(typeof id !== 'string' || $.isNumeric(id))
				this.onCreateListener[id] = listener;
			else
				push(this.onCreateListener, listener);

			SGNUIKit.setOnReadyListener(() => forEach(this.onCreateListener, (listener) => listener(this.onPageLoadListeners)), 'sgnan-create-listener');
		},
	};
	let defaultPageLoaded = false, previousLoadedPage = false, currentlyLoadingPage = false;

	plugin.name = pluginName;
	plugin.options = _plugin.settings.navigator;
	plugin.options = Object.assign(plugin.options, options);
	plugin.options.onPageLoadListener = [];
	plugin.instances = {};

	const init = () => {
		if(!window.SGNUIKit) {
			(() => {
				const style = printPreLoaderStyles();
				rootHeadElements.push(style);
			})();
		}

		_plugin.base_dir = getCurrentURLDir();

		let loaders = document.querySelector(".sgn-preloader");
		if(loaders === null || loaders.length < 1)
			printPreLoader(false);
		if(_plugin.defaultPage !== undefined && _plugin.defaultPage !== null && _plugin.defaultPage !== "")
			setTimeout(() => plugin.load(_plugin.defaultPage, null, false), 100);
		SGNAtomNavigatorStates.isNavigatorReady = true;
		window.addEventListener('offline', (e) => {
			console.log('offline');
			hidePreLoader();
			let msg = `Sorry! You are currently offline. You'll be able to access the application once your internet connection is restored.`;
			if(currentlyLoadingPage)
				msg = `Sorry! You are currently offline. You'll be able to access the application and the page <b>${currentlyLoadingPage}</b> will load once your internet connection is restored.`;
			const offlineErrorMsg = getI18nString('sgn_atom_error_user_offline_msg', msg);
			const offlineErrorHeading = getI18nString('txt_no_internet', `No Internet!`);

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
		window.addEventListener('online', (e) => {
			console.log('online');
			let msg = `Hooray! Your internet connection is restored, you'll now be able to access the application shortly.`;
			if(currentlyLoadingPage)
				msg = `Hooray! Your internet connection is restored, the page <b>${currentlyLoadingPage}</b> will load shortly.`;
			const onlineMsg = getI18nString('sgn_atom_user_online_msg', msg);
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
		//SGNAtomNavigatorStates.ready = (SGNAtomNavigatorStates.isCoreReady && SGNAtomNavigatorStates.isNavigatorReady);
	};

	const setupNavigator = (clickables, firstInit = false) => {
		clickables = (clickables instanceof HTMLElement) ? [clickables] : clickables;

		clickables.forEach((c) => {
			if(!c.hasOwnProperty(pluginName)) {
				c[pluginName] = _plugin;
				bindEvents(c);
				const guid = _plugin.GUID();
				plugin.guid = guid;
				c.attr("sgnatom-navigator-guid", guid);

				plugin.instances[guid] = c;
				/*const obj = SGNAtomNavigatorStates.instance;
				 obj[guid] = c;
				 SGNAtomNavigatorStates.instance = obj;*/
				if(firstInit) {
					SGNAtomNavigatorStates.isNavigatorReady = true;
					defaultPageLoaded = true;
					firstInit = false;
				}
			} else {
				throw new SGNAtomDOMError(`${pluginName} is already initialized`);
			}
		});
	};

	/**
	 *
	 * @param {string}guid
	 * @return {HistoryObject|undefined}
	 */
	const getHistoryObject = (guid) => {
		const stack = HistoryStack.deserialize(window.sessionStorage.getItem("HISTORY_STACK"));
		return (stack.hasOwnProperty(guid)) ? stack[guid] : undefined;
	};

	/**
	 *
	 * @param {HistoryObject}historyObject
	 * @return {HistoryStack[string<HistoryObject>]}
	 */
	const setHistoryStack = (historyObject) => {
		if(!historyObject instanceof HistoryObject)
			throw new SGNAtomParameterError("The parameter 'historyObject' must be an instance of 'HistoryObject'");

		const state = historyObject.state || {
			"title": historyObject.title,
			"guid": historyObject.guid,
		};

		const historyStack = new HistoryStack(historyObject);
		window.history.pushState(state, "", historyObject.url);

		window.sessionStorage.setItem("HISTORY_STACK", historyStack.serialize());
		return historyStack;
	};

	const bindEvents = (element) => {
		element.addEventListener("click", function(e) {
			e.preventDefault();
			const _this = this;
			const href = _this.attr("href");

			if(href !== undefined && href !== null && href !== "") {
				plugin.load(href);
			}
		}, false);

		window.onpopstate = function(e) {
			if(e.state) {
				const guid  = e.state.guid,
				      title = e.state.title;
				let historyObject = getHistoryObject(guid);
				const head = historyObject.head,
				      body = historyObject.body;
				//console.log(historyObject);

				showPreLoader(true, () => {
					if(plugin.options.resetHead) {
						//document.head.innerHTML = null;
						const headChildElems = document.head.children,
						      headElems      = Array.from(headChildElems);
						headElems.forEach((c) => {
							if(!isNodeExists(rootHeadElements, c) && c.nodeName !== "TITLE") {
								//console.log(c);
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
					document.title = title;
					const elems = document.querySelectorAll(plugin.options.elements);
					setupNavigator(elems);
					hidePreLoader();
				});
			}
		};
	};

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
				style.type = "text/css";
				style.id = "sgn-uikit-styles";
				if(style.styleSheet) {
					// This is required for IE8 and below.
					style.styleSheet.cssText = css;
				} else {
					style.appendChild(document.createTextNode(css));
				}
				r = style;
			})();
		}
		return r;
	};

	const printPreLoader = (hidden = true) => {
		let preloaderElem = document.createElement("div");
		preloaderElem.className = "sgn-preloader";
		if(hidden)
			preloaderElem.attr("style", "opacity: 0;");
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

					if(typeof callback === "function")
						callback();
				});
			} else {
				instance.fadeIn(0);
				loader.fadeOut(0, () => {
					loader.remove();
					document.body.classList.remove("has-preloader");

					if(typeof callback === "function")
						callback();
				});
			}
		}
	};

	const isNodeExists = (current, element) => {
		const data = Array.from(current);
		return data.some(obj => {
			return (obj.isEqualNode(element));
		});
	};

	/**
	 *
	 * @param {string}msg
	 * @param {"error"|"success"|"warning"|"info"}[type="error"]
	 *
	 * @return {HTMLElement}
	 */
	const showAlert = (msg, type = "error") => {
		let $div = document.createElement("div").attr("class", `sgn-atom-alert ${type}`);
		$div.innerHTML = msg;
		$div.addEventListener("click", (e) => {
			e.preventDefault();
			hideAlert($div);
		});
		instance.appendChild($div);

		$div.fadeIn(10000, () => hideAlert($div));

		return $div;
	};

	/**
	 *
	 * @param {HTMLElement}$alert
	 */
	const hideAlert = ($alert) => {
		$alert.remove();
	};

	/**
	 *
	 * @param {HTMLScriptElement}script
	 */
	const executeScript = (script) => {
		eval(script.innerHTML);
	};

	/**
	 *
	 * @param {HTMLScriptElement[]}scripts
	 */
	const executeScripts = (scripts) => {
		for(let n = 0; n < scripts.length; n++)
			executeScript(scripts[n]);
	};

	const getCurrentURLDir = () => {
		const urls     = new URL(document.URL),
		      origin   = `${urls.origin}/`,
		      location = window.location.pathname,
		      path     = location.substring(0, location.lastIndexOf("/"));

		const dir = path.substring(path.lastIndexOf("/") + 1);
		return `${origin}${dir}/`.replace(/([^:]\/)\/+/g, "$1");
	};

	const getPageFullURL = (url) => {
		const origin = window.location.origin;
		let urlPath = (url.indexOf(origin) !== -1) ? url.replace(origin, "") : url;
		const cUrlPath = (urlPath === _plugin.defaultPage) ? "/" : urlPath,
		      cUrl     = new URL(cUrlPath, origin).href;

		return (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) ? url : `${_plugin.base_dir}${url}`;
	};

	plugin.getNavigatorInstance = (guid) => {
		if(plugin.instances.length > 0 && plugin.instances.hasOwnProperty(guid)) {
			return plugin.instances[guid];
		}
		return undefined;
	};

	/***
	 *
	 * @param {function} onPageLoadListener
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
	 * @param {string} page
	 * @param {loadPageCallback} [callback]
	 * @param {boolean} [transitive=ture]
	 */
	plugin.load = (page, callback, transitive = true) => {
		if(page !== undefined && page !== null && page !== "") {
			currentlyLoadingPage = page;
			const url = getPageFullURL(currentlyLoadingPage);

			if(navigator.onLine) {
				showPreLoader(transitive, () => {
					let code     = 0,
					    response = undefined;
					//console.log(url);
					//showAlert(getI18nString('sgnatom_load_error_403', `Sorry! You don't have the rights to access the page.`));

					fetch(url, {
						credentials: "include",
						method: "GET", // or 'PUT'
						headers: {
							"Content-Type": "text/html",
						},
					}).then((r) => {
						response = r;
						code = response.status;

						if(plugin.options.interceptErrors) {
							if(!response.ok) {
								hidePreLoader();
								switch(code) {
									case 403:
										//showAlert(getI18nString('sgnatom_load_error_403', `Sorry! You don't have the rights to access the page.`));
										break;
									case 404:
										//window.alert(getI18nString('sgnatom_load_error_404', `Failed to load the page. The page couldn't be found.`));
										//console.log(response, response.status);
										//showAlert(getI18nString('sgnatom_load_error_404', `Failed to load the page. The page couldn't be found.`));
										break;
								}
								return;
							}
						}
						return response.text();
					}).then((data) => {
						if(typeof data !== 'undefined') {
							const parser = new DOMParser();

							// Parse the text
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

							const sgnatomScript = document.currentScript || document.querySelector("script[src*=\"SGNAtom.js\"]") || document.querySelector("script[src*=\"SGNAtom.min.js\"]");
							Array.from(head.children).forEach((item) => {
								if(!isNodeExists(rootHeadElements, item) && item.nodeName !== "TITLE") {
									document.head.append(item);
									newHeadElems.push(item);
								}
							});
							let headHTML = "";
							newHeadElems.forEach((c) => {
								headHTML += `${c.outerHTML}\n`;
							});

							const scripts = doc.querySelectorAll('script');
							if(scripts.length > 0) {
								scripts.forEach((script) => {
									if(!script.hasAttribute('src')) {
										//console.log(script);
										executeScript(script);
									}
								});
							}

							const srcs = doc.querySelectorAll('*[src], *[href]');
							if(srcs.length > 0) {
								srcs.forEach((el) => {
									if(el.hasAttribute('src')) {
										const src = el.getAttribute('src').replace(/([^:]\/)\/+/g, "$1");
										el.src = (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) ? src : `${_plugin.base_dir}${src}`;
									}
									if(el.hasAttribute('href')) {
										const src = el.getAttribute('href').replace(/([^:]\/)\/+/g, "$1");
										el.href = (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) ? src : `${_plugin.base_dir}${src}`;
									}
								});
							}

							document.title = (title !== undefined && title !== null) ? title.innerText : document.title;
							instance.innerHTML = body.innerHTML;

							const elems = document.querySelectorAll("a, button, .clickable");

							const historyObjectGUID = _plugin.GUID();
							const stateObj = {
								"title": document.title,
								"guid": historyObjectGUID,
							};
							const historyObject = new HistoryObject(cUrl, stateObj, document.title, new HistoryNodeObject([doc]), new HistoryNodeObject(newHeadElems), new HistoryNodeObject([body]), historyObjectGUID);
							const historyStack = setHistoryStack(historyObject);
							const historyStackObject = getHistoryObject(historyObjectGUID);

							setupNavigator(elems, !defaultPageLoaded);
							defaultPageLoaded = true;

							if(typeof callback === "function")
								callback(false, data);
						}
					}).catch((error) => {
						if(_plugin.debugMode) {
							console.error("Error:", error);
						}
						if(_plugin.showErrors) {
							showAlert("Failed to load the page!");
						}
						if(typeof callback === "function")
							callback(true, error);
					}).finally((e) => {
						switch(code) {
							case 200:
								previousLoadedPage = currentlyLoadingPage;
								currentlyLoadingPage = false;
								if(plugin.options.onPageLoadListener.length > 0) {
									plugin.options.onPageLoadListener.forEach(listener => listener(url, 200));
								}
								SGNANEventsListeners.setOnChangeListener((newListener, onPageLoadListeners) => {
									if(newListener !== null)
										newListener(url, 200);
								}, 'sgnatom-page-load-event-listener');
								break;
						}
						hidePreLoader();
					});
				});
			}
		}
	};

	plugin.isInitialized = () => {
		return SGNAtomNavigatorStates.isNavigatorReady;
	};

	if(!SGNAtomNavigatorStates.navigatorReady)
		init();

	sgnatomcore.navigator = plugin;

	return plugin;
};

/**
 * Creates new instance of <b><i>SGNAtom</i></b> identified by element
 *
 * @param {HTMLElement|NodeList|string} element The element to use as <b><i>SGNAtom</i></b> container.
 * @param {{core: {defaultPage: String}, navigator: {resetHead: Boolean, debugMode: Boolean, interceptErrors: Boolean, showErrors: Boolean}}}[options] A <b><i>JSON</i></b> object of supported options to override default functionalities.

 * @return {SGNAtom.create} An instance of <b><i>SGNAtom.create</i></b>.
 */
SGNAtom.create = function(element, options) {
	const _this = this;

	if(!element instanceof HTMLElement && !element instanceof NodeList && typeof element !== "string")
		throw new SGNAtomParameterError("Parameter 'element' must be either an instance of 'HTMLElement/NodeList' or a CSS representation string identifying the element.");

	// const elem = (element instanceof HTMLElement) ? element : document.querySelectorAll(element);
	const elem = (element instanceof HTMLElement) ? [element] :
	             (element instanceof NodeList) ? element :
	             document.querySelectorAll(element);

	_this.create.prototype.sgnAtom = new SGNAtom(elem, options);
	/*const guid = _this.create.prototype.sgnAtom.guid;
	 SGNAtom.instances[guid] = _this.create.prototype.sgnAtom;
	 SGNAtom.instances['length'] = Object.keys(SGNAtom.instances).length;*/
	SGNAtom.instances.instance = _this.create.prototype.sgnAtom;

	return _this.create.prototype;
};

/**
 * Creates new instance of <b><i>SGNAtomNavigator</i></b> identified by element
 *
 * @param {HTMLElement|NodeList|string} element The element to use as navigator for <b><i>SGNAtom</i></b> supported by <b><i>SGNAtomNavigator</i></b>.
 * @param {{resetHead: Boolean, debugMode: Boolean, interceptErrors: Boolean, showErrors: Boolean}}[options] A <b><i>JSON</i></b> object of supported options to override default functionalities.
 *
 * @return {SGNAtom.create} An instance of <b><i>SGNAtom.create</i></b>.
 */
SGNAtom.create.prototype.with = function(element, options) {
	const _this = this;

	if(!element instanceof HTMLElement && !element instanceof NodeList && typeof element !== "string")
		throw new SGNAtomParameterError("Parameter 'element' must be either an instance of 'HTMLElement/NodeList' or a CSS representation string identifying the element.");

	// const elem = (element instanceof HTMLElement) ? element : document.querySelectorAll(element);
	const elems = (element instanceof HTMLElement) ? [element] :
	              (element instanceof NodeList) ? element :
	              document.querySelectorAll(element);

	/**
	 *
	 * @type {SGNAtom}
	 */
	const sgnAtom = _this.sgnAtom;

	sgnAtom.setOnCoreReadyListener((isReady) => {
		if(isReady) {
			/**
			 *
			 * @type {SGNAtom.SGNAtomCore}
			 */
			const sgnAtomCore = sgnAtom.core;
			this.sgnAtomNavigator = new sgnAtom.SGNAtomNavigator(elems, sgnAtomCore, sgnAtomCore.guid, options);
		}
	});
	/*if(sgnAtom.isInitialized()) {
	 const sgnAtomCore = sgnAtom.getCoreInstance();
	 this.sgnAtomNavigator = new sgnAtom.SGNAtomNavigator(elems, sgnAtomCore, sgnAtomCore.guid, options);
	 }*/

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

window.SGNAtom = SGNAtom;
//export default SGNAtom;
