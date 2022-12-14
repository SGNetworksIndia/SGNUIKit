/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict"; // Start of use strict
if(typeof jQuery === "undefined") {
	throw new Error("SGNCodeSnippet requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	/**
	 *
	 * @param $elem{jQuery}
	 * @returns {SGNCodeSnippet}
	 * @constructor
	 */
	const SGNCodeSnippet = function($elem) {
		const plugin = this;
		const langTitles = {
			"html": "HTML",
			"css": "CSS",
			"js": "JavaScript",
			"php": "PHP",
			"sql": "SQL",
			"c": "C",
			"cpp": "C++",
			"asp": "ASP",
			"aspx": "ASP.NET",
			"ruby": "Ruby",
			"perl": "Perl",
			"python": "Python",
			"xml": "XML",
		};

		function init() {
			const title    = $elem.attr("sgn-snippet-title") || $elem.attr("data-snippet-title") || "Code Snippet",
			      langAttr = $elem.attr("sgn-snippet-lang") || $elem.attr("data-snippet-lang") || "html",
			      lang     = langAttr.toLowerCase();
			const langTitle = langTitles[lang] || "HTML";

			$elem.removeClass("sgn-code-snippet");
			$elem.removeAttr("sgn-snippet-title").removeAttr("data-snippet-lang").removeAttr("sgn-snippet-lang").removeAttr("data-snippet-lang");

			const $html = $elem.get(0).outerHTML,
			      code  = $html.toHtmlEntities();

			let html;
			html = `<div class="tab-layout bottom sgn-code-snippet-wrapper">\n`;
			html += (!empty(title)) ? `	<div class="tab-title">${title}</div>` : ``;
			html += `	<div class="tab-view">\n`;
			html += `		<div class="tab sgn-code-snippet-preview" data-tab="1">\n`;
			html += `			${$html}`;
			html += `		</div>\n`;
			html += `		<div class="tab sgn-code-snippet-code" data-tab="2">\n`;
			html += `			<pre class="language-${lang} line-numbers" data-type="${lang}"><code class="language-${lang}">${code}</code></pre>`;
			html += `		</div>\n`;
			html += `	</div>\n`;
			html += `	<div class="tab-links">\n`;
			html += `		<a class="tab-link" data-target-tab="1">Preview</a>\n`;
			html += `		<a class="tab-link" data-target-tab="2">${langTitle}</a>\n`;
			html += `	</div>\n`;
			html += `</div>\n`;

			$elem.replaceWith(html);
			Prism.highlightAll();
		}

		plugin.show = (duration) => {
			duration = (duration !== true && !$.isNumeric(duration)) ? undefined : duration;
			duration = (duration !== true && !$.isNumeric(duration) && duration === undefined) ? 5000 : duration;
			duration = (duration === true) ? null : duration;

			if($snackbar.length <= 0)
				init();
			else {
				if(!$snackbar.hasClass("show"))
					$snackbar.addClass("show");
			}

			if(duration !== null) {
				setTimeout(function() {
					plugin.hide();
				}, duration);
			}
		};

		plugin.hide = () => {
			if($snackbar.length > 0) {
				if($snackbar.hasClass("show"))
					$snackbar.removeClass("show");
			}
		};

		init();

		return plugin;
	};

	/**
	 * Creates a SGNCodeSnippet block
	 */
	$.fn.SGNCodeSnippet = function() {
		const _this  = this,
		      $_this = $(_this);

		$_this.each(function() {
			const $this = $(this),
			      data  = $this.data("SGNCodeSnippet");
			const plugin = (data === undefined) ? new SGNCodeSnippet($this) : data;
			$this.data("SGNCodeSnippet", plugin);

			$this[0]["SGNCodeSnippet"] = plugin;
		});

		/**
		 * Show a built snackbar
		 */
		_this.show = function() {
			const plugin = $_this.data("SGNCodeSnippet");
			plugin.show();

			return _this;
		};

		/**
		 * Hide a snackbar
		 */
		_this.hide = function() {
			const plugin = $_this.data("SGNCodeSnippet");
			plugin.hide();

			return _this;
		};

		return _this;
	};

	$(function() {
		const $snippets = $(".sgn-code-snippet");
		$snippets.SGNCodeSnippet();
	});

	return this;
})(window, document, jQuery);
