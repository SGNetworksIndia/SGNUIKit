/*
 * Copyright (c) 2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict"; // Start of use strict
if(typeof jQuery === "undefined") {
	throw new Error("SGNFullPage requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	/***
	 *
	 * @param {jQuery | HTMLElement} $fullpage
	 * @param {{scroll_speed: number, transition_speed: number, default_page: number, delta_threshold: number, page_indicator: boolean, slider_indicator: boolean, scroll_indicator: boolean, onSectionChanged: function, onSlideChanged: function}} [options={}]
	 *
	 * @return {SGNFullPage}
	 *
	 * @constructor
	 */
	const SGNFullPage = function($fullpage, options = {}) {
		const plugin = this;
		const _defaults = {
			'scroll_indicator': true,
			'page_indicator': true,
			'slider_indicator': true,
			'delta_threshold': 1,
			'scroll_speed': 1000,
			'transition_speed': 1000,
			'default_page': 1,
			'onSectionChanged': null,
			'onSlideChanged': null,
		};
		plugin.settings = {};
		const $body     = $('body'),
		      $sgnatom  = $body.children('.sgn-atom-container'),
		      $main     = ($sgnatom.length > 0) ? $sgnatom.children('main') : $body.children('main'),
		      $sections = $($fullpage).children('.section, section');
		let maxPages, currentPage, currentSlide;
		let $pageNav, $slideNav;
		let isSlideActive = false, slideDown = false, slideUp = false, allowPageUp = true, allowPageDown = true;
		let isPageScrolling = false;

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

		const init = (rebind = true) => {
			$.extend(plugin.settings, _defaults, options);

			destroy();

			if(!$body.hasClass('sgn-fullpage-active'))
				$body.addClass('sgn-fullpage-active');

			maxPages = $sections.length;

			const defaultPage = plugin.settings.default_page;
			currentPage = ($.isNumeric(defaultPage) && defaultPage > 0 && defaultPage <= maxPages) ? defaultPage : 1;
			plugin.settings.default_page = currentPage;

			if(maxPages > 0) {
				let navLinksHTML;
				$sections.each(function(i) {
					const j        = (i + 1),
					      $this    = $(this),
					      $section = $this,
					      $slides  = $this.children('.slide');

					const activeClass = (j === plugin.settings.default_page) ? 'active' : '',
					      id          = $this.attr('id') || 'sgn-fp-page-' + GUID(),
					      title       = $this.attr('title') || `Page-${j}`;

					$this.attr({'id': id, 'title': title});

					if(j === plugin.settings.default_page && !$this.hasClass('active'))
						$this.addClass('active');

					const navLinkTitleHTML = `<span class="sr-only">${title}</span>`,
					      navLinkHTML      = `<li class="${activeClass}"><a href="#${id}">${navLinkTitleHTML}<i></i></a></li>`;

					if(navLinksHTML === undefined)
						navLinksHTML = navLinkHTML;
					else
						navLinksHTML += navLinkHTML;

					$slides.each(function(i) {
						const j     = (i + 1),
						      $this = $(this);
						const currentSlide = 1;
						const id    = $this.attr('id') || 'sgn-fp-slide-' + GUID(),
						      title = $this.attr('title') || `Slide-${j}`;

						$this.attr({'id': id, 'title': title});

						if(j === currentSlide && !$this.hasClass('active'))
							$this.addClass('active');

						if(!$section.hasClass('sgn-fp-slides'))
							$section.addClass('sgn-fp-slides');
					});
				});

				const navHTML = (navLinksHTML !== undefined) ? `<ul class="sgn-fp-nav page-nav nav-right">${navLinksHTML}</ul>` : undefined;

				if(navHTML !== undefined) {
					$body.append(navHTML);
					$pageNav = $body.children('.sgn-fp-nav.page-nav');
				}

				if(rebind)
					bindEvents();
			}
		};

		const initSlides = ($section, $slides) => {
			let slideNavLinksHTML;

			$slides.each(function(i) {
				const j     = (i + 1),
				      $this = $(this);
				const $activeSlide = $section.children('.slide.active');
				const activeSlideIndex = ($activeSlide.length > 0) ? $activeSlide.index() : 1;
				currentSlide = activeSlideIndex + 1;

				const activeClass = (j === currentSlide) ? 'active' : '',
				      id          = $this.attr('id') || 'sgn-fp-slide-' + GUID(),
				      title       = $this.attr('title') || `Slide-${j}`;

				const slideNavLinkTitleHTML = `<span class="sr-only">${title}</span>`,
				      slideNavLinkHTML      = `<li class="${activeClass}"><a href="#${id}">${slideNavLinkTitleHTML}<i></i></a></li>`;

				if(slideNavLinksHTML === undefined)
					slideNavLinksHTML = slideNavLinkHTML;
				else
					slideNavLinksHTML += slideNavLinkHTML;
			});

			const slideNavHTML = (slideNavLinksHTML !== undefined) ? `<ul class="sgn-fp-nav slide-nav nav-bottom">${slideNavLinksHTML}</ul>` : undefined;

			if($slideNav !== undefined && $slideNav.length > 0)
				$slideNav.remove();

			if(slideNavHTML !== undefined && ($slideNav === undefined || $slideNav.length <= 0)) {
				$body.append(slideNavHTML);
				$slideNav = $body.children('.sgn-fp-nav.slide-nav').fadeOut(0).fadeIn(plugin.settings.transition_speed);
			}

			if(!$section.hasClass('sgn-fp-slides'))
				$section.addClass('sgn-fp-slides');

			bindEvents.bindSlideScroll($section, $slides).bindSlideNavEvent();
		};

		const destroy = () => {
			isSlideActive = slideUp = slideDown = false;
			allowPageUp = allowPageDown = true;
			if($slideNav !== undefined && $slideNav.length > 0) {
				$slideNav.fadeOut(plugin.settings.transition_speed, () => {
					if($slideNav !== undefined && $slideNav.length > 0)
						$slideNav.remove();
					$slideNav = undefined;
				});
			}
			if($pageNav !== undefined && $pageNav.length > 0) {
				$pageNav.fadeOut(plugin.settings.transition_speed, () => {
					if($pageNav !== undefined && $pageNav.length > 0)
						$pageNav.remove();
					$pageNav = undefined;
				});
			}
			$body.removeClass('sgn-fullpage-active');
		};

		const bindEvents = () => {
			bindEvents.bindSlideScroll = ($section, $slides) => {
				const maxSlides = $slides.length;
				currentSlide = ($.isNumeric(currentSlide)) ? currentSlide : 1;

				allowPageUp = ($section.prev('section, .section').length > 0);
				allowPageDown = ($section.next('section, .section').length > 0);
				if(currentSlide === maxSlides) {
					slideUp = true;
					allowPageUp = false;
					slideDown = ($section.next('section, .section').length > 0);
					allowPageDown = true;
				} else if(currentSlide === 1) {
					slideDown = true;
					allowPageDown = false;
					slideUp = ($section.prev('section, .section').length > 0);
					allowPageUp = true;
				} else {
					slideUp = slideUp = true;
					allowPageUp = allowPageDown = false;
				}

				isSlideActive = (slideUp || slideDown);

				$section.off('wheel', 'sgn-fp-slide-scroll');
				$section.on('wheel', function(e) {
					e.preventDefault();
					const prevSlide = currentSlide;

					if(!isSlideActive || isPageScrolling)
						return;

					if(currentSlide === maxSlides) {
						slideUp = true;
						allowPageUp = false;
						slideDown = ($section.next('section, .section').length > 0);
						allowPageDown = true;
						$(document).on('wheel', 'sgn-fp-page-scroll');
					} else if(currentSlide === 1) {
						slideDown = true;
						allowPageDown = false;
						slideUp = ($section.prev('section, .section').length > 0);
						allowPageUp = true;
						$(document).on('wheel', 'sgn-fp-page-scroll');
					} else {
						slideUp = slideUp = true;
						allowPageUp = allowPageDown = false;
						$(document).off('wheel', 'sgn-fp-page-scroll');
					}

					isSlideActive = (slideUp || slideDown);

					let t, i, delay = false;

					if(delay) return;

					delay = true;
					setTimeout(() => delay = false, 200);

					const wd = e.wheelDelta || -e.detail;
					let wheelYPositive;
					if(wd < 0) {
						wheelYPositive = true;
						for(i = 0; i < maxSlides; i++) {
							t = $slides[i].getClientRects()[0].left;
							if(t >= plugin.settings.delta_threshold)
								break;
						}
					} else {
						wheelYPositive = false;
						for(i = maxSlides - 1; i >= 0; i--) {
							t = $slides[i].getClientRects()[0].left;
							if(t <= -plugin.settings.delta_threshold)
								break;
						}
					}

					if(!slideDown && wheelYPositive)
						return;
					else if(!slideUp && !wheelYPositive)
						return;

					if(i >= 0 && i < maxSlides) {
						isPageScrolling = true;
						$slides.removeClass('active');

						const slide  = $slides[i],
						      $slide = $(slide);
						const distance = slide.offsetLeft;

						$section.stop().val(0).animate({
							scrollLeft: distance
						}, plugin.settings.scroll_speed, function() {
							const $this = $(this);
							currentSlide = (i + 1);
							//$this.data('current-slide', currentSlide);

							allowPageUp = ($section.prev('section, .section').length > 0);
							allowPageDown = ($section.next('section, .section').length > 0);

							if(currentSlide === maxSlides) {
								slideUp = true;
								allowPageUp = false;
								slideDown = ($section.next('section, .section').length > 0);
								allowPageDown = true;
								$(document).on('wheel', 'sgn-fp-page-scroll');
							} else if(currentSlide === 1) {
								slideDown = true;
								allowPageDown = false;
								slideUp = ($section.prev('section, .section').length > 0);
								allowPageUp = true;
								$(document).on('wheel', 'sgn-fp-page-scroll');
							} else {
								slideUp = slideUp = true;
								allowPageUp = allowPageDown = false;
								$(document).off('wheel', 'sgn-fp-page-scroll');
							}

							isSlideActive = (slideUp || slideDown);
							//console.log(isSlideActive, slideDown, slideUp, wheelYPositive);

							$slideNav.children('li').removeClass('active');
							$($slideNav.children('li')[i]).addClass('active');
							$slide.addClass('active');

							isPageScrolling = false;

							if(typeof plugin.settings.onSlideChanged === 'function')
								plugin.settings.onSlideChanged(currentSlide, prevSlide, currentPage);
						});
					}
				}, 'sgn-fp-slide-scroll');

				return bindEvents;
			}

			const bindPageScroll = () => {
				$(document).on('wheel', function(e) {
					e.preventDefault();
					const target  = e.target,
					      $target = $(target);

					let t, i, delay = false;

					if(delay)
						return;

					delay = true;
					setTimeout(() => delay = false, 200);

					if($body.hasClass('sgn-fullpage-active')) {
						const prevPage = currentPage;

						if(isPageScrolling)
							return;

						if(!isSlideActive) {
							allowPageUp = allowPageDown = true;
						}

						if($pageNav === undefined || $pageNav.length < 1)
							init();

						const wd = e.wheelDelta || -e.detail;
						let wheelYPositive;
						if(wd < 0) {
							wheelYPositive = true;
							for(i = 0; i < $sections.length; i++) {
								t = $sections[i].getClientRects()[0].top;
								if(t >= plugin.settings.delta_threshold)
									break;
							}
						} else {
							wheelYPositive = false;
							for(i = $sections.length - 1; i >= 0; i--) {
								t = $sections[i].getClientRects()[0].top;
								if(t <= -plugin.settings.delta_threshold)
									break;
							}
						}

						if(!allowPageDown && wheelYPositive)
							return;
						else if(!allowPageUp && !wheelYPositive)
							return;

						if(i >= 0 && i < $sections.length) {
							$sections.removeClass('active');

							const section  = $sections[i],
							      $section = $(section);
							const distance = section.offsetTop;

							isPageScrolling = true;
							$main.stop().val(0).animate({
								scrollTop: distance
							}, plugin.settings.scroll_speed, function() {
								const $this = $(this);
								currentPage = (i + 1);
								if($pageNav !== undefined && $pageNav.length > 0) {
									$pageNav.children('li').removeClass('active');
									$($pageNav.children('li')[i]).addClass('active');
								}
								$section.addClass('active');

								const $slides = $section.children('.slide');
								if($slides.length > 0) {
									initSlides($section, $slides);
								} else {
									isSlideActive = slideUp = slideDown = false;
									allowPageUp = allowPageDown = true;
									if($slideNav !== undefined && $slideNav.length > 0) {
										$slideNav.fadeOut(plugin.settings.transition_speed, () => {
											$slideNav.remove();
											$slideNav = undefined;
										});
									}
								}

								isPageScrolling = false;

								if(typeof plugin.settings.onSectionChanged === 'function')
									plugin.settings.onSectionChanged(currentPage, prevPage);
							});
						} else {
							destroy();
						}
					} else {
						if($target.parents().hasClass('sgn-fullpage'))
							init(false);
					}
				}, 'sgn-fp-page-scroll');
			};

			bindEvents.bindPageNavEvent = ($nav) => {
				$pageNav = $pageNav || $nav;
				if($pageNav !== undefined && $pageNav.length > 0) {
					const $lists = $pageNav.children('li');
					$lists.children('a').on('click', function() {
						//e.preventDefault();
						const $this = $(this),
						      $li   = $this.parent('li'),
						      nth   = $li.index();
						currentPage = (nth + 1);

						const $currentPage = $($sections[nth]);

						$lists.removeClass('active');
						$li.addClass('active');

						$sections.removeClass('active');
						$currentPage.addClass('active');

						const $slides = $currentPage.children('.slide');
						if($slides.length > 0) {
							initSlides($currentPage, $slides);
						} else {
							isSlideActive = slideUp = slideDown = false;
							allowPageUp = allowPageDown = true;
							if($slideNav !== undefined && $slideNav.length > 0) {
								$slideNav.fadeOut(plugin.settings.transition_speed, () => {
									$slideNav.remove();
									$slideNav = undefined;
								});
							}
						}
					});
				}

				return bindEvents;
			};

			bindEvents.bindSlideNavEvent = ($nav) => {
				$slideNav = $slideNav || $nav;
				if($slideNav !== undefined && $slideNav.length > 0) {
					const $lists = $slideNav.children('li');
					$lists.children('a').on('click', function() {
						//e.preventDefault();
						const $this = $(this),
						      $li   = $this.parent('li'),
						      nth   = $li.index();
						currentSlide = (nth + 1);

						const $currentPage  = $($sections[currentPage]),
						      $slides       = $currentPage.children('.slide'),
						      $currentSlide = $($slides[nth]);

						$lists.removeClass('active');
						$li.addClass('active');

						$slides.removeClass('active');
						$currentSlide.addClass('active');
					});
				}

				return bindEvents;
			};

			const bindNavigationEvents = () => {
				bindEvents.bindPageNavEvent();
				bindEvents.bindSlideNavEvent();

				return bindEvents;
			};

			bindPageScroll();
			bindNavigationEvents();
		};

		init();

		return plugin;
	};

	/***
	 * Creates a <b>SGNFullPage</b> object with the supplied options.
	 * @param {{scroll_speed: number, transition_speed: number, default_page: number, delta_threshold: number, page_indicator: boolean, slider_indicator: boolean, scroll_indicator: boolean, onSectionChanged: function, onSlideChanged: function}} [options]
	 *
	 * @return {jQuery}
	 *
	 * @constructor
	 */
	$.fn.SGNFullPage = function(options = {
		'scroll_indicator': true,
		'page_indicator': true,
		'slider_indicator': true,
		'delta_threshold': 1,
		'scroll_speed': 1000,
		'transition_speed': 1000,
		'default_page': 1,
		'onSectionChanged': null,
		'onSlideChanged': null,
	}) {
		const _this  = this,
		      $_this = $(_this);

		return $_this.each(function() {
			const $this = $(this),
			      data  = $this.data("SGNFullPage");

			const plugin = (data === undefined) ? new SGNFullPage($this, options) : data;
			$this.data("SGNFullPage", plugin);
			$this[0]["SGNFullPage"] = plugin;
		});
	};

	SUKR(() => {
		const $fullpages = $(".sgn-fullpage");

		if($fullpages.length > 0) {
			$fullpages.each(function() {
				const $this = $(this);
				$this.SGNFullPage();
			});
		}
	});

	return this;
})(window, document, jQuery);
