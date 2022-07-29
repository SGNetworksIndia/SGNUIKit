/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

if(typeof jQuery === "undefined") {
	throw new Error("SGNSidebar requires jQuery");
}

;(function(window, document, $) {
	$.fn.SGNSidebar = function() {
		const _this = this;

		_this.config = {
			//Which button should trigger the open/close event
			toggleBtnSelector: "[data-toggle='sidebar']",
			//The sidebar selector
			selector: ".sgn-sidebar",
			//Enable slide over content
			slide: true,
			keys: {
				'sidebarStatus': 'sgn-sidebar-status'
			},
			values: {
				'sidebarStatus': {
					'open': 'open',
					'close': 'close',
					'min': 'collapsed'
				}
			}
		}

		const $_this = $(this);

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
			//element.style.fontSize = '12.8px';
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

		const init = (o) => {
			const $toggler = $(o.toggleBtnSelector);
			$toggler.data("open-width", $_this.outerWidth());
			$toggler.data("close-width", 60);
			$_this.data("topbarWidth", $_this.outerWidth());
			$_this.data("mainWidth", $("body > main").outerWidth());


			$_this.find('a').each(function() {
				const $this     = $(this),
					  urlParsed = parse_url($this.attr('href')),
					  url       = urlParsed.scheme + '://' + urlParsed.host + urlParsed.path;
				let curParsedURL = parse_url(window.location.href),
					curURL       = curParsedURL.scheme + '://' + curParsedURL.host + curParsedURL.path;

				if(url === curURL) {
					const $ul = $this.parents('ul'),
						  $li = $this.parents('li');
					$_this.find('ul.active, li.active, a.active').removeClass('active');
					if($li.hasClass('dropdown')) {
						$li.children('a').addClass('active');
						$li.addClass('active');
						$ul.addClass('active');
					} else {
						$li.addClass('active');
					}
				}

				//Listen to the click event
				$toggler.on('click', function(e) {
					e.preventDefault();
					_this.toggle(o.slide);
				});
				if(localStorage.getItem(_this.config.keys.sidebarStatus) === _this.config.values.sidebarStatus.open)
					_this.open(o.slide);
				else if(localStorage.getItem(_this.config.keys.sidebarStatus) === _this.config.values.sidebarStatus.min)
					_this.close(o.slide);


				let containerWidth = ($this.width()),
					$text          = $this.children('span:nth-child(2)'),
					textWidth      = getTextWidth($text.text()),
					boxWidth       = ($this.children('span:nth-child(1)').width() + $text.width() + $this.children('span:nth-child(3)').width());

				boxWidth = (boxWidth - textWidth);

				if(textWidth > (boxWidth + 16)) {
					const speed        = 2,
						  timePerPixel = 0.2;
					let distance, duration;
					/*
					Time = Distance / Speed
					Speed = Distance / Time
					Duration = Speed * Distance
					 */
					distance = uint((textWidth) / (boxWidth + 16));
					duration = uint(speed * distance);
					duration = Math.round(duration);

					$text.marquee();
					$text.addClass('has-marquee');

					/*setTimeout(() => {
						$text.children('.sgn-marquee-wrapper').children('.sgn-marquee').attr('style', `animation: marquee-left ${duration}s linear infinite`);
					}, 10);*/
				}
			});
		}

		_this.open = (slide) => {
			const $toggler = $(_this.config.toggleBtnSelector);
			//Slide over content
			$_this.addClass('sidebar-open');
			//Push the content by adding the open class to the body instead
			//of the sidebar itself
			$('body').addClass('sidebar-open');
			$toggler.addClass('close');
			$_this.data('isOpen', true);
			localStorage.setItem(_this.config.keys.sidebarStatus, _this.config.values.sidebarStatus.open);
		}

		_this.close = (slide) => {
			const $toggler = $(_this.config.toggleBtnSelector);
			$_this.removeClass('sidebar-open');
			$('body').removeClass('sidebar-open');
			$toggler.removeClass('close');
			$_this.data('isOpen', false);
			localStorage.setItem(_this.config.keys.sidebarStatus, _this.config.values.sidebarStatus.min);
		}

		_this.toggle = (slide) => {
			//Get the object
			const _this = this;

			//If the sidebar is not open
			if(!isOpen($_this)) {
				//Open the sidebar
				_this.open($_this, slide);
			} else {
				_this.close($_this, slide);
			}
		}

		const isOpen = () => {
			return ($_this.hasClass('sidebar-open') || $('body').hasClass('sidebar-open'));
		}

		init(_this.config);
	};

	$(document).ready(function() {
		const $sidebars = $('.sgn-sidebar');
		$sidebars.SGNSidebar();
	});
})(window, document, jQuery);