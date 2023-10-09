/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
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

		const fixIndents = (input, tabs = 1) => {
			const tab = '\t';
			const indents = input.match(/^[^\S\n\r]*(?=\S)/gm);
			const t = tab.repeat(tabs);

			if(indents[0] === '')
				indents.splice(0, 1);

			if(!indents || !indents[0]) {
				return input;
			}

			indents.sort(function(a, b) { return a.length - b.length; });

			if(!indents[0].length) {
				return input;
			}

			let s = input.replace(RegExp('^' + indents[0], 'gm'), '');
			return s.replace(RegExp(`^${tab}`, 'gm'), t);
		};

		function init() {
			let $snippet           = $elem,
			    isMultipleSnippets = ($elem.hasClass('sgn-code-snippets'));

			if(isMultipleSnippets) {
				$snippet = $elem.children('.sgn-code-snippet');
			}

			const title = $elem.attr("sgn-snippet-title") || $elem.attr("data-snippet-title") || "Code Snippet";

			let snippetCodeTab = '', snippetCodeTabLink = '', $previewHTML = '', previewTab;

			if(isMultipleSnippets) {
				previewTab = 0;
				$previewHTML = $snippet.first().outerHTML;

				$snippet.each(function(i) {
					const $this = $(this),
					      t     = (i + 1);

					const langAttr   = $this.attr("sgn-snippet-lang") || $this.attr("data-snippet-lang") || "html",
					      previewTab = ($this.attr("sgn-snippet-preview-tab") || $this.attr("data-snippet-preview-tab")) || false,
					      lang       = langAttr.toLowerCase();
					const langTitle = langTitles[lang] || "HTML";

					$this.removeClass("sgn-code-snippet");
					$this.removeAttr("sgn-snippet-title").removeAttr("data-snippet-lang").removeAttr("sgn-snippet-lang").removeAttr("data-snippet-lang").removeAttr("sgn-snippet-preview-tab").removeAttr("data-snippet-preview-tab");

					const $html = (previewTab) ? $this.get(0).outerHTML : $this.get(0).innerHTML,
					      code  = fixIndents($html.toHtmlEntities());

					$previewHTML = (previewTab) ? $this.get(0).outerHTML : $previewHTML;

					snippetCodeTab += `		<div class="tab sgn-code-snippet-code" data-tab="${t}">\n`;
					snippetCodeTab += `			<pre class="language-${lang} line-numbers" data-type="${lang}"><code class="language-${lang}">${code}</code></pre>`;
					snippetCodeTab += `		</div>\n`;

					snippetCodeTabLink += `		<a class="tab-link" data-target-tab="${t}">${langTitle}</a>\n`;
				});
			} else {
				previewTab = 1;
				const langAttr = $snippet.attr("sgn-snippet-lang") || $snippet.attr("data-snippet-lang") || "html",
				      lang     = langAttr.toLowerCase();
				const langTitle = langTitles[lang] || "HTML";

				$snippet.removeClass("sgn-code-snippet");
				$snippet.removeAttr("sgn-snippet-title").removeAttr("data-snippet-lang").removeAttr("sgn-snippet-lang").removeAttr("data-snippet-lang");

				const $html = $snippet.get(0).outerHTML,
				      code  = fixIndents($html.toHtmlEntities());

				$previewHTML = $html;

				snippetCodeTab += `		<div class="tab sgn-code-snippet-code" data-tab="2">\n`;
				snippetCodeTab += `			<pre class="language-${lang} line-numbers" data-type="${lang}"><code class="language-${lang}">${code}</code></pre>`;
				snippetCodeTab += `		</div>\n`;

				snippetCodeTabLink += `		<a class="tab-link" data-target-tab="2">${langTitle}</a>\n`;
			}

			let html;
			html = `<div class="tab-layout bottom sgn-code-snippet-wrapper">\n`;
			html += (!empty(title)) ? `	<div class="tab-title">${title}</div>` : ``;
			html += `	<div class="tab-view">\n`;
			html += `		<div class="tab sgn-code-snippet-preview" data-tab="${previewTab}">\n`;
			html += `			${$previewHTML}`;
			html += `		</div>\n`;
			html += snippetCodeTab;
			html += `	</div>\n`;
			html += `	<div class="tab-links">\n`;
			html += `		<a class="tab-link" data-target-tab="${previewTab}">Preview</a>\n`;
			html += snippetCodeTabLink;
			html += `	</div>\n`;
			html += `</div>\n`;

			if(isMultipleSnippets)
				$elem.replaceWith(html);
			else
				$snippet.replaceWith(html);
			$('.tab-layout').SGNTabLayout();
			Prism.highlightAll();

			$elem.data("SGNCodeSnippet", plugin);
			$elem[0]["SGNCodeSnippet"] = plugin;
		}

		if($elem.length > 0 && ($elem.hasClass('sgn-code-snippets') || $elem.hasClass('sgn-code-snippet')))
			init();
		else
			throw new Error(`[SGNCodeSnippet] Failed to initialize SGNCodeSnippet: Invalid DOM element supplied.`);

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
			let isMultipleSnippets = $_this.parent().hasClass('sgn-code-snippets');

			if(!isMultipleSnippets) {
				const plugin = (data === undefined) ? new SGNCodeSnippet($this) : data;
				$this.data("SGNCodeSnippet", plugin);

				$this[0]["SGNCodeSnippet"] = plugin;
			} else {
				if($_this.hasClass('sgn-code-snippets')) {
					const plugin = (data === undefined) ? new SGNCodeSnippet($this) : data;
					$this.data("SGNCodeSnippet", plugin);

					$this[0]["SGNCodeSnippet"] = plugin;
				}
			}
		});

		return _this;
	};

	SUKR(() => {
		const $snippets = $(".sgn-code-snippets, .sgn-code-snippet");
		$snippets.SGNCodeSnippet();
	});

	return this;
})(window, document, jQuery);
