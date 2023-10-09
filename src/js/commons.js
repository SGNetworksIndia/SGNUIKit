/*
 * Copyright (c) 2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

SUKR(function() {
	const $listGroups = $(".list-group"),
	      $listViews  = $(".list-view"),
	      $buttons    = $(".btn"),
	      $codes      = $("code");

	if($listGroups.length > 0) {
		$listGroups.each(function() {
			const $this     = $(this),
			      $lgParent = $this.parent();

			if(!$lgParent.hasClass("sgn-list-group-container")) {
				$lgParent.addClass("sgn-list-group-container");
			}
		});
	}
	if($listViews.length > 0) {
		$listViews.each(function() {
			const $this     = $(this),
			      $lvParent = $this.parent();

			if(!$lvParent.hasClass("sgn-list-view-container")) {
				$lvParent.addClass("sgn-list-view-container");
			}
		});
	}
	if($buttons.length > 0) {
		$buttons.each(function() {
			const $this = $(this);

			if(!$this.hasClass("no-waves-effect") && !$this.hasClass("waves-effect")) {
				$this.addClass("waves-effect");
			}
		});
	}
	if($codes.length > 0) {
		$codes.each(function() {
			const $this = $(this);
			let $pre     = $this.parent('pre'),
			    $copyBtn = $pre.children('.copy-btn');

			if($pre.length < 1) {
				$this.wrapAll(`<pre/>`);
				$pre = $this.parent('pre');

				if($this.hasClass("inline")) {
					$pre.addClass('inline');
					$this.removeClass('inline');
				}
			}

			if($this.hasClass("can-copy") || $this.hasClass("copyable") || $pre.hasClass("can-copy") || $pre.hasClass("copyable")) {
				if(!$pre.hasClass("can-copy")) {
					$pre.addClass("can-copy");
				}
				const copyBtnHTML = `<button class="btn copy-btn"><i class="fas fa-clone"></i></button>`;
				if($copyBtn.length < 1) {
					$pre.append(copyBtnHTML);
					$copyBtn = $pre.children(".copy-btn");
				}

				const onClick = $this.attr('onclick');
				if(onClick !== undefined && onClick !== null) {
					$this.terminate('click').removeAttr('onclick');
					const handler = onClick.replace('this', 'code');
					const func = new Function('code', `return ${handler}`);
					$copyBtn.on('click', function(e) {
						e.preventDefault();
						const $_this = $(this);
						$_this.showButtonSpinner();
						func($this[0]);
						$_this.showButtonDone();
						setTimeout(() => $_this.hideButtonDone(), 2000);
					});
				} else {
					$copyBtn.on("click", function(e) {
						e.preventDefault();
						const $_this = $(this);
						$_this.showButtonSpinner();

						copyToClipboard($this[0], (isCopied, result) => {
							if(isCopied) {
								$_this.showButtonDone();
								setTimeout(() => $_this.hideButtonDone(), 2000);
							} else {
								$_this.showButtonFailed();
								setTimeout(() => $_this.hideButtonFailed(), 2000);
							}
						});
					});
				}
			}
		});
	}
});
