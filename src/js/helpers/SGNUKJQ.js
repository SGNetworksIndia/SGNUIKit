/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const jQueryShim = (typeof jQuery !== 'undefined') ? jQuery : undefined;
/*let $ = jQuery = (typeof jQueryShim !== 'undefined') ? jQueryShim : (q, c) => {
 return ($.version === 'SGNUK') ? $.init(q) : jQuery(q, c);
 };*/
if(typeof jQueryShim === 'undefined') {
	const Variables = {
		variables: {
			isReady: false,
			holdReady: false
		},

		onChangeListener: function() {},
		onReadyListener: function() {},

		set holdReady(val) {
			this.variables.holdReady = val;
			this.onChangeListener(this.variables);
		},
		get holdReady() {
			return this.variables.holdReady;
		},

		set ready(val) {
			this.variables.isReady = val;
			this.onChangeListener(this.variables);
			this.onReadyListener(val);
		},
		get ready() {
			return this.variables.isReady;
		},

		/**
		 * @return {{isReady: false, holdReady: false}} The Variables object
		 */
		setOnChangeListener: function(listener) {
			this.onChangeListener = listener;
		},

		setOnReadyListener: function(listener) {
			this.onReadyListener = listener;
		}
	};

	jQuery.name = 'SGNUKJQ';
	jQuery.version = 'SGNUK';

	jQuery.init = (q) => {
		if(typeof q == "function") {
			// wait for page to load
			//ready(q);
			$(document).ready(q);
		} else if(typeof q == "string") {
			// string is a selector, so retrieve it with querySelectorall
			return generateCollection(document.querySelectorAll(q));
		} else if(q.tagName) {
			// you could check the constructor.name for HTMLElement but elements will always have a tagName (like "button" or "a")
			return generateCollection([q]);
		} else if(q === document || q === window) {
			// you could check the constructor.name for HTMLElement but elements will always have a tagName (like "button" or "a")

			return generateCollection([q]);
			//return jQuery;
		}

		// noinspection JSUnusedLocalSymbols
		function ready(callback) {
			// noinspection JSUnresolvedVariable
			if(document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
				Variables.setOnChangeListener((v) => {
					if(!v.holdReady)
						callback();
				});
			} else {
				document.addEventListener('DOMContentLoaded', function() {
					Variables.setOnChangeListener((v) => {
						if(!v.holdReady)
							callback();
					});
				});
			}
		}
	}

	jQuery.holdReady = (hold = false) => {
		hold = (typeof hold === 'boolean') ? hold : false;
		Variables.holdReady = hold;
	}

	const addEventListener = (function() {
		if(document.addEventListener) {
			return function(element, event, handler) {
				element.addEventListener(event, handler, false);
			};
		} else {
			return function(element, event, handler) {
				// noinspection JSUnresolvedFunction
				element.attachEvent('on' + event, handler);
			};
		}
	}());

	// noinspection JSUnusedLocalSymbols
	const parse = (string) => {
		let div = document.createElement("div");
		div.innerHTML = string;
		return div.childNodes;
	}

	const generateCollection = (nodeList) => {
		const nodes = [...nodeList].map(node => new Node(node));
		let collection = new NodeCollection(nodes);
		collection = collection.generateCollection();

		return collection;
	}

	// noinspection JSUnresolvedVariable
	class Node {
		constructor(node) {
			this.node = node; // node should be an HTMLElement
		}

		prepend(nodes) {
			NodeCollection.isCollection(nodes) ? nodes.each((nodeClass) => this.node.prepend(nodeClass.node)) : this.node.prepend(nodes.node);
		}

		append(nodes) {
			NodeCollection.isCollection(nodes) ? nodes.each((nodeClass) => this.node.append(nodeClass.node)) : this.node.append(nodes.node);
		}

		text(value) {
			this.node.textContent = value;
		}

		css(property, value) {
			if(typeof property == "string") {
				if(!value) {
					let styles = window.getComputedStyle(this.node);
					return styles.getPropertyValue(property);
				} else {
					this.node.style[property] = value;
				}
			} else {
				Object.assign(this.node.style, property);
			}
		}

		on(type, callback) {
			Variables.setOnChangeListener((v) => {
				if(!v.holdReady)
					document.addEventListener(type, callback);
			});
		}

		ready(handler) {
			const _this = this,
				  _doc  = _this[0];
			if(_doc.attachEvent ? _doc.readyState === "complete" : _doc.readyState !== "loading") {
				//Variables.ready = true;
				/*if(typeof handler === 'function') {
					Variables.setOnChangeListener((v) => {
						if(!v.holdReady)
							handler(_this);
					});
				}*/
				//handler(_this);
			} else {
				/*_doc.addEventListener('DOMContentLoaded', (e) => {
					//Variables.ready = true;
					if(typeof handler === 'function') {
						Variables.setOnChangeListener((v) => {
							//console.log(handler, _doc, v);
							if(!v.holdReady)
								handler(e);
						});
					}
				});*/
				addEventListener(_doc, 'DOMContentLoaded', (e) => {
					//Variables.ready = true;
					if(typeof handler === 'function') {
						Variables.setOnChangeListener((v) => {
							//console.log(handler, _doc, v);
							if(!v.holdReady)
								handler(e);
						});
					}
				});
				//document.addEventListener('DOMContentLoaded', handler);
			}
		}
	}

	class NodeCollection {
		constructor(nodes) {
			/*this.nodes = nodes;
			return this.nodes.length <= 1 ? this.nodes.shift() : this;*/
			this.nodes = [];
			nodes.forEach(node => this.nodes.push(node.node));
			this.nodes = Object.assign({}, this.nodes);

			//this.nodes.prototype = Node.prototype;
			Object.setPrototypeOf(this.nodes, Node.prototype);

			return this;
		}

		static isCollection(nodes) {
			return nodes.constructor.name === "NodeCollection";
		}

		generateCollection() {
			return this.nodes;
		}

		each(callback) {
			this.nodes.forEach((node, index) => {
				callback(node, index);
			});
		}
	}

	//window.jQuery = undefined;
}

