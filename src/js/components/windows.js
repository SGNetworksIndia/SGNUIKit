/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict"; // Start of use strict
if(typeof jQuery === "undefined") {
	throw new Error("SGNModals requires jQuery");
}

(function(window, document, $) {
	"use strict";
	const metaTag = document.createElement("meta");
	metaTag.name = "viewport";
	metaTag.content = "user-scalable=0";
	document.getElementsByTagName("head")[0].appendChild(metaTag);

	const SGNWindow = function($elem) {
		const plugin = this;
		let $this = $elem;
		let $windowDock     = $(".sgn-window-dock"),
		    $windowTitleBar = $this.children(".title-bar"),
		    $windowBody     = $this.children(".window-body"),
		    $windowFooter   = $this.children(".window-footer");
		let minW = 0, minH = 0, currentWindowWidth = 0, currentWindowHeight = 0, $container, guid;

		const GUID = str => {
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
		};

		/***
		 *
		 * @param {jQuery} $elem
		 * @param {('left'|'top'|'right'|'bottom','x'|'y')} which
		 * @param {boolean} combined
		 * @returns {number}
		 */
		const getPadding = ($elem, which, combined = false) => {
			const pl = parseFloat($elem.css("padding-left")),
			      pr = parseFloat($elem.css("padding-right")),
			      pt = parseFloat($elem.css("padding-top")),
			      pb = parseFloat($elem.css("padding-bottom")),
			      p  = parseFloat($elem.css("padding"));
			const px = (combined) ? (pl + pr) : pl | pr,
			      py = (combined) ? (pt + pb) : pt | pb;

			if(which === "left")
				return pl;
			else if(which === "right")
				return pr;
			else if(which === "top")
				return pt;
			else if(which === "bottom")
				return pb;
			else if(which === "x" || which === "horizontal")
				return px | (p / 2);
			else if(which === "y" || which === "vertical")
				return py | (p / 2);
			else
				return p;
		};

		/***
		 *
		 * @param {jQuery} $elem
		 * @param {('left'|'top'|'right'|'bottom','x'|'y')} which
		 * @param {boolean} combined
		 * @returns {number}
		 */
		const getMargin = ($elem, which, combined = false) => {
			const ml = parseFloat($elem.css("margin-left")),
			      mr = parseFloat($elem.css("margin-right")),
			      mt = parseFloat($elem.css("margin-top")),
			      mb = parseFloat($elem.css("margin-bottom")),
			      m  = parseFloat($elem.css("margin"));
			const mx = (combined) ? (ml + mr) : ml | mr,
			      my = (combined) ? (mt + mb) : mt | mb;

			if(which === "left")
				return ml;
			else if(which === "right")
				return mr;
			else if(which === "top")
				return mt;
			else if(which === "bottom")
				return mb;
			else if(which === "x" || which === "horizontal")
				return mx | (m / 2);
			else if(which === "y" || which === "vertical")
				return my | (m / 2);
			else
				return m;
		};
		const getCombinedPadding = ($elem) => ($elem.innerWidth() - $elem.width());
		const getCombinedMargin = ($elem) => ($elem.outerWidth(true) - $elem.outerWidth());
		const getCombinedBorder = ($elem) => ($elem.outerWidth() - $elem.innerWidth());
		const getOffset = ($elem) => (getCombinedPadding($elem) + getCombinedMargin($elem) + getCombinedBorder($elem));
		const getWidth = ($elem) => ($elem.width() + getOffset($elem));
		const getHeight = ($elem) => ($elem.height() + getOffset($elem));

		const init = () => {
			let $windowTitle   = $windowTitleBar.children(".window-title"),
			    $windowActions = $windowTitleBar.children(".window-actions");
			let $closeBtn      = $windowActions.children(".sgn-window-closeBtn"),
			    $fullscreenBtn = $windowActions.children(".sgn-window-fullscreenBtn"),
			    $maximizeBtn   = $windowActions.children(".sgn-window-maximizeBtn"),
			    $minimizeBtn   = $windowActions.children(".sgn-window-minimizeBtn");
			const windowTitle = $this.attr("title") || "Window Title";

			const closeBtnHTML      = `<a class="sgn-window-action-btn sgn-window-closeBtn" title="Close"><i class="sgn-window-action-icon"></i></a>`,
			      fullscreenBtnHTML = `<a class="sgn-window-action-btn sgn-window-fullscreenBtn" title="Fullscreen"><i class="sgn-window-action-icon"></i></a>`,
			      maximizeBtnHTML   = `<a class="sgn-window-action-btn sgn-window-maximizeBtn" title="Maximize"><i class="sgn-window-action-icon"></i></a>`,
			      minimizeBtnHTML   = `<a class="sgn-window-action-btn sgn-window-minimizeBtn" title="Minimize"><i class="sgn-window-action-icon"></i></a>`;
			const windowDockHTML     = `<div class="sgn-window-dock"></div>`,
			      windowTitleHTML    = `<div class="window-title">${windowTitle}</div>`,
			      windowActionsHTML  = `<div class="window-actions">${minimizeBtnHTML}${maximizeBtnHTML}${fullscreenBtnHTML}${closeBtnHTML}</div>`,
			      windowTitleBarHTML = `<div class="title-bar">${windowTitleHTML}${windowActionsHTML}</div>`;
			guid = "sgn-window-" + GUID();

			if($windowDock.length < 1) {
				const $body = $("body");
				$body.append(windowDockHTML);
				$windowDock = $body.children(".sgn-window-dock");
			}
			$windowDock.hide();

			if($windowTitleBar.length === 1) {
				if($windowActions.length === 1) {
					if($minimizeBtn.length < 1) {
						$windowActions.prepend(minimizeBtnHTML);
						$minimizeBtn = $windowActions.children(".sgn-window-minimizeBtn");
					}
					if($maximizeBtn.length < 1) {
						if($minimizeBtn.length === 1) {
							$minimizeBtn.after(maximizeBtnHTML);
							$maximizeBtn = $windowActions.children(".sgn-window-maximizeBtn");
						}
					}
					if($fullscreenBtn.length < 1) {
						if($maximizeBtn.length === 1) {
							$maximizeBtn.after(fullscreenBtnHTML);
							$fullscreenBtn = $windowActions.children(".sgn-window-fullscreenBtn");
						}
					}
					if($closeBtn.length < 1) {
						$windowActions.append(closeBtnHTML);
						$closeBtn = $windowActions.children(".sgn-window-closeBtn");
					}
				} else {
					$windowTitleBar.append(windowActionsHTML);
					$windowActions = $windowTitleBar.children(".window-actions");
					$minimizeBtn = $windowActions.children(".sgn-window-minimizeBtn");
					$maximizeBtn = $windowActions.children(".sgn-window-maximizeBtn");
					$fullscreenBtn = $windowActions.children(".sgn-window-fullscreenBtn");
					$closeBtn = $windowActions.children(".sgn-window-closeBtn");
				}
				if($windowTitle.length < 1) {
					$windowTitleBar.prepend(windowTitleHTML);
					$windowTitle = $windowTitleBar.children(".window-title");
				}
			} else {
				$this.prepend(windowTitleBarHTML);
				$windowTitleBar = $this.children(".title-bar");
				$windowActions = $windowTitleBar.children(".window-actions");
				$minimizeBtn = $windowActions.children(".sgn-window-minimizeBtn");
				$maximizeBtn = $windowActions.children(".sgn-window-maximizeBtn");
				$fullscreenBtn = $windowActions.children(".sgn-window-fullscreenBtn");
				$closeBtn = $windowActions.children(".sgn-window-closeBtn");
			}

			$this.addClass("sgn-window-draggable sgn-window-resizable");

			const windowTitleBarPadding = getCombinedPadding($windowTitleBar),
			      windowTitleBarOffset  = getOffset($windowTitleBar),
			      windowTitleBarHeight  = getHeight($windowTitleBar),
			      windowTitleWidth      = getWidth($windowTitle),
			      windowActionsWidth    = getWidth($windowActions);

			minW = (windowTitleWidth + windowActionsWidth + windowTitleBarOffset + getPadding($windowTitleBar, "x"));
			minH = windowTitleBarHeight; //60px

			if(empty($this.attr("id")))
				$this.attr("id", guid);
			guid = $this.attr("id");

			initControls($minimizeBtn, $maximizeBtn, $fullscreenBtn, $closeBtn);
			makeDraggable();
			makeResizable(minW, minH);

			$this.data("SGNWindow", plugin);
		};

		/***
		 *
		 * @param {jQuery} $minimizeBtn
		 * @param {jQuery} $maximizeBtn
		 * @param {jQuery} $fullscreenBtn
		 * @param {jQuery} $closeBtn
		 */
		const initControls = ($minimizeBtn, $maximizeBtn, $fullscreenBtn, $closeBtn) => {
			$windowTitleBar.on("click", (e) => {
				e.preventDefault();

				if($this.hasClass("minimized")) {
					plugin.restore();
				}
			});

			$minimizeBtn.on("click", (e) => {
				e.preventDefault();

				if(!$this.hasClass("minimized")) {
					plugin.minimize();
				}
			});

			$maximizeBtn.on("click", (e) => {
				e.preventDefault();

				if(!$this.hasClass("maximized")) {
					plugin.maximize();
				} else {
					plugin.compress();
				}
			});

			$fullscreenBtn.on("click", (e) => {
				e.preventDefault();

				plugin.toggleFullscreen();
			});

			$closeBtn.on("click", (e) => {
				e.preventDefault();
				plugin.close();
			});

			$windowTitleBar.off("click");
		};

		const makeResizable = (minW = 100, minH = 100, size = 20) => {
			const element = $this[0];
			const step = -(size / 2),
			      maxW = $(window).width(),
			      maxH = $(window).height();
			const r_css   = {
				      "backgroundColor": "transparent",
				      "position": "absolute",
			      },
			      cr_css  = {
				      "width": `${size}px`,
				      "height": `${size}px`,
				      "backgroundColor": "transparent",
				      "position": "absolute",
			      },
			      er_css  = $.extend({}, r_css, {"width": `${size}px`, "height": "100%", "cursor": "e-resize", "top": "0"}),
			      nr_css  = $.extend({}, r_css, {"width": "100%", "height": `${size}px`, "cursor": "n-resize", "left": "0"}),
			      nwr_css = $.extend({}, cr_css, {"cursor": "nw-resize"}),
			      ner_css = $.extend({}, cr_css, {"cursor": "ne-resize"}),
			      swr_css = $.extend({}, cr_css, {"cursor": "sw-resize"}),
			      ser_css = $.extend({}, cr_css, {"cursor": "se-resize"});

			const $left     = $("<div/>").addClass("sgn-window-resizer-handle handle-left").css(er_css).css("left", `${step}px`),
			      $right    = $("<div/>").addClass("sgn-window-resizer-handle handle-right").css(er_css).css("right", `${step}px`),
			      $top      = $("<div/>").addClass("sgn-window-resizer-handle handle-top").css(nr_css).css("top", `${step}px`),
			      $bottom   = $("<div/>").addClass("sgn-window-resizer-handle handle-bottom").css(nr_css).css("bottom", `${step}px`),
			      $cornerNW = $("<div/>").addClass("sgn-window-resizer-handle handle-top_left").css(nwr_css).css({"top": `${step}px`, "left": `${step}px`}),
			      $cornerNE = $("<div/>").addClass("sgn-window-resizer-handle handle-top_right").css(ner_css).css({"top": `${step}px`, "right": `${step}px`}),
			      $cornerSW = $("<div/>").addClass("sgn-window-resizer-handle handle-bottom_left").css(swr_css).css({"bottom": `${step}px`, "left": `${step}px`}),
			      $cornerSE = $("<div/>").addClass("sgn-window-resizer-handle handle-bottom_right").css(ser_css).css({"bottom": `${step}px`, "right": `${step}px`});

			$left.on("mousedown", resizeXNegative());
			$right.on("mousedown", resizeXPositive());
			$top.on("mousedown", resizeYNegative());
			$bottom.on("mousedown", resizeYPositive());
			$cornerNW.on("mousedown", resizeXNegative());
			$cornerNW.on("mousedown", resizeYNegative());
			$cornerNE.on("mousedown", resizeXPositive());
			$cornerNE.on("mousedown", resizeYNegative());
			$cornerSW.on("mousedown", resizeXNegative());
			$cornerSW.on("mousedown", resizeYPositive());
			$cornerSE.on("mousedown", resizeXPositive());
			$cornerSE.on("mousedown", resizeYPositive());

			$this.append($left);
			$this.append($right);
			$this.append($top);
			$this.append($bottom);
			$this.append($cornerNW);
			$this.append($cornerNE);
			$this.append($cornerSW);
			$this.append($cornerSE);

			/*const top = document.createElement("div");
			 top.style.width = "100%";
			 top.style.height = size + "px";
			 top.style.backgroundColor = "transparent";
			 top.style.position = "absolute";
			 top.style.top = -(size / 2) + "px";
			 top.style.left = "0px";
			 top.style.cursor = "n-resize";

			 top.addEventListener("mousedown", resizeYNegative());

			 element.appendChild(top);

			 const bottom = document.createElement("div");
			 bottom.style.width = "100%";
			 bottom.style.height = size + "px";
			 bottom.style.backgroundColor = "transparent";
			 bottom.style.position = "absolute";
			 bottom.style.bottom = -(size / 2) + "px";
			 bottom.style.left = "0px";
			 bottom.style.cursor = "n-resize";

			 bottom.addEventListener("mousedown", resizeYPositive());

			 element.appendChild(bottom);

			 const left = document.createElement("div");
			 left.style.width = size + "px";
			 left.style.height = "100%";
			 left.style.backgroundColor = "transparent";
			 left.style.position = "absolute";
			 left.style.top = "0px";
			 left.style.left = -(size / 2) + "px";
			 left.style.cursor = "e-resize";

			 left.addEventListener("mousedown", resizeXNegative());

			 element.appendChild(left);

			 const right = document.createElement("div");
			 right.style.width = size + "px";
			 right.style.height = "100%";
			 right.style.backgroundColor = "transparent";
			 right.style.position = "absolute";
			 right.style.top = "0px";
			 right.style.right = -(size / 2) + "px";
			 right.style.cursor = "e-resize";

			 right.addEventListener("mousedown", resizeXPositive());

			 element.appendChild(right);


			 const corner1 = document.createElement("div");
			 corner1.style.width = size + "px";
			 corner1.style.height = size + "px";
			 corner1.style.backgroundColor = "transparent";
			 corner1.style.position = "absolute";
			 corner1.style.top = -(size / 2) + "px";
			 corner1.style.left = -(size / 2) + "px";
			 corner1.style.cursor = "nw-resize";

			 corner1.addEventListener("mousedown", resizeXNegative());
			 corner1.addEventListener("mousedown", resizeYNegative());

			 element.appendChild(corner1);

			 const corner2 = document.createElement("div");
			 corner2.style.width = size + "px";
			 corner2.style.height = size + "px";
			 corner2.style.backgroundColor = "transparent";
			 corner2.style.position = "absolute";
			 corner2.style.top = -(size / 2) + "px";
			 corner2.style.right = -(size / 2) + "px";
			 corner2.style.cursor = "ne-resize";

			 corner2.addEventListener("mousedown", resizeXPositive());
			 corner2.addEventListener("mousedown", resizeYNegative());

			 element.appendChild(corner2);

			 const corner3 = document.createElement("div");
			 corner3.style.width = size + "px";
			 corner3.style.height = size + "px";
			 corner3.style.backgroundColor = "transparent";
			 corner3.style.position = "absolute";
			 corner3.style.bottom = -(size / 2) + "px";
			 corner3.style.left = -(size / 2) + "px";
			 corner3.style.cursor = "sw-resize";

			 corner3.addEventListener("mousedown", resizeXNegative());
			 corner3.addEventListener("mousedown", resizeYPositive());

			 element.appendChild(corner3);

			 const corner4 = document.createElement("div");
			 corner4.style.width = size + "px";
			 corner4.style.height = size + "px";
			 corner4.style.backgroundColor = "transparent";
			 corner4.style.position = "absolute";
			 corner4.style.bottom = -(size / 2) + "px";
			 corner4.style.right = -(size / 2) + "px";
			 corner4.style.cursor = "se-resize";

			 corner4.addEventListener("mousedown", resizeXPositive());
			 corner4.addEventListener("mousedown", resizeYPositive());

			 element.appendChild(corner4);*/

			const get_int_style = key => parseInt(window.getComputedStyle(element).getPropertyValue(key));

			function resizeXPositive() {
				let offsetX;

				function dragMouseDown(e) {
					if(e.button !== 0) return;
					e = e || window.event;
					e.preventDefault();
					const {clientX} = e;
					offsetX = clientX - element.offsetLeft - get_int_style("width");
					document.addEventListener("mouseup", closeDragElement);
					document.addEventListener("mousemove", elementDrag);
				}

				function elementDrag(e) {
					const {clientX} = e;
					let x = clientX - element.offsetLeft - offsetX;
					if(x < minW) x = minW;
					else if(x > maxW) x = maxW;
					element.style.width = x + "px";
				}

				function closeDragElement() {
					if(!$this.hasClass("resized-x"))
						$this.addClass("resized-x");

					document.removeEventListener("mouseup", closeDragElement);
					document.removeEventListener("mousemove", elementDrag);
				}

				return dragMouseDown;
			}

			function resizeYPositive() {
				let offsetY;

				function dragMouseDown(e) {
					if(e.button !== 0) return;
					e = e || window.event;
					e.preventDefault();
					const {clientY} = e;
					offsetY = clientY - element.offsetTop - get_int_style("height");

					document.addEventListener("mouseup", closeDragElement);
					document.addEventListener("mousemove", elementDrag);
				}

				function elementDrag(e) {
					const {clientY} = e;
					let y = clientY - element.offsetTop - offsetY;
					if(y < minH) y = minH;
					element.style.height = y + "px";
				}

				function closeDragElement() {
					if(!$this.hasClass("resized-y"))
						$this.addClass("resized-y");

					document.removeEventListener("mouseup", closeDragElement);
					document.removeEventListener("mousemove", elementDrag);
				}

				return dragMouseDown;
			}

			function resizeXNegative() {
				let offsetX;
				let startX;
				let startW;
				let maxX;

				function dragMouseDown(e) {
					if(e.button !== 0) return;
					e = e || window.event;
					e.preventDefault();
					const {clientX} = e;
					startX = get_int_style("left");
					startW = get_int_style("width");
					offsetX = clientX - startX;
					maxX = startX + startW - minW;

					document.addEventListener("mouseup", closeDragElement);
					document.addEventListener("mousemove", elementDrag);
				}

				function elementDrag(e) {
					const {clientX} = e;
					let x = clientX - offsetX;
					let w = startW + startX - x;
					if(w < minW) w = minW;
					if(x > maxX) x = maxX;
					element.style.left = x + "px";
					element.style.width = w + "px";
				}

				function closeDragElement() {
					if(!$this.hasClass("resized-x"))
						$this.addClass("resized-x");

					document.removeEventListener("mouseup", closeDragElement);
					document.removeEventListener("mousemove", elementDrag);
				}

				return dragMouseDown;
			}

			function resizeYNegative() {
				let offsetY;
				let startY;
				let startH;
				let maxY;

				function dragMouseDown(e) {
					if(e.button !== 0) return;
					e = e || window.event;
					e.preventDefault();
					const {clientY} = e;
					startY = get_int_style("top");
					startH = get_int_style("height");
					offsetY = clientY - startY;
					maxY = startY + startH - minH;

					document.addEventListener("mouseup", closeDragElement, false);
					document.addEventListener("mousemove", elementDrag, false);
				}

				function elementDrag(e) {
					const {clientY} = e;
					let y = clientY - offsetY;
					let h = startH + startY - y;
					if(h < minH) h = minH;
					if(y > maxY) y = maxY;
					element.style.top = y + "px";
					element.style.height = h + "px";
				}

				function closeDragElement() {
					if(!$this.hasClass("resized-y"))
						$this.addClass("resized-y");

					document.removeEventListener("mouseup", closeDragElement);
					document.removeEventListener("mousemove", elementDrag);
				}

				return dragMouseDown;
			}
		};

		const makeDraggable = () => {
			const elmnt = $this[0];
			const boundsX = ($(window).width() - $this.width());
			let pos1touch, pos2touch, pos3touch, pos4touch;
			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
			const $windowHeader = $this.children(".title-bar");

			if("ontouchstart" in document.documentElement) {
				pos1touch = 0;
				pos2touch = 0;
				pos3touch = 0;
				pos4touch = 0;
			}
			if($windowHeader.length > 0) {
				$windowHeader.on("mousedown", onDragMouseDown);
				$windowHeader.on("touchstart", onDragMouseDown);
			}

			function onDragMouseDown(e) {
				if(!"ontouchstart" in document.documentElement) {
					e.preventDefault();
				}
				pos3 = e.clientX;
				pos4 = e.clientY;
				if("ontouchstart" in document.documentElement) {
					try {
						pos3touch = e.touches[0].clientX;
						pos4touch = e.touches[0].clientY;
					} catch(error) {}
				}
				document.onmouseup = closeDragElement;
				document.onmousemove = elementDrag;
				document.ontouchend = closeDragElement;
				document.ontouchmove = elementDrag;
				//activeWindow($this);
			}

			function elementDrag(e) {
				e.preventDefault();
				if("ontouchstart" in document.documentElement) {
					pos1touch = pos3touch - e.touches[0].clientX;
					pos2touch = pos4touch - e.touches[0].clientY;
					pos3touch = e.touches[0].clientX;
					pos4touch = e.touches[0].clientY;
					elmnt.style.top = (elmnt.offsetTop - pos2touch) + "px";
					elmnt.style.left = (elmnt.offsetLeft - pos1touch) + "px";
				} else {
					pos1 = pos3 - e.clientX;
					pos2 = pos4 - e.clientY;
					pos3 = e.clientX;
					pos4 = e.clientY;

					const posX = (elmnt.offsetLeft - pos1),
					      posY = (elmnt.offsetTop - pos2);


					if(posX >= 0 && posY >= 0) {
						if(posX < boundsX)
							elmnt.style.left = `${posX}px`;
						elmnt.style.top = `${posY}px`;
					} else {

					}
				}
			}

			function closeDragElement() {
				document.onmouseup = null;
				document.onmousemove = null;
				document.ontouchend = null;
				document.ontouchmove = null;
			}
		};

		plugin.minimize = () => {
			const $windowActions     = $windowTitleBar.children(".window-actions"),
			      windowActionsWidth = getWidth($windowActions);
			const $windowTitle     = $windowTitleBar.children(".window-title"),
			      windowTitleWidth = getWidth($windowTitle);
			currentWindowWidth = $this.width();
			currentWindowHeight = $this.height();
			$container = $this.parent();

			if($this.hasClass("sgn-window-resizable")) {
				$windowActions.fadeOut(() => $windowActions.hide());
				$this.animate({height: (minH - (8 * 2)), width: (minW - (windowActionsWidth - (8 * 2)))}, 200);
			} else {
				if($windowFooter.length > 0) {
					$windowFooter.toggle(() => $windowBody.toggle());
				} else {
					$windowBody.toggle();
				}
			}

			setTimeout(() => {
				$this.addClass("minimized");

				const windowTitleBarPadding = getCombinedPadding($windowTitleBar),
				      windowTitleBarOffset  = getOffset($windowTitleBar),
				      windowTitleBarHeight  = getHeight($windowTitleBar),
				      w                     = (windowTitleWidth + windowTitleBarOffset);

				$this.animate({width: w}, 200);

				$this.detach().appendTo(".sgn-window-dock");
				$this = $windowDock.find(`#${guid}`);
				$windowDock.fadeIn();
				$windowTitleBar.on("click");
			}, 200);
		};

		plugin.restore = () => {
			$windowTitleBar.off("click");
			$this.detach().appendTo($container);
			$this = $container.find(`#${guid}`);

			$windowTitleBar = $this.children(".title-bar");
			const $windowActions     = $windowTitleBar.children(".window-actions"),
			      windowActionsWidth = getWidth($windowActions);

			if($windowDock.children(".sgn-window").length < 1)
				$windowDock.fadeOut();

			if($this.hasClass("sgn-window-resizable")) {
				$this.animate({height: currentWindowHeight, width: currentWindowWidth}, 200);
				setTimeout(() => {
					$windowActions.show();
					$windowActions.fadeIn();
				}, 200);
			} else {
				if($windowFooter.length > 0) {
					$windowBody.toggle(() => {
						$windowFooter.toggle(() => {
							$this.width(currentWindowWidth);
							$this.height(currentWindowHeight);
							$windowTitleBar.off("click");
						});
					});
				} else {
					$windowBody.toggle(() => {
						$this.width(currentWindowWidth);
						$this.height(currentWindowHeight);
						$windowTitleBar.off("click");
					});
				}
			}

			$this.removeClass("minimized");
		};

		plugin.maximize = () => {
			$this.addClass("maximized");
		};

		plugin.compress = () => {
			$this.removeClass("maximized fullscreen");
		};

		plugin.toggleFullscreen = () => {
			const $windowTitle   = $windowTitleBar.children(".window-title"),
			      $windowActions = $windowTitleBar.children(".window-actions");
			const $closeBtn      = $windowActions.children(".sgn-window-closeBtn"),
			      $fullscreenBtn = $windowActions.children(".sgn-window-fullscreenBtn"),
			      $maximizeBtn   = $windowActions.children(".sgn-window-maximizeBtn"),
			      $minimizeBtn   = $windowActions.children(".sgn-window-minimizeBtn");
			const elem                  = $this[0],
			      windowTitleBarPadding = getPadding($windowTitleBar, "x"),
			      windowTitleBarHeight  = getHeight($windowTitleBar);
			let timeout;

			if(!document.fullscreenElement) {
				elem.requestFullscreen().then(r => {
					$closeBtn.hide();
					$maximizeBtn.hide();
					$minimizeBtn.hide();

					$this.addClass("fullscreen");

					let titleBar = true;
					$(window).on("mouseover touchstart", (e) => {
						const clientY = e.clientY;

						if(clientY < windowTitleBarHeight) {
							e.stopPropagation();
							clearTimeout(timeout);
							if(!titleBar) {
								$windowTitleBar.show();
								$windowTitleBar.animate({height: `${windowTitleBarHeight}px`, padding: `${windowTitleBarPadding}px`}, 500);
								titleBar = true;
							}
						} else {
							if(titleBar) {
								timeout = setTimeout(() => $windowTitleBar.animate({height: "0px", padding: "0px"}, 500, () => $windowTitleBar.fadeOut(100)), 2000);
								titleBar = false;
							}
						}
					});
				}).catch(e => alert(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`));
			} else {
				clearTimeout(timeout);
				$(window).off("mouseover touchstart");
				$windowTitleBar.show().animate({height: `${windowTitleBarHeight}px`, padding: `${windowTitleBarPadding}px`}, 500);
				$windowTitleBar.removeAttr("style");

				document.exitFullscreen().then(r => {
					$closeBtn.show();
					$maximizeBtn.show();
					$minimizeBtn.show();

					$this.removeClass("fullscreen");
				});
			}
		};

		plugin.open = () => {
			if($this.hasClass("closed"))
				$this.toggle(() => $this.removeClass("closed"));
		};

		plugin.close = () => {
			if(!$this.hasClass("closed"))
				$this.toggle(() => $this.addClass("closed"));
		};

		plugin.toggleWindow = () => {
			if(!$this.hasClass("closed"))
				plugin.close();
			else
				plugin.open();
		};

		plugin.remove = () => $this.toggle(() => $this.remove());

		if($this.data("SGNWindow") === undefined)
			init();
	};

	$.fn.SGNWindow = function() {
		const _this = this;
		const $this = $(_this);

		const init = () => new SGNWindow($this);

		/***
		 * Minimize the currently selected <b><i>SGNWindow</b> instance</i>.
		 *
		 * @returns {jQuery.SGNWindow}
		 */
		this.minimize = function() {
			const plugin = $(this).data("SGNWindow");
			if(plugin !== undefined)
				plugin.minimize();

			return this;
		};

		/***
		 * Restore the currently selected <b><i>SGNWindow</b> instance</i>.
		 *
		 * @returns {jQuery.SGNWindow}
		 */
		this.restore = function() {
			const plugin = $(this).data("SGNWindow");
			if(plugin !== undefined)
				plugin.restore();

			return this;
		};

		/***
		 * Maximize the currently selected <b><i>SGNWindow</b> instance</i>.
		 *
		 * @returns {jQuery.SGNWindow}
		 */
		this.maximize = function() {
			const plugin = $(this).data("SGNWindow");
			if(plugin !== undefined)
				plugin.maximize();

			return this;
		};

		/***
		 * Restore down to default window mode for the currently selected <b><i>SGNWindow</b> instance</i>.
		 *
		 * @returns {jQuery.SGNWindow}
		 */
		this.compress = function() {
			const plugin = $(this).data("SGNWindow");
			if(plugin !== undefined)
				plugin.compress();

			return this;
		};

		/***
		 * Toggle full-screen mode of the currently selected <b><i>SGNWindow</b> instance</i>.
		 *
		 * @returns {jQuery.SGNWindow}
		 */
		this.toggleFullscreen = function() {
			const plugin = $(this).data("SGNWindow");
			if(plugin !== undefined)
				plugin.toggleFullscreen();

			return this;
		};

		/***
		 * Open the currently selected <b><i>SGNWindow</b> instance</i>.
		 *
		 * @returns {jQuery.SGNWindow}
		 */
		this.open = function() {
			const plugin = $(this).data("SGNWindow");
			if(plugin !== undefined)
				plugin.open();

			return this;
		};

		/***
		 * Close the currently selected <b><i>SGNWindow</b> instance</i>.
		 *
		 * @returns {jQuery.SGNWindow}
		 */
		this.close = function() {
			const plugin = $(this).data("SGNWindow");
			if(plugin !== undefined)
				plugin.close();

			return this;
		};

		/***
		 * Toggle between open/close operations of the currently selected <b><i>SGNWindow</b> instance</i>.
		 *
		 * @returns {jQuery.SGNWindow}
		 */
		this.toggleWindow = function() {
			const plugin = $(this).data("SGNWindow");
			if(plugin !== undefined)
				plugin.toggleWindow();

			return this;
		};

		if($this.data("SGNWindow") === undefined)
			init();

		return this;
	};

	SUKR(() => {
		const $windowToggles = $("[sgn-window], [data-sgn-window], [data-window]");
		const $windows = $(".sgn-window");

		if($windows.length > 0) {
			$windows.each(function() {
				const $this = $(this);
				$this.SGNWindow();
			});
		}

		if($windowToggles.length > 0) {
			$windowToggles.each(function() {
				$(this).on("click", function(e) {
					e.preventDefault();

					const $this   = $(this),
					      target  = select($this.attr("sgn-window"), $this.attr("data-sgn-window"), $this.attr("data-window")),
					      $target = $(target);

					if($target.length > 0) {
						$target.SGNWindow().open();
					}
				});
			});
		}
	});

	return this;
}(window, document, jQuery));
